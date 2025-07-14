import React from 'react'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Header from './Header'
import axiosClient from '../Axios/AxiosCLients'

const UserLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100" style={{ paddingTop: 72 }}>
            {/* Header */}
            <Header />

            <div className="flex">
                {/* Sidebar */}
                <div style={{ position: 'fixed', top: 72, left: 0, height: 'calc(100vh - 72px)', width: 240, zIndex: 1000 }}>
                    <Sidebar />
                </div>

                {/* Main Content */}
                <main className="flex-1 p-8" style={{ marginLeft: 240 }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default UserLayout 