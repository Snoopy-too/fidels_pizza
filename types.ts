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