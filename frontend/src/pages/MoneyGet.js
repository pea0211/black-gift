import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { Form, Input, Select, Button } from 'antd';
import bannerBg from '../img/banner-bg.jpg';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export default function MoneyGet() {
  useEffect(() => {
    // Kiểm tra token trong localStorage
    const isLoggedIn = localStorage.getItem('userEmail');
    const role = localStorage.getItem('role');
        if (!isLoggedIn || role !== 'user') {
        // Nếu không có token, chuyển hướng về trang đăng nhập
        navigate('/dang-nhap');
    }
}, []);
  const handleFinish = async(values) => {
    try { 
      const requestData = {
        email: userEmail,
        bank: values.bank,
        acc_number: values.acc_number,
        owner: values.owner,
        payment: values.payment,
      };
      console.log(requestData);

      // Gửi yêu cầu nạp tiền đến server
      const response = await axios.post('http://15.235.155.26:5000/api/rut-tien', requestData);
      alert(response.data.message || "Yêu cầu rút tiền đã được gửi thành công!");
      navigate('/ls-rut-tien'); // Điều hướng về trang chủ sau khi thành công
    } catch (error) {
      console.error("Error sending deposit request:", error);
      alert(error.response?.data?.message || "Gửi yêu cầu rút tiền thất bại.");
    }
  };

  const [userBalance, setUserBalance] = useState("");
  const navigate = useNavigate(); // Để điều hướng sau khi nạp tiền thành công
  const userEmail = localStorage.getItem("userEmail"); // Lấy email từ localStorage
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
  return (
    <div>
      <section style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: 'cover' }}>
        <div className="container">
          <div className="banner_text">
            <h3>Rút tiền</h3>
            <ul>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/money-get">Rút tiền</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="billing_details_area" style={{ marginBottom: '90px' }}>
        <div className="container">
          <h3 style={{ padding: '10px 10px', color: '#FF0099', fontWeight: 'bold', marginTop: '10px' }}>
            Số dư: {Number(userBalance.balance).toLocaleString('vi-VN').replace(/\./g, ',')} đồng
          </h3>
          <hr />
          <div className="col-lg-10" style={{ margin: '0 auto', background: '#EEEEEE', paddingBottom: '20px', border: '1px solid gray' }}>
            <div style={{ textAlign: 'center', paddingTop: '20px' }}>
              <h4>RÚT TIỀN</h4>
            </div>
            <div className="billing_form_area" style={{ marginTop: '20px' }}>
              <Form
                layout="vertical"
                onFinish={handleFinish}
                requiredMark={false}
              >
                <Form.Item
                  label="Tên ngân hàng *"
                  name="bank"
                  rules={[{ required: true, message: 'Vui lòng nhập tên ngân hàng!' }]}
                >
                  <Input placeholder="Tên ngân hàng" />
                </Form.Item>

                <Form.Item
                  label="Số tài khoản *"
                  name="acc_number"
                  rules={[{ required: true, message: 'Vui lòng nhập số tài khoản!' }]}
                >
                  <Input placeholder="Số tài khoản" />
                </Form.Item>

                <Form.Item
                  label="Chủ tài khoản *"
                  name="owner"
                  rules={[{ required: true, message: 'Vui lòng nhập tên chủ tài khoản!' }]}
                >
                  <Input placeholder="Chủ tài khoản" />
                </Form.Item>

                <Form.Item
                  label="Số tiền *"
                  name="payment"
                  //rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
                  rules={[
                    { required: true, message: 'Vui lòng nhập số tiền!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value) {
                          return Promise.resolve();
                        }
                        if (value < 10000) {
                          return Promise.reject(new Error('Số tiền rút tối thiểu là 10,000 đồng'));
                        }
                        if (value > userBalance.balance) {
                          return Promise.reject(new Error('Số dư không đủ'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input type="number" placeholder="Số tiền" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ width: '100%', background: '#f195b2' }}>
                    Rút tiền
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
