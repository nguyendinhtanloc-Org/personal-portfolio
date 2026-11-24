/**
 * personal-portfolio — js/modal.js
 * Controls:
 *  1. Certificate Lightbox Modal (#cert-modal)
 *  2. Project Architecture Case Study Modal (#case-study-modal)
 *  3. Inline Résumé PDF Preview Modal (#resume-modal)
 *  4. Interactive Hero Pipeline SVG Nodes (.pipe-group[data-node])
 */
(function () {
  "use strict";

  var lastFocused = null;

  function getLang() {
    if (window.PF_I18N && typeof window.PF_I18N.current === "function") {
      return window.PF_I18N.current();
    }
    return document.documentElement.getAttribute("lang") === "vi" ? "vi" : "en";
  }

  function openDialog(modalEl, focusEl) {
    if (!modalEl) return;
    lastFocused = document.activeElement;
    modalEl.classList.add("is-active");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (focusEl && focusEl.focus) focusEl.focus();
  }

  function closeDialog(modalEl) {
    if (!modalEl || !modalEl.classList.contains("is-active")) return;
    modalEl.classList.remove("is-active");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
    lastFocused = null;
  }

  /* ---------- 1. Certificate Lightbox Modal ---------- */
  var certModal = document.getElementById("cert-modal");
  var certCloseBtn = document.getElementById("cert-modal-close");
  var certBackdrop = document.getElementById("cert-modal-backdrop");
  var certTriggers = document.querySelectorAll(".btn-cert-link[data-cert]");

  certTriggers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var certSrc = btn.getAttribute("data-cert");
      if (certSrc && certModal) {
        var modalImg = certModal.querySelector(".cert-full-image");
        var modalLink = certModal.querySelector(".cert-modal-external");
        if (modalImg) modalImg.src = certSrc;
        if (modalLink) modalLink.href = certSrc;
      }
      openDialog(certModal, certCloseBtn);
    });
  });

  if (certCloseBtn) {
    certCloseBtn.addEventListener("click", function () {
      closeDialog(certModal);
    });
  }
  if (certBackdrop) {
    certBackdrop.addEventListener("click", function () {
      closeDialog(certModal);
    });
  }

  /* ---------- 2. Project Architecture Case Study Modal ---------- */
  var CASE_STUDIES = {
    p1: {
      cat: "Data Engineering · Lakehouse",
      repo: "https://github.com/nguyendinhtanloc-Org/propmatch-engine/tree/develop",
      en: {
        title: "PropMatch Engine — PropTech Data Lakehouse",
        summary:
          "Solo 8-week production-grade local Data Lakehouse ($0 cloud cost) solving multi-source real-estate Entity Resolution, spatial price analytics, and listing anomaly detection with strictly decoupled Compute & Storage.",
        highlightsTitle: "Core Architectural Guarantees",
        highlights: [
          "Decoupled Compute & Storage: 100% open GeoParquet/Parquet on MinIO S3; in-process vectorized compute via Polars, DuckDB Spatial, and dbt-duckdb.",
          "No Silent Data Loss: every schema or HTTP failure is routed to append-only Dead-Letter Storage (JSONL) with full traceback and retry tags.",
          "Zero False Merge in Gold: multi-pass blocking + Dynamic Denominator Scoring + NetworkX conflict-driven graph refinement; ambiguous clusters (>500m drift) are quarantined to Review Queue."
        ],
        tableTitle: "Source of Truth (SoT) Matrix",
        headers: ["Layer", "Format & Path", "Authority & Mutability"],
        rows: [
          ["Raw", "JSON/HTML gzip · s3://propmatch/raw/", "Primary Immutable SoT (Append-only + SHA-256)"],
          ["Dead-Letter", "JSONL · s3://propmatch/dead_letter/", "Corrupt payload & parser audit trail (Append-only)"],
          ["Silver", "GeoParquet · s3://propmatch/silver/", "Curated SoT (Normalized vnd_per_month & OGC geometry)"],
          ["Gold", "GeoParquet · dim_canonical / fact_observation", "Business SoT (Atomic partition promotion)"],
          ["Review Queue", "Parquet · s3://propmatch/review_queue/", "Quarantine SoT for hard/soft spatial conflicts"]
        ]
      },
      vi: {
        title: "PropMatch Engine — Lakehouse hợp nhất & chấm điểm BĐS",
        summary:
          "Hệ thống Modern Data Lakehouse chạy cục bộ dưới Docker ($0 chi phí đám mây), giải quyết 3 bài toán cốt lõi của dữ liệu BĐS: khử trùng lặp thực thể đa nguồn (Entity Resolution), chấm điểm rủi ro tin đăng và phân tích giá theo không gian địa lý.",
        highlightsTitle: "Cam kết Kiến trúc Cốt lõi",
        highlights: [
          "Tách rời tuyệt đối Compute & Storage: Lưu trữ 100% trên MinIO (S3-compatible) định dạng mở GeoParquet/Parquet; tính toán in-process bằng Polars, DuckDB Spatial và dbt-duckdb.",
          "No Silent Data Loss (Không mất dữ liệu âm thầm): Mọi lỗi HTTP hoặc lệch schema đều được lưu vết vào Dead-Letter Storage (JSONL) kèm error traceback.",
          "Zero False Merge ở tầng Gold: Multi-pass Blocking + NetworkX Graph Refinement; các cụm xung đột (lệch toạ độ >500m) được cách ly tự động sang Review Queue."
        ],
        tableTitle: "Ma trận Phân định Source of Truth (SoT)",
        headers: ["Tầng lưu trữ", "Định dạng & Đường dẫn", "Vai trò & Tính biến đổi"],
        rows: [
          ["Raw", "JSON/HTML gzip · s3://propmatch/raw/", "Primary Immutable SoT (Bất biến, Append-only + SHA-256)"],
          ["Dead-Letter", "JSONL · s3://propmatch/dead_letter/", "Lưu bản ghi lỗi phục vụ audit & sửa parser"],
          ["Silver", "GeoParquet · s3://propmatch/silver/", "Curated SoT (Chuẩn hoá giá vnd_per_month & toạ độ OGC)"],
          ["Gold", "GeoParquet · dim_canonical / fact_observation", "Business SoT (Thực thể duy nhất, Atomic promotion)"],
          ["Review Queue", "Parquet · s3://propmatch/review_queue/", "Quarantine SoT cách ly các cụm xung đột"]
        ]
      }
    },
    p3: {
      cat: "Computer Vision · Active Learning",
      repo: "https://github.com/nguyendinhtanloc-Org/metadata-stratified-active-learning/tree/develop",
      en: {
        title: "Metadata-Stratified Active Learning (BDD100K)",
        summary:
          "Addresses Batch Diversity Collapse in autonomous-driving object detection by combining box-level uncertainty filtering with multi-dimensional physical metadata stratification across weather, scene, and timeofday.",
        highlightsTitle: "3-Stage Sampling Pipeline",
        highlights: [
          "Stage 1 — Hybrid Top-K Uncertainty Filtering: isolates high-uncertainty candidate frames from unlabeled pool using box-level confidence and class entropy.",
          "Stage 2 — Square-Root Frequency Quota (w_k ∝ √N_k): achieves Pareto-optimal balance between natural distribution and rare-domain boosting.",
          "Stage 3 — 3D Iterative Proportional Fitting (IPF / Sinkhorn): enforces simultaneous marginal constraints on (weather, scene, timeofday) with L1 error ≈ 0."
        ],
        tableTitle: "BDD100K Benchmark (3 Seeds: 42, 123, 456 · 2,000 Test Images)",
        headers: ["Metric", "Baseline (Uncertainty)", "Stratified (Ours)", "Statistical Proof"],
        rows: [
          ["Batch Entropy (Round 1)", "3.8366 ± 0.0353 bits", "5.2031 ± 0.0494 bits", "t = 36.26, p = 0.00076 (d = 20.93)"],
          ["Batch Entropy (Round 2)", "3.7010 ± 0.0909 bits", "5.0640 ± 0.0605 bits", "t = 16.82, p = 0.00352 (d = 9.71)"],
          ["adverse_weather mAP50", "0.3223 ± 0.0055", "0.3430 ± 0.0147", "+2.08% gain across all seeds"],
          ["adverse_weather mAP50-95", "0.1753 ± 0.0032", "0.1910 ± 0.0087", "+1.57% tighter localization"],
          ["Automated Test Suite", "pytest test/ -v", "35 / 35 passed", "Entropy, quota & L1 regression verified"]
        ]
      },
      vi: {
        title: "Active Learning phân tầng theo Metadata (BDD100K)",
        summary:
          "Khắc phục hiện tượng Sụp đổ độ đa dạng (Batch Diversity Collapse) khi chọn mẫu gán nhãn cho xe tự hành bằng thuật toán phân tầng đa chiều theo Metadata vật lý (weather, scene, timeofday) kết hợp YOLOv8n.",
        highlightsTitle: "Quy trình Chọn mẫu 3 Giai đoạn",
        highlights: [
          "Giai đoạn 1 — Lọc khó đa tầng (Hybrid Top-K Filtering): Chọn tập ứng viên có độ bất định bounding-box và entropy phân phối lớp cao nhất.",
          "Giai đoạn 2 — Phân bổ Quota Căn bậc hai tần suất (w_k ∝ √N_k): Cân bằng Pareto tối ưu giữa tần suất tự nhiên và ưu tiên miền hiếm.",
          "Giai đoạn 3 — Cân bằng biên 3 chiều bằng IPF / Sinkhorn: Giải bài toán ràng buộc đồng thời trên 3 trục (weather, scene, timeofday) với sai số L1 ≈ 0."
        ],
        tableTitle: "Kết quả Thực nghiệm BDD100K (3 Seeds: 42, 123, 456 · 2.000 ảnh Test)",
        headers: ["Chỉ số thực nghiệm", "Baseline (Uncertainty)", "Stratified (Đề xuất)", "Kiểm định thống kê"],
        rows: [
          ["Entropy Batch Round 1", "3.8366 ± 0.0353 bits", "5.2031 ± 0.0494 bits", "t = 36.26, p = 0.00076 (d = 20.93)"],
          ["Entropy Batch Round 2", "3.7010 ± 0.0909 bits", "5.0640 ± 0.0605 bits", "t = 16.82, p = 0.00352 (d = 9.71)"],
          ["adverse_weather mAP50", "0.3223 ± 0.0055", "0.3430 ± 0.0147", "+2.08% vượt Baseline ở mọi seed"],
          ["adverse_weather mAP50-95", "0.1753 ± 0.0032", "0.1910 ± 0.0087", "+1.57% cải thiện độ siết box"],
          ["Kiểm thử tự động", "pytest test/ -v", "35 / 35 passed", "Kiểm định Shannon entropy & sai số L1"]
        ]
      }
    },
    adr1: {
      cat: "ADR-01 · PropMatch Engine Lakehouse",
      repo: "https://github.com/nguyendinhtanloc-Org/propmatch-engine/tree/develop",
      en: {
        title: "Why MinIO + Polars + DuckDB Spatial ($0) instead of a Spark Cluster",
        summary:
          "For datasets under 1 million real-estate listings (<50GB Parquet), a distributed JVM Spark cluster introduces heavy memory overhead, slow startup, and cloud costs without throughput benefits over vectorized single-node execution.",
        highlightsTitle: "Engineering Trade-off Analysis",
        highlights: [
          "Zero JVM Overhead: Polars (Rust Arrow engine) + DuckDB Spatial execute vectorized columnar queries in-process inside a single Docker container.",
          "True Compute-Storage Separation: MinIO serves S3-compatible buckets locally; switching to AWS S3 in production only changes environment variables.",
          "Deterministic Replay: Immutable Raw HTML/JSON + SHA-256 hashes allow rebuilding Silver & Gold GeoParquet tables from scratch in 15–20 minutes."
        ],
        tableTitle: "Stack Comparison (<1M Listings Workload)",
        headers: ["Dimension", "Spark + Cloud Warehouse", "MinIO + Polars + DuckDB Spatial"],
        rows: [
          ["Infrastructure Cost", "$150–$400 / month", "$0 (Local Docker Compose)"],
          ["Cold Start / ETL Spin-up", "45–90 seconds (JVM / YARN)", "< 1.5 seconds (In-process)"],
          ["Spatial Join Engine", "Sedona / Custom UDFs", "Native DuckDB Spatial + OGC GeoParquet"],
          ["Transformation & Tests", "External dbt adapter", "In-process dbt-duckdb + pytest"]
        ]
      },
      vi: {
        title: "Vì sao chọn MinIO + Polars + DuckDB Spatial ($0) thay vì cụm Spark?",
        summary:
          "Với quy mô dưới 1 triệu tin đăng bất động sản (<50GB Parquet), việc dựng cụm Spark phân tán (JVM) gây tốn RAM, khởi động chậm và đội chi phí cloud mà không nhanh hơn xử lý vector hoá in-process trên single-node.",
        highlightsTitle: "Phân tích Đánh đổi Kỹ thuật (Trade-offs)",
        highlights: [
          "Loại bỏ JVM Overhead: Polars (Rust Arrow) + DuckDB Spatial thực thi truy vấn cột vector hoá trực tiếp trong tiến trình container ETL.",
          "Tách rời Compute & Storage chuẩn S3: MinIO đóng vai trò Object Storage cục bộ; khi lên AWS S3 thật chỉ cần đổi biến môi trường.",
          "Replay Tái lập 100%: Tầng Raw lưu HTML/JSON bất biến kèm mã băm SHA-256, cho phép chạy lại toàn bộ Silver & Gold GeoParquet trong 15–20 phút."
        ],
        tableTitle: "So sánh Kiến trúc (Quy mô <1 Triệu Tin đăng)",
        headers: ["Tiêu chí", "Cụm Spark + Cloud Warehouse", "MinIO + Polars + DuckDB Spatial"],
        rows: [
          ["Chi phí Hạ tầng", "$150–$400 / tháng", "$0 (Local Docker Compose)"],
          ["Thời gian Khởi động Job", "45–90 giây (JVM / Cluster)", "< 1.5 giây (In-process)"],
          ["Xử lý Không gian Địa lý", "Apache Sedona / UDF phức tạp", "DuckDB Spatial + chuẩn OGC GeoParquet"],
          ["Kiểm thử & Biến đổi", "Cần cluster đang chạy", "dbt-duckdb + pytest chạy cục bộ"]
        ]
      }
    },
    adr2: {
      cat: "ADR-02 · Computer Vision Active Learning",
      repo: "https://github.com/nguyendinhtanloc-Org/metadata-stratified-active-learning/tree/develop",
      en: {
        title: "Preventing Batch Diversity Collapse with 3D IPF / Sinkhorn",
        summary:
          "In autonomous driving (BDD100K), pure uncertainty sampling selects visually similar daytime frames, starving rare safety-critical slices like adverse weather and night driving.",
        highlightsTitle: "Mathematical Design Choices",
        highlights: [
          "Why Square-Root Quota (w_k ∝ √N_k)? Uniform allocation over-samples tiny noisy slices, while proportional allocation ignores rare weather. Square-root weighting is the Pareto midpoint.",
          "Why 3D IPF / Sinkhorn? Stratifying independently on weather, scene, or timeofday breaks joint marginals. IPF converges to a 3D contingency tensor with L1 marginal error ≈ 0.",
          "Verified Statistical Significance: Paired t-test across 3 seeds confirms batch entropy jump from 3.84 to 5.20 bits (p = 0.00076) and +2.08% mAP50 on adverse_weather."
        ],
        tableTitle: "Ablation & Design Summary",
        headers: ["Component", "Failure Mode Without It", "Guarantee With It"],
        rows: [
          ["Hybrid Top-K Filter", "Random easy frames enter batch", "Only informative high-uncertainty candidates"],
          ["Square-Root Quota", "Rare weather starved or over-duplicated", "Balanced rare-slice representation"],
          ["3D IPF / Sinkhorn", "Single-axis drift across 3 metadata axes", "Simultaneous 3D marginal balance (L1 ≈ 0)"]
        ]
      },
      vi: {
        title: "Chống sụp đổ độ đa dạng trên BDD100K bằng IPF / Sinkhorn 3 chiều",
        summary:
          "Trong bài toán phát hiện vật thể xe tự hành (BDD100K), chọn mẫu chỉ dựa vào độ bất định (Uncertainty) sẽ gom toàn ảnh ban ngày quen thuộc, bỏ đói các miền hiếm nguy hiểm như mưa tuyết và ban đêm.",
        highlightsTitle: "Quyết định Thiết kế Toán học",
        highlights: [
          "Vì sao dùng Quota Căn bậc hai (w_k ∝ √N_k)? Chia đều sẽ lấy quá nhiều nhiễu ở lát cắt siêu nhỏ, còn chia theo tỷ lệ tự nhiên sẽ bỏ sót thời tiết xấu. Căn bậc hai là điểm cân bằng Pareto.",
          "Vì sao dùng IPF / Sinkhorn 3 chiều? Phân tầng rời rạc từng trục sẽ làm lệch biên hai trục còn lại. IPF hội tụ đồng thời trên cả 3 trục (weather, scene, timeofday) với sai số L1 ≈ 0.",
          "Kiểm định Thống kê Chặt chẽ: Kiểm định Paired t-test qua 3 seeds chứng minh entropy tăng từ 3.84 lên 5.20 bits (p = 0.00076) và tăng +2.08% mAP50 trên miền adverse_weather."
        ],
        tableTitle: "Tóm tắt Vai trò Từng Thành phần",
        headers: ["Thành phần", "Rủi ro nếu thiếu", "Đảm bảo đạt được"],
        rows: [
          ["Lọc khó Hybrid Top-K", "Chọn nhầm các ảnh dễ, ít thông tin", "Chỉ giữ ứng viên có độ bất định cao"],
          ["Quota Căn bậc hai", "Bỏ đói miền hiếm hoặc lặp ảnh", "Tăng độ phủ miền hiếm có kiểm soát"],
          ["IPF / Sinkhorn 3D", "Lệch phân phối đồng thời 3 trục", "Cân bằng biên đa chiều (sai số L1 ≈ 0)"]
        ]
      }
    },
    adr3: {
      cat: "JTE-26 · Peer-Reviewed Journal Paper",
      repo: "https://jte.edu.vn/index.php/jte/article/view/2148",
      en: {
        title: "Application of Comics Generation Techniques in Visualizing Vietnamese Folk Tales",
        summary:
          "Co-authored peer-reviewed paper published in the Journal of Technical Education Science (JTE, HCMUTE) on August 25, 2026 (DOI: 10.54644/jte.2026.2148) with Advisor ThS. Lê Minh Tân.",
        highlightsTitle: "Research Contributions",
        highlights: [
          "Structured Narrative-to-Panel Pipeline: Decomposes traditional Vietnamese folk-tale scripts into scene descriptions, character prompts, and panel layouts.",
          "Visual Consistency & Cultural Fidelity: Maintains character identity and traditional costume/setting coherence across multi-panel comic sequences.",
          "Peer-Reviewed Publication: Completed end-to-end literature review, experimental evaluation, manuscript revision, and formal publication in JTE."
        ],
        tableTitle: "Publication Metadata",
        headers: ["Field", "Details"],
        rows: [
          ["Title", "Application of Comics Generation Techniques in the Visualization of Vietnamese Folk Tales"],
          ["Authors", "Minh Tan Le, Dinh Tan Loc Nguyen"],
          ["Journal", "Journal of Technical Education Science (JTE — HCMUTE)"],
          ["DOI / Date", "10.54644/jte.2026.2148 · Published Aug 25, 2026"]
        ]
      },
      vi: {
        title: "Ứng dụng kỹ thuật sinh truyện tranh trong trực quan hóa truyện dân gian Việt Nam",
        summary:
          "Đồng tác giả bài báo nghiên cứu khoa học được phản biện và xuất bản chính thức trên Tạp chí Giáo dục Kỹ thuật (JTE — HCMUTE) ngày 25/08/2026 (DOI: 10.54644/jte.2026.2148) cùng GVHD ThS. Lê Minh Tân.",
        highlightsTitle: "Đóng góp Nghiên cứu Chính",
        highlights: [
          "Pipeline Chuyển đổi Cốt truyện sang Khung tranh: Phân rã văn bản truyện dân gian Việt Nam thành kịch bản phân cảnh, mô tả nhân vật và bố cục khung truyện.",
          "Tính Nhất quán Hình ảnh & Bản sắc Văn hoá: Duy trì đồng nhất diện mạo nhân vật, trang phục và bối cảnh truyền thống xuyên suốt chuỗi khung tranh.",
          "Công bố Khoa học Chính thức: Hoàn thành toàn bộ quy trình thực nghiệm, đối chiếu kết quả, chỉnh sửa theo phản biện và xuất bản trên tạp chí JTE."
        ],
        tableTitle: "Thông tin Công bố Khoa học",
        headers: ["Danh mục", "Chi tiết"],
        rows: [
          ["Tên bài báo", "Application of Comics Generation Techniques in the Visualization of Vietnamese Folk Tales"],
          ["Tác giả", "Minh Tan Le, Dinh Tan Loc Nguyen (Nguyễn Đình Tấn Lộc)"],
          ["Tạp chí", "Journal of Technical Education Science (JTE — HCMUTE)"],
          ["DOI / Ngày xuất bản", "10.54644/jte.2026.2148 · 25/08/2026"]
        ]
      }
    },
    shortcuts: {
      cat: "Keyboard Navigation · Power User",
      repo: null,
      en: {
        title: "Keyboard Shortcuts & Deep-Link Reference",
        summary:
          "Navigate the entire portfolio without touching the mouse. Single-key shortcuts work anywhere outside text inputs.",
        highlightsTitle: "Power-User Tips & Shareable URLs",
        highlights: [
          "Interactive Shell inside ⌘K: open Command Palette and type >help, >whoami, >stack, >projects, >paper, or >contact.",
          "Shareable Deep-Links: append ?case=p1, ?case=p3, ?case=adr1, ?filter=de, or ?lang=vi to link directly to any view.",
          "Zero-distraction reading: press Esc at any time to dismiss active dialogs or Command Palette."
        ],
        tableTitle: "Global Keyboard Shortcuts",
        headers: ["Key", "Action"],
        rows: [
          ["⌘K / Ctrl+K", "Open / close Command Palette & >shell"],
          ["T", "Toggle Light / Dark theme (circular transition)"],
          ["L", "Switch language (English ↔ Tiếng Việt)"],
          ["R", "Preview Résumé PDF inline"],
          ["C", "Copy 30-second recruiter summary to clipboard"],
          ["V", "Download vCard (.vcf) contact file"],
          ["P", "Print clean A4 executive profile"],
          ["?", "Open this keyboard shortcuts reference"],
          ["Esc", "Close active modal or Command Palette"]
        ]
      },
      vi: {
        title: "Bảng Phím Tắt & Liên Kết Trực Tiếp",
        summary:
          "Điều khiển toàn bộ hồ sơ nhanh chóng bằng bàn phím. Các phím tắt đơn hoạt động ở mọi nơi khi bạn không gõ trong ô nhập liệu.",
        highlightsTitle: "Mẹo Nâng Cao & Deep-Link Chia Sẻ",
        highlights: [
          "Chế độ Shell trong ⌘K: Mở bảng lệnh và gõ >help, >whoami, >stack, >projects, >paper hoặc >contact.",
          "URL Chia sẻ trực tiếp: Thêm ?case=p1, ?case=p3, ?case=adr1, ?filter=de hoặc ?lang=vi để dẫn thẳng tới đúng nội dung.",
          "Thoát nhanh: Nhấn phím Esc bất kỳ lúc nào để đóng hộp thoại hoặc bảng lệnh đang mở."
        ],
        tableTitle: "Danh sách Phím tắt Toàn cục",
        headers: ["Phím tắt", "Tác vụ thực hiện"],
        rows: [
          ["⌘K / Ctrl+K", "Mở / đóng Bảng lệnh nhanh & chế độ >shell"],
          ["T", "Chuyển đổi giao diện Sáng / Tối"],
          ["L", "Chuyển đổi ngôn ngữ (Tiếng Việt ↔ Tiếng Anh)"],
          ["R", "Xem trước hồ sơ Résumé PDF ngay trên trang"],
          ["C", "Sao chép bản tóm tắt hồ sơ 30s cho nhà tuyển dụng"],
          ["V", "Tải thẻ danh bạ điện thoại (.vcf)"],
          ["P", "In hồ sơ tóm tắt chuẩn trang A4"],
          ["?", "Mở bảng tra cứu phím tắt này"],
          ["Esc", "Đóng hộp thoại đang mở"]
        ]
      }
    }
  };

  var csModal = document.getElementById("case-study-modal");
  var csClose = document.getElementById("case-study-close");
  var csBackdrop = document.getElementById("case-study-backdrop");
  var csCat = document.getElementById("case-study-cat");
  var csTitle = document.getElementById("case-study-title");
  var csBody = document.getElementById("case-study-body");
  var csRepoLink = document.getElementById("case-study-repo-link");
  var csShareBtn = document.getElementById("case-study-share-btn");
  var activeCaseKey = null;

  function renderCaseStudy(key) {
    var data = CASE_STUDIES[key];
    if (!data || !csBody) return;
    var lang = getLang();
    var content = data[lang] || data.en;

    if (csCat) csCat.textContent = data.cat;
    if (csTitle) csTitle.textContent = content.title;
    if (csRepoLink) {
      csRepoLink.href = data.repo || "#";
      csRepoLink.style.display = data.repo ? "" : "none";
    }
    if (csShareBtn) {
      csShareBtn.style.display = key === "shortcuts" ? "none" : "";
    }

    csBody.innerHTML = "";

    var summaryP = document.createElement("p");
    summaryP.className = "cs-summary";
    summaryP.textContent = content.summary;
    csBody.appendChild(summaryP);

    var hTitle = document.createElement("h4");
    hTitle.className = "cs-subhead";
    hTitle.textContent = content.highlightsTitle;
    csBody.appendChild(hTitle);

    var ul = document.createElement("ul");
    ul.className = "cs-list";
    content.highlights.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
    csBody.appendChild(ul);

    var tTitle = document.createElement("h4");
    tTitle.className = "cs-subhead";
    tTitle.textContent = content.tableTitle;
    csBody.appendChild(tTitle);

    var tableWrap = document.createElement("div");
    tableWrap.className = "cs-table-wrap";
    var table = document.createElement("table");
    table.className = "cs-table";

    var thead = document.createElement("thead");
    var headTr = document.createElement("tr");
    content.headers.forEach(function (h) {
      var th = document.createElement("th");
      th.textContent = h;
      headTr.appendChild(th);
    });
    thead.appendChild(headTr);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    content.rows.forEach(function (row) {
      var tr = document.createElement("tr");
      row.forEach(function (cell) {
        var td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    csBody.appendChild(tableWrap);
  }

  function openCaseModal(key) {
    if (!CASE_STUDIES[key]) return;
    activeCaseKey = key;
    renderCaseStudy(key);
    openDialog(csModal, csClose);
  }
  window.PF_OPEN_CASE = openCaseModal;

  document.querySelectorAll(".btn-case-study[data-case], .adr-item[data-case], .footer-kbd-hint[data-case]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openCaseModal(btn.getAttribute("data-case"));
    });
  });

  if (csShareBtn) {
    csShareBtn.addEventListener("click", function () {
      if (!activeCaseKey) return;
      var shareUrl = window.location.origin + window.location.pathname + "?case=" + encodeURIComponent(activeCaseKey);
      var lang = getLang();
      function notifyShare() {
        if (window.PF_TOAST && typeof window.PF_TOAST.show === "function") {
          window.PF_TOAST.show(
            lang === "vi"
              ? "Đã sao chép link trực tiếp vào clipboard"
              : "Copied direct link to clipboard"
          );
        }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(notifyShare).catch(notifyShare);
      } else {
        var ta = document.createElement("textarea");
        ta.value = shareUrl;
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (err) {}
        document.body.removeChild(ta);
        notifyShare();
      }
    });
  }

  try {
    var qCase = new URLSearchParams(window.location.search).get("case");
    if (qCase && CASE_STUDIES[qCase]) {
      setTimeout(function () {
        openCaseModal(qCase);
      }, 120);
    }
  } catch (e) {}

  if (csClose) {
    csClose.addEventListener("click", function () {
      closeDialog(csModal);
    });
  }
  if (csBackdrop) {
    csBackdrop.addEventListener("click", function () {
      closeDialog(csModal);
    });
  }

  /* ---------- 3. Inline Résumé Preview Modal ---------- */
  var resumeModal = document.getElementById("resume-modal");
  var resumeClose = document.getElementById("resume-modal-close");
  var resumeBackdrop = document.getElementById("resume-modal-backdrop");
  var resumeIframe = document.getElementById("resume-iframe");

  function openResumePreview() {
    if (!resumeModal) return;
    if (resumeIframe && !resumeIframe.getAttribute("src")) {
      resumeIframe.setAttribute("src", "assets/docs/NguyenDinhTanLoc_Resume.pdf");
    }
    openDialog(resumeModal, resumeClose);
  }
  window.PF_OPEN_RESUME = openResumePreview;

  /* ---------- Recruiter 30s Pitch Copy ---------- */
  function copyRecruiterPitch() {
    var lang = getLang();
    var text = lang === "vi"
      ? "Nguyễn Đình Tấn Lộc — Sinh viên Kỹ thuật Dữ liệu tại HCMUTE (Tốt nghiệp dự kiến 2027)\n" +
        "• Định hướng: Data Engineering (DE) · Data Analytics (DA) · Computer Vision (CV) (TP.HCM / Đồng Nai)\n" +
        "• Kinh nghiệm: Thực tập sinh Cloud & Data @ AWS FCAJ (10–12/2026) | Thực tập sinh Dữ liệu @ QT-Data VN (10–11/2026)\n" +
        "• Công bố khoa học: Đồng tác giả bài báo Tạp chí JTE (DOI: 10.54644/jte.2026.2148)\n" +
        "• Dự án tiêu biểu: PropMatch Engine Lakehouse (MinIO + Polars + DuckDB Spatial + dbt) & Metadata-Stratified Active Learning (BDD100K + YOLOv8)\n" +
        "• Liên hệ: ndtl05062005@gmail.com | +84 966 150 875 | https://github.com/nguyendinhtanloc"
      : "Nguyễn Đình Tấn Lộc — B.Eng. in Data Engineering at HCMUTE (Expected Graduation: 2027)\n" +
        "• Focus: Data Engineering (DE) · Data Analytics (DA) · Computer Vision (CV) Internships (HCM / Dong Nai)\n" +
        "• Experience: Cloud & Data Intern @ AWS FCAJ (10–12/2026) | Data Intern @ QT-Data VN (10–11/2026)\n" +
        "• Publication: Co-author in Journal of Technical Education Science (DOI: 10.54644/jte.2026.2148)\n" +
        "• Key Projects: PropMatch Engine Lakehouse (MinIO + Polars + DuckDB Spatial + dbt) & Metadata-Stratified Active Learning (BDD100K + YOLOv8)\n" +
        "• Contact: ndtl05062005@gmail.com | +84 966 150 875 | https://github.com/nguyendinhtanloc";

    function notify() {
      if (window.PF_TOAST && typeof window.PF_TOAST.show === "function") {
        window.PF_TOAST.show(
          lang === "vi"
            ? "Đã sao chép tóm tắt hồ sơ 30s vào clipboard"
            : "Copied 30s recruiter summary to clipboard"
        );
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(notify).catch(notify);
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (err) {}
      document.body.removeChild(ta);
      notify();
    }
  }
  window.PF_COPY_PITCH = copyRecruiterPitch;

  document.querySelectorAll("[data-copy-pitch]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      copyRecruiterPitch();
    });
  });

  /* ---------- One-Click vCard (.vcf) Contact Download ---------- */
  function downloadVCard() {
    var lang = getLang();
    var vcf = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN;CHARSET=UTF-8:Nguyễn Đình Tấn Lộc",
      "N;CHARSET=UTF-8:Nguyễn;Lộc;Đình Tấn;;",
      "TITLE;CHARSET=UTF-8:Data Engineering · Analytics · Computer Vision",
      "ORG;CHARSET=UTF-8:HCMUTE (Class of 2027)",
      "TEL;TYPE=CELL:+84966150875",
      "EMAIL;TYPE=INTERNET:ndtl05062005@gmail.com",
      "URL:https://github.com/nguyendinhtanloc",
      "ADR;TYPE=HOME;CHARSET=UTF-8:;;Ho Chi Minh City & Dong Nai;;;Vietnam",
      "NOTE;CHARSET=UTF-8:B.Eng. Data Engineering @ HCMUTE (2027) | Intern @ AWS FCAJ & QT-Data VN | JTE Author (DOI: 10.54644/jte.2026.2148)",
      "END:VCARD"
    ].join("\r\n");

    try {
      var blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "NguyenDinhTanLoc.vcf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {}

    if (window.PF_TOAST && typeof window.PF_TOAST.show === "function") {
      window.PF_TOAST.show(
        lang === "vi"
          ? "Đã tải thẻ danh bạ NguyenDinhTanLoc.vcf"
          : "Saved contact card NguyenDinhTanLoc.vcf"
      );
    }
  }
  window.PF_DOWNLOAD_VCARD = downloadVCard;

  document.querySelectorAll("[data-vcard]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      downloadVCard();
    });
  });

  document.querySelectorAll("[data-resume-preview]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openResumePreview();
    });
  });

  if (resumeClose) {
    resumeClose.addEventListener("click", function () {
      closeDialog(resumeModal);
    });
  }
  if (resumeBackdrop) {
    resumeBackdrop.addEventListener("click", function () {
      closeDialog(resumeModal);
    });
  }

  /* ---------- 4. Interactive Hero Pipeline Nodes ---------- */
  var NODE_SPECS = {
    source: {
      en: {
        label: "Layer 01 · Source & Ingest",
        text: "Multi-source web crawlers with rate-limiting + Synthetic Seed Generator & BDD100K raw pool indexing."
      },
      vi: {
        label: "Tầng 01 · Thu thập (Source & Ingest)",
        text: "Crawler đa nguồn có kiểm soát rate-limit + bộ sinh Synthetic Seed & lập chỉ mục tập ảnh gốc BDD100K."
      }
    },
    stream: {
      en: {
        label: "Layer 02 · Validation & Transform",
        text: "Polars & Pydantic schema contracts, SHA-256 fingerprinting, and Dead-Letter Queue (DLQ) quarantine for zero silent loss."
      },
      vi: {
        label: "Tầng 02 · Kiểm định & Chuẩn hoá",
        text: "Kiểm định schema bằng Polars & Pydantic, băm SHA-256 và cách ly bản ghi lỗi vào Dead-Letter Queue (DLQ)."
      }
    },
    store: {
      en: {
        label: "Layer 03 · Lakehouse Storage",
        text: "MinIO S3 Medallion (Raw → Silver → Gold) in OGC GeoParquet, queried in-process via DuckDB Spatial & dbt-duckdb."
      },
      vi: {
        label: "Tầng 03 · Lưu trữ Lakehouse",
        text: "MinIO S3 phân tầng Medallion (Raw → Silver → Gold) định dạng OGC GeoParquet, truy vấn qua DuckDB Spatial & dbt-duckdb."
      }
    },
    model: {
      en: {
        label: "Layer 04 · Model & Entity Resolution",
        text: "NetworkX graph Entity Resolution, Z-score/IQR risk scoring, and YOLOv8 Active Learning with 3D IPF/Sinkhorn."
      },
      vi: {
        label: "Tầng 04 · Mô hình & Hợp nhất Thực thể",
        text: "Entity Resolution bằng đồ thị NetworkX, chấm điểm rủi ro Z-score/IQR và YOLOv8 Active Learning với IPF/Sinkhorn 3 chiều."
      }
    }
  };

  var pipeGroups = document.querySelectorAll(".pipe-group[data-node]");
  var layerBtns = Array.prototype.slice.call(
    document.querySelectorAll(".hero-layer-btn[data-node]")
  );
  var heroNoteLabel = document.querySelector(".hero-note-label");
  var heroNoteText = document.querySelector(".hero-note-text");
  var selectedNodeKey = null;

  function selectHeroNode(nodeKey) {
    var spec = NODE_SPECS[nodeKey];
    if (!spec || !heroNoteLabel || !heroNoteText) return;
    selectedNodeKey = nodeKey;
    var lang = getLang();
    var copy = spec[lang] || spec.en;

    pipeGroups.forEach(function (g) {
      var isMatch = g.getAttribute("data-node") === nodeKey;
      g.classList.toggle("is-selected", isMatch);
      var rect = g.querySelector(".pipe-node");
      if (rect) {
        rect.classList.toggle("pipe-node-acc", isMatch);
      }
    });

    layerBtns.forEach(function (btn) {
      var isMatch = btn.getAttribute("data-node") === nodeKey;
      btn.classList.toggle("is-active", isMatch);
      btn.setAttribute("aria-selected", String(isMatch));
    });

    heroNoteLabel.textContent = copy.label;
    heroNoteText.textContent = copy.text;
  }

  pipeGroups.forEach(function (g) {
    var key = g.getAttribute("data-node");
    g.addEventListener("click", function () {
      selectHeroNode(key);
      triggerHeroPulse();
    });
    g.addEventListener("mouseenter", function () {
      selectHeroNode(key);
    });
  });

  var pulseBtn = document.getElementById("btn-hero-pulse");
  var pulseCountEl = document.getElementById("hero-pulse-count");
  var sigA = document.querySelector(".hero-motif .signal-a");
  var sigB = document.querySelector(".hero-motif .signal-b");
  var sigC = document.querySelector(".hero-motif .signal-c");
  var pipeLines = document.querySelectorAll(".hero-motif .pipe-line");
  var pulseCounter = 1;
  var pulseTimers = [];

  function clearPulseTimers() {
    while (pulseTimers.length) {
      clearTimeout(pulseTimers.pop());
    }
  }

  function setNodesHighlight(keys) {
    pipeGroups.forEach(function (g) {
      var k = g.getAttribute("data-node");
      var isMatch = keys.indexOf(k) !== -1;
      g.classList.toggle("is-selected", isMatch);
      var rect = g.querySelector(".pipe-node");
      if (rect) rect.classList.toggle("pipe-node-acc", isMatch);
    });
    layerBtns.forEach(function (btn) {
      var k = btn.getAttribute("data-node");
      var isMatch = keys.indexOf(k) !== -1;
      btn.classList.toggle("is-active", isMatch);
      btn.setAttribute("aria-selected", String(isMatch));
    });
  }

  function animateSvgSignal(el, keyframes, duration) {
    if (!el) return;
    el.style.animation = "none";
    el.style.opacity = "1";
    if (typeof el.animate === "function") {
      var anim = el.animate(keyframes, {
        duration: duration,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards"
      });
      anim.onfinish = function () {
        el.style.opacity = "0";
      };
    }
  }

  function triggerHeroPulse() {
    clearPulseTimers();
    pulseCounter++;
    var formattedCount = pulseCounter < 10 ? "0" + pulseCounter : String(pulseCounter);
    if (pulseCountEl) {
      pulseCountEl.textContent = formattedCount;
    }

    var lang = getLang();

    // Reset signal opacities
    [sigA, sigB, sigC].forEach(function (s) {
      if (s) {
        s.style.animation = "none";
        s.style.opacity = "0";
      }
    });
    pipeLines.forEach(function (l) {
      l.classList.remove("is-active-line");
    });

    // Step 1 (0ms): Highlight SOURCE and launch signal-a (source -> stream)
    setNodesHighlight(["source"]);
    if (pipeLines[0]) pipeLines[0].classList.add("is-active-line");
    if (heroNoteLabel && heroNoteText) {
      heroNoteLabel.textContent =
        lang === "vi"
          ? "Event #" + formattedCount + " · [1/3] Thu thập tại Source"
          : "Event #" + formattedCount + " · [1/3] Ingested at Source";
      heroNoteText.textContent =
        lang === "vi"
          ? "Đang gán nhãn UUID4 & mã băm SHA-256 trước khi đẩy vào luồng Stream..."
          : "Assigning UUID4 & SHA-256 fingerprint before pushing to Stream...";
    }
    animateSvgSignal(
      sigA,
      [
        { opacity: 0, transform: "translateX(0px)" },
        { opacity: 1, transform: "translateX(12px)", offset: 0.15 },
        { opacity: 1, transform: "translateX(88px)", offset: 0.85 },
        { opacity: 0, transform: "translateX(100px)" }
      ],
      480
    );

    // Step 2 (460ms): Arrive at STREAM, validate contract, split into B (store) & C (model)
    pulseTimers.push(
      setTimeout(function () {
        if (pipeLines[0]) pipeLines[0].classList.remove("is-active-line");
        if (pipeLines[1]) pipeLines[1].classList.add("is-active-line");
        if (pipeLines[2]) pipeLines[2].classList.add("is-active-line");
        setNodesHighlight(["stream"]);
        if (heroNoteLabel && heroNoteText) {
          heroNoteLabel.textContent =
            lang === "vi"
              ? "Event #" + formattedCount + " · [2/3] Kiểm định & Tách nhánh tại Stream"
              : "Event #" + formattedCount + " · [2/3] Validated & Split at Stream";
          heroNoteText.textContent =
            lang === "vi"
              ? "Hợp đồng Polars/Pydantic hợp lệ (0 lỗi DLQ) — nhân bản song song sang Store và Model..."
              : "Polars/Pydantic contract valid (0 DLQ) — fan-out to Store and Model...";
        }

        animateSvgSignal(
          sigB,
          [
            { opacity: 0, transform: "translateX(0px)" },
            { opacity: 1, transform: "translateX(12px)", offset: 0.15 },
            { opacity: 1, transform: "translateX(88px)", offset: 0.85 },
            { opacity: 0, transform: "translateX(100px)" }
          ],
          500
        );
        animateSvgSignal(
          sigC,
          [
            { opacity: 0, transform: "translateY(0px)" },
            { opacity: 1, transform: "translateY(12px)", offset: 0.15 },
            { opacity: 1, transform: "translateY(82px)", offset: 0.85 },
            { opacity: 0, transform: "translateY(96px)" }
          ],
          500
        );
      }, 460)
    );

    // Step 3 (960ms): Arrive at STORE + MODEL simultaneously
    pulseTimers.push(
      setTimeout(function () {
        pipeLines.forEach(function (l) {
          l.classList.remove("is-active-line");
        });
        setNodesHighlight(["store", "model"]);
        if (heroNoteLabel && heroNoteText) {
          heroNoteLabel.textContent =
            lang === "vi"
              ? "✓ Event #" + formattedCount + " · [3/3] Hoàn tất tại Store & Model (0% thất thoát)"
              : "✓ Event #" + formattedCount + " · [3/3] Committed to Store & Model (0% loss)";
          heroNoteText.textContent =
            lang === "vi"
              ? "Đã ghi Silver/Gold GeoParquet trên MinIO và kích hoạt nhánh Model (Entity Resolution & YOLOv8)."
              : "Persisted to MinIO Silver/Gold GeoParquet and triggered Model branch (Entity Resolution & YOLOv8).";
        }
      }, 960)
    );
  }

  if (pulseBtn) {
    pulseBtn.addEventListener("click", function () {
      triggerHeroPulse();
    });
  }

  /* ---------- 5. Interactive Skill-to-Proof Inspector ---------- */
  var SKILL_PROOFS = {
    "Python": {
      en: "Core language across PropMatch Engine (Polars/DuckDB ETL), BDD100K Active Learning (PyTorch/IPF), and JTE 2026 research.",
      vi: "Ngôn ngữ chính trong PropMatch Engine (Polars/DuckDB ETL), BDD100K Active Learning (PyTorch/IPF) và nghiên cứu JTE 2026."
    },
    "SQL": {
      en: "Used daily for DuckDB Spatial analytical queries, dbt-duckdb Gold models, and PostgreSQL data reconciliation.",
      vi: "Sử dụng hằng ngày cho truy vấn phân tích DuckDB Spatial, mô hình Gold dbt-duckdb và đối soát dữ liệu PostgreSQL."
    },
    "Bash": {
      en: "Automated experiment runners (run_baseline.sh, run_stratify.sh) and Docker ETL orchestration scripts.",
      vi: "Viết script tự động hoá thực nghiệm (run_baseline.sh, run_stratify.sh) và điều phối container ETL."
    },
    "Apache Spark": {
      en: "Trained & certified via Samsung Innovation Campus (SIC) Big Data program for distributed data processing.",
      vi: "Đào tạo chuyên sâu và cấp chứng chỉ tại chương trình Big Data — Samsung Innovation Campus (SIC)."
    },
    "Apache Kafka": {
      en: "Event-streaming architecture patterns, consumer offset management, and at-least-once delivery pipelines.",
      vi: "Thiết kế luồng sự kiện streaming, quản lý offset và đảm bảo chuyển phát at-least-once cho pipeline dữ liệu."
    },
    "Apache Airflow": {
      en: "DAG scheduling, idempotent task retries, and automated batch pipeline orchestration.",
      vi: "Lập lịch DAG, xử lý retry chuẩn idempotent và điều phối pipeline dữ liệu tự động."
    },
    "dbt Core": {
      en: "Powers PropMatch Engine transformation layers (staging → intermediate → marts → audit) via dbt-duckdb.",
      vi: "Xây dựng các tầng biến đổi dữ liệu của PropMatch Engine (staging → intermediate → marts → audit) qua dbt-duckdb."
    },
    "PostgreSQL": {
      en: "Primary relational warehouse for structured analytics, indexing, and ACID transactional storage.",
      vi: "Hệ quản trị CSDL quan hệ chính cho kho dữ liệu phân tích, tối ưu chỉ mục và lưu trữ chuẩn ACID."
    },
    "BigQuery": {
      en: "Cloud columnar data warehousing, partitioned analytical queries, and BI dataset modeling.",
      vi: "Kho dữ liệu đám mây dạng cột, tối ưu truy vấn phân vùng và mô hình hoá dữ liệu phục vụ BI."
    },
    "Power BI": {
      en: "Interactive executive dashboards, DAX measures, and business KPI visualization during QT-Data VN internship.",
      vi: "Xây dựng dashboard trực quan, viết hàm DAX và báo cáo chỉ số KPI trong kỳ thực tập tại QT-Data VN."
    },
    "Metabase": {
      en: "Self-hosted BI exploration and decision-support reporting on top of Gold Medallion tables.",
      vi: "Trực quan hoá dữ liệu tự host và xây dựng báo cáo hỗ trợ quyết định trên tầng dữ liệu Gold."
    },
    "Pandas": {
      en: "Rapid data profiling, statistical t-test analysis (Cohen's d, entropy), and ground-truth labeling notebooks.",
      vi: "Khám phá dữ liệu, phân tích kiểm định thống kê (Paired t-test, Cohen's d) và gán nhãn thực nghiệm."
    },
    "PyTorch": {
      en: "Deep learning backbone for BDD100K active learning loop and JTE 2026 Vietnamese folk-tale visualization research.",
      vi: "Nền tảng huấn luyện mô hình trong vòng lặp Active Learning BDD100K và bài báo nghiên cứu JTE 2026."
    },
    "OpenCV": {
      en: "Image preprocessing, bounding-box augmentation, and visual frame inspection for computer vision datasets.",
      vi: "Tiền xử lý ảnh, biến đổi bounding-box và kiểm tra trực quan tập dữ liệu thị giác máy tính."
    },
    "YOLO": {
      en: "YOLOv8n object detector trained across 18 runs (3 seeds) on BDD100K, achieving +2.08% mAP50 on adverse_weather.",
      vi: "Mô hình phát hiện vật thể YOLOv8n huấn luyện qua 18 runs (3 seeds) trên BDD100K, đạt +2.08% mAP50 miền thời tiết xấu."
    },
    "Docker": {
      en: "Containerizes the entire $0 PropMatch Lakehouse (MinIO, Polars/DuckDB ETL) and reproducible CV training environments.",
      vi: "Đóng gói toàn bộ hạ tầng $0 của PropMatch Lakehouse (MinIO, ETL) và môi trường thực nghiệm CV tái lập 100%."
    },
    "Git": {
      en: "Branch-disciplined workflow (main/develop), conventional commits, and automated pytest CI verification.",
      vi: "Quản lý mã nguồn theo nhánh (main/develop), chuẩn Conventional Commits và kiểm thử tự động pytest."
    },
    "Linux": {
      en: "Daily development environment for shell scripting, container networking, and headless GPU training.",
      vi: "Môi trường phát triển hằng ngày để vận hành container, viết bash script và huấn luyện mô hình trên GPU."
    }
  };

  var skillBadges = Array.prototype.slice.call(
    document.querySelectorAll("#skills .tech-badge")
  );
  var proofTagEl = document.getElementById("skill-proof-tag");
  var proofTextEl = document.getElementById("skill-proof-text");
  var selectedSkillName = null;

  function selectSkillBadge(badgeEl) {
    if (!badgeEl || !proofTagEl || !proofTextEl) return;
    var nameEl = badgeEl.querySelector(".badge-name");
    var name = nameEl ? nameEl.textContent.trim() : "";
    var proof = SKILL_PROOFS[name];
    if (!proof) return;

    selectedSkillName = name;
    var lang = getLang();

    skillBadges.forEach(function (b) {
      b.classList.toggle("is-selected", b === badgeEl);
    });

    proofTagEl.textContent = name;
    proofTextEl.textContent = proof[lang] || proof.en;
  }

  skillBadges.forEach(function (badge) {
    badge.setAttribute("tabindex", "0");
    badge.setAttribute("role", "button");
    badge.addEventListener("click", function () {
      selectSkillBadge(badge);
    });
    badge.addEventListener("mouseenter", function () {
      selectSkillBadge(badge);
    });
    badge.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectSkillBadge(badge);
      }
    });
  });

  layerBtns.forEach(function (btn, idx) {
    var key = btn.getAttribute("data-node");
    btn.addEventListener("click", function () {
      selectHeroNode(key);
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        var nextIdx = e.key === "ArrowRight"
          ? (idx + 1) % layerBtns.length
          : (idx - 1 + layerBtns.length) % layerBtns.length;
        var nextBtn = layerBtns[nextIdx];
        if (nextBtn) {
          nextBtn.focus();
          selectHeroNode(nextBtn.getAttribute("data-node"));
        }
      }
    });
  });

  /* ---------- Global Escape, Focus Trap & Language Change Sync ---------- */
  document.addEventListener("keydown", function (e) {
    var activeModal =
      (certModal && certModal.classList.contains("is-active") && certModal) ||
      (csModal && csModal.classList.contains("is-active") && csModal) ||
      (resumeModal && resumeModal.classList.contains("is-active") && resumeModal) ||
      null;

    if (!activeModal) return;

    if (e.key === "Escape") {
      closeDialog(activeModal);
      return;
    }

    if (e.key === "Tab") {
      var focusables = Array.prototype.slice.call(
        activeModal.querySelectorAll("button, [href], iframe, [tabindex]:not([tabindex='-1'])")
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
    }
  });

  document.addEventListener("pf:langchange", function () {
    if (activeCaseKey && csModal && csModal.classList.contains("is-active")) {
      renderCaseStudy(activeCaseKey);
    }
    if (selectedNodeKey) {
      selectHeroNode(selectedNodeKey);
    }
    if (selectedSkillName && proofTextEl && SKILL_PROOFS[selectedSkillName]) {
      var lang = getLang();
      proofTextEl.textContent = SKILL_PROOFS[selectedSkillName][lang] || SKILL_PROOFS[selectedSkillName].en;
    }
  });
})();
