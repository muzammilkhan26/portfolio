/* Motion and small conveniences. The page is fully readable without this file,
   and everything here stands down when the visitor prefers reduced motion. */
(function () {
  'use strict';

  var root = document.documentElement;
  var KEY = 'theme';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  root.classList.add('js');

  function store(kind) {
    try { return window[kind]; } catch (e) { return null; }
  }
  function getItem(kind, key) {
    try { var s = store(kind); return s ? s.getItem(key) : null; } catch (e) { return null; }
  }
  function setItem(kind, key, value) {
    try { var s = store(kind); if (s) s.setItem(key, value); } catch (e) { /* private mode */ }
  }

  // Apply a saved theme before the page paints.
  var saved = getItem('localStorage', KEY);
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

  function currentTheme() {
    var forced = root.getAttribute('data-theme');
    if (forced) return forced;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  document.addEventListener('DOMContentLoaded', function () {
    var startDelay = intro();

    themeSwitch();
    copyEmail();
    activeNav();
    scrollChrome();
    reveal();
    counters();
    timelineFill();
    phases();
    network();
    setTimeout(function () { all('h1 [data-scramble]').forEach(function (el, i) { scramble(el, i * 140); }); }, startDelay + 150);
    setTimeout(typewriter, startDelay + 900);
    setTimeout(terminal, startDelay + 500);
    if (finePointer && !reduce) {
      pointerLight();
      cardLight();
      magneticButtons();
      tiltTerminal();
      pointerRing();
    }

    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  });

  // ---- Short intro, once per browser session ----
  function intro() {
    if (reduce || getItem('sessionStorage', 'intro')) return 0;
    setItem('sessionStorage', 'intro', '1');

    var boot = document.createElement('div');
    boot.className = 'boot';
    boot.setAttribute('aria-hidden', 'true');

    var logo = document.createElement('div');
    logo.className = 'boot-logo';
    logo.appendChild(document.createTextNode('MMK'));
    var dot = document.createElement('span');
    dot.textContent = '.';
    logo.appendChild(dot);

    var bar = document.createElement('div');
    bar.className = 'boot-bar';

    var text = document.createElement('div');
    text.className = 'boot-text';
    text.textContent = 'LOADING';

    boot.appendChild(logo);
    boot.appendChild(bar);
    boot.appendChild(text);
    document.body.appendChild(boot);

    setTimeout(function () { boot.classList.add('done'); }, 950);
    setTimeout(function () { if (boot.parentNode) boot.parentNode.removeChild(boot); }, 1500);
    return 950;
  }

  // ---- Theme ----
  function themeSwitch() {
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    function label() {
      var next = currentTheme() === 'dark' ? 'Light' : 'Dark';
      toggle.textContent = next;
      toggle.setAttribute('aria-label', 'Switch to ' + next.toLowerCase() + ' theme');
    }
    toggle.hidden = false;
    label();
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      setItem('localStorage', KEY, next);
      label();
    });
  }

  // ---- Copy email ----
  function copyEmail() {
    var btn = document.getElementById('copyEmail');
    var link = document.getElementById('emailLink');
    var status = document.getElementById('copyStatus');
    if (!btn || !link || !navigator.clipboard) return;
    btn.hidden = false;
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(link.textContent.trim()).then(function () {
        status.textContent = 'Copied';
        setTimeout(function () { status.textContent = ''; }, 2000);
      }, function () {
        status.textContent = 'Could not copy. Select the address instead.';
      });
    });
  }

  // ---- Menu highlight ----
  function activeNav() {
    if (!('IntersectionObserver' in window)) return;
    var links = all('.nav a');
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var link = byId[entry.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    all('main section[id]').forEach(function (s) { observer.observe(s); });
  }

  // ---- Reading progress bar and back-to-top button ----
  function scrollChrome() {
    var bar = document.getElementById('progress');
    var top = document.createElement('button');
    top.className = 'to-top';
    top.type = 'button';
    top.setAttribute('aria-label', 'Back to top');
    top.textContent = '↑';
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
    document.body.appendChild(top);

    var ticking = false;
    function update() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar) bar.style.setProperty('--p', p.toFixed(4));
      top.classList.toggle('show', window.scrollY > 600);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // ---- Reveal on scroll ----
  function reveal() {
    if (reduce || !('IntersectionObserver' in window)) return;
    var groups = [
      '.stats > div', '.note', '.sec-head', '.about-grid > *', '.facts > div',
      '.tl-item', '.feature', '.thm', '.list-title', '.grid > li', '.marquee',
      '.edu > li', '.contact-grid > *', '.footer-row'
    ];
    var items = all(groups.join(','));

    function show(el) {
      if (el.classList.contains('in')) return;
      el.classList.add('in');
      if (el.classList.contains('sec-head')) {
        all('[data-scramble]', el).forEach(function (s, i) { scramble(s, 150 + i * 120); });
      }
      // Once it has arrived, hand the element back to its normal hover styles.
      var delay = parseFloat(el.style.transitionDelay) || 0;
      setTimeout(function () {
        el.classList.remove('reveal', 'in');
        el.style.transitionDelay = '';
      }, delay + 1300);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        show(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) {
      var index = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(index, 7) * 80 + 'ms';
      observer.observe(el);
    });

    // Safety net: never leave content hidden.
    setTimeout(function () {
      items.forEach(function (el) {
        if (!el.classList.contains('reveal')) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) show(el);
      });
    }, 2500);
  }

  // ---- Letters settle into place ----
  function scramble(el, wait) {
    if (reduce || el.getAttribute('data-busy')) return;
    var final = el.textContent;
    var glyphs = '!<>-_\\/[]{}=+*^?#01';
    var total = 26;
    var frame = 0;
    el.setAttribute('data-busy', '1');
    setTimeout(function step() {
      var out = '';
      var settled = Math.floor((frame / total) * final.length);
      for (var i = 0; i < final.length; i += 1) {
        var ch = final.charAt(i);
        if (i < settled || ch === ' ') out += ch;
        else out += glyphs.charAt(Math.floor(Math.random() * glyphs.length));
      }
      el.textContent = out;
      frame += 1;
      if (frame <= total) return setTimeout(step, 28);
      el.textContent = final;
      el.removeAttribute('data-busy');
    }, wait || 0);
  }

  // ---- Timeline line fills as you read ----
  function timelineFill() {
    var line = document.getElementById('timeline');
    if (!line || reduce) return;
    var fill = line.querySelector('.timeline-fill');
    var ticking = false;
    function update() {
      ticking = false;
      var r = line.getBoundingClientRect();
      var t = (window.innerHeight * 0.65 - r.top) / r.height;
      fill.style.setProperty('--t', Math.max(0, Math.min(1, t)).toFixed(3));
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // ---- Roadmap bars ----
  function phases() {
    var bars = all('#phases i');
    bars.forEach(function (bar, i) {
      var h = 30 + Math.round(60 * (i + 1) / bars.length) + Math.round(Math.sin(i * 1.7) * 10);
      bar.style.height = Math.max(22, Math.min(100, h)) + '%';
      bar.style.animationDelay = (i * 0.14).toFixed(2) + 's';
    });
  }

  // ---- Moving network behind the hero ----
  function network() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas || reduce || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, nodes = [], running = false;
    var mouse = { x: -9999, y: -9999 };
    var rgb = '74, 222, 128';

    function readColor() {
      var v = getComputedStyle(root).getPropertyValue('--accent-rgb').trim();
      if (v) rgb = v;
    }

    function resize() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(18, Math.min(72, Math.round(w * h / 15000)));
      nodes = [];
      for (var i = 0; i < count; i += 1) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: 1 + Math.random() * 1.6
        });
      }
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      var i, j, a, b, dx, dy, d;
      for (i = 0; i < nodes.length; i += 1) {
        a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;

        for (j = i + 1; j < nodes.length; j += 1) {
          b = nodes[j];
          dx = a.x - b.x; dy = a.y - b.y;
          d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.strokeStyle = 'rgba(' + rgb + ',' + (0.16 * (1 - d / 130)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }

        dx = a.x - mouse.x; dy = a.y - mouse.y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < 190) {
          ctx.strokeStyle = 'rgba(' + rgb + ',' + (0.45 * (1 - d / 190)).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }

        ctx.fillStyle = 'rgba(' + rgb + ',0.55)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    var hero = canvas.parentNode;
    hero.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    }, { passive: true });
    hero.addEventListener('pointerleave', function () { mouse.x = -9999; mouse.y = -9999; });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    if ('MutationObserver' in window) {
      new MutationObserver(readColor).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }

    readColor();
    resize();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        if (visible && !running) { running = true; requestAnimationFrame(frame); }
        else if (!visible) running = false;
      }).observe(hero);
    } else {
      running = true;
      requestAnimationFrame(frame);
    }
  }

  // ---- Counting numbers ----
  function counters() {
    var nums = all('[data-count]');
    if (reduce || !nums.length || !('IntersectionObserver' in window)) return;
    nums.forEach(function (el) { el.textContent = '0'; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        run(entry.target);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { observer.observe(el); });

    function run(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var start = null;
      var duration = 1500;
      function frame(now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
  }

  // ---- Typewriter line in the hero ----
  function typewriter() {
    var el = document.getElementById('typed');
    if (!el || reduce) return;
    var phrases = [
      'penetration testing',
      'web app security testing',
      'Android app security testing',
      'security report writing',
      'fix re-testing'
    ];
    var p = 0;
    var i = phrases[0].length;
    var deleting = true;

    function tick() {
      var word = phrases[p];
      if (deleting) {
        i -= 1;
        el.textContent = word.slice(0, i);
        if (i === 0) { deleting = false; p = (p + 1) % phrases.length; return setTimeout(tick, 350); }
        return setTimeout(tick, 32);
      }
      i += 1;
      el.textContent = phrases[p].slice(0, i);
      if (i === phrases[p].length) { deleting = true; return setTimeout(tick, 2200); }
      setTimeout(tick, 70);
    }
    setTimeout(tick, 1800);
  }

  // ---- Terminal types itself out ----
  function terminal() {
    var body = document.getElementById('terminalBody');
    if (!body || reduce) return;
    var lines = all('p', body).map(function (p) {
      return { cls: p.className, text: p.textContent };
    });
    while (body.firstChild) body.removeChild(body.firstChild);

    var n = 0;
    function next() {
      if (n >= lines.length) return;
      var line = lines[n];
      n += 1;
      var p = document.createElement('p');
      p.className = line.cls;
      body.appendChild(p);

      var isCommand = line.cls.indexOf('t-cmd') !== -1;
      if (!isCommand || !line.text) {
        p.textContent = line.text;
        return setTimeout(next, isCommand ? 0 : 420);
      }
      p.classList.add('t-typing');
      var c = 0;
      (function type() {
        c += 1;
        p.textContent = line.text.slice(0, c);
        if (c < line.text.length) return setTimeout(type, 45 + Math.random() * 40);
        p.classList.remove('t-typing');
        setTimeout(next, 260);
      })();
    }
    next();
  }

  // ---- Soft light behind the page that follows the pointer ----
  function pointerLight() {
    var backdrop = document.querySelector('.backdrop');
    if (!backdrop) return;
    var x = 0, y = 0, queued = false;
    window.addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY;
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        backdrop.style.setProperty('--mx', x + 'px');
        backdrop.style.setProperty('--my', y + 'px');
      });
    }, { passive: true });
  }

  // ---- Light inside cards ----
  function cardLight() {
    all('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--x', (e.clientX - r.left) + 'px');
        card.style.setProperty('--y', (e.clientY - r.top) + 'px');
      }, { passive: true });
    });
  }

  // ---- Buttons lean toward the pointer ----
  function magneticButtons() {
    all('.actions .btn').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) * 0.22;
        var dy = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  // ---- Terminal tilts slightly ----
  function tiltTerminal() {
    var wrap = document.querySelector('.terminal-wrap');
    var term = document.getElementById('terminal');
    if (!wrap || !term) return;
    wrap.addEventListener('pointermove', function (e) {
      var r = wrap.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      term.style.setProperty('--ry', (px * 10).toFixed(2) + 'deg');
      term.style.setProperty('--rx', (-py * 8).toFixed(2) + 'deg');
    });
    wrap.addEventListener('pointerleave', function () {
      term.style.setProperty('--ry', '0deg');
      term.style.setProperty('--rx', '0deg');
    });
  }

  // ---- Ring that trails the pointer (the normal cursor stays visible) ----
  function pointerRing() {
    var ring = document.createElement('div');
    ring.className = 'ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);

    var tx = 0, ty = 0, x = 0, y = 0, started = false;
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!started) { started = true; x = tx; y = ty; ring.classList.add('on'); loop(); }
      var hot = e.target && e.target.closest && e.target.closest('a, button, input, textarea, .tags li, .marquee-track li');
      ring.classList.toggle('hot', !!hot);
    }, { passive: true });
    document.addEventListener('pointerleave', function () { ring.classList.remove('on'); });
    document.addEventListener('pointerenter', function () { if (started) ring.classList.add('on'); });

    function loop() {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      ring.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      requestAnimationFrame(loop);
    }
  }
})();
