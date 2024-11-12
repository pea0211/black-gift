import React, { useEffect } from "react";
import './Login.css';
import { Link } from 'react-router-dom';
import axios from "axios";
//import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
  
    //const navigate = useNavigate();
  
    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      const newErrors1 = {};
      if (!email) newErrors1.email = "Vui lòng nhập email.";
      if (!password) newErrors1.password = "Vui lòng nhập mật khẩu.";
      setErrors(newErrors1);
  
      if (Object.keys(newErrors1).length === 0) {
        try {
          const response = await axios.post("http://localhost:5000/login", {
            email,
            password,
          });
          //alert(response.data.message);
          // Lưu email vào localStorage khi đăng nhập thành công
          localStorage.setItem("userEmail", email);
          const { role } = response.data;
          localStorage.setItem("isLoggedIn", "true"); // Lưu trạng thái đăng nhập vào localStorage
          localStorage.setItem("role", role); // Lưu vai trò vào localStorage
          if (role === 'admin') {
            navigate('/admin');
          } else if (role === 'user') {
            navigate('/');
          }
          //navigate("/");
        } catch (error) {
          alert(error.response?.data?.message || "Login failed.");
        }
      }
    };

    return (
        <body>
            <style>
                {`
          body {
          font-family: 'Roboto', sans-serif;
            background-image: url('img/banner/login.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 100vh;
            margin: 0;
          }
        `}
            </style>
            <section class="billing_details_area">
                <div class="container">
                    <div class="col-lg-5" style={{ margin: '0 auto', top: '50px', background: 'white', padding: '5px 15px'}}>
                        <div class="" style={{ textAlign: 'center', paddingTop: '10px' }}>
                            <h2>ĐĂNG NHẬP</h2>
                        </div>
                        <div class="billing_form_area" style={{ marginTop: '20px' }}>
                            <form class="billing_form row" action="" method="post" id="contactForm" novalidate="novalidate">
                                <div class="form-group col-md-12">
                                    <label for="username">Email *</label>
                                    <input 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        type="email" 
                                        className="form-control"  
                                        placeholder="Email" />
                                    {errors.email && <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>}
                                </div>
                                <div class="form-group col-md-12">
                                    <label for="pass">Mật khẩu *</label>
                                    <input 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        type="password" 
                                        className="form-control"  
                                        placeholder="" />
                                    {errors.password && <p style={{ color: "red", fontSize: "12px" }}>{errors.password}</p>}
                                </div>

                                <div class="form-group col-md-12">
                                    <button 
                                    type="submit"
                                    onClick={handleLoginSubmit} 
                                    value="submit" 
                                    class="btn order_s_btn form-control" 
                                    style={{ width: '100%', background: '#f195b2', left:'-10px' }}>
                                        Đăng nhập
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="return_option" style={{ textAlign: 'center', display: 'flex', paddingLeft: '120px' , marginBottom:'20px',justifyItems: "center"}}>
                            <h4><a href="#">Quên mật khẩu? | </a></h4>
                            <h4><Link to="/dang-ky"> Tạo tài khoản mới </Link></h4>
                        </div>
                        
                    </div>

                </div>
            </section>
        </body>
    )
};

export default Login;