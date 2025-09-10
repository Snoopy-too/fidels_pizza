import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User, MenuItem, Order, EventInfo, LandingPageContent, CartItem } from '../types';
import { MOCK_USERS, MOCK_MENU_ITEMS, MOCK_ORDERS, MOCK_EVENT_INFO, MOCK_LANDING_CONTENT, MOCK_ACCESS_CODE } from '../services/mockData';

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

interface AppContextType {
    auth: AuthState;
    login: (email: string, pass: string) => User | null;
    logout: () => void;
    register: (name: string, email: string, pass: string) => User | null;
    updateUserProfile: (updates: { name?: string; email?: string; currentPassword?: string; newPassword?: string; }) => { success: boolean; message: string };
    eventInfo: EventInfo;
    updateEventInfo: (info: EventInfo) => void;
    landingContent: LandingPageContent;
    updateLandingContent: (content: LandingPageContent) => void;
    accessCode: string;
    updateAccessCode: (code: string) => void;
    menuItems: MenuItem[];
    updateMenuItem: (item: MenuItem) => void;
    addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
    deleteMenuItem: (id: number) => void;
    orders: Order[];
    updateOrder: (order: Order) => void;
    deleteOrder: (id: number) => void;
    cart: CartItem[];
    addToCart: (item: MenuItem, quantity: number) => void;
    clearCart: () => void;
    placeOrder: () => Order | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, user: null });
    const [eventInfo, setEventInfo] = useState<EventInfo>(MOCK_EVENT_INFO);
    const [landingContent, setLandingContent] = useState<LandingPageContent>(MOCK_LANDING_CONTENT);
    const [accessCode, setAccessCode] = useState<string>(MOCK_ACCESS_CODE);
    const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);

    const login = (email: string, pass: string): User | null => {
        const user = users.find(u => u.email === email);
        if (user && pass === (user.password || 'password')) {
            setAuth({ isAuthenticated: true, user });
            return user;
        }
        return null;
    };

    const logout = () => {
        setAuth({ isAuthenticated: false, user: null });
        clearCart();
    };

    const register = (name: string, email: string, pass: string): User | null => {
        if (users.some(u => u.email === email)) return null;
        const newUser: User = { id: users.length + 1, name, email, role: 'user', password: pass };
        setUsers(prev => [...prev, newUser]);
        setAuth({ isAuthenticated: true, user: newUser });
        return newUser;
    };
    
    const updateUserProfile = (updates: { name?: string; email?: string; currentPassword?: string; newPassword?: string; }): { success: boolean; message: string } => {
        if (!auth.user) {
            return { success: false, message: "No user is logged in." };
        }

        const userIndex = users.findIndex(u => u.id === auth.user!.id);
        if (userIndex === -1) {
            return { success: false, message: "User not found." };
        }

        const currentUser = users[userIndex];
        let updatedUser = { ...currentUser };

        if (updates.newPassword) {
            if (!updates.currentPassword || updates.currentPassword !== (currentUser.password || 'password')) {
                return { success: false, message: "Current password is incorrect." };
            }
            updatedUser.password = updates.newPassword;
        }

        if (updates.name) {
            updatedUser.name = updates.name;
        }
        if (updates.email) {
            if (updates.email !== currentUser.email && users.some(u => u.email === updates.email)) {
                 return { success: false, message: "Email already in use." };
            }
            updatedUser.email = updates.email;
        }

        const newUsers = [...users];
        newUsers[userIndex] = updatedUser;
        setUsers(newUsers);
        setAuth(prevAuth => ({ ...prevAuth, user: updatedUser }));

        return { success: true, message: "Profile updated successfully!" };
    };

    const updateEventInfo = (info: EventInfo) => setEventInfo(info);
    const updateLandingContent = (content: LandingPageContent) => setLandingContent(content);
    const updateAccessCode = (code: string) => setAccessCode(code);

    const updateMenuItem = (updatedItem: MenuItem) => {
        setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    };

    const addMenuItem = (newItemData: Omit<MenuItem, 'id'>) => {
        const newItem: MenuItem = { id: Date.now(), ...newItemData };
        setMenuItems(prev => [...prev, newItem]);
    };

    const deleteMenuItem = (id: number) => {
        setMenuItems(prev => prev.filter(item => item.id !== id));
    };

    const updateOrder = (updatedOrder: Order) => {
        setOrders(prev => prev.map(order => order.id === updatedOrder.id ? updatedOrder : order));
    };

    const deleteOrder = (id: number) => {
        setOrders(prev => prev.filter(order => order.id !== id));
    };
    
    const addToCart = (menuItem: MenuItem, quantity: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.menuItem.id === menuItem.id);
            if (existingItem) {
                return prevCart.map(item => 
                    item.menuItem.id === menuItem.id 
                    ? { ...item, quantity: Math.max(0, Math.min(15, quantity)) } 
                    : item
                ).filter(item => item.quantity > 0);
            }
            if (quantity > 0) {
                 return [...prevCart, { menuItem, quantity }];
            }
            return prevCart;
        });
    };

    const clearCart = () => setCart([]);

    const placeOrder = (): Order | null => {
        if (!auth.user || cart.length === 0) return null;
        const newOrder: Order = {
            id: orders.length + 1001,
            user: auth.user,
            items: cart.map(cartItem => ({
                id: Math.random(),
                menuItem: cartItem.menuItem,
                quantity: cartItem.quantity,
                price: cartItem.menuItem.price,
            })),
            totalAmount: cart.reduce((total, item) => total + item.menuItem.price * item.quantity, 0),
            status: 'pending',
            createdAt: new Date(),
        };
        setOrders(prev => [newOrder, ...prev]);
        clearCart();
        return newOrder;
    };


    const value = {
        auth, login, logout, register,
        updateUserProfile,
        eventInfo, updateEventInfo,
        landingContent, updateLandingContent,
        accessCode, updateAccessCode,
        menuItems, updateMenuItem, addMenuItem, deleteMenuItem,
        orders, updateOrder, deleteOrder,
        cart, addToCart, clearCart, placeOrder
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};