import './style.css';

/* =========================================
   НАСТРОЙКИ (КОНФИГУРАЦИЯ)
   Измените данные здесь под вашего человека
========================================= */
const CONFIG = {
  heroName: "Мама,", // Имя с запятой или без
  heroAge: 42, // Возраст
  letterText: `Мамочка, мы хотим сказать тебе кое-что важное.
Ты — сердце нашей семьи. Всё тепло, которое есть в нашем доме — это ты.
Спасибо за твои объятия, за твои руки, за то, что ты всегда рядом — и в радости, и в трудный момент.
Мы видим, как много ты делаешь для нас каждый день, и знаем — ты делаешь это с любовью.
Пусть этот день будет только твоим. Пусть сегодня ты почувствуешь всё то тепло, которое ты дарила нам все эти годы.
Мы тебя любим. Очень. Всегда.`,
  letterSign: "Твоя семья 🧡",
  reasons: [
    "...ты всегда веришь в нас, даже когда мы сами не верим",
    "...твои объятия лечат любой тяжёлый день",
    "...ты научила нас быть добрыми и сильными",
    "...рядом с тобой любой дом становится тёплым",
    "...ты умеешь радоваться мелочам и учишь этому нас",
    "...твоя забота безгранична, хоть ты и не просишь ничего взамен",
    "...ты самый честный и надёжный человек в нашей жизни",
    "...ты — наша мама. И этим уже сказано всё 🧡"
  ]
};


/* ПРЕЛОАДЕР */
let p = 0;
const pctEl = document.getElementById('pct');
const loader = document.getElementById('loader');

// Быстро добегаем до 90%
const tick = setInterval(() => {
  p += Math.random() * 5;
  if (p >= 90) {
    p = 90;
    clearInterval(tick);
  }
  pctEl.textContent = Math.floor(p) + '%';
}, 120);

// Как только все тяжелые ресурсы загружены, добиваем до 100% и прячем
window.addEventListener('load', () => {
  clearInterval(tick);
  pctEl.textContent = '100%';
  setTimeout(() => loader.classList.add('gone'), 500);
});

/* БАГ #10 ИСПРАВЛЕН: конфиг применяется ДО reveal(), чтобы data-text был уже заполнен */
document.getElementById('heroName').dataset.text = CONFIG.heroName;
document.getElementById('heroAge').textContent = CONFIG.heroAge;
document.getElementById('letterSign').textContent = CONFIG.letterSign;

/* АНИМИРОВАННОЕ ПИСЬМО — рендер параграфов из CONFIG */
const letterBody = document.getElementById('letterBody');
const letterSignEl = document.getElementById('letterSign');
const letterLines = CONFIG.letterText.split('\n').filter(l => l.trim());

// Добавляем контейнер для сердечек
const heartsContainer = document.createElement('div');
heartsContainer.className = 'letter-hearts';
document.querySelector('.letter').appendChild(heartsContainer);

// Рендерим параграфы
letterLines.forEach((line, i) => {
  const p = document.createElement('p');
  p.className = 'letter-line' + (i === letterLines.length - 1 ? ' finale' : '');
  p.textContent = line.trim();
  letterBody.appendChild(p);
});

// Запускаем сердечки
function spawnHearts() {
  const hearts = ['🧡', '💛', '💕', '💗', '❤️'];
  for (let i = 0; i < 6; i++) {
    const h = document.createElement('span');
    h.className = 'letter-heart';
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = (10 + Math.random() * 80) + '%';
    const dur = 3 + Math.random() * 3;
    h.style.animation = `heartFloat ${dur}s ease-in forwards`;
    h.style.animationDelay = (i * 0.4) + 's';
    heartsContainer.appendChild(h);
    setTimeout(() => h.remove(), (dur + i * 0.4 + 0.5) * 1000);
  }
}

// Анимируем параграфы когда секция входит в экран
const letterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const lines = letterBody.querySelectorAll('.letter-line');
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add('visible'), 200 + i * 250);
    });
    // Подпись появляется после всех параграфов
    setTimeout(() => {
      letterSignEl.classList.add('visible');
      spawnHearts();
    }, 200 + lines.length * 250 + 300);
    letterObs.unobserve(entry.target);
  });
}, { threshold: 0.2 });
letterObs.observe(document.getElementById('letterSection'));

