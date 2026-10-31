# API движка engine2 и декораций (сгенерировано tools/gen_refs.py — не править руками)

Сигнатуры и комментарии. Перед вызовом незнакомой функции — `grep -n "function имя" <файл>` и прочитать 5–10 строк.

## hf/engine2/engine.js
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

## hf/engine2/props.js
- `lightmap(amb, fn)`
- `radial(x, y, r, col, a = 1)`
- `cone(x0, y0, x1, y1, w, col, a = 1)` — луч фонарика
- `glowAdd(x, y, r, col, a = 1)`
- `clockP(x, y, r, h, m, sec)`
- `clicheFrame(x, y, s, t)` — «котик с блюдечком» в рамке на стене (клише)
- `hallway(t, o = {})`
- `litterFront(o = {})`
- `cork()` — пробковая доска
- `card(x, y, w, h, rot, seed, col = '#f6f1e4')`
- `kittenCut(x, y, s, t)` — котёнок-вырезка (большая голова, маленькое тело)
- `scissors(x, y, s, t, o = {})` — лактаза: ножницы с глазами
- `cube(x, y, s, seed, col = '#fbfaf5')`
- `sugarPair(x, y, s, split, seed)` — лактоза: два кубика на скотче; split — разрезаны
- `bacterium(x, y, s, t, seed, chew = true)`
- `drop(x, y, s, seed)`
- `bubble(x, y, r, seed)`
- `gutBoard(t, o = {})` — разрез живота: розовая бумажная кишка петлями
- `roofInsert(t, k)` — «все коты орут в три ночи»
- `sepiaPhoto(x, y, s, rot, t, o = {})` — «деревня»: старое фото-коллаж
- `villageCat(lick)` — кот сбоку тянется к ведру (сепия)
- `tv(x, y, s, t, seed, o = {})` — телевизор с клише-котиком
- `personIcon(x, y, s, col, seed)`
- `stampX(x, y, s, k)`
- `check(x, y, s, k)`
- `glassP(x, y, s, fill, o = {})`
- `cartonP(x, y, s, rot = 0)`
- `polaroid(x, y, s, rot, t, label)` — «вчера»: голова Тома в стакане
- `diploma(x, y, s, rot, tear)` — «диетолог» — рвётся пополам
- `phoneCut(x, y, s, rot, o = {})` — телефон-вырезка покрупнее; o.dead, o.rice, o.drip, o.screen(fn)
- `moneyStack(x, y, s, t, t0)`

## hf/engine2/common.js
- `Wd(k, i)`
- `ex(t, list, d = 0.08)`
- `ck(t, K)`
- `talk(who, t)`
- `shakeAt(t)`
- `slideIn(u, fn)` — вставка «въезжает» карточкой
- `bg(col, seed = 2999)`
- `label(x, y, s, w, col = '#f4e6a8', rot = 0.03, size = 46)`
- `slam(word, t, t0, seed, y = 330, size = 150, rot = -0.04)`
- `shotAt(t)`
- `frame(t)`
- `hudFrame(t)`
- `post(t, o)`

## hf/engine2/chars.js
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

# Декорации и вставки серий (копировать и менять, а не писать с нуля)

## hf/episodes/ep02/set.js — Эп. 2 «Телефоны нас слушают?» — декорация (гостиная ночью) и вставки-коллажи.
- `livingRoom(t, o = {})`
- `sofaBack()`
- `sofaFront()`
- `bigPhone(x, y, s, rot, fn)` — крупный телефон-вырезка, fn рисует экран (0..520 × 0..980)
- `catFoodBag(x, y, s)`
- `adScreen(t, k)`
- `searchCard(x, y, s, t, t0)` — история поиска «три раза»
- `appGrid(t, t0, mic)` — «17 000+ приложений» и микрофон с нулём
- `recScreen(t)` — телефон пишет экран: REC и «позорная» лента
- `threadBoard(t, cues)` — «доска заговора» наоборот: красные нитки к Никите
- `brainInsert(t, c1, c2)`
- `newspaper(x, y, s, rot, t, stampT)`
- `moneyStack(x, y, s, t, t0)`

