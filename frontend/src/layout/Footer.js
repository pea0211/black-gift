// src/components/Footer.js
import React from 'react';
import footerLogo from '../img/logo.png';

const Footer = () => {
  return (
    <footer className="footer_area">
      <div className="footer_widgets">
        <div className="container">
          <div className="row footer_wd_inner">
            <div className="col-lg-3 col-6">
              <aside className="f_widget f_about_widget">
                <img src={footerLogo} alt="" style={{ width: '180px' }} />
                <p>Sự hài lòng của khách hàng là tối thượng...</p>
                <ul className="nav">
                  <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                  <li><a href="#"><i className="fab fa-linkedin"></i></a></li>
                  <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                  <li><a href="#"><i className="fab fa-google-plus"></i></a></li>
                </ul>
              </aside>
            </div>
            <div class="col-lg-3 col-6">
        					<aside class="f_widget f_link_widget">
        						<div class="f_title">
        							<h3>Quick links</h3>
        						</div>
        						<ul className="list_style">
        							<li><a href="account.html">Tài khoản</a></li>
        							<li><a href="history.html">Đơn hàng</a></li>
        							<li><a href="#">Privacy Policy</a></li>
        						</ul>
        					</aside>
        				</div>
        				<div className="col-lg-3 col-6">
        					<aside className="f_widget f_link_widget">
        						<div className="f_title">
        							<h3>Work Times</h3>
        						</div>
        						<ul className="list_style">
        							<li><a href="#">Mon. :  Fri.: 8 am - 8 pm</a></li>
        							<li><a href="#">Sat. : 9am - 4pm</a></li>
        							<li><a href="#">Sun. : Closed</a></li>
        						</ul>
        					</aside>
        				</div>
        				<div className="col-lg-3 col-6">
        					<aside className="f_widget f_contact_widget">
        						<div className="f_title">
        							<h3>Contact Info</h3>
        						</div>
        						<h4>(1800) 574 9687</h4>
        						<p>Paradise Store <br />256, Hoàng Quốc Việt, Hà Nội</p>
        						<h5>giftstore@contact.co.in</h5>
        					</aside>
        				</div>
            {/* Các cột khác */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
