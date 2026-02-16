'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, Pencil, Trash2, X, GripVertical, ChevronDown, ChevronUp,
    BookOpen, ImageIcon
} from 'lucide-react';
import { courses as initialCourses, lessons as allLessons } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import type { Course } from '@/types';

export default function AdminCoursesPage() {
    const [courseList, setCourseList] = useState(initialCourses);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
    const [form, setForm] = useState({
        title: '', description: '', price: '', tutorName: '', category: 'A-Level', subject: 'คณิตศาสตร์', thumbnail: '',
    });

    const openAdd = () => {
        setEditingCourse(null);
        setForm({ title: '', description: '', price: '', tutorName: '', category: 'A-Level', subject: 'คณิตศาสตร์', thumbnail: '' });
        setShowModal(true);
    };

    const openEdit = (course: Course) => {
        setEditingCourse(course);
        setForm({
            title: course.title,
            description: course.description,
            price: course.price.toString(),
            tutorName: course.tutorName,
            category: course.category,
            subject: course.subject,
            thumbnail: course.thumbnail || '',
        });
        setShowModal(true);
    };

    const handleSave = () => {
        if (editingCourse) {
            setCourseList(
                courseList.map((c) =>
                    c.id === editingCourse.id
                        ? {
                            ...c,
                            title: form.title,
                            description: form.description,
                            price: Number(form.price),
                            tutorName: form.tutorName,
                            category: form.category as Course['category'],
                            subject: form.subject as Course['subject'],
                            thumbnail: form.thumbnail,
                        }
                        : c
                )
            );
        } else {
            const newCourse: Course = {
                id: Date.now().toString(),
                title: form.title,
                description: form.description,
                price: Number(form.price),
                thumbnail: form.thumbnail,
                tutorName: form.tutorName,
                category: form.category as Course['category'],
                subject: form.subject as Course['subject'],
                totalHours: 0,
                totalLessons: 0,
                rating: 0,
                enrolledCount: 0,
                createdAt: new Date().toISOString(),
            };
            setCourseList([...courseList, newCourse]);
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('ต้องการลบคอร์สนี้หรือไม่?')) {
            setCourseList(courseList.filter((c) => c.id !== id));
        }
    };

    const courseLessons = (courseId: string) =>
        allLessons.filter((l) => l.courseId === courseId).sort((a, b) => a.orderIndex - b.orderIndex);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-text-primary">จัดการคอร์สเรียน</h1>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-primary font-medium text-sm rounded-xl transition-all"
                >
                    <Plus className="w-4 h-4" />
                    เพิ่มคอร์สใหม่
                </button>
            </div>

            {/* Course Table */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface border-b border-border">
                                <th className="text-left px-5 py-3 font-medium text-text-secondary">คอร์ส</th>
                                <th className="text-left px-5 py-3 font-medium text-text-secondary hidden md:table-cell">หมวดหมู่</th>
                                <th className="text-left px-5 py-3 font-medium text-text-secondary hidden sm:table-cell">ผู้สอน</th>
                                <th className="text-right px-5 py-3 font-medium text-text-secondary">ราคา</th>
                                <th className="text-center px-5 py-3 font-medium text-text-secondary hidden lg:table-cell">ผู้เรียน</th>
                                <th className="text-center px-5 py-3 font-medium text-text-secondary">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {courseList.map((course) => (
                                <>
                                    <tr key={course.id} className="hover:bg-surface/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {course.thumbnail ? (
                                                    <img src={course.thumbnail} alt={course.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                                        <BookOpen className="w-5 h-5 text-primary/50" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-text-primary">{course.title}</p>
                                                    <p className="text-xs text-text-muted">{course.totalLessons} บท • {course.totalHours} ชม.</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span className="px-2.5 py-1 bg-primary/10 text-primary-dark text-xs rounded-full">
                                                {course.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-text-secondary hidden sm:table-cell">{course.tutorName}</td>
                                        <td className="px-5 py-4 text-right font-medium">{formatPrice(course.price)}</td>
                                        <td className="px-5 py-4 text-center text-text-secondary hidden lg:table-cell">{course.enrolledCount}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() =>
                                                        setExpandedCourse(expandedCourse === course.id ? null : course.id)
                                                    }
                                                    className="p-1.5 rounded-lg hover:bg-surface-dark transition-colors text-text-muted"
                                                    title="บทเรียน"
                                                >
                                                    {expandedCourse === course.id ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => openEdit(course)}
                                                    className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                                                    title="แก้ไข"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-danger transition-colors"
                                                    title="ลบ"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Expanded lessons */}
                                    {expandedCourse === course.id && (
                                        <tr key={`${course.id}-lessons`}>
                                            <td colSpan={6} className="bg-surface/50 px-5 py-4">
                                                <p className="text-sm font-medium text-text-primary mb-3">ลำดับบทเรียน (Drag & Drop)</p>
                                                <div className="space-y-2">
                                                    {courseLessons(course.id).map((lesson) => (
                                                        <div
                                                            key={lesson.id}
                                                            className="flex items-center gap-3 bg-white p-3 rounded-xl border border-border cursor-move hover:shadow-sm transition-shadow"
                                                        >
                                                            <GripVertical className="w-4 h-4 text-text-muted shrink-0" />
                                                            <span className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary-dark shrink-0">
                                                                {lesson.orderIndex}
                                                            </span>
                                                            <span className="text-sm text-text-primary flex-1">{lesson.title}</span>
                                                            <span className="text-xs text-text-muted">{lesson.duration} นาที</span>
                                                        </div>
                                                    ))}
                                                    {courseLessons(course.id).length === 0 && (
                                                        <p className="text-sm text-text-muted text-center py-4">ยังไม่มีบทเรียน</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-text-primary">
                                {editingCourse ? 'แก้ไขคอร์ส' : 'เพิ่มคอร์สใหม่'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">ชื่อคอร์ส</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">รายละเอียด</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">ราคา (บาท)</label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">ผู้สอน</label>
                                    <input
                                        type="text"
                                        value={form.tutorName}
                                        onChange={(e) => setForm({ ...form, tutorName: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">หมวดหมู่</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    >
                                        <option value="A-Level">A-Level</option>
                                        <option value="TGAT">TGAT</option>
                                        <option value="ม.ต้น">ม.ต้น</option>
                                        <option value="ม.ปลาย">ม.ปลาย</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">วิชา</label>
                                    <select
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    >
                                        <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                                        <option value="ฟิสิกส์">ฟิสิกส์</option>
                                        <option value="เคมี">เคมี</option>
                                        <option value="ชีววิทยา">ชีววิทยา</option>
                                        <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                                        <option value="ภาษาไทย">ภาษาไทย</option>
                                    </select>
                                </div>
                            </div>

                            {/* Thumbnail URL */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">รูปภาพคอร์ส (URL)</label>
                                <input
                                    type="url"
                                    value={form.thumbnail}
                                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                                    placeholder="https://example.com/course-image.jpg"
                                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                />
                                {form.thumbnail && (
                                    <div className="mt-2 relative rounded-xl overflow-hidden border border-border">
                                        <img
                                            src={form.thumbnail}
                                            alt="Preview"
                                            className="w-full h-32 object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    </div>
                                )}
                                {!form.thumbnail && (
                                    <p className="text-xs text-text-muted mt-1.5 flex items-center gap-1">
                                        <ImageIcon className="w-3.5 h-3.5" />
                                        ถ้าไม่ใส่รูป จะแสดงสีตามวิชาแทน
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2.5 border border-border text-text-secondary rounded-xl hover:bg-surface-dark transition-colors text-sm"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-text-primary font-medium rounded-xl transition-all text-sm"
                            >
                                {editingCourse ? 'บันทึก' : 'เพิ่มคอร์ส'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
