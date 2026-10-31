"""Озвучка эпизода: темп по персонажу, сжатие длинных пауз внутри реплик,
склейка, тайминги слов (faster-whisper) и виземы Rhubarb для липсинка.
Язык распознавания — "lang" в script.json (по умолчанию "en").
Громкость: каждая реплика приводится к LOUD LUFS (в script.json — "loud": {"<говорящий>": −21, …});
шёпот/тихая реплика — поле "gain": -4 (дБ к цели). Тайминги и виземы считаются по исходному звуку — от громкости не зависят.

usage: python voice_v2.py <episode_dir> [out_dir = <episode_dir>/out]
Ждёт <ep>/script.json и <ep>/vo/<key>.mp3. Пишет <public>/voice.wav и <public>/timeline.json.
"""
import json, subprocess, sys, tempfile
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
RHUBARB = ROOT / "tools/bin/rhubarb/rhubarb"
SR = 44100
LOUD = -21.0   # LUFS реплики по умолчанию. ElevenLabs отдаёт реплики одного голоса с разбросом до 10 дБ — без выравнивания голос «тонет» на динамике телефона
LANG = "en"


def level(a, target):
    """Привести реплику к target LUFS (усиление −8…+12 дБ) с мягким ограничителем пиков. → (звук, дБ)"""
    import pyloudnorm as pyln
    x = a if len(a) >= SR // 2 else np.tile(a, SR // 2 // max(len(a), 1) + 1)   # pyloudnorm нужно ≥ 0,4 с
    L = pyln.Meter(SR).integrated_loudness(x)
    g = float(np.clip(target - L, -8, 12)) if np.isfinite(L) else 0.0
    y = a * 10 ** (g / 20); k = np.abs(y)
    y = np.where(k > 0.8, np.sign(y) * (0.8 + 0.2 * np.tanh((k - 0.8) / 0.2)), y).astype(np.float32)
    return y, g


def decode(path, tempo):
    out = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-af", f"atempo={tempo}",
                          "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(out, dtype=np.float32).copy()


def squeeze(a, thr_db=-42, max_pause=0.16, keep=0.1, pad=0.03):
    """Срезает тишину по краям и ужимает внутренние паузы длиннее max_pause до keep."""
    win = int(0.01 * SR)
    n = len(a) // win
    rms = np.sqrt(np.mean(a[: n * win].reshape(n, win) ** 2, axis=1) + 1e-12)
    loud = 20 * np.log10(rms) > thr_db
    idx = np.where(loud)[0]
    a = a[max(idx[0] * win - int(pad * SR), 0): min((idx[-1] + 1) * win + int(pad * SR), len(a))]
    loud = loud[idx[0]: idx[-1] + 1]
    out, i = [], 0
    while i < len(loud):
        j = i
        while j < len(loud) and loud[j] == loud[i]:
            j += 1
        seg = a[i * win: j * win]
        if not loud[i] and (j - i) * 0.01 > max_pause:
            k = int(keep * SR / 2)
            seg = np.concatenate([seg[:k], seg[-k:]])
        out.append(seg)
        i = j
    out.append(a[len(loud) * win:])
    return np.concatenate(out)


def write_wav(path, a):
    raw = Path(str(path) + ".f32")
    raw.write_bytes(a.astype(np.float32).tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", str(raw), str(path)], check=True)
    raw.unlink()


def words_of(a, model, text):
    n = int(len(a) * 16000 / SR)
    a16 = np.interp(np.linspace(0, len(a) - 1, n), np.arange(len(a)), a).astype(np.float32)
    segs, _ = model.transcribe(a16, language=LANG, word_timestamps=True)
    ws = [w for s in segs for w in s.words]
    script = text.split()
    if len(ws) == len(script):
        return [{"w": sw, "s": round(w.start, 3), "e": round(w.end, 3)} for w, sw in zip(ws, script)]
    s0, e0 = (ws[0].start, ws[-1].end) if ws else (0, len(a) / SR)
    tot = sum(len(w) + 1 for w in script)
    acc, res = 0, []
    for sw in script:
        s = s0 + (e0 - s0) * acc / tot
        acc += len(sw) + 1
        res.append({"w": sw, "s": round(s, 3), "e": round(s0 + (e0 - s0) * acc / tot, 3)})
    return res


def visemes(wav):
    r = subprocess.run([str(RHUBARB), "-r", "phonetic", "-f", "json", "-q", str(wav)], capture_output=True, text=True, check=True)
    return [{"s": c["start"], "v": c["value"]} for c in json.loads(r.stdout)["mouthCues"]]


def main(ep, pub):
    ep, pub = Path(ep), Path(pub)
    pub.mkdir(parents=True, exist_ok=True)
    cfg = json.loads((ep / "script.json").read_text())
    global LANG; LANG = cfg.get("lang", "en")
    from faster_whisper import WhisperModel
    model = WhisperModel("small", device="cpu", compute_type="int8")
    t, chunks, lines, gains = cfg["head"], [], [], []
    tmp = Path(tempfile.mkdtemp())
    for ln in cfg["lines"]:
        a = squeeze(decode(ep / "vo" / f"{ln['key']}.mp3", cfg["tempo"][ln["speaker"]]))
        write_wav(tmp / "l.wav", a)
        vis = [{"s": round(c["s"] + t, 3), "v": c["v"]} for c in visemes(tmp / "l.wav")]
        words = [{**w, "s": round(w["s"] + t, 3), "e": round(w["e"] + t, 3)} for w in words_of(a, model, ln["text"])]
        lines.append({**ln, "start": round(t, 3), "end": round(t + len(a) / SR, 3), "words": words, "visemes": vis})
        target = cfg.get("loud", {}).get(ln["speaker"], LOUD) + ln.get("gain", 0)
        lv, g = level(a, target); gains.append(f"{ln['key']}{g:+.1f}")
        chunks.append((t, lv))
        t += len(a) / SR + ln.get("after", cfg["gap"])
    total = t + cfg["tail"]
    mix = np.zeros(int(total * SR) + 1, dtype=np.float32)
    for st, a in chunks:
        i = int(st * SR)
        mix[i: i + len(a)] += a
    mix /= max(np.abs(mix).max() / 0.9, 1e-6)
    write_wav(pub / "voice.wav", mix)
    (pub / "timeline.json").write_text(json.dumps({"fps": cfg["fps"], "duration": round(total, 3), "lines": lines}, ensure_ascii=False))
    for l in lines:
        print(f"{l['key']} {l['start']:6.2f}-{l['end']:6.2f} {' '.join(w['w'] for w in l['words'])}")
    print("громкость, дБ:", " ".join(gains))
    print("total", round(total, 2))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else sys.argv[1].rstrip("/") + "/out")
