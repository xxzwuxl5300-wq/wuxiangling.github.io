(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav-links');
  const menu = document.querySelector('.menu-btn');
  const sound = document.querySelector('.sound-btn');
  let soundOn = localStorage.getItem('xl-sound') === 'on';
  let audio;

  const setSoundLabel = () => {
    if (!sound) return;
    sound.textContent = soundOn ? '♪' : '♩';
    sound.setAttribute('aria-pressed', String(soundOn));
    sound.title = soundOn ? 'Mute sound' : 'Enable sound';
  };

  const tone = (frequency = 520, duration = .055) => {
    if (!soundOn) return;
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(.018, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + duration);
    osc.connect(gain).connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + duration);
  };

  sound?.addEventListener('click', () => {
    soundOn = !soundOn;
    localStorage.setItem('xl-sound', soundOn ? 'on' : 'off');
    setSoundLabel();
    if (soundOn) tone(640, .09);
  });
  setSoundLabel();

  menu?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });

  addEventListener('scroll', () => header?.classList.toggle('scrolled', scrollY > 18), { passive: true });

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || link.hasAttribute('download')) return;
    link.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      tone(440, .06);
      document.body.classList.add('leaving');
      setTimeout(() => location.href = href, reduced ? 0 : 430);
    });
  });

  document.querySelectorAll('.project-card, .btn, .filter-btn').forEach(el => el.addEventListener('mouseenter', () => tone(760, .035)));

  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      reveal.unobserve(entry.target);
    }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

  const count = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.value || 0);
    const suffix = el.dataset.suffix || '';
    if (reduced) { el.textContent = `${target}${suffix}`; return; }
    let start;
    const tick = time => {
      start ||= time;
      const p = Math.min(1, (time - start) / 950);
      const value = target % 1 ? (target * p).toFixed(1) : Math.round(target * p);
      el.textContent = `${value}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    count.unobserve(el);
  }), { threshold: .5 });
  document.querySelectorAll('[data-count]').forEach(el => count.observe(el));

  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-result-type]').forEach(item => {
      item.hidden = filter !== 'all' && item.dataset.resultType !== filter;
    });
    tone(590, .05);
  }));

  const langLink = document.querySelector('.lang-link');
  langLink?.addEventListener('click', () => localStorage.setItem('xl-lang', langLink.dataset.lang));

  const canvas = document.querySelector('#flow-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, ratio = 1;
    const pointer = { x: .5, y: .5 };
    const points = Array.from({ length: reduced ? 28 : 72 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .00016, vy: (Math.random() - .5) * .00016, r: Math.random() * 1.8 + .6 }));
    const resize = () => {
      ratio = Math.min(devicePixelRatio, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * ratio; canvas.height = h * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    new ResizeObserver(resize).observe(canvas);
    canvas.addEventListener('pointermove', e => { const b = canvas.getBoundingClientRect(); pointer.x = (e.clientX - b.left) / b.width; pointer.y = (e.clientY - b.top) / b.height; });
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const scrollShift = Math.min(1, scrollY / Math.max(1, innerHeight));
      points.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        const px = p.x * w + (pointer.x - .5) * 18 * (p.y - .5);
        const py = p.y * h + scrollShift * 34 * (p.x - .5);
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.x > .62 ? 'rgba(87,225,178,.66)' : 'rgba(100,185,255,.7)'; ctx.fill();
      });
      for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) {
        const a = points[i], b = points[j];
        const dx = (a.x - b.x) * w, dy = (a.y - b.y) * h, d = Math.hypot(dx, dy);
        if (d < 125) {
          ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h);
          ctx.strokeStyle = `rgba(${a.x > .62 ? '87,225,178' : '73,168,255'},${.13 * (1 - d / 125)})`;
          ctx.stroke();
        }
      }
      if (!reduced) requestAnimationFrame(draw);
    };
    resize(); draw();
  }
})();
