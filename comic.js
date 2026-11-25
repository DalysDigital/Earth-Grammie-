/* Earth Gramineae — comic interactions + Bamboo Builder game. No libraries. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k) { try { return localStorage.getItem('eg_' + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem('eg_' + k, v); } catch (e) {} }
  };

  /* ---------- Sound (off until the visitor turns it on) ---------- */
  var soundOn = false, actx = null;
  function tone(freq, dur, type, delay) {
    if (!soundOn) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    actx = actx || new AC();
    if (actx.state === 'suspended') actx.resume();
    var t = actx.currentTime + (delay || 0), o = actx.createOscillator(), g = actx.createGain();
    o.type = type || 'triangle';
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.55, t + dur);
    g.gain.setValueAtTime(0.16, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(actx.destination);
    o.start(t); o.stop(t + dur);
  }
  var soundBtn = $('#soundBtn');
  soundBtn.addEventListener('click', function () {
    soundOn = !soundOn;
    soundBtn.textContent = 'Sound: ' + (soundOn ? 'On' : 'Off');
    soundBtn.setAttribute('aria-pressed', soundOn);
    tone(620, 0.12);
  });

  /* ---------- Comic action words ---------- */
  var layer = $('#fxLayer'), words = ['TOK!', 'POW!', 'SNAP!', 'GROW!', 'WOW!', 'KLOK!', 'ZING!'];
  function pow(x, y, word) {
    if (calm) return;
    var s = document.createElement('span');
    s.className = 'pow';
    s.textContent = word || words[Math.floor(Math.random() * words.length)];
    var half = Math.min(innerWidth / 3, 110);
    s.style.left = Math.max(half, Math.min(innerWidth - half, x)) + 'px';
    s.style.top = y + 'px';
    s.style.setProperty('--r', (Math.random() * 30 - 15) + 'deg');
    layer.appendChild(s);
    setTimeout(function () { s.remove(); }, 800);
  }
  function powAt(el, word) { var r = el.getBoundingClientRect(); pow(r.left + r.width / 2, r.top + r.height / 2, word); }
  var lastPow = 0;
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-word]');
    if (t) { powAt(t, t.dataset.word); tone(380 + Math.random() * 300, 0.14); return; }
    if (e.target.closest('a,button,input,textarea,label,summary,canvas,.flip,.lightbox,.badge-pop,.game')) return;
    if (Date.now() - lastPow < 250) return;
    lastPow = Date.now(); pow(e.clientX, e.clientY); tone(300 + Math.random() * 250, 0.1);
  });

  /* ---------- Menu, active link, scroll bamboo ---------- */
  var toggle = $('.menu-toggle'), nav = $('.nav');
  function menu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }
  toggle.addEventListener('click', function () { menu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) menu(false); });

  var fill = $('.scroll-bamboo-fill'), links = $$('.nav a'), ticking = false;
  function onScroll() {
    ticking = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    fill.style.height = (max > 0 ? Math.min(100, scrollY / max * 100) : 0) + '%';
    var current = '';
    links.forEach(function (a) {
      var s = $(a.getAttribute('href'));
      if (s && s.getBoundingClientRect().top < innerHeight * 0.4) current = a.getAttribute('href');
    });
    links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === current); });
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add('in'); });

  /* ---------- 3D tilt on panels (mouse only) ---------- */
  if (!calm && window.matchMedia('(hover: hover)').matches) {
    $$('.tilt').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 9 + 'deg');
        el.style.setProperty('--rx', (0.5 - (e.clientY - r.top) / r.height) * 9 + 'deg');
      });
      el.addEventListener('pointerleave', function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- Comic FX on/off (shows true photo colours) ---------- */
  var fxBtn = $('#fxBtn');
  function setFx(on) {
    document.body.classList.toggle('fx-off', !on);
    fxBtn.textContent = 'Comic FX: ' + (on ? 'On' : 'Off');
    fxBtn.setAttribute('aria-pressed', on);
  }
  setFx(store.get('fx') !== 'off');
  fxBtn.addEventListener('click', function () {
    var on = document.body.classList.contains('fx-off');
    setFx(on); store.set('fx', on ? 'on' : 'off'); powAt(fxBtn, on ? 'ZAP!' : 'REAL!');
  });

  /* ---------- Flip cards ---------- */
  $$('.flip').forEach(function (card) {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-pressed', 'false');
    function flip() {
      var on = card.getAttribute('aria-pressed') !== 'true';
      card.setAttribute('aria-pressed', on);
      if (on) { powAt(card, 'FLIP!'); tone(520, 0.12); }
    }
    card.addEventListener('click', flip);
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  });

  /* ---------- Dialog helpers ---------- */
  var openDialog = null, returnFocus = null;
  function show(d, focusEl) {
    returnFocus = document.activeElement; openDialog = d; d.hidden = false;
    document.body.style.overflow = 'hidden'; focusEl.focus();
  }
  function hide(restore) {
    if (!openDialog) return;
    openDialog.hidden = true; openDialog = null; document.body.style.overflow = '';
    if (restore !== false && returnFocus && returnFocus.focus) returnFocus.focus({ preventScroll: true });
  }

  /* ---------- Hidden bamboo shoots ---------- */
  var found = (store.get('shoots') || '').split(',').filter(Boolean);
  var shootEls = $$('.shoot'), countEl = $('#shootCount'), badge = $('#badge');
  function paintShoots() {
    shootEls.forEach(function (s) { s.classList.toggle('found', found.indexOf(s.dataset.shoot) > -1); });
    countEl.textContent = found.length;
  }
  shootEls.forEach(function (s) {
    s.addEventListener('click', function () {
      if (found.indexOf(s.dataset.shoot) > -1) return;
      powAt(s, 'GOT IT!'); tone(660, 0.12); tone(990, 0.16, 'triangle', 0.1);
      found.push(s.dataset.shoot); store.set('shoots', found.join(',')); paintShoots();
      if (found.length === shootEls.length) setTimeout(function () { show(badge, $('#badgeClose')); }, 500);
    });
  });
  paintShoots();
  $('#badgeClose').addEventListener('click', function () { hide(); });

  /* ---------- Comic reader (project lightbox) ---------- */
  var box = $('#lightbox'), items = $$('.project-open'), idx = 0;
  function render(i) {
    idx = (i + items.length) % items.length;
    var it = items[idx], img = $('img', it);
    $('#lightboxImg').src = img.getAttribute('src');
    $('#lightboxImg').alt = it.dataset.title;
    $('#lightboxTitle').textContent = it.dataset.title;
    $('#lightboxDesc').textContent = it.dataset.desc || '';
    $('#lightboxCount').textContent = 'Panel ' + (idx + 1) + ' of ' + items.length;
    var one = items.length < 2; $('#prevBtn').hidden = one; $('#nextBtn').hidden = one;
  }
  items.forEach(function (it, i) {
    it.addEventListener('click', function () { render(i); show(box, $('.lightbox-close')); tone(450, 0.14); });
  });
  $('.lightbox-close').addEventListener('click', function () { hide(); });
  $('#prevBtn').addEventListener('click', function () { render(idx - 1); tone(400, 0.08); });
  $('#nextBtn').addEventListener('click', function () { render(idx + 1); tone(500, 0.08); });
  box.addEventListener('click', function (e) { if (e.target === box) hide(); });
  var sx = null;
  box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var d = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(d) > 60) render(idx + (d < 0 ? 1 : -1));
  });
  $('#likeBtn').addEventListener('click', function () {
    var t = items[idx].dataset.title; hide(false); toContact(t + ' (like in your gallery)');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (openDialog) hide(); else menu(false); }
    if (!openDialog) return;
    if (openDialog === box && e.key === 'ArrowLeft') render(idx - 1);
    if (openDialog === box && e.key === 'ArrowRight') render(idx + 1);
    if (e.key === 'Tab') {
      var f = $$('button', openDialog).filter(function (b) { return !b.hidden; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Contact form ---------- */
  var form = $('#contactForm'), nameEl = $('#name'), projEl = $('#project'), msgEl = $('#message');
  var chips = $$('.chip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var on = c.getAttribute('aria-pressed') !== 'true';
      c.setAttribute('aria-pressed', on);
      projEl.value = chips.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; }).map(function (x) { return x.textContent; }).join(', ');
      if (on) { powAt(c, 'YES!'); tone(560, 0.1); }
    });
  });
  projEl.addEventListener('input', function () { chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); }); });
  function toContact(project) {
    projEl.value = project;
    chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
    $('#contact .reveal').classList.add('in');
    form.scrollIntoView({ block: 'start' });
    nameEl.focus({ preventScroll: true });
  }
  function body() {
    return 'Hello Earth Gramineae,\n\nName: ' + nameEl.value.trim() +
      '\nProject / service: ' + (projEl.value.trim() || 'Not specified') +
      '\n\n' + msgEl.value.trim();
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    powAt($('button[type=submit]', form), 'ZOOM!'); tone(700, 0.2);
    var url = 'https://wa.me/' + form.dataset.wa + '?text=' + encodeURIComponent(body());
    var w = window.open(url, '_blank');
    if (w) w.opener = null; else location.href = url;
  });
  $('#emailBtn').addEventListener('click', function () {
    if (!form.reportValidity()) return;
    location.href = 'mailto:' + form.dataset.email + '?subject=' +
      encodeURIComponent('Project enquiry — ' + (projEl.value.trim() || nameEl.value.trim())) +
      '&body=' + encodeURIComponent(body());
  });
  $('#year').textContent = new Date().getFullYear();

  /* ================= Bamboo Builder game ================= */
  var cv = $('#game'), ctx = cv.getContext && cv.getContext('2d');
  if (!ctx) return;
  var GOAL = 20, INK = '#14110f';
  var W = 800, H = 550, state = 'idle', score = 0, lives = 3, drops = [], bx = 0, dir = 0, timer = 0, last = 0, raf = 0;
  var screen = $('#gScreen'), startBtn = $('#gStart'), askBtn = $('#gAsk'), pauseBtn = $('#gPause');

  function size() {
    var r = cv.getBoundingClientRect(); if (!r.width) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1), ratio = bx / W || 0.5;
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    var oldH = H; H = Math.round(W * r.height / r.width); bx = ratio * W;
    drops.forEach(function (d) { d.y *= H / oldH; });
    ctx.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
    draw();
  }
  function shape(fillColor, path, lw) {
    ctx.beginPath(); path(); ctx.fillStyle = fillColor; ctx.fill();
    ctx.lineWidth = lw || 5; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
  }
  function rect(x, y, w, h, c) { shape(c, function () { ctx.rect(x, y, w, h); }, 4); }
  function pole(x, y, len, angle, c) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    rect(-11, -len / 2, 22, len, c);
    ctx.beginPath(); ctx.moveTo(-11, -len / 6); ctx.lineTo(11, -len / 6); ctx.moveTo(-11, len / 6); ctx.lineTo(11, len / 6); ctx.stroke();
    ctx.restore();
  }
  function gazebo() {
    var n = Math.min(score, GOAL), g = H - 70, cx = W / 2;
    ctx.save(); ctx.globalAlpha = 0.18; for (var i = 0; i < GOAL; i++) part(i, cx, g); ctx.restore();
    for (var j = 0; j < n; j++) part(j, cx, g);
  }
  /* 20 building steps: floor (4), posts (4), rails (4), beam (2), roof (5), finial (1) */
  function part(i, cx, g) {
    var c = '#e9b44c';
    if (i < 4) rect(cx - 180 + i * 90, g - 18, 90, 18, '#c9862f');
    else if (i < 8) rect(cx + [-160, 140, -70, 50][i - 4], g - 178, 20, 160, c);
    else if (i < 12) rect(cx + [-140, 70, -140, 70][i - 8], g - (i < 10 ? 70 : 42), 70, 12, c);
    else if (i < 14) rect(cx - 190 + (i - 12) * 190, g - 196, 190, 18, '#c9862f');
    else if (i < 19) {
      var k = i - 14, top = g - 290, base = g - 196, x1 = cx - 210 + k * 84, x2 = x1 + 84;
      shape(k % 2 ? '#3fae4f' : '#8fe03c', function () { ctx.moveTo(cx, top); ctx.lineTo(x2, base); ctx.lineTo(x1, base); ctx.closePath(); }, 4);
    } else shape('#ff3d2e', function () { ctx.arc(cx, g - 296, 15, 0, 7); }, 4);
  }
  function draw() {
    ctx.fillStyle = '#7bdcff'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    for (var a = 0; a < 12; a++) { ctx.beginPath(); ctx.moveTo(W / 2, H); ctx.arc(W / 2, H, W + H, Math.PI + a * 0.262, Math.PI + a * 0.262 + 0.12); ctx.fill(); }
    shape('#2f9e57', function () { ctx.moveTo(-10, H); ctx.lineTo(-10, H - 150); ctx.quadraticCurveTo(190, H - 280, 420, H - 110); ctx.quadraticCurveTo(630, H - 250, W + 10, H - 130); ctx.lineTo(W + 10, H); });
    rect(-10, H - 70, W + 20, 80, '#1fbf5b');
    gazebo();
    drops.forEach(function (d) {
      if (d.type === 'pole') pole(d.x, d.y, 78, d.a, '#e9b44c');
      else if (d.type === 'gold') {
        shape('#ffd60a', function () { ctx.moveTo(d.x, d.y - 36); ctx.quadraticCurveTo(d.x + 34, d.y, d.x + 20, d.y + 28); ctx.lineTo(d.x - 20, d.y + 28); ctx.quadraticCurveTo(d.x - 34, d.y, d.x, d.y - 36); });
      } else {
        shape('#a9a9b3', function () { ctx.moveTo(d.x - 32, d.y - 26); ctx.lineTo(d.x + 32, d.y - 30); ctx.lineTo(d.x + 27, d.y + 30); ctx.lineTo(d.x - 30, d.y + 26); ctx.closePath(); });
        ctx.fillStyle = INK; ctx.font = '22px Bangers, Impact, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('CEMENT', d.x, d.y + 8);
      }
    });
    var by = H - 62;
    shape('#c9862f', function () { ctx.moveTo(bx - 70, by); ctx.lineTo(bx + 70, by); ctx.lineTo(bx + 48, by + 52); ctx.lineTo(bx - 48, by + 52); ctx.closePath(); });
    ctx.beginPath(); for (var s = -40; s <= 40; s += 20) { ctx.moveTo(bx + s * 1.3, by); ctx.lineTo(bx + s, by + 52); } ctx.moveTo(bx - 59, by + 26); ctx.lineTo(bx + 59, by + 26); ctx.lineWidth = 3; ctx.stroke();
    rect(bx - 76, by - 8, 152, 14, '#e9b44c');
  }
  function hud() {
    $('#gScore').textContent = Math.min(score, GOAL);
    $('#gLives').textContent = '♥♥♥'.slice(0, lives) + '♡♡♡'.slice(0, 3 - lives);
  }
  function overlay(title, text, button, ask) {
    $('#gTitle').textContent = title; $('#gText').textContent = text; startBtn.textContent = button;
    askBtn.hidden = !ask; screen.hidden = false;
  }
  function stop() { cancelAnimationFrame(raf); dir = 0; cv.classList.remove('live'); }
  function run() {
    state = 'play'; screen.hidden = true; pauseBtn.disabled = false; cv.classList.add('live');
    cv.focus({ preventScroll: true }); last = performance.now(); raf = requestAnimationFrame(loop);
  }
  function start() {
    if (state !== 'paused') { score = 0; lives = 3; drops = []; bx = W / 2; timer = 0; hud(); }
    run();
  }
  function pause() {
    if (state !== 'play') return;
    state = 'paused'; stop(); pauseBtn.disabled = true; overlay('Paused', 'Your gazebo is waiting.', 'Resume', false);
  }
  function end(win) {
    state = 'over'; stop(); pauseBtn.disabled = true; drops = []; draw();
    if (win) { overlay('Gazebo complete!', 'Master builder! Want a real one in your garden?', 'Play again', true); [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.22, 'triangle', i * 0.12); }); }
    else overlay('Crunch!', 'You placed ' + score + ' of ' + GOAL + ' poles. Try again?', 'Try again', false);
  }
  function loop(now) {
    if (state !== 'play') return;
    var dt = Math.min(0.04, Math.max(0, (now - last) / 1000)); last = now;
    bx = Math.max(76, Math.min(W - 76, bx + dir * 620 * dt));
    timer -= dt;
    if (timer <= 0) {
      var r = Math.random();
      drops.push({ type: r < 0.22 ? 'bad' : r < 0.32 ? 'gold' : 'pole', x: 60 + Math.random() * (W - 120), y: -50, a: Math.random() * 3, spin: Math.random() * 4 - 2 });
      timer = Math.max(0.55, 1.05 - score * 0.022);
    }
    var speed = (0.34 + score * 0.008) * H;
    for (var i = drops.length - 1; i >= 0; i--) {
      var d = drops[i]; d.y += speed * dt; d.a += d.spin * dt;
      if (d.y > H - 90 && d.y < H - 25 && Math.abs(d.x - bx) < 92) {
        drops.splice(i, 1);
        var rc = cv.getBoundingClientRect(), px = rc.left + d.x / W * rc.width, py = rc.top + (H - 100) / H * rc.height;
        if (d.type === 'bad') { lives--; pow(px, py, 'THUD!'); tone(140, 0.3, 'sawtooth'); }
        else { score += d.type === 'gold' ? 3 : 1; pow(px, py, d.type === 'gold' ? '+3!' : 'TOK!'); tone(d.type === 'gold' ? 880 : 430, 0.12); }
        hud();
        if (score >= GOAL) return end(true);
        if (lives <= 0) return end(false);
      } else if (d.y > H + 60) drops.splice(i, 1);
    }
    draw(); raf = requestAnimationFrame(loop);
  }
  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', pause);
  askBtn.addEventListener('click', function () { toContact('Gazebo'); });
  function point(e) {
    if (state !== 'play') return;
    var r = cv.getBoundingClientRect(); bx = Math.max(76, Math.min(W - 76, (e.clientX - r.left) / r.width * W));
  }
  cv.addEventListener('pointerdown', point);
  cv.addEventListener('pointermove', point);
  var held = {};
  function keys() { dir = (held.right ? 1 : 0) - (held.left ? 1 : 0); }
  function keyName(k) { return (k === 'ArrowLeft' || k === 'a' || k === 'A') ? 'left' : (k === 'ArrowRight' || k === 'd' || k === 'D') ? 'right' : null; }
  addEventListener('keydown', function (e) {
    if (state !== 'play' || openDialog || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    var k = keyName(e.key); if (k) { e.preventDefault(); held[k] = true; keys(); }
  });
  addEventListener('keyup', function (e) { var k = keyName(e.key); if (k) { held[k] = false; keys(); } });
  $$('.game-pad button').forEach(function (b) {
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); dir = +b.dataset.dir; });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (n) { b.addEventListener(n, function () { dir = 0; }); });
    b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) { held = {}; pause(); } });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (l) { if (l[0].intersectionRatio < 0.25) { held = {}; pause(); } }, { threshold: [0, 0.25] }).observe(cv);
  bx = W / 2;
  if ('ResizeObserver' in window) new ResizeObserver(size).observe(cv); else addEventListener('resize', size);
  size();
})();
