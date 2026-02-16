'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Users as UsersIcon } from 'lucide-react';
import { users, courses, userProgress, lessons } from '@/lib/data';

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
        <div>
            <h1 className="text-2xl font-bold text-text-primary mb-6">จัดการนักเรียน</h1>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="ค้นหานักเรียน..."
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                </div>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface border-b border-border">
                                <th className="text-left px-5 py-3 font-medium text-text-secondary">นักเรียน</th>
                                <th className="text-left px-5 py-3 font-medium text-text-secondary hidden sm:table-cell">อีเมล</th>
                                <th className="text-center px-5 py-3 font-medium text-text-secondary hidden md:table-cell">คอร์สที่เรียน</th>
                                <th className="text-center px-5 py-3 font-medium text-text-secondary">ความก้าวหน้า</th>
                                <th className="text-center px-5 py-3 font-medium text-text-secondary w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredStudents.map((student) => {
                                const overall = getOverallProgress(student.id);
                                const studentCourses = getStudentCourses(student.id);
                                return (
                                    <>
                                        <tr key={student.id} className="hover:bg-surface/50 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-primary/15 rounded-full flex items-center justify-center text-sm font-bold text-primary-dark shrink-0">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-text-primary">{student.name}</p>
                                                        <p className="text-xs text-text-muted sm:hidden">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-text-secondary hidden sm:table-cell">{student.email}</td>
                                            <td className="px-5 py-4 text-center hidden md:table-cell">{studentCourses.length}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3 justify-center">
                                                    <div className="w-24 h-2 bg-surface rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${overall}%` }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 0.8 }}
                                                            className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-text-primary w-9 text-right">
                                                        {overall}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    onClick={() =>
                                                        setExpandedStudent(expandedStudent === student.id ? null : student.id)
                                                    }
                                                    className="p-1.5 rounded-lg hover:bg-surface-dark transition-colors text-text-muted"
                                                >
                                                    {expandedStudent === student.id ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Expanded per-course progress */}
                                        {expandedStudent === student.id && (
                                            <tr key={`${student.id}-detail`}>
                                                <td colSpan={5} className="bg-surface/50 px-5 py-4">
                                                    <p className="text-sm font-medium text-text-primary mb-3">
                                                        ความก้าวหน้ารายคอร์ส
                                                    </p>
                                                    {studentCourses.length > 0 ? (
                                                        <div className="space-y-3">
                                                            {studentCourses.map((sc) => (
                                                                <div key={sc.courseId} className="bg-white p-3 rounded-xl border border-border">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <p className="text-sm font-medium text-text-primary">{sc.title}</p>
                                                                        <span className="text-sm font-bold text-primary-dark">{sc.percent}%</span>
                                                                    </div>
                                                                    <div className="h-2 bg-surface rounded-full overflow-hidden">
                                                                        <motion.div
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${sc.percent}%` }}
                                                                            transition={{ duration: 0.6 }}
                                                                            className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
                                                                        />
                                                                    </div>
                                                                    <p className="text-xs text-text-muted mt-1">
                                                                        {sc.completedLessons}/{sc.totalLessons} บทเรียน
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-text-muted text-center py-4">ยังไม่ได้ลงทะเบียนคอร์สใดๆ</p>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredStudents.length === 0 && (
                    <div className="text-center py-12 text-text-muted">
                        <UsersIcon className="w-10 h-10 mx-auto mb-2" />
                        ไม่พบนักเรียน
                    </div>
                )}
            </div>
        </div>
    );
}
