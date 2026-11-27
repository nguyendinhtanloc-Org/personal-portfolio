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
      initials: "LT",
      context: {
        en: "Research · HCMUTE",
        vi: "Nghiên cứu · HCMUTE"
      },
      quote: {
        en: "“Tan Loc is a diligent student who actively engages in the scientific research program. Despite a few limitations that come with inexperience, Tan Loc still completed the tasks assigned by the professor.”",
        vi: "“Lộc là sinh viên chịu khó khi tham gia nghiên cứu khoa học. Dù còn một số hạn chế xuất phát từ sự thiếu kinh nghiệm, bạn vẫn đảm bảo hoàn thành nhiệm vụ giảng viên giao.”"
      },
      name: {
        en: "M.Sc. Le Minh Tan",
        vi: "ThS. Lê Minh Tân"
      },
      role: {
        en: "NCKH Supervisor · HCMUTE",
        vi: "Giảng viên hướng dẫn NCKH · HCMUTE"
      }
    },
    {
      initials: "NY",
      context: {
        en: "Internship · QT-Data VN (9.0/10)",
        vi: "Thực tập · QT-Data VN (9.0/10)"
      },
      quote: {
        en: "“Serious work ethic, high sense of responsibility, and quick to grasp new operational workflows. Tan Loc proactively communicates with supervisors, resolves problems effectively, and consistently delivers assigned tasks with excellence.”",
        vi: "“Tác phong làm việc nghiêm túc, tinh thần trách nhiệm cao và tiếp thu nhanh các quy trình nghiệp vụ mới. Lộc luôn chủ động trao đổi với người hướng dẫn, giải quyết vấn đề hiệu quả và hoàn thành xuất sắc mọi nhiệm vụ được giao.”"
      },
      name: {
        en: "Huynh Huu Ngoc Y",
        vi: "Huỳnh Hữu Ngọc Ý"
      },
      role: {
        en: "IT Director · QT-Data VN",
        vi: "Giám đốc CNTT · QT-Data VN"
      }
    }
    /* One more endorsement slot is drafted for AWS FCAJ once you have
       the mentor's formal quote:
    ,{
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
    }
    */
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
    var card = createEl("article", "endorsement-card");

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

  function render(lang, animateFromIndex) {
    var activeLang = lang || getLang();
    var visibleCount = isExpanded
      ? ENDORSEMENTS.length
      : Math.min(INITIAL_VISIBLE, ENDORSEMENTS.length);

    // Use 2-column layout for 2 or 4 visible cards so there is no orphan card;
    // a lone card spans full width (capped) so it reads as a featured quote.
    grid.classList.toggle("is-1col", visibleCount === 1);
    grid.classList.toggle("is-2col", visibleCount === 2 || visibleCount === 4);

    var frag = document.createDocumentFragment();
    for (var i = 0; i < visibleCount; i++) {
      var card = buildCard(ENDORSEMENTS[i], activeLang);
      if (typeof animateFromIndex === "number" && i >= animateFromIndex) {
        card.classList.add("is-entering");
        card.style.animationDelay = (i - animateFromIndex) * 0.05 + "s";
      }
      frag.appendChild(card);
    }
    grid.innerHTML = "";
    grid.appendChild(frag);
    updateToggle(activeLang);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      isExpanded = !isExpanded;
      render(getLang(), isExpanded ? INITIAL_VISIBLE : undefined);
    });
  }

  document.addEventListener("pf:langchange", function (e) {
    var nextLang = e.detail && e.detail.lang ? e.detail.lang : getLang();
    render(nextLang);
  });

  render(getLang());
})();
