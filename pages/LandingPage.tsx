
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const LandingPage: React.FC = () => {
    const { landingContent, eventInfo } = useApp();

    return (
        <div className="space-y-12">
            <section className="text-center bg-white p-12 rounded-lg shadow-lg" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/pinstripe.png')` }}>
                <h1 className="text-6xl font-bold text-red-700 mb-4">{landingContent.title}</h1>
                <p className="text-2xl text-stone-600 mb-6">{landingContent.description}</p>
                <div className="text-xl font-semibold bg-green-600 text-white inline-block px-6 py-3 rounded-full shadow-md">
                    <p>Date: {new Date(eventInfo.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p>Location: {eventInfo.address}</p>
                </div>
                <div className="mt-8 space-x-4">
                    <Link to="/register" className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition-transform hover:scale-105">
                        Register Now
                    </Link>
                    <Link to="/menu" className="bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-50 transition-transform hover:scale-105">
                        Pre-Order Pizza
                    </Link>
                </div>
            </section>
            
            <section>
                <h2 className="text-4xl font-bold text-center text-stone-800 mb-8">A Taste of Our Past Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {landingContent.images.map((image, index) => (
                        <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                            <img src={image} alt={`Past event ${index + 1}`} className="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-300" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
