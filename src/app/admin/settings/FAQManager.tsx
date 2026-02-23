'use client';

import { useState } from 'react';
import { useSiteData } from '@/components/SiteDataProvider';
import { FAQ } from '@/types';
import { Plus, Trash2, Edit2, Save, X, GripVertical } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

export default function FAQManager() {
    const { data, updateFAQs } = useSiteData();
    const [faqs, setFaqs] = useState<FAQ[]>(data.faqs);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
    const [isAdding, setIsAdding] = useState(false);

    const handleSave = () => {
        updateFAQs(faqs);
    };

    const addFAQ = () => {
        if (!newFAQ.question || !newFAQ.answer) return;
        const faq: FAQ = {
            id: Date.now().toString(),
            question: newFAQ.question,
            answer: newFAQ.answer,
        };
        const updated = [...faqs, faq];
        setFaqs(updated);
        updateFAQs(updated);
        setNewFAQ({ question: '', answer: '' });
        setIsAdding(false);
    };

    const deleteFAQ = (id: string) => {
        const updated = faqs.filter(f => f.id !== id);
        setFaqs(updated);
        updateFAQs(updated);
    };

    const updateFAQ = (id: string, updates: Partial<FAQ>) => {
        const updated = faqs.map(f => f.id === id ? { ...f, ...updates } : f);
        setFaqs(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">รายการคำถามที่พบบ่อย</h3>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary-dark hover:bg-primary/20 rounded-xl transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        เพิ่มคำถามใหม่
                    </button>
                )}
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4"
                >
                    <div className="space-y-2">
                        <label className="text-sm font-medium">คำถาม</label>
                        <input
                            type="text"
                            value={newFAQ.question || ''}
                            onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-border focus:ring-primary/40 outline-none"
                            placeholder="กรอกคำถาม..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">คำตอบ</label>
                        <textarea
                            value={newFAQ.answer || ''}
                            onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-border focus:ring-primary/40 outline-none h-24"
                            placeholder="กรอกคำตอบ..."
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 text-sm text-text-muted hover:text-text-primary transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={addFAQ}
                            className="px-4 py-2 bg-primary text-text-primary rounded-lg text-sm font-bold shadow-sm"
                        >
                            เพิ่มข้อมูล
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="space-y-4">
                {faqs.map((faq) => (
                    <div
                        key={faq.id}
                        className="bg-white rounded-2xl border border-border p-5 group flex gap-4"
                    >
                        <div className="flex-1 space-y-3">
                            {editingId === faq.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={faq.question || ''}
                                        onChange={(e) => updateFAQ(faq.id, { question: e.target.value })}
                                        className="w-full px-3 py-1.5 rounded-lg border border-border text-sm font-medium"
                                    />
                                    <textarea
                                        value={faq.answer || ''}
                                        onChange={(e) => updateFAQ(faq.id, { answer: e.target.value })}
                                        className="w-full px-3 py-1.5 rounded-lg border border-border text-sm h-24"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => { setEditingId(null); handleSave(); }}
                                            className="px-3 py-1.5 bg-success text-white rounded-lg text-xs font-medium"
                                        >
                                            บันทึก
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h4 className="font-semibold text-text-primary">{faq.question}</h4>
                                    <p className="text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setEditingId(faq.id)}
                                className="p-2 hover:bg-surface-dark rounded-lg text-text-muted transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => deleteFAQ(faq.id)}
                                className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
