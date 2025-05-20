--Bảng lệnh rút gọn
-- Tạo Database
CREATE DATABASE SWP_Smoking;
GO

USE SWP_Smoking;
GO

-- 1. Bảng USER (Người dùng)
CREATE TABLE [dbo].[USER](
    [user_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_role] VARCHAR(10) NOT NULL, -- Vai trò: user, admin, specialist...
    [username] VARCHAR(100) NOT NULL UNIQUE,
    [password] VARCHAR(255) NOT NULL,
    [email] VARCHAR(150) NOT NULL UNIQUE,
    [full_name] NVARCHAR(150),
    [registration_date] DATE NOT NULL DEFAULT GETDATE(),
    [profile_image] VARCHAR(255),
    [is_active] BIT NOT NULL DEFAULT 1
);

-- 2. Bảng SPECIALIST (Chuyên gia)
CREATE TABLE [dbo].[SPECIALIST](
    [specialist_id] INT IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(100) NOT NULL,
    [qualification] NVARCHAR(150),
    [specialty] NVARCHAR(100),
    [contact_info] NVARCHAR(150),
    [availability] NVARCHAR(100)
);

-- 3. Bảng ACHIEVEMENT (Thành tích)
CREATE TABLE [dbo].[ACHIEVEMENT](
    [achievement_id] INT IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(255),
    [criteria] NVARCHAR(255),
    [badge_image] VARCHAR(255)
);

-- 4. Bảng SUBSCRIPTION_PLAN (Gói thành viên)
CREATE TABLE [dbo].[SUBSCRIPTION_PLAN](
    [plan_id] INT IDENTITY(1,1) PRIMARY KEY,
    [plan_name] NVARCHAR(100) NOT NULL,
    [price] FLOAT NOT NULL,
    [description] NVARCHAR(255),
    [duration_days] INT NOT NULL,
    [features] NVARCHAR(255)
);

-- 5. Bảng USER_SUBSCRIPTION (Người dùng đăng ký gói)
CREATE TABLE [dbo].[USER_SUBSCRIPTION](
    [subscription_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [plan_id] INT NOT NULL,
    [start_date] DATE NOT NULL,
    [end_date] DATE,
    [is_active] BIT DEFAULT 1,
    [payment_status] NVARCHAR(50),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id]),
    FOREIGN KEY ([plan_id]) REFERENCES [dbo].[SUBSCRIPTION_PLAN]([plan_id])
);

-- 6. Bảng USER_ACHIEVEMENT (Người dùng đạt thành tích)
CREATE TABLE [dbo].[USER_ACHIEVEMENT](
    [user_achievement_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [achievement_id] INT NOT NULL,
    [earned_date] DATE,
    [is_shared] BIT DEFAULT 0,
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id]),
    FOREIGN KEY ([achievement_id]) REFERENCES [dbo].[ACHIEVEMENT]([achievement_id])
);

-- 7. Bảng APPOINTMENT (Lịch hẹn chuyên gia)
CREATE TABLE [dbo].[APPOINTMENT](
    [appointment_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [specialist_id] INT NOT NULL,
    [appointment_time] DATETIME NOT NULL,
    [status] NVARCHAR(100),
    [notes] NVARCHAR(255),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id]),
    FOREIGN KEY ([specialist_id]) REFERENCES [dbo].[SPECIALIST]([specialist_id])
);

-- 8. Bảng BLOG_POST (Bài viết Blog)
CREATE TABLE [dbo].[BLOG_POST](
    [post_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [title] NVARCHAR(150),
    [content] TEXT,
    [published_date] DATETIME DEFAULT GETDATE(),
    [is_active] BIT DEFAULT 1,
    [tags] NVARCHAR(255),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id])
);

-- 9. Bảng DAILY_TRACKING (Theo dõi hàng ngày)
CREATE TABLE [dbo].[DAILY_TRACKING](
    [tracking_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [record_date] DATE NOT NULL,
    [cigarettes_avoided] INT,
    [money_saved] FLOAT,
    [notes] NVARCHAR(255),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id])
);

-- 10. Bảng FEEDBACK (Phản hồi)
CREATE TABLE [dbo].[FEEDBACK](
    [feedback_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [rating] INT,
    [comment] TEXT,
    [submitted_at] DATETIME DEFAULT GETDATE(),
    [feedback_type] NVARCHAR(100),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id])
);

-- 11. Bảng NOTIFICATION (Thông báo)
CREATE TABLE [dbo].[NOTIFICATION](
    [notification_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [message] NVARCHAR(255),
    [created_at] DATETIME DEFAULT GETDATE(),
    [is_read] BIT DEFAULT 0,
    [notification_type] NVARCHAR(100),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id])
);

-- 12. Bảng QUITTING_PLAN (Kế hoạch cai thuốc)
CREATE TABLE [dbo].[QUITTING_PLAN](
    [plan_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [start_date] DATE NOT NULL,
    [target_quit_date] DATE,
    [reason] NVARCHAR(255),
    [stages] NVARCHAR(255),
    [progress_status] NVARCHAR(100),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[USER]([user_id])
);
