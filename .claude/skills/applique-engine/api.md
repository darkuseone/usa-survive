# API движка «Аппликации» (сгенерировано tools/gen_refs.py — не править руками)

Перед вызовом незнакомой функции — `grep -n "function имя" <файл>` и прочитать 5–10 строк.

## engine/engine.js
- `rng(seed)`
- `hsh(...v)`
- `clamp(x, a = 0, b = 1)`
- `lerp(a, b, k)`
- `sm(k)`
- `eo(k)`
- `eio(k)`
- `pr(t, a, b)`
- `popK(t, t0, d = 0.3)`
- `hexA(hex, a)`
- `mix(h1, h2, k)`
- `step(t, fps = 12)` — стоп-моушен: движение ступеньками
- `push(x, y, s = 1, r = 0, fx = 1, sy = 1)`
- `pop()`
- `cam(cx, cy, z, rot = 0, shake = 0)`
- `jig(key, amt = 1)`
- `spline(cp, closed = true, n = 8)`
- `pathOf(pts, close = true)`
- `bbOf(pts)`
- `ellPts(cx, cy, rx, ry, rot = 0, n = 40)`
- `resampleN(pts, N)`
- `morphPts(A, B, k)`
- `cut(pts, seed, stepPx = 16, amt = 1.1)`
- `tube(cl, w0, w1)` — трубка по осевой (рукава, хвост, лапы)
- `piece(pts, col, o = {})`
- `blobP(cp, col, o = {})`
- `ellP(cx, cy, rx, ry, col, o = {})`
- `rectP(x, y, w, h, col, o = {})`
- `stroke(pts, col, w, o = {})` — маркер/фломастер: линия с концами-закруглениями
- `dot(x, y, r, col, a = 1)`
- `layer(fn, o = {})`
- `txt(s, x, y, size, o = {})`
- `ransom(s, x, y, size, seed, o = {})`
- `tape(x, y, w, rot, seed)`
- `pin(x, y, col = '#d8342c')`

## engine/face.js
- `mouthAt(who, t)`
- `blinkAt(t, seed)`
- `mouth(x, y, w, m, o = {})`
- `screamMouth(x, y, w, k = 1)`

## engine/props.js
- `lightmap(amb, fn)`
- `radial(x, y, r, col, a = 1)`
- `cone(x0, y0, x1, y1, w, col, a = 1)` — луч фонарика
- `glowAdd(x, y, r, col, a = 1)`
- `clockP(x, y, r, h, m, sec)`
- `cork()` — пробковая доска
- `card(x, y, w, h, rot, seed, col = '#f6f1e4')`
- `drop(x, y, s, seed)`
- `bubble(x, y, r, seed)`
- `personIcon(x, y, s, col, seed)`
- `stampX(x, y, s, k)`
- `check(x, y, s, k)`
- `glassP(x, y, s, fill, o = {})`
- `phoneCut(x, y, s, rot, o = {})` — телефон-вырезка покрупнее; o.dead, o.rice, o.drip, o.screen(fn)
- `moneyStack(x, y, s, t, t0)`

## engine/common.js
- `Wd(k, i)`
- `ex(t, list, d = 0.08)`
- `ck(t, K)`
- `talk(who, t)`
- `shakeAt(t)`
- `slideIn(u, fn)` — вставка «въезжает» карточкой
- `bg(col, seed = 2999)`
- `label(x, y, s, w, col = '#f4e6a8', rot = 0.03, size = 46)`
- `slam(word, t, t0, seed, y = H * 0.17, size = 150, rot = -0.04)`
- `shotAt(t)`
- `frame(t)`
- `hudFrame(t)`
- `post(t, o)`

## engine/chars.js
- `person(o)`
- `personLegs(o)`
- `personBody(o)`
- `glassAt(cx, cy, rg, f, o = {})`
- `personArms(o, pass = 'front')`
- `hand(pose, sd, o)`
- `personHead(o)`
- `hairdo(kind, o)`
- `personVest(col)`
- `joe(o = {})`
- `zombie(o = {})`
- `zombieMarks(o)`
- `dee(o = {})`
- `raider(o = {})`
- `zSil(x, y, s, t, seed = 0, col = '#3a4636')`

# Декорации и вставки эпизодов (копировать и менять, а не писать с нуля)

