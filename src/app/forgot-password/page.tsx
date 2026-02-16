'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, GraduationCap, ArrowLeft, CheckCircle } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
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
                            <h1 className="text-2xl font-bold text-text-primary">ลืมรหัสผ่าน</h1>
                            <p className="text-sm text-text-secondary mt-1">
                                กรอกอีเมลของคุณ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้
                            </p>
                        </div>

                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">อีเมล</label>
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

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-primary hover:bg-primary-dark text-text-primary font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
                                >
                                    ส่งลิงก์รีเซ็ตรหัสผ่าน
                                </button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                                <h2 className="text-lg font-semibold text-text-primary mb-2">ส่งอีเมลแล้ว!</h2>
                                <p className="text-sm text-text-secondary mb-6">
                                    เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่
                                    <br />
                                    <span className="font-medium text-text-primary">{email}</span>
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-sm text-primary-dark hover:underline"
                                >
                                    ส่งอีกครั้ง
                                </button>
                            </motion.div>
                        )}

                        <div className="mt-6 text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                กลับไปหน้าเข้าสู่ระบบ
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
