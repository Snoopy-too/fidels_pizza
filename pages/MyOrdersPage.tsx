import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLocale } from '../context/LocaleContext';
import type { Order, CartItem } from '../types';

const MyOrdersPage: React.FC = () => {
    const { auth, orders, cancelOrder, updateOrder, showConfirm } = useApp();
    const { t, locale } = useLocale();
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [editedItems, setEditedItems] = useState<CartItem[]>([]);

    if (!auth.user) {
        return <p>Please log in to see your orders.</p>;
    }

    const userOrders = orders.filter(order => order.user.id === auth.user!.id);

    const handleCancelOrder = (orderId: number) => {
        showConfirm(
            t('myOrders.confirmCancelTitle'), 
            t('myOrders.confirmCancelMessage'),
            () => {
                cancelOrder(orderId);
                if (editingOrderId === orderId) {
                    setEditingOrderId(null);
                    setEditedItems([]);
                }
            }
        );
    };

    const handleStartUpdate = (order: Order) => {
        setEditingOrderId(order.id);
        setEditedItems(order.items.map(item => ({
            menuItem: item.menuItem,
            quantity: item.quantity,
        })));
    };

    const handleCancelUpdate = () => {
        setEditingOrderId(null);
        setEditedItems([]);
    };

    const handleSaveChanges = () => {
        if (editingOrderId) {
            if (editedItems.reduce((sum, item) => sum + item.quantity, 0) === 0) {
                 showConfirm(
                    t('myOrders.confirmEmptyTitle'),
                    t('myOrders.confirmEmptyMessage'),
                    () => {
                        cancelOrder(editingOrderId);
                        handleCancelUpdate(); // Exit editing mode
                    },
                    t('myOrders.confirmEmptyBtn')
                );
            } else {
                updateOrder(editingOrderId, editedItems);
                handleCancelUpdate(); // Exit editing mode
            }
        }
    };
    
    const handleItemQuantityChange = (itemId: number, newQuantity: number) => {
        setEditedItems(currentItems => {
            if (newQuantity <= 0) {
                return currentItems.filter(item => item.menuItem.id !== itemId);
            }
            return currentItems.map(item => {
                if (item.menuItem.id === itemId) {
                    return { ...item, quantity: Math.min(newQuantity, 15) };
                }
                return item;
            });
        });
    };

    const calculateTotal = (items: CartItem[]) => {
        return items.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
    };

    const renderOrderCard = (order: Order) => {
        const isEditing = editingOrderId === order.id;

        return (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600 transition-all duration-300">
                <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                    <div>
                        <h2 className="text-2xl font-bold text-stone-800">{t('myOrders.order')} #{String(order.id).padStart(4, '0')}</h2>
                        <p className="text-sm text-stone-500">
                            {t('myOrders.placedOn')} {new Date(order.createdAt).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-sm text-stone-500">{t('myOrders.pickupTime')} <span className="font-semibold">{order.pickupTime || t('myOrders.unassigned')}</span></p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>{t(`order.status.${order.status}`)}</span>
                </div>
                
                {isEditing ? (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold mb-2">{t('myOrders.editOrderTitle')}</h3>
                        {editedItems.length > 0 ? editedItems.map(item => (
                            <div key={item.menuItem.id} className="flex justify-between items-center border-b pb-2">
                                <span>{item.menuItem.name}</span>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => handleItemQuantityChange(item.menuItem.id, item.quantity - 1)} className="bg-stone-200 hover:bg-stone-300 w-7 h-7 rounded-full font-bold flex items-center justify-center">-</button>
                                    <span className="w-6 text-center">{item.quantity}</span>
                                    <button onClick={() => handleItemQuantityChange(item.menuItem.id, item.quantity + 1)} disabled={item.quantity >= 15} className="bg-stone-200 hover:bg-stone-300 w-7 h-7 rounded-full font-bold flex items-center justify-center disabled:opacity-50">+</button>
                                </div>
                            </div>
                        )) : <p className="text-stone-500">{t('myOrders.emptyOrder')}</p>}
                    </div>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{t('myOrders.summaryTitle')}</h3>
                        <ul className="list-disc pl-5 space-y-1 text-stone-700">
                            {order.items.map(item => (
                                <li key={item.id}>
                                    {item.menuItem.name} x {item.quantity} - {(item.price * item.quantity).toLocaleString(locale)} {t('currency')}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="border-t mt-4 pt-4 flex justify-between items-center">
                    <p className="text-xl font-bold text-stone-800">
                        {t('myOrders.total')} {(isEditing ? calculateTotal(editedItems) : order.totalAmount).toLocaleString(locale)} {t('currency')}
                    </p>
                    {order.status === 'pending' && (
                        isEditing ? (
                            <div className="flex space-x-2">
                                <button onClick={handleSaveChanges} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                                    {t('myOrders.saveChangesBtn')}
                                </button>
                                <button onClick={handleCancelUpdate} className="bg-stone-500 text-white px-4 py-2 rounded-md hover:bg-stone-600">
                                    {t('myOrders.discardChangesBtn')}
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <button onClick={() => handleStartUpdate(order)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    {t('myOrders.updateOrderBtn')}
                                </button>
                                <button onClick={() => handleCancelOrder(order.id)} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                                    {t('myOrders.cancelOrderBtn')}
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-center mb-10">{t('myOrders.title')}</h1>
            {userOrders.length === 0 ? (
                <p className="text-center text-stone-600 text-lg">{t('myOrders.noOrders')}</p>
            ) : (
                <div className="space-y-6 max-w-4xl mx-auto">
                    {userOrders.map(renderOrderCard)}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;