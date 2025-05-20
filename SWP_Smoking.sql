USE [Smoking_SWP]
GO
/****** Object:  Table [dbo].[ACHIEVEMENT]    Script Date: 20/05/2025 1:18:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ACHIEVEMENT](
	[achievement_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[description] [nvarchar](255) NULL,
	[criteria] [nvarchar](255) NULL,
	[badge_image] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[achievement_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ADMIN]    Script Date: 20/05/2025 1:18:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ADMIN](
	[admin_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[role] [nvarchar](100) NULL,
	[assigned_date] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[admin_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[APPOINTMENT]    Script Date: 20/05/2025 1:18:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[APPOINTMENT](
	[appointment_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[specialist_id] [int] NOT NULL,
	[appointment_time] [datetime] NOT NULL,
	[status] [nvarchar](100) NULL,
	[notes] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[appointment_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BLOG_POST]    Script Date: 20/05/2025 1:18:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BLOG_POST](
	[post_id] [int] IDENTITY(1,1) NOT NULL,
	[admin_id] [int] NOT NULL,
	[title] [nvarchar](150) NOT NULL,
	[content] [text] NULL,
	[published_date] [datetime] NULL,
	[is_active] [bit] NULL,
	[tags] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[post_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DAILY_TRACKING]    Script Date: 20/05/2025 1:18:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DAILY_TRACKING](
	[tracking_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[record_date] [date] NOT NULL,
	[cigarettes_avoided] [int] NULL,
	[money_saved] [float] NULL,
	[notes] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[tracking_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FEEDBACK]    Script Date: 20/05/2025 1:18:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FEEDBACK](
	[feedback_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[rating] [int] NULL,
	[comment] [text] NULL,
	[submitted_at] [datetime] NULL,
	[feedback_type] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[feedback_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GUEST]    Script Date: 20/05/2025 1:18:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GUEST](
	[guest_id] [int] IDENTITY(1,1) NOT NULL,
	[email] [varchar](150) NULL,
	[visit_date] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[guest_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NOTIFICATION]    Script Date: 20/05/2025 1:18:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NOTIFICATION](
	[notification_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[message] [nvarchar](255) NULL,
	[created_at] [datetime] NULL,
	[is_read] [bit] NULL,
	[notification_type] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[notification_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QUITTING_PLAN]    Script Date: 20/05/2025 1:18:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QUITTING_PLAN](
	[plan_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[start_date] [date] NOT NULL,
	[target_quit_date] [date] NULL,
	[reason] [nvarchar](255) NULL,
	[stages] [nvarchar](255) NULL,
	[progress_status] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[plan_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SPECIALIST]    Script Date: 20/05/2025 1:18:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SPECIALIST](
	[specialist_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[qualification] [nvarchar](150) NULL,
	[specialty] [nvarchar](100) NULL,
	[contact_info] [nvarchar](150) NULL,
	[availability] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[specialist_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SUBSCRIPTION_PLAN]    Script Date: 20/05/2025 1:18:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SUBSCRIPTION_PLAN](
	[plan_id] [int] IDENTITY(1,1) NOT NULL,
	[plan_name] [nvarchar](100) NOT NULL,
	[price] [float] NOT NULL,
	[description] [nvarchar](255) NULL,
	[duration_days] [int] NOT NULL,
	[features] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[plan_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USER]    Script Date: 20/05/2025 1:18:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USER](
	[user_id] [int] IDENTITY(1,1) NOT NULL,
	[username] [varchar](100) NOT NULL,
	[password] [varchar](255) NOT NULL,
	[email] [varchar](150) NOT NULL,
	[full_name] [nvarchar](150) NULL,
	[registration_date] [date] NOT NULL,
	[profile_image] [varchar](255) NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USER_ACHIEVEMENT]    Script Date: 20/05/2025 1:18:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USER_ACHIEVEMENT](
	[user_achievement_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[achievement_id] [int] NOT NULL,
	[earned_date] [date] NULL,
	[is_shared] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[user_achievement_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USER_SUBSCRIPTION]    Script Date: 20/05/2025 1:18:30 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USER_SUBSCRIPTION](
	[subscription_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[plan_id] [int] NOT NULL,
	[start_date] [date] NOT NULL,
	[end_date] [date] NULL,
	[is_active] [bit] NULL,
	[payment_status] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[subscription_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[BLOG_POST] ADD  DEFAULT (getdate()) FOR [published_date]
GO
ALTER TABLE [dbo].[BLOG_POST] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[FEEDBACK] ADD  DEFAULT (getdate()) FOR [submitted_at]
GO
ALTER TABLE [dbo].[NOTIFICATION] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[NOTIFICATION] ADD  DEFAULT ((0)) FOR [is_read]
GO
ALTER TABLE [dbo].[USER] ADD  DEFAULT (getdate()) FOR [registration_date]
GO
ALTER TABLE [dbo].[USER] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[USER_ACHIEVEMENT] ADD  DEFAULT ((0)) FOR [is_shared]
GO
ALTER TABLE [dbo].[USER_SUBSCRIPTION] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[ADMIN]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[USER] ([user_id])
GO
ALTER TABLE [dbo].[APPOINTMENT]  WITH CHECK ADD FOREIGN KEY([specialist_id])
REFERENCES [dbo].[SPECIALIST] ([specialist_id])
GO
ALTER TABLE [dbo].[APPOINTMENT]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[USER] ([user_id])
GO
ALTER TABLE [dbo].[BLOG_POST]  WITH CHECK ADD FOREIGN KEY([admin_id])
REFERENCES [dbo].[ADMIN] ([admin_id])
GO
ALTER TABLE [dbo].[DAILY_TRACKING]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[USER] ([user_id])
GO
ALTER TABLE [dbo].[FEEDBACK]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[USER] ([user_id])
GO
ALTER TABLE [dbo].[NOTIFICATION]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[USER] ([user_id])
GO
ALTER TABLE [dbo].[QUITTING_PLAN]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[USER] ([user_id])
GO
ALTER TABLE [dbo].[USER_ACHIEVEMENT]  WITH CHECK ADD FOREIGN KEY([achievement_id])
REFERENCES [dbo].[ACHIEVEMENT] ([achievement_id])
GO
ALTER TABLE [dbo].[USER_ACHIEVEMENT]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[USER] ([user_id])
GO
ALTER TABLE [dbo].[USER_SUBSCRIPTION]  WITH CHECK ADD FOREIGN KEY([plan_id])
REFERENCES [dbo].[SUBSCRIPTION_PLAN] ([plan_id])
GO
ALTER TABLE [dbo].[USER_SUBSCRIPTION]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[USER] ([user_id])
GO
