import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-stone-800 text-white py-6 mt-12">
            <div className="container mx-auto px-4 text-center">
                <p>&copy; {new Date().getFullYear()} Fidel's Pizza Event. All Rights Reserved.</p>
                <p className="text-sm text-stone-400 mt-1">Crafted with passion in Ako by Fidel.</p>
            </div>
        </footer>
    );
};

export default Footer;