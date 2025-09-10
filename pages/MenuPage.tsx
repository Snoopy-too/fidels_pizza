import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem } from '../types';
import Modal from '../components/Modal';

const MenuCard: React.FC<{ item: MenuItem; onAddToCart: (item: MenuItem) => void }> = ({ item, onAddToCart }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-stone-800">{item.name}</h3>
                <p className="text-stone-600 mt-2 flex-grow">{item.description}</p>
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-xl font-semibold">{item.price.toLocaleString()} JPY</p>
                    <button
                        onClick={() => onAddToCart(item)}
                        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors disabled:bg-stone-400"
                        disabled={!item.available}
                    >
                        {item.available ? 'Add to Order' : 'Unavailable'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const MenuPage: React.FC = () => {
    const { menuItems, addToCart, cart, removeFromCart, updateCartItemQuantity, getCartTotal, addOrder, updateOrder, auth, clearCart, orderBeingUpdated } = useApp();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleAddToCart = (item: MenuItem) => {
        addToCart(item, 1);
    };
    
    const handleSubmitOrder = () => {
        if (!auth.user) {
            alert("You must be logged in to place an order.");
            return;
        }

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        if (orderBeingUpdated) {
            updateOrder(orderBeingUpdated, cart);
        } else {
            addOrder(cart, auth.user);
        }
        
        setIsCartOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold">Fidel's Pizza Menu</h1>
                <button onClick={() => setIsCartOpen(true)} className="relative bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-transform hover:scale-105 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    View Cart
                    {cart.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                            {cart.reduce((total, item) => total + item.quantity, 0)}
                        </span>
                    )}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuItems.filter(item => item.available).map(item => (
                    <MenuCard key={item.id} item={item} onAddToCart={handleAddToCart} />
                ))}
            </div>

            <Modal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title="My Cart">
                {cart.length === 0 ? (
                    <p>Your cart is empty. Add some pizza from the menu!</p>
                ) : (
                    <div className="space-y-4">
                        {cart.map(cartItem => (
                            <div key={cartItem.menuItem.id} className="flex justify-between items-center border-b pb-2">
                                <div>
                                    <p className="font-bold">{cartItem.menuItem.name}</p>
                                    <p className="text-sm text-stone-600">{cartItem.menuItem.price.toLocaleString()} JPY</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                   <div className="flex items-center space-x-2">
                                       <button onClick={() => updateCartItemQuantity(cartItem.menuItem.id, cartItem.quantity - 1)} className="bg-stone-200 hover:bg-stone-300 w-7 h-7 rounded-full font-bold flex items-center justify-center">-</button>
                                       <span className="w-6 text-center">{cartItem.quantity}</span>
                                       <button onClick={() => updateCartItemQuantity(cartItem.menuItem.id, cartItem.quantity + 1)} disabled={cartItem.quantity >= 15} className="bg-stone-200 hover:bg-stone-300 w-7 h-7 rounded-full font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">+</button>
                                   </div>
                                   <p className="font-semibold w-24 text-right">{(cartItem.menuItem.price * cartItem.quantity).toLocaleString()} JPY</p>
                                   <button onClick={() => removeFromCart(cartItem.menuItem.id)} className="text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>
                                </div>
                            </div>
                        ))}
                        <div className="text-right font-bold text-xl mt-4 pt-4 border-t">
                            Total: {getCartTotal().toLocaleString()} JPY
                        </div>
                         <div className="flex justify-between mt-6">
                             <button onClick={() => clearCart()} className="bg-stone-500 text-white px-4 py-2 rounded hover:bg-stone-600">
                                 Clear Cart
                             </button>
                             <button onClick={handleSubmitOrder} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                                 {orderBeingUpdated ? 'Update Order' : 'Place Order'}
                             </button>
                         </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MenuPage;