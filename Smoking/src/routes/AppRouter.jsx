import React from 'react'
import { Route, Routes } from 'react-router'
import Home from '../source/page/Home/Home'
import Login from '../source/page/Home/Login'
import Error from '../source/page/Home/Error'

export default function AppRouter() {
  return (
    <Routes>
        {/* Home */}
     <Route path='/' element={<Home/>}/>
     <Route path='login' element={<Login/>}/>


        
          {/* Splats: TỨC LÀ NẾU KO THẤY TUYẾN ĐƯỜNG PHÙ HỢP THÌ SẼ TRẢ VỀ TRANG NÀY */}
          <Route path='*' element={<Error/>} />

    </Routes>
  )
}
