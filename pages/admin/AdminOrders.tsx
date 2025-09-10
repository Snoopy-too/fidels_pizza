
import React, { useState, useMemo } from 'react';
import type { Order, MenuItem } from '../../types';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal';
import { PICKUP_TIMES } from '../../services/mockData';

const ProductionSummary: React.FC<{ orders: Order[], menuItems: MenuItem[] }> = ({ orders, menuItems }) => {
    const [pizzaSort, setPizzaSort] = useState<{ key: string, dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' });
    const [timeSort, setTimeSort] = useState<{ key: string, dir: 'asc' | 'desc' }>({ key: 'time', dir: 'asc' });
    
    const summary = useMemo(() => {
        const activeOrders = orders.filter(o => o.status !== 'cancelled');
        
        const totalPizzas: Record<string, number> = {};
        const timeBreakdown: Record<string, Record<string, number>> = {};

        for (const order of activeOrders) {
            const time = order.pickupTime || 'Unassigned';
            if (!timeBreakdown[time]) {
                timeBreakdown[time] = {};
            }
            for (const item of order.items) {
                totalPizzas[item.menuItem.name] = (totalPizzas[item.menuItem.name] || 0) + item.quantity;
                timeBreakdown[time][item.menuItem.name] = (timeBreakdown[time][item.menuItem.name] || 0) + item.quantity;
            }
        }
        return { totalPizzas, timeBreakdown };
    }, [orders]);

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
            <h2 className="text-3xl font-bold mb-4">Production Summary</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-stone-50 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Total Pizza Production</h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 cursor-pointer" onClick={() => handlePizzaSort('name')}>Pizza Type</th>
                                <th className="py-2 cursor-pointer" onClick={() => handlePizzaSort('count')}>Total</th>
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
                    <h3 className="text-xl font-semibold mb-2">Production by Pick-up Time</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2 cursor-pointer" onClick={() => handleTimeSort('time')}>Time</th>
                                    {menuItems.map(item => <th key={item.id} className="py-2 text-center">{item.name}</th>)}
                                    <th className="py-2 text-center font-bold">Total</th>
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
    const { orders, updateOrder, menuItems } = useApp();
    const [filter, setFilter] = useState('');
    const [sortBy, setSortBy] = useState<{ key: keyof Order | 'user.name' | 'totalAmount' | 'pickupTime'; direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Manage Orders</h2>
            <input
                type="text"
                placeholder="Filter by customer, item, or order #"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
            />
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead className="bg-stone-100">
                        <tr>
                            {['Order ID', 'Customer', 'Items', 'Total', 'Pick-up Time', 'Date', 'Status', 'Actions'].map((header, i) => {
                               const keys: (keyof Order | 'user.name' | 'totalAmount' | 'pickupTime' | null)[] = ['id', 'user.name', null, 'totalAmount', 'pickupTime', 'createdAt', 'status', null];
                               return (
                                <th key={header} className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => keys[i] && handleSort(keys[i]!)}>{header}</th>
                               )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedOrders.map(order => (
                            <tr key={order.id} className="hover:bg-stone-50">
                                <td className="py-2 px-4 border-b">{String(order.id).padStart(4, '0')}</td>
                                <td className="py-2 px-4 border-b">{order.user.name}</td>
                                <td className="py-2 px-4 border-b">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                                <td className="py-2 px-4 border-b">{order.totalAmount.toLocaleString()} JPY</td>
                                <td className="py-2 px-4 border-b">{order.pickupTime || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">
                                    <span className={`px-2 py-1 text-sm rounded-full ${
                                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>{order.status}</span>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:underline">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order #${String(selectedOrder?.id).padStart(4, '0')}`}>
                {selectedOrder && (
                    <div className="space-y-4">
                        <p><strong>Customer:</strong> {selectedOrder.user.name} ({selectedOrder.user.email})</p>
                        <div>
                            <strong>Items:</strong>
                            <ul className="list-disc pl-5 mt-1">
                                {selectedOrder.items.map(item => (
                                    <li key={item.id}>{item.menuItem.name} x {item.quantity}</li>
                                ))}
                            </ul>
                        </div>
                        <p><strong>Total:</strong> {selectedOrder.totalAmount.toLocaleString()} JPY</p>
                        <div className="flex items-center space-x-2">
                             <strong>Status:</strong>
                             <select value={selectedOrder.status} onChange={(e) => handleOrderUpdate(selectedOrder, { status: e.target.value as any })} className="p-1 border rounded">
                                 <option value="pending">Pending</option>
                                 <option value="completed">Completed</option>
                                 <option value="cancelled">Cancelled</option>
                             </select>
                        </div>
                        <div className="flex items-center space-x-2">
                             <strong>Pick-up Time:</strong>
                             <select value={selectedOrder.pickupTime || ''} onChange={(e) => handleOrderUpdate(selectedOrder, { pickupTime: e.target.value })} className="p-1 border rounded">
                                 <option value="">N/A</option>
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