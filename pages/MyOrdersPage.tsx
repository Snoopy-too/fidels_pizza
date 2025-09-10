
import React from 'react';
import { useApp } from '../context/AppContext';

const MyOrdersPage: React.FC = () => {
    const { auth, orders } = useApp();

    if (!auth.user) {
        return <p>Please log in to see your orders.</p>;
    }

    const userOrders = orders.filter(order => order.user.id === auth.user!.id);

    return (
        <div>
            <h1 className="text-4xl font-bold text-center mb-10">My Pizza Orders</h1>
            {userOrders.length === 0 ? (
                <p className="text-center text-stone-600 text-lg">You haven't placed any orders yet. Visit the menu to order some delicious pizza!</p>
            ) : (
                <div className="space-y-6 max-w-4xl mx-auto">
                    {userOrders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-stone-800">Order #{order.id}</h2>
                                    <p className="text-sm text-stone-500">
                                        Placed on: {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>{order.status}</span>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Order Summary:</h3>
                                <ul className="list-disc pl-5 space-y-1 text-stone-700">
                                    {order.items.map(item => (
                                        <li key={item.id}>
                                            {item.menuItem.name} x {item.quantity} - {(item.price * item.quantity).toLocaleString()} JPY
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-t mt-4 pt-4 text-right">
                                <p className="text-xl font-bold text-stone-800">
                                    Total: {order.totalAmount.toLocaleString()} JPY
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;
