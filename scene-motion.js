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
