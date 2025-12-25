# DisplayAudit AI

## Overview
DisplayAudit AI là ứng dụng web kiểm tra trưng bày bán lẻ cho các đội Trade Marketing. Hệ thống sử dụng AI (Gemini) để phân tích và so sánh ảnh trưng bày thực tế với tiêu chuẩn.

## Tính năng chính
- **Quản lý Cửa hàng**: CRUD cửa hàng với mã, tên, vị trí, quản lý
- **Quản lý Danh mục**: Phân loại các hạng mục kiểm tra
- **Quản lý Hạng mục (Task)**: Tạo chiến dịch kiểm tra với ảnh tiêu chuẩn
- **Kiểm tra AI**: Tải ảnh thực tế và AI phân tích điểm tuân thủ
- **Tải ảnh hàng loạt**: Tự động gán cửa hàng dựa trên tên file

## Cấu trúc dự án
```
├── client/src/
│   ├── pages/           # Các trang chính
│   ├── components/      # UI components
│   └── lib/api.ts       # API client
├── server/
│   ├── routes.ts        # API endpoints
│   ├── storage.ts       # Database operations
│   ├── db.ts            # Database connection
│   └── seed.ts          # Initial data
├── shared/
│   └── schema.ts        # Database schema & types
└── uploads/             # Uploaded images
```

## Tech Stack
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: Google Gemini 2.5 Flash (via Replit AI Integrations)

## API Endpoints
- `GET/POST/PATCH/DELETE /api/stores` - Quản lý cửa hàng
- `GET/POST/PATCH/DELETE /api/categories` - Quản lý danh mục
- `GET/POST/PATCH/DELETE /api/tasks` - Quản lý hạng mục
- `GET/POST /api/audit-results` - Kết quả kiểm tra
- `POST /api/audit-results/batch` - Tải ảnh hàng loạt

## Quy ước giao diện
- Toàn bộ UI bằng tiếng Việt
- "Hạng mục" = Task/Campaign
- "Trưng bày" = Display
- "Đạt/Không Đạt" = Pass/Fail
- "Cửa hàng" = Store

## Recent Changes
- 2025-12-25: Tích hợp backend với frontend, kết nối API thực
- 2025-12-25: Thêm AI phân tích ảnh với Gemini
- 2025-12-25: Seed dữ liệu ban đầu cho stores và categories
