/**
 * personal-portfolio — js/contact-form.js
 * Handles asynchronous contact form submission to Formspree
 * with UI status feedback and graceful fallback to mailto:.
 */
(function () {
  "use strict";

  var contactForm = document.getElementById("contact-form");
  var submitBtn = document.getElementById("btn-submit");
  var formStatus = document.getElementById("form-status");

  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var lang = document.documentElement.getAttribute("lang") || "en";
    var sendingText = lang === "vi" ? "Đang gửi..." : "Sending...";
    var successText =
      lang === "vi"
        ? "✓ Đã gửi tin nhắn thành công! Tôi sẽ phản hồi sớm."
        : "✓ Message sent successfully! I'll get back to you soon.";
    var originalBtnText = submitBtn ? submitBtn.innerHTML : "";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = sendingText;
    }
    if (formStatus) {
      formStatus.textContent = "";
      formStatus.className = "form-status";
    }

    var formData = new FormData(contactForm);

    fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    })
      .then(function (res) {
        if (res.ok) {
          contactForm.reset();
          if (formStatus) {
            formStatus.textContent = successText;
            formStatus.classList.add("is-success");
          }
        } else {
          throw new Error("Formspree response not ok");
        }
      })
      .catch(function () {
        var name = formData.get("name") || "";
        var email = formData.get("email") || "";
        var message = formData.get("message") || "";
        var mailtoUrl =
          "mailto:ndtl05062005@gmail.com?subject=" +
          encodeURIComponent("Contact from " + name) +
          "&body=" +
          encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message);
        window.location.href = mailtoUrl;

        if (formStatus) {
          formStatus.textContent =
            lang === "vi"
              ? "Đang mở trình gửi email của bạn..."
              : "Opening your email client...";
          formStatus.classList.add("is-success");
        }
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      });
  });
})();

