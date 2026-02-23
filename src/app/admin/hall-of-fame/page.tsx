'use client';

import { useState } from 'react';
import { useSiteData } from '@/components/SiteDataProvider';
import { HallOfFameEntry } from '@/types';
import { Plus, Trash2, Edit2, Save, X, Trophy, GraduationCap, School } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

export default function AdminHallOfFamePage() {
    const { data, updateHallOfFame } = useSiteData();
    const [entries, setEntries] = useState<HallOfFameEntry[]>(data.hallOfFame || []);
    const [showModal, setShowModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<HallOfFameEntry | null>(null);
    const [form, setForm] = useState<Partial<HallOfFameEntry>>({
        name: '', score: 0, maxScore: 100, subject: '', exam: '', year: '2568', university: ''
    });

    const openAdd = () => {
        setEditingEntry(null);
        setForm({ name: '', score: 0, maxScore: 100, subject: '', exam: '', year: '2568', university: '' });
        setShowModal(true);
    };

    const openEdit = (entry: HallOfFameEntry) => {
        setEditingEntry(entry);
        setForm(entry);
        setShowModal(true);
    };

    const handleSave = () => {
        if (!form.name || !form.subject) return;

        let updated: HallOfFameEntry[];
        if (editingEntry) {
            updated = entries.map(e => e.id === editingEntry.id ? { ...e, ...form } as HallOfFameEntry : e);
        } else {
            const newEntry: HallOfFameEntry = {
                id: Date.now().toString(),
                ...form
            } as HallOfFameEntry;
            updated = [...entries, newEntry];
        }

        setEntries(updated);
        updateHallOfFame(updated);
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('ยืนยันการลบผลงานนักเรียน?')) {
            const updated = entries.filter(e => e.id !== id);
            setEntries(updated);
            updateHallOfFame(updated);
        }
    };

    return (
        <PageTransition>
            <div className="space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-yellow-600 shadow-inner">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-text-primary mb-1">จัดการผลงานนักเรียน</h1>
                            <p className="text-text-secondary text-sm font-medium">เพิ่มรายชื่อนักเรียนที่สอบติดหรือทำคะแนนสูงสุดเพื่อสร้างแรงบันดาลใจ</p>
                        </div>
                    </div>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-text-primary font-black text-sm rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        เพิ่มผลงานใหม่
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {entries.map((entry, i) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-[32px] border border-border overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                        >
                            <div className="p-8 pb-4">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-surface-dark rounded-2xl flex items-center justify-center font-black text-xl text-text-muted border border-border group-hover:bg-white transition-colors duration-500">
                                        {entry.name.charAt(0)}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                        <button
                                            onClick={() => openEdit(entry)}
                                            className="p-3 bg-surface-dark hover:bg-primary hover:text-text-primary rounded-2xl text-text-secondary transition-all active:scale-90"
                                        >
                                            <Edit2 className="w-4.5 h-4.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(entry.id)}
                                            className="p-3 bg-danger/5 hover:bg-danger hover:text-white rounded-2xl text-danger transition-all active:scale-90"
                                        >
                                            <Trash2 className="w-4.5 h-4.5" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-text-primary mb-4 group-hover:text-primary-dark transition-colors">{entry.name}</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
                                        <div className="w-8 h-8 bg-surface-dark rounded-xl flex items-center justify-center shrink-0">
                                            <GraduationCap className="w-4 h-4 text-primary" />
                                        </div>
                                        <span>{entry.subject} <span className="text-text-muted text-xs">({entry.exam})</span></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-black text-success">
                                        <div className="w-8 h-8 bg-success/10 rounded-xl flex items-center justify-center shrink-0">
                                            <Trophy className="w-4 h-4" />
                                        </div>
                                        <span className="text-base">{entry.score} / {entry.maxScore} คะแนน</span>
                                    </div>
                                    {entry.university && (
                                        <div className="flex items-center gap-3 text-sm font-medium text-text-muted">
                                            <div className="w-8 h-8 bg-surface-dark rounded-xl flex items-center justify-center shrink-0">
                                                <School className="w-4 h-4" />
                                            </div>
                                            <span className="line-clamp-1">{entry.university}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="px-8 py-4 bg-surface-dark text-[10px] font-black text-text-muted border-t border-border mt-auto uppercase tracking-widest flex justify-between items-center group-hover:bg-primary/5 transition-colors">
                                <span>ปีการศึกษา {entry.year}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Modal */}
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
                                className="relative bg-white rounded-[2.5rem] w-full max-w-lg shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden border border-border"
                            >
                                <div className="p-8 border-b border-border/50 flex items-center justify-between bg-gradient-to-br from-white to-surface">
                                    <div>
                                        <h2 className="text-2xl font-black text-text-primary mb-1">
                                            {editingEntry ? 'แก้ไขผลงาน' : 'เพิ่มผลงานใหม่'}
                                        </h2>
                                        <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Hall of Fame Entry</p>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 hover:bg-red-50 hover:text-red-500 text-text-muted rounded-2xl transition-all"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            ชื่อ-นามสกุล นักเรียน
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            placeholder="ระบุชื่อจริง-นามสกุล"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                วิชา
                                            </label>
                                            <input
                                                type="text"
                                                value={form.subject}
                                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                                className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                placeholder="คณิตศาสตร์"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                สนามสอบ
                                            </label>
                                            <input
                                                type="text"
                                                value={form.exam}
                                                onChange={(e) => setForm({ ...form, exam: e.target.value })}
                                                className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                placeholder="A-Level"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                คะแนนที่ได้
                                            </label>
                                            <input
                                                type="number"
                                                value={form.score}
                                                onChange={(e) => setForm({ ...form, score: Number(e.target.value) })}
                                                className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                คะแนนเต็ม
                                            </label>
                                            <input
                                                type="number"
                                                value={form.maxScore}
                                                onChange={(e) => setForm({ ...form, maxScore: Number(e.target.value) })}
                                                className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                มหาวิทยาลัย / คณะ
                                            </label>
                                            <input
                                                type="text"
                                                value={form.university}
                                                onChange={(e) => setForm({ ...form, university: e.target.value })}
                                                className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                placeholder="Optional"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                ปีการศึกษา (พ.ศ.)
                                            </label>
                                            <input
                                                type="text"
                                                value={form.year}
                                                onChange={(e) => setForm({ ...form, year: e.target.value })}
                                                className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            />
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
                                        {editingEntry ? 'อัปเดตข้อมูล' : 'เพิ่มผลงาน'}
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
