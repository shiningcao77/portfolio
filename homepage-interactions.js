// Motion belongs to the objects, leaving the desk steady.
const archiveScene = document.querySelector('.scene');
const archiveCards = [...document.querySelectorAll('.hanging-case')];
const archiveMotionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const archiveFinePointer = matchMedia('(hover: hover) and (pointer: fine)');

function archiveMotionEnabled() {
  return !archiveMotionPreference.matches && !archiveScene.classList.contains('motion-paused');
}

for (const card of archiveCards) {
  card.addEventListener('pointermove', event => {
    if (!archiveMotionEnabled() || !archiveFinePointer.matches) return;
    const bounds = card.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.setProperty('--card-x', (-vertical * 5).toFixed(2) + 'deg');
    card.style.setProperty('--card-y', (horizontal * 5).toFixed(2) + 'deg');
  });
  card.addEventListener('pointerleave', () => {
    card.style.removeProperty('--card-x');
    card.style.removeProperty('--card-y');
  });
}

if ('IntersectionObserver' in window && archiveMotionEnabled()) {
  const reveals = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        reveals.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });
  for (const card of archiveCards) {
    card.classList.add('reveal-ready');
    reveals.observe(card);
  }
}
