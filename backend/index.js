const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path'); // Thêm dòng này để sử dụng module path

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Kết nối MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '123456',
    database: 'black_gift',
  });
  
db.connect((err) => {
if (err) {
      console.error('Database connection failed:', err.stack);
      return;
    }
    console.log('Connected to MySQL database.');
});

app.post('/signup', async (req, res) => {
  
    const { email, password, fullname, birthday, phone } = req.body;
    console.log('Received request:', req.body);
    const role = 'user';
    
    try {
      const [results] = await db.promise().query('SELECT * FROM account WHERE email = ?', [email]);
      if (results.length > 0) {
        console.log('Email already registered.');
        return res.status(400).json({ message: 'This email is already registered. Please log in.' });
      }
  
      const [passwordExists] = await db.promise().query('SELECT * FROM account WHERE password = ?', [password]);
      if (passwordExists.length > 0) {
        console.log('Password already exists.');
        return res.status(400).json({ message: 'Password already exists. Please use another.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Password hashed successfully.');
  
      // Lưu thông tin vào bảng account
      await db.promise().query(
        'INSERT INTO account (email, password, role) VALUES (?, ?, ?)',
        [email, hashedPassword, role]
      );
  
      // Lưu thông tin vào bảng user
      await db.promise().query(
        'INSERT INTO user (email, fullname, birthday, phone) VALUES (?, ?, ?, ?)',
        [email, fullname, birthday, phone]
      );

      // Tạo giỏ hàng cho người dùng mới
      db.query('INSERT INTO cart (email) VALUES (?)', [email]);

      console.log('User registered successfully.');
      res.status(201).json({ message: 'Registration successful! Please log in.' });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Failed to register user' });
    }
});

// API: Đăng nhập
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Received request:', req.body);
  
    try {
      const [results] = await db.promise().query('SELECT * FROM account WHERE email = ?', [email]);
      if (results.length === 0) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      const account = results[0];
      const isPasswordValid = await bcrypt.compare(password, account.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      res.status(200).json({ message: 'Login successful!', role: account.role });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Login failed.' });
    }
});

// API: Lấy thông tin người dùng từ bảng user và account
app.get('/user-profile/:email', (req, res) => {
    const { email } = req.params;
    console.log('Received request:', req.params);
    const query = `
      SELECT email, fullname, birthday, phone 
      FROM user
      WHERE email = ?
    `;
  
    db.query(query, [email], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', err });
      if (results.length === 0) return res.status(404).json({ message: 'User not found' });
  
      res.status(200).json(results[0]);
    });
});

  app.post('/change-password', (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    console.log('Received request:', req.body);
    // Tìm người dùng trong cơ sở dữ liệu theo email
    const query = `SELECT password FROM account WHERE email = ?`;
    db.query(query, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', err });
      if (results.length === 0) return res.status(404).json({ message: 'User not found' });
  
      const user = results[0];
  
      // Kiểm tra mật khẩu cũ
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        console.log('Old password is incorrect');
        return res.status(400).json({ message: 'Old password is incorrect' });
      }
      else {
        // Mã hóa mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
        // Cập nhật mật khẩu mới trong cơ sở dữ liệu
        const updateQuery = `UPDATE account SET password = ? WHERE email = ?`;
        db.query(updateQuery, [hashedNewPassword, email], (err, result) => {
          if (err) return res.status(500).json({ message: 'Failed to update password', err });
          res.status(200).json({ message: 'Password updated successfully' });
        });
      }
    });
});

// API: Cập nhật thông tin người dùng
app.post('/update-profile', (req, res) => {
    console.log('Received request:', req.body);
    const { email, fullname, birthday, phone } = req.body;
  
    const query = `
      UPDATE user 
      SET fullname = ?, birthday = ?, phone = ?
      WHERE email = ?
    `;
  
    db.query(query, [fullname, birthday, phone, email], (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to update user profile', err });
      
      res.status(200).json({ message: 'User profile updated successfully' });
    });
});

// API: Lấy thông tin người dùng từ bảng user và account
app.get('/admin/bank-account/:email', (req, res) => {
    const { email } = req.params;
    console.log('Received request:', req.params);
    const query = `
      SELECT email, bank, stk, owner
      FROM admin_bank
      WHERE email = ?
    `;
  
    db.query(query, [email], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', err });
      if (results.length === 0) return res.status(404).json({ message: 'Account not found' });
  
      res.status(200).json(results[0]);
      console.log(results[0]);
    });
});

