'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, BookOpen, CreditCard, Users, Menu, X,
    GraduationCap, LogOut, Trophy, UserCheck, Settings, Calendar, Megaphone, Ticket,
    MessageSquare
} from 'lucide-react';
import { useSiteData } from '@/components/SiteDataProvider';
import { cn } from '@/lib/utils';

const adminLinks = [
    { label: 'ภาพรวม', href: '/admin', icon: LayoutDashboard },
    { label: 'จัดการคอร์ส', href: '/admin/courses', icon: BookOpen },
    { label: 'จัดการประกาศ', href: '/admin/announcements', icon: Megaphone },
    { label: 'อาจารย์ผู้สอน', href: '/admin/tutors', icon: UserCheck },
    { label: 'ผลงานนักเรียน', href: '/admin/hall-of-fame', icon: Trophy },
    { label: 'ตรวจสอบการชำระเงิน', href: '/admin/payments', icon: CreditCard },
    { label: 'จัดการคูปอง', href: '/admin/coupons', icon: Ticket },
    { label: 'นักเรียน', href: '/admin/students', icon: Users },
    { label: 'จัดการคำถาม', href: '/admin/questions', icon: MessageSquare },
    { label: 'ตั้งค่าเว็บไซต์', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { data } = useSiteData();
    const { settings } = data;

    return (
        <div className="min-h-screen flex bg-surface-dark">
            {/* Mobile overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-border flex flex-col transition-all duration-300 lg:translate-x-0 overflow-hidden shadow-sm',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-6 h-20 border-b border-border bg-white sticky top-0 z-10">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm shadow-primary/20 overflow-hidden">
                            {settings.logo ? (
                                <img src={settings.logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <GraduationCap className="w-5.5 h-5.5 text-text-primary" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-text-primary text-sm tracking-tight leading-none truncate max-w-[120px]">
                                {settings.siteName || 'Admin Panel'}
                            </span>
                            <span className="text-[10px] text-primary-dark font-bold uppercase mt-1">Management</span>
                        </div>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-surface-dark rounded-lg transition-colors">
                        <X className="w-5 h-5 text-text-secondary" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {adminLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all relative group',
                                    isActive
                                        ? 'bg-primary text-text-primary font-bold shadow-md shadow-primary/10'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-dark'
                                )}
                            >
                                <link.icon className={cn(
                                    "w-4.5 h-4.5 transition-colors",
                                    isActive ? "text-text-primary" : "text-text-muted group-hover:text-text-primary"
                                )} />
                                {link.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 w-1 h-6 bg-primary-dark rounded-r-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="px-4 py-6 border-t border-border">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-danger hover:bg-danger/5 transition-all group"
                    >
                        <LogOut className="w-4.5 h-4.5 text-text-muted group-hover:text-danger" />
                        กลับหน้าหลัก
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center justify-between px-6 h-16 bg-white border-b border-border sticky top-0 z-30 shadow-sm">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-surface-dark rounded-lg transition-colors">
                        <Menu className="w-5 h-5 text-text-primary" />
                    </button>
                    <span className="font-bold text-sm text-text-primary">Admin Panel</span>
                    <div className="w-9" /> {/* Spacer */}
                </div>

                <div className="flex-1 relative">
                    <AnimatePresence mode="wait">
                        <motion.main
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto"
                        >
                            {children}
                        </motion.main>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
