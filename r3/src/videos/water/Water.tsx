// Шортс S2 в стиле B: мир заправки (gas/world.ts, подсобка), раскадровка story.ts, надписи — kit/overlay.
import React from "react";
import { GasWorld } from "../gas/world";
import { makeShort } from "../../kit/short";
import { Word, DayTag, FactCard, Captions, EndCard, W } from "../../kit/overlay";
import { STORY, T, S } from "./story";
import { WORDS } from "./data";

export const WATER_FRAMES = STORY.TOTAL;
const FPS = 30;

const Overlay: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, si = STORY.shotAt(t), [a0, name] = STORY.SHOT_LIST[si], u = t - a0;
  const els: React.ReactNode[] = [];
  if (t < 3.6) {
    const a = 1 - Math.max(0, Math.min(1, (t - 3.3) / 0.3));
    els.push(<g key="hook" opacity={a}><Word s="40 GALLONS." y={420} size={128} t={t} t0={0.05} life={9} /><Word s="1 MISTAKE." y={570} size={150} t={t} t0={0.4} life={9} col="#ffd21f" rot={2} /></g>);
  }
  els.push(<FactCard key="fema" t={t} t0={T.fema - 0.05} t1={T.heater + 0.75} head="READY.GOV" lines={["HIDDEN WATER SOURCE:", "YOUR WATER HEATER"]} src="Source: FEMA / Ready.gov — Water" y={470} />);
  els.push(<Word key="40" s="40 GAL" y={500} size={170} t={t} t0={T.forty} life={1.9} col="#ffd21f" />);
  els.push(<Word key="weeks" s="WEEKS MORE" y={1560} size={120} t={t} t0={T.clean + 0.7} life={1.4} />);
  els.push(<Word key="never" s="NEVER PUT BACK" y={470} size={110} t={t} t0={T.never - 0.05} life={1.3} col="#ff5a4a" />);
  els.push(<Word key="3am" s="3:00 AM" y={520} size={130} t={t} t0={T.am3} life={1.6} />);
  els.push(<Word key="sound" s="SOUND" y={470} size={140} t={t} t0={T.sound - 0.05} life={1.3} col="#ffd21f" />);
  els.push(<Word key="pump4" s="PUMP 4" y={470} size={140} t={t} t0={T.four - 0.1} life={0.9} />);
  [T.bang + 0.05, T.wall + 0.05].forEach((b, i) => els.push(<Word key={"bang" + i} s="BANG!" x={W / 2 - 120 + i * 240} y={520 + i * 120} size={120} t={t} t0={b} life={0.8} rot={i ? 6 : -6} col="#ffd21f" />));
  els.push(<Word key="slam" s="SLAM!" y={500} size={140} t={t} t0={T.slam} life={0.9} />);
  if (name !== "end") {
    const night = t < S.day || t >= S.night;
    els.push(<DayTag key="day" n={19} clock={night ? "03:00 AM" : "02:10 PM"} />);
    els.push(<Captions key="sub" t={t} words={WORDS} />);
  } else els.push(<EndCard key="end" u={u} t={t} t0={a0} l1="WHO ELSE" l2="HEARD IT?" />);
  return <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>{els}</svg>;
};

export const WaterShort = makeShort({ world: (s) => new GasWorld(s), frameAt: STORY.frameAt, Overlay });
