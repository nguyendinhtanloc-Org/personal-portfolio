/**
 * personal-portfolio — js/command-palette.js
 * Command Palette (Cmd+K / Ctrl+K) modal with filtering,
 * keyboard navigation (arrows, Enter, T, L), empty state,
 * and focus trapping while open.
 */
(function () {
  "use strict";

  var triggerBtn = null;

  function initCommandPalette() {
    var palette = document.getElementById("cmd-palette");
    var input = document.getElementById("cmd-input");
    triggerBtn = document.getElementById("btn-cmd-palette");
    var backdrop = document.getElementById("cmd-backdrop");
    var list = document.getElementById("cmd-list");
    var items = palette ? Array.prototype.slice.call(palette.querySelectorAll(".cmd-item")) : [];

    if (!palette || !input) return;

    var selectedIndex = 0;

    var emptyEl = document.createElement("div");
    emptyEl.className = "cmd-empty";
    emptyEl.setAttribute("aria-live", "polite");
    emptyEl.hidden = true;

    function getVisibleItems() {
      return items.filter(function (item) {
        return !item.classList.contains("is-hidden");
      });
    }

    function updateSelection() {
      var visible = getVisibleItems();
      items.forEach(function (item) {
        item.classList.remove("is-selected");
      });
      if (visible.length > 0) {
        if (selectedIndex >= visible.length) selectedIndex = visible.length - 1;
        if (selectedIndex < 0) selectedIndex = 0;
        visible[selectedIndex].classList.add("is-selected");
        visible[selectedIndex].scrollIntoView({ block: "nearest" });
      }
    }

    function openPalette() {
      palette.classList.add("is-active");
      palette.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      input.value = "";
      filterItems("");
      selectedIndex = 0;
      updateSelection();
      setTimeout(function () {
        input.focus();
      }, 50);
    }

    function closePalette() {
      palette.classList.remove("is-active");
      palette.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      input.blur();
      if (triggerBtn) triggerBtn.focus();
    }

    function executeItem(item) {
      if (!item) return;
      var action = item.getAttribute("data-action");
      closePalette();

      if (action === "nav") {
        var targetId = item.getAttribute("data-target");
        if (targetId) {
          var targetEl = document.querySelector(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        }
      } else if (action === "toggle-theme") {
        var themeBtn = document.querySelector(".theme-toggle");
        if (themeBtn) themeBtn.click();
      } else if (action === "toggle-lang") {
        var langBtn = document.querySelector(".lang-toggle");
        if (langBtn) langBtn.click();
      } else if (action === "download-resume") {
        var link = document.createElement("a");
        link.href = "assets/docs/NguyenDinhTanLoc_Resume.pdf";
        link.download = "NguyenDinhTanLoc_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (action === "view-cert") {
        var certBtn = document.querySelector(".btn-cert-link");
        if (certBtn) certBtn.click();
      }
    }

    function filterItems(query) {
      var q = query.trim().toLowerCase();
      var groupLabels = palette.querySelectorAll(".cmd-group-label");

      items.forEach(function (item) {
        var text = (item.textContent || "").toLowerCase();
        if (!q || text.indexOf(q) !== -1) {
          item.classList.remove("is-hidden");
        } else {
          item.classList.add("is-hidden");
        }
      });

      // Hide group labels if no items in group are visible
      groupLabels.forEach(function (group) {
        var next = group.nextElementSibling;
        var hasVisible = false;
        while (next && !next.classList.contains("cmd-group-label")) {
          if (next.classList.contains("cmd-item") && !next.classList.contains("is-hidden")) {
            hasVisible = true;
            break;
          }
          next = next.nextElementSibling;
        }
        group.style.display = hasVisible ? "" : "none";
      });

      var none = getVisibleItems().length === 0;
      emptyEl.hidden = !none;
      if (none) {
        var isVi = document.documentElement.getAttribute("lang") === "vi";
        emptyEl.textContent = isVi
          ? "Không có kết quả cho “" + query + "”"
          : "No matches for “" + query + "”";
      }
      if (list) list.appendChild(emptyEl);

      selectedIndex = 0;
      updateSelection();
    }

    input.addEventListener("input", function () {
      filterItems(input.value);
    });

    input.addEventListener("keydown", function (e) {
      var visible = getVisibleItems();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % (visible.length || 1);
        updateSelection();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + visible.length) % (visible.length || 1);
        updateSelection();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (visible[selectedIndex]) {
          executeItem(visible[selectedIndex]);
        }
      }
    });

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        executeItem(item);
      });
      item.addEventListener("mouseenter", function () {
        var visible = getVisibleItems();
        var idx = visible.indexOf(item);
        if (idx !== -1) {
          selectedIndex = idx;
          updateSelection();
        }
      });
    });

    if (triggerBtn) triggerBtn.addEventListener("click", openPalette);
    if (backdrop) backdrop.addEventListener("click", closePalette);

    // Global keyboard shortcuts (T/L intentionally omitted: they collide with
    // typing in the palette's search box)
    document.addEventListener("keydown", function (e) {
      var isOpen = palette.classList.contains("is-active");

      var isCmdK = (e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K");
      if (isCmdK) {
        e.preventDefault();
        if (isOpen) closePalette();
        else openPalette();
      } else if (e.key === "Escape" && isOpen) {
        closePalette();
      }
    });

    // Focus trap: Tab cycles inside the dialog
    palette.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var focusables = [input].concat(
        Array.prototype.slice.call(palette.querySelectorAll(".cmd-item:not(.is-hidden)"))
      );
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCommandPalette);
  } else {
    initCommandPalette();
  }
})();
