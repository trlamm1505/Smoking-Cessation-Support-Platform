import React from 'react'
import { Route, Routes } from 'react-router'
import Home from '../source/page/Home/Home'
import Login from '../source/page/Home/Login'
import SignUpFree from '../source/page/Home/SignUpFree'
import Error from '../source/page/Home/Error'

export default function AppRouter() {
  return (
    <Routes>
        {/* Home */}
     <Route path='/' element={<Home/>}/>
     <Route path='login' element={<Login/>}/>
     <Route path='signupfree' element={<SignUpFree/>}/>


        
          {/* Splats: TỨC LÀ NẾU KO THẤY TUYẾN ĐƯỜNG PHÙ HỢP THÌ SẼ TRẢ VỀ TRANG NÀY */}
          <Route path='*' element={<Error/>} />

    </Routes>
  )
}
