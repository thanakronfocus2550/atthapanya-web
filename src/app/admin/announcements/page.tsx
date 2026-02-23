'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Megaphone, AlertTriangle, Bell, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteData } from '@/components/SiteDataProvider';
import { Announcement } from '@/types';
import { cn } from '@/lib/utils';
import PageTransition from '@/components/PageTransition';

export default function AdminAnnouncementsPage() {
    const { data, updateAnnouncements } = useSiteData();
    const announcements = data.announcements || [];

    const [showModal, setShowModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [form, setForm] = useState<Partial<Announcement>>({
        title: '', content: '', category: 'NEW', active: true
    });

    const openAdd = () => {
        setEditingAnnouncement(null);
        setForm({ title: '', content: '', category: 'NEW', active: true });
        setShowModal(true);
    };

    const openEdit = (a: Announcement) => {
        setEditingAnnouncement(a);
        setForm(a);
        setShowModal(true);
    };

    const handleSave = () => {
        if (!form.title || !form.content) return;

        let updated: Announcement[];
        if (editingAnnouncement) {
            updated = announcements.map(a => a.id === editingAnnouncement.id ? { ...a, ...form } as Announcement : a);
        } else {
            const newAnn: Announcement = {
                id: Date.now().toString(),
                date: new Date().toLocaleDateString('th-TH'),
                ...form
            } as Announcement;
            updated = [newAnn, ...announcements];
        }

        updateAnnouncements(updated);
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('ยืนยันการลบประกาศนี้?')) {
            updateAnnouncements(announcements.filter(a => a.id !== id));
        }
    };

    const toggleActive = (a: Announcement) => {
        const updated = announcements.map(item =>
            item.id === a.id ? { ...item, active: !item.active } : item
        );
        updateAnnouncements(updated);
    };

    return (
        <PageTransition>
            <div className="space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-text-primary mb-2">จัดการข่าวสารและประกาศ</h1>
                        <p className="text-text-secondary text-sm">สื่อสารกับนักเรียนผ่านหน้าแรกและแดชบอร์ด</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-text-primary font-black text-sm rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        เพิ่มประกาศใหม่
                    </button>
                </div>

                <div className="grid gap-6">
                    {announcements.map((a, i) => (
                        <motion.div
                            key={a.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={cn(
                                "bg-white rounded-[32px] border p-10 flex flex-col md:flex-row items-start md:items-center gap-6 transition-all shadow-sm",
                                !a.active ? "opacity-60 grayscale bg-surface-dark/50" : "hover:shadow-md hover:border-primary/20"
                            )}
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                                a.category === 'URGENT' ? 'bg-danger/10 text-danger' :
                                    a.category === 'NEW' ? 'bg-success/10 text-success' :
                                        'bg-primary/10 text-primary-dark'
                            )}>
                                {a.category === 'URGENT' ? <AlertTriangle className="w-8 h-8" /> :
                                    a.category === 'NEW' ? <Bell className="w-8 h-8" /> :
                                        <Info className="w-8 h-8" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <span className={cn(
                                        "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider",
                                        a.category === 'URGENT' ? 'bg-danger/10 text-danger' :
                                            a.category === 'NEW' ? 'bg-success/10 text-success' :
                                                'bg-primary/10 text-primary-dark'
                                    )}>
                                        {a.category === 'URGENT' ? 'ด่วนพิเศษ' : a.category === 'NEW' ? 'คอร์สใหม่' : 'อัปเดต'}
                                    </span>
                                    <span className="text-xs font-bold text-text-muted uppercase tracking-tight">{a.date}</span>
                                    {!a.active && <span className="text-[10px] font-black text-text-muted bg-surface-dark px-3 py-1 rounded-xl uppercase">Hidden</span>}
                                </div>
                                <h3 className="text-xl font-black text-text-primary mb-2">{a.title}</h3>
                                <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed font-medium">{a.content}</p>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-center">
                                <button
                                    onClick={() => toggleActive(a)}
                                    title={a.active ? 'ปิดการแสดงผล' : 'เปิดการแสดงผล'}
                                    className={cn(
                                        "p-3 rounded-2xl transition-all active:scale-90",
                                        a.active ? 'bg-success/10 text-success hover:bg-success hover:text-white' : 'bg-surface-dark text-text-muted hover:bg-text-muted hover:text-white'
                                    )}
                                >
                                    <Megaphone className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => openEdit(a)}
                                    className="p-3 bg-surface-dark hover:bg-primary hover:text-text-primary rounded-2xl text-text-secondary transition-all active:scale-90"
                                >
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(a.id)}
                                    className="p-3 bg-danger/5 hover:bg-danger rounded-2xl text-danger hover:text-white transition-all active:scale-90"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {announcements.length === 0 && (
                        <div className="text-center py-32 bg-white rounded-[40px] border border-border shadow-sm">
                            <div className="w-20 h-20 bg-surface-dark rounded-[32px] flex items-center justify-center mx-auto mb-6">
                                <Megaphone className="w-10 h-10 text-text-muted/30" />
                            </div>
                            <h3 className="text-2xl font-black text-text-primary mb-2">ยังไม่มีประกาศ</h3>
                            <p className="text-text-secondary text-sm mb-10 max-w-sm mx-auto">เริ่มสื่อสารข่าวสารสำคัญของสถาบันให้เหล่านักเรียนได้รับทราบ</p>
                            <button
                                onClick={openAdd}
                                className="bg-primary hover:bg-primary-dark px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-95"
                            >
                                เพิ่มประกาศแรกเลย
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
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
                                            {editingAnnouncement ? 'แก้ไขประกาศ' : 'เพิ่มประกาศใหม่'}
                                        </h2>
                                        <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Announcement Details</p>
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
                                            หัวข้อประกาศ
                                        </label>
                                        <input
                                            type="text"
                                            value={form.title}
                                            onChange={e => setForm({ ...form, title: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            placeholder="เช่น เปิดรับสมัครคอร์สฟิสิกส์ A-Level รอบใหม่!"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                หมวดหมู่
                                            </label>
                                            <select
                                                value={form.category}
                                                onChange={e => setForm({ ...form, category: e.target.value as any })}
                                                className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium appearance-none cursor-pointer"
                                            >
                                                <option value="UPDATE">อัปเดตทั่วไป</option>
                                                <option value="NEW">คอร์สใหม่</option>
                                                <option value="URGENT">ด่วนที่สุด</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center pt-8">
                                            <label className="flex items-center gap-3 cursor-pointer select-none group">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={form.active}
                                                        onChange={e => setForm({ ...form, active: e.target.checked })}
                                                        className="sr-only"
                                                    />
                                                    <div className={cn(
                                                        "w-12 h-6 rounded-full transition-colors",
                                                        form.active ? "bg-primary" : "bg-gray-200"
                                                    )} />
                                                    <div className={cn(
                                                        "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                                                        form.active ? "translate-x-6" : ""
                                                    )} />
                                                </div>
                                                <span className="text-sm font-bold text-text-primary group-hover:text-primary-dark transition-colors">เปิดการแสดงผล</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            เนื้อหาประกาศ
                                        </label>
                                        <textarea
                                            value={form.content}
                                            onChange={e => setForm({ ...form, content: e.target.value })}
                                            rows={4}
                                            className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none font-medium leading-relaxed"
                                            placeholder="รายละเอียดข่าวสาร..."
                                        />
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
                                        บันทึกประกาศ
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
