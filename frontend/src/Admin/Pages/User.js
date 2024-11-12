import React, { useState } from 'react';
import { Table, Modal, Button, Select, Input, Pagination } from 'antd';
import { useEffect } from "react";
import axios from "axios";
const { Option } = Select;
import { useNavigate } from "react-router-dom";

export default function User() {
    const navigate = useNavigate();
    useEffect(() => {
        // Kiểm tra token trong localStorage
        const isLoggedIn = localStorage.getItem('userEmail');
        if (!isLoggedIn) {
            // Nếu không có token, chuyển hướng về trang đăng nhập
            navigate('/dang-nhap');
        }
    }, []);
    const itemsPerPage = 5; // Set the number of items per page
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Lấy danh sách người dùng từ backend
        const fetchUsers = async () => {
          try {
            const response = await axios.get("http://15.235.155.26:5000/api/admin/user");
            console.log(response.data);
            setUsers(response.data);
          } catch (error) {
            console.error("Failed to fetch users:", error);
          }
        };
        fetchUsers();
      }, []);

    const filteredUsers = users.filter(user =>
        user.fullname && user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };
    return (
        <div className="container">
            <h2 className="text-center mb-4">Danh Sách Khách Hàng</h2>
            <div className="card p-3">
                {/* Search Input */}
                <div className="row mb-3">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="customerFilter">Tìm kiếm theo tên khách hàng:</label>
                        <Input
                            id="customerFilter"
                            placeholder="Nhập tên khách hàng"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                {/* Table with Horizontal Scroll */}
                <div style={{ overflowX: 'auto' }}>
                    <Table 
                        dataSource={currentUsers} 
                        pagination={{
                            current: currentPage,
                            pageSize: itemsPerPage,
                            onChange: page => setCurrentPage(page),
                            total: filteredUsers.length,
                            showTotal: total => `Total ${total} items`,}}
                        rowKey="id"
                    >
                        <Table.Column title="Mã Khách Hàng" dataIndex="id" />
                        <Table.Column title="Tên Khách Hàng" dataIndex="fullname" />
                        <Table.Column title="Email" dataIndex="email" />
                        <Table.Column title="Số điện thoại" dataIndex="phone" />
                        <Table.Column title="Ngày sinh" dataIndex="birthday" />
                        <Table.Column 
                            title="Số dư" 
                            dataIndex="balance" 
                            render={(balance) => {
                                // Kiểm tra và chuyển đổi balance thành số trước khi định dạng
                                if (balance !== undefined && balance !== null) {
                                    const numericBalance = Number(balance);
                                    if (!isNaN(numericBalance)) {
                                        return numericBalance.toLocaleString('vi-VN').replace(/\./g, ',');
                                    }
                                }
                                return balance; // Hiển thị giá trị gốc nếu không thể định dạng
                            }}
                        />
                    </Table>
                </div>

            </div>
        </div>
    );
}
