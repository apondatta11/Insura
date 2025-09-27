// import React, { use, useEffect, useState } from 'react';
// import { Link, NavLink } from 'react-router';
// import { showSuccessToast } from '../../Utilities/Toasterror';
// import { AuthContext } from '../../Provider/AuthContext';
// import { SiWebmoney } from "react-icons/si";


// const Navbar = () => {
//     const { user, logOut, loading } = use(AuthContext);

//     const [theme, setTheme] = useState(
//         localStorage.getItem('theme') || 'light'
//     );

//     const handleToggle = (e) => {
//         const selectedTheme = e.target.checked ? 'dark' : 'light';
//         setTheme(selectedTheme);
//     };

//     useEffect(() => {
//         localStorage.setItem('theme', theme);
//         const html = document.documentElement;

//         html.setAttribute('data-theme', theme); // DaisyUI
//         if (theme === 'dark') {
//             html.classList.add('dark'); // Tailwind & shadcn
//         } else {
//             html.classList.remove('dark');
//         }
//         console.log('Current theme:', theme, 'Classes:', html.className);
//     }, [theme]);



//     const handleLogOut = () => {
//         console.log("user trying to LogOut");
//         logOut()
//             .then(() => {
//                 showSuccessToast("You Logged Out successfully");
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     const links = <>
//         <NavLink to="/" className={({ isActive }) => `m-2 p-2 rounded-sm rounded-b-none border-b-2 ${isActive ? ' border-black font-extrabold' : 'border-border hover:bg-primary hover:border-border hover:text-background'}`}>
//             <li>Home</li>
//         </NavLink>
//         <NavLink to="/dashboard" className={({ isActive }) => `m-2 p-2 rounded-sm rounded-b-none border-b-2 ${isActive ? ' border-black font-extrabold' : 'border-border hover:bg-primary hover:border-border hover:text-background'}`}>
//             <li>Dashboard</li>
//         </NavLink>
//         <NavLink to="/allpackages" className={({ isActive }) => `m-2 p-2 rounded-sm rounded-b-none border-b-2 ${isActive ? ' border-black font-extrabold' : 'border-border hover:bg-primary hover:border-border hover:text-background'}`}>
//             <li>All Packages</li>
//         </NavLink>
//         {/* <NavLink to="/mybookings" className={({ isActive }) => `m-2 p-2 rounded-sm rounded-b-none border-b-2 ${isActive ? ' border-black font-extrabold' : 'border-transparent hover:bg-sky-100 hover:border-black'}`}>
//             <li>My Bookings</li>
//         </NavLink> */}
//         {/* <NavLink to="/about" className={({ isActive }) => `m-2 p-2 rounded-sm rounded-b-none border-b-2 ${isActive ? ' border-black font-extrabold' : 'border-transparent hover:bg-sky-100 hover:border-black'}`}>
//             <li>About Us</li>
//         </NavLink> */}

//     </>
//     const links2 = <>
//         <NavLink to="/addpackages" className={({ isActive }) => `m-2 p-2 rounded-sm rounded-b-none border-b-2 ${isActive ? ' border-black font-extrabold' : 'border-transparent hover:bg-sky-100 hover:border-black'}`}>
//             <li>Add Package</li>
//         </NavLink>
//         <NavLink to="/manage-packages" className={({ isActive }) => `m-2 p-2 rounded-sm rounded-b-none border-b-2 ${isActive ? ' border-black font-extrabold' : 'border-transparent hover:bg-sky-100 hover:border-black'}`}>
//             <li>Manage Package</li>
//         </NavLink>
//         <NavLink onClick={handleLogOut} className='text-black'>
//             <li>Logout</li>
//         </NavLink>
//     </>

//     return (
//         <div className="pt-3.5 navbar w-full sm:w-[95%] lg:w-[93%] mx-auto mb-2 ">
//             <div className='flex flex-row justify-between items-center w-full'>
//                 {/* the checkbox */}
//                 <div className="xl:hidden">
//                     <div className="dropdown">
//                         <div tabIndex={0} role="button" className="btn btn-ghost xl:hidden">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
//                         </div>
//                         <ul
//                             tabIndex={0}
//                             className="menu menu-sm dropdown-content rounded-box z-50 mt-3 w-52 p-2 shadow-xl bg-white border border-gray-300 backdrop-blur-sm">
//                             {links}
//                         </ul>
//                     </div>
//                 </div>
//                 {/* the logo & title */}
//                 <Link to="/" className="flex items-center gap-2 sm:gap-3 lg:gap-4 xl:gap-5">
//                     <div className='flex gap-1 justify-center items-center sm:gap-2 lg:gap-3 xl:gap-5'>
//                         <SiWebmoney size={30} />
//                         <h1 className='font-extrabold text-lg sm:text-2xl cursor-pointer '>Insura</h1>
//                     </div>
//                 </Link>

//                 {/* links */}
//                 <div className="hidden xl:flex">
//                     <ul className="menu menu-horizontal px-1 font-medium text-lg">
//                         {links}
//                     </ul>
//                 </div>
//                 {/* user login site */}
//                 <div className=" flex flex-row items-center gap-1 sm:gap-2 lg:gap-4 ">
//                     {loading ? (
//                         <div className="h-8 sm:h-10 lg:h-12 w-[124px] sm:w-[172px] lg:w-[220px] flex justify-center items-center">
//                             <span className="loading loading-spinner loading-md"></span>
//                         </div>
//                     ) : user ? (
//                         <>
//                             <label className="swap swap-rotate">
//                                 {/* this hidden checkbox controls the state */}
//                                 <input type="checkbox" className="theme-controller" checked={theme === 'light' ? false : true} onChange={handleToggle} />
//                                 {/* sun icon */}
//                                 <svg
//                                     className="swap-off h-8 w-9 sm:h-10 sm:w-10 lg:w-12 lg:h-12 fill-current"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     viewBox="0 0 24 24">
//                                     <path
//                                         d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
//                                 </svg>
//                                 {/* moon icon */}
//                                 <svg
//                                     className="swap-on h-8 w-9 sm:h-10 sm:w-10 lg:w-12 lg:h-12 fill-current"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     viewBox="0 0 24 24">
//                                     <path
//                                         d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
//                                 </svg>
//                             </label>

//                             <div className="flex gap-2">
//                                 <div className="dropdown dropdown-center">
//                                     <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//                                         <div className="w-10 rounded-full">
//                                             <img
//                                                 alt="Tailwind CSS Navbar component"
//                                                 src={user.photoURL} />
//                                         </div>
//                                     </div>
//                                     <ul
//                                         tabIndex={0}
//                                         className="menu menu-sm dropdown-content bg-accent rounded-box z-1 mt-3 w-36 p-2 shadow">
//                                         {links2}
//                                     </ul>
//                                 </div>
//                             </div>
//                         </>
//                     ) : (
//                         <>
//                             <label className="swap swap-rotate">
//                                 {/* this hidden checkbox controls the state */}
//                                 <input type="checkbox" className="theme-controller" checked={theme === 'light' ? false : true} onChange={handleToggle} />
//                                 {/* sun icon */}
//                                 <svg
//                                     className="swap-off h-8 w-8 sm:h-10 sm:w-10 fill-current"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     viewBox="0 0 24 24">
//                                     <path
//                                         d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
//                                 </svg>
//                                 {/* moon icon */}
//                                 <svg
//                                     className="swap-on h-8 w-8 sm:h-10 sm:w-10 fill-current"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     viewBox="0 0 24 24">
//                                     <path
//                                         d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
//                                 </svg>
//                             </label>
//                             <div className="relative group flex flex-row items-center gap-1 sm:gap-2 lg:gap-3 xl:gap-4">
//                                 <Link to="/auth/login" className="btn btn-primary text-accent px-1 sm:px-2 lg:px-3 xl:px-5 btn-xs sm:btn-sm md:btn-md lg:btn-lg">
//                                     Login
//                                 </Link>
//                                 {/* <Link to="/auth/signup" className="btn btn-primary text-accent px-1 sm:px-2 lg:px-3 xl:px-5 btn-xs sm:btn-sm md:btn-md lg:btn-lg">
//                                     SignUp
//                                 </Link> */}
//                             </div>
//                         </>
//                     )}
//                 </div>

//             </div>
//         </div>
//     );
// };
// export default Navbar;

// <div className="flex gap-2">
//     <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
//     <div className="dropdown dropdown-end">
//         <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//             <div className="w-10 rounded-full">
//                 <img
//                     alt="Tailwind CSS Navbar component"
//                     src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
//             </div>
//         </div>
//         <ul
//             tabIndex={0}
//             className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
//             <li>
//                 <a className="justify-between">
//                     Profile
//                     <span className="badge">New</span>
//                 </a>
//             </li>
//             <li><a>Settings</a></li>
//             <li><a>Logout</a></li>
//         </ul>
//     </div>
// </div>




