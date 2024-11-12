import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { Table, Select, DatePicker } from 'antd';
import bannerBg from '../img/banner-bg.jpg';
import '../layout/moneyMan.css';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment"; // Thêm moment.js để xử lý ngày

const { Option } = Select;

export default function MoneyMan() {
  const [userBalance, setUserBalance] = useState("");
  const navigate = useNavigate(); // Để điều hướng sau khi nạp tiền thành công
  const userEmail = localStorage.getItem("userEmail"); // Lấy email từ localStorage
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState(null);
  useEffect(() => {	
    const fetchUserBalance = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user-balance/${userEmail}`);
        console.log(response.data);
        setUserBalance(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ls-nap-tien/${userEmail}`);
        console.log(response.data);
        // Sắp xếp các giao dịch theo thứ tự thời gian giảm dần (mới nhất đến cũ nhất)
        const sortedTransactions = response.data.sort((a, b) => {
          return moment(b.date, 'YYYY-MM-DD').valueOf() - moment(a.date, 'YYYY-MM-DD').valueOf();
        });
        setTransactions(sortedTransactions);
        setFilteredTransactions(sortedTransactions); // Khởi tạo dữ liệu lọc
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();

    fetchUserBalance();
	}, []);
  /*
  const handleFilterStatusChange = (status) => {
    setFilterStatus(status);

    if (status === "All") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(transaction => transaction.status === status);
      setFilteredTransactions(filtered);
    }
  };
  */

  const handleFilterStatusChange = (status) => {
    setFilterStatus(status);
    applyFilters(status, filterDate);
  };

  const handleFilterDateChange = (date, dateString) => {
    setFilterDate(dateString ? moment(dateString, 'YYYY-MM-DD') : null);
    applyFilters(filterStatus, dateString ? moment(dateString, 'YYYY-MM-DD') : null);
  };

  const applyFilters = (status, date) => {
    let filtered = transactions;

    // Lọc theo trạng thái
    if (status !== "All") {
      filtered = filtered.filter(transaction => transaction.status === status);
    }

    // Lọc theo ngày
    if (date) {
      filtered = filtered.filter(transaction => {
        const transactionDate = moment(transaction.date, 'YYYY-MM-DD');
        return transactionDate.isSame(date, 'day');
      });
    }
    // Sắp xếp danh sách đã lọc theo thứ tự thời gian giảm dần
    filtered.sort((a, b) => {
      return moment(b.date, 'YYYY-MM-DD').valueOf() - moment(a.date, 'YYYY-MM-DD').valueOf();
    });

    setFilteredTransactions(filtered);
  };

  const columns = [
    { title: 'Mã giao dịch', dataIndex: 'in_code', key: 'in_code' },
    { title: 'Ngày giao dịch', dataIndex: 'date', key: 'date' },
    { title: 'Số tiền', dataIndex: 'payment', key: 'payment',
      render: (payment) => {
        return Number(payment).toLocaleString('vi-VN').replace(/\./g, ','); // Hiển thị giá trị gốc nếu không thể định dạng
      }
    },
    { title: 'Nội dung chuyển tiền', dataIndex: 'content', key: 'content' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span className={`tag ${text === 'Thành công' ? 'tag-completed' : text === 'Đang xử lý' ? 'tag-processing' : 'tag-pending'}`}>
          {text}
        </span>
      ),
    },
  ];

  return (
    <div>
      <section style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: 'cover' }}>
        <div className="container">
          <div className="banner_text">
            <h3>Lịch sử giao dịch</h3>
            <ul>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/money-man">Nạp tiền</Link></li>
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
          <div className="container my-4">
            <div className="row mb-3 justify-content-between align-items-center">
              <div className="col-12 col-md-4">
                <label className="form-label">Lọc theo trạng thái:</label>
                <Select defaultValue="All" style={{ width: '100%' }} onChange={handleFilterStatusChange}>
                  <Option value="All">Tất cả</Option>
                  <Option value="Đang xử lý">Đang xử lý</Option>
                  <Option value="Thành công">Thành công</Option>
                  <Option value="Thất bại">Thất bại</Option>
                </Select>
              </div>
              <div className="col-12 col-md-4 d-flex align-items-end justify-content-end">
                <label className="form-label">Lọc theo ngày:</label>
                <DatePicker style={{ maxWidth: '200px' }} onChange={handleFilterDateChange} format="YYYY-MM-DD" />
              </div>
            </div>

            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={filteredTransactions}
                pagination={{ pageSize: 5 }}
                rowKey="in_code"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
