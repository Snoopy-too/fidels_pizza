import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLocale } from '../../context/LocaleContext';

const AdminProfile: React.FC = () => {
    const { auth, updateUserProfile } = useApp();
    const { t } = useLocale();
    const [formData, setFormData] = useState({
        name: auth.user?.name || '',
        email: auth.user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: t('profile.passwordMismatch') });
            return;
        }

        const updates: { name?: string; email?: string; currentPassword?: string; newPassword?: string; } = {};

        if(formData.name !== auth.user?.name) updates.name = formData.name;
        if(formData.email !== auth.user?.email) updates.email = formData.email;
        if(formData.newPassword) {
            updates.currentPassword = formData.currentPassword;
            updates.newPassword = formData.newPassword;
        }

        if (Object.keys(updates).length === 0 && !updates.newPassword) {
             setMessage({ type: 'error', text: t('profile.noChanges') });
             return;
        }
        
        const result = updateUserProfile(updates);
        
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    if (!auth.user) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">{t('profile.title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                {message && (
                    <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="p-4 border rounded-lg">
                     <h3 className="text-xl font-semibold mb-2">{t('profile.accountDetails.title')}</h3>
                     <div>
                        <label className="block font-medium">{t('profile.accountDetails.name')}</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded"/>
                    </div>
                     <div className="mt-4">
                        <label className="block font-medium">{t('profile.accountDetails.email')}</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded"/>
                    </div>
                </div>

                <div className="p-4 border rounded-lg">
                     <h3 className="text-xl font-semibold mb-2">{t('profile.changePassword.title')}</h3>
                     <div>
                        <label className="block font-medium">{t('profile.changePassword.current')}</label>
                        <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="w-full p-2 border rounded" placeholder={t('profile.changePassword.currentPlaceholder')}/>
                    </div>
                     <div className="mt-4">
                        <label className="block font-medium">{t('profile.changePassword.new')}</label>
                        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full p-2 border rounded" placeholder={t('profile.changePassword.newPlaceholder')}/>
                    </div>
                     <div className="mt-4">
                        <label className="block font-medium">{t('profile.changePassword.confirm')}</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border rounded"/>
                    </div>
                </div>
                
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">{t('profile.saveBtn')}</button>
            </form>
        </div>
    );
};

export default AdminProfile;