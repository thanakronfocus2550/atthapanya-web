'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('เข้าสู่ระบบสำเร็จ! (Mock)');
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
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <GraduationCap className="w-7 h-7 text-text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-text-primary">เข้าสู่ระบบ</h1>
                            <p className="text-sm text-text-secondary mt-1">
                                ยินดีต้อนรับกลับมา! กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    อีเมล
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@email.com"
                                        className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    รหัสผ่าน
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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

                            {/* Remember + Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/40" />
                                    <span className="text-sm text-text-secondary">จดจำฉัน</span>
                                </label>
                                <Link href="/forgot-password" className="text-sm text-primary-dark hover:underline">
                                    ลืมรหัสผ่าน?
                                </Link>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full py-3 bg-primary hover:bg-primary-dark text-text-primary font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
                            >
                                เข้าสู่ระบบ
                            </button>
                        </form>

                        {/* Register Link */}
                        <p className="text-center text-sm text-text-secondary mt-6">
                            ยังไม่มีบัญชี?{' '}
                            <Link href="/register" className="text-primary-dark font-medium hover:underline">
                                สมัครสมาชิก
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
