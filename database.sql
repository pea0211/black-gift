/* 15.235.155.26:22/root/Cn&Y3^ccK6 */

Create database black_gift;
use black_gift;

CREATE TABLE account (
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user' NOT NULL
);
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    fullname VARCHAR(255),
    phone VARCHAR(15),
    birthday VARCHAR(255),
    balance decimal(20,0) default 0,
    CONSTRAINT fk_user_email FOREIGN KEY (email) REFERENCES account(email) 
);

CREATE TABLE giftbox (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description Text,
	price decimal(20,0) default 0,
    product varchar(255),
    image TEXT,
    real_value decimal(20,0) default 0,
    NgayMua varchar(255),
    NgayMo varchar(255),
    status ENUM('Còn hàng', 'Đã mua', 'Đã mở', 'Nhận vật phẩm', 'Nhận tiền') NOT NULL,
    email varchar(255),
    CONSTRAINT fk_gift_box_email FOREIGN KEY (email) REFERENCES user(email) 
);
create table admin_bank (
	id INT AUTO_INCREMENT PRIMARY KEY,
    email varchar(255) not null,
	bank varchar(255),
    stk varchar(255),
    owner varchar(255),
    CONSTRAINT fk_admin_bank_email FOREIGN KEY (email) REFERENCES account(email) 
);

create table money_out (
	id INT AUTO_INCREMENT PRIMARY KEY,
    out_code varchar(255),
    bank varchar(255),
    acc_number varchar(255),
    owner varchar(255),
    payment decimal (20,0) not null,
    date varchar(255),
    status enum('Đang xử lý', 'Thành công', 'Thất bại') ,
    email VARCHAR(255) NOT NULL,
    
    CONSTRAINT fk_out_email FOREIGN KEY (email) REFERENCES user(email) 
);

create table money_in (
	id INT AUTO_INCREMENT PRIMARY KEY,
    in_code varchar(255),
    payment decimal (20,0) not null,
    content text,
    date varchar(255),
    status enum('Đang xử lý', 'Thành công', 'Thất bại') ,
    email VARCHAR(255) NOT NULL,
    
    CONSTRAINT fk_in_email FOREIGN KEY (email) REFERENCES user(email) 
);

CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    total_amount DECIMAL(20, 0) DEFAULT 0,
    
    CONSTRAINT fk_cart_email FOREIGN KEY (email) REFERENCES account(email)
);

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    giftbox_id INT NOT NULL,
    selected_for_purchase BOOLEAN DEFAULT FALSE,
    
    CONSTRAINT fk_cart_id FOREIGN KEY (cart_id) REFERENCES cart(id),
    CONSTRAINT fk_giftbox_id FOREIGN KEY (giftbox_id) REFERENCES giftbox(id)
);


use black_gift;
INSERT INTO account (email, password, role) 
VALUES ('admin@gmail.com', '$2a$10$zCfv.lz/8qCpJ0/odbWKj.rpGd34olSbQ2fNpT7KjrDe.Rgx37Rr.', 'admin');