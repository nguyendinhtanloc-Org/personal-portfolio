/**
 * personal-portfolio — js/contact-form.js
 * Handles asynchronous contact form submission to Formspree
 * with UI status feedback, quick intent template chips,
 * sessionStorage draft auto-save, and graceful fallback to mailto:.
 */
(function () {
  "use strict";

  var DRAFT_KEY = "pf-contact-draft";
  var contactForm = document.getElementById("contact-form");
  var submitBtn = document.getElementById("btn-submit");
  var formStatus = document.getElementById("form-status");

  if (!contactForm) return;

  var nameInput = document.getElementById("form-name");
  var emailInput = document.getElementById("form-email");
  var msgInput = document.getElementById("form-message");
  var intentChips = Array.prototype.slice.call(
    contactForm.querySelectorAll(".intent-chip[data-intent]")
  );

  var INTENT_TEMPLATES = {
    intern: {
      en: "Hi Tấn Lộc, I'm reaching out regarding a Data Engineering / Analytics / Computer Vision internship opportunity at [Company]. Would you be available for a brief chat this week?",
      vi: "Chào Tấn Lộc, mình liên hệ từ [Tên công ty] về cơ hội thực tập vị trí Data Engineering / Analytics / Computer Vision. Bạn có thể sắp xếp trao đổi ngắn trong tuần này không?"
    },
    project: {
      en: "Hi Tấn Lộc, I checked out your PropMatch Lakehouse & BDD100K Active Learning projects and would love to discuss a technical collaboration / engineering role.",
      vi: "Chào Tấn Lộc, mình đã xem qua dự án PropMatch Lakehouse & BDD100K Active Learning của bạn và muốn trao đổi thêm về cơ hội hợp tác / công việc kỹ thuật."
    },
    info: {
      en: "Hi Tấn Lộc, could you share your latest availability and academic transcript / additional project details?",
      vi: "Chào Tấn Lộc, bạn có thể gửi thêm thông tin về lịch làm việc dự kiến và chi tiết hồ sơ / dự án của bạn được không?"
    }
  };

  function saveDraft() {
    try {
      var payload = {
        name: nameInput ? nameInput.value : "",
        email: emailInput ? emailInput.value : "",
        message: msgInput ? msgInput.value : ""
      };
      if (payload.name || payload.email || payload.message) {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      } else {
        sessionStorage.removeItem(DRAFT_KEY);
      }
    } catch (e) {}
  }

  function restoreDraft() {
    try {
      var raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (nameInput && data.name && !nameInput.value) nameInput.value = data.name;
      if (emailInput && data.email && !emailInput.value) emailInput.value = data.email;
      if (msgInput && data.message && !msgInput.value) msgInput.value = data.message;
    } catch (e) {}
  }

  restoreDraft();

  [nameInput, emailInput, msgInput].forEach(function (el) {
    if (el) el.addEventListener("input", saveDraft);
  });

  intentChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var key = chip.getAttribute("data-intent");
      var tpl = INTENT_TEMPLATES[key];
      if (!tpl || !msgInput) return;
      var lang = document.documentElement.getAttribute("lang") === "vi" ? "vi" : "en";
      msgInput.value = tpl[lang] || tpl.en;
      intentChips.forEach(function (c) {
        c.classList.toggle("is-active", c === chip);
      });
      msgInput.focus();
      saveDraft();
    });
  });

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
          try { sessionStorage.removeItem(DRAFT_KEY); } catch (err) {}
          intentChips.forEach(function (c) { c.classList.remove("is-active"); });
          if (formStatus) {
            formStatus.textContent = successText;
            formStatus.classList.add("is-success");
          }
          if (window.PF_TOAST && typeof window.PF_TOAST.show === "function") {
            window.PF_TOAST.show(successText);
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

