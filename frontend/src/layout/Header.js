import React, { useState } from 'react';
import logo from '../img/logo.png'; // Đảm bảo logo đúng đường dẫn
import { Link, useNavigate } from 'react-router-dom';
const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false"); // Lưu trạng thái đăng nhập vào localStorage
    localStorage.setItem("role", ""); // Lưu vai trò vào localStorage
    localStorage.removeItem("userEmail");
    navigate("/dang-nhap"); // Chuyển hướng đến trang đăng nhập sau khi đăng xuất
  };
  // State để điều khiển navbar toggle
  const [isNavOpen, setIsNavOpen] = useState(false);

  // State để điều khiển việc mở rộng/thu gọn submenu "Ví tiền" và "Đơn hàng"
  const [isMoneyMenuOpen, setIsMoneyMenuOpen] = useState(false);
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  
  // Hàm toggle navbar
  const toggleNavbar = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Hàm toggle submenu Ví tiền
  const toggleMoneyMenu = () => {
    setIsMoneyMenuOpen(!isMoneyMenuOpen);
  };

  // Hàm toggle submenu Đơn hàng
  const toggleOrderMenu = () => {
    setIsOrderMenuOpen(!isOrderMenuOpen);
  };

  return (
    <header className="main_header_area">
      <div className="top_header_area row m0">
        <div className="container">
          <div className="float-left">
            <a href="tel:+18004567890">
              <i className="fa fa-phone" aria-hidden="true"></i> + (1800) 456 7890
            </a>
            <a href="mailto:info@giftstore.com">
              <i className="fa fa-envelope-o" aria-hidden="true"></i> info@giftstore.com
            </a>
          </div>
          <div className="float-right" style={{ marginTop: '10px' }}>
            <ul className="h_social list_style">
              <li><a href="#"><i className="fab fa-facebook"></i></a></li>
              <li><a href="#"><i className="fab fa-twitter"></i></a></li>
              <li><a href="#"><i className="fab fa-google-plus"></i></a></li>
              <li><a href="#"><i className="fab fa-linkedin"></i></a></li>
            </ul>
            <ul className="h_search list_style">
              <li className="shop_cart">
                <Link to="/cart"><i className="lnr lnr-cart"></i></Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="main_menu_area">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="Logo" style={{ width: '160px' }} />
            </Link>
            {/* Button navbar-toggler */}
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleNavbar} // Xử lý sự kiện toggle navbar
              aria-controls="navbarSupportedContent"
              aria-expanded={isNavOpen ? 'true' : 'false'}
              aria-label="Toggle navigation"
            >
              <span className="my_toggle_menu">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>

            {/* Div chứa các liên kết menu */}
            <div
              className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} // Thêm class 'show' khi mở
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mr-auto">
                <li><Link to="/">Shop</Link></li>
                <li className={`dropdown submenu ${isMoneyMenuOpen ? 'show' : ''}`}>
                  <a
                    className="dropdown-toggle"
                    href="#"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded={isMoneyMenuOpen ? 'true' : 'false'}
                    onClick={toggleMoneyMenu} // Toggle "Ví tiền"
                  >
                    Ví tiền
                  </a>
                  <ul className={`dropdown-menu ${isMoneyMenuOpen ? 'show' : ''}`}>
                    <li><Link to="/money-man">Lịch sử nạp tiền</Link></li>
                    <li><Link to="/ls-rut-tien">Lịch sử rút tiền</Link></li>
                    <li><Link to="/money-pay">Nạp tiền</Link></li>
                    <li><Link to="/money-get">Rút tiền</Link></li>
                  </ul>
                </li>
              </ul>

              {/* Menu "Đơn hàng" với submenu */}
              <ul className="navbar-nav justify-content-end">
                <li className={`dropdown submenu ${isOrderMenuOpen ? 'show' : ''}`}>
                  <a
                    className="dropdown-toggle"
                    href="#"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded={isOrderMenuOpen ? 'true' : 'false'}
                    onClick={toggleOrderMenu} // Toggle "Đơn hàng"
                  >
                    Đơn hàng
                  </a>
                  <ul className={`dropdown-menu ${isOrderMenuOpen ? 'show' : ''}`}>
                    <li><Link to="/da-mua">Đã mua</Link></li>
                    <li><Link to="/da-mo">Đã mở</Link></li>
                  </ul>
                </li>
                <li><Link to="/account">Tài khoản</Link></li>
                <li onClick={handleLogout}><Link>Đăng xuất</Link></li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;


// src/components/Header.js
/*import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/logo.png';
import logo2 from '../img/logo-2.png';
import { Route, Routes, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate(); // Điều hướng dựa trên vai trò
  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false"); // Lưu trạng thái đăng nhập vào localStorage
    localStorage.setItem("role", ""); // Lưu vai trò vào localStorage
    localStorage.removeItem("userEmail");
    navigate("/dang-nhap"); // Chuyển hướng đến trang đăng nhập sau khi đăng xuất
  };
  return (
    <header className="main_header_area">
      <div className="top_header_area row m0">
        <div className="container">
          <div className="float-left">
            <a href="tel:+18004567890"><i className="fa fa-phone" aria-hidden="true"></i> + (1800) 456 7890</a>
            <a href="mailto:info@giftstore.com"><i className="fa fa-envelope-o" aria-hidden="true"></i> info@giftstore.com</a>
          </div>
          <div className="float-right" style={{ marginTop: '10px' }}>
            <ul className="h_social list_style">
              <li><a href="#"><i className="fab fa-facebook"></i></a></li>
              <li><a href="#"><i className="fab fa-twitter"></i></a></li>
              <li><a href="#"><i className="fab fa-google-plus"></i></a></li>
              <li><a href="#"><i className="fab fa-linkedin"></i></a></li>
            </ul>
            <ul className="h_search list_style">
              <li className="shop_cart" ><Link to="/cart" content='4'><i className="lnr lnr-cart"></i></Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="main_menu_area">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="Logo" style={{width:'160px'}}/>
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
              <span className="my_toggle_menu">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
							<ul class="navbar-nav mr-auto">
								
								<li><Link to="/">Shop</Link></li>
								<li class="dropdown submenu">
									<a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Ví tiền</a>
									<ul class="dropdown-menu">
										<li><Link to="/money-man">Lịch sử nạp tiền</Link></li>
                    <li><Link to="/ls-rut-tien">Lịch sử rút tiền</Link></li>
										<li><Link to="/money-pay">Nạp tiền</Link></li>
                    <li><Link to="/money-get">Rút tiền</Link></li>
									</ul>
								</li>						
							</ul>
							<ul class="navbar-nav justify-content-end">
								<li class="dropdown submenu">
									<a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Đơn hàng</a>
									<ul class="dropdown-menu">
										<li><Link to="/da-mua">Đã mua</Link></li>
										<li><Link to="/da-mo">Đã mở</Link></li>
									</ul>
								</li>
								<li><Link to="/account">Tài khoản</Link></li>
                <li onClick={handleLogout}> <Link>Đăng xuất</Link></li>
							</ul>
						</div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
*/