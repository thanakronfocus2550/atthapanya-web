'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Users as UsersIcon } from 'lucide-react';
import { users, courses, userProgress, lessons } from '@/lib/data';
import { cn } from '@/lib/utils';
import React from 'react';

import PageTransition from '@/components/PageTransition';
import { AnimatePresence } from 'framer-motion';

export default function AdminStudentsPage() {
    const [search, setSearch] = useState('');
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

    const students = users.filter((u) => u.role === 'STUDENT');

    const filteredStudents = students.filter(
        (s) => s.name.includes(search) || s.email.includes(search)
    );

    const getStudentCourses = (userId: string) => {
        const courseIds = [...new Set(userProgress.filter((p) => p.userId === userId).map((p) => p.courseId))];
        return courseIds.map((courseId) => {
            const course = courses.find((c) => c.id === courseId);
            const courseLessons = lessons.filter((l) => l.courseId === courseId);
            const completed = userProgress.filter(
                (p) => p.userId === userId && p.courseId === courseId && p.status === 'COMPLETED'
            ).length;
            const percent = courseLessons.length > 0
                ? Math.round((completed / courseLessons.length) * 100)
                : 0;

            return {
                courseId,
                title: course?.title || 'Unknown',
                totalLessons: courseLessons.length,
                completedLessons: completed,
                percent,
            };
        });
    };

    const getOverallProgress = (userId: string) => {
        const studentCourses = getStudentCourses(userId);
        if (studentCourses.length === 0) return 0;
        return Math.round(
            studentCourses.reduce((acc, c) => acc + c.percent, 0) / studentCourses.length
        );
    };

    return (
        <PageTransition>
            <div className="space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-text-primary mb-2">จัดการนักเรียน</h1>
                        <p className="text-text-secondary text-sm font-medium">ติดตามความก้าวหน้าและจัดการข้อมูลนักเรียนทั้งหมดในระบบ</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="ค้นหาชื่อนักเรียน หรืออีเมล..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-border rounded-[20px] text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium shadow-sm"
                    />
                </div>

                {/* Student List */}
                <div className="bg-white rounded-[32px] border border-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-surface-dark border-b border-border">
                                    <th className="text-left px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">นักเรียน</th>
                                    <th className="text-left px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest hidden sm:table-cell">อีเมล</th>
                                    <th className="text-center px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest hidden md:table-cell">คอร์สที่เรียน</th>
                                    <th className="text-center px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">ความก้าวหน้า</th>
                                    <th className="text-center px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredStudents.map((student, i) => {
                                    const overall = getOverallProgress(student.id);
                                    const studentCourses = getStudentCourses(student.id);
                                    const isExpanded = expandedStudent === student.id;

                                    return (
                                        <React.Fragment key={student.id}>
                                            <motion.tr
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.02 }}
                                                className={cn(
                                                    "hover:bg-surface-dark/50 transition-all cursor-pointer group",
                                                    isExpanded && "bg-surface-dark/30"
                                                )}
                                                onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-sm font-black text-primary-dark shrink-0 border border-primary/20 group-hover:scale-110 transition-transform">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-text-primary text-base">{student.name}</p>
                                                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-tight sm:hidden">{student.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-text-secondary font-medium hidden sm:table-cell">{student.email}</td>
                                                <td className="px-8 py-5 text-center hidden md:table-cell">
                                                    <span className="px-3 py-1 bg-surface-dark rounded-xl font-black text-text-muted">
                                                        {studentCourses.length} คอร์ส
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4 justify-center">
                                                        <div className="w-32 h-2.5 bg-surface-dark rounded-full overflow-hidden border border-border">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${overall}%` }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 1, ease: "easeOut" }}
                                                                className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]"
                                                            />
                                                        </div>
                                                        <span className="text-xs font-black text-text-primary w-10 text-right">
                                                            {overall}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                                        isExpanded ? "bg-primary text-text-primary shadow-lg shadow-primary/20" : "bg-surface-dark text-text-muted group-hover:bg-primary/20 group-hover:text-primary"
                                                    )}>
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-5 h-5" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan={5} className="bg-surface-dark/20 p-0 overflow-hidden">
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                            >
                                                                <div className="p-8 space-y-4">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                                        <p className="text-xs font-black text-text-muted uppercase tracking-widest">
                                                                            ความก้าวหน้ารายคอร์ส
                                                                        </p>
                                                                    </div>
                                                                    {studentCourses.length > 0 ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            {studentCourses.map((sc) => (
                                                                                <motion.div
                                                                                    key={sc.courseId}
                                                                                    initial={{ opacity: 0, x: -20 }}
                                                                                    animate={{ opacity: 1, x: 0 }}
                                                                                    className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:border-primary/30 transition-all hover:shadow-md"
                                                                                >
                                                                                    <div className="flex items-center justify-between mb-4">
                                                                                        <p className="font-black text-text-primary">{sc.title}</p>
                                                                                        <span className="text-sm font-black text-primary-dark">{sc.percent}%</span>
                                                                                    </div>
                                                                                    <div className="h-2 bg-surface-dark rounded-full overflow-hidden mb-3">
                                                                                        <motion.div
                                                                                            initial={{ width: 0 }}
                                                                                            animate={{ width: `${sc.percent}%` }}
                                                                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                                                                            className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]"
                                                                                        />
                                                                                    </div>
                                                                                    <div className="flex justify-between items-center text-[10px] font-black text-text-muted uppercase tracking-widest">
                                                                                        <span>สำเร็จแล้ว {sc.completedLessons}/{sc.totalLessons} บทเรียน</span>
                                                                                        <span className={cn(
                                                                                            "px-2 py-0.5 rounded-lg",
                                                                                            sc.percent === 100 ? "bg-success/10 text-success" : "bg-surface-dark"
                                                                                        )}>
                                                                                            {sc.percent === 100 ? "สำเร็จ" : "กำลังเรียน"}
                                                                                        </span>
                                                                                    </div>
                                                                                </motion.div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-border">
                                                                            <p className="text-sm font-bold text-text-muted">ยังไม่ได้ลงทะเบียนคอร์สใดๆ</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </AnimatePresence>
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredStudents.length === 0 && (
                        <div className="text-center py-32 bg-white">
                            <div className="w-20 h-20 bg-surface-dark rounded-[32px] flex items-center justify-center mx-auto mb-6">
                                <UsersIcon className="w-10 h-10 text-text-muted/30" />
                            </div>
                            <h3 className="text-2xl font-black text-text-primary mb-2">ไม่พบนักเรียน</h3>
                            <p className="text-text-secondary text-sm max-w-sm mx-auto">ลองค้นหาด้วยชื่อหรืออีเมลอื่น</p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