## hf/episodes/ep03/set.js — Эп. 3 «Телефон в рис?» — декорация (кухня днём) и вставки-коллажи.
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

## hf/episodes/ep04/set.js — Эп. 4 «Подписки — развод?» — декорация (комната Никиты вечером, стол с лампой) и вставки-коллажи.
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

## hf/episodes/ep05/set.js — Эп. 5 «Табачный заговор?» — декорация (балкон на закате) и вставки-коллажи.
- `balcony(t)`
- `pack(x, y, s, rot)` — закрытая пачка в руке (без сигарет на виду)
- `vapeBox(x, y, s, rot)` — коробка от вейпа (не само устройство)
- `cig(x, y, s, rot, t, lit = true)` — сигарета + дымок
- `smoke(x, y, t, n, seed = 5110)`
- `vape(x, y, s, rot)`
- `cough(x, y, t, t0)`
- `frankAd(t, c)` — «Откровенное заявление курильщикам», 1954
- `memo(t, c)` — «Сомнение — наш продукт», 1969
- `ceos(t, c)` — семь глав компаний под присягой, 1994
- `court(t, c)` — «США против Philip Morris», 2006: закон против мафии
- `juul(t, c)` — хозяин «Мальборо» → Juul: $12,8 млрд за 35 %

## hf/episodes/ep06/set.js — Эп. 6 «Кот тобой манипулирует?» — декорация (спальня в 5 утра) и вставки-коллажи.
- `bedroom(t, o = {})`
- `foodBag(x, y, s, rot)` — пакет корма в руке
- `dawnLight(fn)`
- `spectro(t, c)` — «спектрограмма»: в мурчании пик ~380 Гц
- `babyCut(x, y, s)`
- `cryInsert(t, c)` — мурчание ≈ плач младенца; 50 слушателей: «срочно»
- `meowChart(t, c)` — кому коты мяукают
- `loopInsert(t, c)` — круг дрессировки: мурчу → встаёшь → корм → снова мурчу

## hf/episodes/ep07/set.js — Эп. 7 «Курицу моют?» — декорация (кухня вечером, раковина) и вставки-коллажи.
- `kitchen7(t, o = {})`
- `microbes(t, k, pts, seed = 7100)` — «УФ-микробы»: светящиеся зелёные пятна
- `chicken(x, y, s, rot)` — сырая курица-вырезка
- `nightLight(fn)`
- `usdaInsert(t, c)` — 60 % — бактерии в раковине
- `saladInsert(t, c)` — 26 % — в салате; брызги летят далеко
- `seventhInsert(t, c)` — каждая седьмая раковина — с бактериями даже после мытья
- `tips7(t, c)`
- `handsInsert(t, c)` — 31 % — даже без мытья курицы, руками

## hf/episodes/ep08/set.js — Эп. 8 «Лампочный заговор?» — декорация (подъезд, лампа под потолком) и вставки-коллажи.
- `stairwell(t, o = {})`
- `bulbP(x, y, s, lit, seed = 8070)` — лампа накаливания-вырезка; lit 0..1
- `stairLight(lit, fn)`
- `phoebusCard(t, c)` — картель «Фебус», Женева, 1924
- `labInsert(t, c)` — лаборатория в Швейцарии: кто дольше 1000 ч — штраф
- `centennial(t, c)` — Ливермор: лампа горит с 1901 года
- `appleInsert(t, c)` — иск о замедлении старых айфонов, 2020

## hf/episodes/ep09/set.js — Эп. 9 «Почему мы терпим?» — декорация (ванная вечером, протечка с потолка в ведро, Том на стиральной машине) и вставки-коллажи.
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

