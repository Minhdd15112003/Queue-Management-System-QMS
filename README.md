# 🎯 Queue Management System (QMS)

Hệ thống quản lý hàng đợi thông minh cho việc hỗ trợ khách hàng, giúp tối ưu hóa quy trình phục vụ và nâng cao trải nghiệm khách hàng.

## ✨ Tính năng

### 🔥 Tính năng chính
- **📊 Import dữ liệu Excel**: Nhập danh sách khách hàng từ file Excel
- **⏱️ Quản lý hàng đợi thời gian thực**: Theo dõi trạng thái khách hàng (đang chờ/đang phục vụ/hoàn thành)
- **📈 Thống kê chi tiết**: Số lượng đang chờ, thời gian chờ trung bình, số khách đã phục vụ
- **🎮 Bảng điều khiển**: Gọi số tiếp theo, tạm dừng hàng đợi, gọi lại
- **💾 Lưu trữ dữ liệu**: Tự động lưu và khôi phục dữ liệu khi khởi động lại

### 🛠️ Tính năng kỹ thuật
- **🖥️ Desktop App**: Ứng dụng desktop native sử dụng Wails
- **🔄 Real-time Updates**: Cập nhật trạng thái theo thời gian thực
- **📱 Responsive UI**: Giao diện thân thiện, dễ sử dụng
- **🗃️ Data Persistence**: Lưu trữ dữ liệu cục bộ an toàn

## 🏗️ Kiến trúc hệ thống

```
├── Backend (Go)
│   ├── main.go              # Entry point
│   ├── app.go              # Business logic
│   └── types/
│       └── excel_type.go   # Data structures
│
├── Frontend (React + TypeScript)
│   ├── src/
│   │   ├── App.tsx         # Main component
│   │   ├── components/     # UI components
│   │   └── shared/         # Types & constants
│   └── wailsjs/           # Wails bindings
│
└── Assets
    ├── css/               # Styles
    ├── fonts/             # Typography
    └── images/            # Static assets
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- **Go**: >= 1.19
- **Node.js**: >= 16
- **Wails**: >= v2
- **OS**: Windows, macOS, Linux

### 1. Clone repository
```bash
git clone https://github.com/username/queue-management-system.git
cd queue-management-system
```

### 2. Cài đặt dependencies

#### Backend (Go)
```bash
go mod tidy
```

#### Frontend (React)
```bash
cd frontend
npm install
```

### 3. Chạy ứng dụng

#### Development mode
```bash
wails dev
```

#### Build production
```bash
wails build
```

## 📋 Hướng dẫn sử dụng

### 1. Import dữ liệu khách hàng
1. Click vào nút **"Import Excel"**
2. Chọn file Excel chứa danh sách khách hàng
3. Hệ thống sẽ tự động thêm các trường: `id`, `time`, `status`

### 2. Quản lý hàng đợi
- **Gọi số tiếp theo**: Chuyển khách hàng đầu tiên sang trạng thái "đang phục vụ"
- **Hoàn thành**: Đánh dấu khách hàng hiện tại đã hoàn thành
- **Tạm dừng**: Tạm dừng/tiếp tục hàng đợi
- **Gọi lại**: Gọi lại khách hàng hiện tại

### 3. Theo dõi thống kê
- **Tổng số đang chờ**: Số khách hàng trong hàng đợi
- **Thời gian chờ TB**: Thời gian chờ trung bình
- **Đã phục vụ hôm nay**: Tổng số khách đã được phục vụ
- **Quầy đang hoạt động**: Số quầy đang phục vụ

## 📊 Cấu trúc dữ liệu

### Excel Input Format
```
| Name    | Phone      | Service  | Note        |
|---------|------------|----------|-------------|
| John    | 0987654321 | Tư vấn   | Khách VIP   |
| Jane    | 0123456789 | Hỗ trợ   | Khách mới   |
```

### Internal Data Structure
```typescript
{
  id: 1,
  time: "14:30",
  status: "serving" | "waiting" | "completed",
  Name: "John",
  Phone: "0987654321",
  Service: "Tư vấn",
  Note: "Khách VIP"
}
```

## 🔧 API Reference

### Go Backend Methods
```go
// Import Excel file
func (a *App) ImportExcel(fileData string, filename string) types.ImportResult

// Get current data
func (a *App) GetCurrentData() *types.ExcelData

// Get headers
func (a *App) GetHeaders() []string
```

### Frontend Integration
```typescript
import { ImportExcel, GetCurrentData } from '../wailsjs/go/main/App'

// Import Excel
const result = await ImportExcel(base64Data, filename)

// Get current data
const data = await GetCurrentData()
```

## 🎨 UI Components

### 📊 Statistics Component
Hiển thị thống kê tổng quan về hàng đợi

### 🔢 CurrentNumber Component
Hiển thị số thứ tự hiện tại đang được phục vụ

### 🎮 ControlPanel Component
Bảng điều khiển với các nút chức năng chính

### 📋 QueueList Component
Danh sách hàng đợi với thông tin chi tiết khách hàng

## 🗂️ Lưu trữ dữ liệu

### Vị trí file dữ liệu
- **Linux/macOS**: `~/.excel-manager/`
- **Windows**: `%USERPROFILE%\.excel-manager\`

### Cấu trúc thư mục
```
~/.excel-manager/
├── current_data.json    # Dữ liệu hiện tại
└── excel_files/         # File Excel tạm thời
```

## 🧪 Testing

```bash
# Run tests
go test ./...

# Frontend tests
cd frontend && npm test
```

## 📦 Build & Deploy

### Build executable
```bash
# Build for current platform
wails build

# Build for specific platform
wails build -platform windows/amd64
wails build -platform darwin/amd64
wails build -platform linux/amd64
```

### Generated files
```
build/
├── bin/                 # Executables
├── darwin/             # macOS builds
├── linux/              # Linux builds
└── windows/            # Windows builds
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request
---

⭐ **Don't forget to give the project a star if you liked it!**
