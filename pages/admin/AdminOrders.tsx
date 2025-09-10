import React, { useState, useMemo } from 'react';
import type { Order, MenuItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLocale } from '../../context/LocaleContext';
import Modal from '../../components/Modal';
import { PICKUP_TIMES } from '../../services/mockData';

const ProductionSummary: React.FC<{ orders: Order[], menuItems: MenuItem[] }> = ({ orders, menuItems }) => {
    const { t } = useLocale();
    const [pizzaSort, setPizzaSort] = useState<{ key: string, dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' });
    const [timeSort, setTimeSort] = useState<{ key: string, dir: 'asc' | 'desc' }>({ key: 'time', dir: 'asc' });
    
    const summary = useMemo(() => {
        const activeOrders = orders.filter(o => o.status !== 'cancelled');
        
        const totalPizzas: Record<string, number> = {};
        const timeBreakdown: Record<string, Record<string, number>> = {};

        for (const order of activeOrders) {
            const time = order.pickupTime || t('myOrders.unassigned');
            if (!timeBreakdown[time]) {
                timeBreakdown[time] = {};
            }
            for (const item of order.items) {
                totalPizzas[item.menuItem.name] = (totalPizzas[item.menuItem.name] || 0) + item.quantity;
                timeBreakdown[time][item.menuItem.name] = (timeBreakdown[time][item.menuItem.name] || 0) + item.quantity;
            }
        }
        return { totalPizzas, timeBreakdown };
    }, [orders, t]);

    const sortedPizzaTotals = useMemo(() => {
        return Object.entries(summary.totalPizzas).sort(([nameA, countA], [nameB, countB]) => {
            if (pizzaSort.key === 'name') {
                return nameA.localeCompare(nameB) * (pizzaSort.dir === 'asc' ? 1 : -1);
            }
            return (countA - countB) * (pizzaSort.dir === 'asc' ? 1 : -1);
        });
    }, [summary.totalPizzas, pizzaSort]);
    
    const sortedTimeBreakdown = useMemo(() => {
        return Object.entries(summary.timeBreakdown).sort(([timeA], [timeB]) => {
            if (timeSort.key === 'time') {
                return timeA.localeCompare(timeB) * (timeSort.dir === 'asc' ? 1 : -1);
            }
            // Add sorting for other columns if needed
            return 0;
        });
    }, [summary.timeBreakdown, timeSort]);
    
    const handlePizzaSort = (key: string) => {
        setPizzaSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
    }
    const handleTimeSort = (key: string) => {
        setTimeSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
    }

    return (
        <div className="mt-12">
            <h2 className="text-3xl font-bold mb-4">{t('admin.orders.productionSummary.title')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-stone-50 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">{t('admin.orders.productionSummary.totalPizza')}</h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 cursor-pointer" onClick={() => handlePizzaSort('name')}>{t('admin.orders.productionSummary.pizzaType')}</th>
                                <th className="py-2 cursor-pointer" onClick={() => handlePizzaSort('count')}>{t('admin.orders.productionSummary.total')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPizzaTotals.map(([name, count]) => (
                                <tr key={name} className="border-b">
                                    <td className="py-2">{name}</td>
                                    <td className="py-2">{count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="lg:col-span-2 bg-stone-50 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">{t('admin.orders.productionSummary.byTime')}</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2 cursor-pointer" onClick={() => handleTimeSort('time')}>{t('admin.orders.productionSummary.time')}</th>
                                    {menuItems.map(item => <th key={item.id} className="py-2 text-center">{item.name}</th>)}
                                    <th className="py-2 text-center font-bold">{t('admin.orders.productionSummary.total')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTimeBreakdown.map(([time, pizzaCounts]) => {
                                    const totalForSlot = Object.values(pizzaCounts).reduce((sum, count) => sum + count, 0);
                                    return (
                                        <tr key={time} className="border-b">
                                            <td className="py-2 font-semibold">{time}</td>
                                            {menuItems.map(item => <td key={item.id} className="py-2 text-center">{pizzaCounts[item.name] || 0}</td>)}
                                            <td className="py-2 text-center font-bold">{totalForSlot}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};


const AdminOrders: React.FC = () => {
    const { orders, updateOrder, menuItems, bulkUpdateOrders, showAlert, showConfirm } = useApp();
    const { t, locale } = useLocale();
    const [filter, setFilter] = useState('');
    const [sortBy, setSortBy] = useState<{ key: keyof Order | 'user.name' | 'totalAmount' | 'pickupTime'; direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedOrderIds, setSelectedOrderIds] = useState<Set<number>>(new Set());
    const [bulkPickupTime, setBulkPickupTime] = useState('');

    const filteredAndSortedOrders = useMemo(() => {
        return orders
            .filter(order => 
                order.user.name.toLowerCase().includes(filter.toLowerCase()) ||
                order.id.toString().includes(filter) ||
                order.items.some(item => item.menuItem.name.toLowerCase().includes(filter.toLowerCase()))
            )
            .sort((a, b) => {
                let valA: any, valB: any;
                if (sortBy.key === 'user.name') {
                    valA = a.user.name;
                    valB = b.user.name;
                } else if (sortBy.key === 'pickupTime') {
                    valA = a.pickupTime || 'zzz'; // a little hack to sort empty times last
                    valB = b.pickupTime || 'zzz';
                } else {
                    valA = a[sortBy.key as keyof Order];
                    valB = b[sortBy.key as keyof Order];
                }

                if (valA < valB) return sortBy.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortBy.direction === 'asc' ? 1 : -1;
                return 0;
            });
    }, [orders, filter, sortBy]);

    const handleSort = (key: keyof Order | 'user.name' | 'totalAmount' | 'pickupTime') => {
        if (sortBy.key === key) {
            setSortBy({ key, direction: sortBy.direction === 'asc' ? 'desc' : 'asc' });
        } else {
            setSortBy({ key, direction: 'asc' });
        }
    };
    
    const handleOrderUpdate = (order: Order, updates: Partial<Order>) => {
        const updatedOrder = { ...order, ...updates };
        updateOrder(updatedOrder);
        setSelectedOrder(prev => prev ? updatedOrder : null);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allVisibleIds = filteredAndSortedOrders.map(o => o.id);
            setSelectedOrderIds(new Set(allVisibleIds));
        } else {
            setSelectedOrderIds(new Set());
        }
    };

    const handleSelectOne = (orderId: number) => {
        setSelectedOrderIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const handleBulkUpdate = () => {
        if (!bulkPickupTime) {
            showAlert(t('admin.orders.missingInfoTitle'), t('admin.orders.missingInfoMessage'));
            return;
        }
        showConfirm(
            t('admin.orders.bulkUpdateConfirmTitle'),
            t('admin.orders.bulkUpdateConfirmMessage', { pickupTime: bulkPickupTime, count: selectedOrderIds.size }),
            () => {
                bulkUpdateOrders(selectedOrderIds, { pickupTime: bulkPickupTime });
                showAlert(
                    t('admin.orders.bulkUpdateSuccessTitle'),
                    t('admin.orders.bulkUpdateSuccessMessage', { count: selectedOrderIds.size })
                );
                setSelectedOrderIds(new Set());
                setBulkPickupTime('');
            }
        );
    };

    const orderStatusOptions = [
        { value: 'pending', label: t('order.status.pending') },
        { value: 'completed', label: t('order.status.completed') },
        { value: 'cancelled', label: t('order.status.cancelled') }
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">{t('admin.orders.title')}</h2>
            <input
                type="text"
                placeholder={t('admin.orders.filterPlaceholder')}
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
            />

            {selectedOrderIds.size > 0 && (
                <div className="bg-blue-100 border border-blue-300 text-blue-800 p-3 rounded-md mb-4 flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <span className="font-semibold">{t('admin.orders.selectedCount', { count: selectedOrderIds.size })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <select
                            value={bulkPickupTime}
                            onChange={e => setBulkPickupTime(e.target.value)}
                            className="p-2 border rounded-md bg-white text-stone-800 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">{t('admin.orders.setPickupTime')}</option>
                            {PICKUP_TIMES.map(time => <option key={time} value={time}>{time}</option>)}
                        </select>
                        <button
                            onClick={handleBulkUpdate}
                            disabled={!bulkPickupTime}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            {t('admin.orders.applyBtn')}
                        </button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead className="bg-stone-100">
                        <tr>
                            <th className="py-2 px-4 border-b">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={filteredAndSortedOrders.length > 0 && selectedOrderIds.size === filteredAndSortedOrders.length}
                                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                            </th>
                            {['id', 'customer', 'items', 'total', 'pickupTime', 'date', 'status', 'actions'].map((headerKey) => {
                               const keys: { [key: string]: keyof Order | 'user.name' | 'totalAmount' | 'pickupTime' | null } = {
                                   id: 'id', customer: 'user.name', items: null, total: 'totalAmount', 
                                   pickupTime: 'pickupTime', date: 'createdAt', status: 'status', actions: null
                               };
                               return (
                                <th key={headerKey} className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => keys[headerKey] && handleSort(keys[headerKey]!)}>
                                    {t(`admin.orders.headers.${headerKey}`)}
                                </th>
                               )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedOrders.map(order => (
                            <tr key={order.id} className={`hover:bg-stone-50 transition-colors ${selectedOrderIds.has(order.id) ? 'bg-blue-50' : ''}`}>
                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="checkbox"
                                        checked={selectedOrderIds.has(order.id)}
                                        onChange={() => handleSelectOne(order.id)}
                                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />
                                </td>
                                <td className="py-2 px-4 border-b">{String(order.id).padStart(4, '0')}</td>
                                <td className="py-2 px-4 border-b">{order.user.name}</td>
                                <td className="py-2 px-4 border-b">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                                <td className="py-2 px-4 border-b">{order.totalAmount.toLocaleString(locale)} {t('currency')}</td>
                                <td className="py-2 px-4 border-b">{order.pickupTime || t('admin.orders.notAvailable')}</td>
                                <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleDateString(locale)}</td>
                                <td className="py-2 px-4 border-b">
                                    <span className={`px-2 py-1 text-sm rounded-full ${
                                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>{t(`order.status.${order.status}`)}</span>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:underline">{t('admin.orders.viewAction')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={t('admin.orders.modalTitle', { orderId: String(selectedOrder?.id).padStart(4, '0') })}>
                {selectedOrder && (
                    <div className="space-y-4">
                        <p><strong>{t('admin.orders.customerLabel')}</strong> {selectedOrder.user.name} ({selectedOrder.user.email})</p>
                        <div>
                            <strong>{t('admin.orders.itemsLabel')}</strong>
                            <ul className="list-disc pl-5 mt-1">
                                {selectedOrder.items.map(item => (
                                    <li key={item.id}>{item.menuItem.name} x {item.quantity}</li>
                                ))}
                            </ul>
                        </div>
                        <p><strong>{t('admin.orders.totalLabel')}</strong> {selectedOrder.totalAmount.toLocaleString(locale)} {t('currency')}</p>
                        <div className="flex items-center space-x-2">
                             <strong>{t('admin.orders.statusLabel')}</strong>
                             <select value={selectedOrder.status} onChange={(e) => handleOrderUpdate(selectedOrder, { status: e.target.value as any })} className="p-1 border rounded">
                                 {orderStatusOptions.map(opt => (
                                     <option key={opt.value} value={opt.value}>{opt.label}</option>
                                 ))}
                             </select>
                        </div>
                        <div className="flex items-center space-x-2">
                             <strong>{t('admin.orders.pickupTimeLabel')}</strong>
                             <select value={selectedOrder.pickupTime || ''} onChange={(e) => handleOrderUpdate(selectedOrder, { pickupTime: e.target.value })} className="p-1 border rounded">
                                 <option value="">{t('admin.orders.notAvailable')}</option>
                                 {PICKUP_TIMES.map(time => <option key={time} value={time}>{time}</option>)}
                             </select>
                        </div>
                    </div>
                )}
            </Modal>
            
            <ProductionSummary orders={orders} menuItems={menuItems} />
        </div>
    );
};

export default AdminOrders;