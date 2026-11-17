let archiveTheme = 'dark';
try {
  if (localStorage.getItem('archive-theme') === 'light') archiveTheme = 'light';
} catch {}
document.documentElement.dataset.theme = archiveTheme;

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function renderTheme() {
    const isLight = archiveTheme === 'light';
    document.documentElement.dataset.theme = archiveTheme;
    toggle.textContent = isLight ? 'Dark mode' : 'Light mode';
    toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    toggle.setAttribute('aria-pressed', String(isLight));
    themeColor.content = isLight ? '#e9e5df' : '#292522';
  }

  toggle.addEventListener('click', () => {
    archiveTheme = archiveTheme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('archive-theme', archiveTheme); } catch {}
    renderTheme();
  });
  renderTheme();
});
