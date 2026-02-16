'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Phone, Mail, MapPin, Clock, Send, CheckCircle,
    Facebook, MessageCircle
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';

const contactInfo = [
    { icon: Phone, label: 'โทรศัพท์', value: '02-123-4567', href: 'tel:021234567' },
    { icon: Mail, label: 'อีเมล', value: 'info@attapanya.com', href: 'mailto:info@attapanya.com' },
    { icon: MapPin, label: 'ที่อยู่', value: '123 ถ.รัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400', href: '#' },
    { icon: Clock, label: 'เวลาทำการ', value: 'จันทร์ - เสาร์ 10:00 - 20:00 น.', href: '#' },
];

const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#', color: 'hover:bg-blue-50 hover:text-blue-600' },
    { icon: MessageCircle, label: 'LINE', href: '#', color: 'hover:bg-green-50 hover:text-green-600' },
    { icon: Mail, label: 'Email', href: 'mailto:info@attapanya.com', color: 'hover:bg-red-50 hover:text-red-500' },
];

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <PageTransition>
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-white via-primary/5 to-primary/10 py-16 lg:py-24">
                <div className="absolute top-10 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                            ติดต่อ<span className="text-primary-dark">เรา</span>
                        </h1>
                        <p className="text-lg text-text-secondary max-w-xl mx-auto">
                            มีคำถามหรือต้องการข้อมูลเพิ่มเติม? ติดต่อเราได้ทุกช่องทาง
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 lg:py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid lg:grid-cols-5 gap-10">
                        {/* Contact Info */}
                        <div className="lg:col-span-2">
                            <ScrollReveal>
                                <h2 className="text-2xl font-bold text-text-primary mb-6">ข้อมูลติดต่อ</h2>
                                <div className="space-y-5 mb-8">
                                    {contactInfo.map((item) => (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            className="flex items-start gap-4 p-4 rounded-2xl hover:bg-surface transition-colors group"
                                        >
                                            <div className="w-11 h-11 bg-primary/15 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                                                <item.icon className="w-5 h-5 text-primary-dark" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-text-muted">{item.label}</p>
                                                <p className="font-medium text-text-primary text-sm">{item.value}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>

                                {/* Social Links */}
                                <h3 className="font-semibold text-text-primary mb-3">ติดตามเรา</h3>
                                <div className="flex gap-3">
                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            className={`w-11 h-11 rounded-xl border border-border flex items-center justify-center text-text-muted transition-colors ${social.color}`}
                                            title={social.label}
                                        >
                                            <social.icon className="w-5 h-5" />
                                        </a>
                                    ))}
                                </div>

                                {/* Map Placeholder */}
                                <div className="mt-8 rounded-2xl overflow-hidden border border-border h-48 bg-surface flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPin className="w-8 h-8 text-text-muted mx-auto mb-2" />
                                        <p className="text-sm text-text-muted">Google Maps</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            <ScrollReveal delay={0.15}>
                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-surface rounded-3xl p-12 text-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 200 }}
                                        >
                                            <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-text-primary mb-3">ส่งข้อความสำเร็จ!</h3>
                                        <p className="text-text-secondary mb-6">ขอบคุณที่ติดต่อเรา เราจะตอบกลับภายใน 24 ชั่วโมง</p>
                                        <button
                                            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                                            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-text-primary font-medium rounded-xl transition-all text-sm"
                                        >
                                            ส่งข้อความอีกครั้ง
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className="bg-surface rounded-3xl p-8">
                                        <h2 className="text-2xl font-bold text-text-primary mb-6">ส่งข้อความถึงเรา</h2>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-text-secondary mb-1.5">ชื่อ-นามสกุล *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={form.name}
                                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-text-secondary mb-1.5">อีเมล *</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={form.email}
                                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-text-secondary mb-1.5">เบอร์โทรศัพท์</label>
                                                    <input
                                                        type="tel"
                                                        value={form.phone}
                                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-text-secondary mb-1.5">หัวข้อ *</label>
                                                    <select
                                                        required
                                                        value={form.subject}
                                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                                    >
                                                        <option value="">เลือกหัวข้อ</option>
                                                        <option value="course">สอบถามคอร์สเรียน</option>
                                                        <option value="payment">เรื่องการชำระเงิน</option>
                                                        <option value="tech">ปัญหาทางเทคนิค</option>
                                                        <option value="other">อื่นๆ</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-text-secondary mb-1.5">ข้อความ *</label>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    value={form.message}
                                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                                                    placeholder="พิมพ์ข้อความของคุณที่นี่..."
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full py-3 bg-primary hover:bg-primary-dark text-text-primary font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
                                            >
                                                <Send className="w-4 h-4" />
                                                ส่งข้อความ
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>
        </PageTransition>
    );
}