## episodes/_template/set.js — <Эпизод> — декорации (функция на локацию) и вставки (функция на факт). Образцы: episodes/demo/set.js, reference/tom-nikita/episodes/ep09/set.js.
- `location1(t, o = {})`
- `light1(fn)`
- `fact1(t, c)` — вставка-факт: карточка + цифра ransom + источник

## episodes/demo/set.js — Демо 16:9 — бункер: бетон, полки с припасами, гермодверь, лампа на проводе; вставка-факт на пробковой доске. Проверка движка, а не серия.
- `bunker(t, o = {})`
- `bunkerLight(lit, red, fn)`
- `waterCard(t, c)` — вставка-факт: FEMA — галлон воды на человека в день, запас минимум на 3 дня

## episodes/t01_gas/set.js — Тест «Paper Survivors» — ночная заправка изнутри: витрина во всю стену, за ней навес и колонки, дверь с колокольчиком, стальные жалюзи, полка со снеками, касса; вставка «кнопка LOCKDOWN».
- `outside(t, o = {})` — ночь за стеклом: небо, навес, колонки, асфальт, фигуры
- `glassWall(t, o = {})` — стекло, рамы, дверь (o.door 0..1 — открыта), колокольчик
- `shutter(k, t)` — стальные жалюзи сверху вниз, k 0..1
- `shelf(t)` — полка со снеками слева
- `counter(t, o = {})` — касса справа на переднем плане
- `store(t, o = {})` — вся декорация, кроме героев и света
- `calendar(k, t)` — листок «DAY 1» на скотче, приклеен к жалюзи
- `storeLight(o = {})` — свет: люминесцентные лампы, мигание, тревога
- `lockBtn(t, c)` — вставка: удар кулаком по кнопке LOCKDOWN
- `rainOut(t, y0, y1, a = 1)` — косой дождь на улице: штрихи меняются на «двойках» + брызги на асфальте
- `glassDrops(t)` — капли стекают по витрине
- `dust(t, cx, cy, rw, rh, n = 30)` — пылинки в свете ламп
- `boxP(x, y, s = 1)` — картонная коробка со снеками у ног
- `crate(x, y)` — упаковка бутылок воды — Joe на неё оседает (верх y − 220)
- `exterior(t, o = {})`
- `extLight(t)`
- `dayTag(t, n, o = {})`

## reference/tom-nikita/episodes/ep03/set.js — Эп. 3 «Телефон в рис?» — декорация (кухня днём) и вставки-коллажи.
- `grains(x, y, n, spread, seed, col = '#f6f1e2', sz = 1)` — рисинки-вырезки
- `jarP(x, y, s, label, fill, seed, o = {})` — банка с крупой и бумажной этикеткой
- `kitchen(t, o = {})`
- `counter(t, o = {})` — столешница, кастрюля риса, чайник
- `phoneCut(x, y, s, rot, o = {})` — телефон-вырезка покрупнее; o.dead, o.rice, o.drip, o.screen(fn)
- `appleSheet(t, c)` — «инструкция Apple»: цитата маркером
- `portMacro(t, t0)` — разъём под лупой: рисинки и крахмальная пыль
- `corrosion(t, c)` — плата: ржавчина растёт, рисинка ничего не может
- `rankTable(t, c)` — «турнир сушилок»: рис последний из семи
- `litterBag(x, y, s, rot)`
- `riceBag(x, y, s, rot)`
- `scaleInsert(t, t0)` — весы «кто сушит лучше»: наполнитель перевешивает рис
- `tapInsert(t, t0)` — шаг 1: постучать разъёмом вниз о ладонь
- `chargeInsert(t, c)` — шаг 3: не заряжать полчаса; сохнуть до суток
- `noNo(t, c)` — без фена и ваток; не помогло — в сервис

## reference/tom-nikita/episodes/ep04/set.js — Эп. 4 «Подписки — развод?» — декорация (комната Никиты вечером, стол с лампой) и вставки-коллажи.
- `room4(t, o = {})`
- `chairBack()`
- `chairFront()`
- `desk(t, o = {})` — стол, лампа, ноутбук, кружка
- `lamp4(fn)`
- `notif(x, y, s, rot, sum, seed, k = 1)` — пуш банка «Списание»
- `trialCard(t, t0, t1)` — «0 ₽» крупно, а мелкий шрифт — под лупой
- `gymInsert(t, c)` — абонемент vs разовый
- `barsInsert(t, c)` — думали $86 / на деле $219
- `cancelMaze(t, c)` — «Илиада»: окна «Вы уверены?» без конца
- `iliad(t, c)` — амфора с воином: «ИЛИАДА — 10 лет»
- `fineInsert(t, c)`
- `tipsInsert(t, c)` — три правила
- `appScreen(t, t0)` — «приложение, которое следит за подписками» — тоже подписка

