--Bảng lệnh rút gọn
-- Tạo Database
USE master

CREATE DATABASE SWP_Smoking;
GO

USE SWP_Smoking;
GO


-- BẢNG THÀNH TÍCH (ACHIEVEMENT)
CREATE TABLE ACHIEVEMENT (
    achievement_id INT IDENTITY(1,1) PRIMARY KEY,   -- Khóa chính, tự tăng
    name NVARCHAR(100) NOT NULL,                    -- Tên thành tích
    description NVARCHAR(255),                      -- Mô tả
    criteria NVARCHAR(255),                         -- Tiêu chí đạt được
    badge_image VARCHAR(255)                        -- Đường dẫn ảnh huy hiệu
);

-- BẢNG CHUYÊN GIA (SPECIALIST)
CREATE TABLE SPECIALIST (
    specialist_id INT IDENTITY(1,1) PRIMARY KEY,    -- Khóa chính, tự tăng
    name NVARCHAR(100) NOT NULL,                    -- Tên chuyên gia
    qualification NVARCHAR(150),                    -- Bằng cấp, chứng chỉ
    specialty NVARCHAR(100),                        -- Chuyên môn
    contact_info NVARCHAR(150),                     -- Thông tin liên hệ
    availability NVARCHAR(100)                      -- Thời gian làm việc
);

-- BẢNG NGƯỜI DÙNG (USER)
CREATE TABLE [USER] (
    user_id INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính, tự tăng
    user_role VARCHAR(10) NOT NULL,                 -- Vai trò (user, admin, specialist...)
    username VARCHAR(100) NOT NULL UNIQUE,          -- Tên đăng nhập (duy nhất)
    password VARCHAR(255) NOT NULL,                 -- Mật khẩu
    email VARCHAR(150) NOT NULL UNIQUE,             -- Email (duy nhất)
    full_name NVARCHAR(150),                        -- Họ tên đầy đủ
    registration_date DATE NOT NULL DEFAULT (GETDATE()), -- Ngày đăng ký (mặc định ngày hiện tại)
    profile_image VARCHAR(255),                     -- Ảnh đại diện
    is_active BIT NOT NULL DEFAULT (1)              -- Trạng thái hoạt động (1: còn hoạt động)
);

-- BẢNG GÓI THÀNH VIÊN (SUBSCRIPTION_PLAN)
CREATE TABLE SUBSCRIPTION_PLAN (
    plan_id INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính, tự tăng
    plan_name NVARCHAR(100) NOT NULL,               -- Tên gói thành viên
    price FLOAT NOT NULL,                           -- Giá gói
    description NVARCHAR(255),                      -- Mô tả
    duration_days INT NOT NULL,                     -- Thời hạn (ngày)
    features NVARCHAR(255)                          -- Các tính năng
);

-- BẢNG ĐẶT LỊCH HẸN (APPOINTMENT)
CREATE TABLE APPOINTMENT (
    appointment_id INT IDENTITY(1,1) PRIMARY KEY,   -- Khóa chính, tự tăng
    user_id INT NOT NULL,                           -- ID người dùng (FK)
    specialist_id INT NOT NULL,                     -- ID chuyên gia (FK)
    appointment_time DATETIME NOT NULL,             -- Thời gian hẹn
    status NVARCHAR(100),                           -- Trạng thái (đã xác nhận, đã hủy...)
    notes NVARCHAR(255),                            -- Ghi chú
    FOREIGN KEY (user_id) REFERENCES [USER](user_id),
    FOREIGN KEY (specialist_id) REFERENCES SPECIALIST(specialist_id)
);

-- BẢNG BÀI VIẾT BLOG (BLOG_POST)
CREATE TABLE BLOG_POST (
    post_id INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính, tự tăng
    user_id INT NOT NULL,                           -- ID người đăng bài (FK)
    title NVARCHAR(150),                            -- Tiêu đề
    content TEXT,                                   -- Nội dung bài viết
    published_date DATETIME DEFAULT (GETDATE()),    -- Ngày đăng (mặc định hiện tại)
    is_active BIT DEFAULT (1),                      -- Đang hoạt động (1: có, 0: ẩn/xóa)
    tags NVARCHAR(255),                             -- Thẻ (tags)
    FOREIGN KEY (user_id) REFERENCES [USER](user_id)
);

