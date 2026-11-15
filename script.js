(() => {
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  /* 导航背景 */
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* 移动端菜单 */
  const closeMenu = () => {
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', '打开菜单');
  };

  menuBtn.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 940) closeMenu();
  });

  /* 当前区块高亮 */
  const links = [...navLinks.querySelectorAll('a')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          links.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === id);
          });
        });
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 }
    );
    sections.forEach((section) => activeObserver.observe(section));
  }

  /* 滚动出现 */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* 功能日志标签页 */
  const logTabs = [...document.querySelectorAll('.log-tab')];
  const logPanels = [...document.querySelectorAll('.log-panel')];

  if (logTabs.length && logPanels.length) {
    const selectLog = (key) => {
      logTabs.forEach((tab) => {
        const active = tab.dataset.log === key;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      logPanels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== key;
      });
    };

    logTabs.forEach((tab, index) => {
      tab.tabIndex = tab.classList.contains('is-active') ? 0 : -1;
      tab.addEventListener('click', () => selectLog(tab.dataset.log));
      tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const dir = event.key === 'ArrowRight' ? 1 : -1;
        const next = logTabs[(index + dir + logTabs.length) % logTabs.length];
        selectLog(next.dataset.log);
        next.focus();
      });
    });
  }

  /* 截图横向浏览 */
  const initGallery = (railId, prevId, nextId) => {
    const rail = document.getElementById(railId);
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    if (!rail || !prev || !next) return;

    const step = () => {
      const shot = rail.querySelector('.shot');
      const gap = parseFloat(getComputedStyle(rail).gap) || 16;
      return (shot ? shot.getBoundingClientRect().width : 190) + gap;
    };

    const syncNav = () => {
      prev.disabled = rail.scrollLeft <= 4;
      next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
    };

    prev.addEventListener('click', () => {
      rail.scrollBy({ left: -step() * 2, behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
      rail.scrollBy({ left: step() * 2, behavior: 'smooth' });
    });
    rail.addEventListener('scroll', syncNav, { passive: true });
    window.addEventListener('resize', syncNav);
    syncNav();
  };

  initGallery('galleryRail', 'galleryPrev', 'galleryNext');
  initGallery('storeRail', 'storePrev', 'storeNext');

  /* 卡片跟随光斑（仅精确指针） */
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (finePointer.matches) {
    document.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      });
    });
  }
})();
