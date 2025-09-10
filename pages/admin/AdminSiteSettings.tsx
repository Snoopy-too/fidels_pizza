import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLocale } from '../../context/LocaleContext';

const AdminSiteSettings: React.FC = () => {
    const { eventInfo, updateEventInfo, landingContent, updateLandingContent, accessCode, updateAccessCode, clearAllOrders, showAlert, showConfirm } = useApp();
    const { t } = useLocale();
    
    const [localEventInfo, setLocalEventInfo] = useState(eventInfo);
    const [localLandingContent, setLocalLandingContent] = useState(landingContent);
    const [localAccessCode, setLocalAccessCode] = useState(accessCode);

    const handleEventSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateEventInfo(localEventInfo);
        showAlert(t('admin.settings.updateSuccessTitle'), t('admin.settings.eventUpdateSuccess'));
    };
    
    const handleLandingSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateLandingContent(localLandingContent);
        showAlert(t('admin.settings.updateSuccessTitle'), t('admin.settings.landingUpdateSuccess'));
    };
    
    const handleCodeSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateAccessCode(localAccessCode);
        showAlert(t('admin.settings.updateSuccessTitle'), t('admin.settings.codeUpdateSuccess'));
    };

    const handleClearOrders = () => {
        showConfirm(
            t('admin.settings.clearOrdersConfirmTitle'),
            t('admin.settings.clearOrdersConfirmMessage'),
            () => {
                clearAllOrders(true);
                showAlert(t('admin.settings.clearOrdersSuccessTitle'), t('admin.settings.clearOrdersSuccessMessage'));
            }
        );
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-4">{t('admin.settings.title')}</h2>
                <form onSubmit={handleEventSave} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold">{t('admin.settings.eventDetails.title')}</h3>
                    <div>
                        <label className="block font-medium">{t('admin.settings.eventDetails.date')}</label>
                        <input type="date" value={localEventInfo.date} onChange={e => setLocalEventInfo({...localEventInfo, date: e.target.value})} className="w-full p-2 border rounded"/>
                    </div>
                    <div>
                        <label className="block font-medium">{t('admin.settings.eventDetails.address')}</label>
                        <input type="text" value={localEventInfo.address} onChange={e => setLocalEventInfo({...localEventInfo, address: e.target.value})} className="w-full p-2 border rounded"/>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{t('admin.settings.eventDetails.saveBtn')}</button>
                </form>
            </div>
            
            <div>
                <form onSubmit={handleLandingSave} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold">{t('admin.settings.landingContent.title')}</h3>
                    <div>
                        <label className="block font-medium">{t('admin.settings.landingContent.pageTitle')}</label>
                        <input type="text" value={localLandingContent.title} onChange={e => setLocalLandingContent({...localLandingContent, title: e.target.value})} className="w-full p-2 border rounded"/>
                    </div>
                    <div>
                        <label className="block font-medium">{t('admin.settings.landingContent.description')}</label>
                        <textarea value={localLandingContent.description} onChange={e => setLocalLandingContent({...localLandingContent, description: e.target.value})} className="w-full p-2 border rounded" rows={4}></textarea>
                    </div>
                     <div>
                        <label className="block font-medium">{t('admin.settings.landingContent.imageUrls')}</label>
                        <input type="text" value={localLandingContent.images.join(', ')} onChange={e => setLocalLandingContent({...localLandingContent, images: e.target.value.split(',').map(s => s.trim())})} className="w-full p-2 border rounded"/>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{t('admin.settings.landingContent.saveBtn')}</button>
                </form>
            </div>

            <div>
                <form onSubmit={handleCodeSave} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold">{t('admin.settings.accessCode.title')}</h3>
                    <div>
                        <label className="block font-medium">{t('admin.settings.accessCode.code')}</label>
                        <input type="text" value={localAccessCode} maxLength={4} onChange={e => setLocalAccessCode(e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{t('admin.settings.accessCode.saveBtn')}</button>
                </form>
            </div>

            <div>
                <div className="p-4 border border-red-300 rounded-lg bg-red-50">
                    <h3 className="text-xl font-semibold text-red-800">{t('admin.settings.dangerZone.title')}</h3>
                    <p className="text-red-700 mt-2">
                        {t('admin.settings.dangerZone.description')}
                    </p>
                    <button 
                        onClick={handleClearOrders}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        {t('admin.settings.dangerZone.clearOrdersBtn')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSiteSettings;