
import './App.css';
import Shop from './pages/Shop.js';
import { RouterProvider, Navigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { router } from "./route/Index.js";
import { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("role"); // Lấy vai trò đã lưu từ localStorage
    const loggedInStatus = localStorage.getItem("isLoggedIn"); // Lấy trạng thái đăng nhập từ localStorage

    if (loggedInStatus === "true" && savedRole) {
      setIsLoggedIn(true);
      setRole(savedRole);
    }
  }, []);
  return (
    <div>
      {isLoggedIn ? (
        role === 'admin' ? (
          <RouterProvider router={router} initialEntries={['/admin']} />
        ) : (
          <RouterProvider router={router} initialEntries={['/']} />
        )
      ) : (
        <RouterProvider router={router} initialEntries={['/dang-nhap']} />
      )}
    </div>
  );
}

export default App;
