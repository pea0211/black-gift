import React, { useEffect, useState } from "react";
import Dong from '../img/dong.png'
import Mo from '../img/mo.png'
import { Link, useNavigate, useParams } from "react-router-dom";
import bannerBg from '../img/banner-bg.jpg'
import axios from "axios";

export default function OpenGift() {
    const navigate = useNavigate();
    useEffect(() => {
        // Kiểm tra token trong localStorage
        const isLoggedIn = localStorage.getItem('userEmail');
        if (!isLoggedIn) {
            // Nếu không có token, chuyển hướng về trang đăng nhập
            navigate('/dang-nhap');
        }
    }, []);
    const { id } = useParams();
    const [openGift, setOpenGift] = useState(true);

    const [giftData, setGiftData] = useState({});
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

    const handleOpenGift = async () => {
        
        setOpenGift(false);
        try {
          // Gửi yêu cầu cập nhật đến backend
          const response = await axios.post(`http://15.235.155.26:5000/api/open-gift/${id}`);
    
          if (response.data.success) {
            alert(response.data.message || "Mở hộp quà thành công!");
            //navigate(`/open/${id}`);
            setOpenGift(false);
          }
        } catch (error) {
          console.error("Mở hộp quà thất bại", error);  
        }   
        
      }

  return (
    <div>
        <section style={{ backgroundImage: `url(${bannerBg})` , backgroundSize: 'cover', }}>
        	<div className="container">
        		<div className="banner_text">
        			<h3>Mở hộp quà</h3>
        			<ul>
                    <li><Link to="/">Trang chủ</Link></li>
                    <li><Link to="/open">Mở hộp quà</Link></li>
        				
        			</ul>
                 
        		</div>
        	</div>
        </section>
    <section className="billing_details_area p_100">
        <div className="container">
            <div className="row">
                <div className="col-lg-5">
                    <div className="order_box_price">
                        <div className="" style={{textAlign:'center',fontWeight: 'bold'}}>
                            <h2>Thông tin hộp quà</h2>
                        </div>
                        <div className="payment_list">
                            <div className="price_single_cost">
                                <h5>Tên hộp quà <span>{giftData.name}</span></h5>
                                <h5>Mô tả <span>{giftData.description}</span></h5>
                                <h5>Ngày mua <span>{giftData.NgayMua}</span></h5>
                                <h5>ĐƠN GIÁ <span>{Number(giftData.price).toLocaleString('vi-VN').replace(/\./g, ',')} VNĐ</span></h5>
                                
                            </div>
                        </div>
                        <hr/>
                        <Link className="pest_btn" to="/da-mo">Trở lại</Link>
                    </div>
                </div>
                <div className="col-lg-5" style={{left:'150px'}}>
                    <h5 style={{textAlign:'center' ,marginBottom:'20px'}}>Nhấn để mở quà</h5>
                    <div className="gift-container">
                        {openGift?
                        <img id="giftImage" src={Dong} alt="Hộp Quà" className="gift-image" onClick={handleOpenGift}/>
                        : 
                        <>
                            <img id="giftImage" src={`http://15.235.155.26:5000/api${giftData.image}`} alt="Hộp Quà" className="gift-image"/>
                        </> 
                        }
                        
                    </div>
                    <div className="gift-container">
                        {openGift?
                            null
                        : 
                        <>
                            <h5>Giá trị vật phẩm: <span>{Number(giftData.real_value).toLocaleString('vi-VN').replace(/\./g, ',')} VNĐ</span></h5>
                        </>
                        }
                        
                    </div>
                </div>
                
            </div>
        </div>
    </section>
    </div>
  )
}
