import React from 'react'
import { Route, Routes, Link, Navigate } from 'react-router'
import Home from '../source/page/Home/Home'
import Login from '../source/page/Home/Login'
import Error from '../source/page/Home/Error'
import UserHome from '../source/page/Users/Home'
import UserDashboard from '../source/page/Users/Dashboard'
import UserProfile from '../source/page/Users/Profile'
import UserPlan from '../source/page/Users/Plan'
import UserLayout from '../source/page/Users/Layout'
import Premium from '../source/page/Users/Premium'
import Progress from '../source/page/Users/Progress'
import SmokingTrackerPage from '../source/page/Users/SmokingTrackerPage'
import DetailedSchedule from '../source/page/Users/DetailedSchedule'
import Achievements from '../source/page/Users/Achievements'
import Consultation from '../source/page/Users/Consultation'
import Community from '../source/page/Users/Community'
import Blog from '../source/page/Users/Blog'
import UserReviews from '../source/page/Users/UserReviews'
import CoachLayout from '../source/page/Coach/CoachLayout'
import CoachHome from '../source/page/Coach/Home'
import CoachProfile from '../source/page/Coach/CoachProfile'
import Schedule from '../source/page/Coach/Schedule'
import Members from '../source/page/Coach/Members'
import Statistics from '../source/page/Coach/Statistics'
import BlogManagement from '../source/page/Coach/BlogManagement'
import ConsultationCoach from '../source/page/Coach/Consultation'
import ReportPage from '../source/page/Coach/ReportPage'
import NotificationsPage from '../source/page/Users/NotificationsPage'
import CoachBlog from '../source/page/Coach/CoachBlog'
import AdminLayout from '../source/page/Admin/AdminLayout'
import Dashboard from '../source/page/Admin/Dashboard'
import CommunityManagement from '../source/page/Admin/CommunityManagement'
import BlogManagementAdmin from '../source/page/Admin/BlogManagement'
import RevenueStatistics from '../source/page/Admin/RevenueStatistics'
import AdminBlog from '../source/page/Admin/AdminBlog'
import AdminCommunity from '../source/page/Admin/AdminCommunity'
import AdminReports from '../source/page/Admin/AdminReports'

// Guest Components
import GuestHome from '../source/page/Guest/Home'
import GuestProfile from '../source/page/Guest/Profile'
import GuestConsultation from '../source/page/Guest/Consultation'
import GuestBlog from '../source/page/Guest/Blog'
import GuestPremium from '../source/page/Guest/Premium'
import GuestLayout from '../source/page/Guest/Layout'
import RequirePremiumNotice from '../source/page/Guest/RequirePremiumNotice'

export default function AppRouter() {
  return (
    <Routes>
      {/* Home */}
      <Route path='/' element={<Home />} />
      <Route path='login' element={<Login />} />

      {/* Guest Routes */}
      <Route path='guest' element={<GuestLayout />}>
        <Route index element={<Navigate to="/guest/home" replace />} />
        <Route path='home' element={<GuestHome />} />
        <Route path='profile' element={<GuestProfile />} />
        <Route path='consultation' element={<GuestConsultation />} />
        <Route path='blog' element={<GuestBlog />} />
        <Route path='premium' element={<GuestPremium />} />
        <Route path='premium-notice' element={<RequirePremiumNotice />} />
        <Route path='progress' element={<RequirePremiumNotice />} />
        <Route path='plan' element={<RequirePremiumNotice />} />
        <Route path='smoking-tracker' element={<RequirePremiumNotice />} />
        <Route path='schedule' element={<RequirePremiumNotice />} />
        <Route path='achievements' element={<RequirePremiumNotice />} />
        <Route path='community' element={<RequirePremiumNotice />} />
      </Route>

      {/* Users Routes */}
      <Route path='users' element={<UserLayout />}>
        <Route index element={<Navigate to="/users/home" replace />} />
        <Route path='home' element={<UserHome />} />
        <Route path='dashboard' element={<UserDashboard />} />
        <Route path='profile' element={<UserProfile />} />
        <Route path='plan' element={<UserPlan />} />
        <Route path='premium' element={<Premium />} />
        <Route path='progress' element={<Progress />} />
        <Route path='smoking-tracker' element={<SmokingTrackerPage />} />
        <Route path='schedule' element={<DetailedSchedule />} />
        <Route path='achievements' element={<Achievements />} />
        <Route path='consultation' element={<Consultation />} />
        <Route path='community' element={<Community />} />
        <Route path='blog' element={<Blog />} />
        <Route path='reviews' element={<UserReviews />} />
        <Route path='notifications' element={<NotificationsPage />} />
      </Route>

      {/* Coach Routes */}
      <Route path='coach' element={<CoachLayout />}>
        <Route index element={<CoachHome />} />
        <Route path='profile' element={<CoachProfile />} />
        <Route path='schedule' element={<Schedule />} />
        <Route path='members' element={<Members />} />
        <Route path='consultation' element={<ConsultationCoach />} />
        <Route path='statistics' element={<Statistics />} />
        <Route path='blog' element={<BlogManagement />} />
        <Route path='report' element={<ReportPage />} />
        <Route path='blog-view' element={<CoachBlog />} />
      </Route>

      {/* Admin Routes */}
      <Route path='admin' element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='community-manage' element={<CommunityManagement />} />
        <Route path='blog-manage' element={<BlogManagementAdmin />} />
        <Route path='revenue' element={<RevenueStatistics />} />
        <Route path='blog' element={<AdminBlog />} />
        <Route path='community' element={<AdminCommunity />} />
        <Route path='reports' element={<AdminReports />} />
      </Route>

      {/* Splats: TỨC LÀ NẾU KO THẤY TUYẾN ĐƯỜNG PHÙ HỢP THÌ SẼ TRẢ VỀ TRANG NÀY */}
      <Route path='*' element={<Error />} />
    </Routes>
  )
}