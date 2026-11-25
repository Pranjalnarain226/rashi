// ---------- Falling rose petals ----------
(function () {
  const c = document.getElementById('petals');
  const ctx = c.getContext('2d');
  let w, h, ps = [];
  const colors = ['#ff7aa8', '#ff5f8f', '#ffb3cc', '#e0457b', '#f6d28b'];
  function make(initial) {
    return {
      x: Math.random() * w,
      y: initial ? Math.random() * h : -20,
      r: Math.random() * 7 + 5,
      vy: Math.random() * 0.7 + 0.35,
      vx: Math.random() * 0.4 - 0.2,
      rot: Math.random() * Math.PI * 2,
      vr: Math.random() * 0.03 - 0.015,
      sway: Math.random() * Math.PI * 2,
      col: colors[Math.floor(Math.random() * colors.length)],
      a: Math.random() * 0.35 + 0.35
    };
  }
  function resize() {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
    ps = Array.from({ length: Math.min(34, Math.max(18, Math.floor(w / 14))) }, () => make(true));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      p.y += p.vy; p.sway += 0.02; p.rot += p.vr;
      p.x += p.vx + Math.sin(p.sway) * 0.6;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.col;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (p.y > h + 20) ps[i] = make(false);
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize(); draw();
})();

// ---------- Navigation ----------
const voiceAudio = document.getElementById('voiceAudio');

function stopMedia() {
  voiceAudio.pause(); setPlayUI(false);
}
function show(id) {
  stopMedia();
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  void el.offsetWidth;
  el.classList.add('active');
  el.scrollTop = 0;
}
document.querySelectorAll('[data-next]').forEach(b =>
  b.addEventListener('click', () => show(b.dataset.next)));
const rose = document.getElementById('rose');
rose.addEventListener('click', () => show('portrait'));
rose.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') show('portrait'); });

// ---------- Voice player ----------
const playBtn = document.getElementById('playBtn');
const disc = document.getElementById('disc');
const fill = document.getElementById('fill');
const cur = document.getElementById('cur');
const dur = document.getElementById('dur');
const fmt = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';
function setPlayUI(on) {
  playBtn.textContent = on ? '❚❚' : '▶';
  disc.classList.toggle('spin', on);
}
playBtn.addEventListener('click', () => {
  if (voiceAudio.paused) { voiceAudio.play().catch(() => {}); setPlayUI(true); }
  else { voiceAudio.pause(); setPlayUI(false); }
});
voiceAudio.addEventListener('loadedmetadata', () => dur.textContent = fmt(voiceAudio.duration));
voiceAudio.addEventListener('timeupdate', () => {
  cur.textContent = fmt(voiceAudio.currentTime);
  fill.style.width = (voiceAudio.currentTime / voiceAudio.duration * 100 || 0) + '%';
});
voiceAudio.addEventListener('ended', () => setPlayUI(false));
voiceAudio.addEventListener('error', () => { document.getElementById('voiceMsg').hidden = false; setPlayUI(false); });
document.querySelector('.track').addEventListener('click', e => {
  const r = e.currentTarget.getBoundingClientRect();
  if (voiceAudio.duration) voiceAudio.currentTime = ((e.clientX - r.left) / r.width) * voiceAudio.duration;
});

// ---------- Rose burst ----------
const replies = [
  'Gulab pahunch gaya! 🌹',
  'Smile karo na, please 😊',
  'Tum sach mein special ho 💗',
  'Ek aur, kyunki tum deserve karti ho 🌷'
];
let n = 0;
document.getElementById('heartBtn').addEventListener('click', () => {
  const em = ['🌹', '💗', '✨', '🌷', '💖', '🌸'];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    s.className = 'pop';
    s.textContent = em[Math.floor(Math.random() * em.length)];
    s.style.left = Math.random() * 90 + 5 + 'vw';
    s.style.bottom = Math.random() * 20 + 4 + 'vh';
    s.style.animationDelay = Math.random() * 0.5 + 's';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 3600);
  }
  document.getElementById('thanks').textContent = replies[n++ % replies.length];
});

// ---------- Tap a photo to see it full screen ----------
(function () {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<img alt="" />';
  document.body.appendChild(lb);
  const big = lb.querySelector('img');
  document.querySelectorAll('#game .shot img, .vidwrap.photo img').forEach(im =>
    im.addEventListener('click', () => { big.src = im.src; lb.classList.add('on'); }));
  lb.addEventListener('click', () => lb.classList.remove('on'));
})();
