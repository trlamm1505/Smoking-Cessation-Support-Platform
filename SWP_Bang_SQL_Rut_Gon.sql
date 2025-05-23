-- Tạo Database mới
CREATE DATABASE SWP_Smoking;
GO

USE SWP_Smoking;
GO

------------------------------
-- 1. Bảng USER: Quản lý người dùng, phân quyền qua user_role
------------------------------
CREATE TABLE [dbo].[USER](
    [user_id] INT IDENTITY(1,1) PRIMARY KEY,          -- Khóa chính
    [user_role] NVARCHAR(10) NULL,                    -- Phân quyền: 'user', 'admin', 'specialist'
    [username] VARCHAR(100) NOT NULL,                 -- Tên đăng nhập (unique)
    [password] NVARCHAR(255) NULL,                    -- Mật khẩu
    [email] VARCHAR(150) NOT NULL,                    -- Email (unique)
    [full_name] NVARCHAR(150) NULL,                   -- Họ tên
    [registration_date] DATE NOT NULL DEFAULT GETDATE(), -- Ngày đăng ký
    [profile_image] NVARCHAR(255) NULL,               -- Ảnh đại diện
    [is_active] BIT NOT NULL DEFAULT 1                -- Trạng thái hoạt động
);
-- Đảm bảo duy nhất username, email
ALTER TABLE [dbo].[USER] ADD CONSTRAINT UQ_USER_EMAIL UNIQUE ([email]);
ALTER TABLE [dbo].[USER] ADD CONSTRAINT UQ_USER_USERNAME UNIQUE ([username]);

------------------------------
-- 2. Bảng ACHIEVEMENT: Thành tích, tiêu chí do admin tạo/duyệt
------------------------------
CREATE TABLE [dbo].[ACHIEVEMENT](
    [achievement_id] INT IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(255) NULL,
    [criteria] NVARCHAR(255) NULL,             -- Tiêu chí đạt thành tích (Admin chỉnh sửa)
    [badge_image] NVARCHAR(255) NULL
);