## reference/tom-nikita/episodes/ep07/set.js — Эп. 7 «Курицу моют?» — декорация (кухня вечером, раковина) и вставки-коллажи.
- `kitchen7(t, o = {})`
- `microbes(t, k, pts, seed = 7100)` — «УФ-микробы»: светящиеся зелёные пятна
- `chicken(x, y, s, rot)` — сырая курица-вырезка
- `nightLight(fn)`
- `usdaInsert(t, c)` — 60 % — бактерии в раковине
- `saladInsert(t, c)` — 26 % — в салате; брызги летят далеко
- `seventhInsert(t, c)` — каждая седьмая раковина — с бактериями даже после мытья
- `tips7(t, c)`
- `handsInsert(t, c)` — 31 % — даже без мытья курицы, руками

## reference/tom-nikita/episodes/ep08/set.js — Эп. 8 «Лампочный заговор?» — декорация (подъезд, лампа под потолком) и вставки-коллажи.
- `stairwell(t, o = {})`
- `bulbP(x, y, s, lit, seed = 8070)` — лампа накаливания-вырезка; lit 0..1
- `stairLight(lit, fn)`
- `phoebusCard(t, c)` — картель «Фебус», Женева, 1924
- `labInsert(t, c)` — лаборатория в Швейцарии: кто дольше 1000 ч — штраф
- `centennial(t, c)` — Ливермор: лампа горит с 1901 года
- `appleInsert(t, c)` — иск о замедлении старых айфонов, 2020

## reference/tom-nikita/episodes/ep09/set.js — Эп. 9 «Почему мы терпим?» — декорация (ванная вечером, протечка с потолка в ведро, Том на стиральной машине) и вставки-коллажи.
- `bathroom(t, o = {})`
- `bucketP(x, y, s, fill, t, o = {})` — пластиковое ведро (низ в x,y); fill 0..1; ряби от капли, если в нём капает
- `drip(t)` — капля: формируется, падает (стоп-моушен на двойках), брызги
- `bathLight(fn)`
- `frogCut(x, y, s, rot, o = {})` — лягушка-вырезка; o.leap — прыжок (лапы вытянуты)
- `potP(x, y, s, heat, t)` — кастрюля на конфорке; heat 0..1 — пламя и пар
- `thermo(x, y, k)` — градусник 20…40°
- `mythCard(t, c)` — «лягушка варится и не замечает» — штамп МИФ
- `frogPot(t, c, o = {})` — опыт: воду греют — лягушка выбирается наружу
- `scaleIns(t, c)` — потеря весит примерно вдвое больше выгоды
- `formIns(t, c)` — пенсионный план: тебя уже записали, выйти — одна бумажка
- `barsIns(t, c)` — 37 % сами записывались → 86 % записали по умолчанию
- `dogCard(x, y, s, rot, yr, l1, l2, col, seed)` — карточка теории с собакой-вырезкой
- `helpIns(t, c, o = {})` — «беспомощности учатся» (1967) → 2016: пассивность — по умолчанию
- `brainP(x, y, s, k)` — мозг-вырезка; k — «загорелся»
- `stepIns(t, c)` — один шаг сегодня: звонок сантехнику → мозг: «от меня зависит»

# Образец персонажей (только как пример построения — в эпизодах НЕ использовать)

## reference/tom-nikita/chars.js
- `mouthAt(who, t)`
- `blinkAt(t, seed)`
- `mouth(x, y, w, m, o = {})`
- `tom(o)`
- `tomBody(o)`
- `tomPaw(o)` — поднятая правая лапа подушечками к зрителю («щас объясню»)
- `tomHead(o)`
- `nikita(o)`
- `nikLegs(o)`
- `nikBody(o)`
- `glassAt(cx, cy, rg, f, o = {})`
- `nikArms(o)`
- `hand(pose, sd, o)`
- `nikHead(o)`
- `foilHat(lift, t)` — мятая фольга конусом; lift — приподнята над головой

