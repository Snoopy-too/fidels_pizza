
import React, { useState } from 'react';
import type { Order } from '../types';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

const MenuItemCard: React.FC<{ menuItem: any }> = ({ menuItem }) => {
    const { addToCart, cart } = useApp();
    const cartItem = cart.find(item => item.menuItem.id === menuItem.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleQuantityChange = (newQuantity: number) => {
        addToCart(menuItem, newQuantity);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
            <img src={menuItem.imageUrl} alt={menuItem.name} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-2xl font-bold">{menuItem.name}</h3>
                <p className="text-stone-600 my-2">{menuItem.description}</p>
                <p className="text-xl font-semibold text-green-600 mb-4">{menuItem.price.toLocaleString()} JPY</p>
                <div className="flex items-center justify-center space-x-4">
                    <button onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 0} className="bg-stone-200 h-8 w-8 rounded-full font-bold text-lg disabled:opacity-50">-</button>
                    <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                    <button onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= 15} className="bg-stone-200 h-8 w-8 rounded-full font-bold text-lg disabled:opacity-50">+</button>
                </div>
            </div>
        </div>
    );
};


const MenuPage: React.FC = () => {
    const { menuItems, cart, placeOrder, eventInfo } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

    const total = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

    const handlePlaceOrder = () => {
        const order = placeOrder();
        if (order) {
            setConfirmedOrder(order);
            setIsModalOpen(true);
        } else {
            alert("Your cart is empty or you're not logged in!");
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-center mb-10">Our Pizza Menu</h1>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {menuItems.filter(item => item.available).map(item => (
                        <MenuItemCard key={item.id} menuItem={item} />
                    ))}
                </div>
                <aside className="md:col-span-1">
                    <div className="sticky top-24 bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-bold mb-4 border-b pb-2">Your Pizza Order</h2>
                        {cart.length === 0 ? (
                            <p className="text-stone-500">Your order is empty. Add some pizzas!</p>
                        ) : (
                            <ul className="space-y-3 mb-4">
                                {cart.map(item => (
                                    <li key={item.menuItem.id} className="flex justify-between items-center">
                                        <span>{item.menuItem.name} x {item.quantity}</span>
                                        <span className="font-semibold">{(item.menuItem.price * item.quantity).toLocaleString()} JPY</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between text-2xl font-bold">
                                <span>Total:</span>
                                <span>{total.toLocaleString()} JPY</span>
                            </div>
                            <button 
                                onClick={handlePlaceOrder}
                                disabled={cart.length === 0}
                                className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-red-700 disabled:bg-stone-400"
                            >
                                Send Pizza Order to Fidel
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Order Confirmation">
                {confirmedOrder && (
                    <div className="space-y-3 text-stone-700">
                        <p className="text-lg">Thank you for your order!</p>
                        <p><strong>Order Number:</strong> #{confirmedOrder.id}</p>
                        <p><strong>Total Price:</strong> {confirmedOrder.totalAmount.toLocaleString()} JPY</p>
                        <p><strong>Event Date:</strong> {new Date(eventInfo.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="mt-4 text-sm">A confirmation email has been sent to you and Fidel. We look forward to seeing you!</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MenuPage;
