
-- Database: smoking
bảng mới
CREATE TABLE cessation_plan_detail (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    activity1 VARCHAR(255),
    activity2 VARCHAR(255),
    activity3 VARCHAR(255),
    activity4 VARCHAR(255),
    activity5 VARCHAR(255),
    day INT NOT NULL,
    goal VARCHAR(255),
    planid BIGINT NOT NULL
);

CREATE TABLE cessation_plans (
    planid BIGINT IDENTITY(1,1) PRIMARY KEY,
    cigarettes_per_day INT,
    cost_per_pack NUMERIC(38,2),
    custom_details VARCHAR(255),
    is_active BIT NOT NULL,
    notes VARCHAR(255),
    reason_to_quit VARCHAR(255),
    smoking_frequency VARCHAR(255),
    start_date DATE,
    target_quit_date DATE,
    userid BIGINT NOT NULL
);

CREATE TABLE coaches (
    coachid BIGINT IDENTITY(1,1) PRIMARY KEY,
    availability NVARCHAR(255),
    bio NVARCHAR(255),
    full_name NVARCHAR(255) NOT NULL,
    is_active BIT NOT NULL,
    profile_pictureurl VARCHAR(255),
    specialization NVARCHAR(255),
    userid BIGINT,
    address NVARCHAR(255),
    degree NVARCHAR(255),
    experience NVARCHAR(255),
    gender VARCHAR(10),
    phone_number VARCHAR(20),
    rating FLOAT
);

CREATE TABLE consultations (
    consultation_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    coach_id BIGINT,
    meeting_link VARCHAR(255),
    notes NVARCHAR(255),
    scheduled_time DATETIME2(6),
    status VARCHAR(255),
    user_id BIGINT
);

CREATE TABLE membership_packages (
    packageid BIGINT IDENTITY(1,1) PRIMARY KEY,
    description NVARCHAR(255) NOT NULL,
    duration_days INT NOT NULL,
    is_active BIT NOT NULL,
    package_name NVARCHAR(255) NOT NULL UNIQUE,
    price FLOAT NOT NULL
);

CREATE TABLE payments (
    paymentid BIGINT IDENTITY(1,1) PRIMARY KEY,
    amount FLOAT,
    payment_date DATETIME2(6),
    payment_method VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    transactionid VARCHAR(255),
    packageid BIGINT NOT NULL,
    userid BIGINT NOT NULL
);

CREATE TABLE plan_stages (
    stageid BIGINT IDENTITY(1,1) PRIMARY KEY,
    description VARCHAR(255),
    sequence_order INT,
    stage_name VARCHAR(255),
    target_duration_days INT,
    planid BIGINT NOT NULL
);

CREATE TABLE smoking_status_logs (
    log_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    cigarettes_per_day INT,
    cost_per_pack NUMERIC(38,2),
    log_date DATE,
    notes VARCHAR(255),
    smoking_frequency VARCHAR(255),
    userid BIGINT
);

CREATE TABLE token (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    expiry_date DATETIME2(6) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(255) NOT NULL,
    user_info TEXT NOT NULL
);

CREATE TABLE users (
    userid BIGINT IDENTITY(1,1) PRIMARY KEY,
    address NVARCHAR(255),
    age INT,
    coachid BIGINT,
    current_membership_packageid INT,
    email VARCHAR(255) NOT NULL UNIQUE,
    enabled BIT NOT NULL,
    full_name NVARCHAR(255),
    hometown NVARCHAR(255),
    last_login_date DATETIME2(6),
    occupation NVARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    profile_pictureurl VARCHAR(255),
    registration_date DATETIME2(6) NOT NULL,
    role VARCHAR(255) NOT NULL,
    subscription_end_date DATE,
    username NVARCHAR(255) NOT NULL UNIQUE,
    gender NVARCHAR(20)
);

