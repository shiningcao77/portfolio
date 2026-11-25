const scene = document.querySelector('.scene');
const motionButton = document.querySelector('.motion-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let pausedByVisitor = false;
try {
  pausedByVisitor = localStorage.getItem('archive-motion-paused') === 'true';
} catch {}

function updateMotion() {
  const paused = reducedMotion.matches || pausedByVisitor;
  scene.classList.toggle('motion-paused', paused);
  document.body.classList.toggle('motion-paused', paused);
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

}

for (const card of document.querySelectorAll('.hanging-case')) {
  const front = card.querySelector('.case-front');
  const back = card.querySelector('.case-back');
  function showBack(flipped) {
    card.classList.toggle('is-flipped', flipped);
    front.inert = flipped;
    back.inert = !flipped;
  }
  card.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' && matchMedia('(hover: hover)').matches) showBack(true);
  });
  card.addEventListener('pointerleave', () => {
    if (!back.contains(document.activeElement)) showBack(false);
  });
  card.addEventListener('focusout', event => {
    if (!card.contains(event.relatedTarget)) showBack(false);
  });
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

const copyEmail = document.querySelector('.copy-email');
if (copyEmail) {
  const copyStatus = document.querySelector('.copy-email-status');
  copyEmail.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyEmail.textContent.trim());
      copyStatus.textContent = 'Email copied.';
    } catch {
      copyStatus.textContent = 'Could not copy. Select the address to copy it manually.';
    }
  });
}

// Align the expanded navigation with the folder as its content reflows.
const caseFolder = document.querySelector('.case-folder');
if (dock && caseFolder) {
  function alignDockWithFolder() {
    const bounds = caseFolder.getBoundingClientRect();
    dock.style.setProperty('--case-file-center', (bounds.top + window.scrollY + bounds.height / 2) + 'px');
  }
  alignDockWithFolder();
  window.addEventListener('resize', alignDockWithFolder);
  if ('ResizeObserver' in window) {
    new ResizeObserver(alignDockWithFolder).observe(caseFolder);
  }
}
