import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { tokenContext } from "../../context/tokenContext.jsx";
import { darkModeContext } from "../../context/darkModeContext.jsx";
import PLACEHOLDER from "../../assets/op.jpg";
export default function Navber() {
    const { token, setToken, userData } = useContext(tokenContext);
    const { darkMode, toggleDarkMode } = useContext(darkModeContext);
    const navigate = useNavigate();
    function logOut() {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/Login");
    }
    return (
        <div className="shadow-lg sticky top-0 left-0 right-0 z-100 bg-white dark:bg-gray-900 transition-colors">
            <div className="navbar bg-white dark:bg-gray-900 w-[90%] mx-auto transition-colors">
                <div className="flex-1">
                    <Link to='' className="text-sky-800 dark:text-sky-400 text-xl font-bold transition-colors">Linked Post</Link>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleDarkMode();
                        }}
                        className="btn btn-ghost btn-circle hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle dark mode"
                        type="button"
                    >
                        {darkMode ? (
                            <i className="fa-solid fa-sun text-yellow-500 text-xl"></i>
                        ) : (
                            <i className="fa-solid fa-moon text-gray-700 dark:text-gray-300 text-xl"></i>
                        )}
                    </button>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src={userData?.photo || PLACEHOLDER}
                                    className=""
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-white dark:bg-gray-800 rounded-box z-1 mt-3 w-52 p-2 shadow transition-colors"
                        >
                            {
                                token ?
                                    <>
                                        <li>
                                            <NavLink to='/' className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Home</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to={userData?._id ? `/Profile/${userData._id}` : "/Profile"} className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Profile
                                            </NavLink>
                                        </li>
                                        <li>
                                            <a onClick={() => logOut()} className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Logout</a>
                                        </li>
                                    </>
                                    : <>
                                        <li>
                                            <NavLink to="Login" className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Login</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="Register" className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Register</NavLink>
                                        </li>
                                    </>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
