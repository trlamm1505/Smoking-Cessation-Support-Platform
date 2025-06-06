-- Bảng Users
Create database Smoking
Use Smoking
CREATE TABLE Users (
    UserID int IDENTITY(1,1) PRIMARY KEY,
    Username nvarchar(255) NOT NULL UNIQUE,
    PasswordHash nvarchar(255) NOT NULL,
    Email nvarchar(255) NOT NULL UNIQUE,
    FullName nvarchar(255),
    RegistrationDate datetime2 NOT NULL DEFAULT GETDATE(),
    LastLoginDate datetime2,
    ProfilePictureURL nvarchar(255),
    CurrentMembershipPackageID int,
    SubscriptionEndDate date,
    CoachID int,
    Role nvarchar(255) NOT NULL DEFAULT 'member'
);

-- Bảng MembershipPackages
CREATE TABLE MembershipPackages (
    PackageID int IDENTITY(1,1) PRIMARY KEY,
    PackageName nvarchar(255) NOT NULL UNIQUE,
    Price decimal(10,2) NOT NULL DEFAULT 0,
    DurationDays int NOT NULL,
    Description nvarchar(max),
    IsActive bit NOT NULL DEFAULT 1
);

-- Bảng Payments
CREATE TABLE Payments (
    PaymentID int IDENTITY(1,1) PRIMARY KEY,
    UserID int NOT NULL,
    PackageID int NOT NULL,
    PaymentDate datetime2 NOT NULL DEFAULT GETDATE(),
    Amount decimal(10,2) NOT NULL,
    PaymentMethod nvarchar(255),
    TransactionID nvarchar(255) UNIQUE,
    Status nvarchar(255) NOT NULL DEFAULT 'pending'
);

-- Bảng SmokingStatusLogs
CREATE TABLE SmokingStatusLogs (
    LogID int IDENTITY(1,1) PRIMARY KEY,
    UserID int NOT NULL,
    LogDate date NOT NULL DEFAULT CONVERT(date, GETDATE()),
    CigarettesPerDay int,
    SmokingFrequency nvarchar(255),
    CostPerPack decimal(10,2),
    Notes nvarchar(max)
);

-- Bảng CessationPlans
CREATE TABLE CessationPlans (
    PlanID int IDENTITY(1,1) PRIMARY KEY,
    UserID int NOT NULL,
    ReasonToQuit nvarchar(max),
    StartDate date NOT NULL,
    TargetQuitDate date,
    GeneratedBySystem bit NOT NULL DEFAULT 0,
    CustomDetails nvarchar(max),
    IsActive bit NOT NULL DEFAULT 1,
    CreatedAt datetime2 NOT NULL DEFAULT GETDATE()
);

-- Bảng PlanStages
CREATE TABLE PlanStages (
    StageID int IDENTITY(1,1) PRIMARY KEY,
    PlanID int NOT NULL,
    StageName nvarchar(255) NOT NULL,
    Description nvarchar(max),
    TargetDurationDays int,
    SequenceOrder int NOT NULL DEFAULT 0
);

-- Bảng DailyProgress
CREATE TABLE DailyProgress (
    ProgressID int IDENTITY(1,1) PRIMARY KEY,
    UserID int NOT NULL,
    PlanID int,
    LogDate date NOT NULL,
    SmokedToday bit,
    CigarettesSmoked int,
    CravingsLevel int,
    Mood nvarchar(255),
    HealthNotes nvarchar(max),
    MoneySavedToday decimal(10,2),
    CreatedAt datetime2 NOT NULL DEFAULT GETDATE()
);

-- Bảng Badges
CREATE TABLE Badges (
    BadgeID int IDENTITY(1,1) PRIMARY KEY,
    BadgeName nvarchar(255) NOT NULL UNIQUE,
    Description nvarchar(max),
    IconURL nvarchar(255),
    Criteria nvarchar(max) NOT NULL,
    IsActive bit NOT NULL DEFAULT 1
);

-- Bảng UserBadges
CREATE TABLE UserBadges (
    UserBadgeID int IDENTITY(1,1) PRIMARY KEY,
    UserID int NOT NULL,
    BadgeID int NOT NULL,
    DateAwarded datetime2 NOT NULL DEFAULT GETDATE()
);

