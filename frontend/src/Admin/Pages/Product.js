import React, { useState } from 'react';
import { useEffect } from "react";
import { Button, Modal, Table, Pagination, Select, Form, Input } from 'antd';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const { Option } = Select;

export default function Product() {
    const itemsPerPage = 5;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [product, setProduct] = useState('');
    const [image, setImage] = useState('');
    const [real_value, setReal_Value] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleOpenAddModal = () => setShowAddModal(true);
    const handleCloseAddModal = () => setShowAddModal(false);
    
    const handleCloseEditModal = () => setShowEditModal(false);
    // Sample product data
    const [products, setProducts] = useState([]);
    const [filterPrice, setFilterPrice] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProductStatus, setSelectedProductStatus] = useState('');
    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/admin/giftbox`);
            console.log(response.data);
            setProducts(response.data);
            setFilteredProducts(response.data); // Khởi tạo dữ liệu lọc ban đầu
            //setFilteredData(response.data); // Khởi tạo dữ liệu lọc
          } catch (error) {
            console.error("Failed to fetch products:", error);
          }
        };
    
        fetchProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filterPrice, filterStatus, products]);

    const applyFilters = () => {
        let filtered = products;

        // Lọc theo giá
        if (filterPrice !== 'All') {
            switch (filterPrice) {
                case 'Dưới 100.000':
                    filtered = filtered.filter(product => product.price < 100000);
                    break;
                case '100.000 - 200.000':
                    filtered = filtered.filter(product => product.price >= 100000 && product.price <= 200000);
                    break;
                case '200.000 - 300.000':
                    filtered = filtered.filter(product => product.price > 200000 && product.price <= 300000);
                    break;
                case 'Trên 300.000':
                    filtered = filtered.filter(product => product.price > 300000);
                    break;
                default:
                    break;
            }
        }

        // Lọc theo tình trạng
        if (filterStatus !== 'All') {
            filtered = filtered.filter(product => product.status === filterStatus);
        }

        setFilteredProducts(filtered);
    };

    const handlePriceFilterChange = (value) => {
        setCurrentPage(1);
        setFilterPrice(value);
    };

    const handleStatusFilterChange = (value) => {
        setCurrentPage(1);
        setFilterStatus(value);
    };

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        setCurrentPage(page);
    };
    const [imageURL, setImageURL] = useState(null);
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          setImageURL(URL.createObjectURL(file)); // Lưu URL ảnh để hiển thị xem trước
          setImage(file); // Lưu file image
        }
      };
    
    const handleSaveProduct = async (e) => {
        e.preventDefault();
        //const email = localStorage.getItem("userEmail");
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("product", product);
        formData.append("image", image);
        formData.append("real_value", real_value);
        try {
          const response = await axios.post('http://localhost:5000/api/new-giftbox', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          alert(response.data.message);
          setShowAddModal(false);
          window.location.reload();
          //navigate('/campaigns');
          //setActiveTab("Login");
        } catch (error) {
          alert(error.response?.data?.message || "Save product failed.");
        }
    }

    const [editingProductId, setEditingProductId] = useState(null); // Thêm state để lưu ID sản phẩm đang chỉnh sửa

    const handleOpenEditModal = (product) => {
        console.log(product); // Kiểm tra dữ liệu được truyền vào
        setEditingProductId(product.id); // Lưu ID của sản phẩm đang chỉnh sửa
        setName(product.name || '');
        setDescription(product.description || '');
        setPrice(product.price || '');
        setProduct(product.product || '');
        setImage(product.image || '');
        setImageURL(product.image ? `http://localhost:5000/api${product.image}` : null);
        setReal_Value(product.real_value || '');
        setShowEditModal(true); // Hiển thị modal chỉnh sửa
        setSelectedProductStatus(product.status);
    };
    
    const handleEditProduct = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("product", product);
        if (image instanceof File) { // Kiểm tra nếu image là một file mới được upload
            formData.append("image", image);
        } else {
            formData.append("image", "");
        }
        formData.append("real_value", real_value);
    
        try {
            const response = await axios.post(`http://localhost:5000/api/edit-giftbox/${editingProductId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            alert(response.data.message || "Product updated successfully!");
            setShowEditModal(false);
            setEditingProductId(null); // Thoát chế độ chỉnh sửa
            window.location.reload();
        } catch (error) {
            console.error("Failed to update product:", error);
            alert(error.response?.data?.message || "Failed to update product.");
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa hộp quà này?')) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/delete-giftbox/${id}`);
                alert(response.data.message);
                // Cập nhật danh sách sản phẩm sau khi xóa
                setProducts(products.filter(product => product.id !== id));
                //window.location.reload();
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert(error.response?.data?.message || "Failed to delete product.");
            }
        }
    };
    return (
        <div className="container">
            <h2 className="text-center mb-4">Quản Lý Sản Phẩm</h2>
            <div className="card p-4 shadow-sm">
            {/* Filter Row */}
            <div className="row mb-3 align-items-end">
                <div className="col-md-4">
                    <label>Lọc theo giá:</label>
                    <Select className="w-100" defaultValue="All" onChange={handlePriceFilterChange}>
                        <Option value="All">Tất cả</Option>
                        <Option value="Dưới 100.000">Dưới 100.000</Option>
                        <Option value="100.000 - 200.000">100.000 - 200.000</Option>
                        <Option value="200.000 - 300.000">200.000 - 300.000</Option>
                        <Option value="Trên 300.000">Trên 300.000</Option>
                    </Select>
                </div>
                <div className="col-md-4">
                    <label>Lọc theo tình trạng:</label>
                    <Select className="w-100" defaultValue="All" onChange={handleStatusFilterChange}>
                        <Option value="All">Tất cả</Option>
                        <Option value="Còn hàng">Còn hàng</Option>
                        <Option value="Đã mua">Đã mua</Option>
                    </Select>
                </div>
                <div className="col-md-4 d-flex justify-content-end">
                    <Button type="primary" onClick={handleOpenAddModal}>
                        Thêm Mới
                    </Button>
                </div>
            </div>

            {/* Product Table */}
            <div style={{ overflowX: 'auto' }}>
                <Table
                    dataSource={currentProducts}
                    pagination={{
                        current: currentPage,
                        pageSize: itemsPerPage,
                        onChange: goToPage,
                        total: filteredProducts.length,
                        showTotal: total => `Total ${total} items`,}}
                    columns={[
                        { title: 'Mã Hộp Quà', dataIndex: 'id' },
                        { title: 'Tên Hộp Quà', dataIndex: 'name' },
                        { title: 'Mô Tả', dataIndex: 'description' },
                        { title: 'Giá (VNĐ)', dataIndex: 'price',
                            render: (price) => {
                                return Number(price).toLocaleString('vi-VN').replace(/\./g, ','); // Hiển thị giá trị gốc nếu không thể định dạng
                            }
                        },
                        { title: 'Vật phẩm bên trong', dataIndex: 'product' },
                        {
                            title: 'Hình ảnh',
                            dataIndex: 'image',
                            render: (text) => <img src={`http://localhost:5000/api${text}`} alt="Product" style={{ width: 50, height: 50 }} />,
                        },
                        { title: 'Giá trị vật phẩm (VND)', dataIndex: 'real_value',
                            render: (real_value) => {
                                return Number(real_value).toLocaleString('vi-VN').replace(/\./g, ','); // Hiển thị giá trị gốc nếu không thể định dạng
                            }
                        },
                        { title: 'Trạng thái', dataIndex: 'status' ,
                            render: (text) => (
                                <span className={`tag ${text === 'Còn hàng' ? 'tag-completed' : text === 'Đã mua' ? 'tag-processing' : 'tag-pending'}`}>
                                  {text}
                                </span>
                              ),
                        },
                        {
                            title: 'Hành Động',
                            render: (text, record) => (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Button type="primary" size="small" onClick={() => handleOpenEditModal(record)}>
                                        Chỉnh sửa
                                    </Button>
                                    <Button type="default" danger size="small" onClick={() => handleDelete(record.id)}>
                                        Xóa
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                    rowKey="id"
                />
            </div>

            </div>
            {/* Add Modal */}
            <Modal
                title="Thêm Sản Phẩm Mới"
                visible={showAddModal}
                onCancel={handleCloseAddModal}
                onOk={handleSaveProduct}
            >
                <Form layout="vertical">
                    <Form.Item label="Tên Hộp Quà" required>
                        <Input 
                            name="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Mô tả" required>
                        <Input 
                            name="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Giá (VNĐ)" required>
                        <Input 
                            name="price" 
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Vật phẩm bên trong" required>
                        <Input 
                            name="product"
                            type="text"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Hình ảnh vật phẩm" required>
                        <label htmlFor="imageUpload" name="label"className="image-label" >
                            {image ? (
                            <img src={imageURL} alt="Image" className="uploaded-image" style={{ height: "90px"}}/>
                            ) : (
                            <>
                                <p>Image</p>
                            </>
                            )}
                        </label>
                        <Input 
                            id="imageUpload"
                            name="image"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                        />
                    </Form.Item>
                    <Form.Item label="Giá trị vật phẩm" required>
                        <Input 
                            name="real_value" 
                            type="number" 
                            value={real_value}
                            onChange={(e) => setReal_Value(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="Chỉnh Sửa Sản Phẩm"
                visible={showEditModal}
                onCancel={handleCloseEditModal}
                onOk={handleEditProduct}
            >
                <Form layout="vertical">
                    <Form.Item label="Tên Hộp Quà" required>
                        <Input 
                            name="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={selectedProductStatus === "Đã mua"}
                        />
                    </Form.Item>
                    <Form.Item label="Mô tả" required>
                        <Input 
                            name="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={selectedProductStatus === "Đã mua"}
                        />
                    </Form.Item>
                    <Form.Item label="Giá (VNĐ)" required>
                        <Input 
                            name="price" 
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            disabled={selectedProductStatus === "Đã mua"}
                        />
                    </Form.Item>
                    <Form.Item label="Vật phẩm bên trong" required>
                        <Input 
                            name="product"
                            type="text"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Hình ảnh vật phẩm" required>
                        <label htmlFor="imageUpload" name="label"className="image-label" >
                            {imageURL ? (
                            <img src={imageURL} alt="Image" className="uploaded-image" style={{ height: "90px"}}/>
                            ) : (
                            <>
                                <p>Image</p>
                            </>
                            )}
                        </label>
                        <Input 
                            id="imageUpload"
                            name="image"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                        />   
                    </Form.Item>
                    <Form.Item label="Giá trị vật phẩm" required>
                        <Input 
                            name="real_value" 
                            type="number" 
                            value={real_value}
                            onChange={(e) => setReal_Value(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
