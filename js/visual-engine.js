/**
 * personal-portfolio — js/visual-engine.js
 * High-craft interactive visual & 3D engine (60-120fps, zero dependencies):
 *  1. System Telemetry Boot Curtain (0.85s cold-start sequence, once per session)
 *  2. Hero HTML5 Canvas — NetworkX Entity Graph & Shockwave Ripple
 *  3. Hero 3D Isometric Exploded Architecture View ([2D / 3D] toggle + interactive orbit)
 *  4. 3D Perspective Card Tilt & Holographic Champagne Glare
 *  5. Magnetic Controls & Precision Spring Cursor Ring (Desktop fine pointer only)
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  var isFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  function getLang() {
    return document.documentElement.getAttribute("lang") === "vi" ? "vi" : "en";
  }

  /* ============================================================
     1. SYSTEM TELEMETRY BOOT CURTAIN (0.85s Cold-Start)
     ============================================================ */
  var curtain = document.getElementById("boot-curtain");
  var pctEl = document.getElementById("boot-pct");
  var barEl = document.getElementById("boot-bar-fill");
  var logEl = document.getElementById("boot-log");
  var bootRunning = false;

  var LOG_STEPS = [
    "[01/03] MOUNTING MINIO + DUCKDB SPATIAL LAKEHOUSE...",
    "[02/03] VERIFYING 3D IPF / SINKHORN ACTIVE LEARNING (35/35)...",
    "[03/03] SYSTEM READY · LAUNCHING INTERFACE"
  ];

  function runBootSequence(force) {
    if (!curtain || bootRunning) return;
    if (
      !force &&
      (prefersReducedMotion ||
        document.documentElement.getAttribute("data-boot") === "done")
    ) {
      document.documentElement.setAttribute("data-boot", "done");
      return;
    }

    bootRunning = true;
    document.documentElement.removeAttribute("data-boot");
    curtain.classList.remove("is-lifting");
    if (pctEl) pctEl.textContent = "00%";
    if (barEl) barEl.style.width = "0%";
    if (logEl) logEl.textContent = LOG_STEPS[0];

    var duration = 820;
    var start = performance.now();

    function frame(now) {
      var elapsed = now - start;
      var t = Math.min(1, elapsed / duration);
      // Cubic ease-out for crisp telemetry counter
      var eased = 1 - Math.pow(1 - t, 3);
      var pct = Math.round(eased * 100);

      if (pctEl) {
        pctEl.textContent = (pct < 10 ? "0" + pct : String(pct)) + "%";
      }
      if (barEl) {
        barEl.style.width = pct + "%";
      }
      if (logEl) {
        if (pct < 45) logEl.textContent = LOG_STEPS[0];
        else if (pct < 88) logEl.textContent = LOG_STEPS[1];
        else logEl.textContent = LOG_STEPS[2];
      }

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        try {
          sessionStorage.setItem("pf-booted", "1");
        } catch (e) {}
        curtain.classList.add("is-lifting");
        setTimeout(function () {
          document.documentElement.setAttribute("data-boot", "done");
          curtain.classList.remove("is-lifting");
          bootRunning = false;
        }, 620);
      }
    }

    requestAnimationFrame(frame);
  }

  window.PF_REPLAY_BOOT = function () {
    runBootSequence(true);
  };

  runBootSequence(false);

  /* ============================================================
     2. HERO <CANVAS> — NETWORKX ENTITY GRAPH & SHOCKWAVE
     ============================================================ */
  var canvas = document.getElementById("hero-canvas");
  var heroSec = document.querySelector(".hero");
  var shockwaves = [];

  if (canvas && heroSec && !prefersReducedMotion) {
    var ctx = canvas.getContext("2d");
    var width = 0;
    var height = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [];
    var isHeroVisible = true;
    var rafId = null;
    var mouse = { x: -9999, y: -9999, active: false };

    function isDark() {
      return document.documentElement.getAttribute("data-theme") === "dark";
    }

    function resizeCanvas() {
      var rect = heroSec.getBoundingClientRect();
      width = Math.max(300, Math.floor(rect.width));
      height = Math.max(300, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initNodes() {
      var count = width < 768 ? 20 : 38;
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.42,
          vy: (Math.random() - 0.5) * 0.42,
          r: 1.5 + Math.random() * 1.3,
          accent: i % 3 === 0
        });
      }
    }

    function triggerShockwave() {
      var visualEl = document.getElementById("hero-visual");
      var cx = width * 0.72;
      var cy = height * 0.48;
      if (visualEl && heroSec) {
        var hRect = heroSec.getBoundingClientRect();
        var vRect = visualEl.getBoundingClientRect();
        cx = vRect.left - hRect.left + vRect.width * 0.5;
        cy = vRect.top - hRect.top + vRect.height * 0.38;
      }
      shockwaves.push({
        x: cx,
        y: cy,
        r: 16,
        maxR: Math.max(width, height) * 0.85,
        alpha: 0.85
      });
      if (!rafId && isHeroVisible) {
        rafId = requestAnimationFrame(drawCanvas);
      }
    }

    window.PF_HERO_SHOCKWAVE = triggerShockwave;

    function drawCanvas() {
      if (!isHeroVisible || document.hidden) {
        rafId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      var dark = isDark();
      var accentRgb = dark ? "212, 163, 89" : "180, 131, 62";
      var mutedRgb = dark ? "160, 154, 144" : "115, 110, 102";
      var linkDist = width < 768 ? 96 : 132;

      // Update active shockwaves
      for (var s = shockwaves.length - 1; s >= 0; s--) {
        var sw = shockwaves[s];
        sw.r += 11;
        sw.alpha = Math.max(0, 0.85 * (1 - sw.r / sw.maxR));

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(" + accentRgb + ", " + (sw.alpha * 0.55).toFixed(3) + ")";
        ctx.lineWidth = 1.6;
        ctx.stroke();

        if (sw.r >= sw.maxR) {
          shockwaves.splice(s, 1);
        }
      }

      // Update node positions
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 12 || n.x > width - 12) n.vx *= -1;
        if (n.y < 12 || n.y > height - 12) n.vy *= -1;

        // Cursor field attraction/interaction
        if (mouse.active) {
          var mdx = mouse.x - n.x;
          var mdy = mouse.y - n.y;
          var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 155 && mDist > 1) {
            var pull = (1 - mDist / 155) * 0.022;
            n.x += mdx * pull;
            n.y += mdy * pull;
          }
        }

        // Shockwave impulse push
        for (var k = 0; k < shockwaves.length; k++) {
          var wave = shockwaves[k];
          var wdx = n.x - wave.x;
          var wdy = n.y - wave.y;
          var wDist = Math.sqrt(wdx * wdx + wdy * wdy) || 1;
          if (Math.abs(wDist - wave.r) < 34) {
            n.x += (wdx / wDist) * 1.8;
            n.y += (wdy / wDist) * 1.8;
          }
        }
      }

      // Draw edges between nearby nodes
      for (var a = 0; a < nodes.length; a++) {
        var na = nodes[a];
        for (var b = a + 1; b < nodes.length; b++) {
          var nb = nodes[b];
          var dx = na.x - nb.x;
          var dy = na.y - nb.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            var baseAlpha = (1 - dist / linkDist) * (dark ? 0.22 : 0.16);
            var isGoldEdge = na.accent || nb.accent;

            // Boost edge brightness near cursor or shockwave front
            if (mouse.active) {
              var cdx = (na.x + nb.x) * 0.5 - mouse.x;
              var cdy = (na.y + nb.y) * 0.5 - mouse.y;
              if (cdx * cdx + cdy * cdy < 22500) {
                baseAlpha = Math.min(0.55, baseAlpha * 2.4);
                isGoldEdge = true;
              }
            }

            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.strokeStyle =
              "rgba(" +
              (isGoldEdge ? accentRgb : mutedRgb) +
              ", " +
              baseAlpha.toFixed(3) +
              ")";
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        // Draw cursor connection line
        if (mouse.active) {
          var cmx = mouse.x - na.x;
          var cmy = mouse.y - na.y;
          var cmDist = Math.sqrt(cmx * cmx + cmy * cmy);
          if (cmDist < 145) {
            var cAlpha = (1 - cmDist / 145) * 0.36;
            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = "rgba(" + accentRgb + ", " + cAlpha.toFixed(3) + ")";
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (var j = 0; j < nodes.length; j++) {
        var nd = nodes[j];
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
        ctx.fillStyle = nd.accent
          ? "rgba(" + accentRgb + ", " + (dark ? "0.72" : "0.62") + ")"
          : "rgba(" + mutedRgb + ", " + (dark ? "0.42" : "0.34") + ")";
        ctx.fill();
      }

      rafId = requestAnimationFrame(drawCanvas);
    }

    resizeCanvas();
    initNodes();
    rafId = requestAnimationFrame(drawCanvas);

    window.addEventListener(
      "resize",
      function () {
        resizeCanvas();
        if (!nodes.length) initNodes();
      },
      { passive: true }
    );

    if (isFinePointer) {
      heroSec.addEventListener(
        "mousemove",
        function (e) {
          var rect = heroSec.getBoundingClientRect();
          mouse.x = e.clientX - rect.left;
          mouse.y = e.clientY - rect.top;
          mouse.active = true;
        },
        { passive: true }
      );
      heroSec.addEventListener(
        "mouseleave",
        function () {
          mouse.active = false;
        },
        { passive: true }
      );
    }

    if ("IntersectionObserver" in window) {
      var heroObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            isHeroVisible = entry.isIntersecting;
            if (isHeroVisible && !rafId) {
              rafId = requestAnimationFrame(drawCanvas);
            }
          });
        },
        { threshold: 0.02 }
      );
      heroObserver.observe(heroSec);
    }

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && isHeroVisible && !rafId) {
        rafId = requestAnimationFrame(drawCanvas);
      }
    });
  }

  /* ============================================================
     3. HERO 3D ISOMETRIC EXPLODED ARCHITECTURE VIEW (120fps 3-Axis)
     ============================================================ */
  var heroVisual = document.getElementById("hero-visual");
  var heroStage = document.getElementById("hero-motif-stage");
  var isoRig = document.getElementById("iso-rig");
  var btnHero3d = document.getElementById("btn-hero-3d");

  if (heroVisual && btnHero3d && isoRig) {
    var isoState = {
      active: false,
      curRX: 0,
      curRY: 0,
      curRZ: 0,
      curScale: 1,
      tarRX: 0,
      tarRY: 0,
      tarRZ: 0,
      tarScale: 1,
      raf: null
    };

    function tickIsoRig() {
      isoState.curRX += (isoState.tarRX - isoState.curRX) * 0.18;
      isoState.curRY += (isoState.tarRY - isoState.curRY) * 0.18;
      isoState.curRZ += (isoState.tarRZ - isoState.curRZ) * 0.18;
      isoState.curScale += (isoState.tarScale - isoState.curScale) * 0.18;

      var s = isoState.curScale.toFixed(3);
      isoRig.style.transform =
        "rotateX(" +
        isoState.curRX.toFixed(2) +
        "deg) rotateY(" +
        isoState.curRY.toFixed(2) +
        "deg) rotateZ(" +
        isoState.curRZ.toFixed(2) +
        "deg) scale3d(" +
        s +
        ", " +
        s +
        ", 1)";

      var done =
        Math.abs(isoState.tarRX - isoState.curRX) < 0.04 &&
        Math.abs(isoState.tarRY - isoState.curRY) < 0.04 &&
        Math.abs(isoState.tarRZ - isoState.curRZ) < 0.04 &&
        Math.abs(isoState.tarScale - isoState.curScale) < 0.003;

      if (!done) {
        isoState.raf = requestAnimationFrame(tickIsoRig);
      } else {
        if (!isoState.active) {
          isoRig.style.removeProperty("transform");
        }
        isoState.raf = null;
      }
    }

    function setIsoTarget(rx, ry, rz, sc) {
      isoState.tarRX = rx;
      isoState.tarRY = ry;
      isoState.tarRZ = rz;
      isoState.tarScale = sc;
      if (!isoState.raf) {
        isoState.raf = requestAnimationFrame(tickIsoRig);
      }
    }

    btnHero3d.addEventListener("click", function () {
      var active = heroVisual.classList.toggle("is-3d-iso");
      isoState.active = active;
      btnHero3d.setAttribute("aria-pressed", String(active));
      btnHero3d.classList.toggle("is-active", active);

      if (active) {
        setIsoTarget(36, -14, 12, 0.9);
      } else {
        setIsoTarget(0, 0, 0, 1);
      }

      if (window.PF_HERO_SHOCKWAVE) {
        window.PF_HERO_SHOCKWAVE();
      }
      if (window.PF_TOAST && typeof window.PF_TOAST.show === "function") {
        var isVi = getLang() === "vi";
        window.PF_TOAST.show(
          active
            ? isVi
              ? "Đã bật không gian 3D đa tầng (di chuột để xoay tự do 360°)"
              : "3D multi-plane view enabled (move cursor to orbit freely)"
            : isVi
              ? "Đã chuyển về sơ đồ phẳng 2D"
              : "Switched to 2D schematic view"
        );
      }
    });

    function orbitFromPoint(clientX, clientY) {
      if (!isoState.active || prefersReducedMotion) return;
      var rect = (heroStage || heroVisual).getBoundingClientRect();
      var nx = Math.max(-0.6, Math.min(0.6, (clientX - rect.left) / rect.width - 0.5));
      var ny = Math.max(-0.6, Math.min(0.6, (clientY - rect.top) / rect.height - 0.5));
      // Responsive 3-axis orbit following cursor smoothly
      var rx = 34 - ny * 46;
      var ry = nx * 48;
      var rz = 10 - nx * 30;
      setIsoTarget(rx, ry, rz, 0.9);
    }

    heroVisual.addEventListener(
      "mousemove",
      function (e) {
        orbitFromPoint(e.clientX, e.clientY);
      },
      { passive: true }
    );

    heroVisual.addEventListener(
      "mouseleave",
      function () {
        if (!isoState.active) return;
        setIsoTarget(36, -14, 12, 0.9);
      },
      { passive: true }
    );

    heroVisual.addEventListener(
      "touchmove",
      function (e) {
        if (!isoState.active || !e.touches || !e.touches[0]) return;
        orbitFromPoint(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: true }
    );
  }

  /* ============================================================
     4. 3D PERSPECTIVE TILT & HOLOGRAPHIC CHAMPAGNE GLARE
     ============================================================ */
  if (isFinePointer && !prefersReducedMotion) {
    var tiltCards = Array.prototype.slice.call(
      document.querySelectorAll(".project, .bento-portrait-card")
    );

    tiltCards.forEach(function (card) {
      var glare = document.createElement("div");
      glare.className = "card-glare";
      glare.setAttribute("aria-hidden", "true");
      card.appendChild(glare);

      var state = {
        curX: 0,
        curY: 0,
        tarX: 0,
        tarY: 0,
        gx: 50,
        gy: 50,
        hovering: false,
        raf: null
      };

      function updateTilt() {
        state.curX += (state.tarX - state.curX) * 0.16;
        state.curY += (state.tarY - state.curY) * 0.16;

        card.style.transform =
          "perspective(1050px) rotateX(" +
          state.curX.toFixed(2) +
          "deg) rotateY(" +
          state.curY.toFixed(2) +
          "deg) translateY(" +
          (state.hovering ? "-3px" : "0px") +
          ")";
        card.style.setProperty("--gx", state.gx.toFixed(1) + "%");
        card.style.setProperty("--gy", state.gy.toFixed(1) + "%");

        var settled =
          !state.hovering &&
          Math.abs(state.curX) < 0.05 &&
          Math.abs(state.curY) < 0.05;

        if (!settled) {
          state.raf = requestAnimationFrame(updateTilt);
        } else {
          card.style.removeProperty("transform");
          card.classList.remove("is-tilting");
          state.raf = null;
        }
      }

      card.addEventListener(
        "mousemove",
        function (e) {
          var rect = card.getBoundingClientRect();
          var px = (e.clientX - rect.left) / rect.width;
          var py = (e.clientY - rect.top) / rect.height;
          state.gx = px * 100;
          state.gy = py * 100;
          // Max tilt ±4.2 deg for refined engineering feel
          state.tarX = (0.5 - py) * 8.4;
          state.tarY = (px - 0.5) * 8.4;
          state.hovering = true;
          card.classList.add("is-tilting");
          if (!state.raf) {
            state.raf = requestAnimationFrame(updateTilt);
          }
        },
        { passive: true }
      );

      card.addEventListener(
        "mouseleave",
        function () {
          state.tarX = 0;
          state.tarY = 0;
          state.hovering = false;
          if (!state.raf) {
            state.raf = requestAnimationFrame(updateTilt);
          }
        },
        { passive: true }
      );
    });
  }

  /* ============================================================
     5. MAGNETIC CONTROLS (Desktop Fine Pointer Only)
     ============================================================ */
  if (isFinePointer && !prefersReducedMotion) {
    var magTargets = Array.prototype.slice.call(
      document.querySelectorAll(
        ".btn-primary, .hero-pulse-btn, .hero-3d-btn, .btn-resume, .btn-cmd-palette, .theme-toggle, .lang-toggle, .floating-top-btn"
      )
    );

    magTargets.forEach(function (btn) {
      btn.addEventListener(
        "mousemove",
        function (e) {
          var rect = btn.getBoundingClientRect();
          var dx = e.clientX - (rect.left + rect.width * 0.5);
          var dy = e.clientY - (rect.top + rect.height * 0.5);
          var tx = Math.max(-5, Math.min(5, dx * 0.24));
          var ty = Math.max(-5, Math.min(5, dy * 0.24));
          btn.style.transform =
            "translate3d(" + tx.toFixed(1) + "px, " + ty.toFixed(1) + "px, 0)";
        },
        { passive: true }
      );

      btn.addEventListener(
        "mouseleave",
        function () {
          btn.style.removeProperty("transform");
        },
        { passive: true }
      );
    });
  }

  /* ============================================================
     6. INTERACTIVE BEFORE ⇄ AFTER DATA TRANSFORMATION SLIDER
     ============================================================ */
  var tlabStage = document.getElementById("tlab-stage");
  var tlabRange = document.getElementById("tlab-range");
  var tlabPct = document.getElementById("tlab-pct-readout");
  var tlabTabs = Array.prototype.slice.call(
    document.querySelectorAll(".tlab-tab[data-tlab-case]")
  );
  var tlabBeforePill = document.getElementById("tlab-before-pill");
  var tlabAfterPill = document.getElementById("tlab-after-pill");
  var tlabBeforeMetric = document.getElementById("tlab-before-metric");
  var tlabAfterMetric = document.getElementById("tlab-after-metric");
  var tlabBeforeCode = document.getElementById("tlab-before-code");
  var tlabAfterCode = document.getElementById("tlab-after-code");
  var activeTlabCase = "de";

  var TLAB_CASES = {
    de: {
      en: {
        beforePill: "BEFORE · RAW MULTI-SOURCE LISTINGS (DUPLICATES & DRIFT)",
        afterPill: "AFTER · GOLD CANONICAL ENTITY (DUCKDB + NETWORKX)",
        beforeMetric: "3 Unlinked Records · Schema Drift",
        afterMetric: "0% False Merge · OGC GeoParquet"
      },
      vi: {
        beforePill: "TRƯỚC · TIN ĐĂNG THÔ ĐA NGUỒN (TRÙNG LẶP & LỆCH CHUẨN)",
        afterPill: "SAU · THỰC THỂ GOLD CANONICAL (DUCKDB + NETWORKX)",
        beforeMetric: "3 Bản ghi rời rạc · Lệch Schema",
        afterMetric: "0% Gộp nhầm · Chuẩn OGC GeoParquet"
      },
      beforeCode:
        "[\n" +
        '  { "src": "site_a", "price": "12 triệu/tháng", "lat": 10.8505, "lng": 106.7717 },\n' +
        '  { "src": "site_b", "price": "12,000,000 đ",  "lat": "10.8507N", "ward": "Linh Trung" },\n' +
        '  { "src": "site_c", "price": null,            "coord": "corrupt_payload -> routed_to_DLQ" }\n' +
        "]\n" +
        "/* Problems: unnormalized currency strings, duplicate physical property,\n" +
        "   missing price field, and inconsistent coordinate formats. */",
      afterCode:
        "{\n" +
        '  "canonical_id": "prop_vn_79_thuduc_00421",\n' +
        '  "cluster_size": 3,\n' +
        '  "confidence_score": 0.942,\n' +
        '  "price_vnd_per_month": 12000000,\n' +
        '  "geom_wkt": "POINT(106.7718 10.8506)",\n' +
        '  "price_risk_zscore": -0.42,\n' +
        '  "anomaly_flag": "NORMAL_VERIFIED",\n' +
        '  "lineage_sha256": "e3b0c442...98fc1c14"\n' +
        "}"
    },
    cv: {
      en: {
        beforePill: "BEFORE · BASELINE UNCERTAINTY SAMPLING (DIVERSITY COLLAPSE)",
        afterPill: "AFTER · 3D IPF / SINKHORN STRATIFIED ACTIVE LEARNING",
        beforeMetric: "Entropy: 3.84 bits · Rare Weather Starved",
        afterMetric: "Entropy: 5.20 bits (+2.08% mAP50 · p=0.00076)"
      },
      vi: {
        beforePill: "TRƯỚC · CHỌN MẪU UNCERTAINTY CƠ SỞ (SỤP ĐỔ ĐỘ ĐA DẠNG)",
        afterPill: "SAU · PHÂN TẦNG 3 CHIỀU IPF / SINKHORN (BDD100K)",
        beforeMetric: "Entropy: 3.84 bits · Bỏ đói miền thời tiết xấu",
        afterMetric: "Entropy: 5.20 bits (+2.08% mAP50 · p=0.00076)"
      },
      beforeCode:
        "{\n" +
        '  "strategy": "baseline_top_k_uncertainty",\n' +
        '  "batch_shannon_entropy": "3.8366 ± 0.0353 bits",\n' +
        '  "slice_distribution": {\n' +
        '    "clear_daytime_city": "83.5% (over-sampled redundant frames)",\n' +
        '    "rainy_night_highway": "2.1%  (starved safety-critical slice)",\n' +
        '    "snowy_dusk_residential": "1.4%  (starved)"\n' +
        "  },\n" +
        '  "adverse_weather_mAP50": "0.3223 ± 0.0055"\n' +
        "}",
      afterCode:
        "{\n" +
        '  "strategy": "hybrid_topk + sqrt_quota + 3d_ipf_sinkhorn",\n' +
        '  "batch_shannon_entropy": "5.2031 ± 0.0494 bits (Cohen d = 20.93)",\n' +
        '  "marginal_L1_error": "0.00018 (converged across weather×scene×time)",\n' +
        '  "rare_slice_boost": "+3.4x coverage on rainy/snowy/night",\n' +
        '  "adverse_weather_mAP50": "0.3430 ± 0.0147 (+2.08% verified gain)",\n' +
        '  "adverse_weather_mAP50_95": "0.1910 ± 0.0087 (+1.57% tighter boxes)",\n' +
        '  "unit_test_suite": "35 / 35 pytest passed"\n' +
        "}"
    }
  };

  function updateTlabSplit(val) {
    if (!tlabStage) return;
    var pct = Math.max(5, Math.min(95, Number(val) || 50));
    tlabStage.style.setProperty("--split", pct + "%");
    if (tlabPct) {
      var isVi = getLang() === "vi";
      tlabPct.textContent = isVi
        ? pct + "% TRƯỚC / " + (100 - pct) + "% SAU"
        : pct + "% BEFORE / " + (100 - pct) + "% AFTER";
    }
  }

  function renderTlabCase(caseKey) {
    var spec = TLAB_CASES[caseKey];
    if (!spec) return;
    activeTlabCase = caseKey;
    var lang = getLang();
    var copy = spec[lang] || spec.en;
    if (tlabBeforePill) tlabBeforePill.textContent = copy.beforePill;
    if (tlabAfterPill) tlabAfterPill.textContent = copy.afterPill;
    if (tlabBeforeMetric) tlabBeforeMetric.textContent = copy.beforeMetric;
    if (tlabAfterMetric) tlabAfterMetric.textContent = copy.afterMetric;
    if (tlabBeforeCode) tlabBeforeCode.textContent = spec.beforeCode;
    if (tlabAfterCode) tlabAfterCode.textContent = spec.afterCode;
    if (tlabRange) updateTlabSplit(tlabRange.value);
  }

  if (tlabRange && tlabStage) {
    tlabRange.addEventListener("input", function () {
      updateTlabSplit(tlabRange.value);
    });
    tlabTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-tlab-case");
        tlabTabs.forEach(function (t) {
          var active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
        });
        renderTlabCase(key);
      });
    });
  }

  /* ============================================================
     7. LIVE PIPELINE STAGE CLICK-TO-INSPECT & DATA PACKETS
     ============================================================ */
  var STAGE_SPECS = {
    "project-de": [
      {
        en: "Stage 01 [Crawler / Seed] → Async HTTP scraper + deterministic synthetic seed generator with rate-limit backoff.",
        vi: "Bước 01 [Crawler / Seed] → Thu thập tin đăng đa nguồn bất đồng bộ + bộ sinh dữ liệu Seed tái lập có kiểm soát tải."
      },
      {
        en: "Stage 02 [MinIO Raw + DLQ] → Immutable gzip payload storage with SHA-256 hash; corrupt records routed to Dead-Letter Queue (0% silent loss).",
        vi: "Bước 02 [MinIO Raw + DLQ] → Lưu trữ Raw bất biến kèm mã băm SHA-256; bản ghi lỗi được cách ly tự động vào Dead-Letter Queue."
      },
      {
        en: "Stage 03 [Polars & GeoParquet] → Vectorized Rust-Arrow schema normalization into OGC GeoParquet (`vnd_per_month`, EPSG:4326).",
        vi: "Bước 03 [Polars & GeoParquet] → Chuẩn hóa kiểu dữ liệu & tọa độ tốc độ cao bằng Polars sang chuẩn mở OGC GeoParquet."
      },
      {
        en: "Stage 04 [Entity Resolution] → Multi-pass spatial/geohash blocking + NetworkX connected-component refinement (0% false merge in Gold).",
        vi: "Bước 04 [Entity Resolution] → Phân cụm đa tầng + giải đồ thị NetworkX loại bỏ trùng lặp thực thể (0% gộp nhầm ở tầng Gold)."
      },
      {
        en: "Stage 05 [Gold & Spatial BI] → In-process DuckDB Spatial + dbt-duckdb marts (`dim_canonical`, `fact_observation`) with Z-score/IQR risk flags.",
        vi: "Bước 05 [Gold & Spatial BI] → Mô hình hóa tầng Gold bằng DuckDB Spatial + dbt-duckdb và chấm điểm bất thường giá Z-score/IQR."
      }
    ],
    "project-da": [
      {
        en: "Stage 01 [Multi-source] → Ingests transactional OLTP tables and operational CSV/Parquet exports with schema contract checks.",
        vi: "Bước 01 [Multi-source] → Tiếp nhận dữ liệu từ bảng giao dịch OLTP và file vận hành kèm kiểm tra hợp đồng schema."
      },
      {
        en: "Stage 02 [Pandas / Spark] → Strict dtype & memory-footprint profiling in Pandas before scaling transformations to Spark/SQL.",
        vi: "Bước 02 [Pandas / Spark] → Kiểm soát chặt kiểu dữ liệu & bộ nhớ trên Pandas trước khi đẩy tác vụ nặng sang SQL/Spark."
      },
      {
        en: "Stage 03 [dbt Core] → Modular staging → intermediate → gold mart SQL transformations with automated uniqueness & not-null tests.",
        vi: "Bước 03 [dbt Core] → Biến đổi SQL phân tầng staging → intermediate → gold kèm kiểm thử ràng buộc khóa tự động."
      },
      {
        en: "Stage 04 [Warehouse] → Acid-compliant PostgreSQL analytical marts with idempotent partition refresh.",
        vi: "Bước 04 [Warehouse] → Kho dữ liệu phân tích PostgreSQL đảm bảo chạy làm mới (refresh) chuẩn idempotent."
      },
      {
        en: "Stage 05 [Metabase] → Decision-support KPI dashboards answering leadership questions with traceable metric lineage.",
        vi: "Bước 05 [Metabase] → Bảng điều khiển BI hỗ trợ ra quyết định với nguồn gốc chỉ số KPI minh bạch."
      }
    ],
    "project-cv": [
      {
        en: "Stage 01 [BDD100K Pool] → Indexes unlabeled autonomous-driving frames across 3 physical metadata axes (weather, scene, timeofday).",
        vi: "Bước 01 [BDD100K Pool] → Lập chỉ mục tập ảnh xe tự hành chưa gán nhãn theo 3 chiều metadata vật lý (thời tiết, bối cảnh, thời gian)."
      },
      {
        en: "Stage 02 [Hybrid Top-K] → Box-level confidence & class entropy filtering isolates the most informative candidate frames.",
        vi: "Bước 02 [Hybrid Top-K] → Lọc tập ứng viên có độ bất định bounding-box và entropy phân phối lớp cao nhất."
      },
      {
        en: "Stage 03 [IPF / Sinkhorn] → Square-root quota (w_k ∝ √N_k) + 3D Iterative Proportional Fitting balances joint marginals (L1 ≈ 0).",
        vi: "Bước 03 [IPF / Sinkhorn] → Phân bổ quota căn bậc hai + thuật toán IPF/Sinkhorn cân bằng đồng thời 3 chiều metadata (sai số L1 ≈ 0)."
      },
      {
        en: "Stage 04 [YOLOv8n Loop] → Reproducible multi-round active learning loop trained across 3 random seeds (42, 123, 456).",
        vi: "Bước 04 [YOLOv8n Loop] → Vòng lặp huấn luyện YOLOv8n tái lập qua 3 bộ seed độc lập (42, 123, 456)."
      },
      {
        en: "Stage 05 [Statistical Test] → Paired t-test verification: entropy jumps 3.84 → 5.20 bits (p=0.00076) and +2.08% mAP50 on adverse_weather.",
        vi: "Bước 05 [Statistical Test] → Kiểm định Paired t-test: entropy tăng từ 3.84 lên 5.20 bits (p=0.00076) và +2.08% mAP50 miền thời tiết xấu."
      }
    ]
  };

  var projectCards = Array.prototype.slice.call(
    document.querySelectorAll(".project")
  );
  var flowStateUpdaters = [];

  projectCards.forEach(function (card) {
    var flowBox = card.querySelector(".pipeline-flow");
    if (!flowBox) return;
    var projType =
      (card.classList.contains("project-de") && "project-de") ||
      (card.classList.contains("project-da") && "project-da") ||
      (card.classList.contains("project-cv") && "project-cv") ||
      null;
    if (!projType || !STAGE_SPECS[projType]) return;

    var steps = Array.prototype.slice.call(
      flowBox.querySelectorAll(".flow-step")
    );
    var inspector = document.createElement("div");
    inspector.className = "flow-inspector";
    inspector.setAttribute("aria-live", "polite");
    flowBox.appendChild(inspector);

    var activeIdx = 2; // Default to Stage 03 (.flow-step-highlight)

    function renderStage(idx) {
      activeIdx = idx;
      var lang = getLang();
      var entry = STAGE_SPECS[projType][idx];
      if (!entry) return;
      steps.forEach(function (s, i) {
        s.classList.toggle("flow-step-highlight", i === idx);
        s.setAttribute("aria-pressed", String(i === idx));
      });
      inspector.textContent = entry[lang] || entry.en;
    }

    steps.forEach(function (step, idx) {
      step.setAttribute("tabindex", "0");
      step.setAttribute("role", "button");
      step.addEventListener("click", function (e) {
        e.stopPropagation();
        renderStage(idx);
      });
      step.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          renderStage(idx);
        }
      });
    });

    renderStage(activeIdx);
    flowStateUpdaters.push(function () {
      renderStage(activeIdx);
    });
  });

  /* ============================================================
     8. MATRIX / CIPHER TELEMETRY DECODE EFFECT ON SCROLL
     ============================================================ */
  var CIPHER_GLYPHS = "0123456789ABCDEF×∑∆";

  function scrambleText(el) {
    if (!el || prefersReducedMotion) return;
    var finalStr = el.textContent;
    if (!finalStr || finalStr.length > 36) return;
    var duration = 340;
    var start = performance.now();

    function step(now) {
      var p = Math.min(1, (now - start) / duration);
      var lockCount = Math.floor(p * finalStr.length);
      var out = "";
      for (var i = 0; i < finalStr.length; i++) {
        var ch = finalStr.charAt(i);
        if (i < lockCount || ch === " " || ch === "·" || ch === "-") {
          out += ch;
        } else {
          out += CIPHER_GLYPHS.charAt(
            Math.floor(Math.random() * CIPHER_GLYPHS.length)
          );
        }
      }
      el.textContent = out;
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = finalStr;
      }
    }
    requestAnimationFrame(step);
  }

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    var cipherTargets = Array.prototype.slice.call(
      document.querySelectorAll(".bento-stat-num, .adr-code, .section-badge")
    );
    var cipherObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            scrambleText(entry.target);
            cipherObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    cipherTargets.forEach(function (el) {
      cipherObserver.observe(el);
    });
  }

  /* ============================================================
     9. INTERACTIVE ENGINEERING EXPERIMENT & VERIFICATION HEATMAP
     ============================================================ */
  var hmapGrid = document.getElementById("eng-heatmap-grid");
  var hmapText = document.getElementById("hmap-readout-text");

  var HMAP_TRACKS = [
    {
      code: "DE · LAKEHOUSE",
      levels: [2, 3, 2, 4, 3, 4, 3, 4, 4, 3, 4, 4],
      en: "PropMatch Lakehouse — MinIO Raw + DLQ, Polars Silver GeoParquet, NetworkX Entity Resolution & dbt-duckdb Gold marts.",
      vi: "PropMatch Lakehouse — MinIO Raw + DLQ, chuẩn hóa Polars Silver GeoParquet, hợp nhất thực thể NetworkX & dbt-duckdb Gold."
    },
    {
      code: "CV · BDD100K",
      levels: [1, 2, 3, 3, 4, 4, 3, 4, 4, 4, 3, 4],
      en: "BDD100K Active Learning — 18 YOLOv8n training runs (3 seeds × 6 configs), 3D IPF/Sinkhorn L1≈0 & 35/35 pytest unit tests.",
      vi: "BDD100K Active Learning — 18 lượt huấn luyện YOLOv8n (3 seeds), cân bằng biên 3D IPF/Sinkhorn & vượt qua 35/35 unit tests."
    },
    {
      code: "RES · JTE DOI",
      levels: [2, 2, 3, 4, 4, 3, 4, 4, 3, 2, 3, 4],
      en: "JTE Peer-Reviewed Journal Paper — Vietnamese Folk-Tale Comics Generation pipeline (published Aug 25, 2026 · DOI: 10.54644/jte.2026.2148).",
      vi: "Bài báo Khoa học JTE — Trực quan hóa truyện dân gian Việt Nam bằng kỹ thuật sinh truyện tranh (xuất bản 25/08/2026 · DOI: 10.54644/jte.2026.2148)."
    },
    {
      code: "IND · AWS & QTD",
      levels: [1, 2, 2, 3, 3, 3, 4, 3, 4, 4, 4, 4],
      en: "Industry Internships — Cloud & Data pipeline architecture at AWS FCAJ and enterprise data analytics automation at QT-Data VN.",
      vi: "Thực tập Doanh nghiệp — Kiến trúc dữ liệu đám mây tại AWS FCAJ và tự động hóa quy trình phân tích dữ liệu tại QT-Data VN."
    }
  ];

  var selectedHmapTrack = null;

  if (hmapGrid) {
    var frag = document.createDocumentFragment();
    HMAP_TRACKS.forEach(function (track, tIdx) {
      var row = document.createElement("div");
      row.className = "hmap-row";
      row.setAttribute("role", "row");

      var label = document.createElement("span");
      label.className = "hmap-row-label";
      label.textContent = track.code;
      row.appendChild(label);

      var cellsWrap = document.createElement("div");
      cellsWrap.className = "hmap-row-cells";

      track.levels.forEach(function (lv, cIdx) {
        var cell = document.createElement("button");
        cell.type = "button";
        cell.className = "hmap-cell lv-" + lv;
        cell.setAttribute(
          "aria-label",
          track.code + " · Sprint " + (cIdx + 1) + " (Level " + lv + "/4)"
        );

        function inspectCell() {
          selectedHmapTrack = { track: track, sprint: cIdx + 1, lv: lv };
          var lang = getLang();
          if (hmapText) {
            hmapText.textContent =
              "[" +
              track.code +
              " · Sprint #" +
              (cIdx + 1 < 10 ? "0" + (cIdx + 1) : cIdx + 1) +
              "] " +
              (track[lang] || track.en);
          }
        }

        cell.addEventListener("mouseenter", inspectCell);
        cell.addEventListener("focus", inspectCell);
        cell.addEventListener("click", inspectCell);
        cellsWrap.appendChild(cell);
      });

      row.appendChild(cellsWrap);
      frag.appendChild(row);
    });
    hmapGrid.appendChild(frag);
  }

  document.addEventListener("pf:langchange", function () {
    renderTlabCase(activeTlabCase);
    flowStateUpdaters.forEach(function (fn) {
      fn();
    });
    if (selectedHmapTrack && hmapText) {
      var lang = getLang();
      var tr = selectedHmapTrack.track;
      var sp = selectedHmapTrack.sprint;
      hmapText.textContent =
        "[" +
        tr.code +
        " · Sprint #" +
        (sp < 10 ? "0" + sp : sp) +
        "] " +
        (tr[lang] || tr.en);
    }
  });
})();
