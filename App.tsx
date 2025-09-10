
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import AdminDashboard from './pages/AdminDashboard';
import MyOrdersPage from './pages/MyOrdersPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { auth } = useApp();
    return auth.isAuthenticated && auth.user?.role === 'admin' ? children : <Navigate to="/login" />;
};

const UserRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { auth } = useApp();
    return auth.isAuthenticated ? children : <Navigate to="/login" />;
};


const AppContent: React.FC = () => {
    return (
        <HashRouter>
            <div className="flex flex-col min-h-screen bg-amber-50 text-stone-800">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/menu" element={
                            <UserRoute>
                                <MenuPage />
                            </UserRoute>
                        } />
                        <Route path="/my-orders" element={
                            <UserRoute>
                                <MyOrdersPage />
                            </UserRoute>
                        } />
                        <Route path="/admin" element={
                            <PrivateRoute>
                                <AdminDashboard />
                            </PrivateRoute>
                        } />
                    </Routes>
                </main>
                <Footer />
            </div>
        </HashRouter>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;