/* ПОСИМВОЛЬНЫЙ ТЕКСТ (после применения конфига) */
document.querySelectorAll('.reveal').forEach(el => {
  const t = el.dataset.text || el.textContent; 
  el.textContent = '';
  [...t].forEach((ch, i) => {
    const s = document.createElement('span');
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    s.style.animationDelay = (.3 + i * .06) + 's';
    el.appendChild(s);
  });
});

/* ПОЯВЛЕНИЕ СЕКЦИЙ */
const io = new IntersectionObserver(e => e.forEach(x => {
  if (x.isIntersecting) x.target.classList.add('in')
}), { threshold: .15 });
document.querySelectorAll('section').forEach(s => io.observe(s));

/* СТАРТ */
document.getElementById('startBtn').addEventListener('click', startCard);

function startCard() {
  document.getElementById('intro').classList.add('hide');
  boom();
  const a = document.getElementById('bgm');
  a.play().then(() => document.getElementById('musicBtn').classList.add('play')).catch(() => {});
}

/* МУЗЫКА */
const musicBtn = document.getElementById('musicBtn');
musicBtn.addEventListener('click', toggleMusic);

function toggleMusic() {
  const a = document.getElementById('bgm');
  if (a.paused) {
    a.play();
    musicBtn.classList.add('play');
  } else {
    a.pause();
    musicBtn.classList.remove('play');
  }
}

/* МЫ ТЕБЯ ЛЮБИМ ЗА ТО... */
let ri = 0;
const card = document.getElementById('loveCard');
const reasonEl = document.getElementById('loveReason');
const progEl = document.getElementById('loveProg');
const peekLeft = document.getElementById('peekLeft');
const peekRight = document.getElementById('peekRight');

// Фото для секции "Мы тебя любим" (10 штук, чередуются)
const lovePics = [
  '/love1.jpg',
  '/love2.jpg',
  '/love3.jpg',
  '/love4.jpg',
  '/love5.jpg',
  '/love6.jpg',
  '/love7.jpg',
  '/love8.jpg',
  '/love9.jpg',
  '/love10.jpg',
];
let peekTimer = null;

function showPeek(index) {
  // Выбираем две разные фотки для левой и правой стороны
  const leftSrc = lovePics[index % lovePics.length];
  const rightSrc = lovePics[(index + 2) % lovePics.length];

  peekLeft.src = leftSrc;
  peekRight.src = rightSrc;

  // Убираем старые, если были
  clearTimeout(peekTimer);
  peekLeft.classList.remove('visible');
  peekRight.classList.remove('visible');

  // Небольшая задержка чтобы transition сработал после смены src
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      peekLeft.classList.add('visible');
      peekRight.classList.add('visible');
    });
  });

  // Через 1.8 сек прячем
  peekTimer = setTimeout(() => {
    peekLeft.classList.remove('visible');
    peekRight.classList.remove('visible');
  }, 1800);
}

// Инициализация первой причины
reasonEl.textContent = CONFIG.reasons[0];
progEl.textContent = `1 / ${CONFIG.reasons.length}`;

document.getElementById('nextReasonBtn').addEventListener('click', nextReason);

function nextReason() {
  card.classList.add('swap');
  setTimeout(() => {
    ri = (ri + 1) % CONFIG.reasons.length;
    reasonEl.textContent = CONFIG.reasons[ri];
    progEl.textContent = (ri + 1) + ' / ' + CONFIG.reasons.length;
    card.classList.remove('swap');
    showPeek(ri);
  }, 350);
}

/* ШАРИКИ */
const stage = document.getElementById('stage');
const balloonColors = ['#ff3d8b', '#ff8a3d', '#7b5cff', '#23e6c8', '#ffd23d'];
let spawned = 0, popped = 0, balloonTimer = null, started = false;
const TOTAL = 8;

function balloonSVG(c) {
  return '<svg viewBox="0 0 64 80"><ellipse cx="32" cy="30" rx="28" ry="32" fill="' + c + '"/>'
    + '<ellipse cx="24" cy="20" rx="7" ry="10" fill="rgba(255,255,255,.4)"/>'
    + '<polygon points="32,60 27,68 37,68" fill="' + c + '"/>'
    + '<line x1="32" y1="68" x2="32" y2="80" stroke="rgba(255,255,255,.5)" stroke-width="1.5"/></svg>';
}

