/**
 * personal-portfolio — js/clock.js
 * Displays live Ho Chi Minh City local time (UTC+7) in navigation
 * and shows smart availability / timezone comparison on click.
 */
(function () {
  "use strict";

  function initClock() {
    var clockEl = document.getElementById("live-time-text");
    var pillEl = document.getElementById("live-time-pill");
    if (!clockEl) return;

    function updateTime() {
      try {
        var options = {
          timeZone: "Asia/Ho_Chi_Minh",
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        };
        var formatter = new Intl.DateTimeFormat([], options);
        var timeStr = formatter.format(new Date());
        clockEl.textContent = "HCM " + timeStr + " (UTC+7)";
      } catch (e) {
        var d = new Date();
        clockEl.textContent = "HCM " + d.toLocaleTimeString() + " (UTC+7)";
      }
    }

    updateTime();
    setInterval(updateTime, 1000);

    if (pillEl) {
      pillEl.style.cursor = "pointer";
      pillEl.setAttribute("role", "button");
      pillEl.setAttribute("tabindex", "0");

      function showAvailabilityToast() {
        if (!window.PF_TOAST || typeof window.PF_TOAST.show !== "function") return;
        var isVi = document.documentElement.getAttribute("lang") === "vi";
        var now = new Date();
        var utcHours = now.getUTCHours();
        var hcmHour = (utcHours + 7) % 24;
        var isWorkingHours = hcmHour >= 8 && hcmHour < 22;

        // Visitor timezone offset vs UTC+7 (in hours)
        var visitorUtcOffset = -now.getTimezoneOffset() / 60;
        var diff = visitorUtcOffset - 7;
        var diffLabel = diff === 0
          ? (isVi ? "Cùng múi giờ với bạn" : "Same timezone as you")
          : (diff > 0 ? "UTC+" + visitorUtcOffset : "UTC" + visitorUtcOffset);

        var statusMsg = isWorkingHours
          ? (isVi
              ? "Đang trong giờ làm việc tại TP.HCM · " + diffLabel
              : "Active hours in HCM (UTC+7) · " + diffLabel)
          : (isVi
              ? "Ngoài giờ hành chính tại TP.HCM · Phản hồi sáng mai"
              : "After hours in HCM (UTC+7) · Replies within 24h");

        window.PF_TOAST.show(statusMsg);
      }

      pillEl.addEventListener("click", showAvailabilityToast);
      pillEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          showAvailabilityToast();
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initClock);
  } else {
    initClock();
  }
})();
