
import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="w-screen flex flex-col items-center justify-center h-[calc(100vh-65px)] bg-sky-50 dark:bg-gray-900 px-6 text-center transition-colors">
            <h1 className="text-[120px] font-extrabold text-sky-800 dark:text-sky-400 leading-none">404</h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mt-4">
                Sorry, the page you're looking for doesn't exist
            </p>
            <Link
                to="/"
                className="mt-8 px-6 py-3 bg-sky-800 dark:bg-sky-700 text-white text-lg rounded-lg shadow hover:bg-sky-900 dark:hover:bg-sky-800 transition-all"
            >
                Back to Home
            </Link>
        </div>
    )
}
