'use client';

import { motion } from 'framer-motion';
import { Award, BookOpen, Users, Target, Eye, Heart, Clock, ChevronRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import { tutors } from '@/lib/data';

const stats = [
    { icon: Users, value: '2,500+', label: 'นักเรียนที่ไว้วางใจ' },
    { icon: BookOpen, value: '50+', label: 'คอร์สคุณภาพ' },
    { icon: Award, value: '98%', label: 'สอบติดมหาลัย' },
    { icon: Clock, value: '8+', label: 'ปีประสบการณ์' },
];

const timeline = [
    { year: '2561', title: 'ก่อตั้งสถาบัน', desc: 'เริ่มต้นจากห้องเรียนเล็กๆ ด้วยคณิตศาสตร์เพียงวิชาเดียว กับนักเรียน 15 คน' },
    { year: '2563', title: 'ขยายหลักสูตร', desc: 'เปิดสอนฟิสิกส์ เคมี ชีววิทยา และภาษาอังกฤษ พร้อมทีมอาจารย์เฉพาะทาง' },
    { year: '2565', title: 'ระบบ E-Learning', desc: 'พัฒนาแพลตฟอร์มออนไลน์ เพื่อให้นักเรียนเรียนได้ทุกที่ ทุกเวลา' },
    { year: '2567', title: 'นักเรียน 2,500+ คน', desc: 'เติบโตอย่างต่อเนื่อง ด้วยผลลัพธ์ที่พิสูจน์คุณภาพการสอน' },
];

const values = [
    { icon: Target, title: 'มุ่งมั่นในผลลัพธ์', desc: 'ทุกหลักสูตรออกแบบมาเพื่อทำคะแนนสอบให้ได้สูงสุด' },
    { icon: Eye, title: 'เข้าใจผู้เรียน', desc: 'ปรับวิธีการสอนให้เหมาะกับจังหวะการเรียนรู้ของแต่ละคน' },
    { icon: Heart, title: 'ใส่ใจทุกรายละเอียด', desc: 'ดูแลนักเรียนอย่างใกล้ชิด ตั้งแต่เนื้อหาจนถึงสภาพจิตใจ' },
];

export default function AboutPage() {
    return (
        <PageTransition>
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-white via-primary/5 to-primary/10 py-20 lg:py-28">
                <div className="absolute top-10 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-56 h-56 bg-primary/10 rounded-full blur-2xl" />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6">
                            เกี่ยวกับ<span className="text-primary-dark">อรรถปัญญา</span>
                        </h1>
                        <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
                            สถาบันกวดวิชาที่มุ่งมั่นพัฒนาศักยภาพผู้เรียนด้วยหลักสูตรคุณภาพ
                            และทีมอาจารย์ผู้เชี่ยวชาญ เพื่อเปิดประตูสู่มหาวิทยาลัยในฝัน
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-6 bg-surface rounded-2xl"
                            >
                                <div className="w-12 h-12 bg-primary/15 rounded-xl mx-auto mb-3 flex items-center justify-center">
                                    <stat.icon className="w-6 h-6 text-primary-dark" />
                                </div>
                                <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                                <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision / Mission */}
            <section className="py-16 lg:py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        <ScrollReveal>
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8">
                                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                                    <Eye className="w-6 h-6 text-primary-dark" />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-3">วิสัยทัศน์</h3>
                                <p className="text-text-secondary leading-relaxed">
                                    เป็นสถาบันกวดวิชาชั้นนำที่สร้างบัณฑิตคุณภาพ
                                    ด้วยการเรียนรู้ที่ทันสมัย เข้าถึงได้ทุกที่ทุกเวลา
                                    และมุ่งเน้นให้นักเรียนทุกคนบรรลุเป้าหมายทางการศึกษา
                                </p>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={0.15}>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-8">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                    <Target className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-3">พันธกิจ</h3>
                                <p className="text-text-secondary leading-relaxed">
                                    พัฒนาหลักสูตรที่ตรงจุด คัดสรรอาจารย์คุณภาพ
                                    และใช้เทคโนโลยีเพื่อส่งมอบการเรียนรู้ที่มีประสิทธิภาพสูงสุด
                                    เพราะเราเชื่อว่าทุกคนสมควรได้รับการศึกษาที่ดีที่สุด
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 lg:py-20 bg-surface">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <ScrollReveal>
                        <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
                            เส้นทางของเรา
                        </h2>
                    </ScrollReveal>
                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-0.5 bg-border lg:-translate-x-0.5" />
                        {timeline.map((item, i) => (
                            <ScrollReveal key={item.year} delay={i * 0.1}>
                                <div className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                                    {/* Dot */}
                                    <div className="absolute left-6 lg:left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 mt-2 ring-4 ring-white z-10" />
                                    {/* Card */}
                                    <div className={`ml-14 lg:ml-0 lg:w-[45%] ${i % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12 lg:ml-auto'}`}>
                                        <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-card transition-all">
                                            <span className="text-sm font-bold text-primary-dark">{item.year}</span>
                                            <h3 className="text-lg font-bold text-text-primary mt-1 mb-2">{item.title}</h3>
                                            <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-16 lg:py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <ScrollReveal>
                        <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
                            ค่านิยมหลัก
                        </h2>
                    </ScrollReveal>
                    <div className="grid md:grid-cols-3 gap-6">
                        {values.map((val, i) => (
                            <ScrollReveal key={val.title} delay={i * 0.1}>
                                <div className="text-center p-6 rounded-2xl border border-border hover:shadow-card-hover transition-all group">
                                    <div className="w-14 h-14 bg-primary/15 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                                        <val.icon className="w-7 h-7 text-primary-dark" />
                                    </div>
                                    <h3 className="text-lg font-bold text-text-primary mb-2">{val.title}</h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">{val.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tutors Summary */}
            <section className="py-16 lg:py-20 bg-surface">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <ScrollReveal>
                        <h2 className="text-3xl font-bold text-text-primary text-center mb-4">
                            ทีมอาจารย์ของเรา
                        </h2>
                        <p className="text-text-secondary text-center max-w-xl mx-auto mb-10">
                            อาจารย์ทุกท่านผ่านการคัดเลือกอย่างเข้มงวด มีผลงานการสอนที่พิสูจน์แล้ว
                        </p>
                    </ScrollReveal>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {tutors.map((tutor, i) => {
                            const colors = ['EAB308', '3B82F6', 'EC4899', '8B5CF6', 'F97316', '10B981'];
                            const bg = colors[i % colors.length];
                            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name.replace('อ.', ''))}&size=160&background=${bg}&color=fff&bold=true&font-size=0.4`;
                            return (
                                <ScrollReveal key={tutor.id} delay={i * 0.06}>
                                    <div className="text-center group">
                                        <div className="relative w-20 h-20 mx-auto mb-3">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                                            <img src={avatarUrl} alt={tutor.name} className="relative w-20 h-20 rounded-full ring-3 ring-white shadow-md" />
                                        </div>
                                        <p className="text-sm font-semibold text-text-primary">{tutor.name}</p>
                                        <p className="text-xs text-text-muted">{tutor.expertise[0]}</p>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>
        </PageTransition>
    );
}
