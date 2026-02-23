'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Clock, Users, Star, BookOpen, ChevronDown, ShoppingCart,
    PlayCircle, CheckCircle, ArrowLeft, Check
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import { useSiteData } from '@/components/SiteDataProvider';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/components/CartProvider';

export default function CourseDetailPage() {
    const params = useParams();
    const { data, enrollInCourse } = useSiteData();
    const { courses = [], lessons = [], enrolledCourseIds = [] } = data;

    const id = params.id as string;
    const course = courses.find((c) => c.id === id);
    const courseLessons = lessons.filter((l) => l.courseId === id);

    const [openAccordion, setOpenAccordion] = useState<string | null>(courseLessons[0]?.id || null);
    const { addItem, isInCart, removeItem } = useCart();
    const [justAdded, setJustAdded] = useState(false);

    const inCart = course ? isInCart(course.id) : false;
    const isEnrolled = course ? enrolledCourseIds.includes(course.id) : false;

    const handleAddToCart = () => {
        if (!course || inCart || isEnrolled) return;
        addItem(course);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
    };

    if (!course) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">ไม่พบคอร์ส</h2>
                    <Link href="/courses" className="text-primary-dark hover:underline">
                        กลับไปหน้าคอร์สเรียน
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <PageTransition>
            {/* Header */}
            <div className="bg-gradient-to-r from-text-primary to-gray-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        กลับไปหน้าคอร์สเรียน
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-3 py-1 bg-primary text-text-primary text-xs font-medium rounded-full">
                                {course.category}
                            </span>
                            <span className="px-3 py-1 bg-white/15 text-white text-xs rounded-full">
                                {course.subject}
                            </span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4">{course.title}</h1>
                        <p className="text-gray-300 max-w-2xl mb-6">{course.description}</p>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                            <span className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-primary fill-primary" />
                                {course.rating} คะแนน
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                {course.enrolledCount} คนเรียน
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {course.totalHours} ชั่วโมง
                            </span>
                            <span className="flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4" />
                                {course.totalLessons} บทเรียน
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Tutor Info */}
                        <ScrollReveal>
                            <div className="bg-white rounded-2xl border border-border p-6 mb-6">
                                <h3 className="font-semibold text-text-primary mb-4">ผู้สอน</h3>
                                {data.tutors?.find(t => t.name === course.tutorName) ? (() => {
                                    const tutor = data.tutors.find(t => t.name === course.tutorName)!;
                                    return (
                                        <div className="flex flex-col sm:flex-row gap-6">
                                            <div className="w-20 h-20 bg-surface rounded-2xl overflow-hidden shrink-0 border border-border">
                                                {tutor.avatar ? (
                                                    <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary-dark bg-primary/10">
                                                        {tutor.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <h4 className="font-bold text-text-primary text-lg">{tutor.name}</h4>
                                                    {tutor.expertise.map(exp => (
                                                        <span key={exp} className="px-2 py-0.5 bg-primary/10 text-primary-dark text-[10px] font-bold rounded-full">
                                                            {exp}
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                                                    {tutor.bio}
                                                </p>
                                                {tutor.links && (
                                                    <div className="flex gap-4 text-xs font-semibold text-primary-dark">
                                                        {tutor.links.facebook && <a href={tutor.links.facebook} className="hover:underline">Facebook</a>}
                                                        {tutor.links.line && <span className="text-text-muted">Line: {tutor.links.line}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })() : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary/15 rounded-full flex items-center justify-center text-lg font-bold text-primary-dark">
                                            {course.tutorName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-text-primary">{course.tutorName}</p>
                                            <p className="text-sm text-text-secondary">อาจารย์ประจำสถาบันอรรถปัญญา</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollReveal>

                        {/* Lesson Accordion */}
                        <ScrollReveal delay={0.1}>
                            <div className="bg-white rounded-2xl border border-border overflow-hidden">
                                <div className="p-6 border-b border-border">
                                    <h3 className="font-semibold text-text-primary">
                                        เนื้อหาบทเรียน ({courseLessons.length} บท)
                                    </h3>
                                </div>
                                <div className="divide-y divide-border">
                                    {courseLessons.map((lesson, i) => (
                                        <div key={lesson.id}>
                                            {isEnrolled ? (
                                                <Link
                                                    href={`/classroom/${course.id}?lessonId=${lesson.id}`}
                                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface/50 transition-colors text-left group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-7 h-7 bg-surface group-hover:bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-text-secondary group-hover:text-primary-dark transition-colors">
                                                            {i + 1}
                                                        </span>
                                                        <span className="text-sm font-semibold text-text-primary group-hover:text-primary-dark transition-colors">
                                                            {lesson.title}
                                                        </span>
                                                        <PlayCircle className="w-4 h-4 text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-text-muted">{lesson.duration} นาที</span>
                                                        <ChevronDown className="w-4 h-4 text-text-muted opacity-0" />
                                                    </div>
                                                </Link>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            setOpenAccordion(openAccordion === lesson.id ? null : lesson.id)
                                                        }
                                                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface/50 transition-colors text-left"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-7 h-7 bg-surface rounded-full flex items-center justify-center text-xs font-medium text-text-secondary">
                                                                {i + 1}
                                                            </span>
                                                            <span className="text-sm font-medium text-text-primary">
                                                                {lesson.title}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs text-text-muted">{lesson.duration} นาที</span>
                                                            <ChevronDown
                                                                className={`w-4 h-4 text-text-muted transition-transform ${openAccordion === lesson.id ? 'rotate-180' : ''
                                                                    }`}
                                                            />
                                                        </div>
                                                    </button>
                                                    {openAccordion === lesson.id && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="px-6 pb-4"
                                                        >
                                                            <div className="pl-10 flex items-center gap-4 text-sm text-text-secondary">
                                                                <span className="flex items-center gap-1.5">
                                                                    <PlayCircle className="w-4 h-4 text-primary-dark" />
                                                                    วิดีโอ {lesson.duration} นาที
                                                                </span>
                                                                <span className="flex items-center gap-1.5">
                                                                    <CheckCircle className="w-4 h-4 text-text-muted" />
                                                                    ยังไม่ได้เรียน
                                                                </span>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Sticky Sidebar */}
                    <aside className="lg:w-80 shrink-0">
                        <div className="sticky top-24">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl border border-border p-6 shadow-card"
                            >
                                {/* Price */}
                                <div className="text-center mb-6">
                                    <p className="text-3xl font-bold text-primary-dark">
                                        {formatPrice(course.price)}
                                    </p>
                                    <p className="text-sm text-text-muted mt-1">ราคาต่อคอร์ส</p>
                                </div>

                                {/* Add to Cart / In Cart / Enroll */}
                                {isEnrolled ? (
                                    <Link
                                        href={`/classroom/${course.id}`}
                                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary-dark hover:bg-black text-white font-semibold rounded-xl transition-all shadow-lg shadow-black/10 mb-3"
                                    >
                                        <PlayCircle className="w-5 h-5" />
                                        เข้าสู่ห้องเรียน
                                    </Link>
                                ) : inCart ? (
                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-50 text-green-700 font-semibold rounded-xl border border-green-200">
                                            <Check className="w-5 h-5" />
                                            เพิ่มลงตะกร้าแล้ว
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href="/checkout"
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary hover:bg-primary-dark text-text-primary font-semibold rounded-xl transition-all text-sm"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                ไปตะกร้า
                                            </Link>
                                            <button
                                                onClick={() => removeItem(course.id)}
                                                className="px-4 py-2.5 border border-border rounded-xl text-sm text-text-secondary hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                                            >
                                                นำออก
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary hover:bg-primary-dark text-text-primary font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 mb-3"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        {justAdded ? 'เพิ่มแล้ว ✓' : 'เพิ่มลงตะกร้า'}
                                    </button>
                                )}

                                <div className="text-center text-xs text-text-muted mb-6">
                                    เริ่มเรียนได้ทันทีหลังชำระเงิน
                                </div>

                                {/* Course Info */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between py-2 border-b border-border">
                                        <span className="text-text-secondary">ระดับ</span>
                                        <span className="font-medium">{course.category}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-border">
                                        <span className="text-text-secondary">จำนวนบทเรียน</span>
                                        <span className="font-medium">{course.totalLessons} บท</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-border">
                                        <span className="text-text-secondary">ชั่วโมงเรียน</span>
                                        <span className="font-medium">{course.totalHours} ชม.</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-text-secondary">ผู้เรียน</span>
                                        <span className="font-medium">{course.enrolledCount} คน</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </aside>
                </div>
            </div>
        </PageTransition>
    );
}
