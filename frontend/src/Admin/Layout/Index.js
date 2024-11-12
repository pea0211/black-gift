import React, { useState } from 'react';
import './index.css';
import Logo from '../../img/logo.png';
import Person from '../../img/persion-default.png';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Row, Col } from 'antd';
import { Route, Routes, useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;

export default function Index() {
  const [collapsed, setCollapsed] = useState(false); // State to manage sidebar collapse
  const navigate = useNavigate(); // Điều hướng dựa trên vai trò
  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false"); // Lưu trạng thái đăng nhập vào localStorage
    localStorage.setItem("role", ""); // Lưu vai trò vào localStorage
    localStorage.removeItem("userEmail");
    navigate("/dang-nhap"); // Chuyển hướng đến trang đăng nhập sau khi đăng xuất
  };
  const menu = (
    <Menu>
      <Menu.Item>
        <span>Admin</span>
      </Menu.Item>
      <Menu.Item>
        <Link to="/admin/admin-infor">Thông tin tài khoản</Link>
      </Menu.Item>
      <Menu.Item onClick={handleLogout}>
        <Link>Đăng xuất</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
      width={240} // Set the desired width here
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className="sidebar"
      >
        <div className="logo">
          <img src={Logo} alt="Logo" className="img-fluid" style={{ width: '100%' }} />
        </div>
        <Menu theme="light" mode="inline">
          <Menu.Item key="1">
            <Link to="/admin">
              <i className="fas fa-box icon"></i> {collapsed ? '' : 'Quản lý sản phẩm'}
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/admin/user">
              <i className="fas fa-shopping-cart icon"></i> {collapsed ? '' : 'Danh sách khách hàng'}
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/admin/transfer">
              <i className="fas fa-money-bill-wave icon"></i> {collapsed ? '' : 'Quản lý giao dịch nạp tiền'}
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/admin/rut-tien">
              <i className="fas fa-money-bill-wave icon"></i> {collapsed ? '' : 'Quản lý giao dịch rút tiền'}
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/admin/history-transfer">
              <i className="fas fa-history icon"></i> {collapsed ? '' : 'Quản lý lịch sử sản phẩm'}
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Row justify="end" align="middle" style={{ height: '100%' }}>
            <Col>
              <Dropdown overlay={menu} trigger={['click']}>
                <div className='position-relative' style={{ marginRight: '20px' }}>
                  <Avatar src={Person} size={40} style={{ cursor: 'pointer', border: '1px solid' }} />
                </div>
              </Dropdown>
            </Col>
          </Row>
        </Header>
        <Content style={{ padding: '24px', overflowX: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
