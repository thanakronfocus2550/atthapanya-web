'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Star, ImageIcon } from 'lucide-react';
import { tutors as initialTutors, type Tutor } from '@/lib/data';

export default function AdminTutorsPage() {
    const [tutorList, setTutorList] = useState(initialTutors);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Tutor | null>(null);
    const [form, setForm] = useState({
        name: '', title: '', bio: '', image: '', expertise: '',
        experienceYears: '', studentsCount: '', rating: '',
    });

    const openAdd = () => {
        setEditing(null);
        setForm({ name: '', title: '', bio: '', image: '', expertise: '', experienceYears: '', studentsCount: '', rating: '' });
        setShowModal(true);
    };

    const openEdit = (t: Tutor) => {
        setEditing(t);
        setForm({
            name: t.name, title: t.title, bio: t.bio,
            image: t.image || '',
            expertise: t.expertise.join(', '),
            experienceYears: t.experienceYears.toString(),
            studentsCount: t.studentsCount.toString(),
            rating: t.rating.toString(),
        });
        setShowModal(true);
    };

    const handleSave = () => {
        const data: Tutor = {
            id: editing?.id || Date.now().toString(),
            name: form.name,
            title: form.title,
            bio: form.bio,
            image: form.image || undefined,
            expertise: form.expertise.split(',').map(s => s.trim()).filter(Boolean),
            experienceYears: Number(form.experienceYears) || 0,
            studentsCount: Number(form.studentsCount) || 0,
            rating: Number(form.rating) || 0,
        };
        if (editing) {
            setTutorList(tutorList.map(t => t.id === editing.id ? data : t));
        } else {
            setTutorList([...tutorList, data]);
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('ต้องการลบอาจารย์ท่านนี้หรือไม่?')) {
            setTutorList(tutorList.filter(t => t.id !== id));
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-text-primary">จัดการอาจารย์ผู้สอน</h1>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-primary font-medium text-sm rounded-xl transition-all"
                >
                    <Plus className="w-4 h-4" />
                    เพิ่มอาจารย์
                </button>
            </div>

            {/* Tutor Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {tutorList.map((tutor) => {
                    const avatarUrl = tutor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name.replace('อ.', ''))}&size=200&background=FACC15&color=fff&bold=true`;
                    return (
                        <div key={tutor.id} className="bg-white rounded-2xl border border-border p-5 hover:shadow-card-hover transition-all">
                            <div className="flex items-start gap-4 mb-4">
                                <img
                                    src={avatarUrl}
                                    alt={tutor.name}
                                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-border"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-text-primary truncate">{tutor.name}</h3>
                                    <p className="text-sm text-primary-dark">{tutor.title}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-3.5 h-3.5 text-primary-dark fill-primary-dark" />
                                        <span className="text-sm font-medium">{tutor.rating}</span>
                                        <span className="text-xs text-text-muted ml-1">• {tutor.experienceYears} ปี</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-text-secondary line-clamp-2 mb-3">{tutor.bio}</p>
                            <div className="flex flex-wrap gap-1 mb-4">
                                {tutor.expertise.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-surface text-text-muted text-xs rounded-full">{tag}</span>
                                ))}
                            </div>
                            <div className="flex gap-2 pt-3 border-t border-border">
                                <button
                                    onClick={() => openEdit(tutor)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                    แก้ไข
                                </button>
                                <button
                                    onClick={() => handleDelete(tutor.id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-danger hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    ลบ
                                </button>
                            </div>
                        </div>
                    );
                })}
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
                                {editing ? 'แก้ไขอาจารย์' : 'เพิ่มอาจารย์ใหม่'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">รูปภาพอาจารย์ (URL)</label>
                                <input
                                    type="url"
                                    value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                    placeholder="https://example.com/tutor-photo.jpg"
                                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                                {form.image && (
                                    <div className="mt-2 flex justify-center">
                                        <img src={form.image} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-border"
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
                                    <label className="block text-sm font-medium text-text-primary mb-1">ชื่อ</label>
                                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">ตำแหน่ง</label>
                                    <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">ประวัติย่อ</label>
                                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
                                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">ความเชี่ยวชาญ (คั่นด้วย ,)</label>
                                <input type="text" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                                    placeholder="แคลคูลัส, พีชคณิต, สถิติ"
                                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">ปีประสบการณ์</label>
                                    <input type="number" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">จำนวนนักเรียน</label>
                                    <input type="number" value={form.studentsCount} onChange={(e) => setForm({ ...form, studentsCount: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">คะแนน</label>
                                    <input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}
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
                                {editing ? 'บันทึก' : 'เพิ่มอาจารย์'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
