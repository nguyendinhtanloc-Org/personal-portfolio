# personal-portfolio

Portfolio tĩnh cho **Nguyễn Đình Tân Lộc** (Data Engineering · Analytics · Computer Vision).

Stack: **HTML + CSS + JS thuần** — không build step, deploy thẳng lên GitHub Pages.

## Cấu trúc

```
index.html   — toàn bộ nội dung (hero, about, projects, skills, experience, contact)
styles.css   — design system "Warm Editorial × Data Lab" (tokens ở :root)
main.js      — nav mobile, scroll-spy, reveal, footer year (site vẫn dùng được khi tắt JS)
cv.pdf       — (chưa có) résumé thật
```

## Checklist nội dung cần thay trước khi publish

Tìm các chuỗi sau trong `index.html` (dùng `Ctrl+F` / `Cmd+F`):

| Chuỗi cần tìm | Thay bằng |
|---|---|
| `your-handle` | handle GitHub / LinkedIn thật của bạn |
| `you@example.com` | email thật |
| `cv.pdf` (3 nơi: nav, contact, có thể thêm) | file PDF thật đặt trong repo (hoặc `assets/cv.pdf`) |
| `class="stamp"` (4 chỗ: "verify your numbers", "add your numbers", "insert your metric", "verify") | số liệu thật bạn đã đo, rồi xóa stamp đi |
| `projects` (link "Live demo") | chỉ giữ lại nếu có demo thật; nếu không, xóa dòng đó |
| Mục `Experience` (3 item timeline) | giữ/xóa/sửa cho đúng với thực tế |

Nguyên tắc: **không publish với link hay số liệu bịa** — chỉ giữ link thật, số thật.

## Chạy local

Mở trực tiếp `index.html` trong trình duyệt, hoặc:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## Deploy lên GitHub Pages

Repo đã trỏ về `nguyendinhtanloc-Org/personal-portfolio` (org site, không phải user site) → URL sẽ là `https://nguyendinhtanloc-Org.github.io/personal-portfolio/` (chỉnh lại canonical/OG URL trong `<head>` sau khi deploy).

1. Push code lên branch `main`:
   ```bash
   git add .
   git commit -m "Initial portfolio"
   git push origin main
   ```
2. Trên GitHub: repo → **Settings → Pages → Build and deployment** → Source: *Deploy from a branch* → Branch: `main`, Folder: `/ (root)` → Save.
3. Chờ ~1 phút, mở URL ở trên.

Vì toàn bộ site là file tĩnh nằm ở root nên **không cần cấu hình base path** — assets dùng path tương đối (`styles.css`, `main.js`).
