'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Pencil, Trash2, X, GripVertical, ChevronDown, ChevronUp,
    BookOpen, ImageIcon, Download, FileText, Video, Clock, Link as LinkIcon
} from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { useSiteData } from '@/components/SiteDataProvider';
import type { Course, Lesson } from '@/types';
import React from 'react';
import { lessons as allLessons } from '@/lib/data';

export default function AdminCoursesPage() {
    const { data, updateCourses, updateLessons } = useSiteData();
    const courseList = data.courses;
    const lessonList = data.lessons;

    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: '', description: '', price: '', tutorName: '', category: 'A-Level', subject: 'คณิตศาสตร์', thumbnail: '',
    });

    // Lesson Management State
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [lessonForm, setLessonForm] = useState({
        title: '', videoUrl: '', duration: '', description: '', resourceUrl: ''
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
            updateCourses(
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
            updateCourses([...courseList, newCourse]);
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('ต้องการลบคอร์สนี้หรือไม่?')) {
            updateCourses(courseList.filter((c) => c.id !== id));
        }
    };

    const courseLessons = (courseId: string) =>
        lessonList.filter((l) => l.courseId === courseId).sort((a, b) => a.orderIndex - b.orderIndex);

    const openAddLesson = (courseId: string) => {
        setExpandedCourse(courseId);
        setEditingLesson(null);
        setLessonForm({ title: '', videoUrl: '', duration: '', description: '', resourceUrl: '' });
        setShowLessonModal(true);
    };

    const openEditLesson = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setLessonForm({
            title: lesson.title,
            videoUrl: lesson.videoUrl,
            duration: lesson.duration.toString(),
            description: lesson.description || '',
            resourceUrl: lesson.resourceUrl || '',
        });
        setShowLessonModal(true);
    };

    const handleSaveLesson = () => {
        if (!expandedCourse) return;

        if (editingLesson) {
            updateLessons(
                lessonList.map((l) =>
                    l.id === editingLesson.id
                        ? {
                            ...l,
                            title: lessonForm.title,
                            videoUrl: lessonForm.videoUrl,
                            duration: Number(lessonForm.duration),
                            description: lessonForm.description,
                            resourceUrl: lessonForm.resourceUrl,
                        }
                        : l
                )
            );
        } else {
            const newLesson: Lesson = {
                id: Date.now().toString(),
                courseId: expandedCourse,
                title: lessonForm.title,
                videoUrl: lessonForm.videoUrl,
                duration: Number(lessonForm.duration),
                orderIndex: courseLessons(expandedCourse).length + 1,
                description: lessonForm.description,
                resourceUrl: lessonForm.resourceUrl,
            };
            updateLessons([...lessonList, newLesson]);
        }
        setShowLessonModal(false);
    };

    const handleDeleteLesson = (id: string) => {
        if (confirm('ต้องการลบบทเรียนนี้หรือไม่?')) {
            updateLessons(lessonList.filter((l) => l.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-text-primary mb-2">จัดการคอร์สเรียน</h1>
                    <p className="text-text-secondary text-sm">สร้าง แก้ไข และจัดการเนื้อหาบทเรียนทั้งหมด</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-text-primary font-black text-sm rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    เพิ่มคอร์สใหม่
                </button>
            </div>

            {/* Course Table */}
            <div className="bg-white rounded-[32px] border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface-dark border-b border-border">
                                <th className="text-left px-6 py-5 font-bold text-text-muted uppercase tracking-wider text-[10px]">คอร์ส</th>
                                <th className="text-left px-6 py-5 font-bold text-text-muted uppercase tracking-wider text-[10px] hidden md:table-cell">หมวดหมู่</th>
                                <th className="text-left px-6 py-5 font-bold text-text-muted uppercase tracking-wider text-[10px] hidden sm:table-cell">ผู้สอน</th>
                                <th className="text-right px-6 py-5 font-bold text-text-muted uppercase tracking-wider text-[10px]">ราคา</th>
                                <th className="text-center px-6 py-5 font-bold text-text-muted uppercase tracking-wider text-[10px] hidden lg:table-cell">ผู้เรียน</th>
                                <th className="text-center px-6 py-5 font-bold text-text-muted uppercase tracking-wider text-[10px]">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {courseList.map((course) => (
                                <React.Fragment key={course.id}>
                                    <tr className="hover:bg-surface-dark/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                {course.thumbnail ? (
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0 border border-border group-hover:scale-105 transition-transform">
                                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
                                                        <BookOpen className="w-6 h-6 text-primary-dark/40" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-black text-text-primary leading-tight">{course.title}</p>
                                                    <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-text-muted uppercase">
                                                        <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {course.totalLessons} บท</span>
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.totalHours} ชม.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 hidden md:table-cell">
                                            <span className="px-2.5 py-1 bg-surface-dark border border-border text-text-secondary text-[10px] font-black rounded-lg uppercase">
                                                {course.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-text-secondary font-bold text-xs hidden sm:table-cell">{course.tutorName}</td>
                                        <td className="px-6 py-5 text-right font-black text-primary-dark">{formatPrice(course.price)}</td>
                                        <td className="px-6 py-5 text-center text-text-muted font-bold hidden lg:table-cell">{course.enrolledCount.toLocaleString()}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        setExpandedCourse(expandedCourse === course.id ? null : course.id)
                                                    }
                                                    className={cn(
                                                        "p-2 rounded-xl transition-all",
                                                        expandedCourse === course.id ? "bg-primary text-text-primary shadow-md shadow-primary/20" : "hover:bg-surface-dark text-text-muted"
                                                    )}
                                                    title="บทเรียน"
                                                >
                                                    {expandedCourse === course.id ? (
                                                        <ChevronUp className="w-4.5 h-4.5" />
                                                    ) : (
                                                        <ChevronDown className="w-4.5 h-4.5" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => openEdit(course)}
                                                    className="p-2 rounded-xl hover:bg-surface-dark text-text-secondary hover:text-primary transition-all"
                                                    title="แก้ไข"
                                                >
                                                    <Pencil className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    className="p-2 rounded-xl hover:bg-danger/10 text-text-muted hover:text-danger transition-all"
                                                    title="ลบ"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Expanded lessons */}
                                    <AnimatePresence>
                                        {expandedCourse === course.id && (
                                            <tr key={`${course.id}-lessons`}>
                                                <td colSpan={6} className="bg-surface-dark px-10 py-10 border-b border-border">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="space-y-6"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="text-sm font-black text-text-primary">บทเรียนในคอร์ส ({courseLessons(course.id).length})</h4>
                                                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Lesson Management & Ordering</p>
                                                            </div>
                                                            <button
                                                                onClick={() => openAddLesson(course.id)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-text-primary hover:text-primary-dark hover:border-primary rounded-xl text-xs font-black transition-all shadow-sm active:scale-95"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                เพิ่มบทเรียนใหม่
                                                            </button>
                                                        </div>

                                                        <div className="space-y-3">
                                                            {courseLessons(course.id).map((lesson, idx) => (
                                                                <motion.div
                                                                    key={lesson.id}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: idx * 0.05 }}
                                                                    className="group flex items-center gap-4 bg-white p-4 rounded-[20px] border border-border hover:shadow-md hover:border-primary/20 transition-all"
                                                                >
                                                                    <div className="p-2 hover:bg-surface-dark rounded-lg cursor-grab active:cursor-grabbing transition-colors">
                                                                        <GripVertical className="w-4 h-4 text-text-muted group-hover:text-primary-dark" />
                                                                    </div>
                                                                    <div className="w-9 h-9 bg-surface-dark rounded-xl flex items-center justify-center text-xs font-black text-text-primary shrink-0 border border-border">
                                                                        {lesson.orderIndex}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-bold text-text-primary truncate">{lesson.title}</p>
                                                                        <div className="flex items-center gap-3 mt-1.5">
                                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-text-muted bg-surface-dark px-2.5 py-1 rounded-lg">
                                                                                <Video className="w-3 h-3" /> {lesson.videoUrl.slice(0, 30)}...
                                                                            </span>
                                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-text-muted bg-surface-dark px-2.5 py-1 rounded-lg">
                                                                                <Clock className="w-3 h-3" /> {lesson.duration} นาที
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                                        <button
                                                                            onClick={() => openEditLesson(lesson)}
                                                                            className="p-2 hover:bg-surface-dark rounded-xl text-text-muted hover:text-primary transition-colors"
                                                                        >
                                                                            <Pencil className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteLesson(lesson.id)}
                                                                            className="p-2 hover:bg-danger/10 rounded-xl text-text-muted hover:text-danger transition-colors"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                            {courseLessons(course.id).length === 0 && (
                                                                <div className="text-center py-10 border-2 border-dashed border-border rounded-[32px] bg-white/50">
                                                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                                                        <BookOpen className="w-6 h-6 text-text-muted/30" />
                                                                    </div>
                                                                    <p className="text-sm font-bold text-text-primary">ยังไม่มีบทเรียนในคอร์สนี้</p>
                                                                    <p className="text-xs text-text-muted mt-1 mb-6">เริ่มสร้างเนื้อหาที่น่าสนใจให้กับนักเรียนของคุณ</p>
                                                                    <button
                                                                        onClick={() => openAddLesson(course.id)}
                                                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-text-primary text-white text-xs font-black rounded-xl hover:bg-primary-dark hover:text-text-primary transition-all shadow-lg active:scale-95"
                                                                    >
                                                                        <Plus className="w-4 h-4" />
                                                                        เริ่มเพิ่มบทเรียนแรก
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Course Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-md"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] w-full max-w-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden border border-border my-8"
                        >
                            <div className="p-8 border-b border-border/50 flex items-center justify-between bg-gradient-to-br from-white to-surface">
                                <div>
                                    <h2 className="text-2xl font-black text-text-primary mb-1">
                                        {editingCourse ? 'แก้ไขรายละเอียดคอร์ส' : 'สร้างคอร์สใหม่'}
                                    </h2>
                                    <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Course Configuration</p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-red-50 hover:text-red-500 text-text-muted rounded-2xl transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            ชื่อคอร์สเรียน
                                        </label>
                                        <input
                                            type="text"
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            placeholder="ระบุชื่อคอร์สที่ต้องการแสดง"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            รายละเอียดคอร์ส
                                        </label>
                                        <textarea
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none font-medium leading-relaxed"
                                            placeholder="คำอธิบายคอร์สสั้นๆ..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            ราคา (บาท)
                                        </label>
                                        <input
                                            type="number"
                                            value={form.price}
                                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            ผู้สอน
                                        </label>
                                        <input
                                            type="text"
                                            value={form.tutorName}
                                            onChange={(e) => setForm({ ...form, tutorName: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            หมวดหมู่
                                        </label>
                                        <select
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium cursor-pointer appearance-none"
                                        >
                                            <option value="A-Level">A-Level</option>
                                            <option value="TGAT">TGAT</option>
                                            <option value="ม.ต้น">ม.ต้น</option>
                                            <option value="ม.ปลาย">ม.ปลาย</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            วิชา
                                        </label>
                                        <select
                                            value={form.subject}
                                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium cursor-pointer appearance-none"
                                        >
                                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                                            <option value="ฟิสิกส์">ฟิสิกส์</option>
                                            <option value="เคมี">เคมี</option>
                                            <option value="ชีววิทยา">ชีววิทยา</option>
                                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                                            <option value="ภาษาไทย">ภาษาไทย</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            รูปปกคอร์ส (URL)
                                        </label>
                                        <div className="flex gap-4 items-start">
                                            <div className="flex-1">
                                                <input
                                                    type="url"
                                                    value={form.thumbnail}
                                                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                                                    placeholder="https://images.unsplash.com/..."
                                                    className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                />
                                            </div>
                                            {form.thumbnail ? (
                                                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border shrink-0">
                                                    <img src={form.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-20 h-20 rounded-2xl bg-surface border border-dashed border-border flex items-center justify-center text-text-muted shrink-0">
                                                    <ImageIcon className="w-8 h-8 opacity-20" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-surface flex flex-col sm:flex-row gap-3 border-t border-border/50">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 font-bold text-text-secondary hover:bg-white rounded-2xl transition-all border border-transparent hover:border-border active:scale-95"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 py-4 bg-primary hover:bg-primary-dark text-text-primary font-black rounded-2xl transition-all shadow-lg shadow-primary/25 active:scale-95"
                                >
                                    {editingCourse ? 'อัปเดตข้อมูลคอร์ส' : 'สร้างคอร์สใหม่'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Lesson Modal */}
            <AnimatePresence>
                {showLessonModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-md"
                            onClick={() => setShowLessonModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] w-full max-w-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden border border-border"
                        >
                            <div className="p-8 border-b border-border/50 flex items-center justify-between bg-gradient-to-br from-white to-surface">
                                <div>
                                    <h2 className="text-2xl font-black text-text-primary mb-1">
                                        {editingLesson ? 'แก้ไขบทเรียน' : 'เพิ่มบทเรียนใหม่'}
                                    </h2>
                                    <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Lesson Configuration</p>
                                </div>
                                <button
                                    onClick={() => setShowLessonModal(false)}
                                    className="p-2 hover:bg-red-50 hover:text-red-500 text-text-muted rounded-2xl transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        หัวข้อบทเรียน
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={lessonForm.title}
                                            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                            className="w-full pl-12 pr-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            placeholder="ระบุหัวข้อคลิปวิดีโอ"
                                        />
                                        <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            วิดีโอ URL (Vimeo/YouTube)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={lessonForm.videoUrl}
                                                onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                                                className="w-full pl-12 pr-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium font-mono text-xs"
                                                placeholder="https://..."
                                            />
                                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            ความยาว (นาที)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={lessonForm.duration}
                                                onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                                                className="w-full pl-12 pr-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            />
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        ลิ้งก์เอกสารประกอบ (URL)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={lessonForm.resourceUrl}
                                            onChange={(e) => setLessonForm({ ...lessonForm, resourceUrl: e.target.value })}
                                            className="w-full pl-12 pr-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium font-mono text-xs"
                                            placeholder="https://drive.google.com/..."
                                        />
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-surface flex flex-col sm:flex-row gap-3 border-t border-border/50">
                                <button
                                    onClick={() => setShowLessonModal(false)}
                                    className="flex-1 py-4 font-bold text-text-secondary hover:bg-white rounded-2xl transition-all border border-transparent hover:border-border active:scale-95"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleSaveLesson}
                                    className="flex-1 py-4 bg-primary hover:bg-primary-dark text-text-primary font-black rounded-2xl transition-all shadow-lg shadow-primary/25 active:scale-95"
                                >
                                    บันทึกบทเรียน
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
