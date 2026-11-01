/**
 * personal-portfolio — main.js
 * Slim behaviour layer (zero dependencies):
 *  - scroll-spy for the nav links
 *  - reveal-on-scroll for .reveal elements (skipped on prefers-reduced-motion)
 *  - current year in the footer
 * The site is fully usable without JS.
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a") && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Scroll-spy ---------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll("a[href^='#'][data-spy]")
  );
  var targets = links
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  function setActive() {
    var pos = window.scrollY + window.innerHeight * 0.35;
    var current = targets[0];
    for (var i = 0; i < targets.length; i++) {
      if (targets[i].offsetTop <= pos) current = targets[i];
    }
    links.forEach(function (link) {
      var isActive =
        link.getAttribute("href") === "#" + current.id ||
        (current.id === "home" && window.scrollY < 400 && link.getAttribute("href") === "#home");
      link.classList.toggle("is-active", isActive);
    });
  }

  if (links.length && targets.length) {
    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(function () {
            setActive();
            ticking = false;
          });
        }
      },
      { passive: true }
    );
    setActive();
  }

  /* ---------- Reveal on scroll ---------- */
  var revealables = Array.prototype.slice.call(
    document.querySelectorAll(".section-head, .skill-group, .timeline-item, .about-grid > div, .about-grid > aside, .contact-line")
  );

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    revealables.forEach(function (el) {
      el.classList.add("reveal");
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    revealables.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector(".js-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
