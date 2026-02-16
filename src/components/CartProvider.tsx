'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Course } from '@/types';

export interface CartItem {
    course: Course;
    qty: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (course: Course) => void;
    removeItem: (courseId: string) => void;
    clearCart: () => void;
    isInCart: (courseId: string) => boolean;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('attapanya-cart');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setItems(parsed);
            }
        } catch { }
        setLoaded(true);
    }, []);

    // Persist to localStorage
    useEffect(() => {
        if (loaded) {
            localStorage.setItem('attapanya-cart', JSON.stringify(items));
        }
    }, [items, loaded]);

    const addItem = useCallback((course: Course) => {
        setItems((prev) => {
            if (prev.some((item) => item.course.id === course.id)) return prev;
            return [...prev, { course, qty: 1 }];
        });
    }, []);

    const removeItem = useCallback((courseId: string) => {
        setItems((prev) => prev.filter((item) => item.course.id !== courseId));
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const isInCart = useCallback(
        (courseId: string) => items.some((item) => item.course.id === courseId),
        [items]
    );

    const totalItems = items.length;
    const totalPrice = items.reduce((acc, item) => acc + item.course.price * item.qty, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, isInCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
}
