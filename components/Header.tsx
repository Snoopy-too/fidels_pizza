
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
    const { auth, logout } = useApp();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const activeLinkClass = "text-red-600 border-b-2 border-red-600";
    const inactiveLinkClass = "hover:text-red-600 transition-colors";
    const mobileActiveLinkClass = "text-red-500 bg-red-100";
    const mobileInactiveLinkClass = "text-stone-700 hover:bg-stone-100";

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <NavLink to="/" className="text-3xl font-bold text-stone-800 tracking-tight" onClick={closeMobileMenu}>
                    Fidel's Pizza
                </NavLink>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6 text-lg">
                    <NavLink to="/" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Home</NavLink>
                    {auth.isAuthenticated && (
                        <>
                            <NavLink to="/menu" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Menu</NavLink>
                            <NavLink to="/my-orders" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>My Orders</NavLink>
                        </>
                    )}
                    {auth.user?.role === 'admin' && <NavLink to="/admin" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Admin</NavLink>}
                    
                    {auth.isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-stone-600 text-base whitespace-nowrap">Welcome, {auth.user?.name}</span>
                            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-2">
                            <NavLink to="/login" className="px-4 py-2 rounded-full hover:bg-stone-100 transition-colors">Login</NavLink>
                            <NavLink to="/register" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors">
                                Register
                            </NavLink>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-stone-800 focus:outline-none">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-stone-200">
                    <nav className="flex flex-col items-center text-lg space-y-2 py-4 px-2">
                        <NavLink to="/" onClick={closeMobileMenu} className={({ isActive }) => `w-full text-center py-2 rounded-md ${isActive ? mobileActiveLinkClass : mobileInactiveLinkClass}`}>Home</NavLink>
                        {auth.isAuthenticated ? (
                            <>
                                <NavLink to="/menu" onClick={closeMobileMenu} className={({ isActive }) => `w-full text-center py-2 rounded-md ${isActive ? mobileActiveLinkClass : mobileInactiveLinkClass}`}>Menu</NavLink>
                                <NavLink to="/my-orders" onClick={closeMobileMenu} className={({ isActive }) => `w-full text-center py-2 rounded-md ${isActive ? mobileActiveLinkClass : mobileInactiveLinkClass}`}>My Orders</NavLink>
                                {auth.user?.role === 'admin' && <NavLink to="/admin" onClick={closeMobileMenu} className={({ isActive }) => `w-full text-center py-2 rounded-md ${isActive ? mobileActiveLinkClass : mobileInactiveLinkClass}`}>Admin</NavLink>}
                                <div className="pt-4 border-t w-full text-center space-y-3">
                                    <span className="text-stone-600 text-base">Welcome, {auth.user?.name}</span>
                                    <button onClick={handleLogout} className="w-11/12 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pt-4 border-t w-full text-center space-y-3">
                                <NavLink to="/login" onClick={closeMobileMenu} className="block w-11/12 mx-auto py-2 rounded-full hover:bg-stone-100 transition-colors border border-stone-300">Login</NavLink>
                                <NavLink to="/register" onClick={closeMobileMenu} className="block w-11/12 mx-auto bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors">
                                    Register
                                </NavLink>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
