/**
 * personal-portfolio — i18n.js
 * EN/VI switcher, zero dependencies.
 *  - English is the source of truth and lives in index.html.
 *  - This file holds the Vietnamese strings only (PF_I18N.VI).
 *  - Elements carry data-i18n="<key>"; data-i18n-type="html" means
 *    the value replaces innerHTML, otherwise textContent.
 *  - The user's choice is stored in localStorage ("pf-lang").
 *  - With JS disabled the site simply stays in English.
 */
window.PF_I18N = (function () {
  "use strict";

  var STORAGE_KEY = "pf-lang";

  // shared wavy underline so it survives language switching
  var SQUIGGLE =
    '<svg viewBox="0 0 220 8" preserveAspectRatio="none" aria-hidden="true">' +
    '<path vector-effect="non-scaling-stroke" d="M0 5 Q 8 1, 16 5 T 32 5 T 48 5 T 64 5 T 80 5 T 96 5 T 112 5 T 128 5 T 144 5 T 160 5 T 176 5 T 192 5 T 208 5 T 220 5"/>' +
    "</svg>";

  var VI = {
    /* nav */
    "nav.home": "Trang chủ",
    "nav.about": "Giới thiệu",
    "nav.projects": "Dự án",
    "nav.skills": "Kỹ năng",
    "nav.exp": "Kinh nghiệm",
    "nav.contact": "Liên hệ",
    "nav.resume": "CV",

    /* hero */
    "hero.issue": "Hồ sơ Kỹ thuật Dữ liệu · 2026",
    "hero.title": "Xây dựng hệ thống dữ liệu tin cậy tạo tác động thực tiễn.",
    "hero.lede":
      "Tôi là Tân Lộc, sinh viên ngành Kỹ thuật Dữ liệu tại HCMUTE (dự kiến tốt nghiệp 2027). " +
      "Định hướng chuyên sâu vào Data Engineering (DE), Data Analytics (DA) và Computer Vision (CV); " +
      "hiện đang tìm kiếm cơ hội thực tập thực tế tại TP.HCM &amp; Đồng Nai.",
    "hero.cta.primary": "Xem dự án",
    "hero.cta.about": "Giới thiệu",
    "hero.figcap":
      "<span class=\"fig-label\">Kiến trúc</span> — pipeline tiêu biểu tôi thiết kế và kiểm thử: " +
      "source → stream → store, nhánh model nhận dữ liệu từ stream.",
    "hero.note.label": "Nguyên tắc thiết kế",
    "hero.note.text":
      "Mỗi tầng một nguồn sự thật — nếu một con số lệch, ta tìm được chỗ lệch.",

    /* about */
    "about.badge": "Giới thiệu · Bản thân",
    "about.title": "Đôi nét trung thực về bản thân",
    "about.p1":
      "Tôi là sinh viên ngành Kỹ thuật Dữ liệu tại HCMUTE (dự kiến tốt nghiệp 2027), với định hướng chuyên môn trọng tâm là Data Engineering (DE), tiếp nối bởi Data Analytics (DA) và Computer Vision (CV). Tôi yêu thích việc tự động hóa các luồng dữ liệu thô thành tài sản dữ liệu có cấu trúc và tin cậy.",
    "about.p2":
      "<strong>Kinh nghiệm thực tế &amp; Nghiên cứu:</strong> Tôi đã tích lũy kinh nghiệm làm việc thực tế qua các kỳ thực tập tại AWS FCAJ và QT-Data VN, đồng thời là đồng tác giả bài báo nghiên cứu khoa học xuất bản trên Tạp chí Giáo dục Kỹ thuật (JTE).",
    "about.p3":
      "<strong>Mục tiêu hiện tại:</strong> Tìm kiếm cơ hội thực tập (Internship) tại khu vực TP.HCM hoặc Đồng Nai để trực tiếp tham gia xây dựng pipeline dữ liệu, hệ thống phân tích và ứng dụng thị giác máy tính trong môi trường doanh nghiệp.",
    "about.margin":
      "Ranh giới giữa sản phẩm thật và bản vẽ lý thuyết: " +
      "nhận định chưa chứng minh chỉ là <em>ước tính</em>, không bao giờ nhận là kết quả.",
    "about.portrait.cap": "Tân Lộc · Kỹ thuật Dữ liệu",
    "bento.story.tag": "Câu chuyện &amp; Phương pháp",
    "bento.quote":
      "“Tập trung xây dựng nền tảng Kỹ nghệ dữ liệu vững chắc, năng lực phân tích thực tiễn và ứng dụng thị giác máy tính.”",
    "bento.stats.tag": "Điểm nhấn &amp; Nghiên cứu",
    "bento.stat.paper.title": "Công bố khoa học",
    "bento.stat.paper.desc": "Đồng tác giả bài báo JTE (2026)",
    "paper.btn.view": "Đọc bài báo ↗",
    "about.principle.title": "Nguyên tắc làm việc",
    "about.principle.tag": "Quy chuẩn minh chứng",
    "bento.connect.tag": "Hồ sơ &amp; Kết nối",
    "about.f.edu.d": "Học vấn",
    "about.f.edu.v": "HCMUTE · Kỹ sư Kỹ thuật Dữ liệu",
    "about.f.cert.d": "Chứng chỉ",
    "about.f.cert.v": "Big Data — Samsung Innovation Campus",
    "about.f.base.d": "Đóng tại",
    "about.f.base.v": "TP.HCM &amp; Đồng Nai, Việt Nam",
    "about.f.open.v": "Thực tập: DE · DA · CV (TP.HCM / Đồng Nai)",
    "about.f.lang.d": "Ngoại ngữ",
    "about.f.lang.v": "Tiếng Anh, Tiếng Việt (mẹ đẻ)",

    /* projects */
    "projects.badge": "Dự án · Kỹ nghệ",
    "projects.title": "Dự án chọn lọc, theo lĩnh vực",
    "projects.note":
      "Pipeline telemetri, data model idempotent và mô hình thị giác có thể tái lập.",
    "p.status.wip": "đang thực hiện",
    "p.status.planned": "dự kiến",
    "p.techlabel": "công nghệ",
    "p.flowlabel": "Kiến trúc luồng dữ liệu",
    "p.resultlabel": "Kết quả đã kiểm chứng",
    "p.repo": 'Mã nguồn <span aria-hidden="true">→</span>',
    "p1.name": "Pipeline telemetri streaming",
    "p1.problem":
      "Telemetri từ nhiều nguồn cảm biến phải đến dashboard trong vài giây, sống qua " +
      "restart, và build lại được khi schema đầu vào thay đổi.",
    "p1.impl":
      "Telegraf vào Redpanda; Airflow điều phối trích xuất; model dbt idempotent theo " +
      "Medallion (bronze/silver/gold); chứng minh không mất dữ liệu bằng đối chiếu " +
      "<code>event_id</code> từng sự kiện kèm test kill/restart.",
    "p1.result":
      "0% sự kiện mất trong cửa sổ kiểm chứng; phục hồi &lt;30s sau khi broker restart",
    "p1.evlabel": "nhật ký chạy · kill test",
    "p1.evl2": "broker restart lúc T+42s · replay xong T+71s · p95 5.2s",
    "p2.name": "Dashboard hỗ trợ quyết định",
    "p2.problem":
      "Stack báo cáo trả lời đúng câu hỏi mà cấp quản lý thật sự hỏi — không phải câu " +
      "dễ vẽ chart — trên một warehouse Medallion.",
    "p2.impl":
      "Model dbt gold feeding Metabase; prototype bằng Pandas (kỷ luật dtype/memory) " +
      "trước khi đẩy phần nặng sang SQL và Spark.",
    "p2.result":
      "Một query thay N spreadsheet ad-hoc; refresh tầng gold là idempotent",
    "p2.evlabel": "dbt · refresh gold",
    "p2.evl2": "9/9 model pass · idempotent (chạy lại byte-identical)",
    "p3.name": "Mô hình thị giác, từ train đến serving",
    "p3.problem":
      "Một mô hình vision phải rời notebook sang setup tái lập được: run được theo " +
      "dõi, checkpoint resume được, và con đường rõ ràng tới artifact serving.",
    "p3.impl":
      "Vòng train PyTorch có DataLoader + AMP ở chỗ đáng giá; MLflow so sánh run; " +
      "MinIO lưu dataset và checkpoint; Docker đóng gói artifact.",
    "p3.result":
      "Run có theo dõi vượt baseline không theo dõi với đầy đủ checkpoint và lineage",
    "projects.more.a": "Thêm dự án khác trên",
    "projects.more.b": "— gồm môn học và các project tooling.",

    /* skills */
    "skills.badge": "Kỹ năng · Công nghệ",
    "skills.title": "Cái tôi thực sự dùng",
    "skills.note": "Chỉ các công cụ tôi đã trực tiếp sử dụng trong đồ án và công việc thực tế.",
    "skills.cat.de": "Kỹ nghệ Dữ liệu &amp; Ngôn ngữ",
    "skills.cat.da": "Cơ sở dữ liệu &amp; Phân tích",
    "skills.cat.cv": "Thị giác Máy tính &amp; AI",
    "skills.cat.infra": "Công cụ &amp; Môi trường",

    /* experience */
    "exp.badge": "Kinh nghiệm · Lộ trình",
    "exp.title": "Nơi công việc đã diễn ra",
    "tl1.date":
      "10/2026 — 12/2026<span class=\"now-label\" aria-label=\"current\">thực tập</span>",
    "tl1.title": "Thực tập sinh Điện toán đám mây &amp; Dữ liệu",
    "tl1.org": "AWS FCAJ",
    "tl1.desc":
      "Tiếp cận thực tế hạ tầng đám mây AWS, xây dựng pipeline xử lý dữ liệu đám mây và kiến trúc phân tán.",
    "tl2.date": "10/2026 — 11/2026",
    "tl2.title": "Thực tập sinh Dữ liệu",
    "tl2.org": "QT-Data Việt Nam (QT-Data VN)",
    "tl2.desc":
      "Tham gia vận hành dữ liệu doanh nghiệp, tự động hóa quy trình trích xuất và phân tích dữ liệu phục vụ vận hành.",
    "tl3.date": "03/2026 — 08/2026",
    "tl3.title": "Nghiên cứu khoa học · Bài báo Tạp chí JTE",
    "tl3.org": "HCMUTE · Tạp chí Giáo dục Kỹ thuật",
    "tl3.desc":
      "Đồng tác giả nghiên cứu 'Application of Comics Generation Techniques in the Visualization of Vietnamese Folk Tales', xuất bản chính thức trên Tạp chí Giáo dục Kỹ thuật JTE (DOI: 10.54644/jte.2026.2148).",
    "tl4.date": "2024",
    "tl4.title": "Chứng chỉ Big Data",
    "tl4.org": "Samsung Innovation Campus (SIC)",
    "tl4.desc":
      "Đào tạo chuyên sâu về Big Data, xử lý dữ liệu phân tán với Apache Spark và kiến trúc kỹ nghệ dữ liệu quy mô lớn.",
    "tl5.date": "2023 — 2027",
    "tl5.title": "Kỹ sư Kỹ thuật Dữ liệu",
    "tl5.org": "ĐH Sư phạm Kỹ thuật TP.HCM (HCMUTE)",
    "tl5.desc":
      "Chuyên ngành Kỹ thuật Dữ liệu: pipeline dữ liệu, hệ thống phân tán, phân tích dữ liệu và thị giác máy tính. Dự kiến tốt nghiệp: 2027.",

    /* cert modal */
    "cert.btn.view": "Xem chứng chỉ ↗",
    "cert.modal.title": "Chứng chỉ Big Data",
    "cert.modal.sub": "Samsung Innovation Campus · Cấp cho Nguyễn Đình Tân Lộc",

    /* endorsements */
    "end.badge": "Tham chiếu · Tiến cử",
    "end.title": "Nhận xét từ người hướng dẫn",
    "end.note": "Đánh giá từ giảng viên hướng dẫn và mentor trong quá trình nghiên cứu và thực tập.",

    /* contact */
    "contact.badge": "Liên hệ · Hộp thư",
    "contact.title": "Cùng nói chuyện về pipeline, dữ liệu hay thị giác",
    "contact.note": "Cách nhanh nhất là email. Bằng cấp và lịch sử đầy đủ: xem CV.",
    "contact.sub.direct": "Kênh trực tiếp",
    "c.phone.k": "Điện thoại",
    "c.copy": "chép",
    "c.resume.k": "CV",
    "c.resume.v": "Tải PDF ↓",

    /* contact form */
    "form.title": "Gửi tin nhắn nhanh",
    "form.desc": "Tin nhắn gửi thẳng về hộp thư của tôi. Tôi thường phản hồi trong vòng 24 giờ.",
    "form.name": "Họ và tên",
    "form.email": "Email của bạn",
    "form.message": "Nội dung tin nhắn / Cơ hội",
    "form.submit": "Gửi tin nhắn →",

    /* footer */
    "footer.meta": "Trình bày bằng Fraunces, Inter &amp; IBM Plex Mono — không framework, không build step.",
    "footer.top": "Về đầu trang ↑",

    /* project discipline filters */
    "p.filter.all": "Tất cả",
    "p.filter.de": "Kỹ nghệ Dữ liệu",
    "p.filter.da": "Phân tích Dữ liệu",
    "p.filter.cv": "Thị giác Máy tính",

    /* terminal test runner */
    "bento.term.run": "Chạy kiểm thử",

    /* command palette */
    "cmd.btn.label": "Menu lệnh (⌘K)",
    "cmd.placeholder": "Gõ lệnh hoặc nhảy tới mục...",
    "cmd.group.nav": "Điều hướng",
    "cmd.group.actions": "Tác vụ nhanh",
    "cmd.item.home": "Trang chủ / Đầu trang",
    "cmd.item.about": "Giới thiệu Tân Lộc",
    "cmd.item.projects": "Dự án kỹ nghệ tiêu biểu",
    "cmd.item.skills": "Kỹ năng chuyên môn & Công nghệ",
    "cmd.item.exp": "Kinh nghiệm & Học vấn",
    "cmd.item.endorsements": "Nhận xét từ người hướng dẫn",
    "cmd.item.contact": "Liên hệ & Gửi tin nhắn",
    "cmd.item.theme": "Đổi giao diện Sáng / Tối",
    "cmd.item.lang": "Đổi ngôn ngữ (EN / VI)",
    "cmd.item.resume": "Tải hồ sơ Résumé PDF",
    "cmd.item.cert": "Xem chứng chỉ Big Data SIC"
  };

  // key -> [{el, original, asHtml, isPlaceholder}] (some keys are used on several elements)
  var els = {};

  function collect() {
    var nodes = document.querySelectorAll("[data-i18n], [data-i18n-placeholder], [data-i18n-title]");
    Array.prototype.forEach.call(nodes, function (el) {
      var key = el.getAttribute("data-i18n");
      var pKey = el.getAttribute("data-i18n-placeholder");
      var tKey = el.getAttribute("data-i18n-title");

      if (key && Object.prototype.hasOwnProperty.call(VI, key)) {
        var asHtml = el.getAttribute("data-i18n-type") === "html";
        var entry = { el: el, original: asHtml ? el.innerHTML : el.textContent, asHtml: asHtml };
        (els[key] = els[key] || []).push(entry);
      }

      if (pKey && Object.prototype.hasOwnProperty.call(VI, pKey)) {
        var pEntry = { el: el, original: el.placeholder || "", isPlaceholder: true };
        (els[pKey] = els[pKey] || []).push(pEntry);
      }

      if (tKey && Object.prototype.hasOwnProperty.call(VI, tKey)) {
        var tEntry = { el: el, original: el.title || "", isTitle: true };
        (els[tKey] = els[tKey] || []).push(tEntry);
      }
    });
  }

  function updateLangToggleUI(lang) {
    var btn = document.querySelector(".lang-toggle");
    if (!btn) return;
    var opts = btn.querySelectorAll(".lang-opt");
    if (opts && opts.length >= 2) {
      opts.forEach(function (opt) {
        var optLang = opt.getAttribute("data-lang");
        opt.classList.toggle("is-active", optLang === lang);
      });
      btn.setAttribute(
        "aria-label",
        lang === "vi"
          ? "Chuyển sang Tiếng Anh (hiện là Tiếng Việt)"
          : "Switch to Vietnamese (currently English)"
      );
    } else {
      btn.textContent = lang === "vi" ? "EN" : "VN";
    }
  }

  function apply(lang) {
    Object.keys(els).forEach(function (key) {
      var value = lang === "vi" ? VI[key] : null;
      els[key].forEach(function (entry) {
        var text = value !== null ? value : entry.original;
        if (entry.isPlaceholder) {
          entry.el.placeholder = text;
        } else if (entry.isTitle) {
          entry.el.title = text;
        } else if (entry.asHtml) {
          entry.el.innerHTML = text;
        } else {
          entry.el.textContent = text;
        }
      });
    });
    document.documentElement.setAttribute("lang", lang);
    updateLangToggleUI(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* private mode — choice simply won't persist */
    }
    try {
      document.dispatchEvent(new CustomEvent("pf:langchange", { detail: { lang: lang } }));
    } catch (e) {}
  }

  function current() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "vi" ? "vi" : "en";
    } catch (e) {
      return "en";
    }
  }

  var isTransitioning = false;

  function switchLang(targetLang) {
    if (!targetLang) targetLang = current() === "vi" ? "en" : "vi";
    if (targetLang === current() && document.documentElement.getAttribute("lang") === targetLang) {
      return;
    }
    if (isTransitioning) return;

    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      apply(targetLang);
      return;
    }

    isTransitioning = true;
    document.body.classList.add("is-lang-transitioning");

    setTimeout(function () {
      apply(targetLang);
      requestAnimationFrame(function () {
        document.body.classList.remove("is-lang-transitioning");
        setTimeout(function () {
          isTransitioning = false;
        }, 120);
      });
    }, 120);
  }

  function init() {
    collect();
    apply(current());
    var btn = document.querySelector(".lang-toggle");
    if (btn) {
        btn.addEventListener("click", function (e) {
          var targetOpt = e.target.closest("[data-lang]");
          var targetLang = targetOpt
            ? targetOpt.getAttribute("data-lang")
            : current() === "vi"
              ? "en"
              : "vi";
          switchLang(targetLang);
        });
      }
  }

    // both scripts are deferred → DOM is parsed, safe to run now
    init();

    return {
      apply: apply,
      current: current,
      switchLang: switchLang,
      VI: VI
    };
  }) ();
