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
    const title = link.querySelector('strong')?.textContent || link.querySelector('span')?.textContent;
    const inspect = () => { statusLine.textContent = 'INSPECT / ' + title.trim() + ' — open case ↗'; };
    const reset = () => { statusLine.textContent = 'INVESTIGATE / Select a case file'; };
    link.addEventListener('pointerenter', inspect);
    link.addEventListener('pointerleave', reset);
    link.addEventListener('focus', inspect);
    link.addEventListener('blur', reset);
  }
}
