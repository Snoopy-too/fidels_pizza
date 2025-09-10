import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLocale } from '../context/LocaleContext';

const LandingPage: React.FC = () => {
    const { landingContent, eventInfo } = useApp();
    const { t, locale } = useLocale();

    return (
        <div className="space-y-12">
            <section className="text-center bg-white p-6 md:p-12 rounded-lg shadow-lg" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/pinstripe.png')` }}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-red-700 mb-4">{landingContent.title}</h1>
                <p className="text-lg md:text-2xl text-stone-600 mb-8">{landingContent.description}</p>
                
                <div className="w-64 h-64 md:w-80 md:h-80 bg-green-600 text-white rounded-full shadow-md flex flex-col items-center justify-center mx-auto mb-8 p-4">
                    <div className="text-lg md:text-xl font-semibold text-center">
                        <p>{t('landingPage.eventInfo.date')}</p>
                        <p className="font-bold">{new Date(eventInfo.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="mt-4">{t('landingPage.eventInfo.location')}</p>
                        <p className="font-bold leading-tight">{eventInfo.address}</p>
                    </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                    <Link to="/register" className="w-full md:w-auto bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition-transform hover:scale-105">
                        {t('landingPage.registerNow')}
                    </Link>
                    <Link to="/menu" className="w-full md:w-auto bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-50 transition-transform hover:scale-105">
                        {t('landingPage.preOrder')}
                    </Link>
                </div>
            </section>
            
            <section>
                <h2 className="text-4xl font-bold text-center text-stone-800 mb-8">{t('landingPage.pastEventsTitle')}</h2>
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