'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, BookOpen, CreditCard, Users, Menu, X,
    GraduationCap, LogOut, Trophy, UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminLinks = [
    { label: 'ภาพรวม', href: '/admin', icon: LayoutDashboard },
    { label: 'จัดการคอร์ส', href: '/admin/courses', icon: BookOpen },
    { label: 'อาจารย์ผู้สอน', href: '/admin/tutors', icon: UserCheck },
    { label: 'ผลงานนักเรียน', href: '/admin/hall-of-fame', icon: Trophy },
    { label: 'ตรวจสอบการชำระเงิน', href: '/admin/payments', icon: CreditCard },
    { label: 'นักเรียน', href: '/admin/students', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex bg-surface">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-admin-bg text-admin-text flex flex-col transition-transform duration-300 lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-4.5 h-4.5 text-text-primary" />
                        </div>
                        <span className="font-bold text-sm">Admin Panel</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {adminLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                                pathname === link.href
                                    ? 'bg-primary/20 text-primary font-medium'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <link.icon className="w-4.5 h-4.5" />
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Bottom */}
                <div className="px-3 py-4 border-t border-white/10">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <LogOut className="w-4.5 h-4.5" />
                        กลับหน้าหลัก
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 min-w-0">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-border sticky top-0 z-30">
                    <button onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-sm">Admin Panel</span>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">{children}</div>
            </div>
        </div>
    );
}
