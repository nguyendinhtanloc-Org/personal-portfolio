/**
 * personal-portfolio — js/clock.js
 * Displays live Ho Chi Minh City local time (UTC+7) in navigation.
 */
(function () {
  "use strict";

  function initClock() {
    var clockEl = document.getElementById("live-time-text");
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initClock);
  } else {
    initClock();
  }
})();

