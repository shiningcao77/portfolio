const scene = document.querySelector('.scene');
const motionButton = document.querySelector('.motion-toggle');
const statusLine = document.querySelector('.desk-status');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let pausedByVisitor = false;
try {
  pausedByVisitor = localStorage.getItem('archive-motion-paused') === 'true';
} catch {}

function updateMotion() {
  const paused = reducedMotion.matches || pausedByVisitor;
  scene.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = paused ? 'Motion paused' : 'Pause motion';
  motionButton.disabled = reducedMotion.matches;
  motionButton.title = reducedMotion.matches ? 'Reduced motion follows your device setting' : '';
  scene.style.removeProperty('--camera-x');
  scene.style.removeProperty('--camera-y');
}

if (scene && motionButton) {
  motionButton.hidden = false;
  updateMotion();
  reducedMotion.addEventListener('change', updateMotion);
  motionButton.addEventListener('click', () => {
    pausedByVisitor = !pausedByVisitor;
    try {
      localStorage.setItem('archive-motion-paused', String(pausedByVisitor));
    } catch {}
    updateMotion();
  });

  for (const link of scene.querySelectorAll('.scene-card, .scattered')) {
    const title = link.querySelector('strong')?.textContent || link.querySelector('span:last-child')?.textContent;
    const inspect = () => { statusLine.textContent = 'INSPECT / ' + title.trim() + ' — open case ↗'; };
    const reset = () => { statusLine.textContent = 'INVESTIGATE / Select a case file'; };
    link.addEventListener('pointerenter', inspect);
    link.addEventListener('pointerleave', reset);
    link.addEventListener('focus', inspect);
    link.addEventListener('blur', reset);
  }
}

if (scene) {
  let opening = false;
  for (const tab of scene.querySelectorAll('.archive-tabs a[data-case-title]')) {
    tab.addEventListener('click', async (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (reducedMotion.matches || pausedByVisitor) return;
      event.preventDefault();
      if (opening) return;
      opening = true;
      const page = document.createElement('div');
      page.className = 'archive-page-turn';
      page.setAttribute('aria-hidden', 'true');
      const label = document.createElement('small');
      label.textContent = 'OPENING CASE FILE / ' + tab.textContent;
      const title = document.createElement('strong');
      title.textContent = tab.dataset.caseTitle;
      page.append(label, title);
      scene.querySelector('.case-folder').append(page);
      try {
        await page.animate([
          { transform: 'perspective(900px) rotateY(0deg)', opacity: 1 },
          { transform: 'perspective(900px) rotateY(-85deg)', opacity: 0.2 }
        ], { duration: 360, easing: 'ease-in' }).finished;
      } finally {
        page.remove();
        opening = false;
        window.location.assign(tab.href);
      }
    });
  }
}


const lamp = document.querySelector('.lamp-shade');
if (scene && lamp) {
  lamp.addEventListener('click', () => {
    const dimmed = scene.classList.toggle('is-dim');
    lamp.setAttribute('aria-pressed', String(!dimmed));
  });
}

const dock = document.querySelector('.desk-dock');
const penToggle = document.querySelector('.ink-menu-toggle');
if (dock && penToggle) {
  let compact = false;
  let menuOpen = false;

  function renderDock() {
    dock.classList.toggle('is-compact', compact);
    document.body.classList.toggle('compact-menu-open', compact && menuOpen);
    dock.hidden = compact && !menuOpen;
    penToggle.hidden = !compact;
    penToggle.setAttribute('aria-expanded', String(menuOpen));
    penToggle.setAttribute('aria-label', menuOpen ? 'Close navigation' : 'Open navigation');
  }

  let closeTimer;

  function showMenu() {
    clearTimeout(closeTimer);
    if (compact) {
      menuOpen = true;
      renderDock();
    }
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      if (dock.contains(document.activeElement) || penToggle === document.activeElement) return;
      menuOpen = false;
      renderDock();
    }, 250);
  }

  for (const surface of [penToggle, dock]) {
    surface.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') showMenu();
    });
    surface.addEventListener('pointerleave', scheduleClose);
    surface.addEventListener('focusout', scheduleClose);
  }

  dock.addEventListener('focusin', showMenu);

  penToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    renderDock();
  });
  dock.addEventListener('keydown', event => {
    if (event.key === 'Escape' && compact) {
      menuOpen = false;
      renderDock();
      penToggle.focus();
    }
  });
  dock.addEventListener('click', event => {
    if (event.target.closest('a')) {
      menuOpen = false;
      renderDock();
    }
  });
  function updateDockForScroll() {
    const nextCompact = window.scrollY > 4;
    if (nextCompact === compact) return;
    clearTimeout(closeTimer);
    compact = nextCompact;
    menuOpen = false;
    renderDock();
  }

  window.addEventListener('scroll', updateDockForScroll, { passive: true });
  window.addEventListener('pageshow', updateDockForScroll);
  updateDockForScroll();
}
