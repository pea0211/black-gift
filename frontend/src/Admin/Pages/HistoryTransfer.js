import React, { useState } from 'react';
import { Table, Select, Input, DatePicker, Pagination, Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment"; // Thêm moment.js để xử lý ngày
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;

export default function HistoryTransfer() {
    useEffect(() => {
        // Kiểm tra token trong localStorage
        const isLoggedIn = localStorage.getItem('userEmail');
        if (!isLoggedIn) {
            // Nếu không có token, chuyển hướng về trang đăng nhập
            navigate('/dang-nhap');
        }
    }, []);
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateRange, setDateRange] = useState([null, null]);
    const [currentPage, setCurrentPage] = useState(1);
    const [transactions, setTransactions] = useState(5);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const itemsPerPage = 5;

    // Sample transaction data
    /*
    const transactions = [
        { customerName: 'A', giftBox: 'Hộp quà A', productName: 'Gấu bông', amount: '100.000', purchaseDate: '12-10-2024', openDate: '12-10-2024', status: 'Nhận vật phẩm' },
        { customerName: 'B', giftBox: 'Hộp quà B', productName: 'Hoa Giấy', amount: '150.000', purchaseDate: '02-10-2024', openDate: '22-10-2024', status: 'Nhận tiền' },
        { customerName: 'D', giftBox: 'Hộp quà C', productName: 'Tiền', amount: '150.000', purchaseDate: '02-10-2024', openDate: '22-10-2024', status: 'Chưa nhận' },
        { customerName: 'C', giftBox: 'Hộp quà D', productName: 'Hoa Giấy', amount: '150.000', purchaseDate: '02-10-2024', openDate: '22-10-2024', status: 'Nhận tiền' },
        { customerName: 'B', giftBox: 'Hộp quà E', productName: 'Giày', amount: '250.000', purchaseDate: '02-10-2024', openDate: '22-10-2024', status: 'Nhận vật phẩm' },
    ];
    */

    const navigate = useNavigate();
    useEffect(() => {	
        const fetchTransactions = async () => {
          try {
            const response = await axios.get(`http://15.235.155.26:5000/api/admin/box-order`);
            console.log(response.data);
            // Sắp xếp các giao dịch theo thứ tự thời gian giảm dần (mới nhất đến cũ nhất)
            const sortedTransactions = response.data.sort((a, b) => {
                return moment(b.NgayMua, 'YYYY-MM-DD').valueOf() - moment(a.NgayMua, 'YYYY-MM-DD').valueOf();
            });
            setTransactions(sortedTransactions);
            setFilteredTransactions(sortedTransactions);
          } catch (error) {
            console.error("Failed to fetch transactions:", error);
          }
        };
    
        fetchTransactions();
      }, []);
    // Handle date range change
    /*
    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        applyFilters(statusFilter , dates);
    };
    */
    const handleFilterStatusChange = (status) => {
        setStatusFilter(status);
        applyFilters(status);
      };
    
    const applyFilters = (status) => {
        let filtered = transactions;
    
        // Lọc theo trạng thái
        if (status !== "All") {
          filtered = filtered.filter(transaction => transaction.status === status);
        }
        // Sắp xếp danh sách đã lọc theo thứ tự thời gian giảm dần
        filtered.sort((a, b) => {
            return moment(b.NgayMua, 'YYYY-MM-DD').valueOf() - moment(a.NgayMua, 'YYYY-MM-DD').valueOf();
        });
        setFilteredTransactions(filtered);
    };
    /* Calculate filtered transactions
    const filteredTransactions = transactions.filter(transaction => {
        const isStatusMatch = statusFilter === 'All' || transaction.status === statusFilter;
        const isDateMatch = dateRange[0] && dateRange[1]
            ? new Date(transaction.NgayMua) >= dateRange[0] && new Date(transaction.NgayMo) <= dateRange[1]
            : true;

        return isStatusMatch && isDateMatch;
    });
    */
    // Pagination Logic
    const totalTransactions = filteredTransactions.length;
    const currentTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <Title level={2} className="text-center mb-4">Quản lý lịch sử sản phẩm</Title>
            <div className="card p-3">
                <Row gutter={16} className="mb-3" align="bottom">
                    <Col xs={24} sm={12} md={8}>
                        <label htmlFor="statusFilter">Lọc theo trạng thái:</label>
                        <Select
                            id="statusFilter"
                            defaultValue="All"
                            onChange={handleFilterStatusChange}
                            style={{ width: '100%' }}
                        >
                            <Option value="All">Tất cả</Option>
                            <Option value="Đã mua">Đã mua</Option>
                            <Option value="Đã mở">Đã mở</Option>
                            <Option value="Nhận tiền">Nhận tiền</Option>
                            <Option value="Nhận vật phẩm">Nhận vật phẩm</Option>   
                        </Select>
                    </Col>
                    {/* 
                        <Col xs={24} sm={12} md={8}>
                            <label htmlFor="dateRange">Ngày:</label>
                            <RangePicker
                                id="dateRange"
                                onChange={handleDateRangeChange}
                                //format="DD-MM-YYYY"
                                style={{ width: '100%' }}
                            />
                        </Col>
                    */}
                    
                </Row>
                
                
                <Table dataSource={currentTransactions} pagination={false} rowKey="id">
                    <Table.Column title="Tên Khách Hàng" dataIndex="fullname" />
                    <Table.Column title="Tên Hộp Quà" dataIndex="name" />
                    <Table.Column title="Giá Hộp Quà(VNĐ)" dataIndex="price" 
                        render={(price) => {
                            return Number(price).toLocaleString('vi-VN').replace(/\./g, ','); // Hiển thị giá trị gốc nếu không thể định dạng
                        }}
                    />
                    <Table.Column title="Ngày Mua Quà" dataIndex="NgayMua" />
                    <Table.Column title="Ngày Mở Hộp Quà" dataIndex="NgayMo" />
                    <Table.Column title="Vật Phẩm Mở Được" dataIndex="product" />
                    <Table.Column title="Hình ảnh" dataIndex="image" 
                        render= {(text) => <img src={`http://15.235.155.26:5000/api${text}`} alt="Product" style={{ width: 50, height: 50 }} />}
                    />
                    <Table.Column title="Giá Trị Vật Phẩm (VNĐ)" dataIndex="real_value" 
                        render={(value) => {
                            return Number(value).toLocaleString('vi-VN').replace(/\./g, ','); // Hiển thị giá trị gốc nếu không thể định dạng
                        }}
                    />
                    <Table.Column title="Trạng Thái" dataIndex="status"
                        render= {(text) => (
                            <span className={`tag ${text === 'Đã mở' ? 'tag-completed' : text === 'Đã mua' ? 'tag-processing' : 'tag-pending'}`}>
                              {text}
                            </span>
                        )}
                    />
                </Table>

                
                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={totalTransactions}
                    onChange={page => setCurrentPage(page)}
                    style={{ marginTop: '16px', textAlign: 'center' }}
                />
            </div>
        </div>
    );
}
