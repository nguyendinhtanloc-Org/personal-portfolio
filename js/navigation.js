/**
 * personal-portfolio — js/navigation.js
 * Handles navigation interactions, scroll-spy, reading progress bar,
 * copy-to-clipboard, reveal-on-scroll animations, and current year.
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Mobile Nav Toggle ---------- */
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

  /* ---------- Scroll-spy & Reading Progress Bar ---------- */
  var progressBar = document.getElementById("progress-bar");
  function updateProgressBar() {
    if (!progressBar) return;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) {
      progressBar.style.width = "0%";
      return;
    }
    var progress = (window.scrollY / maxScroll) * 100;
    progressBar.style.width = Math.min(100, Math.max(0, progress)) + "%";
  }

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
            updateProgressBar();
            ticking = false;
          });
        }
      },
      { passive: true }
    );
    setActive();
    updateProgressBar();
  }

  /* ---------- Copy to Clipboard ---------- */
  var copyButtons = Array.prototype.slice.call(
    document.querySelectorAll(".btn-copy")
  );
  copyButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var text = btn.getAttribute("data-copy");
      if (!text) return;

      var originalText = btn.textContent;

      function onCopied() {
        btn.textContent = "COPIED";
        btn.classList.add("is-copied");
        setTimeout(function () {
          btn.textContent = originalText;
          btn.classList.remove("is-copied");
        }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(onCopied).catch(function () {
          fallbackCopy(text, onCopied);
        });
      } else {
        fallbackCopy(text, onCopied);
      }
    });
  });

  function fallbackCopy(text, cb) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      cb();
    } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------- Reveal on Scroll ---------- */
  var revealables = Array.prototype.slice.call(
    document.querySelectorAll(
      ".section-head, .skill-group, .timeline-item, .bento-card, .contact-line"
    )
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

  /* ---------- Footer Dynamic Year ---------- */
  var yearEl = document.querySelector(".js-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Back to Top Button ---------- */
  var footerTopLinks = Array.prototype.slice.call(
    document.querySelectorAll(".footer-top")
  );
  footerTopLinks.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var topAnchor = document.getElementById("top");
      if (prefersReducedMotion) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (topAnchor && typeof topAnchor.focus === "function") {
        try {
          topAnchor.focus({ preventScroll: true });
        } catch (err) {
          topAnchor.focus();
        }
      }
      if (window.history && window.history.pushState) {
        window.history.pushState(null, "", "#top");
      }
    });
  });
})();

