'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, BookOpen, CreditCard, Monitor, Clock, Users, Shield } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';

const faqCategories = [
    { id: 'all', label: 'ทั้งหมด', icon: HelpCircle },
    { id: 'course', label: 'คอร์สเรียน', icon: BookOpen },
    { id: 'payment', label: 'การชำระเงิน', icon: CreditCard },
    { id: 'online', label: 'เรียนออนไลน์', icon: Monitor },
    { id: 'schedule', label: 'ตารางเรียน', icon: Clock },
    { id: 'general', label: 'ทั่วไป', icon: Shield },
];

const faqs = [
    {
        id: 1, category: 'course',
        question: 'เรียนกี่คนต่อห้อง?',
        answer: 'คอร์สกลุ่มเล็กไม่เกิน 15-20 คน เพื่อให้อาจารย์ดูแลนักเรียนได้ทั่วถึง สำหรับคอร์สออนไลน์ไม่จำกัดจำนวน แต่มีระบบถาม-ตอบสดในห้องเรียน',
    },
    {
        id: 2, category: 'course',
        question: 'สอนออนไลน์หรือ on-site?',
        answer: 'มีทั้ง 2 รูปแบบครับ! มีคอร์สเรียนสดที่สถาบัน (on-site) และคอร์สออนไลน์ที่เรียนผ่านระบบ Virtual Classroom ได้ทุกที่ทุกเวลา บางคอร์สมีแบบ Hybrid ที่เรียนสดแล้วดูย้อนหลังได้',
    },
    {
        id: 3, category: 'course',
        question: 'มีคอร์สเรียนอะไรบ้าง?',
        answer: 'เรามีคอร์สครอบคลุม A-Level (คณิตศาสตร์, ฟิสิกส์, เคมี, ชีววิทยา, ภาษาอังกฤษ), TGAT, คอร์สม.ต้น และม.ปลาย โดยแต่ละวิชามีทั้งคอร์สพื้นฐาน คอร์สเข้มข้น และคอร์สติว เจาะข้อสอบ',
    },
    {
        id: 4, category: 'course',
        question: 'เหมาะกับนักเรียนระดับไหน?',
        answer: 'เรามีคอร์สตั้งแต่ ม.1 ถึง ม.6 และคอร์สเตรียมสอบเข้ามหาวิทยาลัยโดยเฉพาะ ก่อนเริ่มเรียนจะมีแบบทดสอบวัดระดับเพื่อแนะนำคอร์สที่เหมาะสมที่สุด',
    },
    {
        id: 5, category: 'payment',
        question: 'จ่ายเงินยังไง?',
        answer: 'รับชำระผ่านโอนธนาคาร (PromptPay, บัญชีธนาคาร) หลังโอนแล้วอัปโหลดสลิปผ่านระบบ ทีมงานจะตรวจสอบภายใน 1-2 ชั่วโมง เปิดระบบให้เข้าเรียนได้ทันที',
    },
    {
        id: 6, category: 'payment',
        question: 'มีผ่อนชำระได้มั้ย?',
        answer: 'สำหรับคอร์สที่มีราคา 3,000 บาทขึ้นไป สามารถผ่อนชำระได้ 2-3 งวด โดยไม่มีดอกเบี้ย ติดต่อสอบถามเพิ่มเติมทาง LINE @attapanya',
    },
    {
        id: 7, category: 'payment',
        question: 'มีส่วนลดมั้ย?',
        answer: 'มีโปรโมชั่นสม่ำเสมอ! เช่น Early Bird ลด 15% สมัคร 2 คอร์สขึ้นไปลด 10% และส่วนลดพิเศษสำหรับนักเรียนเก่า ติดตามได้ที่ Facebook Page และ LINE Official',
    },
    {
        id: 8, category: 'online',
        question: 'เรียนไม่ทัน ดูย้อนหลังได้มั้ย?',
        answer: 'ได้ครับ! วิดีโอบันทึกการสอนสดจะถูกอัปโหลดภายใน 24 ชั่วโมงหลังจบคลาส สามารถดูย้อนหลังได้ตลอดอายุคอร์ส (ปกติ 6 เดือน - 1 ปี)',
    },
    {
        id: 9, category: 'online',
        question: 'ระบบเรียนออนไลน์ใช้งานยังไง?',
        answer: 'หลัง login เข้าระบบ จะเห็นคอร์สที่ลงทะเบียนในหน้า Dashboard กดเข้าห้องเรียนเสมือน (Virtual Classroom) ดูวิดีโอ จดโน้ต และทำแบบฝึกหัดได้ครบจบในที่เดียว',
    },
    {
        id: 10, category: 'online',
        question: 'เรียนบนมือถือได้มั้ย?',
        answer: 'ได้ครับ! ระบบรองรับทั้ง คอมพิวเตอร์, แท็บเลต และมือถือ ผ่าน Browser ได้เลย ไม่ต้องติดตั้งแอปเพิ่ม',
    },
    {
        id: 11, category: 'schedule',
        question: 'เรียนวันไหน เวลาไหน?',
        answer: 'คอร์สสดมีเรียนจันทร์-ศุกร์ เวลา 16:00-20:00 น. และเสาร์-อาทิตย์ 09:00-16:00 น. ส่วนคอร์สออนไลน์เรียนได้ 24 ชั่วโมง ดูตารางเรียนละเอียดได้ที่หน้า Dashboard',
    },
    {
        id: 12, category: 'schedule',
        question: 'คอร์สหนึ่งใช้เวลาเรียนนานเท่าไหร่?',
        answer: 'ขึ้นอยู่กับคอร์ส โดยเฉลี่ยประมาณ 20-40 ชั่วโมง (8-16 ครั้ง ครั้งละ 2-3 ชั่วโมง) บางคอร์สเข้มข้นอาจถึง 50 ชั่วโมง',
    },
    {
        id: 13, category: 'general',
        question: 'สถาบันตั้งอยู่ที่ไหน?',
        answer: 'สถาบันกวดวิชาอรรถปัญญา ตั้งอยู่ที่ 123/45 ถ.พหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900 ใกล้ BTS หมอชิต เดินทางสะดวก',
    },
    {
        id: 14, category: 'general',
        question: 'ติดต่อสอบถามได้ทางไหน?',
        answer: 'โทร 02-xxx-xxxx (จันทร์-เสาร์ 09:00-18:00), LINE: @attapanya, Facebook: สถาบันกวดวิชาอรรถปัญญา, Email: info@attapanya.com หรือกรอกฟอร์มในหน้าติดต่อเรา',
    },
    {
        id: 15, category: 'general',
        question: 'มีทดลองเรียนฟรีมั้ย?',
        answer: 'มีครับ! ทุกคอร์สมีบทเรียนตัวอย่างฟรี 1-2 บท ให้ทดลองเรียนก่อนตัดสินใจ และบางช่วงมี Open House ที่เปิดให้เข้าเรียนฟรีทั้งวัน',
    },
];

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [openId, setOpenId] = useState<number | null>(null);

    const filtered = activeCategory === 'all' ? faqs : faqs.filter(f => f.category === activeCategory);

    return (
        <PageTransition>
            {/* Hero */}
            <section className="relative overflow-hidden py-16 lg:py-20" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 40%, #B45309 100%)' }}>
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                            <HelpCircle className="w-4 h-4" />
                            คำถามที่พบบ่อย
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">มีอะไรสงสัย? ถามได้เลย!</h1>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto">
                            รวมคำถามที่ผู้ปกครองและนักเรียนถามบ่อยที่สุด หากไม่พบคำตอบ สามารถติดต่อเราได้ตลอด
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="py-12 lg:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <ScrollReveal>
                        <div className="flex flex-wrap justify-center gap-2 mb-10">
                            {faqCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setActiveCategory(cat.id); setOpenId(null); }}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.id
                                        ? 'bg-primary text-text-primary shadow-md shadow-primary/20'
                                        : 'bg-surface text-text-secondary hover:bg-surface-dark'
                                        }`}
                                >
                                    <cat.icon className="w-4 h-4" />
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </ScrollReveal>

                    {/* FAQ Accordion */}
                    <div className="space-y-3">
                        {filtered.map((faq, i) => (
                            <ScrollReveal key={faq.id} delay={i * 0.04}>
                                <div className="bg-white rounded-2xl border border-border hover:border-primary/30 transition-all overflow-hidden">
                                    <button
                                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                        className="w-full flex items-center justify-between px-6 py-5 text-left"
                                    >
                                        <span className="font-semibold text-text-primary pr-4">{faq.question}</span>
                                        <motion.div
                                            animate={{ rotate: openId === faq.id ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="shrink-0"
                                        >
                                            <ChevronDown className="w-5 h-5 text-text-muted" />
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {openId === faq.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <div className="px-6 pb-5 text-text-secondary leading-relaxed border-t border-border/50 pt-4">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    {/* Still have questions? */}
                    <ScrollReveal delay={0.2}>
                        <div className="mt-12 text-center bg-surface rounded-2xl p-8 border border-border">
                            <h3 className="text-xl font-bold text-text-primary mb-2">ยังไม่พบคำตอบ?</h3>
                            <p className="text-text-secondary mb-6">ทีมงานพร้อมตอบทุกข้อสงสัยของคุณ</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-text-primary font-semibold rounded-xl transition-all text-sm">
                                    ติดต่อเรา
                                </a>
                                <a href="https://line.me/" target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all text-sm">
                                    LINE @attapanya
                                </a>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </PageTransition>
    );
}
