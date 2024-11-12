import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const newErrors1 = {};
    if (!fullname) newErrors1.fullname = "Vui lòng nhập họ tên.";
    if (!birthday) newErrors1.birthday = "Vui lòng nhập ngày sinh.";
    if (!email) newErrors1.email = "Vui lòng nhập email.";
    if (!phone) newErrors1.phone = "Vui lòng nhập số điện thoại.";
    if (!password) newErrors1.password = "Vui lòng nhập mật khẩu.";
    if (password !== confirmPassword) newErrors1.confirmPassword = "Xác nhận mật khẩu chưa trùng khớp.";
    setErrors(newErrors1);

    if (Object.keys(newErrors1).length === 0) {
      try {
        const response = await axios.post("http://15.235.155.26:5000/api/signup", {
          email,
          password,
          fullname,
          birthday,
          phone,
        });
        alert(response.data.message);
        navigate("/dang-nhap");
      } catch (error) {
        alert(error.response?.data?.message || "Registration failed.");
      }
    }
  };

  return (
    <div className="billing_details_area">
      <div className="container">
        <div className="col-lg-8" style={{ margin: '5px auto' , top: '50px', background: '#EEEEEE', padding: '5px 15px'}}>
          <div style={{ textAlign: 'center' , paddingTop:'10px'}}>
            <h2>ĐĂNG KÝ</h2>
          </div>
          <div className="billing_form_area" style={{ marginTop: '20px' }}>
            <form className="billing_form row" action="" method="post" id="contactForm" noValidate>
              <div className="form-group col-md-6">
                <label htmlFor="name">Họ và tên *</label>
                <input 
                value={fullname} 
                onChange={(e) => setFullname(e.target.value)} 
                type="text" 
                className="form-control"  
                placeholder="Họ và tên" />
                {errors.fullname && <p style={{ color: "red", fontSize: "12px" }}>{errors.fullname}</p>}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="ngaysinh">Ngày sinh *</label>
                <input 
                value={birthday} 
                onChange={(e) => setBirthday(e.target.value)} 
                type="date" 
                className="form-control"  
                placeholder="Ngày sinh" />
                {errors.birthday && <p style={{ color: "red", fontSize: "12px" }}>{errors.birthday}</p>}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="email">Email *</label>
                <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                className="form-control"  
                placeholder="Email" />
                {errors.email && <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="sdt">Số điện thoại *</label>
                <input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                type="text" 
                className="form-control"  
                placeholder="Số điện thoại" />
                {errors.phone && <p style={{ color: "red", fontSize: "12px" }}>{errors.phone}</p>}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="pass">Mật khẩu *</label>
                <input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                className="form-control"  
                placeholder="" />
                {errors.password && <p style={{ color: "red", fontSize: "12px" }}>{errors.password}</p>}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="verify">Xác nhận mật khẩu *</label>
                <input 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                type="password" 
                className="form-control"  
                placeholder="" />
                {errors.confirmPassword && <p style={{ color: "red", fontSize: "12px" }}>{errors.confirmPassword}</p>}
              </div>
              <div className="form-group col-md-12">
                <button 
                  type="submit" 
                  onClick={handleSignUpSubmit}
                  className="btn order_s_btn form-control" 
                  style={{ width: '100%', background: '#f195b2' }}
                  >
                  Đăng ký
                </button>
              </div>
            </form>
          </div>
          <div className="return_option" style={{ textAlign: 'center', marginBottom:"5px"}}>
            <h4>Bạn đã có tài khoản? <Link to="/dang-nhap"> Đăng nhập</Link></h4>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Register;
