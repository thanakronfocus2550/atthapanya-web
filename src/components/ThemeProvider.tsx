'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSiteData } from './SiteDataProvider';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('system');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const { data } = useSiteData();
    const primaryColor = data?.settings?.primaryColor || '#FACC15';

    useEffect(() => {
        if (!mounted) return;

        const root = window.document.documentElement;

        // Apply theme (light/dark)
        let effectiveTheme = theme;
        if (theme === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        root.classList.remove('light', 'dark');
        root.classList.add(effectiveTheme);
        localStorage.setItem('theme', theme);

        // Apply dynamic primary colors
        root.style.setProperty('--primary-color', primaryColor);
        // Generate a slightly darker version for gradients/hovers
        const darker = darkenColor(primaryColor, 15);
        root.style.setProperty('--primary-color-dark', darker);
        const lighter = darkenColor(primaryColor, -20); // Ligher
        root.style.setProperty('--primary-color-light', lighter);

    }, [theme, mounted, primaryColor]);

    // Simple helper to darken/lighten hex colors
    function darkenColor(hex: string, percent: number) {
        try {
            const num = parseInt(hex.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) - amt;
            const G = (num >> 8 & 0x00FF) - amt;
            const B = (num & 0x0000FF) - amt;
            return "#" + (0x1000000 + (R < 255 ? R < 0 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 0 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 0 ? 0 : B : 255)).toString(16).slice(1);
        } catch (e) {
            return hex; // Fallback
        }
    }

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