-- Foreign Keys
ALTER TABLE cessation_plan_detail ADD CONSTRAINT FK_cessation_plan_detail_planid FOREIGN KEY (planid) REFERENCES cessation_plans(planid);
ALTER TABLE cessation_plans ADD CONSTRAINT FK_cessation_plans_userid FOREIGN KEY (userid) REFERENCES users(userid);
ALTER TABLE coaches ADD CONSTRAINT FK_coaches_userid FOREIGN KEY (userid) REFERENCES users(userid);
ALTER TABLE payments ADD CONSTRAINT FK_payments_userid FOREIGN KEY (userid) REFERENCES users(userid);
ALTER TABLE payments ADD CONSTRAINT FK_payments_packageid FOREIGN KEY (packageid) REFERENCES membership_packages(packageid);
ALTER TABLE plan_stages ADD CONSTRAINT FK_plan_stages_planid FOREIGN KEY (planid) REFERENCES cessation_plans(planid);
ALTER TABLE smoking_status_logs ADD CONSTRAINT FK_smoking_status_logs_userid FOREIGN KEY (userid) REFERENCES users(userid);
ALTER TABLE users ADD CONSTRAINT FK_users_coachid FOREIGN KEY (coachid) REFERENCES coaches(coachid);















Create database Smoking
use Smoking 
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    FullName NVARCHAR(255),
    RegistrationDate DATETIME NOT NULL DEFAULT GETDATE(),
    LastLoginDate DATETIME,
    ProfilePictureURL NVARCHAR(255),
    CurrentMembershipPackageID INT,
    SubscriptionEndDate DATE,
    CoachID INT,
    Role NVARCHAR(255) NOT NULL DEFAULT 'member'
);

-- Tạo bảng MembershipPackages
CREATE TABLE MembershipPackages (
    PackageID INT PRIMARY KEY IDENTITY(1,1),
    PackageName NVARCHAR(255) UNIQUE NOT NULL,
    Price DECIMAL(10,2) NOT NULL DEFAULT 0,
    DurationDays INT NOT NULL,
    Description NVARCHAR(MAX),
    IsActive BIT NOT NULL DEFAULT 1
);

-- Tạo bảng Payments
CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    PackageID INT NOT NULL,
    PaymentDate DATETIME NOT NULL DEFAULT GETDATE(),
    Amount DECIMAL(10,2) NOT NULL,
    PaymentMethod NVARCHAR(255),
    TransactionID NVARCHAR(255) UNIQUE,
    Status NVARCHAR(255) NOT NULL DEFAULT 'pending'
);

-- Tạo bảng SmokingStatusLogs
CREATE TABLE SmokingStatusLogs (
    LogID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    LogDate DATE NOT NULL DEFAULT GETDATE(),
    CigarettesPerDay INT,
    SmokingFrequency NVARCHAR(255),
    CostPerPack DECIMAL(10,2),
    Notes NVARCHAR(MAX)
);

-- Tạo bảng CessationPlans
CREATE TABLE CessationPlans (
    PlanID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    ReasonToQuit NVARCHAR(MAX),
    StartDate DATE NOT NULL,
    TargetQuitDate DATE,
    CigarettesPerDay INT,
    SmokingFrequency NVARCHAR(255),
    CostPerPack DECIMAL(10,2),
    Notes NVARCHAR(MAX),
    CustomDetails NVARCHAR(MAX),
    IsActive BIT NOT NULL DEFAULT 1
);

-- Tạo bảng PlanStages
CREATE TABLE PlanStages (
    StageID INT PRIMARY KEY IDENTITY(1,1),
    PlanID INT NOT NULL,
    StageName NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    TargetDurationDays INT,
    SequenceOrder INT NOT NULL DEFAULT 0
);