function spawnBalloon() {
  if (spawned >= TOTAL) { clearInterval(balloonTimer); return; }
  spawned++;
  const b = document.createElement('div');
  b.className = 'balloon';
  b.setAttribute('role', 'button');
  b.setAttribute('tabindex', '0');
  b.setAttribute('aria-label', 'Лопнуть шарик');
  
  const c = balloonColors[Math.floor(Math.random() * balloonColors.length)];
  b.innerHTML = balloonSVG(c);
  const bw = window.innerWidth < 600 ? 52 : 64;
  const maxX = Math.max(stage.clientWidth - bw - 8, 8);
  b.style.left = (8 + Math.random() * maxX) + 'px';
  const dur = 6 + Math.random() * 3;
  const rise = stage.clientHeight + 150;
  b.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-' + rise + 'px)' }], { duration: dur * 1000, easing: 'linear', fill: 'forwards' });
  setTimeout(() => { if (b.parentNode) b.remove() }, dur * 1000);
  
  b.addEventListener('click', () => popBalloon(b, c));
  b.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') popBalloon(b, c) });
  
  stage.appendChild(b);
}

function popBalloon(b, c) {
  popped++; burstAt(b.getBoundingClientRect(), c); b.remove();
  if (popped >= TOTAL) {
    document.getElementById('hint').innerHTML = `
      <div style="z-index:2;padding:20px 16px;display:flex;flex-direction:column;align-items:center;gap:16px;">
        <img src="/family.jpg" alt="Наша семья" style="width:min(320px,85%);border-radius:20px;box-shadow:0 16px 48px rgba(0,0,0,.55);border:3px solid rgba(255,255,255,.2);animation:popAge .6s cubic-bezier(.2,1.4,.3,1) both">
        <div class="big" style="font-size:clamp(20px,5vw,32px)">Ты лучшая мама на свете 🧡</div>
        <div style="font-family:'Manrope',sans-serif;font-size:clamp(16px,3vw,22px);opacity:.9;font-weight:600;">Мы тебя очень любим!</div>
      </div>`;
    boom();
  }
}

function startBalloons() {
  if (started) return; started = true;
  document.getElementById('hint').querySelector('.big').textContent = 'Лови их! 🎈';
  balloonTimer = setInterval(spawnBalloon, 750);
}
new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) startBalloons() }), { threshold: .4 }).observe(stage);

/* ТОРТ / СВЕЧИ */
let blown = false;
const cakeEl = document.getElementById('cake');
cakeEl.addEventListener('click', blowCandles);
cakeEl.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') blowCandles() });

function blowCandles() {
  if (blown) return; blown = true;
  document.querySelectorAll('#cakeSvg .flame').forEach((f, i) => {
    setTimeout(() => { f.style.transition = 'opacity .25s, transform .25s'; f.style.opacity = '0'; f.style.transform = 'translateY(-8px) scale(.5)'; }, i * 180);
  });
  setTimeout(() => { document.getElementById('cakeStatus').textContent = 'Желание загадано! Пусть сбудется 🌟'; boom(); }, 900);
}

/* КОНФЕТТИ */
document.getElementById('boomBtn').addEventListener('click', boom);

const cv = document.getElementById('confetti'), ctx = cv.getContext('2d');
let parts = [];

function resizeCanvas() { cv.width = innerWidth; cv.height = innerHeight }
resizeCanvas();

// Throttling resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeCanvas, 200);
});

const cols = ['#ff3d8b', '#ff8a3d', '#7b5cff', '#23e6c8', '#ffd23d'];

function spawn(x, y, n) {
  for (let i = 0; i < n; i++) parts.push({
    x, y, vx: (Math.random() - .5) * 14, vy: (Math.random() - .5) * 14 - 4,
    g: .25, size: Math.random() * 8 + 4, c: cols[i % cols.length], rot: Math.random() * 6, vr: (Math.random() - .5) * .3, life: 120
  });
}

function boom() { spawn(innerWidth / 2, innerHeight / 2, 160); }

function burstAt(r, c) {
  for (let i = 0; i < 26; i++) parts.push({
    x: r.left + r.width / 2, y: r.top + r.height / 2,
    vx: (Math.random() - .5) * 9, vy: (Math.random() - .5) * 9, g: .22, size: Math.random() * 7 + 3, c, rot: Math.random() * 6, vr: (Math.random() - .5) * .3, life: 80
  });
}

function loop() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  parts.forEach(p => {
    p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(p.life / 120, 0);
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .6); ctx.restore();
  });
  parts = parts.filter(p => p.life > 0 && p.y < cv.height + 40);
  requestAnimationFrame(loop);
}
loop();