// API: Cập nhật thông tin tài khoản admin
app.post('/admin/update-bank', (req, res) => {
    console.log('Received request:', req.body);
    const { email, bank, stk, owner } = req.body;
  
    const query = `
      SELECT email, bank, stk, owner
      FROM admin_bank
      WHERE email = ?
    `;
  
    db.query(query, [email], (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to update bank account', err });
      if (result.length === 0) {
        db.query(
            'INSERT INTO admin_bank (email, bank, stk, owner) VALUES (?, ?, ?, ?)',
            [email, bank, stk, owner]
        );
        console.log('Bank account added successfully');
      } else {
        const query = `
            UPDATE admin_bank 
            SET bank = ?, stk = ?, owner = ?
            WHERE email = ?
        `;
        db.query(query, [bank, stk, owner, email]);
      }
      res.status(200).json({ message:  'Bank account updated successfully' });
    });
});

// API: Lấy danh sách products
app.get('/admin/giftbox', (req, res) => {
    db.query('SELECT * FROM giftbox WHERE status IN ("Còn hàng", "Đã mua")', (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.status(200).json(results);
    });
});

// API: Lấy danh sách products
app.get('/shop/giftbox/:email', (req, res) => {
  const { email } = req.params;
  const query = `
    SELECT g.*
    FROM giftbox g
    WHERE g.status = "Còn hàng"
    AND g.id NOT IN (
      SELECT ci.giftbox_id
      FROM cart_items ci
      JOIN cart c ON ci.cart_id = c.id
      WHERE c.email = ?
    )
  `;
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json(results);
  });
});

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Thư mục để lưu trữ file
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file
    }
  });

const upload = multer({ storage });

// Cấu hình để phục vụ tệp tĩnh từ thư mục 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Api tạo một chiến dịch mới
app.post('/new-giftbox', upload.fields([{ name: 'image' }]), async (req, res) => {
    console.log('Received request:', req.body);
    const { name, description, price, product, image, real_value } = req.body;
    const imagePath = req.files.image ? `/uploads/${req.files.image[0].filename}` : null;
    // Lưu vào MySQL
    const status = "Còn hàng";
    
    const query = `
      INSERT INTO giftbox 
      (name, description, price, product, image, real_value, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.execute(query, [name, description, price, product, imagePath, real_value, status], (err, result) => {
      if (err) {
        console.error("Error inserting data: ", err);
        return res.status(500).json({ success: false, message: "Failed to save gift box." });
      }
      res.json({ success: true, message: "Gift box saved successfully." });
    });
});

// API: Cập nhật thông tin chiến dịch
app.post('/edit-giftbox/:id', upload.fields([{ name: 'image' }]), (req, res) => {
    console.log('Received request:', req.body, req.params);
    const id = req.params.id;
    const { name, description, price, product, image, real_value } = req.body;
    if (image != "") {
      const imagePath = req.files.image ? `/uploads/${req.files.image[0].filename}` : null;
      const query = `
        UPDATE giftbox 
        SET name = ?, description = ?, price = ?, product = ?, image = ?, real_value = ?
        WHERE id = ?
      `;
    
      db.query(query, [name, description, price, product, imagePath, real_value, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to update gift box', err });
        
        res.status(200).json({ message: 'Gift box updated successfully' });
      });
    } else {
      const query = `
        UPDATE giftbox 
        SET name = ?, description = ?, price = ?, product = ?, real_value = ?
        WHERE id = ?
      `;
    
      db.query(query, [name, description, price, product, real_value, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to update gift box', err });
        
        res.status(200).json({ message: 'Gift box updated successfully' });
      });
    }
});

app.delete('/delete-giftbox/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM giftbox WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Giftbox not found' });
        }
        res.status(200).json({ message: 'Giftbox deleted successfully' });
    });
});

// API: Lấy thông tin người dùng từ bảng user và account
app.get('/box-detail/:id', (req, res) => {
  const { id } = req.params;
  console.log('Received request:', req.params);
  const query = `
    SELECT * 
    FROM giftbox
    WHERE id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', err });
    if (results.length === 0) return res.status(404).json({ message: 'Gift box not found' });

    res.status(200).json(results[0]);
  });
});

