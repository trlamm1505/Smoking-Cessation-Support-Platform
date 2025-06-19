CREATE DATABASE Smoking;
USE Smoking;

-- Users
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    FullName NVARCHAR(255),
    RegistrationDate DATETIME NOT NULL DEFAULT GETDATE(),
    LastLoginDate DATETIME,
    ProfilePictureURL NVARCHAR(255),
    CurrentCustomerPackageID INT,
    SubscriptionEndDate DATE,
    CoachID INT,
    Role NVARCHAR(255) NOT NULL DEFAULT 'customer',
    Enabled BIT NOT NULL DEFAULT 0
);

-- CustomerPackages (gói thành viên)
CREATE TABLE CustomerPackages (
    PackageID INT PRIMARY KEY IDENTITY(1,1),
    PackageName NVARCHAR(255) UNIQUE NOT NULL,
    Price DECIMAL(10,2) NOT NULL DEFAULT 0,
    DurationDays INT NOT NULL,
    Description NVARCHAR(MAX),
    IsActive BIT NOT NULL DEFAULT 1
);

-- Payments
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

-- SmokingStatusLogs
CREATE TABLE SmokingStatusLogs (
    LogID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    LogDate DATE NOT NULL DEFAULT GETDATE(),
    CigarettesPerDay INT,
    SmokingFrequency NVARCHAR(255),
    CostPerPack DECIMAL(10,2),
    Notes NVARCHAR(MAX)
);

-- CessationPlans
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

-- PlanStages
CREATE TABLE PlanStages (
    StageID INT PRIMARY KEY IDENTITY(1,1),
    PlanID INT NOT NULL,
    StageName NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    TargetDurationDays INT,
    SequenceOrder INT NOT NULL DEFAULT 0
);

-- DailyProgress (?ã b? tr??ng SmokedToday)
CREATE TABLE DailyProgress (
    ProgressID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    PlanID INT,
    LogDate DATE NOT NULL,
    CigarettesSmoked INT,
    CravingsLevel INT,
    Mood NVARCHAR(255),
    HealthNotes NVARCHAR(MAX),
    MoneySavedToday DECIMAL(10,2),
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);

-- Badges
CREATE TABLE Badges (
    BadgeID INT PRIMARY KEY IDENTITY(1,1),
    BadgeName NVARCHAR(255) UNIQUE NOT NULL,
    IconURL NVARCHAR(255),
    Criteria NVARCHAR(MAX) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1
);

-- UserBadges
CREATE TABLE UserBadges (
    UserBadgeID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    BadgeID INT NOT NULL,
    DateAwarded DATETIME NOT NULL DEFAULT GETDATE()
);

-- Notifications (?ã b? tr??ng IsRead)
CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    MessageType NVARCHAR(255) NOT NULL,
    MessageContent NVARCHAR(MAX) NOT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    ScheduledSendTime DATETIME,
    RelatedEntityID INT,
    RelatedEntityType NVARCHAR(255)
);

-- Coaches
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

-- Consultations
CREATE TABLE Consultations (
    ConsultationID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    CoachID INT NOT NULL,
    ScheduledTime DATETIME,
    Status NVARCHAR(255) NOT NULL,
    Notes NVARCHAR(MAX),
    MeetingLink NVARCHAR(255)
);

-- Feedback
CREATE TABLE Feedback (
    FeedbackID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    TargetType NVARCHAR(255) NOT NULL,
    TargetID INT NOT NULL,
    Rating INT,
    Comment NVARCHAR(MAX),
    SubmissionDate DATETIME NOT NULL DEFAULT GETDATE()
);

-- BlogPosts
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

-- PostComments (?ã b? CommentDate, Downvotes)
CREATE TABLE PostComments (
    CommentID INT PRIMARY KEY IDENTITY(1,1),
    PostID INT NOT NULL,
    UserID INT NOT NULL,
    ParentCommentID INT,
    Content NVARCHAR(MAX) NOT NULL,
    IsApproved BIT NOT NULL DEFAULT 1,
    Upvotes INT NOT NULL DEFAULT 0
);

-- Indexes
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
-- ?ã b? ch? m?c liên quan CommentDate, Downvotes
CREATE INDEX IX_PostComments_PostID ON PostComments (PostID);
CREATE INDEX IX_PostComments_UserID ON PostComments (UserID);
CREATE INDEX IX_PostComments_ParentCommentID ON PostComments (ParentCommentID);

-- Foreign Keys
ALTER TABLE Users
ADD CONSTRAINT FK_Users_CustomerPackages FOREIGN KEY (CurrentCustomerPackageID) REFERENCES CustomerPackages (PackageID);

ALTER TABLE Users
ADD CONSTRAINT FK_Users_Coaches FOREIGN KEY (CoachID) REFERENCES Coaches (CoachID);

ALTER TABLE Payments
ADD CONSTRAINT FK_Payments_Users FOREIGN KEY (UserID) REFERENCES Users (UserID);

ALTER TABLE Payments
ADD CONSTRAINT FK_Payments_CustomerPackages FOREIGN KEY (PackageID) REFERENCES CustomerPackages (PackageID);

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