-- Bảng Notifications
CREATE TABLE Notifications (
    NotificationID int IDENTITY(1,1) PRIMARY KEY,
    UserID int NOT NULL,
    MessageType nvarchar(255) NOT NULL,
    MessageContent nvarchar(max) NOT NULL,
    CreatedDate datetime2 NOT NULL DEFAULT GETDATE(),
    IsRead bit NOT NULL DEFAULT 0,
    ScheduledSendTime datetime2,
    RelatedEntityID int,
    RelatedEntityType nvarchar(255)
);

-- Bảng Coaches
CREATE TABLE Coaches (
    CoachID int IDENTITY(1,1) PRIMARY KEY,
    UserID int UNIQUE,
    FullName nvarchar(255) NOT NULL,
    Specialization nvarchar(255),
    Bio nvarchar(max),
    Availability nvarchar(max),
    ProfilePictureURL nvarchar(255),
    IsActive bit NOT NULL DEFAULT 1
);

-- Bảng Consultations
CREATE TABLE Consultations (
    ConsultationID int IDENTITY(1,1) PRIMARY KEY,
    UserID int NOT NULL,
    CoachID int NOT NULL,
    ScheduledTime datetime2 NOT NULL,
    EndTime datetime2,
    DurationMinutes int,
    Status nvarchar(255) NOT NULL,
    Notes nvarchar(max),
    MeetingLink nvarchar(255),
    ChatLog nvarchar(max),
    CreatedAt datetime2 NOT NULL DEFAULT GETDATE()
);

-- Bảng Feedback
CREATE TABLE Feedback (
    FeedbackID int IDENTITY(1,1) PRIMARY KEY,
    UserID int NOT NULL,
    TargetType nvarchar(255) NOT NULL,
    TargetID int NOT NULL,
    Rating int,
    Comment nvarchar(max),
    SubmissionDate datetime2 NOT NULL DEFAULT GETDATE()
);

-- Bảng BlogPosts
CREATE TABLE BlogPosts (
    PostID int IDENTITY(1,1) PRIMARY KEY,
    AuthorUserID int NOT NULL,
    Title nvarchar(255) NOT NULL,
    Slug nvarchar(255) NOT NULL UNIQUE,
    Content nvarchar(max) NOT NULL,
    Excerpt nvarchar(max),
    PublishDate datetime2 NOT NULL DEFAULT GETDATE(),
    LastModifiedDate datetime2,
    Category nvarchar(255),
    Tags nvarchar(255),
    Views int NOT NULL DEFAULT 0,
    Status nvarchar(255) NOT NULL DEFAULT 'draft',
    FeaturedImageURL nvarchar(255)
);

-- Bảng PostComments
CREATE TABLE PostComments (
    CommentID int IDENTITY(1,1) PRIMARY KEY,
    PostID int NOT NULL,
    UserID int NOT NULL,
    ParentCommentID int,
    Content nvarchar(max) NOT NULL,
    CommentDate datetime2 NOT NULL DEFAULT GETDATE(),
    IsApproved bit NOT NULL DEFAULT 1,
    Upvotes int NOT NULL DEFAULT 0,
    Downvotes int NOT NULL DEFAULT 0
);

-- Tạo các chỉ mục (INDEX)
CREATE INDEX Users_index_0 ON Users (Email);
CREATE INDEX Users_index_1 ON Users (Username);
CREATE INDEX Users_index_2 ON Users (CoachID);
CREATE INDEX SmokingStatusLogs_index_3 ON SmokingStatusLogs (UserID, LogDate);
CREATE INDEX CessationPlans_index_4 ON CessationPlans (UserID, IsActive);
CREATE UNIQUE INDEX UQ_User_LogDate ON DailyProgress (UserID, LogDate);
CREATE UNIQUE INDEX UQ_User_Badge ON UserBadges (UserID, BadgeID);
CREATE INDEX Feedback_index_7 ON Feedback (TargetType, TargetID);
CREATE UNIQUE INDEX UQ_User_Feedback_Target ON Feedback (UserID, TargetType, TargetID);
CREATE INDEX BlogPosts_index_9 ON BlogPosts (Slug);
CREATE INDEX BlogPosts_index_10 ON BlogPosts (AuthorUserID);
CREATE INDEX BlogPosts_index_11 ON BlogPosts (Category);
CREATE INDEX BlogPosts_index_12 ON BlogPosts (Status);
CREATE INDEX PostComments_index_13 ON PostComments (PostID, CommentDate);
CREATE INDEX PostComments_index_14 ON PostComments (UserID);
CREATE INDEX PostComments_index_15 ON PostComments (ParentCommentID);

-- Tạo các ràng buộc khóa ngoại (FOREIGN KEY)
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