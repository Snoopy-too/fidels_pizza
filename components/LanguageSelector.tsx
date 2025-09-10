import React from 'react';
import { useLocale } from '../context/LocaleContext';

const LanguageSelector: React.FC = () => {
    const { locale, setLocale } = useLocale();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = e.target.value;
        if (newLocale === 'en' || newLocale === 'ja') {
            setLocale(newLocale);
        }
    };

    return (
        <div className="relative">
            <select
                value={locale}
                onChange={handleLanguageChange}
                className="appearance-none bg-transparent border-none text-stone-700 py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none hover:text-red-600 cursor-pointer text-lg"
                aria-label="Select language"
            >
                <option value="en">English</option>
                <option value="ja">日本語</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    );
};

export default LanguageSelector;
