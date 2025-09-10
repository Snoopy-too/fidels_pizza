import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import type { Locale } from '../types';

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Helper to get nested value from object by string path
const getNestedTranslation = (obj: any, path: string): string | undefined => {
    if (!obj) return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [locale, setLocaleState] = useState<Locale>(() => {
        const storedLocale = localStorage.getItem('locale');
        return (storedLocale === 'ja' || storedLocale === 'en') ? storedLocale : 'ja';
    });

    const [translations, setTranslations] = useState<Record<Locale, any> | null>(null);

    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const [enResponse, jaResponse] = await Promise.all([
                    fetch('/locales/en.json'),
                    fetch('/locales/ja.json')
                ]);
                if (!enResponse.ok || !jaResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const en = await enResponse.json();
                const ja = await jaResponse.json();
                setTranslations({ en, ja });
            } catch (error) {
                console.error('Failed to load translations:', error);
                // Fallback to empty translations to prevent app from crashing
                setTranslations({ en: {}, ja: {} });
            }
        };
        loadTranslations();
    }, []);

    const setLocale = (newLocale: Locale) => {
        localStorage.setItem('locale', newLocale);
        setLocaleState(newLocale);
    };

    const t = useMemo(() => (key: string, replacements?: Record<string, string | number>): string => {
        // If translations are not loaded yet, return the key itself.
        // The UI will briefly show keys, then update once fetch completes.
        if (!translations) {
            return key;
        }

        const currentTranslations = translations[locale];
        let translation = getNestedTranslation(currentTranslations, key) || key;
        
        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                const regex = new RegExp(`{{${placeholder}}}`, 'g');
                translation = translation.replace(regex, String(replacements[placeholder]));
            });
        }
        
        return translation;
    }, [locale, translations]);

    const value = { locale, setLocale, t };

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    );
};

export const useLocale = () => {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};