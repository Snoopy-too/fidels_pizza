import React from 'react';
import { useLocale } from '../context/LocaleContext';

const Footer: React.FC = () => {
    const { t } = useLocale();
    return (
        <footer className="bg-stone-800 text-white py-6 mt-12">
            <div className="container mx-auto px-4 text-center">
                <p>{t('footer.copy', { year: new Date().getFullYear() })}</p>
                <p className="text-sm text-stone-400 mt-1">{t('footer.crafted')}</p>
            </div>
        </footer>
    );
};

export default Footer;