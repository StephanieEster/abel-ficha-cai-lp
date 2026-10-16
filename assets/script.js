(() => {
  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px' })
    : null;

  document.querySelectorAll('.reveal').forEach((element) => {
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add('visible');
  });

  // Link de compra: definido em <body data-purchase-url="...">.
  const purchaseUrl = (document.body.dataset.purchaseUrl || '').trim();
  const purchaseReady = /^https?:\/\//i.test(purchaseUrl);
  const toast = document.querySelector('[data-toast]');
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
  };

  document.querySelectorAll('[data-purchase-link]').forEach((link) => {
    if (purchaseReady) {
      link.href = purchaseUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      return;
    }
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showToast('O link de compra do e-book completo ainda não foi configurado.');
    });
  });

  // Abas: #capitulo-1 abre a leitura; qualquer outro destino abre a apresentação.
  const READER_ID = 'capitulo-1';
  const presentation = document.getElementById('apresentacao');
  const reader = document.getElementById(READER_ID);
  const tabs = document.querySelectorAll('[role="tab"]');
  const tabbar = document.querySelector('.tabbar');
  const progressBar = document.querySelector('[data-reader-progress]');
  const pages = document.querySelector('[data-reader-pages]');

  const setTab = (readerOpen) => {
    reader.hidden = !readerOpen;
    presentation.hidden = readerOpen;
    document.body.classList.toggle('is-reading', readerOpen);
    tabs.forEach((tab) => {
      const selected = tab.getAttribute('aria-controls') === (readerOpen ? READER_ID : 'apresentacao');
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
  };

  const route = (fromNavigation) => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const readerOpen = id === READER_ID;
    const wasReading = !reader.hidden;
    setTab(readerOpen);

    if (readerOpen) {
      if (fromNavigation && !wasReading) tabbar.scrollIntoView({ block: 'start', behavior: 'instant' });
      updateProgress();
      return;
    }

    const target = id && id !== 'apresentacao' ? document.getElementById(id) : null;
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    else if (fromNavigation && wasReading) window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const updateProgress = () => {
    if (!progressBar || !pages || reader.hidden) return;
    const rect = pages.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const ratio = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 1;
    progressBar.style.transform = `scaleX(${ratio})`;
  };

  // Setas do teclado alternam entre as abas (padrão WAI-ARIA).
  tabs.forEach((tab, index) => {
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      next.focus();
      next.click();
    });
  });

  window.addEventListener('hashchange', () => route(true));
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  route(false);
})();