/* ===== ВИДЕО — показать сообщение после просмотра ===== */
const mainVideo = document.getElementById('mainVideo');
const videoMsg = document.getElementById('videoMsg');
const secondVideoBox = document.getElementById('secondVideoBox');
// БАГ #3 ИСПРАВЛЕН: флаг предотвращает множественные запуски boom()
let videoMsgShown = false;
if (mainVideo) {
  const showVideoMsg = () => {
    if (videoMsgShown) return;
    videoMsgShown = true;
    videoMsg.classList.add('show');
    // Показываем второе видео с небольшой задержкой после сообщения
    setTimeout(() => secondVideoBox?.classList.add('visible'), 600);
    boom();
  };
  mainVideo.addEventListener('ended', showVideoMsg);
  mainVideo.addEventListener('timeupdate', () => {
    if (mainVideo.duration && mainVideo.currentTime / mainVideo.duration > 0.8) showVideoMsg();
  });
}

/* ===== ГАЛЕРЕЯ ВОСПОМИНАНИЙ (masonry + lazy-load + lightbox) ===== */
const galleryPhotos = [
  '/photo_1_2026-06-10_01-41-07.jpg',
  '/photo_2_2026-06-10_01-41-07.jpg',
  '/photo_3_2026-06-10_01-41-07.jpg',
  '/photo_4_2026-06-10_01-41-07.jpg',
  '/photo_5_2026-06-10_01-41-07.jpg',
  '/photo_6_2026-06-10_01-41-07.jpg',
  '/photo_8_2026-06-10_01-41-07.jpg',
  '/photo_9_2026-06-10_01-41-07.jpg',
  '/photo_10_2026-06-10_01-41-07.jpg',
  '/photo_11_2026-06-10_01-41-07.jpg',
  '/photo_12_2026-06-10_01-41-07.jpg',
  '/photo_13_2026-06-10_01-41-07.jpg',
  '/photo_14_2026-06-10_01-41-07.jpg',
  '/photo_15_2026-06-10_01-41-07.jpg',
  '/photo_16_2026-06-10_01-41-07.jpg',
  '/photo_17_2026-06-10_01-41-07.jpg',
  '/photo_18_2026-06-10_01-41-07.jpg',
  '/photo_19_2026-06-10_01-41-07.jpg',
  '/photo_20_2026-06-10_01-41-07.jpg',
  '/photo_21_2026-06-10_01-41-07.jpg',
  '/photo_22_2026-06-10_01-41-07.jpg',
  '/photo_23_2026-06-10_01-41-07.jpg',
  '/photo_24_2026-06-10_01-41-07.jpg',
  '/photo_25_2026-06-10_01-41-07.jpg',
  '/photo_26_2026-06-10_01-41-07.jpg',
  '/photo_27_2026-06-10_01-41-07.jpg',
  '/photo_28_2026-06-10_01-41-07.jpg',
  '/photo_29_2026-06-10_01-41-07.jpg',
  '/photo_30_2026-06-10_01-41-07.jpg',
  '/photo_31_2026-06-10_01-41-07.jpg',
  '/photo_32_2026-06-10_01-41-07.jpg',
  '/photo_33_2026-06-10_01-41-07.jpg',
  '/photo_34_2026-06-10_01-41-07.jpg',
  '/photo_35_2026-06-10_01-41-07.jpg',
  '/photo_36_2026-06-10_01-41-07.jpg',
  '/photo_37_2026-06-10_01-41-07.jpg',
  '/photo_38_2026-06-10_01-41-07.jpg',
  '/photo_39_2026-06-10_01-41-07.jpg',
  '/photo_40_2026-06-10_01-41-07.jpg',
  '/photo_41_2026-06-10_01-41-07.jpg',
  '/photo_42_2026-06-10_01-41-07.jpg',
  '/photo_43_2026-06-10_01-41-07.jpg',
  '/photo_44_2026-06-10_01-41-07.jpg',
  '/photo_45_2026-06-10_01-41-07.jpg',
  '/photo_46_2026-06-10_01-41-07.jpg',
  '/photo_47_2026-06-10_01-41-07.jpg',
  '/photo_48_2026-06-10_01-41-07.jpg',
  '/photo_49_2026-06-10_01-41-07.jpg',
  '/photo_50_2026-06-10_01-41-07.jpg',
  '/photo_51_2026-06-10_01-41-07.jpg',
  '/photo_52_2026-06-10_01-41-07.jpg',
  '/photo_53_2026-06-10_01-41-07.jpg',
  '/photo_54_2026-06-10_01-41-07.jpg',
  '/photo_55_2026-06-10_01-41-07.jpg',
  '/photo_56_2026-06-10_01-41-07.jpg',
  '/photo_57_2026-06-10_01-41-07.jpg',
  '/photo_58_2026-06-10_01-41-07.jpg',
  '/photo_59_2026-06-10_01-41-07.jpg',
  '/photo_60_2026-06-10_01-41-07.jpg',
  '/photo_61_2026-06-10_01-41-07.jpg',
  '/photo_62_2026-06-10_01-41-07.jpg',
  '/photo_63_2026-06-10_01-41-07.jpg',
  '/photo_64_2026-06-10_01-41-07.jpg',
  '/photo_65_2026-06-10_01-41-07.jpg',
  '/photo_66_2026-06-10_01-41-07.jpg',
  '/photo_67_2026-06-10_01-41-07.jpg',
  '/photo_68_2026-06-10_01-41-07.jpg',
  '/photo_69_2026-06-10_01-41-07.jpg',
  '/photo_70_2026-06-10_01-41-07.jpg',
  '/photo_71_2026-06-10_01-41-07.jpg',
  '/photo_72_2026-06-10_01-41-07.jpg',
  '/photo_73_2026-06-10_01-41-07.jpg',
  '/photo_74_2026-06-10_01-41-08.jpg',
  '/photo_75_2026-06-10_01-41-08.jpg',
  '/photo_76_2026-06-10_01-41-08.jpg',
  '/photo_77_2026-06-10_01-41-08.jpg',
  '/photo_78_2026-06-10_01-41-08.jpg',
  '/photo_79_2026-06-10_01-41-08.jpg',
  '/photo_80_2026-06-10_01-41-08.jpg',
  '/photo_81_2026-06-10_01-41-08.jpg',
  '/photo_82_2026-06-10_01-41-08.jpg',
  '/photo_83_2026-06-10_01-41-08.jpg',
  '/photo_84_2026-06-10_01-41-08.jpg',
  '/photo_85_2026-06-10_01-41-08.jpg',
  '/photo_86_2026-06-10_01-41-08.jpg',
  '/photo_87_2026-06-10_01-41-08.jpg',
  '/photo_88_2026-06-10_01-41-08.jpg',
  '/photo_89_2026-06-10_01-41-08.jpg',
  '/photo_90_2026-06-10_01-41-08.jpg',
  '/photo_91_2026-06-10_01-41-08.jpg',
  '/photo_92_2026-06-10_01-41-08.jpg',
  '/photo_93_2026-06-10_01-41-08.jpg',
  '/photo_94_2026-06-10_01-41-08.jpg',
  '/photo_95_2026-06-10_01-41-08.jpg',
  '/photo_96_2026-06-10_01-41-08.jpg',
  '/photo_97_2026-06-10_01-41-08.jpg',
  '/photo_98_2026-06-10_01-41-08.jpg',
  '/photo_99_2026-06-10_01-41-08.jpg',
  '/photo_100_2026-06-10_01-41-08.jpg',
  '/IMG_0776.JPG',
  '/IMG_0936.JPG',
  '/IMG_1087.JPG',
  '/IMG_1693.JPG',
  '/IMG_2096.JPG',
  '/IMG_2106.JPG',
  '/IMG_2131.JPG',
  '/IMG_2171.JPG',
  '/IMG_2252.JPG',
  '/IMG_2338.JPG',
  '/IMG_2481.JPG',
  '/IMG_3144.JPG',
  '/IMG_3199.JPG',
  '/IMG_3529.JPG',
  '/IMG_5112.JPG',
  '/IMG_6559.JPG',
  '/IMG_8178.JPG',
  '/IMG_9494.JPG',
  '/IMG_9512.JPG',
  '/IMG_9560.JPG',
  '/IMG_9585.JPG',
  '/VUEQ2070.JPG',
  // --- папка dr2 ---
  '/dr2_photo_2026-06-10_02-32-48.jpg',
  '/dr2_photo_2026-06-10_02-32-59.jpg',
  '/dr2_photo_2026-06-10_02-33-05.jpg',
  '/dr2_photo_2026-06-10_02-33-10.jpg',
  '/dr2_photo_2026-06-10_02-33-14.jpg',
  '/dr2_photo_2026-06-10_02-33-17.jpg',
  '/dr2_photo_2026-06-10_02-33-21.jpg',
  '/dr2_photo_2026-06-10_02-33-25.jpg',
  '/dr2_photo_2026-06-10_02-33-29.jpg',
  '/dr2_photo_2026-06-10_02-33-33.jpg',
  '/dr2_photo_2026-06-10_02-33-36.jpg',
  '/dr2_photo_2026-06-10_02-33-39.jpg',
  '/dr2_photo_2026-06-10_02-33-43.jpg',
  '/dr2_photo_2026-06-10_02-33-47.jpg',
  '/dr2_photo_2026-06-10_02-33-52.jpg',
  '/dr2_photo_2026-06-10_02-33-56.jpg',
  // IMG_6021.JPG (8 МБ) и IMG_6080.JPG (9.7 МБ) исключены — слишком тяжёлые для мобильного
];

