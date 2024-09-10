## Hướng dẫn cài đặt

1. Cài đặt các thư viện cần thiết

   ```bash
   npm install
   ```

2. Khởi chạy ứng dụng

   ```bash
    npx expo start
   ```

Bạn có thể bắt đầu phát triển bằng cách chỉnh sửa các tệp trong thư mục **app**. Dự án này sử dụng [định tuyến dựa trên tệp](https://docs.expo.dev/router/introduction).

## Tài liệu tham khảo

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Hướng dẫn push code lên Github và tạo pull request

1. Clone repository về máy
2. Tạo branch mới và làm việc trên branch đó
3. Push code lên Github, viết commit message rõ ràng
4. Tạo pull request từ branch của bạn tới branch `dev` của repository gốc và request review tới `thanhnn16`
5. Chờ phản hồi từ người quản lý repository

## Quy tắc đặt tên branch

- Tên branch phải mô tả rõ công việc bạn đang làm, và phải bắt đầu bằng `feature/`, `fix/`, `update/`, `refactor/`, `style/`, `test/`, `doc/` tùy theo nội dung công việc.
- Tên branch phải được viết bằng tiếng Anh, phải chứa tên của người làm công việc đó.
- Tên branch không được chứa dấu cách, nếu cần phải sử dụng dấu gạch ngang `-` để phân cách.
- Tên branch không được quá dài, tối đa 50 ký tự.
- Tên branch không được viết hoa.
- Tên branch không được chứa ký tự đặc biệt.
- Tên branch không được trùng với tên branch đã tồn tại.
- Ví dụ: `feature/thanhnn16-add-login-screen`, `fix/thanhnn16-fix-login-screen`, `update/thanhnn16-update-login-screen`, `refactor/thanhnn16-refactor-login-screen`, `style/thanhnn16-style-login-screen`, `test/thanhnn16-test-login-screen`, `doc/thanhnn16-doc-login-screen`.
- Nếu branch đã hoàn thành công việc, bạn phải xóa branch đó khỏi repository.
- Nếu branch đã được merge vào branch `dev`, bạn phải xóa branch đó khỏi repository.

## Quy tắc viết commit message

- Commit message phải mô tả rõ công việc bạn đã thực hiện.
- Commit message phải viết bằng tiếng Anh.
- Commit message phải bắt đầu bằng một trong các từ khóa sau: `Add`, `Fix`, `Update`, `Refactor`, `Style`, `Test`, `Doc`.
- Commit message phải chứa tên của người làm công việc đó.
- Commit message không được chứa dấu cách ở đầu dòng.
- Commit message không được quá dài, tối đa 50 ký tự.
- Commit message không được viết hoa.
- Commit message không được chứa ký tự đặc biệt.
- Ví dụ: `Add thanhnn16 login screen`, `Fix thanhnn16 login screen`, `Update thanhnn16 login screen`, `Refactor thanhnn16 login screen`, `Style thanhnn16 login screen`, `Test thanhnn16 login screen`, `Doc thanhnn16 login screen`.

## Hướng dẫn tạo Issue và Pull Request

1. Tạo Issue mới
   - Nhấn vào tab `Issues` trên repository.
   - Nhấn vào nút `New issue`.
   - Điền tiêu đề và nội dung của Issue.
   - Nhấn vào nút `Submit new issue`.
   - Chờ phản hồi từ người quản lý repository.
   - Nếu Issue đã được giải quyết, bạn phải đóng Issue đó.
   - Nếu Issue đã được giải quyết và bạn muốn làm công việc đó, bạn phải tạo Pull Request và request review tới người quản lý repository.

2. Tạo Pull Request mới
   - Nhấn vào tab `Pull requests` trên repository.
   - Nhấn vào nút `New pull request`.
   - Chọn branch bạn muốn tạo Pull Request.
   - Điền tiêu đề và nội dung của Pull Request.
   - Nhấn vào nút `Create pull request`.
   - Chờ phản hồi từ người quản lý repository.