-- Tạo bảng DailyProgress
CREATE TABLE DailyProgress (
    ProgressID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    PlanID INT,
    LogDate DATE NOT NULL,
    SmokedToday BIT,
    CigarettesSmoked INT,
    CravingsLevel INT,
    Mood NVARCHAR(255),
    HealthNotes NVARCHAR(MAX),
    MoneySavedToday DECIMAL(10,2),
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tạo bảng Badges
CREATE TABLE Badges (
    BadgeID INT PRIMARY KEY IDENTITY(1,1),
    BadgeName NVARCHAR(255) UNIQUE NOT NULL,
    IconURL NVARCHAR(255),
    Criteria NVARCHAR(MAX) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1
);

-- Tạo bảng UserBadges
CREATE TABLE UserBadges (
    UserBadgeID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    BadgeID INT NOT NULL,
    DateAwarded DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tạo bảng Notifications
CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    MessageType NVARCHAR(255) NOT NULL,
    MessageContent NVARCHAR(MAX) NOT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    IsRead BIT NOT NULL DEFAULT 0,
    ScheduledSendTime DATETIME,
    RelatedEntityID INT,
    RelatedEntityType NVARCHAR(255)
);

-- Tạo bảng Coaches
CREATE TABLE Coaches (
    CoachID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT UNIQUE,
    FullName NVARCHAR(255) NOT NULL,
    Specialization NVARCHAR(255),
    Bio NVARCHAR(MAX),
    Availability NVARCHAR(MAX),
    ProfilePictureURL NVARCHAR(255),
    IsActive BIT NOT NULL DEFAULT 1
);

-- Tạo bảng Consultations
CREATE TABLE Consultations (
    ConsultationID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    CoachID INT NOT NULL,
    ScheduledTime DATETIME, -- Sửa lỗi cú pháp NOT FILL
    Status NVARCHAR(255) NOT NULL,
    Notes NVARCHAR(MAX),
    MeetingLink NVARCHAR(255)
);

-- Tạo bảng Feedback
CREATE TABLE Feedback (
    FeedbackID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    TargetType NVARCHAR(255) NOT NULL,
    TargetID INT NOT NULL,
    Rating INT,
    Comment NVARCHAR(MAX),
    SubmissionDate DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tạo bảng BlogPosts
CREATE TABLE BlogPosts (
    PostID INT PRIMARY KEY IDENTITY(1,1),
    AuthorUserID INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Slug NVARCHAR(255) UNIQUE NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    Excerpt NVARCHAR(MAX),
    PublishDate DATETIME NOT NULL DEFAULT GETDATE(),
    LastModifiedDate DATETIME,
    Category NVARCHAR(255),
    Tags NVARCHAR(255),
    Views INT NOT NULL DEFAULT 0,
    Status NVARCHAR(255) NOT NULL DEFAULT 'draft',
    FeaturedImageURL NVARCHAR(255)
);

-- Tạo bảng PostComments
CREATE TABLE PostComments (
    CommentID INT PRIMARY KEY IDENTITY(1,1),
    PostID INT NOT NULL,
    UserID INT NOT NULL,
    ParentCommentID INT,
    Content NVARCHAR(MAX) NOT NULL,
    CommentDate DATETIME NOT NULL DEFAULT GETDATE(),
    IsApproved BIT NOT NULL DEFAULT 1,
    Upvotes INT NOT NULL DEFAULT 0,
    Downvotes INT NOT NULL DEFAULT 0
);

-- Tạo các chỉ mục (INDEX)
CREATE INDEX IX_Users_Email ON Users (Email);
CREATE INDEX IX_Users_Username ON Users (Username);
CREATE INDEX IX_Users_CoachID ON Users (CoachID);
CREATE INDEX IX_SmokingStatusLogs_UserID_LogDate ON SmokingStatusLogs (UserID, LogDate);
CREATE INDEX IX_CessationPlans_UserID_IsActive ON CessationPlans (UserID, IsActive);
CREATE UNIQUE INDEX UQ_DailyProgress_UserID_LogDate ON DailyProgress (UserID, LogDate);
CREATE UNIQUE INDEX UQ_UserBadges_UserID_BadgeID ON UserBadges (UserID, BadgeID);
CREATE INDEX IX_Feedback_TargetType_TargetID ON Feedback (TargetType, TargetID);
CREATE UNIQUE INDEX UQ_Feedback_UserID_TargetType_TargetID ON Feedback (UserID, TargetType, TargetID);
CREATE INDEX IX_BlogPosts_Slug ON BlogPosts (Slug);
CREATE INDEX IX_BlogPosts_AuthorUserID ON BlogPosts (AuthorUserID);
CREATE INDEX IX_BlogPosts_Category ON BlogPosts (Category);
CREATE INDEX IX_BlogPosts_Status ON BlogPosts (Status);
CREATE INDEX IX_PostComments_PostID_CommentDate ON PostComments (PostID, CommentDate);
CREATE INDEX IX_PostComments_UserID ON PostComments (UserID);
CREATE INDEX IX_PostComments_ParentCommentID ON PostComments (ParentCommentID);

-- Tạo các khóa ngoại (FOREIGN KEY)
ALTER TABLE Users
ADD CONSTRAINT FK_Users_MembershipPackages FOREIGN KEY (CurrentMembershipPackageID) REFERENCES MembershipPackages (PackageID);

ALTER TABLE Users
ADD CONSTRAINT FK_Users_Coaches FOREIGN KEY (CoachID) REFERENCES Coaches (CoachID);

ALTER TABLE Payments
ADD CONSTRAINT FK_Payments_Users FOREIGN KEY (UserID) REFERENCES Users (UserID);

ALTER TABLE Payments
ADD CONSTRAINT FK_Payments_MembershipPackages FOREIGN KEY (PackageID) REFERENCES MembershipPackages (PackageID);

ALTER TABLE SmokingStatusLogs
ADD CONSTRAINT FK_SmokingStatusLogs_Users FOREIGN KEY (UserID) REFERENCES Users (UserID);

ALTER TABLE CessationPlans
ADD CONSTRAINT FK_CessationPlans_Users FOREIGN KEY (UserID) REFERENCES Users (UserID);

ALTER TABLE PlanStages
ADD CONSTRAINT FK_PlanStages_CessationPlans FOREIGN KEY (PlanID) REFERENCES CessationPlans (PlanID);

ALTER TABLE DailyProgress
ADD CONSTRAINT FK_DailyProgress_Users FOREIGN KEY (UserID) REFERENCES Users (UserID);

ALTER TABLE DailyProgress
ADD CONSTRAINT FK_DailyProgress_CessationPlans FOREIGN KEY (PlanID) REFERENCES CessationPlans (PlanID);

ALTER TABLE UserBadges
ADD CONSTRAINT FK_UserBadges_Users FOREIGN KEY (UserID) REFERENCES Users (UserID);

ALTER TABLE UserBadges
ADD CONSTRAINT FK_UserBadges_Badges FOREIGN KEY (BadgeID) REFERENCES Badges (BadgeID);

ALTER TABLE Notifications
ADD CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserID) REFERENCES Users (UserID);

ALTER TABLE Coaches
ADD CONSTRAINT FK_Coaches_Users FOREIGN KEY (UserID) REFERENCES Users (UserID);

ALTER TABLE Consultations
ADD CONSTRAINT FK_Consultations_Users FOREIGN KEY (UserID) REFERENCES Users (UserID);

ALTER TABLE Consultations
ADD CONSTRAINT FK_Consultations_Coaches FOREIGN KEY (CoachID) REFERENCES Coaches (CoachID);

ALTER TABLE Feedback
ADD CONSTRAINT FK_Feedback_Users FOREIGN KEY (UserID) REFERENCES Users (UserID);

ALTER TABLE BlogPosts
ADD CONSTRAINT FK_BlogPosts_Users FOREIGN KEY (AuthorUserID) REFERENCES Users (UserID);

ALTER TABLE PostComments
ADD CONSTRAINT FK_PostComments_BlogPosts FOREIGN KEY (PostID) REFERENCES BlogPosts (PostID);

ALTER TABLE PostComments
ADD CONSTRAINT FK_PostComments_Users FOREIGN KEY (UserID) REFERENCES Users (UserID);

ALTER TABLE PostComments
ADD CONSTRAINT FK_PostComments_ParentComment FOREIGN KEY (ParentCommentID) REFERENCES PostComments (CommentID);
GO