app.post('/add-to-cart', (req, res) => {
  const { email, giftboxId } = req.body;

  const query = 'SELECT * FROM cart WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', err);
      res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.' });
    }
      
    if (results.length === 0) return res.json({ success: false, message: 'Giỏ hàng không tồn tại.' });

    const cartID = results[0].id;
    console.log('Cart ID:', cartID);
    db.query('INSERT INTO cart_items (cart_id, giftbox_id) VALUES (?, ?)', [cartID, giftboxId]);
  });
});

app.get('/cart-items/:email', (req, res) => {
  const { email } = req.params;
  if (!email) {
      return res.status(400).json({ message: 'Email is required' });
  }
  db.query('SELECT * FROM cart WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) {
      // Tạo giỏ hàng cho người dùng mới
      db.query('INSERT INTO cart (email) VALUES (?)', [email]);
    }
    const cartID = results[0].id;
    const query = `SELECT cart_items.id, giftbox.name, giftbox.price, giftbox.image FROM cart_items
                JOIN cart ON cart_items.cart_id = cart.id  
                JOIN giftbox ON cart_items.giftbox_id = giftbox.id 
                WHERE cart.email = ?`;

    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Lỗi khi lấy giỏ hàng:', err);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy giỏ hàng.' });
      }    
      //if (results.length === 0) return res.json({ cartItems: [], totalAmount: 0 });  
      const totalAmount = results.reduce((sum, item) => sum + parseFloat(item.price), 0);
      db.query('UPDATE cart SET total_amount = ? WHERE id = ?', [totalAmount, cartID]);
      res.json({ cartItems: results, totalAmount });

    });
  });

});

app.delete('/delete-cart-items/:id', (req, res) => {
  const itemId = req.params.id;
  console.log(req.params.id);
  db.query('Select cart_id FROM cart_items WHERE id = ?', [itemId], (err, results) => {
    const cartID = results[0].cart_id;
    // Xóa sản phẩm khỏi `cart_items`
    db.query('DELETE FROM cart_items WHERE id = ?', [itemId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Sản phẩm không được xóa khỏi giỏ hàng.' });
      }
      res.status(200).json({ message: 'Sản phẩm đã được xóa khỏi giỏ hàng.' });
      // Tính tổng số tiền từ các giftbox trong giỏ hàng
      const totalAmountQuery = `
        SELECT SUM(g.price) AS total_amount
        FROM cart_items ci
        JOIN giftbox g ON ci.giftbox_id = g.id
        WHERE ci.cart_id = ?
      `;

      db.query(totalAmountQuery, [cartID], (err, totalResult) => {
        const totalAmount = totalResult[0].total_amount || 0;
        // Cập nhật total_amount của giỏ hàng
        db.query('UPDATE cart SET total_amount = ? WHERE id = ?', [totalAmount, cartID]);
      });
    });
  });
});

app.get('/user-balance/:email', (req, res) => {
  const { email } = req.params;
  console.log('Received request:', req.params);
  const query = `
    SELECT balance 
    FROM user
    WHERE email = ?
  `;

  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(results[0]);
    console.log(results[0]);
  });
});

app.post('/nap-tien', async (req, res) => {
  console.log('Received request:', req.body);
  const { email, in_code, payment, content } = req.body;
  
  // Lưu vào MySQL
  const status = "Đang xử lý";
  const date = new Date().toISOString().slice(0, 10); // yyyy-mm-dd định dạng
  const query1 = `
    INSERT INTO money_in
    (in_code, payment, content, date, status, email)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.execute(query1, [in_code, payment, content, date, status, email], (err, result) => {
    if (err) {
      console.error("Error inserting data: ", err);
      //return res.status(500).json({ success: false, message: "Failed to save transaction." });
    }
    res.status(200).json({ message: 'Nạp tiền thành công.' });
  });
});

app.post('/rut-tien', async (req, res) => {
  console.log('Received request:', req.body);
  const { email, bank, acc_number, owner, payment } = req.body;
  
  // Lưu vào MySQL
  const status = "Đang xử lý";
  const date = new Date().toISOString().slice(0, 10); // yyyy-mm-dd định dạng
  const query1 = `
    INSERT INTO money_out
    (bank, acc_number, owner, payment, date, status, email)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.execute(query1, [bank, acc_number, owner, payment, date, status, email], (err, result) => {
    if (err) {
      console.error("Error inserting data: ", err);
      //return res.status(500).json({ success: false, message: "Failed to save transaction." });
    }
    res.status(200).json({ message: 'Gửi yêu cầu rút tiền thành công.' });
  });
});