// БАГ #14 ИСПРАВЛЕН: перемешиваем галерею для живого ощущения
for (let i = galleryPhotos.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [galleryPhotos[i], galleryPhotos[j]] = [galleryPhotos[j], galleryPhotos[i]];
}

const BATCH = 16; // сколько фото показывать за раз
let shownCount = 0;
let lightboxIndex = 0;
const galleryEl = document.getElementById('masonryGallery');
const counterEl = document.getElementById('galleryCounter');
const loadMoreBtn = document.getElementById('loadMoreBtn');

function updateCounter() {
  counterEl.textContent = `Показано ${Math.min(shownCount, galleryPhotos.length)} из ${galleryPhotos.length} фото`;
}

function addPhotoBatch() {
  const end = Math.min(shownCount + BATCH, galleryPhotos.length);
  for (let i = shownCount; i < end; i++) {
    const item = document.createElement('div');
    item.className = 'm-item';
    item.dataset.idx = i;
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = 'Воспоминание';
    img.dataset.src = galleryPhotos[i];
    // lazy observer
    lazyObserver.observe(img);
    item.appendChild(img);
    item.addEventListener('click', () => openLightbox(parseInt(item.dataset.idx)));
    galleryEl.appendChild(item);
  }
  shownCount = end;
  updateCounter();
  if (shownCount >= galleryPhotos.length) {
    loadMoreBtn.style.display = 'none';
  }
}

