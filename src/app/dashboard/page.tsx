'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clock, TrendingUp, Calendar, PlayCircle, ArrowRight, Bell, Megaphone } from 'lucide-react';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import { useSiteData } from '@/components/SiteDataProvider';

export default function DashboardPage() {
    const { data } = useSiteData();
    const { courses = [], userProgress = [], schedule = [], lessons = [], enrolledCourseIds = [], userStats } = data;

    const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));

    // Calculate level progress
    const xpInCurrentLevel = userStats.xp % 500;
    const levelProgress = (xpInCurrentLevel / 500) * 100;

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
                {/* Profile Achievement Section */}
                <ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                        <div className="md:col-span-8 bg-gradient-to-br from-primary-dark via-primary to-primary-light p-8 rounded-[32px] text-text-primary shadow-xl shadow-primary/20 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

                            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-white/90 rounded-3xl flex items-center justify-center text-4xl font-black text-primary-dark shadow-inner rotate-3">
                                        ธ
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black text-white rounded-full border-4 border-primary flex items-center justify-center font-bold text-sm">
                                        Lv.{userStats.level}
                                    </div>
                                </div>

                                <div className="flex-1 text-center sm:text-left text-white">
                                    <h1 className="text-3xl font-black mb-1 drop-shadow-sm">
                                        สวัสดี, ธนภัทร 👋
                                    </h1>
                                    <p className="opacity-90 font-medium mb-4">มาพิชิตเป้าหมายการเรียนวันนี้กันเถอะ!</p>

                                    <div className="bg-black/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                        <div className="flex justify-between items-end mb-2 text-xs font-bold uppercase tracking-wider">
                                            <span>Level Progress</span>
                                            <span>{xpInCurrentLevel} / 500 XP</span>
                                        </div>
                                        <div className="h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${levelProgress}%` }}
                                                className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-4 grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-[32px] border border-border p-6 flex flex-col items-center justify-center text-center group hover:border-primary transition-colors">
                                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <span className="text-3xl">🔥</span>
                                </div>
                                <p className="text-2xl font-black text-text-primary">{userStats.streak}</p>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Day Streak</p>
                            </div>

                            <div className="bg-white rounded-[32px] border border-border p-6 flex flex-col items-center justify-center text-center group hover:border-primary transition-colors">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <span className="text-3xl">🏆</span>
                                </div>
                                <p className="text-2xl font-black text-text-primary">{userStats.xp}</p>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Total XP</p>
                            </div>

                            <div className="col-span-2 bg-white rounded-[32px] border border-border p-6 group hover:border-primary transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                        <TrendingUp className="w-6 h-6 text-primary-dark" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-end mb-1">
                                            <p className="text-xs font-bold text-text-muted uppercase">Avg. Progress</p>
                                            <p className="text-sm font-black text-primary-dark">{averageProgress}%</p>
                                        </div>
                                        <div className="h-2 bg-surface rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${averageProgress}%` }}
                                                className="h-full bg-primary rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Announcements Alert */}
                {data.announcements?.filter(a => a.active && a.category === 'URGENT').map(ann => (
                    <motion.div
                        key={ann.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-800"
                    >
                        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
                            <Megaphone className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">ประกาศด่วน: {ann.title}</h4>
                            <p className="text-xs opacity-80 line-clamp-1">{ann.content}</p>
                        </div>
                    </motion.div>
                ))}

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
                                            <Link
                                                href={`/classroom/${cp.id}`}
                                                className="inline-flex items-center gap-1.5 text-sm text-primary-dark hover:underline font-medium"
                                            >
                                                <PlayCircle className="w-4 h-4" />
                                                {cp.currentLesson ? cp.currentLesson.title : 'เริ่มเรียนเลย'}
                                            </Link>
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

                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-text-primary mb-4">
                                    <Bell className="w-5 h-5 inline mr-2" />
                                    ข่าวสารล่าสุด
                                </h2>
                                <div className="space-y-3">
                                    {data.announcements?.filter(a => a.active && a.category !== 'URGENT').slice(0, 3).map(ann => (
                                        <div key={ann.id} className="p-4 bg-white border border-border rounded-2xl hover:border-primary/50 transition-all">
                                            <p className="text-[10px] font-bold text-primary-dark mb-1">{ann.date}</p>
                                            <h4 className="text-sm font-bold text-text-primary mb-1">{ann.title}</h4>
                                            <p className="text-xs text-text-secondary line-clamp-2">{ann.content}</p>
                                        </div>
                                    ))}
                                    {(!data.announcements || data.announcements.filter(a => a.active).length === 0) && (
                                        <p className="text-sm text-text-muted text-center py-4 italic">ไม่มีประกาศใหม่</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
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
