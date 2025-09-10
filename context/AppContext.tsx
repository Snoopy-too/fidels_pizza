
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { User, MenuItem, Order, CartItem, EventInfo, LandingPageContent, OrderItem, ModalOptions } from '../types';
import { MOCK_USERS, MOCK_MENU_ITEMS, MOCK_ORDERS, MOCK_EVENT_INFO, MOCK_LANDING_CONTENT, MOCK_ACCESS_CODE } from '../services/mockData';

// Define the shape of the context state
interface AppContextType {
    auth: {
        isAuthenticated: boolean;
        user: User | null;
    };
    login: (email: string, password: string) => User | null;
    logout: () => void;
    register: (name: string, email: string, password: string) => User | null;
    updateUserProfile: (updates: { name?: string; email?: string; currentPassword?: string; newPassword?: string; }) => { success: boolean, message: string };
    requestPasswordReset: (email: string) => { success: boolean; message: string };
    resetPassword: (token: string, newPassword: string) => { success: boolean; message: string };

    users: User[];
    
    menuItems: MenuItem[];
    addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
    updateMenuItem: (item: MenuItem) => void;
    deleteMenuItem: (id: number) => void;

    orders: Order[];
    addOrder: (cart: CartItem[], user: User) => Order | null;
    updateOrder: (orderOrId: Order | number, cartItems?: CartItem[]) => void;
    bulkUpdateOrders: (orderIds: Set<number>, updates: Partial<Order>) => void;
    cancelOrder: (orderId: number) => void;
    clearAllOrders: (silent?: boolean) => void;
    
