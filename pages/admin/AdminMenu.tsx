
import React, { useState } from 'react';
import type { MenuItem } from '../../types';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal';

const EMPTY_MENU_ITEM: Omit<MenuItem, 'id'> = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    available: true,
};

const AdminMenu: React.FC = () => {
    const { menuItems, updateMenuItem, addMenuItem, deleteMenuItem } = useApp();
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
        if (window.confirm('Are you sure you want to delete this item?')) {
            deleteMenuItem(id);
        }
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
                <h2 className="text-3xl font-bold">Manage Menu</h2>
                <button onClick={openAddModal} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                    Add New Item
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
                    <div key={item.id} className="border p-4 rounded-lg shadow space-y-2">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover rounded-md mb-2"/>
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        <p className="text-stone-600">{item.description}</p>
                        <p className="font-semibold">{item.price} JPY</p>
                        <p>Status: <span className={item.available ? 'text-green-600' : 'text-red-600'}>{item.available ? 'Available' : 'Unavailable'}</span></p>
                        <div className="flex space-x-2 pt-2">
                            <button onClick={() => openEditModal(item)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}>
                <div className="space-y-4">
                    <input name="name" value={currentItem.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded"/>
                    <textarea name="description" value={currentItem.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded"/>
                    <input name="price" type="number" value={currentItem.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded"/>
                    <input name="imageUrl" value={currentItem.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded"/>
                    <div className="flex items-center">
                        <input name="available" id="available" type="checkbox" checked={currentItem.available} onChange={handleChange} className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"/>
                        <label htmlFor="available" className="ml-2 block text-sm text-gray-900">Available</label>
                    </div>
                    <button onClick={handleSave} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full">{isEditing ? 'Save Changes' : 'Add Item'}</button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminMenu;
