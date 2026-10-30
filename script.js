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

  /* 截图横向浏览 */
  const rail = document.getElementById('galleryRail');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');

  if (rail && galleryPrev && galleryNext) {
    const step = () => {
      const shot = rail.querySelector('.shot');
      const gap = parseFloat(getComputedStyle(rail).gap) || 16;
      return (shot ? shot.getBoundingClientRect().width : 190) + gap;
    };

    const syncGalleryNav = () => {
      galleryPrev.disabled = rail.scrollLeft <= 4;
      galleryNext.disabled =
        rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
    };

    galleryPrev.addEventListener('click', () => {
      rail.scrollBy({ left: -step() * 2, behavior: 'smooth' });
    });
    galleryNext.addEventListener('click', () => {
      rail.scrollBy({ left: step() * 2, behavior: 'smooth' });
    });
    rail.addEventListener('scroll', syncGalleryNav, { passive: true });
    window.addEventListener('resize', syncGalleryNav);
    syncGalleryNav();
  }

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
