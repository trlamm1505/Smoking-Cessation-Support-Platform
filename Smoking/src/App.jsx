import { useState } from 'react'
import reactLogo from './source/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './source/page/Home/Header'
import Hero from './source/page/Home/Hero'
import Footer from './source/page/Home/Footer'
import NewsSection from './source/page/Home/NewsSection'
import FeedBack from './source/page/Home/FeedBack'
import Section from './source/page/Home/Section'
import TeamSection from './source/page/Home/TeamSection'
import FAQWithImage from './source/page/Home/FAQWithImage'
import { FaSquare } from 'react-icons/fa'
import Home from './source/page/Home/Home'
import AppRouter from './routes/AppRouter'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

 // Google OAuth --ĐĂNG NHẬP BẰNG GOOGLE--
//MINH TRIẾT ĐÃ TỰ THÊM PHẦN NÀY 
import { GoogleOAuthProvider } from '@react-oauth/google';

 

function App() {
  return (
     // Google OAuth --ĐĂNG NHẬP BẰNG GOOGLE--
//MINH TRIẾT ĐÃ TỰ THÊM PHẦN NÀY 
    <GoogleOAuthProvider clientId="867588383187-lklobh1la8blv799o0fr5e8cj6jppj1k.apps.googleusercontent.com">
      <AppRouter />
      <ToastContainer 
        position="top-right" autoClose={3000} hideProgressBar={false}
        newestOnTop={false} closeOnClick rtl={false}
        pauseOnFocusLoss draggable pauseOnHover 
      />
    </GoogleOAuthProvider>
  )
}

export default App