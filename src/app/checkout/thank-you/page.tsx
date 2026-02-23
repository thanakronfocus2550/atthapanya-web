'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, PlayCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';

export default function ThankYouPage() {
    return (
        <PageTransition>
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <CheckCircle className="w-12 h-12 text-success" />
                </motion.div>

                <h1 className="text-4xl font-bold text-text-primary mb-4">เราได้รับข้อมูลของคุณแล้ว!</h1>
                <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
                    ขอบคุณที่รอคอย ทีมงานกำลังตรวจสอบสลิปการชำระเงินของคุณอย่างเร่งด่วน
                    คุณจะได้รับการแจ้งเตือนและสามารถเริ่มเรียนได้ภายใน 1-2 ชั่วโมง
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/dashboard"
                        className="p-4 bg-white border border-border rounded-2xl flex flex-col items-center gap-2 hover:border-primary/40 transition-all hover:bg-surface"
                    >
                        <PlayCircle className="w-6 h-6 text-primary-dark" />
                        <span className="font-bold text-text-primary">ไปที่แดชบอร์ด</span>
                        <span className="text-xs text-text-muted tracking-tight">รอดำเนินการอนุมัติ</span>
                    </Link>
                    <Link
                        href="/courses"
                        className="p-4 bg-white border border-border rounded-2xl flex flex-col items-center gap-2 hover:border-primary/40 transition-all hover:bg-surface"
                    >
                        <BookOpen className="w-6 h-6 text-primary-dark" />
                        <span className="font-bold text-text-primary">ดูคอร์สอื่นเพิ่ม</span>
                        <span className="text-xs text-text-muted tracking-tight">กลับไปเลือกซื้อคอร์ส</span>
                    </Link>
                </div>

                <div className="mt-12 text-sm text-text-muted">
                    มีปัญหา? <Link href="/contact" className="text-primary-dark hover:underline font-medium">ติดต่อฝ่ายช่วยเหลือ</Link>
                </div>
            </div>
        </PageTransition>
    );
}
