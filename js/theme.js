/**
 * personal-portfolio — js/theme.js
 * Manages Dark / Light mode switching, localStorage persistence,
 * system preference listening, and meta theme-color sync.
 */
(function () {
  "use strict";

  var THEME_KEY = "pf-theme";
  var themeBtn = document.querySelector(".theme-toggle");
  var themeIcon = themeBtn ? themeBtn.querySelector(".theme-icon") : null;
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  function getPreferredTheme() {
    var saved;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch (e) {}
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      if (themeIcon) themeIcon.textContent = "☼";
      if (themeBtn) themeBtn.setAttribute("aria-label", "Switch to light theme");
      if (metaTheme) metaTheme.setAttribute("content", "#121110");
    } else {
      document.documentElement.removeAttribute("data-theme");
      if (themeIcon) themeIcon.textContent = "☾";
      if (themeBtn) themeBtn.setAttribute("aria-label", "Switch to dark theme");
      if (metaTheme) metaTheme.setAttribute("content", "#faf8f5");
    }
  }

  // Apply immediately on parse
  applyTheme(getPreferredTheme());

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var isDark = document.documentElement.getAttribute("data-theme") === "dark";
      var newTheme = isDark ? "light" : "dark";
      applyTheme(newTheme);
      try {
        localStorage.setItem(THEME_KEY, newTheme);
      } catch (e) {}
      if (window.PF_TOAST && typeof window.PF_TOAST.show === "function") {
        var isVi = document.documentElement.getAttribute("lang") === "vi";
        var msg = newTheme === "dark"
          ? (isVi ? "Đã bật giao diện Tối" : "Dark theme enabled")
          : (isVi ? "Đã bật giao diện Sáng" : "Light theme enabled");
        window.PF_TOAST.show(msg);
      }
    });
  }

  try {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      var saved;
      try {
        saved = localStorage.getItem(THEME_KEY);
      } catch (err) {}
      if (!saved) applyTheme(e.matches ? "dark" : "light");
    });
  } catch (e) {}
})();

