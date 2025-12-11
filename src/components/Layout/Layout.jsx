import React from 'react'
import { Outlet } from 'react-router-dom'
import Navber from '../../components/Navber/Navber.jsx'
export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navber />
            <Outlet />
        </div>
    )
}
