/**
 * personal-portfolio — js/project-filter.js
 * Interactive filter tabs for projects (All, DE, DA, CV).
 */
(function () {
  "use strict";

  function initProjectFilters() {
    var filterBtns = document.querySelectorAll(".project-filter-btn");
    var projects = document.querySelectorAll(".project");

    if (!filterBtns.length || !projects.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var category = btn.getAttribute("data-filter");

        // Update active tab button state
        filterBtns.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");

        // Filter projects with clean animation
        projects.forEach(function (project) {
          var isMatch =
            category === "all" || project.classList.contains("project-" + category);

          if (isMatch) {
            project.classList.remove("is-hidden");
          } else {
            project.classList.add("is-hidden");
          }
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectFilters);
  } else {
    initProjectFilters();
  }
})();