app.get('/ls-nap-tien/:email', (req, res) => {
  const { email } = req.params;
  console.log('Received request:', req.params);
  const query = `
    SELECT *
    FROM money_in
    WHERE email = ?
  `;

  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json(results);
  });
});

app.get('/ls-rut-tien/:email', (req, res) => {
  const { email } = req.params;
  console.log('Received request:', req.params);
  const query = `
    SELECT *
    FROM money_out
    WHERE email = ?
  `;

  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json(results);
  });
});

app.get('/admin/nap-tien', (req, res) => {
  const query = `
    SELECT mi.*, u.fullname
    FROM money_in mi 
    JOIN user u ON mi.email = u.email;
  `;

  db.execute(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json(results);
  });
});

app.post('/admin/update-nap-tien/:code', (req, res) => {
  console.log('Received request:', req.body, req.params);
  const code = req.params.code;
  const { status } = req.body;

  const query = `
    UPDATE money_in 
    SET status = ? 
    WHERE in_code = ?
  `;
  db.query(query, [status, code], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update transaction', err });
    
    res.status(200).json({ message: 'Transaction updated successfully' });
  });
  const balance_query = `
    UPDATE user u
    SET u.balance = (
        COALESCE((
            SELECT SUM(payment)
            FROM money_in mi
            WHERE mi.email = u.email AND mi.status = 'Thành công'
        ), 0)
        -
        COALESCE((
            SELECT SUM(payment)
            FROM money_out mo
            WHERE mo.email = u.email AND mo.status = 'Thành công'
        ), 0)
        -
        COALESCE((
            SELECT SUM(price)
            FROM giftbox g
            WHERE g.email = u.email AND g.status in ('Đã mua', 'Đã mở', 'Nhận vật phẩm', 'Nhận tiền') 
        ), 0)
        +
        COALESCE((
            SELECT SUM(real_value)
            FROM giftbox g
            WHERE g.email = u.email AND g.status = 'Nhận tiền'
        ), 0)
    )
  `;
  db.execute(balance_query);
});

app.get('/admin/rut-tien', (req, res) => {
  const query = `
    SELECT mo.*, u.fullname
    FROM money_out mo 
    JOIN user u ON mo.email = u.email;
  `;

  db.execute(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json(results);
  });
});

app.post('/admin/update-rut-tien/:id', (req, res) => {
  console.log('Received request:', req.body, req.params);
  const id = req.params.id;
  const { status } = req.body;

  const query = `
    UPDATE money_out 
    SET status = ? 
    WHERE id = ?
  `;
  db.query(query, [status, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update transaction', err });
    
    res.status(200).json({ message: 'Transaction updated successfully' });
  });
  const balance_query = `
    UPDATE user u
    SET u.balance = (
        COALESCE((
            SELECT SUM(payment)
            FROM money_in mi
            WHERE mi.email = u.email AND mi.status = 'Thành công'
        ), 0)
        -
        COALESCE((
            SELECT SUM(payment)
            FROM money_out mo
            WHERE mo.email = u.email AND mo.status = 'Thành công'
        ), 0)
        -
        COALESCE((
            SELECT SUM(price)
            FROM giftbox g
            WHERE g.email = u.email AND g.status in ('Đã mua', 'Đã mở', 'Nhận vật phẩm', 'Nhận tiền') 
        ), 0)
        +
        COALESCE((
            SELECT SUM(real_value)
            FROM giftbox g
            WHERE g.email = u.email AND g.status = 'Nhận tiền'
        ), 0)
    )
  `;
  db.execute(balance_query);
});

// API: Lấy danh sách người dùng
app.get('/admin/user', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json(results);
  });
});