------------------------------
-- 3. Bảng USER_ACHIEVEMENT: Thành tích người dùng đạt được
------------------------------
CREATE TABLE [dbo].[USER_ACHIEVEMENT](
    [user_achievement_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [achievement_id] INT NOT NULL,
    [earned_date] DATE NULL,
    [is_shared] BIT DEFAULT 0
);

------------------------------
-- 4. Bảng SUBSCRIPTION_PLAN: Các gói thành viên, do admin quản lý
------------------------------
CREATE TABLE [dbo].[SUBSCRIPTION_PLAN](
    [plan_id] INT IDENTITY(1,1) PRIMARY KEY,
    [plan_name] NVARCHAR(100) NOT NULL,
    [price] FLOAT NOT NULL,
    [description] NVARCHAR(255) NULL,
    [duration_days] INT NOT NULL,
    [features] NVARCHAR(255) NULL
);

------------------------------
-- 5. Bảng USER_SUBSCRIPTION: Đăng ký gói của người dùng
------------------------------
CREATE TABLE [dbo].[USER_SUBSCRIPTION](
    [subscription_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [plan_id] INT NOT NULL,
    [start_date] DATE NOT NULL,
    [end_date] DATE NULL,
    [is_active] BIT DEFAULT 1,
    [payment_status] NVARCHAR(50) NULL
);

------------------------------
-- 6. Bảng BLOG_POST: Bài viết, duyệt trạng thái bởi admin
------------------------------
CREATE TABLE [dbo].[BLOG_POST](
    [post_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,                       -- Người tạo bài
    [title] NVARCHAR(150) NULL,
    [content] TEXT NULL,
    [published_date] DATETIME DEFAULT GETDATE(),
    [is_active] BIT DEFAULT 1,
    [tags] NVARCHAR(255) NULL,
    [status] NVARCHAR(50) DEFAULT 'pending',      -- Trạng thái: pending/approved/rejected
    [approver_id] INT NULL                       -- Người duyệt bài (admin user_id)
);

------------------------------
-- 7. Bảng FEEDBACK: Phản hồi, duyệt trạng thái bởi admin
------------------------------
CREATE TABLE [dbo].[FEEDBACK](
    [feedback_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [rating] INT NULL,
    [comment] NVARCHAR(MAX) NULL,
    [submitted_at] DATETIME DEFAULT GETDATE(),
    [feedback_type] NVARCHAR(100) NULL,
    [related_id] INT NULL,
    [related_type] NVARCHAR(100) NULL,
    [status] NVARCHAR(50) DEFAULT 'pending',      -- Trạng thái: pending/approved/rejected
    [approver_id] INT NULL                       -- Người duyệt (admin user_id)
);

------------------------------
-- 8. Bảng NOTIFICATION: Thông báo hệ thống
------------------------------
CREATE TABLE [dbo].[NOTIFICATION](
    [notification_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [message] NVARCHAR(255) NULL,
    [created_at] DATETIME DEFAULT GETDATE(),
    [is_read] BIT DEFAULT 0,
    [notification_type] NVARCHAR(100) NULL,
    [related_id] INT NULL,
    [related_type] NVARCHAR(100) NULL
);

------------------------------
-- 9. Bảng DAILY_TRACKING: Theo dõi tiến trình cai thuốc của user
------------------------------
CREATE TABLE [dbo].[DAILY_TRACKING](
    [tracking_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [record_date] DATE NOT NULL,
    [cigarettes_avoided] INT NULL,
    [money_saved] FLOAT NULL,
    [notes] NVARCHAR(255) NULL
);

------------------------------
-- 10. Bảng QUITTING_PLAN: Kế hoạch cai thuốc của user
------------------------------
CREATE TABLE [dbo].[QUITTING_PLAN](
    [plan_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [start_date] DATE NOT NULL,
    [target_quit_date] DATE NULL,
    [reason] NVARCHAR(255) NULL,
    [stages] NVARCHAR(255) NULL,
    [progress_status] NVARCHAR(100) NULL
);

------------------------------
-- 11. Bảng APPOINTMENT: Lịch hẹn với chuyên gia
------------------------------
CREATE TABLE [dbo].[APPOINTMENT](
    [appointment_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [specialist_id] INT NOT NULL,
    [appointment_time] DATETIME NOT NULL,
    [status] NVARCHAR(100) NULL,
    [notes] NVARCHAR(255) NULL
);

------------------------------
-- 12. Bảng SPECIALIST: Chuyên gia hỗ trợ
------------------------------
CREATE TABLE [dbo].[SPECIALIST](
    [specialist_id] INT IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(100) NOT NULL,
    [qualification] NVARCHAR(150) NULL,
    [specialty] NVARCHAR(100) NULL,
    [contact_info] NVARCHAR(150) NULL,
    [availability] NVARCHAR(100) NULL
);

------------------------------
-- Thiết lập khóa ngoại (FOREIGN KEY)
------------------------------

ALTER TABLE [dbo].[BLOG_POST] ADD CONSTRAINT FK_BLOGPOST_USER FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id]);
ALTER TABLE [dbo].[BLOG_POST] ADD CONSTRAINT FK_BLOGPOST_APPROVER FOREIGN KEY ([approver_id]) REFERENCES [dbo].[USER]([user_id]);
ALTER TABLE [dbo].[FEEDBACK] ADD CONSTRAINT FK_FEEDBACK_USER FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id]);
ALTER TABLE [dbo].[FEEDBACK] ADD CONSTRAINT FK_FEEDBACK_APPROVER FOREIGN KEY ([approver_id]) REFERENCES [dbo].[USER]([user_id]);
ALTER TABLE [dbo].[NOTIFICATION] ADD CONSTRAINT FK_NOTIFICATION_USER FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id]);
ALTER TABLE [dbo].[DAILY_TRACKING] ADD CONSTRAINT FK_DAILYTRACKING_USER FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id]);
ALTER TABLE [dbo].[QUITTING_PLAN] ADD CONSTRAINT FK_QUITTINGPLAN_USER FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id]);
ALTER TABLE [dbo].[APPOINTMENT] ADD CONSTRAINT FK_APPOINTMENT_USER FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id]);
ALTER TABLE [dbo].[APPOINTMENT] ADD CONSTRAINT FK_APPOINTMENT_SPECIALIST FOREIGN KEY ([specialist_id]) REFERENCES [dbo].[SPECIALIST]([specialist_id]);
ALTER TABLE [dbo].[USER_ACHIEVEMENT] ADD CONSTRAINT FK_USERACHIEVEMENT_USER FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id]);
ALTER TABLE [dbo].[USER_ACHIEVEMENT] ADD CONSTRAINT FK_USERACHIEVEMENT_ACHIEVEMENT FOREIGN KEY ([achievement_id]) REFERENCES [dbo].[ACHIEVEMENT]([achievement_id]);
ALTER TABLE [dbo].[USER_SUBSCRIPTION] ADD CONSTRAINT FK_USERSUBSCRIPTION_USER FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id]);
ALTER TABLE [dbo].[USER_SUBSCRIPTION] ADD CONSTRAINT FK_USERSUBSCRIPTION_PLAN FOREIGN KEY ([plan_id]) REFERENCES [dbo].[SUBSCRIPTION_PLAN]([plan_id]);

------------------------------
-- Các giá trị mặc định đã cài trực tiếp trong tạo bảng
------------------------------

------------------------------
-- HẾT: Database đã đầy đủ cho chức năng admin
------------------------------