    cart: CartItem[];
    addToCart: (item: MenuItem, quantity: number) => void;
    removeFromCart: (itemId: number) => void;
    updateCartItemQuantity: (itemId: number, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;

    eventInfo: EventInfo;
    updateEventInfo: (info: EventInfo) => void;

    landingContent: LandingPageContent;
    updateLandingContent: (content: LandingPageContent) => void;

    accessCode: string;
    updateAccessCode: (code: string) => void;
    
    orderBeingUpdated: number | null;
    loadOrderForUpdate: (order: Order) => void;

    // Modal context
    showModal: (options: Omit<ModalOptions, 'type'> & { onConfirm?: () => void }) => void;
    showAlert: (title: string, message: string, onOk?: () => void) => void;
    showConfirm: (title: string, message: string, onConfirm: () => void, confirmText?: string) => void;
    hideModal: () => void;
    modalState: ModalOptions | null;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create the provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State management
    const [auth, setAuth] = useState<{ isAuthenticated: boolean, user: User | null }>({
        isAuthenticated: false,
        user: null,
    });
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [eventInfo, setEventInfo] = useState<EventInfo>(MOCK_EVENT_INFO);
    const [landingContent, setLandingContent] = useState<LandingPageContent>(MOCK_LANDING_CONTENT);
    const [accessCode, setAccessCode] = useState<string>(MOCK_ACCESS_CODE);
    const [orderBeingUpdated, setOrderBeingUpdated] = useState<number | null>(null);
    const [passwordResetTokens, setPasswordResetTokens] = useState<Map<string, { email: string; expires: number }>>(new Map());
    const [modalState, setModalState] = useState<ModalOptions | null>(null);

    // --- Modal Functions ---
    const showModal = useCallback((options: Omit<ModalOptions, 'type'> & { onConfirm?: () => void }) => {
        setModalState({
            ...options,
            type: options.onConfirm ? 'confirm' : 'alert',
        });
    }, []);
    
    const showAlert = useCallback((title: string, message: string, onOk?: () => void) => {
        showModal({ title, message, onConfirm: onOk });
    }, [showModal]);

    const showConfirm = useCallback((title: string, message: string, onConfirm: () => void, confirmText: string = 'Confirm') => {
        showModal({ title, message, onConfirm, confirmText });
    }, [showModal]);

    const hideModal = useCallback(() => {
        setModalState(null);
    }, []);

    // --- Auth Functions ---
    const login = (email: string, password: string): User | null => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setAuth({ isAuthenticated: true, user });
            return user;
        }
        return null;
    };

    const logout = () => {
        setAuth({ isAuthenticated: false, user: null });
        setCart([]); // Clear cart on logout
        setOrderBeingUpdated(null); // Clear order update status
    };

    const register = (name: string, email: string, password: string): User | null => {
        if (users.some(u => u.email === email)) {
            return null; // User already exists
        }
        const newUser: User = {
            id: Date.now(), // simple ID generation
            name,
            email,
            password,
            role: 'user',
        };
        setUsers(prev => [...prev, newUser]);
        // Automatically log in the new user
        setAuth({ isAuthenticated: true, user: newUser });
        return newUser;
    };
    
    const updateUserProfile = (updates: { name?: string; email?: string; currentPassword?: string; newPassword?: string; }) => {
        if (!auth.user) return { success: false, message: "Not authenticated." };

        if (updates.newPassword && updates.currentPassword !== auth.user.password) {
            return { success: false, message: "Incorrect current password." };
        }
        
        const updatedUsers = users.map(u => {
            if (u.id === auth.user!.id) {
                const updatedUser = { ...u };
                if (updates.name) updatedUser.name = updates.name;
                if (updates.email) updatedUser.email = updates.email;
                if (updates.newPassword) updatedUser.password = updates.newPassword;
                return updatedUser;
            }
            return u;
        });

        setUsers(updatedUsers);
        const updatedUser = updatedUsers.find(u => u.id === auth.user!.id);
        if (updatedUser) {
            setAuth({ isAuthenticated: true, user: updatedUser });
        }
        
        return { success: true, message: "Profile updated successfully." };
    };

    const requestPasswordReset = (email: string) => {
        const userExists = users.some(u => u.email === email);
        if (!userExists) {
            return { success: false, message: "No account found with that email address." };
        }

        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const expires = Date.now() + 3600000; // Token expires in 1 hour

        setPasswordResetTokens(prev => new Map(prev).set(token, { email, expires }));

        // Simulate sending email
        const resetUrl = `${window.location.origin}${window.location.pathname}#/reset-password?token=${token}`;
        showAlert("Reset Link Sent (Simulation)", `A password reset link has been sent to ${email}.\n\nFor this demo, the link is:\n${resetUrl}`);

        return { success: true, message: `If an account exists for ${email}, a reset link has been sent.` };
    };

    const resetPassword = (token: string, newPassword: string) => {
        const tokenData = passwordResetTokens.get(token);

        if (!tokenData || Date.now() > tokenData.expires) {
            if (tokenData) {
                // Clean up expired token
                setPasswordResetTokens(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(token);
                    return newMap;
                });
            }
            return { success: false, message: "Invalid or expired password reset token." };
        }

        setUsers(prevUsers => prevUsers.map(user => {
            if (user.email === tokenData.email) {
                return { ...user, password: newPassword };
            }
            return user;
        }));

        // Invalidate token after use
        setPasswordResetTokens(prev => {
            const newMap = new Map(prev);
            newMap.delete(token);
            return newMap;
        });
        
        return { success: true, message: "Password has been reset successfully." };
    };


    // --- Menu Functions ---
    const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
        const newItem: MenuItem = { ...item, id: Date.now() };
        setMenuItems(prev => [...prev, newItem]);
    };
    
    const updateMenuItem = (item: MenuItem) => {
        setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));
    };

    const deleteMenuItem = (id: number) => {
        setMenuItems(prev => prev.filter(i => i.id !== id));
    };

    // --- Cart Functions ---
    const addToCart = (menuItem: MenuItem, quantity: number) => {
        setCart(currentCart => {
            const existingItemIndex = currentCart.findIndex(item => item.menuItem.id === menuItem.id);
            if (existingItemIndex > -1) {
                const newCart = [...currentCart];
                const newQuantity = newCart[existingItemIndex].quantity + quantity;
                newCart[existingItemIndex].quantity = Math.min(newQuantity, 15); // Cap at 15
                return newCart;
            }
            return [...currentCart, { menuItem, quantity: Math.min(quantity, 15) }];
        });
    };

    const removeFromCart = (itemId: number) => {
        setCart(currentCart => currentCart.filter(item => item.menuItem.id !== itemId));
    };

    const updateCartItemQuantity = (itemId: number, newQuantity: number) => {
        setCart(currentCart => {
            if (newQuantity <= 0) {
                return currentCart.filter(item => item.menuItem.id !== itemId);
            }
            return currentCart.map(item => {
                if (item.menuItem.id === itemId) {
                    const finalQuantity = Math.min(newQuantity, 15); // Cap at 15
                    return { ...item, quantity: finalQuantity };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
    };


    // --- Order Functions ---
    const addOrder = (cartItems: CartItem[], user: User): Order | null => {
        if (cartItems.length === 0) return null;

        const newOrderId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;

        const newOrder: Order = {
            id: newOrderId,
            user,
            items: cartItems.map((cartItem): OrderItem => ({
                id: Date.now() + cartItem.menuItem.id,
                menuItem: cartItem.menuItem,
                quantity: cartItem.quantity,
                price: cartItem.menuItem.price
            })),
            totalAmount: cartItems.reduce((total, item) => total + item.menuItem.price * item.quantity, 0),
            status: 'pending',
            createdAt: new Date(),
        };
        setOrders(prev => [newOrder, ...prev]);
        clearCart();
        showAlert('Order Placed!', `(Simulation) Order #${String(newOrder.id).padStart(4, '0')} placed!\n- An admin will assign a pickup time shortly.\n- Confirmation email sent to ${user.email}.\n- Notification sent to admins.`);
        return newOrder;
    };
    
    const updateOrder = (orderOrId: Order | number, cartItems?: CartItem[]) => {
        if (typeof orderOrId === 'number' && cartItems) {
            // This is the call from MenuPage or MyOrdersPage to update items from cart
            const orderId = orderOrId;
            setOrders(prevOrders => prevOrders.map(order => {
                if (order.id === orderId) {
                    const updatedOrder = {
                        ...order,
                        items: cartItems.map((cartItem): OrderItem => ({
                            id: Date.now() + cartItem.menuItem.id,
                            menuItem: cartItem.menuItem,
                            quantity: cartItem.quantity,
                            price: cartItem.menuItem.price
                        })),
                        totalAmount: cartItems.reduce((total, item) => total + item.menuItem.price * item.quantity, 0),
                    };
                    showAlert('Order Updated', `(Simulation) Order #${String(orderId).padStart(4, '0')} has been updated!\n- Confirmation email sent to ${order.user.email}.\n- Notification sent to admins.`);
                    return updatedOrder;
                }
                return order;
            }));
            clearCart();
            setOrderBeingUpdated(null);
        } else if (typeof orderOrId === 'object') {
            // This is the call from AdminOrders to update an order object (e.g., status, pickupTime)
            const updatedOrder = orderOrId as Order;
            setOrders(prevOrders => prevOrders.map(order => {
                if (order.id === updatedOrder.id) {
                    return updatedOrder;
                }
                return order;
            }));
        }
    };

    const bulkUpdateOrders = (orderIds: Set<number>, updates: Partial<Order>) => {
        setOrders(prevOrders => 
            prevOrders.map(order => {
                if (orderIds.has(order.id)) {
                    return { ...order, ...updates };
                }
                return order;
            })
        );
    };

    const cancelOrder = (orderId: number) => {
        setOrders(prevOrders => prevOrders.map(order => {
            if (order.id === orderId) {
                 showAlert('Order Cancelled', `(Simulation) Order #${String(orderId).padStart(4, '0')} has been cancelled.\n- Confirmation email sent to ${order.user.email}.\n- Notification sent to admins.`);
                return { ...order, status: 'cancelled' };
            }
            return order;
        }));
    };

    const clearAllOrders = (silent: boolean = false) => {
        setOrders([]);
        if (!silent) {
            showAlert('Success', 'All orders have been cleared.');
        }
    };
    
    const loadOrderForUpdate = (order: Order) => {
        setOrderBeingUpdated(order.id);
        const cartItems: CartItem[] = order.items.map(orderItem => ({
            menuItem: orderItem.menuItem,
            quantity: orderItem.quantity
        }));
        setCart(cartItems);
    };
    
    // --- Site settings ---
    const updateEventInfo = (info: EventInfo) => setEventInfo(info);
    const updateLandingContent = (content: LandingPageContent) => setLandingContent(content);
    const updateAccessCode = (code: string) => setAccessCode(code);


    // Value to be passed to consumers
    const value: AppContextType = {
        auth,
        login,
        logout,
        register,
        updateUserProfile,
        requestPasswordReset,
        resetPassword,
        users,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        orders,
        addOrder,
        updateOrder,
        bulkUpdateOrders,
        cancelOrder,
        clearAllOrders,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        getCartTotal,
        eventInfo,
        updateEventInfo,
        landingContent,
        updateLandingContent,
        accessCode,
        updateAccessCode,
        orderBeingUpdated,
        loadOrderForUpdate,
        // Modal functions
        showModal,
        showAlert,
        showConfirm,
        hideModal,
        modalState,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the AppContext
export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};