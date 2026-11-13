/**
 * personal-portfolio — js/modal.js
 * Controls certificate lightbox modal:
 * open, close, dynamic image swap, backdrop click, Escape key, and body scroll-lock.
 */
(function () {
  "use strict";

  var certModal = document.getElementById("cert-modal");
  var certCloseBtn = document.getElementById("cert-modal-close");
  var certBackdrop = document.getElementById("cert-modal-backdrop");
  var certTriggers = document.querySelectorAll(".btn-cert-link");

  function openCertModal() {
    if (!certModal) return;
    certModal.classList.add("is-active");
    certModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove("is-active");
    certModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  certTriggers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var certSrc = btn.getAttribute("data-cert");
      if (certSrc && certModal) {
        var modalImg = certModal.querySelector(".cert-full-image");
        var modalLink = certModal.querySelector(".cert-modal-external");
        if (modalImg) modalImg.src = certSrc;
        if (modalLink) modalLink.href = certSrc;
      }
      openCertModal();
    });
  });

  if (certCloseBtn) certCloseBtn.addEventListener("click", closeCertModal);
  if (certBackdrop) certBackdrop.addEventListener("click", closeCertModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && certModal && certModal.classList.contains("is-active")) {
      closeCertModal();
    }
  });
})();
