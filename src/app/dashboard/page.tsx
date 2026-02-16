'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clock, TrendingUp, Calendar, PlayCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import { courses, userProgress, schedule, lessons } from '@/lib/data';

export default function DashboardPage() {
    // Mock: user u1 enrolled in courses 1 and 2
    const enrolledCourseIds = ['1', '2'];
    const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));

    // Calculate progress per course
    const courseProgress = enrolledCourses.map((course) => {
        const courseLessons = lessons.filter((l) => l.courseId === course.id);
        const completedLessons = userProgress.filter(
            (p) => p.courseId === course.id && p.userId === 'u1' && p.status === 'COMPLETED'
        );
        const watchingLessons = userProgress.filter(
            (p) => p.courseId === course.id && p.userId === 'u1' && p.status === 'WATCHING'
        );
        const percent = courseLessons.length > 0
            ? Math.round((completedLessons.length / courseLessons.length) * 100)
            : 0;
        return {
            ...course,
            totalLessonsCount: courseLessons.length,
            completedCount: completedLessons.length,
            watchingCount: watchingLessons.length,
            percent,
            currentLesson: watchingLessons.length > 0
                ? lessons.find((l) => l.id === watchingLessons[0].lessonId)
                : null,
        };
    });

    const averageProgress = courseProgress.length > 0
        ? Math.round(courseProgress.reduce((acc, c) => acc + c.percent, 0) / courseProgress.length)
        : 0;

    const userSchedule = schedule.filter((s) =>
        enrolledCourses.some((c) => c.title === s.courseTitle)
    );

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <ScrollReveal>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-text-primary mb-1">
                            สวัสดี, ธนภัทร 👋
                        </h1>
                        <p className="text-text-secondary">มาดูความก้าวหน้าของคุณกันเถอะ</p>
                    </div>
                </ScrollReveal>

                {/* Stats Cards */}
                <ScrollReveal delay={0.1}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-2xl border border-border p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-primary-dark" />
                                </div>
                                <p className="text-sm text-text-secondary">ความก้าวหน้าเฉลี่ย</p>
                            </div>
                            <p className="text-3xl font-bold text-text-primary">{averageProgress}%</p>
                            <div className="mt-2 h-2 bg-surface rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${averageProgress}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full bg-primary rounded-full"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-border p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-blue-500" />
                                </div>
                                <p className="text-sm text-text-secondary">คอร์สที่ลงทะเบียน</p>
                            </div>
                            <p className="text-3xl font-bold text-text-primary">{enrolledCourses.length}</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-border p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-success" />
                                </div>
                                <p className="text-sm text-text-secondary">ชั่วโมงเรียนทั้งหมด</p>
                            </div>
                            <p className="text-3xl font-bold text-text-primary">
                                {enrolledCourses.reduce((acc, c) => acc + c.totalHours, 0)} ชม.
                            </p>
                        </div>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Continue Learning */}
                    <div className="lg:col-span-2">
                        <ScrollReveal delay={0.2}>
                            <h2 className="text-xl font-bold text-text-primary mb-4">เรียนต่อจากที่ค้างไว้</h2>
                            <div className="space-y-4">
                                {courseProgress.map((cp) => (
                                    <div
                                        key={cp.id}
                                        className="bg-white rounded-2xl border border-border p-5 hover:shadow-card transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div>
                                                <span className="text-xs px-2 py-0.5 bg-primary/15 text-primary-dark rounded-full">
                                                    {cp.category}
                                                </span>
                                                <h3 className="font-semibold text-text-primary mt-2">{cp.title}</h3>
                                                <p className="text-sm text-text-secondary mt-0.5">{cp.tutorName}</p>
                                            </div>
                                            <span className="text-2xl font-bold text-primary-dark shrink-0">
                                                {cp.percent}%
                                            </span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="h-2 bg-surface rounded-full overflow-hidden mb-3">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${cp.percent}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                                className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-text-muted">
                                                {cp.completedCount}/{cp.totalLessonsCount} บทเรียน
                                            </p>
                                            {cp.currentLesson && (
                                                <Link
                                                    href={`/classroom/${cp.id}`}
                                                    className="inline-flex items-center gap-1.5 text-sm text-primary-dark hover:underline font-medium"
                                                >
                                                    <PlayCircle className="w-4 h-4" />
                                                    {cp.currentLesson.title}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Schedule */}
                    <div>
                        <ScrollReveal delay={0.3}>
                            <h2 className="text-xl font-bold text-text-primary mb-4">
                                <Calendar className="w-5 h-5 inline mr-2" />
                                ตารางเรียน
                            </h2>
                            <div className="bg-white rounded-2xl border border-border overflow-hidden">
                                {userSchedule.length > 0 ? (
                                    <div className="divide-y divide-border">
                                        {userSchedule.map((s) => (
                                            <div key={s.id} className="p-4 hover:bg-surface/50 transition-colors">
                                                <p className="font-medium text-text-primary text-sm">{s.courseTitle}</p>
                                                <div className="flex items-center gap-3 mt-1.5 text-xs text-text-secondary">
                                                    <span className="px-2 py-0.5 bg-primary/10 text-primary-dark rounded-full font-medium">
                                                        {s.day}
                                                    </span>
                                                    <span>{s.time}</span>
                                                </div>
                                                <p className="text-xs text-text-muted mt-1">{s.tutorName}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-sm text-text-muted">
                                        ยังไม่มีตารางเรียน
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <Link
                                    href="/courses"
                                    className="inline-flex items-center gap-1.5 text-sm text-primary-dark hover:underline font-medium"
                                >
                                    ดูคอร์สเพิ่มเติม
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
