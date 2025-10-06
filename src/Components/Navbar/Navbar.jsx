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

