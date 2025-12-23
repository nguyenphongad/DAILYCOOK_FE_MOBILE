# npx expo start --tunnel

# npx ngrok http 5000

# DailyCook - Ứng dụng Quản lý Thực đơn & Dinh dưỡng

## 📱 Giới thiệu

DailyCook là ứng dụng mobile giúp người dùng quản lý thực đơn hàng ngày, theo dõi dinh dưỡng và lên kế hoạch mua sắm thông minh. Ứng dụng sử dụng AI để gợi ý thực đơn phù hợp với mục tiêu dinh dưỡng và sở thích cá nhân.

## ✨ Tính năng chính

### 🎯 Onboarding & Khảo sát
- **Khảo sát ban đầu**: Thu thập thông tin cá nhân/gia đình
  - Chọn loại tài khoản (Cá nhân/Gia đình)
  - Nhập thông tin: giới tính, tuổi, chiều cao, cân nặng
  - Chọn chế độ ăn phù hợp (Cân bằng, Keto, Low-carb,...)
- **Tính toán dinh dưỡng**: Tự động tính toán BMR và mục tiêu dinh dưỡng dựa trên:
  - Thông tin cá nhân
  - Chế độ ăn được chọn
  - Phương pháp: Mifflin-St Jeor

### 🤖 AI Assistant
- **Gợi ý thực đơn thông minh**: 
  - Chat interface với AI
  - Gợi ý món ăn cho 3 bữa (Sáng, Trưa, Tối)
  - Tự động tính toán dinh dưỡng tổng hợp
- **Tùy chỉnh linh hoạt**:
  - Đổi món ăn theo sở thích
  - Xem chi tiết từng món
  - Loại bỏ món không thích

### 🍽️ Quản lý Thực đơn
- **Thực đơn hàng ngày**:
  - Hiển thị món ăn theo bữa
  - Thông tin dinh dưỡng chi tiết (Calories, Protein, Carbs, Fat)
  - Phân loại món (Món chính, Món phụ, Tráng miệng)
- **Ghi nhận thực đơn**: Lưu lại thực đơn để theo dõi

### 🛒 Danh sách Mua sắm
- **Tự động tạo danh sách**: Từ thực đơn đã chọn
- **Quản lý nguyên liệu**:
  - Đánh dấu đã mua
  - Thêm nguyên liệu tùy chỉnh
  - Phân loại (Từ thực đơn/Tự thêm)
- **Làm mới hàng ngày**: Reset danh sách mỗi ngày mới

### 👤 Tài khoản & Cài đặt
- **Thông tin cá nhân**: Quản lý profile, ảnh đại diện
- **Mục tiêu dinh dưỡng**: 
  - Xem tổng quan dinh dưỡng hàng ngày
  - Progress bars trực quan
- **Cài đặt chế độ ăn**: Thay đổi chế độ ăn, thực phẩm không thích
- **Nhắc nhở uống nước**: Cài đặt lịch nhắc

## 🏗️ Kiến trúc Dự án

### Tech Stack
- **Framework**: React Native (Expo Router)
- **State Management**: Redux Toolkit
- **UI Components**: Tamagui
- **Authentication**: Supabase Auth (Google OAuth)
- **Navigation**: Expo Router (File-based routing)
- **Storage**: AsyncStorage

## 🔧 Cài đặt & Chạy Dự án

### Yêu cầu
- Node.js >= 16
- npm hoặc yarn
- Expo CLI
- iOS Simulator hoặc Android Emulator (hoặc thiết bị thật)

### Cài đặt Dependencies

```bash
# Clone repository
git clone <repository-url>
cd DAILYCOOK_FE_MOBILE

# Cài đặt packages
npm install
# hoặc
yarn install

### cấu hình env