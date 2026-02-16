'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Eye, X, Clock, ImageIcon } from 'lucide-react';
import { payments as initialPayments } from '@/lib/data';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Payment, PaymentStatus } from '@/types';

export default function AdminPaymentsPage() {
    const [paymentList, setPaymentList] = useState(initialPayments);
    const [selectedSlip, setSelectedSlip] = useState<Payment | null>(null);
    const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'ALL'>('ALL');

    const filtered =
        filterStatus === 'ALL'
            ? paymentList
            : paymentList.filter((p) => p.status === filterStatus);

    const handleAction = (id: string, status: PaymentStatus) => {
        setPaymentList(paymentList.map((p) => (p.id === id ? { ...p, status } : p)));
        setSelectedSlip(null);
    };

    const statusBadge = (status: PaymentStatus) => {
        switch (status) {
            case 'SUCCESS':
                return <span className="px-2.5 py-1 bg-green-50 text-success text-xs rounded-full font-medium">อนุมัติ</span>;
            case 'PENDING':
                return <span className="px-2.5 py-1 bg-yellow-50 text-warning text-xs rounded-full font-medium">รอตรวจ</span>;
            case 'REJECTED':
                return <span className="px-2.5 py-1 bg-red-50 text-danger text-xs rounded-full font-medium">ปฏิเสธ</span>;
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-text-primary mb-6">ตรวจสอบการชำระเงิน</h1>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {[
                    { label: 'ทั้งหมด', value: 'ALL' as const },
                    { label: 'รอตรวจ', value: 'PENDING' as const },
                    { label: 'อนุมัติ', value: 'SUCCESS' as const },
                    { label: 'ปฏิเสธ', value: 'REJECTED' as const },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilterStatus(tab.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === tab.value
                                ? 'bg-primary text-text-primary'
                                : 'bg-white text-text-secondary border border-border hover:bg-surface-dark'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Payment table */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface border-b border-border">
                                <th className="text-left px-5 py-3 font-medium text-text-secondary">นักเรียน</th>
                                <th className="text-left px-5 py-3 font-medium text-text-secondary hidden md:table-cell">คอร์ส</th>
                                <th className="text-right px-5 py-3 font-medium text-text-secondary">จำนวนเงิน</th>
                                <th className="text-center px-5 py-3 font-medium text-text-secondary hidden sm:table-cell">วันที่</th>
                                <th className="text-center px-5 py-3 font-medium text-text-secondary">สถานะ</th>
                                <th className="text-center px-5 py-3 font-medium text-text-secondary">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map((payment) => (
                                <tr key={payment.id} className="hover:bg-surface/50 transition-colors">
                                    <td className="px-5 py-4 font-medium text-text-primary">{payment.userName}</td>
                                    <td className="px-5 py-4 text-text-secondary hidden md:table-cell">{payment.courseTitle}</td>
                                    <td className="px-5 py-4 text-right font-medium">{formatPrice(payment.amount)}</td>
                                    <td className="px-5 py-4 text-center text-text-muted text-xs hidden sm:table-cell">
                                        {formatDate(payment.createdAt)}
                                    </td>
                                    <td className="px-5 py-4 text-center">{statusBadge(payment.status)}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => setSelectedSlip(payment)}
                                                className="p-1.5 rounded-lg hover:bg-surface-dark transition-colors text-text-muted"
                                                title="ดูสลิป"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {payment.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(payment.id, 'SUCCESS')}
                                                        className="p-1.5 rounded-lg hover:bg-green-50 text-success transition-colors"
                                                        title="อนุมัติ"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(payment.id, 'REJECTED')}
                                                        className="p-1.5 rounded-lg hover:bg-red-50 text-danger transition-colors"
                                                        title="ปฏิเสธ"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12 text-text-muted">
                        <Clock className="w-10 h-10 mx-auto mb-2" />
                        ไม่พบรายการ
                    </div>
                )}
            </div>

            {/* Slip Modal */}
            {selectedSlip && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedSlip(null)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-text-primary">หลักฐานการโอนเงิน</h2>
                            <button onClick={() => setSelectedSlip(null)} className="text-text-muted hover:text-text-primary">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Slip Image Placeholder */}
                        <div className="w-full h-64 bg-surface border border-border rounded-xl flex items-center justify-center mb-4">
                            <div className="text-center">
                                <ImageIcon className="w-12 h-12 text-text-muted mx-auto mb-2" />
                                <p className="text-sm text-text-muted">สลิปหลักฐาน (Mock)</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm mb-6">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">ชื่อ</span>
                                <span className="font-medium">{selectedSlip.userName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">คอร์ส</span>
                                <span className="font-medium">{selectedSlip.courseTitle}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">จำนวนเงิน</span>
                                <span className="font-bold text-primary-dark">{formatPrice(selectedSlip.amount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">สถานะ</span>
                                {statusBadge(selectedSlip.status)}
                            </div>
                        </div>

                        {selectedSlip.status === 'PENDING' && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleAction(selectedSlip.id, 'REJECTED')}
                                    className="flex-1 py-2.5 border border-danger text-danger rounded-xl hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
                                >
                                    <XCircle className="w-4 h-4" />
                                    ปฏิเสธ
                                </button>
                                <button
                                    onClick={() => handleAction(selectedSlip.id, 'SUCCESS')}
                                    className="flex-1 py-2.5 bg-success text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    อนุมัติ
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
}
