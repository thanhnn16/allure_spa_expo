Tessst lần 1

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

## Tài liệu tham khảo

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with
  our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll
  create a project that runs on Android, iOS, and the web.

## Hướng dẫn push code lên Github và tạo pull request

1. Clone repository về máy
2. Tạo branch mới và làm việc trên branch đó
3. Push code lên Github, viết commit message rõ ràng
4. Tạo pull request từ branch của bạn tới branch `dev` của repository gốc và request review tới `thanhnn16`
5. Chờ phản hồi từ người quản lý repository

## Quy tắc đặt tên branch

Tên branch phải tuân theo các quy tắc sau để đảm bảo tính rõ ràng và dễ quản lý:

1. Tên branch phải bắt đầu bằng tên developer, tiếp theo là loại công việc và mô tả tính năng.
2. Các loại công việc bao gồm: `feature`, `fix`, `update`, `refactor`, `style`, `test`, `doc`.
3. Tên branch không được chứa dấu cách. Sử dụng dấu gạch ngang (`-`) để phân cách các từ.
4. Tên branch không được dài quá 50 ký tự.
5. Tất cả phải được viết thường và không chứa ký tự đặc biệt.
6. Tên branch không được trùng với bất kỳ branch nào đã tồn tại.

### Cú pháp:

[tên-developer]/[loại-công-việc]/[mô-tả-ngắn]

### Ví dụ:

- `thanhnn16/feature/login-screen`
- `loc/fix/login-screen`
- `hieu/update/login-screen`
- `nhan/refactor/login-screen`
- `duong/style/login-screen`
- `hieu/test/login-screen`
- `loc/doc/login-screen`

### Lưu ý:

- Sau khi hoàn thành công việc, branch phải được xóa khỏi repository.
- Nếu branch đã được merge vào branch `dev`, bạn cũng phải xóa branch đó khỏi repository.

## Quy tắc viết commit message

- Commit message phải mô tả rõ công việc bạn đã thực hiện.
- Commit message phải viết bằng tiếng Anh.
- Commit message phải bắt đầu bằng một trong các từ khóa sau: `Add`, `Fix`, `Update`, `Refactor`, `Style`, `Test`,
  `Doc`.
- Commit message không được chứa dấu cách ở đầu dòng.
- Commit message không được quá dài.
- Commit message phải sử dụng câu viết thường, ngoại trừ các từ khóa ở đầu câu.
- Commit message không được chứa ký tự đặc biệt.

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

## Hướng dẫn tạo Issue và Pull Request

1. Tạo Issue mới
   - Nhấn vào tab `Issues` trên repository.
   - Nhấn vào nút `New issue`.
   - Điền tiêu đề và nội dung của Issue.
   - Nhấn vào nút `Submit new issue`.
   - Chờ phản hồi từ người quản lý repository.
   - Nếu Issue đã được giải quyết, bạn phải đóng Issue đó.
   - Nếu Issue đã được giải quyết và bạn muốn làm công việc đó, bạn phải tạo Pull Request và request review tới người
     quản lý repository.

2. Tạo Pull Request mới
   - Nhấn vào tab `Pull requests` trên repository.
   - Nhấn vào nút `New pull request`.
   - Chọn branch bạn muốn tạo Pull Request.
   - Điền tiêu đề và nội dung của Pull Request.
   - Nhấn vào nút `Create pull request`.
   - Chờ phản hồi từ người quản lý repository.

## Một số luư ý khi dùng Git
1. Sự khác biệt giữa `git pull` và `git fetch`
- `git pull` sẽ tự động merge các thay đổi từ remote repository vào local repository của bạn.
- `git fetch` sẽ tải về các thay đổi từ remote repository nhưng không merge chúng vào local repository của bạn. Điều này cho phép bạn xem trước các thay đổi trước khi merge chúng.
- `git pull` tương đương với `git fetch` và `git merge`.
- `git pull` không an toàn vì nó tự động merge các thay đổi. Nếu có xung đột, bạn sẽ phải giải quyết chúng sau khi merge.
- `git fetch` an toàn hơn vì bạn có thể xem trước các thay đổi trước khi merge chúng.
- Nếu bạn muốn sử dụng `git pull`, hãy chắc chắn rằng bạn đã commit tất cả các thay đổi trước khi pull.
- Nếu bạn muốn sử dụng `git fetch`, hãy chắc chắn rằng bạn đã commit tất cả các thay đổi trước khi fetch.
- Nếu bạn không chắc chắn, hãy sử dụng `git fetch` để xem trước các thay đổi trước khi merge chúng.

