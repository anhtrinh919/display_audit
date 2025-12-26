# DisplayAudit AI

Ứng dụng web kiểm tra trưng bày bán lẻ cho các đội Trade Marketing. Hệ thống sử dụng AI (Google Gemini) để phân tích và so sánh ảnh trưng bày thực tế với tiêu chuẩn.

## Tính năng chính

- **Quản lý Cửa hàng**: Thêm, sửa, xóa cửa hàng với mã, tên, vị trí, quản lý
- **Quản lý Danh mục**: Phân loại các hạng mục kiểm tra
- **Quản lý Hạng mục (Task)**: Tạo chiến dịch kiểm tra với ảnh tiêu chuẩn
- **Kiểm tra AI**: Tải ảnh thực tế và AI phân tích điểm tuân thủ theo quy trình 4 bước:
  1. Đếm số mặt kệ (shelf units)
  2. Đếm số khay kệ trên mỗi mặt kệ
  3. So sánh danh mục sản phẩm trên từng khay
  4. Tổng kết kết quả cho từng mặt kệ
- **Tải ảnh hàng loạt**: Tự động gán cửa hàng dựa trên tên file
- **Dashboard**: Xem tổng quan kết quả kiểm tra theo hạng mục

## Yêu cầu hệ thống

- **Node.js**: v18.x hoặc mới hơn
- **PostgreSQL**: v14.x hoặc mới hơn
- **npm**: v9.x hoặc mới hơn
- **Google Gemini API Key**: Để sử dụng tính năng AI

## Cấu trúc dự án

```
├── client/                 # Frontend React
│   └── src/
│       ├── pages/          # Các trang chính
│       ├── components/     # UI components
│       └── lib/            # API client, utilities
├── server/                 # Backend Express
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Database operations
│   ├── db.ts               # Database connection
│   └── seed.ts             # Dữ liệu mẫu ban đầu
├── shared/                 # Code dùng chung
│   └── schema.ts           # Database schema & types
├── uploads/                # Thư mục lưu ảnh upload
└── drizzle/                # Database migrations
```

## Hướng dẫn cài đặt

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd displayaudit-ai
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình PostgreSQL

Tạo database mới trong PostgreSQL:

```sql
CREATE DATABASE displayaudit;
```

### Bước 4: Cấu hình biến môi trường

Tạo file `.env` ở thư mục gốc với nội dung:

```env
# Database connection
DATABASE_URL=postgresql://username:password@localhost:5432/displayaudit

# Google Gemini API Key
GOOGLE_GEMINI_API_KEY=your-gemini-api-key-here

# Server port (tùy chọn, mặc định 5000)
PORT=5000
```

**Lấy Gemini API Key:**
1. Truy cập [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Đăng nhập bằng tài khoản Google
3. Click "Create API Key"
4. Copy key và dán vào file `.env`

### Bước 5: Chạy database migrations

```bash
npm run db:push
```

Lệnh này sẽ tạo các bảng cần thiết trong database.

### Bước 6: (Tùy chọn) Tạo dữ liệu mẫu

Nếu muốn có sẵn dữ liệu cửa hàng và danh mục mẫu:

```bash
npx tsx server/seed.ts
```

### Bước 7: Chạy ứng dụng

**Development mode:**
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:5000

**Production build:**
```bash
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET/POST/PATCH/DELETE | `/api/stores` | Quản lý cửa hàng |
| GET/POST/PATCH/DELETE | `/api/categories` | Quản lý danh mục |
| GET/POST/PATCH/DELETE | `/api/tasks` | Quản lý hạng mục |
| GET/POST | `/api/audit-results` | Kết quả kiểm tra |
| POST | `/api/audit-results/batch` | Tải ảnh hàng loạt |

## Sử dụng ứng dụng

### 1. Tạo cửa hàng
Vào menu **Cửa hàng** → **Thêm cửa hàng** → Điền thông tin

### 2. Tạo danh mục
Vào menu **Danh mục** → **Thêm danh mục**

### 3. Tạo hạng mục kiểm tra
Vào trang chính → **Tạo Hạng mục mới**:
- Điền tên, mô tả, hạn chót
- Upload ảnh tiêu chuẩn (ảnh mẫu chuẩn)
- Chọn cửa hàng áp dụng

### 4. Thực hiện kiểm tra
Từ hạng mục → **Xem Dashboard** → Chọn cửa hàng → Upload ảnh thực tế

AI sẽ tự động:
- Phân tích cấu trúc kệ trưng bày
- So sánh với ảnh tiêu chuẩn
- Chấm điểm tuân thủ
- Liệt kê các điểm khác biệt

### 5. Tải ảnh hàng loạt
Đặt tên file theo format: `[MaCuaHang]_xxx.jpg`

Ví dụ: `CH001_photo1.jpg` sẽ tự động gán cho cửa hàng có mã `CH001`

## Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: Google Gemini 2.5 Pro

## Xử lý sự cố

### Lỗi kết nối database
```
Error: connect ECONNREFUSED
```
→ Kiểm tra PostgreSQL đang chạy và thông tin DATABASE_URL chính xác

### Lỗi Gemini API
```
Error: API key not valid
```
→ Kiểm tra GOOGLE_GEMINI_API_KEY trong file .env

### Lỗi upload ảnh
```
Error: ENOENT uploads directory
```
→ Tạo thư mục `uploads` ở thư mục gốc: `mkdir uploads`

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo Pull Request hoặc Issue trên GitHub.

## License

MIT License
