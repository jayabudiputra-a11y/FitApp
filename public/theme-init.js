// public/theme-init.js
(function() {
  try {
    const savedTheme = localStorage.getItem('theme');
    const supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && supportDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error("Theme init error", e);
  }
})();