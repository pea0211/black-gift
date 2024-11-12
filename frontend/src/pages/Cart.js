import React, { useState } from 'react';
import { useEffect } from "react";
import bannerBg from '../img/banner-bg.jpg'
import { Link } from 'react-router-dom';
import boxDefine from '../img/dong.png';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import { useNavigate } from "react-router-dom";
export default function Cart() {
	const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
	const userEmail = localStorage.getItem("userEmail"); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
	useEffect(() => {
        // Giả sử bạn gọi API để lấy dữ liệu giỏ hàng từ backend
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/cart-items/${userEmail}`); // Thay bằng email của người dùng đăng nhập
                setCartItems(response.data.cartItems);
                setTotalAmount(response.data.totalAmount);
            } catch (error) {
                console.error('Lỗi khi tải giỏ hàng:', error);
            }
        };

        fetchCartItems();
    }, []);

    const handleRemoveItem = async (product) => {
        try {
			await axios.delete(`http://localhost:5000/delete-cart-items/${product.id}`);
            setCartItems(cartItems.filter(item => item.id !== product.id));
            setTotalAmount(totalAmount - product.price);
            //window.location.reload();

        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
        }
    };

    const openModal = (transaction) => { 
        setIsModalOpen(true);
      };
    
    const closeModal = () => {
        setIsModalOpen(false);
        //setSelectedTransaction({});
    };
    const handleOrder = async () => {
        try {
            const response = await axios.post('http://localhost:5000/order', { email: userEmail });
            alert(response.data.message);
            navigate("/da-mua");
        } catch (error) {
          console.error("Failed to order:", error);
          alert(error.response.data.message || 'Đã xảy ra lỗi');
        }
    }; 
    
  return (
    <div>
        <section style={{ backgroundImage: `url(${bannerBg})` , backgroundSize: 'cover', }}>
        	<div className="container">
        		<div className="banner_text">
        			<h3>Giỏ hàng</h3>
        			<ul>
					<li><Link to="/">Trang chủ</Link></li>
					<li><Link to="/cart">Giỏ hàng</Link></li>
        			</ul>
        		</div>
        	</div>
        </section>
        <section className="cart_table_area p_100">
        	<div className="container">
			{cartItems.length > 0 ? (
                        <div className="">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">STT</th>
                                        <th scope="col">Hình ảnh</th>
                                        <th scope="col">Tên hộp quà</th>
                                        <th scope="col">Giá</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item, index) => (
                                        <tr key={item.id}>
                                            <td style={{ paddingTop: '80px' }}>{index + 1}</td>
                                            <td>
                                                <img src={boxDefine} alt="" style={{ height: '160px', width: '150px' }} />
                                            </td>
                                            <td style={{ paddingTop: '80px' }}>{item.name}</td>
                                            <td style={{ paddingTop: '80px' }}>{Number(item.price).toLocaleString('vi-VN').replace(/\./g, ',')} VNĐ</td>
                                            <td style={{ paddingTop: '80px' }}>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleRemoveItem(item)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <Link className="pest_btn" to="/">Mua thêm</Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h4>Giỏ hàng rỗng</h4>
                            <Link className="pest_btn" to="/">Mua sắm ngay</Link>
                        </div>
                    )}
                    {cartItems.length > 0 && (
                        <div className="row cart_total_inner">
                            <div className="col-lg-7"></div>
                            <div className="col-lg-5">
                                <div className="cart_total_text">
                                    <div className="cart_head">
                                        Tổng tiền
                                    </div>
                                    <div className="total">
                                        <h4>Tổng tiền <span>{Number(totalAmount).toLocaleString('vi-VN').replace(/\./g, ',')} VNĐ</span></h4>
                                    </div>
                                    <div className="cart_footer">
                                        <a className="pest_btn" href="#" onClick={openModal}>Mua hàng</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
        	</div>
        </section>
        <Modal
            title="Đơn hàng"
            visible={isModalOpen}
            onCancel={closeModal}
            footer={null}
        >
            <Table 
                dataSource={cartItems} 
                pagination={false}
                rowKey="id"
            >
                <Table.Column title="Hình ảnh" dataIndex="image" 
                    render={() => <img src={boxDefine} alt="Hình ảnh" style={{ height: '100px', width: '100px' }} />}
                />
                <Table.Column title="Tên hộp quà" dataIndex="name"/>
                <Table.Column title="Giá tiền" dataIndex="price" 
                    render={(price) => {
                        return Number(price).toLocaleString('vi-VN').replace(/\./g, ','); // Hiển thị giá trị gốc nếu không thể định dạng
                    }}
                />
                
            </Table>
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                    <h4>Tổng tiền: {Number(totalAmount).toLocaleString('vi-VN').replace(/\./g, ',')} VNĐ</h4>
                </div>
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <Button type="default" onClick={closeModal} style={{ marginRight: '10px' }}>Hủy</Button>
                <Button type="primary" onClick={handleOrder}>Đặt hàng</Button>
            </div>
      </Modal>
    </div>
  )
}
