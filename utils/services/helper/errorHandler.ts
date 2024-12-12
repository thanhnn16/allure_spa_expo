export const handleAuthError = (error: any) => {
  const errorMessage = error?.response?.data?.message || error.message;
  
  switch (errorMessage) {
    case 'FAILED_TO_SEND_RESET_EMAIL':
      return 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.';
    case 'EMAIL_NOT_FOUND':
      return 'Email không tồn tại trong hệ thống.';
    case 'EMAIL_NOT_VERIFIED':
      return 'Email chưa được xác thực. Vui lòng xác thực email trước.';
    case 'EMAIL_ALREADY_VERIFIED':
      return 'Email đã được xác thực trước đó.';
    case 'EMAIL_ALREADY_EXISTS':
      return 'Email này đã được đăng ký. Vui lòng sử dụng email khác.';
    case 'INVALID_EMAIL':
      return 'Email không hợp lệ. Vui lòng kiểm tra lại.';
    case 'TOO_MANY_REQUESTS':
      return 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.';
    case 'INTERNAL_SERVER_ERROR':
      return 'Lỗi hệ thống. Vui lòng thử lại sau.';
    default:
      return 'Có lỗi xảy ra. Vui lòng thử lại sau.';
  }
}; 