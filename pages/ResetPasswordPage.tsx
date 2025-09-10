import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLocale } from '../context/LocaleContext';

const ResetPasswordPage: React.FC = () => {
    const { resetPassword } = useApp();
    const { t } = useLocale();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [token, setToken] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (!urlToken) {
            setMessage({ type: 'error', text: t('resetPassword.noToken') });
        }
        setToken(urlToken);
    }, [searchParams, t]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: t('resetPassword.passwordMismatch') });
            return;
        }
        if (password.length < 6) {
             setMessage({ type: 'error', text: t('resetPassword.passwordLengthError') });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        // Simulate network delay
        setTimeout(() => {
            const result = resetPassword(token, password);
            setMessage({ type: result.success ? 'success' : 'error', text: result.message });
            setIsLoading(false);

            if (result.success) {
                setTimeout(() => navigate('/login'), 2000);
            }
        }, 500);
    };

    return (
        <div className="max-w-sm mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-stone-800 mb-6">{t('resetPassword.title')}</h2>
            
            {!token ? (
                 <div className="text-center">
                    {message && <p className="p-3 rounded-md text-sm bg-red-100 text-red-800">{message.text}</p>}
                    <Link to="/forgot-password" className="text-sm text-red-600 hover:underline mt-4 block">
                        {t('resetPassword.requestNewLink')}
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                     <p className="text-center text-stone-600">{t('resetPassword.prompt')}</p>
                    {message && (
                        <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                            {message.type === 'success' && t('resetPassword.redirecting')}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-stone-700">{t('resetPassword.newPassword')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-stone-700">{t('resetPassword.confirmPassword')}</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-stone-400">
                        {isLoading ? t('resetPassword.resettingBtn') : t('resetPassword.resetBtn')}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ResetPasswordPage;