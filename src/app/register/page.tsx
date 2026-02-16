'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, GraduationCap, User } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

    const update = (field: string, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert('รหัสผ่านไม่ตรงกัน');
            return;
        }
        alert('สมัครสมาชิกสำเร็จ! (Mock)');
    };

    return (
        <PageTransition>
            <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-white via-primary/5 to-primary/10 px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white rounded-3xl shadow-glass border border-border/60 p-8">
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <GraduationCap className="w-7 h-7 text-text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-text-primary">สมัครสมาชิก</h1>
                            <p className="text-sm text-text-secondary mt-1">
                                สร้างบัญชีใหม่เพื่อเริ่มเรียนกับอรรถปัญญา
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">ชื่อ-นามสกุล</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => update('name', e.target.value)}
                                        placeholder="ชื่อ นามสกุล"
                                        className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">อีเมล</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => update('email', e.target.value)}
                                        placeholder="example@email.com"
                                        className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">รหัสผ่าน</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={(e) => update('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-12 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">ยืนยันรหัสผ่าน</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.confirmPassword}
                                        onChange={(e) => update('confirmPassword', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-primary hover:bg-primary-dark text-text-primary font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
                            >
                                สมัครสมาชิก
                            </button>
                        </form>

                        <p className="text-center text-sm text-text-secondary mt-6">
                            มีบัญชีแล้ว?{' '}
                            <Link href="/login" className="text-primary-dark font-medium hover:underline">
                                เข้าสู่ระบบ
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
