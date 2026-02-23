'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSiteData } from '@/components/SiteDataProvider';

const STORAGE_KEY = 'last_announcement_close';
const SHOW_INTERVAL = 3600000; // 1 hour in milliseconds

export default function AnnouncementPopup() {
    const { data } = useSiteData();
    const { settings } = data;
    const [isVisible, setIsVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (settings.showPopup === false) return;

        const checkVisibility = () => {
            const lastClose = localStorage.getItem(STORAGE_KEY);
            const now = Date.now();

            if (!lastClose || now - parseInt(lastClose) > SHOW_INTERVAL) {
                // Delay popup show by 1.5 seconds for better UX
                const timer = setTimeout(() => setIsVisible(true), 1500);
                return () => clearTimeout(timer);
            }
        };

        checkVisibility();
    }, [settings.showPopup]);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                    {/* Backdrop (semi-transparent) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
                        onClick={handleClose}
                    />

                    {/* Popup Container */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white rounded-[2.5rem] w-full max-w-md shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden pointer-events-auto border border-white/20"
                    >
                        {/* Header / Image Carousel */}
                        <div className="relative h-48 bg-gradient-to-br from-primary to-primary-dark overflow-hidden group/carousel">
                            <AnimatePresence mode="wait">
                                {settings.popupImages && settings.popupImages.length > 0 ? (
                                    <motion.div
                                        key={currentImageIndex}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0"
                                    >
                                        <img
                                            src={settings.popupImages[currentImageIndex]}
                                            alt="Banner"
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div className="h-full flex items-center justify-center">
                                        <Bell className="w-16 h-16 text-white/50" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Arrows for Multiple Images */}
                            {settings.popupImages && settings.popupImages.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(prev => (prev - 1 + settings.popupImages!.length) % settings.popupImages!.length);
                                        }}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-all opacity-0 group-hover/carousel:opacity-100"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(prev => (prev + 1) % settings.popupImages!.length);
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-all opacity-0 group-hover/carousel:opacity-100"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>

                                    {/* Indicators */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {settings.popupImages.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8 pt-10 text-center relative">
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 bg-surface hover:bg-red-50 hover:text-red-500 rounded-full transition-all border border-border/50 group"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-black text-primary-dark mb-4 uppercase tracking-widest">
                                <Sparkles className="w-3 h-3" />
                                Special Announcement
                            </div>

                            <h2 className="text-2xl font-black text-text-primary mb-3 leading-tight whitespace-pre-line">
                                {settings.popupTitle || 'ประกาศจากทางสถาบัน'}
                            </h2>

                            <p className="text-text-secondary mb-8 leading-relaxed whitespace-pre-line">
                                {settings.popupDescription || 'รายละเอียดประกาศของคุณจะแสดงที่นี่'}
                            </p>

                            <div className="space-y-3">
                                <Link
                                    href={settings.popupCtaUrl || '/'}
                                    onClick={handleClose}
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-primary hover:bg-primary-dark text-text-primary font-black rounded-2xl transition-all shadow-lg shadow-primary/25 active:scale-95"
                                >
                                    {settings.popupCtaText || 'ดูรายละเอียด'}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={handleClose}
                                    className="w-full py-3 text-sm font-bold text-text-muted hover:text-text-secondary transition-colors"
                                >
                                    ไว้คราวหลัง
                                </button>
                            </div>
                        </div>

                        {/* Decorative bottom edge */}
                        <div className="h-2 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
