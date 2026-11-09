const comparison = document.querySelector('[data-compare]');

if (comparison) {
  const buttons = Array.from(comparison.querySelectorAll('[data-variant]'));

  function selectVariant(selectedButton) {
    for (const button of buttons) {
      const active = button === selectedButton;
      button.setAttribute('aria-pressed', String(active));
      document.getElementById(button.getAttribute('aria-controls')).hidden = !active;
    }
  }

  for (const button of buttons) {
    button.addEventListener('click', () => selectVariant(button));
  }

  selectVariant(buttons[0]);
  comparison.classList.add('enhanced');
}
