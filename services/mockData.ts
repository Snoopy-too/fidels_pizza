import type { User, MenuItem, Order, EventInfo, LandingPageContent } from '../types';

export const MOCK_USERS: User[] = [
    { id: 1, email: 'admin@fidel.com', name: 'Fidel Admin', role: 'admin', password: 'password' },
    { id: 2, email: 'user@example.com', name: 'Giovanni Rossi', role: 'user', password: 'password' },
    { id: 3, email: 'user2@example.com', name: 'Sofia Romano', role: 'user', password: 'password' },
    { id: 4, email: 'admin@noriko.com', name: 'Noriko', role: 'admin', password: 'password' },
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
    { id: 1, name: 'Margherita', description: 'Classic mozzarella, tomato sauce, and fresh basil.', price: 1500, imageUrl: 'https://picsum.photos/seed/margherita/400/300', available: true },
    { id:2, name: 'Pepperoni', description: 'Spicy pepperoni with a rich tomato base and melted cheese.', price: 1800, imageUrl: 'https://picsum.photos/seed/pepperoni/400/300', available: true },
    { id: 3, name: 'Quattro Formaggi', description: 'A cheese lover\'s dream with four Italian cheeses.', price: 2000, imageUrl: 'https://picsum.photos/seed/formaggi/400/300', available: true },
    { id: 4, name: 'Capricciosa', description: 'Ham, mushrooms, artichokes, and olives.', price: 1900, imageUrl: 'https://picsum.photos/seed/capricciosa/400/300', available: true },
    { id: 5, name: 'Marinara', description: 'Simple yet delicious with tomato, garlic, oregano, and olive oil.', price: 1300, imageUrl: 'https://picsum.photos/seed/marinara/400/300', available: true },
    { id: 6, name: 'Prosciutto e Funghi', description: 'A savory combination of cooked ham and mushrooms.', price: 1850, imageUrl: 'https://picsum.photos/seed/prosciutto/400/300', available: true },
];

export const MOCK_ORDERS: Order[] = [
    {
        id: 1,
        user: MOCK_USERS[1],
        items: [
            { id: 1, menuItem: MOCK_MENU_ITEMS[0], quantity: 2, price: 1500 },
            { id: 2, menuItem: MOCK_MENU_ITEMS[2], quantity: 1, price: 2000 },
        ],
        totalAmount: 5000,
        status: 'completed',
        createdAt: new Date('2023-10-26T10:00:00Z'),
        pickupTime: '18:00',
    },
    {
        id: 2,
        user: MOCK_USERS[2],
        items: [
            { id: 3, menuItem: MOCK_MENU_ITEMS[1], quantity: 3, price: 1800 },
        ],
        totalAmount: 5400,
        status: 'pending',
        createdAt: new Date('2023-10-27T11:30:00Z'),
        pickupTime: '18:30',
    },
];

export const MOCK_EVENT_INFO: EventInfo = {
    date: '2024-12-15',
    address: '1-1-1 Omotesando, Shibuya-ku, Tokyo',
};

export const MOCK_LANDING_CONTENT: LandingPageContent = {
    title: 'Fidel\'s Pizza Event',
    description: 'Join us for an exclusive evening of authentic Italian pizza, crafted with passion by Fidel himself. Savour the taste of Italy and pre-order your favorite pizzas for a seamless experience. Register now to secure your spot!',
    images: [
        'https://picsum.photos/seed/event1/800/600',
        'https://picsum.photos/seed/event2/800/600',
        'https://picsum.photos/seed/event3/800/600',
    ],
};

export const MOCK_ACCESS_CODE = '1234';

export const PICKUP_TIMES = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'];