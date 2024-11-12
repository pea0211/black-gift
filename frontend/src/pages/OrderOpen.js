import React , {useState} from 'react';
import { Link } from 'react-router-dom';
import bannerBg from '../img/banner-bg.jpg';
import { Table, Modal, Button, Select, DatePicker } from 'antd';
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment"; // Thêm moment.js để xử lý ngày
const { Option } = Select;

export default function OrderOpen() {
  useEffect(() => {
    // Kiểm tra token trong localStorage
    const isLoggedIn = localStorage.getItem('userEmail');
    if (!isLoggedIn) {
        // Nếu không có token, chuyển hướng về trang đăng nhập
        navigate('/dang-nhap');
    }
}, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterDate, setFilterDate] = useState(null);
    const navigate = useNavigate(); // Để điều hướng sau khi nạp tiền thành công
    const userEmail = localStorage.getItem("userEmail"); // Lấy email từ localStorage
    
    useEffect(() => {	
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://15.235.155.26:5000/api/box-open/${userEmail}`);
          console.log(response.data);
          // Sắp xếp các giao dịch theo thứ tự thời gian giảm dần (mới nhất đến cũ nhất)
          const sortedData = response.data.sort((a, b) => {
            return moment(b.NgayMo, 'YYYY-MM-DD').valueOf() - moment(a.NgayMo, 'YYYY-MM-DD').valueOf();
          });
          setData(response.data);
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
      filtered.sort((a, b) => {
        return moment(b.NgayMo, 'YYYY-MM-DD').valueOf() - moment(a.NgayMo, 'YYYY-MM-DD').valueOf();
      });
      setFilteredData(filtered);
    };
  
    const openUpdateModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const [updatedStatus, setUpdatedStatus] = useState('');
    const handleChange = (status) => {
      setUpdatedStatus(status);
      console.log(status);
    };
    const handleReceivedOrder = async () => {
      try {
        const updatedOrder = {
          ...selectedOrder,
          status: updatedStatus
        }
        // Gửi yêu cầu cập nhật đến backend
        const response = await axios.post(`http://15.235.155.26:5000/api/received-gift/${selectedOrder.id}`, {
          status: updatedStatus,
        });
  
        if (response.status === 200) {
          alert(response.data.message || "Trạng thái giao dịch đã được cập nhật thành công!");
          // Cập nhật danh sách giao dịch sau khi cập nhật thành công
          setData(data.map(box => 
            box.id === selectedOrder.id ? updatedOrder : box
          ));
          setFilteredData(filteredData.map(box =>
            box.id === selectedOrder.id ? updatedOrder : box
          ));
          closeUpdateModal();
        }
      } catch (error) {
        console.error("Failed to update transaction:", error);
        
      }
    }
  const columns = [
    { title: 'Mã hộp quà', dataIndex: 'id', key: 'id' },
    { title: 'Tên hộp quà', dataIndex: 'name', key: 'name' },
    { title: 'Ngày mua', dataIndex: 'NgayMua', key: 'NgayMua' },
    { title: 'Ngày mở', dataIndex: 'NgayMo', key: 'NgayMo' },
    { title: 'Giá (VNĐ)', dataIndex: 'price', key: 'price',
      render: (price) => {
        return Number(price).toLocaleString('vi-VN').replace(/\./g, ','); // Hiển thị giá trị gốc nếu không thể định dạng
      }
    },
    { title: 'Vật phẩm bên trong', dataIndex: 'product', key: 'product' },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      render: (text) => <img src={`http://15.235.155.26:5000/api${text}`} alt="Product" style={{ width: 50, height: 50 }} />,
    },
    { title: 'Giá trị vật phẩm (VNĐ)', dataIndex: 'real_value', key: 'real_value',
       render: (value) => {
         return Number(value).toLocaleString('vi-VN').replace(/\./g, ','); // Hiển thị giá trị gốc nếu không thể định dạng
       }
    },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (text) => (
        <span className={`tag ${text === 'Nhận tiền' ? 'tag-completed' : text === 'Đã mở' ? 'tag-processing' : 'tag-pending'}`}>
          {text}
        </span>
      ),
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        record.status === 'Đã mở' ? 
            <Button type="primary" size="small" onClick={() => openUpdateModal(record)}>
                Nhận quà
            </Button>
            : null
    ),
    },
  ];

  return (
    <div>
      <section style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: 'cover' }}>
        <div className="container">
          <div className="banner_text">
            <h3>Lịch sử mua hàng</h3>
            <ul>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/da-mo">Hộp quà đã mở</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="billing_details_area p_100">
        <div className="container">
          <div style={{ width: '500px', height: '50px', marginTop: '-90px' }}>
            <h3 style={{ padding: '10px 10px', color: '#FF0099' }}>Hộp quà đã mở</h3>
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
      <Modal
                    title="Hình thức nhận quà"
                    visible={isModalOpen}
                    onCancel={closeUpdateModal}
                    footer={[
                        <Button key="cancel" onClick={closeUpdateModal}>
                            Hủy
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleReceivedOrder}>
                            Xác Nhận
                        </Button>,
                    ]}
                >
                    {selectedOrder && (
                        <form>
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label mr-1">Quy đổi quà thành:</label>
                                <Select id="status" defaultValue={'Nhận vật phẩm'} style={{width:'96px'}} onChange={handleChange}>
                                    <Option value="Nhận tiền">Tiền</Option>
                                    <Option value="Nhận vật phẩm">Hiện vật</Option>
                                </Select>
                            </div>
                        </form>
                    )}
                </Modal>
    </div>
  );
}
