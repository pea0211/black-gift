import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { Form, Input, Button, DatePicker } from 'antd';
import bannerBg from '../img/banner-bg.jpg';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MoneyPay() {
  useEffect(() => {
    // Kiểm tra token trong localStorage
    const isLoggedIn = localStorage.getItem('userEmail');
    if (!isLoggedIn) {
        // Nếu không có token, chuyển hướng về trang đăng nhập
        navigate('/dang-nhap');
    }
}, []);
  const [transferData, setTransferData] = useState({});
  const [userBalance, setUserBalance] = useState("");
  const navigate = useNavigate(); // Để điều hướng sau khi nạp tiền thành công
  const userEmail = localStorage.getItem("userEmail"); // Lấy email từ localStorage
  const [in_code, setIn_Code] = useState("");
  useEffect(() => {	
    const fetchUserBalance = async () => {
      try {
        const response = await axios.get(`http://15.235.155.26:5000/api/user-balance/${userEmail}`);
        console.log(response.data);
        setUserBalance(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserBalance();
	}, []);
  useEffect(() => {	
		const email = 'admin@gmail.com';
		// Gửi yêu cầu lấy thông tin người dùng
		const fetchTransferData = async () => {
		  try {
			const response = await axios.get(`http://15.235.155.26:5000/api/admin/bank-account/${email}`);
        	console.log(response.data);
        	setTransferData(response.data);
		  } catch (error) {
			console.error("Error fetching admin data:", error);
		  }
		};

		fetchTransferData();
	}, []);
  // Hàm tạo mã tự động theo format (giờ + phút + ngày + tháng + năm)
  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

// Hàm tạo mã tự động theo format (giờ + phút + ngày + tháng + năm)
  const generateTransactionCode = () => {
    const now = new Date();
    const hours = formatNumber(now.getHours());
    const minutes = formatNumber(now.getMinutes());
    const day = formatNumber(now.getDate());
    const month = formatNumber(now.getMonth() + 1); // Tháng bắt đầu từ 0, nên cần +1
    const year = now.getFullYear();
    
    const code = `${hours}${minutes}${day}${month}${year}`;
    return code;
  };

  const transactionCode = generateTransactionCode(); // Tạo mã tự động

  const onFinish = async(values) => {
    try {
      
      const requestData = {
        email: userEmail,
        in_code: in_code,
        payment: values.sotien,
        content: `${userEmail} ${transactionCode}` // Nội dung là email + mã tự động
      };
      console.log(requestData);

      // Gửi yêu cầu nạp tiền đến server
      const response = await axios.post('http://15.235.155.26:5000/api/nap-tien', requestData);
      alert(response.data.message || "Yêu cầu nạp tiền đã được gửi thành công!");
      navigate('/money-man'); // Điều hướng về trang chủ sau khi thành công
    } catch (error) {
      console.error("Error sending deposit request:", error);
      alert(error.response?.data?.message || "Gửi yêu cầu nạp tiền thất bại.");
    }
  };
  return (
    <div>
      <section style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: 'cover' }}>
        <div className="container">
          <div className="banner_text">
            <h3>Nạp tiền</h3>
            <ul>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/money-pay">Nạp tiền</Link></li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="billing_details_area p_100">
        <div className="container">
          <div style={{ width: '500px', height: '50px', marginTop: '-90px' }}>
            <h3 style={{ padding: '10px 10px', color: '#FF0099' }}>Số dư: {Number(userBalance.balance).toLocaleString('vi-VN').replace(/\./g, ',')} đồng</h3>
          </div>
          <hr />
          <div className="row" style={{ marginTop: '30px' }}>
            <div className="col-lg-7">
              <div className="" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                <h2>Thông tin nạp tiền</h2>
              </div>
              <div className="billing_form_area">
                <Form className="billing_form" layout="vertical" onFinish={onFinish}>
                  <Form.Item
                    label="Mã giao dịch *"
                    //name="magiaodich"
                    rules={[{ required: true, message: 'Vui lòng nhập mã giao dịch!' }]}
                  >
                    <Input 
                      placeholder="Mã giao dịch" 
                      name="in_code"
                      value={in_code}
                      onChange={(e) => setIn_Code(e.target.value)}
                    />
                    <i style={{fontSize: "12px", }}>Vui lòng nhập chính xác mã giao dịch chuyển tiền mà bạn đã thực hiện.</i>
                  </Form.Item>
                  <Form.Item
                    label="Số tiền *"
                    name="sotien"
                    rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
                  >
                    <Input placeholder="Số tiền" />
                  </Form.Item>
                  <Form.Item
                    label="Nội dung chuyển tiền *"
                    //rules={[{ required: true, message: 'Vui lòng nhập nội dung chuyển tiền!' }]}
                  >
                    <Input placeholder="Nội dung chuyển tiền" 
                      value={`${userEmail} ${generateTransactionCode()}`}
                      readOnly
                    />
                    <i style={{fontSize: "12px", }}>Vui lòng ghi chính xác nội dung như trên khi chuyển khoản.</i>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%', background: '#f195b2', margin:0 }}>
                      Gửi thông tin
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="order_box_price">
                <div className="" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  <h2>Thông tin chuyển khoản</h2>
                </div>
                <div className="payment_list">
                  <div className="price_single_cost">
                    <h5>Ngân hàng <span>{transferData.bank}</span></h5>
                    <h5>Số tài khoản <span>{transferData.stk}</span></h5>
                    <h4>Chủ tài khoản <span>{transferData.owner}</span></h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
