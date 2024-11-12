import React from 'react'
import boxDefine from '../img/dong.png'
import '../layout/style.css';
import '../layout/responsive.css';
import { Link } from 'react-router-dom';
import bannerBg from '../img/banner-bg.jpg'
import { useState } from 'react';
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Shop() {
    const [products, setProducts] = useState([]);
    const [sideProducts, setSideProducts] = useState([]);
    const [sortType, setSortType] = useState('name-asc'); // Kiểu sắp xếp
    const [sortedProducts, setSortedProducts] = useState([...products]); // Sản phẩm đã sắp xếp
    const userEmail = localStorage.getItem('userEmail');
    const [searchTerm, setSearchTerm] = useState(''); 
    const navigate = useNavigate();
    useEffect(() => {
        // Kiểm tra token trong localStorage
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn == 'false') {
            // Nếu không có token, chuyển hướng về trang đăng nhập
            navigate('/dang-nhap');
        }
    }, []);
    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await axios.get(`http://15.235.155.26:5000/api/shop/giftbox/${userEmail}`);
            console.log(response.data);
            setProducts(response.data);

            const shuffledProducts = response.data.sort(() => 0.5 - Math.random()); // Shuffle the products array
            if (shuffledProducts.length > 4) {
                setSideProducts(shuffledProducts.slice(0, 4)); // Get the first 4 items
            }
            else {
                setSideProducts(shuffledProducts);
            }
            //setFilteredData(response.data); // Khởi tạo dữ liệu lọc
          } catch (error) {
            console.error("Failed to fetch products:", error);
          }
        };
    
        fetchProducts();
    }, []);

    
    const itemsPerPage = 6; // Số sản phẩm trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(products.length / itemsPerPage);
    // Xác định sản phẩm sẽ hiển thị
    const startIndex = (currentPage - 1) * itemsPerPage;
    //const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);
    const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        let sorted = [...products];
        if (sortType === 'price-asc') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (sortType === 'price-desc') {
            sorted.sort((a, b) => b.price - a.price);
        } else if (sortType === 'name-asc') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            sorted = sorted.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setSortedProducts(sorted);
        setCurrentPage(1); // Quay về trang đầu tiên sau khi sắp xếp
    }, [sortType, products, searchTerm]);

    const handleSortChange = (event) => {
        setSortType(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div class="main">
            <section style={{ backgroundImage: `url(${bannerBg})` , backgroundSize: 'cover', height:'350px'}}
            >
                <div className="container">
                    <div className="banner_text">
                        <h3>Shop</h3>
                        <ul>
                            <li><Link to="/">Trang chủ</Link></li>
                            <li><Link to="/shop">Shop</Link></li>
                        </ul>
                    </div>
                </div>
            </section>
            <section class="product_area p_100">
                <div class="container">
                    <div class="row product_inner_row">
                        <div class="col-lg-9">
                            <div class="row m0 product_task_bar">
                                <div class="product_task_inner">
                                    <div class="float-left">
                                        <a class="active" href="#"><i class="fa fa-th-large" aria-hidden="true"></i></a>
                                        <a href="#"><i class="fa fa-th-list" aria-hidden="true"></i></a>
                                        <span>Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, products.length)} trong {products.length} sản phẩm</span>
                                    </div>
                                    <div class="float-right">
                                        <h4>Sort by :</h4>
                                        <select class="short" onChange={handleSortChange}>
                                        <option value="name-asc">Tên</option>
                                        <option value="price-asc">Giá tăng dần</option>
                                        <option value="price-desc">Giá giảm dần</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row product_item_inner">
                                {currentProducts.map((product, index) => (
                                    <div className="col-lg-4 col-md-4 col-6" key={index}>
                                        <div className="cake_feature_item pt-2">
                                            <div className="cake_img">
                                                <Link to={`/detail/${product.id}`}>
                                                <img src={boxDefine} alt="" style={{ height: '240px', width: '250px'}}/>
                                                </Link>
                                            </div>
                                            <div className="cake_text">
                                                <h4>{Number(product.price).toLocaleString('vi-VN').replace(/\./g, ',')}</h4>
                                                <Link to={`/detail/${product.id}`}>
                                                    <h3>{product.name}</h3>
                                                </Link>
                                                <Link to={`/detail/${product.id}`} className="pest_btn">Chi tiết</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div class="product_pagination">
                                <div class="left_btn">
                                    <a href="#" onClick={handlePreviousPage} disabled={currentPage === 1}><i class="lnr lnr-arrow-left"></i> Trước</a>
                                </div>
                                <div class="middle_list">
                                    <nav aria-label="Page navigation example">
                                        <ul class="pagination">
                                            {[...Array(totalPages)].map((_, page) => (
                                                <li className={`page-item ${currentPage === page + 1 ? 'active' : ''}`} key={page}>
                                                    <a class="page-link" href="#" onClick={() => handlePageClick(page + 1)}>{page + 1}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                </div>
                                <div class="right_btn">
                                    <a href="#" onClick={handleNextPage} disabled={currentPage === totalPages}>Sau <i class="lnr lnr-arrow-right"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <div class="product_left_sidebar">
                                <aside class="left_sidebar search_widget">
                                    <div class="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Tìm kiếm"
                                            value={searchTerm}
                                            onChange={handleSearchChange} // Xử lý thay đổi giá trị tìm kiếm
                                        />
                                        <div class="input-group-append">
                                            <button class="btn" type="button"><i class="icon icon-Search"></i></button>
                                        </div>
                                    </div>
                                </aside>
                                
                                <aside class="left_sidebar p_sale_widget">
                                    <div class="p_w_title">
                                        <h3>Sản phẩm hấp dẫn</h3>
                                    </div>
                                    {sideProducts.map((product, index) => ( 
                                        <div class="media">
                                            <div class="d-flex">
                                                <img src={boxDefine} alt="" style={{ height: '100px'}}/>
                                            </div>
                                            <div class="media-body">
                                                <Link to = {`/detail/${product.id}`}><h4>Hộp quà {product.name}</h4></Link>
                                                <ul class="list_style">
                                                    <li><a href="#"><i class="fa fa-star-o"></i></a></li>
                                                    <li><a href="#"><i class="fa fa-star-o"></i></a></li>
                                                    <li><a href="#"><i class="fa fa-star-o"></i></a></li>
                                                    <li><a href="#"><i class="fa fa-star-o"></i></a></li>
                                                    <li><a href="#"><i class="fa fa-star-o"></i></a></li>
                                                </ul>
                                                <h5>{Number(product.price).toLocaleString('vi-VN').replace(/\./g, ',')}</h5>
                                            </div>
                                        </div>
                                    ))}
                                </aside>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