-- BẢNG THEO DÕI HÀNG NGÀY (DAILY_TRACKING)
CREATE TABLE DAILY_TRACKING (
    tracking_id INT IDENTITY(1,1) PRIMARY KEY,      -- Khóa chính, tự tăng
    user_id INT NOT NULL,                           -- ID người dùng (FK)
    record_date DATE NOT NULL,                      -- Ngày ghi nhận
    cigarettes_avoided INT,                         -- Số điếu thuốc tránh được
    money_saved FLOAT,                              -- Tiền tiết kiệm được
    notes NVARCHAR(255),                            -- Ghi chú
    FOREIGN KEY (user_id) REFERENCES [USER](user_id)
);

-- BẢNG PHẢN HỒI (FEEDBACK)
CREATE TABLE FEEDBACK (
    feedback_id INT IDENTITY(1,1) PRIMARY KEY,      -- Khóa chính, tự tăng
    user_id INT NOT NULL,                           -- ID người phản hồi (FK)
    rating INT,                                     -- Đánh giá (số sao)
    comment TEXT,                                   -- Bình luận
    submitted_at DATETIME DEFAULT (GETDATE()),      -- Thời điểm gửi phản hồi
    feedback_type NVARCHAR(100),                    -- Loại phản hồi
    related_id INT,                                 -- ID liên kết (có thể là blog_post, achievement,...)
    related_type NVARCHAR(100),                     -- Kiểu liên kết (blog_post, achievement,...)
    FOREIGN KEY (user_id) REFERENCES [USER](user_id)
);

-- BẢNG THÔNG BÁO (NOTIFICATION)
CREATE TABLE NOTIFICATION (
    notification_id INT IDENTITY(1,1) PRIMARY KEY,  -- Khóa chính, tự tăng
    user_id INT NOT NULL,                           -- ID người nhận (FK)
    message NVARCHAR(255),                          -- Nội dung thông báo
    created_at DATETIME DEFAULT (GETDATE()),        -- Thời điểm tạo
    is_read BIT DEFAULT (0),                        -- Đã đọc hay chưa (0: chưa đọc)
    notification_type NVARCHAR(100),                -- Loại thông báo
    related_id INT,                                 -- ID liên kết (bài viết, thành tích...)
    related_type NVARCHAR(100),                     -- Kiểu liên kết
    FOREIGN KEY (user_id) REFERENCES [USER](user_id)
);

-- BẢNG KẾ HOẠCH CAI THUỐC (QUITTING_PLAN)
CREATE TABLE QUITTING_PLAN (
    plan_id INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính, tự tăng
    user_id INT NOT NULL,                           -- ID người dùng (FK)
    start_date DATE NOT NULL,                       -- Ngày bắt đầu
    target_quit_date DATE,                          -- Ngày dự kiến cai thành công
    reason NVARCHAR(255),                           -- Lý do cai thuốc
    stages NVARCHAR(255),                           -- Các giai đoạn cai
    progress_status NVARCHAR(100),                  -- Trạng thái tiến trình
    FOREIGN KEY (user_id) REFERENCES [USER](user_id)
);

-- BẢNG THÀNH TÍCH ĐÃ ĐẠT (USER_ACHIEVEMENT)
CREATE TABLE USER_ACHIEVEMENT (
    user_achievement_id INT IDENTITY(1,1) PRIMARY KEY, -- Khóa chính, tự tăng
    user_id INT NOT NULL,                              -- ID người dùng (FK)
    achievement_id INT NOT NULL,                       -- ID thành tích (FK)
    earned_date DATE,                                  -- Ngày đạt thành tích
    is_shared BIT DEFAULT (0),                         -- Đã chia sẻ lên cộng đồng chưa
    FOREIGN KEY (user_id) REFERENCES [USER](user_id),
    FOREIGN KEY (achievement_id) REFERENCES ACHIEVEMENT(achievement_id)
);

-- BẢNG THAM GIA GÓI THÀNH VIÊN (USER_SUBSCRIPTION)
CREATE TABLE USER_SUBSCRIPTION (
    subscription_id INT IDENTITY(1,1) PRIMARY KEY,  -- Khóa chính, tự tăng
    user_id INT NOT NULL,                           -- ID người dùng (FK)
    plan_id INT NOT NULL,                           -- ID gói thành viên (FK)
    start_date DATE NOT NULL,                       -- Ngày bắt đầu gói
    end_date DATE,                                  -- Ngày hết hạn gói
    is_active BIT DEFAULT (1),                      -- Đang hoạt động hay không
    payment_status NVARCHAR(50),                    -- Trạng thái thanh toán
    FOREIGN KEY (user_id) REFERENCES [USER](user_id),
    FOREIGN KEY (plan_id) REFERENCES SUBSCRIPTION_PLAN(plan_id)
);
