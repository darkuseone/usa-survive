import React from "react";
import { Composition } from "remotion";
import { BridgeShort, BRIDGE_FRAMES } from "./videos/bridge/Bridge";
import { GasShort, GAS_FRAMES } from "./videos/gas/Gas";

export const Root: React.FC = () => (
  <>
    {/* версия B шортса S3 «Shutter» (наш сюжет, Joe и зомби) */}
    <Composition id="GasShort" component={GasShort} durationInFrames={GAS_FRAMES} fps={30} width={1080} height={1920} />
    {/* пример из репозитория claude-animated-shorts (для сверки движка) */}
    <Composition id="BridgeShort" component={BridgeShort} durationInFrames={BRIDGE_FRAMES} fps={30} width={1080} height={1920} />
  </>
);
