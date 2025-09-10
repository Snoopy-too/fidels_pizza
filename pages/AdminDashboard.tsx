
import React, { useState } from 'react';
import AdminOrders from './admin/AdminOrders';
import AdminSiteSettings from './admin/AdminSiteSettings';
import AdminMenu from './admin/AdminMenu';

type AdminTab = 'orders' | 'settings' | 'menu';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('orders');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'orders':
                return <AdminOrders />;
            case 'settings':
                return <AdminSiteSettings />;
            case 'menu':
                return <AdminMenu />;
            default:
                return null;
        }
    };

    const getTabClass = (tabName: AdminTab) => {
        return `px-6 py-3 font-semibold rounded-t-lg cursor-pointer transition-colors ${
            activeTab === tabName ? 'bg-white text-red-600' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
        }`;
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Administrator Control Panel</h1>
            <div className="flex border-b border-stone-300 mb-6">
                <div onClick={() => setActiveTab('orders')} className={getTabClass('orders')}>Orders Management</div>
                <div onClick={() => setActiveTab('menu')} className={getTabClass('menu')}>Menu Management</div>
                <div onClick={() => setActiveTab('settings')} className={getTabClass('settings')}>Event & Site Management</div>
            </div>
            <div className="bg-white p-6 rounded-b-lg rounded-tr-lg shadow-md">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
