import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { Table, Select, DatePicker } from 'antd';
import bannerBg from '../img/banner-bg.jpg';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment"; // Thêm moment.js để xử lý ngày

export default function OrderAll() {
  const columns = [
    { title: 'Mã hộp quà', dataIndex: 'id', key: 'id' },
    { title: 'Tên hộp quà', dataIndex: 'name', key: 'name' },
    { title: 'Ngày mua', dataIndex: 'NgayMua', key: 'NgayMua' },
    { title: 'Giá (VNĐ)', dataIndex: 'price', key: 'price',
      render: (price) => {
        return Number(price).toLocaleString('vi-VN').replace(/\./g, ','); // Hiển thị giá trị gốc nếu không thể định dạng
      }
    },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        record.status === 'Đã mua' ? <Link to={`/open/${record.id}`}>Mở quà ngay</Link> : null
      ),
    },
  ];

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const navigate = useNavigate(); // Để điều hướng sau khi nạp tiền thành công
  const userEmail = localStorage.getItem("userEmail"); // Lấy email từ localStorage

  useEffect(() => {	
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/box-order/${userEmail}`);
        console.log(response.data);

        // Sắp xếp các giao dịch theo thứ tự thời gian giảm dần (mới nhất đến cũ nhất)
        const sortedData = response.data.sort((a, b) => {
          return moment(b.NgayMua, 'YYYY-MM-DD').valueOf() - moment(a.NgayMua, 'YYYY-MM-DD').valueOf();
        });

        setData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchData();
	}, []);
  
  const handleFilterDateChange = (date, dateString) => {
    setFilterDate(dateString ? moment(dateString, 'YYYY-MM-DD') : null);
    applyFilters(dateString ? moment(dateString, 'YYYY-MM-DD') : null);
  };
  const applyFilters = (date) => {
    let filtered = data;

    // Lọc theo ngày
    if (date) {
      filtered = filtered.filter(order => {
        const orderDate = moment(order.NgayMua, 'YYYY-MM-DD');
        return orderDate.isSame(date, 'day');
      });
    }
    // Sắp xếp danh sách đã lọc theo thứ tự thời gian giảm dần
    filtered.sort((a, b) => {
      return moment(b.NgayMua, 'YYYY-MM-DD').valueOf() - moment(a.NgayMua, 'YYYY-MM-DD').valueOf();
    });
    setFilteredData(filtered);
  };

  return (
    <div>
      <section style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: 'cover' }}>
        <div className="container">
          <div className="banner_text">
            <h3>Lịch sử mua hàng</h3>
            <ul>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/da-mua">Hộp quà đã mua</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="billing_details_area p_100">
        <div className="container">
          <div style={{ width: '500px', height: '50px', marginTop: '-90px' }}>
            <h3 style={{ padding: '10px 10px', color: '#FF0099' }}>Hộp quà đã mua</h3>
          </div>
          <hr />
          <div className="col-12 col-md-4">
            <label className="form-label">Lọc theo ngày:</label>
            <DatePicker style={{ maxWidth: '200px' }} onChange={handleFilterDateChange} format="YYYY-MM-DD" />  
          </div>

          <div style={{ overflowX: 'auto' }}>
            <Table
              columns={columns}
              dataSource={filteredData} 
              pagination={false}
              scroll={{ x: 'max-content' }} // Enable horizontal scrolling
              rowKey="id"
            />
          </div>

          <div className="pagination" id="pagination"></div>
        </div>
      </section>
    </div>
  );
}
