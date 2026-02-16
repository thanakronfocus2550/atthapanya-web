'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, User, BookOpen, LogOut, Moon, Sun, Shield, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';
import { courses } from '@/lib/data';
import Logo from '@/components/Logo';
import { useCart } from '@/components/CartProvider';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocus, setSearchFocus] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { totalItems } = useCart();

    // Mock login state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Don't render on admin pages
    if (pathname.startsWith('/admin')) return null;

    // Build nav links dynamically
    const navLinks = [
        { label: 'หน้าแรก', href: '/' },
        { label: 'คอร์สเรียน', href: '/courses' },
        { label: 'เกี่ยวกับเรา', href: '/about' },
        { label: 'คำถามที่พบบ่อย', href: '/faq' },
        { label: 'ติดต่อ', href: '/contact' },
        ...(isLoggedIn
            ? [{ label: 'คอร์สเรียนของฉัน', href: '/dashboard' }]
            : []),
    ];

    // Real-time search results
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        return courses
            .filter(c =>
                c.title.toLowerCase().includes(q) ||
                c.subject.toLowerCase().includes(q) ||
                c.tutorName.toLowerCase().includes(q)
            )
            .slice(0, 5);
    }, [searchQuery]);

    const showSearchDropdown = searchFocus && searchQuery.trim().length > 0;

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchFocus(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <nav className="sticky top-0 z-50 glass border-b border-border/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0">
                        <Logo size={36} />
                        <span className="font-bold text-lg hidden sm:block">อรรถปัญญา</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    pathname === link.href
                                        ? 'bg-primary/15 text-primary-dark'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-dark'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Search + Auth */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Search with dropdown */}
                        <div className="relative" ref={searchRef}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder="ค้นหาคอร์ส..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocus(true)}
                                className="pl-9 pr-4 py-2 w-48 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:w-64 transition-all"
                            />
                            {showSearchDropdown && (
                                <div className="absolute top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl border border-border shadow-xl z-50 overflow-hidden">
                                    {searchResults.length > 0 ? (
                                        <>
                                            {searchResults.map((course) => (
                                                <Link
                                                    key={course.id}
                                                    href={`/courses/${course.id}`}
                                                    onClick={() => { setSearchQuery(''); setSearchFocus(false); }}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-surface-dark transition-colors"
                                                >
                                                    <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center shrink-0">
                                                        <BookOpen className="w-5 h-5 text-primary-dark" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-text-primary truncate">{course.title}</p>
                                                        <p className="text-xs text-text-muted">{course.tutorName} • {course.subject}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                            <Link
                                                href="/courses"
                                                onClick={() => { setSearchQuery(''); setSearchFocus(false); }}
                                                className="block text-center text-sm text-primary-dark hover:bg-surface-dark py-2.5 border-t border-border"
                                            >
                                                ดูคอร์สทั้งหมด →
                                            </Link>
                                        </>
                                    ) : (
                                        <div className="px-4 py-6 text-center">
                                            <p className="text-sm text-text-muted">ไม่พบผลลัพธ์สำหรับ &quot;{searchQuery}&quot;</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl hover:bg-surface-dark transition-colors text-text-secondary"
                            title={theme === 'light' ? 'เปิด Dark Mode' : 'เปิด Light Mode'}
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-primary" />}
                        </button>

                        {/* Admin Link */}
                        {isLoggedIn && isAdmin && (
                            <Link
                                href="/admin"
                                className="p-2 rounded-xl hover:bg-surface-dark transition-colors text-text-secondary"
                                title="แอดมิน"
                            >
                                <Shield className="w-5 h-5" />
                            </Link>
                        )}

                        {/* Cart Icon */}
                        <Link
                            href="/checkout"
                            className="relative p-2 rounded-xl hover:bg-surface-dark transition-colors text-text-secondary"
                            title="ตะกร้าสินค้า"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                    {totalItems > 9 ? '9+' : totalItems}
                                </span>
                            )}
                        </Link>

                        {isLoggedIn ? (
                            /* Profile Avatar */
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-dark transition-colors"
                                >
                                    <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold text-primary-dark border-2 border-primary/40">
                                        ธ
                                    </div>
                                </button>

                                {profileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-border shadow-xl z-50 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-border">
                                                <p className="font-medium text-sm text-text-primary">ธนภัทร ศรีสวัสดิ์</p>
                                                <p className="text-xs text-text-muted">thanapat@example.com</p>
                                            </div>
                                            <div className="py-1.5">
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-dark transition-colors"
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                    คอร์สเรียนของฉัน
                                                </Link>
                                                {isAdmin && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setProfileOpen(false)}
                                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-dark transition-colors"
                                                    >
                                                        <Shield className="w-4 h-4" />
                                                        แอดมิน
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setIsLoggedIn(false);
                                                        setIsAdmin(false);
                                                        setProfileOpen(false);
                                                    }}
                                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    ออกจากระบบ
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* Login Buttons */
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsLoggedIn(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-text-primary font-medium text-sm rounded-xl transition-colors"
                                >
                                    <User className="w-4 h-4" />
                                    เข้าสู่ระบบ
                                </button>
                                <button
                                    onClick={() => { setIsLoggedIn(true); setIsAdmin(true); }}
                                    className="flex items-center gap-1.5 px-3 py-2 border border-border hover:bg-surface-dark text-text-secondary text-xs rounded-xl transition-colors"
                                    title="เข้าเป็น Admin"
                                >
                                    <Shield className="w-3.5 h-3.5" />
                                    Admin
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile - Dark mode + Menu */}
                    <div className="flex items-center gap-1 lg:hidden">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-surface-dark transition-colors text-text-secondary"
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-primary" />}
                        </button>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-lg hover:bg-surface-dark transition-colors"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="lg:hidden border-t border-border bg-white">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                    pathname === link.href
                                        ? 'bg-primary/15 text-primary-dark'
                                        : 'text-text-secondary hover:bg-surface-dark'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-3 border-t border-border">
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาคอร์ส..."
                                    className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>
                            {isLoggedIn ? (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 px-4 py-2">
                                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold text-primary-dark">ธ</div>
                                        <div>
                                            <p className="text-sm font-medium">ธนภัทร ศรีสวัสดิ์</p>
                                            <p className="text-xs text-text-muted">thanapat@example.com</p>
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-dark rounded-lg transition-colors"
                                        >
                                            <Shield className="w-4 h-4" />
                                            แอดมิน
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => { setIsLoggedIn(false); setIsAdmin(false); setMobileOpen(false); }}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-danger hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        ออกจากระบบ
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => { setIsLoggedIn(true); setMobileOpen(false); }}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary hover:bg-primary-dark text-text-primary font-medium text-sm rounded-xl transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        เข้าสู่ระบบ
                                    </button>
                                    <button
                                        onClick={() => { setIsLoggedIn(true); setIsAdmin(true); setMobileOpen(false); }}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-border hover:bg-surface-dark text-text-secondary text-sm rounded-xl transition-colors"
                                    >
                                        <Shield className="w-4 h-4" />
                                        เข้าระบบ Admin
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
