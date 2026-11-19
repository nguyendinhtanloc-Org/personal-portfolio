# personal-portfolio

Portfolio tĩnh cá nhân của **Nguyễn Đình Tấn Lộc** (Data Engineering · Analytics · Computer Vision).

Stack: **HTML + CSS + JS thuần** — không build step, không phụ thuộc framework/bundler/npm, deploy thẳng lên Vercel hoặc GitHub Pages.

---

## Triết lý Thiết kế: "Warm Sand & Champagne Bronze"

Dự án được xây dựng theo chuẩn mực **Distinctive UI Engineering**:
- **Bảng màu Cát ấm & Đồng thau (Warm, Eye-friendly, Zero Blue Light):**
  - **Light mode:** Nền màu cát ấm dịu mát (`#faf8f5`), chữ than đá trầm (`#1c1917`), viền yến mạch (`#e7e5e4`).
  - **Dark mode:** Nền than củi ấm (`#121110`), bề mặt thẻ bazan (`#1a1816`), chữ bạc ấm (`#f5f5f4`).
  - **Màu điểm nhấn:** Sắc đồng thau ánh kim / Champagne Bronze (`#b4833e` / `#d4a359`) sang trọng, ấm cúng và hoàn toàn không gây mỏi mắt.
- **Typography Kỹ thuật Hiện đại:** 100% sử dụng font Sans-serif dứt khoát (**Inter**) và Monospace (**IBM Plex Mono**) với `tabular-nums` cho số liệu KPI và thời gian thực, loại bỏ hoàn toàn font có chân Serif hoài cổ.
- **Loại bỏ triệt để AI Design Tropes:**
  - Không có đường gạch lượn sóng squiggle thừa thãi.
  - Không có các số thứ tự trang trí vô nghĩa (`01.A`, `01.B`, `fig. 01`, `fig. 02`).
  - Không có con dấu đóng đỏ giả hay mũi tên trang trí lề.
  - Chuẩn hóa toàn bộ nhãn giao diện sang **Sentence case** thân thiện với người đọc.
- **Tài sản Kỹ thuật Thực tế (High-Signal Artifacts):**
  - Schema Pydantic đối soát dữ liệu (Data Contract & Checksum) tại ô Bento Code.
  - Sơ đồ phân tầng pipeline dữ liệu rõ ràng: Ingestion ➔ Streaming ➔ Transformation ➔ Serving.

---

## Cấu trúc thư mục dự án

```
.
├── index.html                  # Trang chủ (Hero, Bento About, Projects, Skills, Experience, Contact)
├── 404.html                    # Trang Not Found kỹ thuật
├── styles.css                  # Master CSS entrypoint (@import các file trong css/)
│
├── css/                        # Hệ thống stylesheet phân tách module
│   ├── variables.css           # Bảng màu Warm Sand & Champagne Bronze, typography, themes
│   ├── base.css                # Reset, typography Inter/Mono, layout, evidence blocks, 404
│   ├── components.css          # Nav, Badges SVG, Modal, Form card, Spotlight, Filters, Cmd+K, Runner
│   ├── sections.css            # Hero pipeline, Bento Grid, Projects, Skills, Timeline, Contact
│   └── print.css               # Stylesheet in ấn khổ A4 / xuất file PDF tóm tắt chuyên nghiệp
│
├── js/                         # Bộ công cụ hành vi tương tác độc lập (Zero-dependency)
│   ├── i18n.js                 # Engine chuyển đổi song ngữ EN / VI (130/130 keys đồng bộ 100%)
│   ├── theme.js                # Chuyển đổi Light/Dark mode, localStorage, meta theme-color, OS listener
│   ├── navigation.js           # Nav mobile, scroll-spy, progress bar, copy-to-clipboard, reveal animation
│   ├── modal.js                # Lightbox modal phóng to chứng chỉ Big Data SIC, hỗ trợ phím Escape
│   ├── contact-form.js         # Gửi tin nhắn nhanh qua Formspree AJAX, thông báo trạng thái & fallback mailto
│   ├── endorsements.js         # Render section endorsements từ dữ liệu, đồng bộ i18n + toggle show/hide
│   ├── project-filter.js       # Bộ lọc phân loại dự án (All, Data Engineering, Analytics, Computer Vision)
│   ├── terminal-runner.js      # Giả lập chạy kiểm thử streaming log đường ống dữ liệu (Bento Card 4)
│   ├── clock.js                # Đồng hồ thời gian thực TP. Hồ Chí Minh (UTC+7) trên thanh Navigation
│   └── command-palette.js      # Menu phím tắt Command Palette (Cmd+K / Ctrl+K) tìm kiếm & điều hướng
│
├── assets/
│   ├── images/
│   │   ├── anh-cv.jpg          # Ảnh chân dung đặt tại Bento Grid About
│   │   ├── bd-certificate.jpg  # Ảnh chứng chỉ Big Data Samsung Innovation Campus (SIC)
│   │   ├── og-image.png        # Banner xem trước khi chia sẻ mạng xã hội (1200x630)
│   │   └── og-image.svg        # File vector gốc của banner Open Graph
│   ├── docs/
│   │   └── NguyenDinhTanLoc_Resume.pdf # Résumé PDF của Tấn Lộc tải về
│   └── icons/
│       └── favicon.svg         # Favicon monogram "T."
│
├── favicon.svg                 # Favicon dự phòng tại root cho các crawler/browser mặc định
├── robots.txt                  # Hướng dẫn bot công cụ tìm kiếm
├── sitemap.xml                 # Sơ đồ trang web
└── vercel.json                 # Cấu hình bảo mật HTTP headers và cache bất biến (immutable cache)
```

---

## Chạy thử nghiệm trên máy (Local)

Mở trực tiếp file `index.html` trong bất kỳ trình duyệt nào, hoặc khởi chạy HTTP server tích hợp sẵn của Python:

```bash
python3 -m http.server 8080
# Mở trình duyệt truy cập: http://localhost:8080
```

---

## Hướng dẫn Triển khai (Deploy)

### 1. Vercel (Khuyến nghị)
1. Truy cập [vercel.com](https://vercel.com) → Chọn **Import Project** → Chọn repository này.
2. Framework Preset: Chọn **Other** (static).
3. Build Command: Để trống.
4. Output Directory: Để trống (`./`).
5. Bấm **Deploy** — Vercel sẽ tự động cấu hình các header bảo mật và cache từ file `vercel.json`.

### 2. GitHub Pages (Dự phòng)
1. Vào repository trên GitHub → **Settings** → **Pages**.
2. Chọn nhánh `main` (hoặc `develop`), thư mục `/ (root)`.
3. Bấm **Save** — toàn bộ tài nguyên dùng đường dẫn tương đối nên tương thích hoàn toàn.
