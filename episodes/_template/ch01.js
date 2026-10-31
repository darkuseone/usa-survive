/* Глава 1 — холодное начало: катастрофа уже идёт + вопрос эпизода. Склейки — на ударные слова (LN.<ключ>.start, Wd()). */
SHOTS.push([0, 'cold'], [LN.a002.start - 0.05, 'hostA'], [CUE.fact1 - 0.05, 'fact1']);
Object.assign(SH, {
  cold(t) { const [cx, cy, z] = ck(t, [[0, 960, 560, 1.0], [LN.a002.start, 1000, 580, 1.1]]); cam(cx, cy, z, 0, shakeAt(t)); scene(t, {}, { mood: 'dread' }); pop(); },
  hostA(t) { cam(HP.x + 60, HP.y + 120, 2.0); scene(t, { lid: 0.4 }, { mood: 'dread' }); pop(); },
  fact1(t, u) { cam(W / 2, H / 2, 1); slideIn(u, () => fact1(t, CUE.fact1)); pop(); }
});
