import React, { useEffect, useState } from "react";
import bannerBg from '../img/banner-bg.jpg'
import { Link, useNavigate, useParams } from "react-router-dom";
import boxDefine from '../img/dong.png'
import axios from "axios";

export default function ProductDetail() {
	const { id } = useParams();
	const [giftData, setGiftData] = useState({});
	const userEmail = localStorage.getItem("userEmail"); 
	useEffect(() => {
		
		const fetchData = async () => {
		  try {
			const response = await axios.get(`http://15.235.155.26:5000/api/box-detail/${id}`);
			setGiftData(response.data);
			console.log(response.data);
		  } catch (error) {
			console.error("Error fetching campaign data:", error);
		  }
		};
	
		fetchData();
	}, []);

	const handleAddToCart = async () => {
        try {
            const response = await axios.post('http://15.235.155.26:5000/api/add-to-cart', {
                email: userEmail,
                giftboxId: giftData.id,
            });
            if (response.data.success) {
                alert('Sản phẩm đã được thêm vào giỏ hàng.');
            } else {
                alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
            alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
        }
    };
  return (
    <div>
        <section style={{ backgroundImage: `url(${bannerBg})` , backgroundSize: 'cover', }}>
        	<div className="container">
        		<div className="banner_text">
        			<h3>Product Details</h3>
        			<ul>
                    <li><Link to="/">Trang chủ</Link></li>
					<li><Link to="/detail">Chi tiết sản phẩm</Link></li>
        			</ul>
        		</div>
        	</div>
        </section>
        <section className="product_details_area p_100">
        	<div className="container">
        		<div className="row product_d_price">
        			<div className="col-lg-6">
        				<div className="product_img"><img className="img-fluid" src={boxDefine} alt=""/></div>
        			</div>
        			<div className="col-lg-6">
        				<div className="product_details_text">
        					<h4>{giftData.name}</h4>
        					<p>{giftData.description}</p>
        					<h5>Giá :  <span>{Number(giftData.price).toLocaleString('vi-VN').replace(/\./g, ',')} VNĐ</span></h5>
        					<a className="pink_more" href="/cart" onClick={handleAddToCart}>Thêm vào giỏ hàng</a>
        				</div>
        			</div>
        		</div>
        		
        	</div>
        </section>
    </div>
  )
}
