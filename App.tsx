
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
    const { modalState, hideModal } = useApp();

    const handleConfirm = () => {
        if (modalState && modalState.onConfirm) {
            modalState.onConfirm();
        }
        hideModal();
    };

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
            
            {modalState && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center"
                    onClick={hideModal}
                    aria-modal="true"
                    role="dialog"
                >
                    <div 
                        className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 p-6 relative animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-stone-800">{modalState.title}</h3>
                            <button onClick={hideModal} className="text-stone-500 hover:text-stone-800 text-3xl font-light">&times;</button>
                        </div>
                        <p className="text-stone-600 mb-6 whitespace-pre-wrap">{modalState.message}</p>
                        <div className="flex justify-end space-x-3">
                            {modalState.type === 'confirm' && (
                                <button
                                    onClick={hideModal}
                                    className="px-4 py-2 rounded-md bg-stone-200 text-stone-800 hover:bg-stone-300 transition-colors"
                                >
                                    {modalState.cancelText || 'Cancel'}
                                </button>
                            )}
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                                {modalState.confirmText || 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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