import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Select, DatePicker, Form } from 'antd';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment"; // Thêm moment.js để xử lý ngày
const { Option } = Select;

export default function QlyRutTien() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const navigate = useNavigate();
  const itemsPerPage = 5;

  useEffect(() => {	
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/rut-tien`);
        console.log(response.data);
        // Sắp xếp các giao dịch theo thứ tự thời gian giảm dần (mới nhất đến cũ nhất)
        const sortedTransactions = response.data.sort((a, b) => {
          return moment(b.date, 'YYYY-MM-DD').valueOf() - moment(a.date, 'YYYY-MM-DD').valueOf();
        });

        setTransactions(sortedTransactions);
        setFilteredTransactions(sortedTransactions); // Khởi tạo dữ liệu lọc với danh sách đã sắp xếp
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
	}, []);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const currentTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openUpdateModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
    setUpdatedStatus(transaction.status);
  };

  const closeUpdateModal = () => {
    setIsModalOpen(false);
    //setSelectedTransaction({});
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChange = (status) => {
    setUpdatedStatus(status);
    console.log(status);
	};

  const handleUpdate = async () => {
    try {
      const updatedTransaction = {
        ...selectedTransaction,
        status: updatedStatus
      }
      // Gửi yêu cầu cập nhật đến backend
      const response = await axios.post(`http://localhost:5000/admin/update-rut-tien/${selectedTransaction.id}`, {
        status: updatedStatus,
      });

      if (response.status === 200) {
        alert(response.data.message || "Trạng thái giao dịch đã được cập nhật thành công!");
        // Cập nhật danh sách giao dịch sau khi cập nhật thành công
        setTransactions(transactions.map(tran => 
          tran.id === selectedTransaction.id ? updatedTransaction : tran
        ));
        setFilteredTransactions(filteredTransactions.map(tran =>
          tran.id === selectedTransaction.id ? updatedTransaction : tran
        ));
        closeUpdateModal();
      }
    } catch (error) {
      console.error("Failed to update transaction:", error);
      
    }
  };

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
    { title: 'Mã giao dịch', dataIndex: 'id' },
    { title: 'Tên Khách Hàng', dataIndex: 'fullname' },   
    { title: 'Ngân hàng', dataIndex: 'bank' },
    { title: 'Số tài khoản', dataIndex: 'acc_number' },
    { title: 'Chủ tài khoản', dataIndex: 'owner' },
    { title: 'Số Tiền (VNĐ)', dataIndex: 'payment',
      render: (payment) => {
        return Number(payment).toLocaleString('vi-VN').replace(/\./g, ','); // Hiển thị giá trị gốc nếu không thể định dạng
      }
    },
    { title: 'Thời Gian', dataIndex: 'date' },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span className={`tag ${text === 'Thành công' ? 'tag-completed' : text === 'Đang xử lý' ? 'tag-processing' : 'tag-pending'}`}>
          {text}
        </span>
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        record.status === 'Đang xử lý' ? (
          <Button type="primary" onClick={() => openUpdateModal(record)}>
            Xử lý
          </Button>
        ) : null
      ),
    },
    /*
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => openUpdateModal(record)}>
          Xử lý
        </Button>
      ),
    },*/
  ];

  return (
    <div className="container">
      <h2 className="text-center mb-4">Quản Lý Giao Dịch Rút Tiền</h2>
      <div className="card p-4 shadow-sm">
        <div className="row mb-3 align-items-end">
          <div className="col-md-4">
            <label>Lọc theo ngày:</label>
            <DatePicker style={{ maxWidth: '200px' }} onChange={handleFilterDateChange} format="YYYY-MM-DD" />
          </div>
          <div className="col-md-4">
            <label>Lọc theo tình trạng:</label>
            <Select defaultValue="All" style={{ width: '100%' }} onChange={handleFilterStatusChange}>
              <Option value="All">Tất cả</Option>
              <Option value="Thành công">Thành công</Option>
              <Option value="Đang xử lý">Đang xử lý</Option>
              <Option value="Thất bại">Thất bại</Option>
            </Select>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={currentTransactions}
          pagination={{
            current: currentPage,
            pageSize: itemsPerPage,
            onChange: handlePageChange,
            total: filteredTransactions.length,
            showTotal: total => `Total ${total} items`,
          }}
          rowKey="id"
        />
      </div>

      <Modal
        title="Cập nhật trạng thái rút tiền"
        visible={isModalOpen}
        onCancel={closeUpdateModal}
        footer={null}
      >
        {selectedTransaction && (
          <Form>
            <Form.Item label="Mã giao dịch">
              <input className="form-control" value={selectedTransaction.id} readOnly />
            </Form.Item>
            <Form.Item label="Tên Khách Hàng">
              <input className="form-control" value={selectedTransaction.fullname} readOnly />
            </Form.Item>
            <Form.Item label="Ngân hàng">
              <input className="form-control" value={selectedTransaction.bank} readOnly />
            </Form.Item>
            <Form.Item label="Số tài khoản">
              <input className="form-control" value={selectedTransaction.acc_number} readOnly />
            </Form.Item>
            <Form.Item label="Số Tiền (VNĐ)">
              <input className="form-control" value={selectedTransaction.payment} readOnly />
            </Form.Item>
            <Form.Item label="Thời Gian">
              <input className="form-control" value={selectedTransaction.date} readOnly />
            </Form.Item>
            <Form.Item label="Trạng Thái">
              <Select defaultValue={selectedTransaction.status} onChange={handleChange}>
                <Option value="Đang xử lý">Đang xử lý</Option>
                <Option value="Thành công">Thành công</Option>
                <Option value="Thất bại">Thất bại</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={handleUpdate}>Xác Nhận</Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