import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../Provider/AuthContext';
import { SiWebmoney } from "react-icons/si";
import { FaUser, FaSignOutAlt, FaSun, FaMoon, FaSearch } from 'react-icons/fa';

const Navbar = () => {
    const { user, logOut, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleToggle = (e) => {
        const selectedTheme = e.target.checked ? 'dark' : 'light';
        setTheme(selectedTheme);
    };

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const html = document.documentElement;

        html.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }, [theme]);

    const handleLogOut = () => {
        logOut()
            .then(() => {
                toast.success("Logged out successfully");
                navigate('/');
            })
            .catch((error) => {
                console.log(error);
                toast.error("Logout failed");
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/policies?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    // Navigation links
    const mainLinks = (
        <>
            <NavLink 
                to="/" 
                className={({ isActive }) => `px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                    isActive 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
            >
                Home
            </NavLink>
            <NavLink 
                to="/policies" 
                className={({ isActive }) => `px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                    isActive 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
            >
                All Policies
            </NavLink>
            <NavLink 
                to="/blog" 
                className={({ isActive }) => `px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                    isActive 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
            >
                Blog/Articles
            </NavLink>
            {user && (
                <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => `px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        isActive 
                            ? 'bg-primary text-primary-foreground shadow-md' 
                            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                    Dashboard
                </NavLink>
            )}
        </>
    );

    // User dropdown links
    const userDropdownLinks = (
        <>
            <li>
                <Link to="/dashboard/profile" className="flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    Profile
                </Link>
            </li>
            <li>
                <button 
                    onClick={handleLogOut}
                    className="flex items-center gap-2 text-destructive hover:text-destructive/80 w-full text-left"
                >
                    <FaSignOutAlt className="w-4 h-4" />
                    Logout
                </button>
            </li>
        </>
    );

    return (
        <nav className="bg-card/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left Section - Logo and Mobile Menu */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors duration-200"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-gradient-to-r from-primary to-primary/80 p-2 rounded-xl group-hover:scale-105 transition-transform duration-200">
                                <SiWebmoney size={28} className="text-white" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                                    Insura
                                </h1>
                                <span className="text-xs text-muted-foreground">Insurance Platform</span>
                            </div>
                        </Link>
                    </div>

                    {/* Center Section - Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-2">
                        {mainLinks}
                    </div>

                    {/* Right Section - Search, Theme, User */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="hidden md:flex items-center">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search policies..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64 px-4 py-2 pl-10 pr-4 rounded-full border border-input bg-background/50 
                                               focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary 
                                               transition-all duration-200 text-sm"
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60" />
                            </div>
                        </form>

                        {/* Theme Toggle */}
                        <label className="swap swap-rotate btn btn-ghost btn-circle">
                            <input 
                                type="checkbox" 
                                className="theme-controller" 
                                checked={theme === 'dark'} 
                                onChange={handleToggle} 
                            />
                            <FaSun className="swap-off w-5 h-5 text-yellow-500" />
                            <FaMoon className="swap-on w-5 h-5 text-blue-400" />
                        </label>

                        {/* User Section */}
                        {loading ? (
                            <div className="w-8 h-8 flex justify-center items-center">
                                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            </div>
                        ) : user ? (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 rounded-lg p-2 transition-colors duration-200">
                                    <div className="avatar">
                                        <div className="w-8 h-8 rounded-full ring-2 ring-primary/20">
                                            <img
                                                src={user.photoURL || '/default-avatar.png'}
                                                alt={user.displayName || 'User'}
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-foreground">
                                        {user.displayName || 'User'}
                                    </span>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu bg-card rounded-box z-50 mt-3 w-48 p-2 shadow-lg border border-border/50"
                                >
                                    {userDropdownLinks}
                                </ul>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link 
                                    to="/auth/login" 
                                    className="px-4 py-2 rounded-lg font-medium text-foreground hover:bg-accent transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/auth/register" 
                                    className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground 
                                               rounded-lg font-medium hover:from-primary/90 hover:to-primary 
                                               transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t border-border/50 mt-2 pt-4 pb-4">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="mb-4 px-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search policies..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-input bg-background/50 
                                               focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary 
                                               transition-all duration-200 text-sm"
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60" />
                            </div>
                        </form>

                        {/* Mobile Navigation Links */}
                        <div className="flex flex-col gap-2">
                            {mainLinks}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

