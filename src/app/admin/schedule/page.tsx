'use client';

import { useState } from 'react';
import { useSiteData } from '@/components/SiteDataProvider';
import { ScheduleEntry } from '@/types';
import { Plus, Trash2, Edit2, Save, X, Calendar, Clock, User, DoorOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSchedulePage() {
    const { data, updateSchedule } = useSiteData();
    const [schedule, setSchedule] = useState<ScheduleEntry[]>(data.schedule);
    const [showModal, setShowModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);
    const [form, setForm] = useState<Partial<ScheduleEntry>>({
        courseTitle: '', day: 'จันทร์', time: '', tutorName: '', room: ''
    });

    const openAdd = () => {
        setEditingEntry(null);
        setForm({ courseTitle: '', day: 'จันทร์', time: '', tutorName: '', room: '' });
        setShowModal(true);
    };

    const openEdit = (entry: ScheduleEntry) => {
        setEditingEntry(entry);
        setForm(entry);
        setShowModal(true);
    };

    const handleSave = () => {
        if (!form.courseTitle || !form.time) return;

        let updated: ScheduleEntry[];
        if (editingEntry) {
            updated = schedule.map(s => s.id === editingEntry.id ? { ...s, ...form } as ScheduleEntry : s);
        } else {
            const newEntry: ScheduleEntry = {
                id: Date.now().toString(),
                ...form
            } as ScheduleEntry;
            updated = [...schedule, newEntry];
        }

        setSchedule(updated);
        updateSchedule(updated);
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('ยืนยันการลบข้อมูลตารางเรียน?')) {
            const updated = schedule.filter(s => s.id !== id);
            setSchedule(updated);
            updateSchedule(updated);
        }
    };

    const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-400/20 rounded-2xl flex items-center justify-center text-blue-600">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">จัดการตารางเรียน</h1>
                        <p className="text-text-secondary text-sm">จัดการวันและเวลาเรียนของแต่ละคอร์ส</p>
                    </div>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-primary font-bold rounded-xl transition-all shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    เพิ่มตารางเรียน
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface border-b border-border">
                                <th className="text-left px-8 py-5 font-bold text-sm text-text-secondary uppercase tracking-wider">วันเรียน</th>
                                <th className="text-left px-8 py-5 font-bold text-sm text-text-secondary uppercase tracking-wider">คอร์ส</th>
                                <th className="text-left px-8 py-5 font-bold text-sm text-text-secondary uppercase tracking-wider">เวลา</th>
                                <th className="text-left px-8 py-5 font-bold text-sm text-text-secondary uppercase tracking-wider">ผู้สอน / ห้อง</th>
                                <th className="text-right px-8 py-5 font-bold text-sm text-text-secondary uppercase tracking-wider">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {schedule.map((row) => (
                                <tr key={row.id} className="hover:bg-surface/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary-dark font-bold text-xs rounded-full">
                                            {row.day}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-text-primary">{row.courseTitle}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                            <Clock className="w-4 h-4 text-text-muted" />
                                            {row.time}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                <User className="w-4 h-4 text-text-muted" />
                                                {row.tutorName}
                                            </div>
                                            {row.room && (
                                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                                    <DoorOpen className="w-4 h-4" />
                                                    {row.room}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(row)} className="p-2 hover:bg-surface-dark rounded-xl text-text-muted">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(row.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                                        {editingEntry ? 'แก้ไขตารางเรียน' : 'เพิ่มตารางเรียน'}
                                    </h2>
                                    <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Schedule Configuration</p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-red-50 hover:text-red-500 text-text-muted rounded-2xl transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            วันเรียน
                                        </label>
                                        <select
                                            value={form.day}
                                            onChange={(e) => setForm({ ...form, day: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium cursor-pointer appearance-none"
                                        >
                                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            เวลา
                                        </label>
                                        <input
                                            type="text"
                                            value={form.time}
                                            onChange={(e) => setForm({ ...form, time: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium font-mono"
                                            placeholder="18:00 - 20:00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        ชื่อคอร์สเรียน
                                    </label>
                                    <input
                                        type="text"
                                        value={form.courseTitle}
                                        onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                        placeholder="ระบุชื่อคอร์ส"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            อาจารย์ผู้สอน
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
                                            ห้องเรียน / รูปแบบ
                                        </label>
                                        <input
                                            type="text"
                                            value={form.room}
                                            onChange={(e) => setForm({ ...form, room: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            placeholder="ห้องเรียน หรือ Online"
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
                                    {editingEntry ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูล'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
