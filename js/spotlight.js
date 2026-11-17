/**
 * personal-portfolio — js/spotlight.js
 * Mouse-tracking Spotlight Glow on Bento cards and Project cards.
 * Uses hardware-accelerated CSS custom properties (--mouse-x, --mouse-y).
 */
(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // Skip touch-only devices
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  function initSpotlight() {
    var cards = document.querySelectorAll(".bento-card, .project");
    cards.forEach(function (card) {
      card.classList.add("spotlight-card");
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", x + "px");
        card.style.setProperty("--mouse-y", y + "px");
      });
      card.addEventListener("mouseleave", function () {
        card.style.setProperty("--mouse-x", "-999px");
        card.style.setProperty("--mouse-y", "-999px");
      });
    });

    // Event delegation for dynamically rendered cards (e.g. .endorsement-card)
    var activeCard = null;
    document.addEventListener("mousemove", function (e) {
      var card = e.target.closest(".endorsement-card.spotlight-card");
      if (activeCard && activeCard !== card) {
        activeCard.style.setProperty("--mouse-x", "-999px");
        activeCard.style.setProperty("--mouse-y", "-999px");
      }
      activeCard = card;
      if (!card) return;
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", e.clientX - rect.left + "px");
      card.style.setProperty("--mouse-y", e.clientY - rect.top + "px");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSpotlight);
  } else {
    initSpotlight();
  }
})();

