(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav-links');
  const menu = document.querySelector('.menu-btn');
  const sound = document.querySelector('.sound-btn');
  let soundOn = localStorage.getItem('xl-sound') === 'on';
  let audio;

  const aboutLink = Array.from(nav?.children || []).find(item =>
    item.matches?.('a[href$="about.html"]')
  );
  const researchLink = Array.from(nav?.children || []).find(item =>
    item.matches?.('a[href$="research.html"]')
  );
  if (aboutLink && document.documentElement.lang.toLowerCase().startsWith('zh')) {
    const aboutNav = document.createElement('div');
    aboutNav.className = 'nav-item nav-about';
    aboutLink.before(aboutNav);
    aboutNav.append(aboutLink);
    aboutLink.setAttribute('aria-haspopup', 'true');
    aboutNav.insertAdjacentHTML('beforeend', `
      <div class="nav-submenu" aria-label="个人简介子栏目">
        <a href="about.html#about-overview"><b>01</b><span><strong>概述</strong><small>研究者、实践者与分析者</small></span></a>
        <a href="about.html#about-education"><b>02</b><span><strong>教育背景</strong><small>清华、川农学位与新国立联合培养</small></span></a>
        <a href="about.html#about-scholarships"><b>03</b><span><strong>奖学金</strong><small>国家资助与学业奖励</small></span></a>
        <a href="about.html#about-honors"><b>04</b><span><strong>荣誉称号</strong><small>综合素质与学生工作认可</small></span></a>
        <a href="about.html#about-awards"><b>05</b><span><strong>比赛获奖</strong><small>科研、低碳与艺术表达</small></span></a>
        <a href="about.html#about-skills"><b>06</b><span><strong>掌握技能</strong><small>AI、数据、工程与科研</small></span></a>
        <a href="about.html#about-capabilities"><b>07</b><span><strong>关键能力</strong><small>从科学研究到投资判断</small></span></a>
      </div>
    `);
  }
  if (researchLink && document.documentElement.lang.toLowerCase().startsWith('zh')) {
    const researchNav = document.createElement('div');
    researchNav.className = 'nav-item nav-research';
    researchLink.before(researchNav);
    researchNav.append(researchLink);
    researchLink.setAttribute('aria-haspopup', 'true');
    researchNav.insertAdjacentHTML('beforeend', `
      <div class="nav-submenu" aria-label="学术研究子栏目">
        <a href="research.html#research-directions"><b>01</b><span><strong>研究方向</strong><small>三条研究主线与问题版图</small></span></a>
        <a href="research.html#research-content"><b>02</b><span><strong>研究内容</strong><small>研究逻辑、量化结果与原始图表</small></span></a>
        <a href="research.html#research-projects"><b>03</b><span><strong>项目经历</strong><small>跨方向项目与技术角色</small></span></a>
        <a href="research.html#research-papers"><b>04</b><span><strong>论文成果索引</strong><small>九篇论文与完整证据入口</small></span></a>
        <a href="research.html#research-ip"><b>05</b><span><strong>专利成果索引</strong><small>专利证书、软著与原件</small></span></a>
        <a href="research.html#research-communication"><b>06</b><span><strong>学术交流</strong><small>学术汇报与最佳汇报奖</small></span></a>
      </div>
    `);
  }

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
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || link.hasAttribute('download') || link.target === '_blank') return;
    const destination = new URL(href, location.href);
    if (destination.pathname === location.pathname && destination.hash) return;
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

  const educationTimeline = document.querySelector('[data-education-timeline]');
  if (educationTimeline) {
    if (reduced) {
      educationTimeline.classList.add('is-active');
    } else {
      const educationGrowth = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-active');
        educationGrowth.unobserve(entry.target);
      }), { threshold: .2 });
      educationGrowth.observe(educationTimeline);
    }
  }

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

  const researchTabs = document.querySelectorAll('[data-research-tab]');
  const researchPanels = document.querySelectorAll('[data-research-panel]');
  const setResearchDirection = direction => {
    if (!researchTabs.length || !researchPanels.length) return;
    researchTabs.forEach(tab => {
      const active = tab.dataset.researchTab === direction;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    researchPanels.forEach(panel => {
      const active = panel.dataset.researchPanel === direction;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
  };
  researchTabs.forEach(tab => tab.addEventListener('click', () => {
    setResearchDirection(tab.dataset.researchTab);
    tone(590, .05);
  }));
  document.querySelectorAll('[data-open-direction]').forEach(link => link.addEventListener('click', () => {
    setResearchDirection(link.dataset.openDirection);
  }));

  const ipFilterButtons = document.querySelectorAll('[data-ip-filter]');
  const ipRecords = document.querySelectorAll('[data-ip-category]');
  ipFilterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.ipFilter;
    ipFilterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    ipRecords.forEach(item => {
      item.hidden = filter !== 'all' && item.dataset.ipCategory !== filter;
    });
    tone(590, .05);
  }));

  const lightbox = document.querySelector('#research-lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxCaption = lightbox?.querySelector('[data-lightbox-caption]');
  document.querySelectorAll('[data-lightbox-src]').forEach(button => button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = button.dataset.lightboxSrc;
    lightboxImage.alt = button.dataset.lightboxAlt || '';
    if (lightboxCaption) lightboxCaption.textContent = button.dataset.lightboxCaption || button.dataset.lightboxAlt || '';
    lightbox.showModal();
  }));
  lightbox?.querySelector('[data-lightbox-close]')?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) lightbox.close();
  });

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
