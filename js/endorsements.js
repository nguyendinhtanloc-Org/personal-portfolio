/**
 * personal-portfolio — js/endorsements.js
 * Data-driven Endorsements & References renderer.
 *
 * How to add a new endorsement in the future:
 *   Append a new object to the ENDORSEMENTS array below.
 *   - Up to 3 items: displayed in a balanced 3-column grid.
 *   - 4+ items: automatically displays the first 3 and reveals a
 *     "Show all (+N)" toggle button; switches to 2-column grid if 4 items
 *     are visible so there is never an orphan card.
 */
(function () {
  "use strict";

  var INITIAL_VISIBLE = 3;

  var ENDORSEMENTS = [
    {
      initials: "GV",
      context: {
        en: "Research · HCMUTE",
        vi: "Nghiên cứu · HCMUTE"
      },
      quote: {
        en: "“Tân Lộc approaches research methodically—always validating data quality and pipeline reproducibility before drawing conclusions.”",
        vi: "“Tân Lộc tiếp cận nghiên cứu rất bài bản — luôn kiểm chứng chất lượng dữ liệu và khả năng tái lập của pipeline trước khi đưa ra kết luận.”"
      },
      name: {
        en: "[Advisor Name]",
        vi: "[Tên Giảng viên hướng dẫn]"
      },
      role: {
        en: "Research Advisor · HCMUTE",
        vi: "Giảng viên hướng dẫn NCKH · HCMUTE"
      }
    },
    {
      initials: "AW",
      context: {
        en: "Internship · AWS FCAJ",
        vi: "Thực tập · AWS FCAJ"
      },
      quote: {
        en: "“Quick to grasp cloud data architectures and disciplined in documenting workflows so the rest of the team can follow and verify.”",
        vi: "“Nắm bắt nhanh kiến trúc dữ liệu đám mây và rất kỷ luật trong việc tài liệu hóa quy trình để cả nhóm dễ dàng theo dõi và kiểm thử.”"
      },
      name: {
        en: "[Mentor Name]",
        vi: "[Tên Mentor AWS FCAJ]"
      },
      role: {
        en: "Cloud & Data Mentor · AWS FCAJ",
        vi: "Mentor Cloud & Dữ liệu · AWS FCAJ"
      }
    },
    {
      initials: "QT",
      context: {
        en: "Internship · QT-Data VN",
        vi: "Thực tập · QT-Data VN"
      },
      quote: {
        en: "“Reliable with day-to-day data operations—attentive to schema consistency, edge cases, and timely delivery.”",
        vi: "“Đáng tin cậy trong vận hành dữ liệu hằng ngày — luôn chú ý tính nhất quán của schema, các trường hợp biên và tiến độ bàn giao.”"
      },
      name: {
        en: "[Supervisor Name]",
        vi: "[Tên Lead QT-Data VN]"
      },
      role: {
        en: "Data Lead · QT-Data VN",
        vi: "Data Lead · QT-Data VN"
      }
    }
  ];

  var grid = document.getElementById("endorsement-grid");
  var actions = document.getElementById("endorsements-actions");
  var toggleBtn = document.getElementById("btn-endorsements-toggle");
  if (!grid) return;

  var isExpanded = false;

  function getLang() {
    if (window.PF_I18N && typeof window.PF_I18N.current === "function") {
      return window.PF_I18N.current();
    }
    return document.documentElement.getAttribute("lang") === "vi" ? "vi" : "en";
  }

  function createEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function buildCard(item, lang) {
    var card = createEl("article", "endorsement-card spotlight-card");

    var top = createEl("div", "endorsement-top");
    var mark = createEl("span", "endorsement-quote-mark", "“");
    mark.setAttribute("aria-hidden", "true");
    var ctx = createEl("span", "endorsement-context", item.context[lang] || item.context.en);
    top.appendChild(mark);
    top.appendChild(ctx);

    var quote = createEl("blockquote", "endorsement-quote", item.quote[lang] || item.quote.en);

    var author = createEl("footer", "endorsement-author");
    var avatar = createEl("div", "endorsement-avatar", item.initials);
    avatar.setAttribute("aria-hidden", "true");

    var meta = createEl("div", "endorsement-meta");
    var name = createEl("strong", "endorsement-name", item.name[lang] || item.name.en);
    var role = createEl("span", "endorsement-role", item.role[lang] || item.role.en);
    meta.appendChild(name);
    meta.appendChild(role);

    author.appendChild(avatar);
    author.appendChild(meta);

    card.appendChild(top);
    card.appendChild(quote);
    card.appendChild(author);
    return card;
  }

  function updateToggle(lang) {
    if (!actions || !toggleBtn) return;
    var extra = ENDORSEMENTS.length - INITIAL_VISIBLE;
    if (extra <= 0) {
      actions.hidden = true;
      return;
    }

    actions.hidden = false;
    toggleBtn.setAttribute("aria-expanded", String(isExpanded));
    if (isExpanded) {
      toggleBtn.textContent = lang === "vi" ? "Thu gọn ↑" : "Show less ↑";
    } else {
      toggleBtn.textContent =
        lang === "vi"
          ? "Xem thêm nhận xét (+" + extra + ") ↓"
          : "Show all endorsements (+" + extra + ") ↓";
    }
  }

  function render(lang) {
    var activeLang = lang || getLang();
    var visibleCount = isExpanded
      ? ENDORSEMENTS.length
      : Math.min(INITIAL_VISIBLE, ENDORSEMENTS.length);

    // Use 2-column layout for 2 or 4 visible cards so there is no orphan card
    grid.classList.toggle("is-2col", visibleCount === 2 || visibleCount === 4);

    var frag = document.createDocumentFragment();
    for (var i = 0; i < visibleCount; i++) {
      frag.appendChild(buildCard(ENDORSEMENTS[i], activeLang));
    }
    grid.innerHTML = "";
    grid.appendChild(frag);
    updateToggle(activeLang);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      isExpanded = !isExpanded;
      render(getLang());
    });
  }

  document.addEventListener("pf:langchange", function (e) {
    var nextLang = e.detail && e.detail.lang ? e.detail.lang : getLang();
    render(nextLang);
  });

  render(getLang());
})();