app.post('/order', (req, res) => {
  const { email } = req.body;

  // Kiểm tra giỏ hàng của người dùng
  db.query('SELECT id, total_amount FROM cart WHERE email = ?', [email], (err, cartResult) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      if (cartResult.length === 0) {
          return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
      }

      const cartId = cartResult[0].id;
      const totalAmount = cartResult[0].total_amount;

      // Kiểm tra số dư tài khoản người dùng
      db.query('SELECT balance FROM user WHERE email = ?', [email], (err, userResult) => {
          if (err) return res.status(500).json({ message: 'Database error' });

          if (userResult.length === 0) {
              return res.status(404).json({ message: 'Người dùng không tồn tại' });
          }

          const userBalance = userResult[0].balance;

          if (userBalance < totalAmount) {
              return res.status(400).json({ message: 'Số dư không đủ để mua hàng' });
          }

          // Trừ số tiền mua hàng từ số dư tài khoản
          db.query('UPDATE user SET balance = balance - ? WHERE email = ?', [totalAmount, email], (err) => {
              if (err) return res.status(500).json({ message: 'Database error' });
              const NgayMua = new Date().toISOString().slice(0, 10);
              // Cập nhật trạng thái các sản phẩm trong giỏ hàng thành 'Đã mua'
              db.query(
                  `UPDATE giftbox 
                   SET status = 'Đã mua', NgayMua = ? , email = ?
                   WHERE id IN (SELECT giftbox_id FROM cart_items WHERE cart_id = ?)`,
                  [NgayMua, email, cartId],
                  (err) => {
                      if (err) return res.status(500).json({ message: 'Database error' });

                      // Xóa các mục đã mua khỏi bảng cart_items và cập nhật giỏ hàng
                      db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId], (err) => {
                          if (err) return res.status(500).json({ message: 'Database error' });

                          db.query('UPDATE cart SET total_amount = 0 WHERE id = ?', [cartId], (err) => {
                              if (err) return res.status(500).json({ message: 'Database error' });

                              res.status(200).json({ message: 'Mua hàng thành công' });
                          });
                      });
                  }
              );
          });
      });
  });
});

// API: Lấy danh sách products
app.get('/box-order/:email', (req, res) => {
  const email = req.params.email;
  db.query('SELECT * FROM giftbox WHERE status = "Đã mua" and email = ?',[email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json(results);
  });
});

// API: Lấy danh sách products
app.get('/box-open/:email', (req, res) => {
  const email = req.params.email;
  db.query('SELECT * FROM giftbox WHERE status IN ("Đã mở", "Nhận vật phẩm", "Nhận tiền") and email = ?',[email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json(results);
  });
});

app.post('/open-gift/:id', (req, res) => {
  const id = req.params.id;
  const NgayMo = new Date().toISOString().slice(0, 10);
  const query = `
    UPDATE giftbox
    SET status = 'Đã mở', NgayMo = ?
    WHERE id = ?;
  `;

  db.execute(query, [NgayMo, id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json({ message: 'Giftbox opened successfully' });
    console.log('Giftbox opened successfully');
  });
});

app.post('/received-gift/:id', (req, res) => {
  console.log('Received request:', req.body, req.params);
  const id = req.params.id;
  const { status } = req.body;

  const query = `
    UPDATE giftbox 
    SET status = ? 
    WHERE id = ?
  `;
  db.query(query, [status, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update giftbox', err });
    
    res.status(200).json({ message: 'Giftbox updated successfully' });
  });
  const balance_query = `
    UPDATE user u
    SET u.balance = (
        COALESCE((
            SELECT SUM(payment)
            FROM money_in mi
            WHERE mi.email = u.email AND mi.status = 'Thành công'
        ), 0)
        -
        COALESCE((
            SELECT SUM(payment)
            FROM money_out mo
            WHERE mo.email = u.email AND mo.status = 'Thành công'
        ), 0)
        -
        COALESCE((
            SELECT SUM(price)
            FROM giftbox g
            WHERE g.email = u.email AND g.status in ('Đã mua', 'Đã mở', 'Nhận vật phẩm', 'Nhận tiền') 
        ), 0)
        +
        COALESCE((
            SELECT SUM(real_value)
            FROM giftbox g
            WHERE g.email = u.email AND g.status = 'Nhận tiền'
        ), 0)
    )
  `;
  db.execute(balance_query);
});

// API: Lấy danh sách products
app.get('/admin/box-order', (req, res) => {
  const email = req.params.email;
  const query = `
    SELECT g.*, u.fullname
    FROM giftbox g
    JOIN user u ON g.email = u.email
    WHERE status IN ("Đã mua", "Đã mở", "Nhận vật phẩm", "Nhận tiền") 
  `;
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json(results);
  });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });