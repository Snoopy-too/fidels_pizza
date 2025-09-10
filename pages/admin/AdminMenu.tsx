import React, { useState } from 'react';
import type { MenuItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLocale } from '../../context/LocaleContext';
import Modal from '../../components/Modal';

const EMPTY_MENU_ITEM: Omit<MenuItem, 'id'> = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    available: true,
};

const AdminMenu: React.FC = () => {
    const { menuItems, updateMenuItem, addMenuItem, deleteMenuItem, showConfirm } = useApp();
    const { t } = useLocale();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<MenuItem | Omit<MenuItem, 'id'>>(EMPTY_MENU_ITEM);
    const [isEditing, setIsEditing] = useState(false);

    const openEditModal = (item: MenuItem) => {
        setCurrentItem(item);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setCurrentItem(EMPTY_MENU_ITEM);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (isEditing) {
            updateMenuItem(currentItem as MenuItem);
        } else {
            addMenuItem(currentItem);
        }
        setIsModalOpen(false);
    };
    
    const handleDelete = (id: number) => {
        showConfirm(
            t('admin.menu.confirmDeleteTitle'),
            t('admin.menu.confirmDeleteMessage'),
            () => deleteMenuItem(id)
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        let processedValue: string | number | boolean = value;
        if(type === 'number') processedValue = parseFloat(value);
        if (e.target.type === 'checkbox') processedValue = (e.target as HTMLInputElement).checked;

        setCurrentItem(prev => ({ ...prev, [name]: processedValue }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">{t('admin.menu.title')}</h2>
                <button onClick={openAddModal} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                    {t('admin.menu.addNewBtn')}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
                    <div key={item.id} className="border p-4 rounded-lg shadow space-y-2">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover rounded-md mb-2"/>
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        <p className="text-stone-600">{item.description}</p>
                        <p className="font-semibold">{item.price} {t('currency')}</p>
                        <p>{t('admin.menu.statusLabel')} <span className={item.available ? 'text-green-600' : 'text-red-600'}>{item.available ? t('admin.menu.available') : t('admin.menu.unavailable')}</span></p>
                        <div className="flex space-x-2 pt-2">
                            <button onClick={() => openEditModal(item)} className="bg-blue-500 text-white px-3 py-1 rounded">{t('admin.menu.editBtn')}</button>
                            <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">{t('admin.menu.deleteBtn')}</button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? t('admin.menu.modal.editTitle') : t('admin.menu.modal.addTitle')}>
                <div className="space-y-4">
                    <input name="name" value={currentItem.name} onChange={handleChange} placeholder={t('admin.menu.modal.namePlaceholder')} className="w-full p-2 border rounded"/>
                    <textarea name="description" value={currentItem.description} onChange={handleChange} placeholder={t('admin.menu.modal.descriptionPlaceholder')} className="w-full p-2 border rounded"/>
                    <input name="price" type="number" value={currentItem.price} onChange={handleChange} placeholder={t('admin.menu.modal.pricePlaceholder')} className="w-full p-2 border rounded"/>
                    <input name="imageUrl" value={currentItem.imageUrl} onChange={handleChange} placeholder={t('admin.menu.modal.imageUrlPlaceholder')} className="w-full p-2 border rounded"/>
                    <div className="flex items-center">
                        <input name="available" id="available" type="checkbox" checked={currentItem.available} onChange={handleChange} className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"/>
                        <label htmlFor="available" className="ml-2 block text-sm text-gray-900">{t('admin.menu.modal.availableLabel')}</label>
                    </div>
                    <button onClick={handleSave} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full">{isEditing ? t('admin.menu.modal.saveBtn') : t('admin.menu.modal.addBtn')}</button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminMenu;