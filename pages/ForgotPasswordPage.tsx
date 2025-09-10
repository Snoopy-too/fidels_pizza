
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ForgotPasswordPage: React.FC = () => {
    const { requestPasswordReset } = useApp();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        
        // Simulate network delay
        setTimeout(() => {
            const result = requestPasswordReset(email);
            setMessage({ type: result.success ? 'success' : 'error', text: result.message });
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="max-w-sm mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-stone-800 mb-6">Forgot Password</h2>
            <p className="text-center text-stone-600 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                {message && (
                    <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        required
                        disabled={isLoading}
                    />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-stone-400">
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <div className="text-center">
                    <Link to="/login" className="text-sm text-red-600 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;
