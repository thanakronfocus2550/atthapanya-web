'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Ticket, Plus, Trash2, Edit2, X, Save, AlertCircle,
    Calendar, DollarSign, Percent, CheckCircle2, Power
} from 'lucide-react';
import { useSiteData } from '@/components/SiteDataProvider';
import { Coupon } from '@/types';
import { cn } from '@/lib/utils';
import PageTransition from '@/components/PageTransition';

export default function AdminCouponsPage() {
    const { data, updateCoupons } = useSiteData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [form, setForm] = useState<Partial<Coupon>>({
        code: '',
        type: 'PERCENTAGE',
        value: 0,
        minPurchase: 0,
        expiryDate: '',
        active: true
    });

    const coupons = data.coupons || [];

    const handleOpenAdd = () => {
        setEditingCoupon(null);
        setForm({
            code: '',
            type: 'PERCENTAGE',
            value: 0,
            minPurchase: 0,
            expiryDate: '',
            active: true
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setForm(coupon);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!form.code || !form.value) return;

        let updatedCoupons: Coupon[];
        if (editingCoupon) {
            updatedCoupons = coupons.map(c =>
                c.id === editingCoupon.id ? { ...c, ...form } as Coupon : c
            );
        } else {
            const newCoupon: Coupon = {
                id: Math.random().toString(36).substr(2, 9),
                code: form.code.toUpperCase(),
                type: form.type || 'PERCENTAGE',
                value: form.value || 0,
                minPurchase: form.minPurchase || 0,
                expiryDate: form.expiryDate || '',
                active: form.active ?? true
            };
            updatedCoupons = [newCoupon, ...coupons];
        }

        updateCoupons(updatedCoupons);
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคูปองนี้?')) {
            const updatedCoupons = coupons.filter(c => c.id !== id);
            updateCoupons(updatedCoupons);
        }
    };

    const toggleStatus = (coupon: Coupon) => {
        const updatedCoupons = coupons.map(c =>
            c.id === coupon.id ? { ...c, active: !c.active } : c
        );
        updateCoupons(updatedCoupons);
    };

    const isExpired = (dateString: string) => {
        if (!dateString) return false;
        return new Date(dateString) < new Date();
    };

    return (
        <PageTransition>
            <div className="space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary-dark shadow-inner border border-primary/20">
                            <Ticket className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-text-primary mb-1">จัดการคูปองส่วนลด</h1>
                            <p className="text-text-secondary text-sm font-medium">สร้างและจัดการโค้ดส่วนลดเพื่อส่งเสริมการขาย</p>
                        </div>
                    </div>
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-text-primary font-black text-sm rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        สร้างคูปองใหม่
                    </button>
                </div>

                {/* Coupons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {coupons.map((coupon, i) => {
                            const expired = isExpired(coupon.expiryDate || '');
                            return (
                                <motion.div
                                    key={coupon.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={cn(
                                        "bg-white rounded-[32px] border-2 border-dashed overflow-hidden flex flex-col group transition-all duration-300",
                                        coupon.active && !expired ? "border-primary/30 hover:border-primary hover:shadow-xl hover:shadow-primary/5" : "border-border grayscale opacity-60"
                                    )}
                                >
                                    <div className="p-8 flex-1">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={cn(
                                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                coupon.active && !expired ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                                            )}>
                                                {expired ? 'หมดอายุ' : coupon.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(coupon)}
                                                    className="p-2 hover:bg-surface-dark rounded-xl text-text-muted hover:text-primary transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coupon.id)}
                                                    className="p-2 hover:bg-danger/5 rounded-xl text-text-muted hover:text-danger transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-center mb-6">
                                            <h2 className="text-3xl font-black text-text-primary tracking-tighter mb-1 select-all">{coupon.code}</h2>
                                            <p className="text-sm font-black text-primary-dark">
                                                {coupon.type === 'PERCENTAGE' ? `ลด ${coupon.value}%` : `ลด ${coupon.value} บาท`}
                                            </p>
                                        </div>

                                        <div className="space-y-3 border-t border-border/50 pt-6">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className="text-text-muted uppercase tracking-wider">ขั้นต่ำ</span>
                                                <span className="text-text-primary">{coupon.minPurchase ? `${coupon.minPurchase} บาท` : 'ไม่มีขั้นต่ำ'}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className="text-text-muted uppercase tracking-wider">หมดอายุ</span>
                                                <span className={cn(expired ? "text-danger" : "text-text-primary")}>
                                                    {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('th-TH') : 'ไม่มีวันหมดอายุ'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleStatus(coupon)}
                                        className={cn(
                                            "w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2",
                                            coupon.active && !expired ? "bg-primary/5 text-primary-dark hover:bg-primary/10" : "bg-surface-dark text-text-muted hover:bg-border"
                                        )}
                                    >
                                        <Power className="w-3.5 h-3.5" />
                                        {coupon.active ? 'ระงับการใช้งาน' : 'เปิดใช้งานคูปอง'}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {coupons.length === 0 && (
                        <div className="col-span-full text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-border/50">
                            <div className="w-20 h-20 bg-surface-dark rounded-[32px] flex items-center justify-center mx-auto mb-6">
                                <Ticket className="w-10 h-10 text-text-muted/30" />
                            </div>
                            <h3 className="text-2xl font-black text-text-primary mb-2">ยังไม่มีคูปองส่วนลด</h3>
                            <p className="text-text-secondary text-sm max-w-xs mx-auto mb-8">สร้างคูปองแรกของคุณเพื่อเพิ่มยอดขายและมอบความประทับใจให้ผู้เรียน</p>
                            <button
                                onClick={handleOpenAdd}
                                className="px-8 py-4 bg-primary hover:bg-primary-dark text-text-primary font-black rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-95 mx-auto"
                            >
                                เริ่มสร้างคูปอง
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                                onClick={() => setIsModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
                            >
                                <div className="p-8 pb-0 flex justify-between items-center">
                                    <h2 className="text-2xl font-black text-text-primary">
                                        {editingCoupon ? 'แก้ไขคูปอง' : 'สร้างคูปองใหม่'}
                                    </h2>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-dark transition-colors"
                                    >
                                        <X className="w-5 h-5 text-text-secondary" />
                                    </button>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                รหัสคูปอง (Coupon Code)
                                            </label>
                                            <input
                                                type="text"
                                                value={form.code}
                                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                                className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-black text-lg tracking-wider"
                                                placeholder="เช่น FIRST50, SALE100"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                ประเภทส่วนลด
                                            </label>
                                            <div className="flex gap-2 p-1 bg-surface-dark rounded-xl">
                                                <button
                                                    onClick={() => setForm({ ...form, type: 'PERCENTAGE' })}
                                                    className={cn(
                                                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all",
                                                        form.type === 'PERCENTAGE' ? "bg-white shadow-sm text-text-primary" : "text-text-muted"
                                                    )}
                                                >
                                                    <Percent className="w-3.5 h-3.5" />
                                                    เปอร์เซ็นต์
                                                </button>
                                                <button
                                                    onClick={() => setForm({ ...form, type: 'FIXED' })}
                                                    className={cn(
                                                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all",
                                                        form.type === 'FIXED' ? "bg-white shadow-sm text-text-primary" : "text-text-muted"
                                                    )}
                                                >
                                                    <DollarSign className="w-3.5 h-3.5" />
                                                    จำนวนเงิน
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                มูลค่าส่วนลด
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={form.value}
                                                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                                                    className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-black"
                                                />
                                                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-text-muted">
                                                    {form.type === 'PERCENTAGE' ? '%' : '฿'}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                ซื้อขั้นต่ำ (บาท)
                                            </label>
                                            <input
                                                type="number"
                                                value={form.minPurchase}
                                                onChange={(e) => setForm({ ...form, minPurchase: Number(e.target.value) })}
                                                className="w-full px-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                placeholder="เช่น 0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                วันหมดอายุ
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                                                <input
                                                    type="date"
                                                    value={form.expiryDate}
                                                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                                                    className="w-full pl-12 pr-5 py-3.5 bg-surface border border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-surface-dark flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 font-black text-text-secondary hover:bg-white rounded-2xl transition-all border border-transparent hover:border-border active:scale-95"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={!form.code || !form.value}
                                        className="flex-3 py-4 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-black rounded-2xl transition-all shadow-lg shadow-primary/25 active:scale-95"
                                    >
                                        {editingCoupon ? 'อัปเดตคูปอง' : 'ยืนยันการสร้างคูปอง'}
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
