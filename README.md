## Hướng dẫn cài đặt

1. Cài đặt các thư viện cần thiết

   ```bash
   npm install
   ```

2. Khởi chạy ứng dụng

   ```bash
    npx expo start
   ```

Bạn có thể bắt đầu phát triển bằng cách chỉnh sửa các tệp trong thư mục **app**. Dự án này sử
dụng [định tuyến dựa trên tệp](https://docs.expo.dev/router/introduction).

## Cấu trúc dự án

```
app/
  (auth)/
    _layout.tsx (layout cho phần xác thực)
    index.tsx (màn hình đăng nhập)
    register.tsx (màn hình đăng ký)
    otp.tsx (màn hình xác thực OTP)
    zalo-oauth.tsx (xử lý đăng nhập bằng Zalo)
    change-password.tsx (màn hình đổi mật khẩu)
  (app)/
    _layout.tsx (layout chính của ứng dụng, bảo vệ các route con)
    home/
      index.tsx (màn hình chính)
    profile/
      index.tsx (trang hồ sơ người dùng)
      detail.tsx (chi tiết hồ sơ)
      about-app.tsx (thông tin về ứng dụng)
    chat/
      index.tsx (danh sách chat)
      ai_screen.tsx (chat với AI)
      ai_voice_screen.tsx (chat voice với AI)
      message_ai.tsx (tin nhắn AI)
      message_screen.tsx (màn hình tin nhắn)
    scheduled/
      index.tsx (lịch hẹn)
    store/
      index.tsx (cửa hàng)
    search/
      index.tsx (tìm kiếm)
    transaction/
      index.tsx (danh sách giao dịch)
      detail.tsx (chi tiết giao dịch)
      success.tsx (giao dịch thành công)
    cart/
      index.tsx (giỏ hàng)
      empty.tsx (giỏ hàng trống)
    favorite/
      index.tsx (danh sách yêu thích)
    product/
      [id]/
        index.tsx (chi tiết sản phẩm)
    reward/
      index.tsx (phần thưởng)
  _layout.tsx (layout gốc của ứng dụng)
  index.tsx (điểm vào của ứng dụng)

components/
  authentication/
    LoginForm.tsx
    RegisterForm.tsx
    LoginZaloForm.tsx
  buttons/
    AppButton.tsx
  inputs/
    AppSearch.tsx
  app-bar/
    AppBar.tsx
    SearchAppBar.tsx
  dialog/
    AppDialog.tsx

redux/
  auth/
    authSlice.ts
  language/
    LanguageSlice.ts
  zalo/
    ZaloSlice.ts
  service/
    ServiceSlice.ts
  users/
    UserSlice.ts
  store.ts

utils/
  services/
    zalo/
      zaloAuthService.ts

constants/
  Colors.ts
  Typography.ts

languages/
  i18n.ts
  LanguageManager.tsx
```

## Hướng dẫn push code lên Github và tạo pull request

1. Clone repository về máy
2. Tạo branch mới và làm việc trên branch đó
3. Push code lên Github, viết commit message rõ ràng (chỉ push những thay đổi liên quan tới công việc bạn đang làm, không push những thay đổi không liên quan tới công việc bạn đang làm).
4. Tạo pull request từ branch của bạn tới branch `dev` của repository gốc và request review tới `thanhnn16`.
5. Nhắn Zalo cho `thanhnn16` để hỗ trợ review code.

## Quy tắc viết commit message

- Commit message phải mô tả rõ công việc bạn đã thực hiện.
- Commit message phải bắt đầu bằng một trong các từ khóa sau: `Add`, `Fix`, `Update`, `Refactor`, `Style`, `Test`, `Doc`.
   
### Cú pháp:

[Loại-công-việc]: Mô tả công việc

### Ví dụ:

- `Add: Login screen`
- `Fix: Login screen`
- `Update: Login screen`
- `Refactor: Login screen`
- `Style: Login screen`
- `Test: Login screen`
- `Doc: Login screen`

### Lưu ý:

- Commit message phải được viết rõ ràng và dễ hiểu.

## Hướng dẫn tạo Pull Request

1. Tạo Pull Request mới
   - Nhấn vào tab `Pull requests` trên repository.
   - Nhấn vào nút `New pull request`.
   - Chọn branch bạn muốn tạo Pull Request.
   - Điền tiêu đề và nội dung của Pull Request.
   - Chọn target branch là `dev`.
   - Nhấn vào nút `Create pull request`.
   - Chờ phản hồi từ người quản lý repository.

## Một số lưu ý khi dùng Git

Xem thêm tại: [Git Handbook](https://guides.github.com/introduction/git-handbook/)
