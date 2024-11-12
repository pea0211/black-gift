import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import bannerBg from '../img/banner-bg.jpg'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Account = () => {
	const navigate = useNavigate();
	const [userData, setUserData] = useState({
		email:"",
		fullname: "",
		birthday: "",
		phone: "",
	  });
	const [passwords, setPasswords] = useState({
		oldPassword: "",
		newPassword: "",
		confirmPassword: ""
	});
	useEffect(() => {
		const userEmail = localStorage.getItem("userEmail"); // Lấy email từ localStorage
	
		if (!userEmail) {
		  // Nếu không có email trong localStorage, điều hướng về trang đăng nhập
		  window.location.href = "/";
		  return;
		}
	
		// Gửi yêu cầu lấy thông tin người dùng
		const fetchUserData = async () => {
		  try {
			const response = await axios.get(`http://localhost:5000/api/user-profile/${userEmail}`);
        	console.log(response.data);
        	setUserData(response.data);
		  } catch (error) {
			console.error("Error fetching user data:", error);
		  }
		};
	
		fetchUserData();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUserData({
		  ...userData,
		  [name]: value
		});
	};

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswords({ ...passwords, [name]: value });
	};

	const handleSavePassword = async (e) => {
		e.preventDefault();
		const { oldPassword, newPassword, confirmPassword } = passwords;
	
		// Kiểm tra các điều kiện
		if (newPassword !== confirmPassword) {
		  alert("New password and confirm password do not match.");
		  return;
		}
	
		try {
		  const userEmail = localStorage.getItem("userEmail");
	
		  // Gửi yêu cầu đến backend để cập nhật mật khẩu
		  const response = await axios.post("http://localhost:5000/api/change-password", {
			email: userEmail,
			oldPassword,
			newPassword
		  });
		  alert(response.data.message); // Hiển thị thông báo thành công
		  setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
		  //navigate("/account");
		} catch (error) {
		  console.error("Error changing password:", error);
		  alert("Failed to change password. Please try again.");
		}
	};
	const handleSaveProfile = async (e) => {
		e.preventDefault();
		try {
		  //userData.email = userEmail;
		  const response = await axios.post("http://localhost:5000/api/update-profile", userData);
		  alert(response.data.message);
		  //navigate("/account");
		} catch (error) {
		  console.error("Error updating profile:", error);
		  alert("Failed to update profile. Please try again.");
		}
	};

  return (
    <div>
        <section style={{ backgroundImage: `url(${bannerBg})` , backgroundSize: 'cover', }}>
        	<div className="container">
        		<div className="banner_text">
        			<h3>Tài khoản</h3>
        			<ul>
					<li><Link to="/">Trang chủ</Link></li>
					<li><Link to="/account">Tài khoản</Link></li>
        			</ul>
                 
        		</div>
        	</div>
        </section>  
        <section className="billing_details_area p_100">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5">
                		<div className="order_box_price">
                			<div className="" style={{textAlign:'center', fontWeight: 'bold'}}>
                				<h2>Thông tin tài khoản</h2>
                			</div>
							<div className="payment_list">
								<div className="price_single_cost">
									<h5>Họ và tên <span>{userData.fullname}</span></h5>
									<h5>Ngày sinh <span>{userData.birthday.split('-').reverse().join('-')}</span></h5>
									<h5>Email <span>{userData.email}</span></h5>
                                    <h5>SỐ ĐIỆN THOẠI <span>{userData.phone}</span></h5>
                
								</div>
							</div>
						</div>
                	</div>
                	<div className="col-lg-5" style={{left:'150px'}}>
               	    	<div className="" style={{textAlign:'center',fontWeight: 'bold'}}>
               	    		<h2>Sửa thông tin</h2>
               	    	</div>
                           <div className="billing_form_area" >
                			<form className="billing_form row" action="" method="post" id="contactForm" novalidate="novalidate">
								<div className="form-group col-md-12">
								    <label for="name">Họ và tên *</label>
									<input
										type="text"
										name="fullname"
										value={userData.fullname}
										onChange={handleInputChange}
										className="form-control"  
          							/>
								</div>
								<div className="form-group col-md-12">
								    <label for="username">Ngày sinh *</label>
									<input 
										value={userData.birthday} 
										//onChange={(e) => setBirthday(e.target.value)} 
										onChange={handleInputChange}
										type="date" 
										name="birthday"
										className="form-control"  
										placeholder="Ngày sinh" 
									/>
								</div>
                                <div className="form-group col-md-12">
								    <label for="email">Email *</label>
									<input 
                						value={userData.email} 
										//onChange={(e) => setEmail(e.target.value)} 
										onChange={handleInputChange}
										type="email" 
										name="email"
										className="form-control"  
										placeholder="Email" 
									/>
								</div>
								<div className="form-group col-md-12">
                                    <label for="sdt">Số điện thoại *</label>
									<input
										type="text"
										name="phone"
										value={userData.phone}
										onChange={handleInputChange}
										className="form-control"  
          							/>
								</div>	
                                <div className="form-group col-md-12">
                                    <button type="submit" onClick={handleSaveProfile} value="submit" className="btn order_s_btn form-control" style={{width:'100%',background: '#f195b2',left:'-10px'}}>Lưu thông tin</button>
                                </div>				
							</form>
							
                		</div>
						<div className="" style={{textAlign:'center',fontWeight: 'bold', marginTop:'40px'}}>
               	    		<h2>Đổi mật khẩu</h2>
               	    	</div>
                        <div className="billing_form_area" >
							<form className="billing_form row" action="" method="post" id="contactForm" novalidate="novalidate">
                                <div className="form-group col-md-12">
								    <label for="pass">Mật khẩu cũ *</label>
									<input
										type="password"
										className="form-control"  
										name="oldPassword"
										value={passwords.oldPassword}
										onChange={handlePasswordChange}
										placeholder=""
									/>
								</div>	
								<div className="form-group col-md-12">
								    <label for="pass">Mật khẩu  mới *</label>
									<input
										type="password"
										className="form-control"  
										name="newPassword"
										value={passwords.newPassword}
										onChange={handlePasswordChange}
										placeholder=""
									/>
								</div>
								<div className="form-group col-md-12">
								    <label for="pass">Xác nhận mật khẩu mới *</label>
									<input
										type="password"
										className="form-control"  
										name="confirmPassword"
										value={passwords.confirmPassword}
										onChange={handlePasswordChange}
										placeholder=""
									/>
								</div>		
                                <div className="form-group col-md-12">
                                    <button type="submit" onClick={handleSavePassword} value="submit" className="btn order_s_btn form-control" style={{width:'100%',background: '#f195b2',left:'-10px'}}>Lưu mật khẩu</button>
                                </div>				
							</form>
						</div>

                	</div>
                	
                </div>
            </div>
        </section>
    </div>
  )
};

export default Account;
