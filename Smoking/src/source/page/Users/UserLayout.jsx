import React from 'react'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Header from './Header'

const UserLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <Header />

            <div className="flex">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default UserLayout 