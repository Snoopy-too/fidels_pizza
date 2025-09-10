
export interface User {
    id: number;
    email: string;
    name: string;
    role: 'user' | 'admin';
    password?: string;
}

export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    available: boolean;
}

export interface CartItem {
    menuItem: MenuItem;
    quantity: number;
}

export interface OrderItem {
    id: number;
    menuItem: MenuItem;
    quantity: number;
    price: number;
}

export interface Order {
    id: number;
    user: User;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: Date;
    pickupTime?: string;
}

export interface EventInfo {
    date: string;
    address: string;
}

export interface LandingPageContent {
    title: string;
    description: string;
    images: string[];
}

export interface ModalOptions {
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    type: 'alert' | 'confirm';
}

export type Locale = 'en' | 'ja';
