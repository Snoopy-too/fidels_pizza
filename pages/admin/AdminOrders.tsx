
import React, { useState, useMemo } from 'react';
import type { Order } from '../../types';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal';

const AdminOrders: React.FC = () => {
    const { orders, updateOrder } = useApp();
    const [filter, setFilter] = useState('');
    const [sortBy, setSortBy] = useState<{ key: keyof Order | 'user.name' | 'totalAmount'; direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });
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
                if(sortBy.key === 'user.name') {
                    valA = a.user.name;
                    valB = b.user.name;
                } else {
                    valA = a[sortBy.key as keyof Order];
                    valB = b[sortBy.key as keyof Order];
                }

                if (valA < valB) return sortBy.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortBy.direction === 'asc' ? 1 : -1;
                return 0;
            });
    }, [orders, filter, sortBy]);

    const handleSort = (key: keyof Order | 'user.name' | 'totalAmount') => {
        if (sortBy.key === key) {
            setSortBy({ key, direction: sortBy.direction === 'asc' ? 'desc' : 'asc' });
        } else {
            setSortBy({ key, direction: 'asc' });
        }
    };
    
    const handleStatusChange = (order: Order, status: 'pending' | 'completed' | 'cancelled') => {
        updateOrder({ ...order, status });
        setSelectedOrder(prev => prev ? { ...prev, status } : null);
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
                            {['Order ID', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Actions'].map((header, i) => {
                               const keys: (keyof Order | 'user.name' | 'totalAmount' | null)[] = ['id', 'user.name', null, 'totalAmount', 'createdAt', 'status', null];
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
                             <select value={selectedOrder.status} onChange={(e) => handleStatusChange(selectedOrder, e.target.value as any)} className="p-1 border rounded">
                                 <option value="pending">Pending</option>
                                 <option value="completed">Completed</option>
                                 <option value="cancelled">Cancelled</option>
                             </select>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminOrders;