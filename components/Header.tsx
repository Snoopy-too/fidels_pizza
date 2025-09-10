
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
    const { auth, logout } = useApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const activeLinkClass = "text-red-600 border-b-2 border-red-600";
    const inactiveLinkClass = "hover:text-red-600 transition-colors";

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <NavLink to="/" className="text-3xl font-bold text-stone-800 tracking-tight">
                    Fidel's Pizza
                </NavLink>
                <nav className="hidden md:flex items-center space-x-6 text-lg">
                    <NavLink to="/" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Home</NavLink>
                    {auth.isAuthenticated && <NavLink to="/menu" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Menu</NavLink>}
                    {auth.user?.role === 'admin' && <NavLink to="/admin" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Admin</NavLink>}
                    
                    {auth.isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-stone-600">Welcome, {auth.user?.name}</span>
                            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <NavLink to="/login" className="px-4 py-2 rounded-full hover:bg-stone-100 transition-colors">Login</NavLink>
                            <NavLink to="/register" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors">
                                Register
                            </NavLink>
                        </div>
                    )}
                </nav>
                <div className="md:hidden">
                    {/* Mobile menu button can be added here */}
                </div>
            </div>
        </header>
    );
};

export default Header;
