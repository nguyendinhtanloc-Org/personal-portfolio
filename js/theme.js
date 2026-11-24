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
    themeBtn.addEventListener("click", function (e) {
      var isDark = document.documentElement.getAttribute("data-theme") === "dark";
      var newTheme = isDark ? "light" : "dark";
      var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function commitTheme() {
        applyTheme(newTheme);
        try {
          localStorage.setItem(THEME_KEY, newTheme);
        } catch (err) {}
      }

      if (document.startViewTransition && !prefersReduced) {
        var rect = themeBtn.getBoundingClientRect();
        var x = e && e.clientX ? e.clientX : rect.left + rect.width / 2;
        var y = e && e.clientY ? e.clientY : rect.top + rect.height / 2;
        var endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );
        var transition = document.startViewTransition(commitTheme);
        transition.ready.then(function () {
          document.documentElement.animate(
            {
              clipPath: [
                "circle(0px at " + x + "px " + y + "px)",
                "circle(" + endRadius + "px at " + x + "px " + y + "px)"
              ]
            },
            {
              duration: 420,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              pseudoElement: "::view-transition-new(root)"
            }
          );
        }).catch(function () {});
      } else {
        commitTheme();
      }

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

