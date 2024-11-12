import { Form, Input, Select, Button, Typography, Row, Col } from 'antd';
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

export default function AdminInfor() {
  const handleSubmit = (values) => {
    console.log('Form values:', values);
    // Here you can handle the form submission, such as sending the data to your backend.
  };
  const [adminData, setAdminData] = useState({
    email:"",
		bank: "",
		stk: "",
		owner: "",
	});
	const [passwords, setPasswords] = useState({
		oldPassword: "",
		newPassword: "",
		confirmPassword: ""
	});

  const userEmail = localStorage.getItem("userEmail");
  useEffect(() => {	
		if (!userEmail) {
		  // Nếu không có email trong localStorage, điều hướng về trang đăng nhập
		  window.location.href = "/";
		  return;
		}
	
		// Gửi yêu cầu lấy thông tin người dùng
		const fetchAdminData = async () => {
		  try {
			const response = await axios.get(`http://15.235.155.26:5000/api/admin/bank-account/${userEmail}`);
        	console.log(response.data);
        	setAdminData(response.data);
		  } catch (error) {
			console.error("Error fetching admin data:", error);
		  }
		};
	
		fetchAdminData();
	}, []);
  const handleInputChange = (e) => {
		const { name, value } = e.target;
		setAdminData({
		  ...adminData,
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
		  // Gửi yêu cầu đến backend để cập nhật mật khẩu
		  const response = await axios.post("http://15.235.155.26:5000/api/change-password", {
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
	const handleSaveAdmin = async (e) => {
		e.preventDefault();
		try {
		  adminData.email = userEmail;
		  const response = await axios.post("http://15.235.155.26:5000/api/admin/update-bank", adminData);
		  alert(response.data.message);
		  //navigate("/account");
		} catch (error) {
		  console.error("Error updating profile:", error);
		  alert("Failed to update profile. Please try again.");
		}
	};
  return (
    <div className="container">
      <Title level={2} className="text-center mb-4">Tài Khoản Ngân Hàng</Title>
      <section className="billing_details_area">
        <Row gutter={32}>
          <Col lg={12}>
            <div className="order_box_price" style={{ textAlign: 'left', fontWeight: 'bold' }}>
              <Title level={3} style={{ textAlign: 'center'}}>Thông tin tài khoản</Title>
              <div className="payment_list">
                <div className="price_single_cost">
                  <h5>Ngân hàng <span>{adminData.bank}</span></h5>
                  <h5>Số tài khoản <span>{adminData.stk}</span></h5>
                  <h5>Chủ tài khoản <span>{adminData.owner}</span></h5>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={12}>
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
              <Title level={3}>Sửa thông tin</Title>
            </div>
            <div className="billing_form_area">
              <Form
                name="admin_info"
                //onFinish={handleSubmit}
                layout="vertical"
                /*
                initialValues={{
                  nganhang: 'MB bank',
                  stk: '',
                  chutk: '',
                }}*/
              >
                <Form.Item
                  label="Tên ngân hàng *"
                  rules={[{ required: true, message: 'Vui lòng chọn ngân hàng!' }]}
                >
                  <Input 
                    type="text" 
                    name="bank"
                    value={adminData.bank}
										onChange={handleInputChange}
                    placeholder="Tên ngân hàng" 
                  />
                </Form.Item>

                <Form.Item
                  label="Số tài khoản *"
                  rules={[{ required: true, message: 'Vui lòng nhập số tài khoản!' }]}
                >
                  <Input 
                    type="text" 
                    name="stk"
                    value={adminData.stk}
										onChange={handleInputChange}
                    placeholder="Số tài khoản" 
                  />
                </Form.Item>

                <Form.Item
                  label="Chủ tài khoản *"
                  rules={[{ required: true, message: 'Vui lòng nhập tên chủ tài khoản!' }]}
                >
                  <Input 
                    type="text" 
                    name="owner"
                    value={adminData.owner}
										onChange={handleInputChange}
                    placeholder="Chủ tài khoản" 
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" onClick={handleSaveAdmin} htmlType="submit" style={{ background: '#f195b2' , margin:0}}>
                    Xác nhận sửa
                  </Button>
                </Form.Item>
              </Form>
            </div>
						<div className="" style={{textAlign:'center',marginTop:'40px'}}>
              <h4>Đổi mật khẩu</h4>
            </div>
            <div className="billing_form_area">
              <Form
                name="admin_info"
                //onFinish={handleSubmit}
                layout="vertical"
                /*
                initialValues={{
                  nganhang: 'MB bank',
                  stk: '',
                  chutk: '',
                }}*/
              >
                <Form.Item
                  label="Mật khẩu cũ *"
                  rules={[{ required: true, message: 'Vui lòng chọn ngân hàng!' }]}
                >
                  <Input 
                    type="password"
										className="form-control"  
										name="oldPassword"
										value={passwords.oldPassword}
										onChange={handlePasswordChange}
										placeholder=""
                  />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu mới *"
                  rules={[{ required: true, message: 'Vui lòng nhập số tài khoản!' }]}
                >
                  <Input 
                    type="password"
										className="form-control"  
										name="newPassword"
										value={passwords.newPassword}
										onChange={handlePasswordChange}
										placeholder=""
                  />
                </Form.Item>

                <Form.Item
                  label="Xác nhận mật khẩu mới *"
                  rules={[{ required: true, message: 'Vui lòng nhập tên chủ tài khoản!' }]}
                >
                  <Input 
                    type="password"
										className="form-control"  
										name="confirmPassword"
										value={passwords.confirmPassword}
										onChange={handlePasswordChange}
										placeholder=""
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" onClick={handleSavePassword} htmlType="submit" style={{ background: '#f195b2' , margin:0}}>
                    Lưu mật khẩu
                  </Button>
                </Form.Item>
              </Form>
            </div>
            
          </Col>
        </Row>
      </section>
    </div>
  );
}