2. Sự khác biệt giữa `git merge` và `git rebase`
- `git merge` sẽ tạo một commit mới trên branch hiện tại của bạn để kết hợp các thay đổi từ branch khác.
- `git rebase` sẽ di chuyển tất cả các commit trên branch hiện tại của bạn sang branch khác, sau đó kết hợp các thay đổi từ branch khác và tạo một commit mới.
- `git merge` tạo ra một lịch sử commit rõ ràng hơn vì nó giữ nguyên lịch sử commit của cả hai branch.
- `git rebase` tạo ra một lịch sử commit sạch sẽ hơn vì nó di chuyển tất cả các commit sang branch khác trước khi kết hợp chúng.
- `git merge` không thay đổi lịch sử commit của branch hiện tại của bạn.
- `git rebase` thay đổi lịch sử commit của branch hiện tại của bạn.
- `git merge` an toàn hơn vì nó không thay đổi lịch sử commit của branch hiện tại của bạn.
- `git rebase` không an toàn vì nó thay đổi lịch sử commit của branch hiện tại của bạn.
- Nếu bạn muốn giữ nguyên lịch sử commit, hãy sử dụng `git merge`.
- Nếu bạn muốn lịch sử commit sạch sẽ hơn, hãy sử dụng `git rebase`.
- Nếu bạn không chắc chắn, hãy sử dụng `git merge`.
- Nếu bạn muốn lịch sử commit sạch sẽ hơn, hãy sử dụng `git rebase`.

3. Sự khác biệt giữa `git reset` và `git revert`
- `git reset` sẽ xóa các thay đổi trên branch hiện tại của bạn.
- `git revert` sẽ tạo một commit mới trên branch hiện tại của bạn để hoàn tác các thay đổi.
- `git reset` xóa các thay đổi mà không tạo commit mới.
- `git revert` tạo một commit mới để hoàn tác các thay đổi.
- `git reset` không tạo commit mới.
- `git revert` tạo commit mới.
- `git reset` không an toàn vì nó xóa các thay đổi mà không tạo commit mới.
- `git revert` an toàn vì nó tạo commit mới để hoàn tác các thay đổi.
- Nếu bạn muốn xóa các thay đổi mà không tạo commit mới, hãy sử dụng `git reset`.
- Nếu bạn muốn tạo commit mới để hoàn tác các thay đổi, hãy sử dụng `git revert`.
- Nếu bạn không chắc chắn, hãy sử dụng `git revert`.

4. Sự khác biệt giữa `git checkout` và `git switch`
- `git checkout` sẽ chuyển đổi giữa các branch hoặc commit.
- `git switch` sẽ chuyển đổi giữa các branch.
- `git checkout` chuyển đổi giữa các branch hoặc commit.
- `git switch` chuyển đổi giữa các branch.
- `git checkout` không an toàn vì nó không kiểm tra xem branch hoặc commit đó có tồn tại hay không.
- `git switch` an toàn vì nó kiểm tra xem branch đó có tồn tại hay không.
- Nếu bạn muốn chuyển đổi giữa các branch hoặc commit, hãy sử dụng `git checkout`.
- Nếu bạn muốn chuyển đổi giữa các branch, hãy sử dụng `git switch`.
- Nếu bạn không chắc chắn, hãy sử dụng `git switch`.
- Nếu bạn muốn chuyển đổi giữa các branch hoặc commit, hãy sử dụng `git checkout`.
- Nếu bạn muốn chuyển đổi giữa các branch, hãy sử dụng `git switch`.

Xem thêm tại: [Git Handbook](https://guides.github.com/introduction/git-handbook/)