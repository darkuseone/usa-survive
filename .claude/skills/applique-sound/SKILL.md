---
name: applique-sound
description: Аудиодизайн «Аппликации» — голоса ElevenLabs (английский), проверка озвучки whisper, выравнивание громкости реплик, синтезированная музыка (groove, pluck, tension, night, stop, endsting, stings) и шумы (slam, pop, whoosh, siren, geiger, rumble, drips…), уровни и мастеринг под YouTube, sound.json. Использовать при озвучке, сборке звука и правках звука.
---

# Звук «Аппликации»

## Голос
- `episodes/<эп>/script.json`: `{"title", "lang": "en", "model": "eleven_v4", "fps": 24, "head": 0.3, "tail": 1.5, "gap": 0.15, "tempo": {"<говорящий>": 1.05}, "voices": {"<говорящий>": {"voice_id": "…", "settings": {"stability": 0.4, "similarity_boost": 0.8, "style": 0.3, "speed": 1.0}}}, "lines": [{"key": "a001", "speaker": "mac", "text": "Субтитры.", "tts": "[calm, dry] Text for TTS.", "after": 0.15}]}`. Образец формата — `reference/tom-nikita/episodes/ep09/script.json`.
- Голоса выбрать с владельцем (ElevenLabs Voice Library, американский английский; у каждого героя — свой тембр). **Голоса владельца NIKITA, NIKITA2, Cartman не трогать.** Ключ — `ELEVENLABS_API_KEY`, не печатать.
- Теги эмоций в `tts`: `[whispers]`, `[shouting]`, `[sarcastic]`, `[panicked]`, `[deadpan]`, `[tired]`… После озвучки — `LANG_STT=en .venv/bin/python -I pipeline/transcribe.py episodes/<эп>/vo/*.mp3`: теги не прочитаны вслух, слова на месте. Плохую реплику — `python3 pipeline/tts.py episodes/<эп> a017`.
- `pipeline/voice_v2.py`: темп по говорящему, сжатие длинных пауз внутри реплики, склейка с `after`, тайминги слов (faster-whisper, язык `lang`), виземы Rhubarb, **выравнивание громкости каждой реплики к −21 LUFS** (печатает «громкость, дБ»). Шёпот/нарочно тихая реплика — `"gain": -4`. Свой уровень говорящему — `"loud": {"mac": -20}`. Без выравнивания ElevenLabs даёт разброс до 10 дБ, и тихие реплики тонут на телефоне (урок «Тома и Никиты»).
- Тайминги whisper недетерминированы на ±0,02 с: после рендера `voice_v2.py` не перезапускать без нужды (иначе субтитры/метки чуть съедут) — для правки громкости хватит `make.sh … mux`.

## Музыка и шумы (`episodes/<эп>/sound.json` → `tools/sound_spec.py`, всё синтезируется — без Content ID)
```json
{"voice": "episodes/<эп>/out/voice.wav", "key": "A",
 "music": [{"type": "night", "from": 0, "to": "ch2"}, {"type": "pluck", "from": "fact1", "to": "fact1+8"}, {"type": "tension", "from": "alarm", "to": "boom"},
           {"type": "groove", "from": "ch3", "to": "ch3+40", "g": 0.06}, {"type": "stop", "at": "punch-0.2"}, {"type": "endsting", "at": "outro"}],
 "stings": ["fact1", "fact2"],
 "sfx": [["siren", "alarm", "boom"], ["rumble", "boom", "boom+3"], ["slam", "boom", 0.9], ["geiger", "rad", "rad+6"], ["pop", "card1+0.3", 0.4], ["drips", 0, ["ch2", 0.5]]],
 "levels": {"music": 0.2, "fx": 0.35}}
```
- Метки — имена из `CUE` (± сек) или числа. Тональность `key`: E, D, A, C, G.
- Музыка по смыслу: `night` — тревожный пэд + бас (ночь, ожидание, бункер); `tension` — арпеджио с бочкой и подъёмом (угроза растёт); `pluck` — щипковая «наука» (факты, инструкции); `groove` — акустический грув (быт, спокойные главы); `stop` — стоп-пластинка перед паузой панчлайна; `endsting` — финальный аккорд; `stings` — гитарный стинг на склейку со вставкой; `trombone` — грустное «вау-вау».
- Шумы: `slam` (удар/штамп), `pop` (появление), `whoosh`, `click`, `paper`, `tear`, `scratch`, `buzzer`, `bubbles`, `thud`, `bell`, `blip`, `ticks` (от, до), `hum` (от, до), `riser` (от, до), **`siren`** (от, до — гражданская оборона), **`geiger`** (от, до — счётчик Гейгера), **`rumble`** (от, до — гул взрыва/обвала), `drips` (от, [до, громк.] — капель), сэмплы `door`, `gulp`, `gurgle`, `meow` (`assets/sfx`). Новый шум — функция в `tools/sound.py` + строка в `LIB`/обработчике `sound_spec.py`.
- SFX на каждое действие в кадре; длинные подложки (`hum`, `drips`, ветер) — тихо, чтобы не утомлять за 8 минут.

## Уровни и мастер
- `tools/make.sh <эп> sound` печатает: музыка **−16…−19 LU** (в длинном ролике тише, чем в шортах), шумы **−11…−13 LU**; мастер −15 LUFS, пик −1.2 dBFS (YouTube нормирует к −14). Не попало — крутить `levels` (`music`, `fx`) и пересобирать.
- Голос нормирован по пику, музыка и шумы — от него: если голос стал ровнее (выравнивание), музыку обычно надо опустить.
- Длинный ролик: музыка не играет непрерывно — 20–60 с подложки на главу, паузы в разговорных местах, смена типа на смене главы.
- Правка только звука после рендера: `tools/make.sh <эп> mux <имя>` (части видео уже в `build/<эп>/parts`).
