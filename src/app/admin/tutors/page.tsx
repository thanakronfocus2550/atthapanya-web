'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Filter, UserCheck,
    MoreVertical, Edit2, Trash2, Mail,
    Phone, Globe, Award, BookOpen, X,
    Upload, Facebook, Instagram, Twitter
} from 'lucide-react';
import { useSiteData } from '@/components/SiteDataProvider';
import { Tutor } from '@/types';
import PageTransition from '@/components/PageTransition';

export default function AdminTutorsPage() {
    const { data, updateTutors } = useSiteData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
    const [form, setForm] = useState<Omit<Tutor, 'id'>>({
        name: '',
        bio: '',
        expertise: [],
        education: [],
        avatar: '',
        links: { facebook: '', instagram: '', line: '' }
    });

    const tutors = data.tutors || [];

    const handleEdit = (tutor: Tutor) => {
        setEditingTutor(tutor);
        setForm({
            name: tutor.name,
            bio: tutor.bio,
            expertise: tutor.expertise,
            education: tutor.education || [],
            avatar: tutor.avatar || '',
            links: tutor.links || { facebook: '', instagram: '', line: '' }
        });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (editingTutor) {
            updateTutors(tutors.map(t => t.id === editingTutor.id ? { ...form, id: t.id } : t));
        } else {
            const newTutor: Tutor = {
                ...form,
                id: Math.random().toString(36).substr(2, 9)
            };
            updateTutors([...tutors, newTutor]);
        }
        setIsModalOpen(false);
        setEditingTutor(null);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลอาจารย์ท่านนี้?')) {
            updateTutors(tutors.filter(t => t.id !== id));
        }
    };

    const resetForm = () => {
        setForm({
            name: '', bio: '', expertise: [], education: [], avatar: '',
            links: { facebook: '', instagram: '', line: '' }
        });
    };

    return (
        <PageTransition>
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-text-primary mb-2">จัดการอาจารย์ผู้สอน</h1>
                        <p className="text-text-secondary text-sm font-medium">จัดการโปรไฟล์และประวัติการทำงานของอาจารย์ในสถาบัน</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-text-primary font-black text-sm rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        เพิ่มอาจารย์ใหม่
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tutors.map((tutor, i) => (
                        <motion.div
                            key={tutor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[32px] border border-border overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                        >
                            <div className="h-28 bg-surface-dark group-hover:bg-primary/10 transition-colors duration-500" />
                            <div className="px-8 pb-8 -mt-14 flex-1 flex flex-col">
                                <div className="relative mb-6">
                                    <div className="w-28 h-28 rounded-3xl bg-white p-1.5 border border-border shadow-sm group-hover:scale-105 transition-transform duration-500">
                                        <div className="w-full h-full rounded-2xl bg-surface-dark overflow-hidden flex items-center justify-center border border-border">
                                            {tutor.avatar ? (
                                                <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <UserCheck className="w-12 h-12 text-text-muted/40" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute top-16 right-0 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(tutor)}
                                            className="p-3 bg-white border border-border rounded-2xl text-text-secondary hover:text-primary-dark hover:border-primary/40 shadow-sm hover:shadow-md transition-all active:scale-90"
                                        >
                                            <Edit2 className="w-4.5 h-4.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tutor.id)}
                                            className="p-3 bg-white border border-border rounded-2xl text-text-secondary hover:text-danger hover:border-danger/40 shadow-sm hover:shadow-md transition-all active:scale-90"
                                        >
                                            <Trash2 className="w-4.5 h-4.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-text-primary mb-2 group-hover:text-primary-dark transition-colors">{tutor.name}</h3>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {tutor.expertise.map(exp => (
                                            <span key={exp} className="px-3 py-1 bg-surface-dark text-text-muted text-[10px] font-black rounded-full uppercase tracking-wider group-hover:bg-primary/10 group-hover:text-primary-dark transition-colors">
                                                {exp}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-text-secondary line-clamp-3 mb-6 font-medium leading-relaxed">
                                        {tutor.bio}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-6 border-t border-border mt-auto">
                                    <div className="flex gap-2">
                                        {tutor.links?.facebook && <div className="w-8 h-8 rounded-xl bg-surface-dark flex items-center justify-center text-text-muted hover:bg-blue-50 hover:text-blue-600 transition-colors"><Facebook className="w-4 h-4" /></div>}
                                        {tutor.links?.instagram && <div className="w-8 h-8 rounded-xl bg-surface-dark flex items-center justify-center text-text-muted hover:bg-pink-50 hover:text-pink-600 transition-colors"><Instagram className="w-4 h-4" /></div>}
                                    </div>
                                    <span className="text-[10px] font-black text-text-muted ml-auto uppercase tracking-widest">
                                        ID: {tutor.id.slice(0, 8)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {tutors.length === 0 && (
                        <div className="md:col-span-2 lg:col-span-3 text-center py-32 bg-white border border-border rounded-[40px] shadow-sm">
                            <div className="w-20 h-20 bg-surface-dark rounded-[32px] flex items-center justify-center mx-auto mb-6">
                                <UserCheck className="w-10 h-10 text-text-muted/30" />
                            </div>
                            <h3 className="text-2xl font-black text-text-primary mb-2">ยังไม่มีข้อมูลอาจารย์</h3>
                            <p className="text-text-secondary text-sm mb-10 max-w-sm mx-auto">เริ่มสร้างรายชื่ออาจารย์ผู้สอนเพื่อเพิ่มความน่าเชื่อถือให้กับสถาบัน</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-primary hover:bg-primary-dark px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-95"
                            >
                                เพิ่มอาจารย์ท่านแรก
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-gray-900/60 backdrop-blur-md"
                                onClick={() => setIsModalOpen(false)}
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
                                            {editingTutor ? 'แก้ไขข้อมูลอาจารย์' : 'เพิ่มอาจารย์ใหม่'}
                                        </h2>
                                        <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Tutor Profile Configuration</p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-red-50 hover:text-red-500 text-text-muted rounded-2xl transition-all"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Avatar Upload Simulation */}
                                        <div className="md:col-span-2 flex items-center gap-6 p-6 bg-surface rounded-3xl border border-border">
                                            <div className="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-border flex items-center justify-center overflow-hidden shrink-0">
                                                {form.avatar ? (
                                                    <img src={form.avatar} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Upload className="w-8 h-8 text-text-muted opacity-20" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <label className="text-sm font-bold text-text-primary flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    รูปภาพโปรไฟล์ (URL)
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="https://..."
                                                    value={form.avatar}
                                                    onChange={e => setForm({ ...form, avatar: e.target.value })}
                                                    className="w-full px-5 py-3 bg-white border border-border rounded-xl text-xs focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                ชื่อ-นามสกุล
                                            </label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                placeholder="ชื่ออาจารย์..."
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                ความเชี่ยวชาญ (คั่นด้วยคอมม่า)
                                            </label>
                                            <input
                                                type="text"
                                                value={form.expertise.join(', ')}
                                                onChange={e => setForm({ ...form, expertise: e.target.value.split(',').map(s => s.trim()) })}
                                                className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                placeholder="ฟิสิกส์, คณิตศาสตร์, ..."
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                ประวัติย่อ
                                            </label>
                                            <textarea
                                                value={form.bio}
                                                onChange={e => setForm({ ...form, bio: e.target.value })}
                                                rows={3}
                                                className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none font-medium leading-relaxed"
                                                placeholder="ประวัติและประสบการณ์การสอน..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                Facebook
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={form.links?.facebook}
                                                    onChange={e => setForm({ ...form, links: { ...form.links!, facebook: e.target.value } })}
                                                    className="w-full pl-12 pr-5 py-3.5 bg-surface dark:bg-gray-900/50 border border-border dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                    placeholder="facebook.com/..."
                                                />
                                                <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                Instagram
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={form.links?.instagram}
                                                    onChange={e => setForm({ ...form, links: { ...form.links!, instagram: e.target.value } })}
                                                    className="w-full pl-12 pr-5 py-3.5 bg-surface dark:bg-gray-900/50 border border-border dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                    placeholder="instagram.com/..."
                                                />
                                                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-surface flex flex-col sm:flex-row gap-3 border-t border-border/50 child-button-flex-1">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 font-bold text-text-secondary hover:bg-white rounded-2xl transition-all border border-transparent hover:border-border active:scale-95"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 py-4 bg-primary hover:bg-primary-dark text-text-primary font-black rounded-2xl transition-all shadow-lg shadow-primary/25 active:scale-95"
                                    >
                                        บันทึกข้อมูลอาจารย์
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
}
