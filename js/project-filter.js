/**
 * personal-portfolio — js/project-filter.js
 * Filter buttons (All, DE, DA, CV). Hiding is instant (cards reflow to the
 * left immediately); showing is a short ease-out fade so the kept card
 * feels like it appeared, not flickered. Announces the visible count.
 */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = "cubic-bezier(0.23, 1, 0.32, 1)"; // strong ease-out

  function initProjectFilters() {
    var filterBtns = document.querySelectorAll(".project-filter-btn");
    var projects = Array.prototype.slice.call(document.querySelectorAll(".project"));
    var liveRegion = document.getElementById("filter-live");

    if (!filterBtns.length || !projects.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var category = btn.getAttribute("data-filter");

        filterBtns.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", String(active));
        });

        var visible = 0;
        projects.forEach(function (project) {
          var isMatch =
            category === "all" || project.classList.contains("project-" + category);

          if (isMatch) {
            visible++;
            if (project.style.display === "none") {
              project.style.display = "";
              if (!reduced && project.animate) {
                project.animate(
                  [
                    { opacity: 0, transform: "translateY(8px) scale(0.98)" },
                    { opacity: 1, transform: "none" }
                  ],
                  { duration: 200, easing: EASE }
                );
              }
            }
          } else if (project.style.display !== "none") {
            project.style.display = "none"; // instant: remaining cards reflow left
          }
        });

        if (liveRegion) {
          var isVi = document.documentElement.getAttribute("lang") === "vi";
          liveRegion.textContent = isVi
            ? "Đang hiện " + visible + " trên " + projects.length + " dự án"
            : "Showing " + visible + " of " + projects.length + " projects";
        }
      });
    });

    try {
      var qFilter = new URLSearchParams(window.location.search).get("filter");
      if (qFilter) {
        var targetBtn = document.querySelector(
          '.project-filter-btn[data-filter="' + qFilter.toLowerCase() + '"]'
        );
        if (targetBtn) {
          targetBtn.click();
          var projSec = document.getElementById("projects");
          if (projSec) {
            setTimeout(function () {
              projSec.scrollIntoView({ behavior: "smooth" });
            }, 80);
          }
        }
      }
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectFilters);
  } else {
    initProjectFilters();
  }
})();
