'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, CheckCircle, XCircle, Eye, Search,
    Filter, Clock, Check, X, Image as ImageIcon, ExternalLink, Users
} from 'lucide-react';
import { useSiteData } from '@/components/SiteDataProvider';
import { formatPrice, cn } from '@/lib/utils';
import PageTransition from '@/components/PageTransition';

export default function AdminPaymentsPage() {
    const { data, processPayment } = useSiteData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'SUCCESS' | 'REJECTED'>('ALL');
    const [selectedSlip, setSelectedSlip] = useState<string | null>(null);

    const filteredPayments = (data.payments || []).filter(p => {
        const matchesSearch = p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        pending: (data.payments || []).filter(p => p.status === 'PENDING').length,
        success: (data.payments || []).filter(p => p.status === 'SUCCESS').length,
        total: (data.payments || []).length
    };

    return (
        <PageTransition>
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-text-primary mb-2">ตรวจสอบการชำระเงิน</h1>
                        <p className="text-text-secondary text-sm">ตรวจสอบความถูกต้องของสลิปและอนุมัติสิทธิ์การเข้าเรียน</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-7 rounded-[28px] border border-border shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-4 text-warning mb-4">
                            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Clock className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-wider">รอการตรวจสอบ</span>
                        </div>
                        <p className="text-3xl font-black text-text-primary tracking-tight">{stats.pending.toLocaleString()}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-7 rounded-[28px] border border-border shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-4 text-success mb-4">
                            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-wider">อนุมัติแล้ว</span>
                        </div>
                        <p className="text-3xl font-black text-text-primary tracking-tight">{stats.success.toLocaleString()}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-7 rounded-[28px] border border-border shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-4 text-primary-dark mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-wider">รายการทั้งหมด</span>
                        </div>
                        <p className="text-3xl font-black text-text-primary tracking-tight">{stats.total.toLocaleString()}</p>
                    </motion.div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อนักเรียน หรือคอร์ส..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-border rounded-[20px] text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-2 p-1.5 bg-surface-dark rounded-[20px] border border-border">
                        {(['ALL', 'PENDING', 'SUCCESS', 'REJECTED'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                                    filterStatus === status
                                        ? "bg-white text-text-primary shadow-sm"
                                        : "text-text-muted hover:text-text-primary hover:bg-white/50"
                                )}
                            >
                                {status === 'ALL' ? 'ทั้งหมด' :
                                    status === 'PENDING' ? 'รอตรวจสอบ' :
                                        status === 'SUCCESS' ? 'สำเร็จ' : 'ปฏิเสธ'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white rounded-[32px] border border-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-dark border-b border-border">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">นักเรียน</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">คอร์ส</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">ยอดชำระ</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">วันที่</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">หลักฐาน</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">สถานะ</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-surface-dark/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-surface-dark rounded-xl flex items-center justify-center text-text-muted border border-border group-hover:bg-white transition-colors">
                                                        <Users className="w-4.5 h-4.5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-text-primary text-sm">{payment.userName}</p>
                                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-tight">ID: {payment.userId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-bold text-text-primary text-sm">{payment.courseTitle}</p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <p className="font-black text-primary-dark text-base">{formatPrice(payment.amount)}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs font-bold text-text-secondary">
                                                    {new Date(payment.createdAt).toLocaleDateString('th-TH', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <button
                                                    onClick={() => setSelectedSlip(payment.slipImageUrl)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-surface-dark text-text-primary rounded-xl hover:bg-primary hover:shadow-md hover:shadow-primary/10 transition-all border border-border"
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase">ดูสลิป</span>
                                                </button>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider",
                                                    payment.status === 'SUCCESS' ? 'bg-success/10 text-success' :
                                                        payment.status === 'REJECTED' ? 'bg-danger/10 text-danger' :
                                                            'bg-amber-100 text-amber-700'
                                                )}>
                                                    <div className={cn(
                                                        "w-1.5 h-1.5 rounded-full",
                                                        payment.status === 'SUCCESS' ? 'bg-success' :
                                                            payment.status === 'REJECTED' ? 'bg-danger' :
                                                                'bg-amber-500'
                                                    )} />
                                                    {payment.status === 'SUCCESS' ? 'สำเร็จ' :
                                                        payment.status === 'REJECTED' ? 'ปฏิเสธ' : 'รอตรวจสอบ'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {payment.status === 'PENDING' ? (
                                                        <>
                                                            <button
                                                                onClick={() => processPayment(payment.id, 'SUCCESS')}
                                                                className="px-4 py-2 bg-success text-white font-black text-[10px] rounded-xl hover:bg-success-dark transition-all shadow-lg shadow-success/20 active:scale-95 uppercase"
                                                            >
                                                                อนุมัติ
                                                            </button>
                                                            <button
                                                                onClick={() => processPayment(payment.id, 'REJECTED')}
                                                                className="px-4 py-2 bg-white border border-border text-danger font-black text-[10px] rounded-xl hover:bg-danger hover:text-white hover:border-danger transition-all active:scale-95 uppercase"
                                                            >
                                                                ปฏิเสธ
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-text-muted italic uppercase tracking-widest">Processed</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-20 text-center">
                                            <div className="w-16 h-16 bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                                                <Search className="w-6 h-6 text-text-muted/30" />
                                            </div>
                                            <p className="text-sm font-bold text-text-primary italic">ไม่พบรายการชำระเงินที่ต้องการ</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Slip Viewer Modal */}
                <AnimatePresence>
                    {selectedSlip && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md"
                            onClick={() => setSelectedSlip(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative bg-white p-2 rounded-2xl max-w-sm w-full shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    className="absolute -top-12 right-0 p-2 text-white bg-white/20 hover:bg-white/40 rounded-full transition-all"
                                    onClick={() => setSelectedSlip(null)}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <img
                                    src={selectedSlip}
                                    alt="Payment Slip"
                                    className="w-full h-auto rounded-xl"
                                />
                                <div className="p-4 text-center">
                                    <p className="text-sm font-medium text-text-secondary mb-2">ภาพหลักฐานการโอนเงิน</p>
                                    <a
                                        href={selectedSlip}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary-dark hover:underline flex items-center justify-center gap-1"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        ดูรูปขนาดเต็ม
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
}
