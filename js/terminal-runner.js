/**
 * personal-portfolio — js/terminal-runner.js
 * Interactive Mini Pipeline Sandbox & DuckDB SQL Profile Inspector in Bento Card 4.
 * Supports 4 modes:
 *  - clean : Valid schema contract -> Silver GeoParquet promotion
 *  - dupe  : Multi-source duplicate detection -> Entity Resolution merge
 *  - dlq   : Corrupt payload -> Dead-Letter Queue (DLQ) quarantine
 *  - sql   : DuckDB SQL query on Tan Loc's profile
 */
(function () {
  "use strict";

  function initTerminalRunner() {
    var runBtn = document.getElementById("btn-run-term");
    var termBody = document.querySelector(".bento-terminal .terminal-body");
    var termTitle = document.querySelector(".bento-terminal .term-title");
    var modeBtns = Array.prototype.slice.call(
      document.querySelectorAll(".term-mode-btn[data-term-mode]")
    );

    if (!runBtn || !termBody) return;

    var originalTitle = termTitle ? termTitle.textContent : "event_contract.py";
    var originalHTML = termBody.innerHTML;
    var isRunning = false;
    var isCompleted = false;
    var currentMode = "clean";

    var SCENARIOS = {
      clean: {
        title: "pytest test_contract.py --mode=clean",
        lines: [
          { text: "$ pytest test_contract.py -k test_valid_batch", cls: "term-run-info", delay: 80 },
          { text: "→ [1/3] Polars schema & UUID4 contract ... OK (1.2ms)", cls: "term-run-ok", delay: 260 },
          { text: "→ [2/3] SHA-256 checksum (1,000,000 / 1,000,000) ... MATCH", cls: "term-run-ok", delay: 520 },
          { text: "→ [3/3] Promoted to s3://silver/observations.parquet", cls: "term-run-ok", delay: 780 },
          { text: "✓ 0 dropped · 0 silent loss · idempotent snapshot ready", cls: "term-run-ok", delay: 1020 }
        ]
      },
      dupe: {
        title: "python -m propmatch.er --check-dupes",
        lines: [
          { text: "$ python -m propmatch.er --pass=multi_blocking", cls: "term-run-info", delay: 80 },
          { text: "⚠ Detected 2 listings for same property (drift: 118m)", cls: "term-run-warn", delay: 280 },
          { text: "→ NetworkX graph clustering similarity = 0.94 >= 0.85", cls: "term-run-info", delay: 540 },
          { text: "→ Merged into 1 canonical entity in dim_canonical.parquet", cls: "term-run-ok", delay: 800 },
          { text: "✓ Entity Resolution PASS · 0% false merge in Gold", cls: "term-run-ok", delay: 1040 }
        ]
      },
      dlq: {
        title: "python -m propmatch.ingest --strict-dlq",
        lines: [
          { text: "$ python -m propmatch.ingest --payload=corrupt_price.json", cls: "term-run-info", delay: 80 },
          { text: "✕ ValidationError: vnd_per_month=-5000000 (< 0)", cls: "term-run-warn", delay: 280 },
          { text: "→ Quarantined to s3://dead_letter/2026-11/trace.jsonl", cls: "term-run-info", delay: 540 },
          { text: "→ Silver & Gold tables untouched (atomic isolation)", cls: "term-run-ok", delay: 800 },
          { text: "✓ No Silent Data Loss · full traceback preserved", cls: "term-run-ok", delay: 1040 }
        ]
      },
      sql: {
        title: "duckdb -c \"SELECT * FROM tan_loc;\"",
        lines: [
          { text: "D SELECT key, value FROM candidate_profile;", cls: "term-run-info", delay: 80 },
          { text: "┌──────────────┬───────────────────────────────────────┐", cls: "term-run-ok", delay: 240 },
          { text: "│ focus        │ DE → DA → CV (HCMUTE · Class of 2027) │", cls: "term-run-ok", delay: 420 },
          { text: "│ internships  │ AWS FCAJ · QT-Data VN (2026)          │", cls: "term-run-ok", delay: 600 },
          { text: "│ publication  │ JTE Journal · DOI: 10.54644/jte.2148  │", cls: "term-run-ok", delay: 780 },
          { text: "└──────────────┴───────────────────────────────────────┘", cls: "term-run-ok", delay: 940 }
        ]
      }
    };

    function runSimulation(modeKey) {
      if (isRunning) return;
      var activeKey = modeKey || currentMode;
      var scenario = SCENARIOS[activeKey] || SCENARIOS.clean;
      currentMode = activeKey;

      modeBtns.forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-term-mode") === activeKey);
      });

      isRunning = true;
      runBtn.disabled = true;

      if (termTitle) termTitle.textContent = scenario.title;
      termBody.innerHTML = "";

      scenario.lines.forEach(function (step, idx) {
        setTimeout(function () {
          var p = document.createElement("p");
          p.className = "term-run-line " + step.cls;
          p.textContent = step.text;
          termBody.appendChild(p);

          requestAnimationFrame(function () {
            p.classList.add("is-printed");
          });

          if (idx === scenario.lines.length - 1) {
            isRunning = false;
            isCompleted = true;
            runBtn.disabled = false;
            var lang = document.documentElement.getAttribute("lang") || "en";
            runBtn.innerHTML =
              '<span class="btn-run-icon">↺</span> <span class="btn-run-text">' +
              (lang === "vi" ? "Khôi phục" : "Reset") +
              "</span>";
          }
        }, step.delay);
      });
    }

    function resetSimulation() {
      if (isRunning) return;
      termBody.innerHTML = originalHTML;
      if (termTitle) termTitle.textContent = originalTitle;
      isCompleted = false;
      var lang = document.documentElement.getAttribute("lang") || "en";
      runBtn.innerHTML =
        '<span class="btn-run-icon">▶</span> <span class="btn-run-text">' +
        (lang === "vi" ? "Chạy kiểm thử" : "Run Test") +
        "</span>";
    }

    runBtn.addEventListener("click", function () {
      if (isCompleted) {
        resetSimulation();
      } else {
        runSimulation(currentMode);
      }
    });

    modeBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var mode = btn.getAttribute("data-term-mode");
        runSimulation(mode);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTerminalRunner);
  } else {
    initTerminalRunner();
  }
})();
