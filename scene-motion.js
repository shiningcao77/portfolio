const scene = document.querySelector('.scene');
const motionButton = document.querySelector('.motion-toggle');
const statusLine = document.querySelector('.desk-status');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
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

// The lens redraws the actual card lettering at the pointer location.
if (scene) {
  const lens = document.createElement('div');
  lens.className = 'case-lens';
  lens.hidden = true;
  lens.setAttribute('aria-hidden', 'true');
  document.body.append(lens);

  // A small displacement gives the enlarged lettering a rounded glass surface.
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  filter.setAttribute('width', '0');
  filter.setAttribute('height', '0');
  filter.setAttribute('aria-hidden', 'true');
  filter.style.position = 'absolute';
  filter.innerHTML = '<defs><filter id="lens-curve" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".008" numOctaves="1" seed="3" result="curve"/><feDisplacementMap in="SourceGraphic" in2="curve" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
  document.body.append(filter);

  function hideLens() { lens.hidden = true; }

  function copyAppearance(source) {
    const copy = source.cloneNode(true);
    const originals = [source, ...source.querySelectorAll('*')];
    const copies = [copy, ...copy.querySelectorAll('*')];
    originals.forEach((element, index) => {
      const style = getComputedStyle(element);
      for (const property of style) {
        copies[index].style.setProperty(property, style.getPropertyValue(property));
      }
      copies[index].removeAttribute('id');
      copies[index].removeAttribute('href');
      copies[index].removeAttribute('tabindex');
    });
    copy.className = 'case-lens-copy';
    copy.style.position = 'absolute';
    copy.style.margin = '0';
    copy.style.transform = 'scale(1.65)';
    copy.style.transformOrigin = '0 0';
    copy.style.filter = 'url("#lens-curve")';
    copy.style.transition = 'none';
    copy.style.translate = 'none';
    copy.style.pointerEvents = 'none';
    return copy;
  }

  for (const card of scene.querySelectorAll('.scene-card, .scattered')) {
    let copy;
    // Text labels on angled photographs stay legible through the lens.
    const source = card.matches('.scattered') ? card.querySelector('span') : card;
    card.addEventListener('mouseenter', (event) => {
      if (!finePointer.matches) return;
      copy = copyAppearance(source);
      lens.replaceChildren(copy);
    });
    card.addEventListener('mousemove', (event) => {
      if (!copy || !finePointer.matches) return;
      const bounds = source.getBoundingClientRect();
      const x = event.clientX;
      const y = event.clientY;
      if (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) {
        hideLens();
        return;
      }
      lens.hidden = false;
      lens.style.left = (x - 42) + 'px';
      lens.style.top = (y - 42) + 'px';
      copy.style.left = (42 - (x - bounds.left) * 1.65) + 'px';
      copy.style.top = (42 - (y - bounds.top) * 1.65) + 'px';
    });
    card.addEventListener('mouseleave', hideLens);
    card.addEventListener('click', hideLens);
  }
  window.addEventListener('scroll', hideLens, { passive: true });
  window.addEventListener('blur', hideLens);
  window.addEventListener('resize', hideLens);
}
