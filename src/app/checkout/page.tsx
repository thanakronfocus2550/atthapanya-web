'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Trash2, ShoppingCart, CreditCard, QrCode, CheckCircle,
    ArrowLeft, ArrowRight, BookOpen
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/components/CartProvider';

type Step = 'cart' | 'payment' | 'success';

export default function CheckoutPage() {
    const [step, setStep] = useState<Step>('cart');
    const { items: cartItems, removeItem, clearCart, totalPrice } = useCart();
    const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'card'>('promptpay');
    const [billingForm, setBillingForm] = useState({
        name: '', address: '', phone: '', taxId: '',
    });

    const total = totalPrice;

    const handlePayment = () => {
        clearCart();
        setStep('success');
    };

    return (
        <PageTransition>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {/* Breadcrumb steps */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    {[
                        { key: 'cart', label: 'ตะกร้า' },
                        { key: 'payment', label: 'ชำระเงิน' },
                        { key: 'success', label: 'สำเร็จ' },
                    ].map((s, i) => (
                        <div key={s.key} className="flex items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === s.key || (step === 'success' && i < 2) || (step === 'payment' && i === 0)
                                    ? 'bg-primary text-text-primary'
                                    : 'bg-surface text-text-muted'
                                    }`}
                            >
                                {i + 1}
                            </div>
                            <span className={`text-sm hidden sm:block ${step === s.key ? 'font-medium text-text-primary' : 'text-text-muted'
                                }`}>
                                {s.label}
                            </span>
                            {i < 2 && (
                                <div className="w-12 h-[2px] bg-border mx-1" />
                            )}
                        </div>
                    ))}
                </div>

                {/* ─── Cart Step ─── */}
                {step === 'cart' && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-2xl font-bold text-text-primary mb-6">
                            <ShoppingCart className="w-6 h-6 inline mr-2" />
                            ตะกร้าสินค้า
                        </h1>

                        {cartItems.length > 0 ? (
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Items */}
                                <div className="flex-1 space-y-4">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.course.id}
                                            className="bg-white rounded-2xl border border-border p-5 flex items-start gap-4"
                                        >
                                            <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                                <BookOpen className="w-8 h-8 text-primary/40" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-text-primary">{item.course.title}</h3>
                                                <p className="text-sm text-text-secondary mt-0.5">{item.course.tutorName}</p>
                                                <p className="text-sm text-text-muted mt-0.5">
                                                    {item.course.totalLessons} บท • {item.course.totalHours} ชม.
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-lg font-bold text-primary-dark">
                                                    {formatPrice(item.course.price)}
                                                </p>
                                                <button
                                                    onClick={() => removeItem(item.course.id)}
                                                    className="mt-2 text-xs text-danger hover:underline flex items-center gap-1"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    ลบ
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="lg:w-80 shrink-0">
                                    <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
                                        <h3 className="font-semibold text-text-primary mb-4">สรุปรายการ</h3>
                                        <div className="space-y-2 text-sm mb-4">
                                            {cartItems.map((item) => (
                                                <div key={item.course.id} className="flex justify-between text-text-secondary">
                                                    <span className="truncate mr-2">{item.course.title}</span>
                                                    <span className="shrink-0">{formatPrice(item.course.price)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t border-border pt-3 flex justify-between items-center mb-6">
                                            <span className="font-medium text-text-primary">ยอดรวม</span>
                                            <span className="text-xl font-bold text-primary-dark">{formatPrice(total)}</span>
                                        </div>
                                        <button
                                            onClick={() => setStep('payment')}
                                            className="w-full py-3 bg-primary hover:bg-primary-dark text-text-primary font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
                                        >
                                            ดำเนินการชำระเงิน
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <ShoppingCart className="w-16 h-16 text-text-muted mx-auto mb-4" />
                                <p className="text-text-secondary font-medium mb-3">ตะกร้าว่างเปล่า</p>
                                <Link href="/courses" className="text-primary-dark hover:underline text-sm">
                                    เลือกคอร์สเรียน
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ─── Payment Step ─── */}
                {step === 'payment' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <button
                            onClick={() => setStep('cart')}
                            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            กลับไปตะกร้า
                        </button>

                        <h1 className="text-2xl font-bold text-text-primary mb-6">ชำระเงิน</h1>

                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1 space-y-6">
                                {/* Billing */}
                                <div className="bg-white rounded-2xl border border-border p-6">
                                    <h3 className="font-semibold text-text-primary mb-4">ข้อมูลใบเสร็จ</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm text-text-secondary mb-1">ชื่อ-นามสกุล</label>
                                            <input
                                                type="text"
                                                value={billingForm.name}
                                                onChange={(e) => setBillingForm({ ...billingForm, name: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm text-text-secondary mb-1">ที่อยู่</label>
                                            <textarea
                                                value={billingForm.address}
                                                onChange={(e) => setBillingForm({ ...billingForm, address: e.target.value })}
                                                rows={2}
                                                className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-text-secondary mb-1">เบอร์โทรศัพท์</label>
                                            <input
                                                type="tel"
                                                value={billingForm.phone}
                                                onChange={(e) => setBillingForm({ ...billingForm, phone: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-text-secondary mb-1">เลขผู้เสียภาษี (ถ้ามี)</label>
                                            <input
                                                type="text"
                                                value={billingForm.taxId}
                                                onChange={(e) => setBillingForm({ ...billingForm, taxId: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white rounded-2xl border border-border p-6">
                                    <h3 className="font-semibold text-text-primary mb-4">วิธีชำระเงิน</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setPaymentMethod('promptpay')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === 'promptpay'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/40'
                                                }`}
                                        >
                                            <QrCode className="w-6 h-6 text-primary-dark mb-2" />
                                            <p className="font-medium text-sm">PromptPay QR</p>
                                            <p className="text-xs text-text-muted">สแกน QR Code ชำระเงิน</p>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('card')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === 'card'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/40'
                                                }`}
                                        >
                                            <CreditCard className="w-6 h-6 text-primary-dark mb-2" />
                                            <p className="font-medium text-sm">บัตรเครดิต/เดบิต</p>
                                            <p className="text-xs text-text-muted">Visa, Mastercard, JCB</p>
                                        </button>
                                    </div>

                                    {/* Payment Details */}
                                    {paymentMethod === 'promptpay' && (
                                        <div className="mt-6 text-center">
                                            <div className="w-48 h-48 bg-surface border border-border rounded-2xl mx-auto flex items-center justify-center mb-3">
                                                <div className="text-center">
                                                    <QrCode className="w-20 h-20 text-text-muted mx-auto mb-2" />
                                                    <p className="text-xs text-text-muted">QR Code (Mock)</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-text-secondary">
                                                สแกน QR Code เพื่อชำระเงิน {formatPrice(total)}
                                            </p>
                                            <p className="text-xs text-text-muted mt-1">
                                                หลังชำระเงินแล้ว กรุณาอัปโหลดสลิปหลักฐาน
                                            </p>
                                        </div>
                                    )}

                                    {paymentMethod === 'card' && (
                                        <div className="mt-6 space-y-4">
                                            <div>
                                                <label className="block text-sm text-text-secondary mb-1">หมายเลขบัตร</label>
                                                <input
                                                    type="text"
                                                    placeholder="0000 0000 0000 0000"
                                                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-text-secondary mb-1">วันหมดอายุ</label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-text-secondary mb-1">CVV</label>
                                                    <input
                                                        type="text"
                                                        placeholder="123"
                                                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary sidebar */}
                            <div className="lg:w-80 shrink-0">
                                <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
                                    <h3 className="font-semibold text-text-primary mb-4">สรุปรายการ</h3>
                                    <div className="space-y-2 text-sm mb-4">
                                        {cartItems.map((item) => (
                                            <div key={item.course.id} className="flex justify-between text-text-secondary">
                                                <span className="truncate mr-2">{item.course.title}</span>
                                                <span className="shrink-0">{formatPrice(item.course.price)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-border pt-3 flex justify-between items-center mb-6">
                                        <span className="font-medium">ยอดรวม</span>
                                        <span className="text-xl font-bold text-primary-dark">{formatPrice(total)}</span>
                                    </div>
                                    <button
                                        onClick={handlePayment}
                                        className="w-full py-3 bg-primary hover:bg-primary-dark text-text-primary font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
                                    >
                                        ชำระเงิน {formatPrice(total)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ─── Success Step ─── */}
                {step === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <CheckCircle className="w-24 h-24 text-success mx-auto mb-6" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-text-primary mb-3">ชำระเงินสำเร็จ!</h1>
                        <p className="text-text-secondary max-w-md mx-auto mb-8">
                            ขอบคุณที่สมัครเรียนกับอรรถปัญญา เราได้รับการชำระเงินของคุณแล้ว
                            คุณสามารถเริ่มเรียนได้ทันที!
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-text-primary font-semibold rounded-xl transition-all"
                            >
                                ไปหน้าแดชบอร์ด
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/courses"
                                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-border text-text-secondary hover:border-primary hover:text-primary-dark font-medium rounded-xl transition-all"
                            >
                                ดูคอร์สเพิ่มเติม
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </PageTransition>
    );
}
