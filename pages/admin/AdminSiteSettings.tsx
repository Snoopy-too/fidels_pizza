
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const AdminSiteSettings: React.FC = () => {
    const { eventInfo, updateEventInfo, landingContent, updateLandingContent, accessCode, updateAccessCode } = useApp();
    
    const [localEventInfo, setLocalEventInfo] = useState(eventInfo);
    const [localLandingContent, setLocalLandingContent] = useState(landingContent);
    const [localAccessCode, setLocalAccessCode] = useState(accessCode);

    const handleEventSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateEventInfo(localEventInfo);
        alert('Event information updated!');
    };
    
    const handleLandingSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateLandingContent(localLandingContent);
        alert('Landing page content updated!');
    };
    
    const handleCodeSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateAccessCode(localAccessCode);
        alert('Access code updated!');
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-4">Event & Site Management</h2>
                <form onSubmit={handleEventSave} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold">Event Details</h3>
                    <div>
                        <label className="block font-medium">Event Date</label>
                        <input type="date" value={localEventInfo.date} onChange={e => setLocalEventInfo({...localEventInfo, date: e.target.value})} className="w-full p-2 border rounded"/>
                    </div>
                    <div>
                        <label className="block font-medium">Event Address</label>
                        <input type="text" value={localEventInfo.address} onChange={e => setLocalEventInfo({...localEventInfo, address: e.target.value})} className="w-full p-2 border rounded"/>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Event Details</button>
                </form>
            </div>
            
            <div>
                <form onSubmit={handleLandingSave} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold">Landing Page Content</h3>
                    <div>
                        <label className="block font-medium">Title</label>
                        <input type="text" value={localLandingContent.title} onChange={e => setLocalLandingContent({...localLandingContent, title: e.target.value})} className="w-full p-2 border rounded"/>
                    </div>
                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea value={localLandingContent.description} onChange={e => setLocalLandingContent({...localLandingContent, description: e.target.value})} className="w-full p-2 border rounded" rows={4}></textarea>
                    </div>
                     <div>
                        <label className="block font-medium">Image URLs (comma-separated)</label>
                        <input type="text" value={localLandingContent.images.join(', ')} onChange={e => setLocalLandingContent({...localLandingContent, images: e.target.value.split(',').map(s => s.trim())})} className="w-full p-2 border rounded"/>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Landing Page</button>
                </form>
            </div>

            <div>
                <form onSubmit={handleCodeSave} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold">Registration Access Code</h3>
                    <div>
                        <label className="block font-medium">4-Digit Code</label>
                        <input type="text" value={localAccessCode} maxLength={4} onChange={e => setLocalAccessCode(e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Access Code</button>
                </form>
            </div>
        </div>
    );
};

export default AdminSiteSettings;
