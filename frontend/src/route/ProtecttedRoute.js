import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn'); // Lưu trạng thái đăng hàng trong localStorage 

  // Kiểm tra nếu chưa đăng nhập thì chuyển hướng đến trang đăng nhập
  if (isLoggedIn == 'false') {
    return <Navigate to="/dang-nhap" replace />;
  }

  // Nếu đã đăng nhập, render children (các component con)
  return children;
}

export default ProtectedRoute;
