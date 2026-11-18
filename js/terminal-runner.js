/**
 * personal-portfolio — js/terminal-runner.js
 * Interactive live test runner simulation in Bento Card 4.
 */
(function () {
  "use strict";

  function initTerminalRunner() {
    var runBtn = document.getElementById("btn-run-term");
    var termBody = document.querySelector(".bento-terminal .terminal-body");
    var termTitle = document.querySelector(".bento-terminal .term-title");

    if (!runBtn || !termBody) return;

    var originalTitle = termTitle ? termTitle.textContent : "event_contract.py";
    var originalHTML = termBody.innerHTML;
    var isRunning = false;
    var isCompleted = false;

    var logLines = [
      { text: "$ pytest test_cdc_pipeline.py -v   (simulated — real test suite pending)", cls: "term-run-info", delay: 150 },
      { text: "→ [1/3] test_broker_handshake (latency: 14ms) ... OK", cls: "term-run-ok", delay: 400 },
      { text: "→ [2/3] test_reconcile_checksum (1,000,000 / 1,000,000) ... MATCH", cls: "term-run-ok", delay: 850 },
      { text: "→ [3/3] test_zero_loss_at_restart (0 dropped, 0 dupes) ... PASS", cls: "term-run-ok", delay: 1300 },
      { text: "✓ 3 passed in 0.05s — demo of the test format I use", cls: "term-run-ok", delay: 1750 }
    ];

    function runSimulation() {
      if (isRunning) return;
      isRunning = true;
      runBtn.disabled = true;

      if (termTitle) termTitle.textContent = "pytest test_cdc_pipeline.py";
      termBody.innerHTML = "";

      logLines.forEach(function (step, idx) {
        setTimeout(function () {
          var p = document.createElement("p");
          p.className = "term-run-line " + step.cls;
          p.textContent = step.text;
          termBody.appendChild(p);

          // Force layout & animate
          requestAnimationFrame(function () {
            p.classList.add("is-printed");
          });

          if (idx === logLines.length - 1) {
            isRunning = false;
            isCompleted = true;
            runBtn.disabled = false;
            var lang = document.documentElement.getAttribute("lang") || "en";
            runBtn.innerHTML = '<span class="btn-run-icon">↺</span> <span class="btn-run-text">' +
              (lang === "vi" ? "Khôi phục" : "Reset") + '</span>';
          }
        }, step.delay);
      });
    }

    function resetSimulation() {
      termBody.innerHTML = originalHTML;
      if (termTitle) termTitle.textContent = originalTitle;
      isCompleted = false;
      var lang = document.documentElement.getAttribute("lang") || "en";
      runBtn.innerHTML = '<span class="btn-run-icon">▶</span> <span class="btn-run-text">' +
        (lang === "vi" ? "Chạy kiểm thử" : "Run Test") + '</span>';
    }

    runBtn.addEventListener("click", function () {
      if (isCompleted) {
        resetSimulation();
      } else {
        runSimulation();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTerminalRunner);
  } else {
    initTerminalRunner();
  }
})();

