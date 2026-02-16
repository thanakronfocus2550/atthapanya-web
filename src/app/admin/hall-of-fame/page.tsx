'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Trophy, ImageIcon } from 'lucide-react';
import { hallOfFame as initialData } from '@/lib/data';
import type { HallOfFameEntry } from '@/types';

export default function AdminHallOfFamePage() {
    const [entries, setEntries] = useState(initialData);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<HallOfFameEntry | null>(null);
    const [form, setForm] = useState({
        name: '', score: '', maxScore: '100', subject: 'คณิตศาสตร์',
        exam: 'A-Level', year: '2568', image: '', university: '',
    });

    const openAdd = () => {
        setEditing(null);
        setForm({ name: '', score: '', maxScore: '100', subject: 'คณิตศาสตร์', exam: 'A-Level', year: '2568', image: '', university: '' });
        setShowModal(true);
    };

    const openEdit = (e: HallOfFameEntry) => {
        setEditing(e);
        setForm({
            name: e.name, score: e.score.toString(), maxScore: e.maxScore.toString(),
            subject: e.subject, exam: e.exam, year: e.year,
            image: e.image || '', university: e.university || '',
        });
        setShowModal(true);
    };

    const handleSave = () => {
        const data: HallOfFameEntry = {
            id: editing?.id || Date.now().toString(),
            name: form.name,
            score: Number(form.score),
            maxScore: Number(form.maxScore),
            subject: form.subject,
            exam: form.exam,
            year: form.year,
            image: form.image || undefined,
            university: form.university || undefined,
        };
        if (editing) {
            setEntries(entries.map(e => e.id === editing.id ? data : e));
        } else {
            setEntries([...entries, data]);
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('ต้องการลบผลงานนี้หรือไม่?')) {
            setEntries(entries.filter(e => e.id !== id));
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-text-primary">ผลงานนักเรียนรุ่นพี่</h1>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-primary font-medium text-sm rounded-xl transition-all"
                >
                    <Plus className="w-4 h-4" />
                    เพิ่มผลงาน
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface border-b border-border">
                                <th className="text-left px-5 py-3 font-medium text-text-secondary">นักเรียน</th>
                                <th className="text-center px-5 py-3 font-medium text-text-secondary">คะแนน</th>
                                <th className="text-left px-5 py-3 font-medium text-text-secondary hidden md:table-cell">วิชา</th>
                                <th className="text-left px-5 py-3 font-medium text-text-secondary hidden sm:table-cell">สอบ</th>
                                <th className="text-center px-5 py-3 font-medium text-text-secondary hidden lg:table-cell">ปี</th>
                                <th className="text-center px-5 py-3 font-medium text-text-secondary">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {entries.map((entry) => {
                                const avatarUrl = entry.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}&size=80&background=FACC15&color=fff&bold=true`;
                                return (
                                    <tr key={entry.id} className="hover:bg-surface/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={avatarUrl} alt={entry.name}
                                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-border shrink-0" />
                                                <div>
                                                    <p className="font-medium text-text-primary">{entry.name}</p>
                                                    {entry.university && (
                                                        <p className="text-xs text-text-muted">{entry.university}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="text-lg font-bold text-gold">{entry.score}</span>
                                            <span className="text-xs text-text-muted">/{entry.maxScore}</span>
                                        </td>
                                        <td className="px-5 py-4 text-text-secondary hidden md:table-cell">{entry.subject}</td>
                                        <td className="px-5 py-4 hidden sm:table-cell">
                                            <span className="px-2.5 py-1 bg-primary/10 text-primary-dark text-xs rounded-full">{entry.exam}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center text-text-secondary hidden lg:table-cell">{entry.year}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => openEdit(entry)}
                                                    className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="แก้ไข">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(entry.id)}
                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-danger transition-colors" title="ลบ">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-text-primary">
                                {editing ? 'แก้ไขผลงาน' : 'เพิ่มผลงานใหม่'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Image */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">รูปนักเรียน (URL)</label>
                                <input type="url" value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                    placeholder="https://example.com/student-photo.jpg"
                                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                {form.image && (
                                    <div className="mt-2 flex justify-center">
                                        <img src={form.image} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-border"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                    </div>
                                )}
                                {!form.image && (
                                    <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                                        <ImageIcon className="w-3.5 h-3.5" />
                                        ถ้าไม่ใส่รูป จะสร้างจากชื่อแทน
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">ชื่อ-นามสกุล</label>
                                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">มหาวิทยาลัย (ถ้ามี)</label>
                                    <input type="text" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })}
                                        placeholder="จุฬาลงกรณ์มหาวิทยาลัย"
                                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">คะแนนที่ได้</label>
                                    <input type="number" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">คะแนนเต็ม</label>
                                    <input type="number" value={form.maxScore} onChange={(e) => setForm({ ...form, maxScore: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">วิชา</label>
                                    <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                                        <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                                        <option value="ฟิสิกส์">ฟิสิกส์</option>
                                        <option value="เคมี">เคมี</option>
                                        <option value="ชีววิทยา">ชีววิทยา</option>
                                        <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                                        <option value="ภาษาไทย">ภาษาไทย</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">การสอบ</label>
                                    <select value={form.exam} onChange={(e) => setForm({ ...form, exam: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                                        <option value="A-Level">A-Level</option>
                                        <option value="TGAT">TGAT</option>
                                        <option value="GAT">GAT</option>
                                        <option value="PAT">PAT</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">ปี</label>
                                    <input type="text" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)}
                                className="flex-1 py-2.5 border border-border text-text-secondary rounded-xl hover:bg-surface-dark transition-colors text-sm">
                                ยกเลิก
                            </button>
                            <button onClick={handleSave}
                                className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-text-primary font-medium rounded-xl transition-all text-sm">
                                {editing ? 'บันทึก' : 'เพิ่มผลงาน'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