// Lazy load images
const lazyObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const img = e.target;
      img.src = img.dataset.src;
      img.onload = () => img.classList.add('loaded');
      img.onerror = () => img.closest('.m-item')?.remove();
      lazyObserver.unobserve(img);
    }
  });
}, { rootMargin: '200px' });

// Инициализация первой партии
addPhotoBatch();
loadMoreBtn.addEventListener('click', addPhotoBatch);

/* ===== ЛАЙТБОКС ===== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');

function openLightbox(idx) {
  lightboxIndex = idx;
  lightboxImg.src = galleryPhotos[idx];
  lightboxCounter.textContent = `${idx + 1} / ${galleryPhotos.length}`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxGo(dir) {
  lightboxIndex = (lightboxIndex + dir + galleryPhotos.length) % galleryPhotos.length;
  const spinner = document.getElementById('lightboxSpinner');
  lightboxImg.style.opacity = '0';
  // БАГ #4 ИСПРАВЛЕН: спиннер + правильная обработка кэша через .complete
  setTimeout(() => {
    spinner.classList.add('visible');
    const newSrc = galleryPhotos[lightboxIndex];
    lightboxImg.src = newSrc;
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${galleryPhotos.length}`;
    const done = () => {
      spinner.classList.remove('visible');
      lightboxImg.style.opacity = '1';
    };
    if (lightboxImg.complete && lightboxImg.naturalWidth > 0) {
      done(); // уже в кэше
    } else {
      lightboxImg.onload = done;
      lightboxImg.onerror = done;
    }
  }, 150);
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => lightboxGo(-1));
document.getElementById('lightboxNext').addEventListener('click', () => lightboxGo(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

// Клавиатура
window.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowRight') lightboxGo(1);
  if (e.key === 'ArrowLeft') lightboxGo(-1);
  if (e.key === 'Escape') closeLightbox();
});

// Свайп на мобильном
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) lightboxGo(dx < 0 ? 1 : -1);
});

