'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2, ShoppingCart, CreditCard, QrCode, CheckCircle,
    ArrowLeft, ArrowRight, BookOpen, Clock, Play, Lock,
    CheckCircle2, MessageSquare, Send
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { formatPrice, cn } from '@/lib/utils';
import { useCart } from '@/components/CartProvider';
import { useSiteData } from '@/components/SiteDataProvider';

type Step = 'cart' | 'payment' | 'success';

export default function CheckoutPage() {
    const { data } = useSiteData();
    const router = useRouter();
    const [step, setStep] = useState<Step>('cart');
    const { items: cartItems, removeItem, clearCart, totalPrice } = useCart();
    const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'card'>('promptpay');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
    const [billingForm, setBillingForm] = useState({
        name: '', address: '', phone: '', taxId: '',
    });

    const discount = appliedCoupon
        ? (appliedCoupon.type === 'PERCENTAGE'
            ? (totalPrice * appliedCoupon.value) / 100
            : appliedCoupon.value)
        : 0;

    const total = Math.max(0, totalPrice - discount);

    const handleApplyCoupon = () => {
        const coupon = data.coupons.find(c => c.code === couponCode.toUpperCase() && c.active);
        if (coupon) {
            if (coupon.minPurchase && totalPrice < coupon.minPurchase) {
                alert(`คูปองนี้ใช้ได้เมื่อมียอดซื้อขั้นต่ำ ${coupon.minPurchase} บาท`);
                return;
            }
            setAppliedCoupon(coupon);
        } else {
            alert('ไม่พบโค้ดส่วนลดหรือคูปองหมดอายุ/ไม่มีสิทธิ์การใช้งาน');
        }
    };

    const handlePayment = () => {
        if (paymentMethod === 'promptpay') {
            // Clear cart but redirect to slip upload instead of success
            clearCart();
            router.push('/checkout/upload-slip');
        } else {
            // For card, assume instant success for simulation
            clearCart();
            setStep('success');
        }
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
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                                    step === s.key || (step === 'success' && i < 2) || (step === 'payment' && i === 0)
                                        ? 'bg-primary text-text-primary'
                                        : 'bg-surface text-text-muted'
                                )}
                            >
                                {i + 1}
                            </div>
                            <span className={cn(
                                "text-sm hidden sm:block transition-all",
                                step === s.key ? 'font-medium text-text-primary' : 'text-text-muted'
                            )}>
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
                            <ShoppingCart className="w-6 h-6 inline mr-2 text-primary-dark" />
                            ตะกร้าสินค้า
                        </h1>

                        {cartItems.length > 0 ? (
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Items */}
                                <div className="flex-1 space-y-4">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.course.id}
                                            className="bg-white rounded-2xl border border-border p-5 flex items-start gap-4 hover:shadow-sm transition-all"
                                        >
                                            <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                                <BookOpen className="w-8 h-8 text-primary/40" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-text-primary truncate">{item.course.title}</h3>
                                                <p className="text-sm text-text-secondary mt-0.5">{item.course.tutorName}</p>
                                                <div className="flex items-center gap-3 mt-2 text-xs text-text-muted font-medium">
                                                    <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {item.course.totalLessons} บท</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.course.totalHours} ชม.</span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-lg font-bold text-primary-dark">
                                                    {formatPrice(item.course.price)}
                                                </p>
                                                <button
                                                    onClick={() => removeItem(item.course.id)}
                                                    className="mt-2 text-xs text-danger hover:underline flex items-center gap-1 justify-end ml-auto group"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                                    ลบ
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="lg:w-80 shrink-0">
                                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm sticky top-24">
                                        <h3 className="font-bold text-text-primary mb-4 text-base">สรุปรายการ</h3>
                                        <div className="space-y-3 mb-6">
                                            {cartItems.map((item) => (
                                                <div key={item.course.id} className="flex justify-between text-sm text-text-secondary">
                                                    <span className="truncate mr-4">{item.course.title}</span>
                                                    <span className="shrink-0">{formatPrice(item.course.price)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t border-border pt-4 mb-6">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-text-secondary">ราคารวม</span>
                                                <span className="font-bold">{formatPrice(totalPrice)}</span>
                                            </div>
                                            {appliedCoupon && (
                                                <div className="flex justify-between text-sm text-success font-bold mb-2">
                                                    <span>ส่วนลด ({appliedCoupon.code})</span>
                                                    <span>-{formatPrice(discount)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
                                                <span className="font-bold text-text-primary">ยอดสุทธิ</span>
                                                <span className="text-2xl font-black text-primary-dark">{formatPrice(total)}</span>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">ใช้โค้ดส่วนลด</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    placeholder="ใส่โค้ดที่นี่"
                                                    className="flex-1 px-3 py-2 bg-surface text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all uppercase placeholder:normal-case"
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    className="px-4 py-2 bg-text-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark hover:text-text-primary transition-all disabled:opacity-50"
                                                    disabled={!couponCode.trim()}
                                                >
                                                    ใช้
                                                </button>
                                            </div>
                                            {appliedCoupon && (
                                                <p className="text-[10px] text-success font-bold mt-2 flex items-center gap-1 px-2 py-1 bg-success/10 rounded-md">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    ใช้คูปองสำเร็จ! {appliedCoupon.type === 'PERCENTAGE' ? `${appliedCoupon.value}%` : `${appliedCoupon.value}฿`}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => setStep('payment')}
                                            className="w-full py-4 bg-primary hover:bg-primary-dark text-text-primary font-bold rounded-xl transition-all shadow-md hover:shadow-primary/20 flex items-center justify-center gap-2"
                                        >
                                            ดำเนินการชำระเงิน
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-3xl border border-border border-dashed">
                                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShoppingCart className="w-10 h-10 text-text-muted" />
                                </div>
                                <p className="text-text-primary text-lg font-bold mb-2">ตะกร้าของคุณยังว่างอยู่</p>
                                <p className="text-text-secondary mb-8">ออกไปหาความรู้ใหม่ๆ ใส่ตะกร้ากันเถอะ!</p>
                                <Link href="/courses" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-text-primary font-bold rounded-xl hover:shadow-lg transition-all">
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
                            className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-primary transition-colors mb-8 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            กลับไปแก้ไขตะกร้า
                        </button>

                        <h1 className="text-2xl font-bold text-text-primary mb-8">ดำเนินการชำระเงิน</h1>

                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex-1 space-y-8">
                                {/* Billing Form */}
                                <section className="bg-white rounded-2xl border border-border p-8 shadow-sm">
                                    <h3 className="font-bold text-lg text-text-primary mb-6 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <BookOpen className="w-4 h-4 text-primary-dark" />
                                        </div>
                                        ข้อมูลสำหรับออกใบเสร็จ
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">ชื่อ-นามสกุล (สำหรับออกใบเสร็จ)</label>
                                            <input
                                                type="text"
                                                value={billingForm.name}
                                                onChange={(e) => setBillingForm({ ...billingForm, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                                                placeholder="ชื่อ-นามสกุลจริง"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">ที่อยู่ออกใบเสร็จ</label>
                                            <textarea
                                                value={billingForm.address}
                                                onChange={(e) => setBillingForm({ ...billingForm, address: e.target.value })}
                                                rows={2}
                                                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none font-medium"
                                                placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">เบอร์โทรศัพท์</label>
                                            <input
                                                type="tel"
                                                value={billingForm.phone}
                                                onChange={(e) => setBillingForm({ ...billingForm, phone: e.target.value })}
                                                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                                                placeholder="08X-XXX-XXXX"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">เลขผู้เสียภาษี (ไม่บังคับ)</label>
                                            <input
                                                type="text"
                                                value={billingForm.taxId}
                                                onChange={(e) => setBillingForm({ ...billingForm, taxId: e.target.value })}
                                                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                                                placeholder="13 หลัก"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Payment Method Selection */}
                                <section className="bg-white rounded-2xl border border-border p-8 shadow-sm">
                                    <h3 className="font-bold text-lg text-text-primary mb-6 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <CreditCard className="w-4 h-4 text-primary-dark" />
                                        </div>
                                        วิธีชำระเงิน
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setPaymentMethod('promptpay')}
                                            className={cn(
                                                "p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group",
                                                paymentMethod === 'promptpay'
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/40 hover:bg-surface'
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <QrCode className={cn(
                                                    "w-8 h-8 transition-colors",
                                                    paymentMethod === 'promptpay' ? 'text-primary-dark' : 'text-text-muted'
                                                )} />
                                                {paymentMethod === 'promptpay' && <CheckCircle2 className="w-5 h-5 text-primary-dark" />}
                                            </div>
                                            <p className="font-bold text-sm text-text-primary">PromptPay QR</p>
                                            <p className="text-[11px] text-text-secondary mt-1">สแกน QR Code แล้วอัปโหลดสลิป</p>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('card')}
                                            className={cn(
                                                "p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group",
                                                paymentMethod === 'card'
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/40 hover:bg-surface'
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <CreditCard className={cn(
                                                    "w-8 h-8 transition-colors",
                                                    paymentMethod === 'card' ? 'text-primary-dark' : 'text-text-muted'
                                                )} />
                                                {paymentMethod === 'card' && <CheckCircle2 className="w-5 h-5 text-primary-dark" />}
                                            </div>
                                            <p className="font-bold text-sm text-text-primary">เครดิต / เดบิต</p>
                                            <p className="text-[11px] text-text-secondary mt-1">ชำระผ่านระบบบัตรทันที</p>
                                        </button>
                                    </div>

                                    {/* Sub-Payment UI */}
                                    <AnimatePresence mode="wait">
                                        {paymentMethod === 'promptpay' && (
                                            <motion.div
                                                key="promptpay"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-8 border-t border-border pt-8"
                                            >
                                                <div className="bg-surface rounded-3xl p-8 text-center border border-border border-dashed max-w-sm mx-auto">
                                                    <div className="w-40 h-40 bg-white shadow-sm rounded-2xl mx-auto flex items-center justify-center mb-4 border border-border">
                                                        <div className="text-center opacity-40">
                                                            <QrCode className="w-16 h-16 mx-auto mb-2 text-text-muted" />
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Dynamic QR</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-bold text-text-primary mb-1">
                                                        ยอดชำระ {formatPrice(total)}
                                                    </p>
                                                    <p className="text-xs text-text-secondary mb-1">สแกนเพื่อจ่ายได้จากทุกแอปธนาคาร</p>
                                                    <p className="text-[10px] text-primary-dark font-bold mt-4 uppercase tracking-tighter bg-primary/10 inline-block px-3 py-1 rounded-full">
                                                        กรุณาอัปโหลดสลิปในขั้นตอนถัดไป
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}

                                        {paymentMethod === 'card' && (
                                            <motion.div
                                                key="card"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-8 space-y-5 border-t border-border pt-8"
                                            >
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">หมายเลขบัตร</label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                placeholder="0000 0000 0000 0000"
                                                                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-mono"
                                                            />
                                                            <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-border" />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">วันหมดอายุ</label>
                                                            <input
                                                                type="text"
                                                                placeholder="MM / YY"
                                                                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-mono"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">CVV / CVC</label>
                                                            <input
                                                                type="text"
                                                                placeholder="123"
                                                                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-mono"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </section>
                            </div>

                            {/* Payment Summary Sidebar */}
                            <div className="lg:w-80 shrink-0">
                                <div className="bg-white rounded-2xl border border-border p-8 shadow-sm flex flex-col h-fit sticky top-24">
                                    <h3 className="font-bold text-text-primary mb-6 text-base">สรุปคำสั่งซื้อ</h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-secondary">ราคารวม ({cartItems.length} รายการ)</span>
                                            <span className="font-bold text-text-primary">{formatPrice(totalPrice)}</span>
                                        </div>
                                        {appliedCoupon && (
                                            <div className="flex justify-between text-sm text-success font-bold">
                                                <span>ส่วนลดพิเศษ ({appliedCoupon.code})</span>
                                                <span>-{formatPrice(discount)}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-border pt-4 flex justify-between items-center mt-2">
                                            <div className="font-bold text-text-primary">ยอดชำระทั้งสิ้น</div>
                                            <div className="text-2xl font-black text-primary-dark leading-none">{formatPrice(total)}</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        className="w-full py-4 bg-primary hover:bg-primary-dark text-text-primary font-black rounded-xl transition-all shadow-xl shadow-primary/20 flex flex-col items-center justify-center p-2 group"
                                    >
                                        <span className="text-xs opacity-70 mb-0.5">ยืนยันการชำระเงิน</span>
                                        <div className="flex items-center gap-2">
                                            <span>{formatPrice(total)}</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>

                                    <p className="text-[10px] text-center text-text-muted mt-4 leading-relaxed px-4">
                                        การคลิกปุ่ม "ยืนยันการชำระเงิน" แสดงว่าคุณยอมรับ <a href="#" className="underline">ข้อตกลงและเงื่อนไข</a> ของบริษัท
                                    </p>
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
                        className="max-w-xl mx-auto py-16 px-4"
                    >
                        <div className="bg-white rounded-[40px] border border-border p-12 text-center shadow-xl">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                                className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-sm"
                            >
                                <CheckCircle2 className="w-12 h-12 text-success" />
                            </motion.div>

                            <h1 className="text-3xl font-black text-text-primary mb-3">ขอบคุณครับ!</h1>
                            <p className="text-text-secondary font-medium mb-10 leading-relaxed">
                                การชำระเงินของคุณสำเร็จแล้ว คุณสามารถเริ่มพัฒนาตัวเองผ่านคอร์สเรียนระดับพรีเมียมได้ทันที
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Link
                                    href="/dashboard"
                                    className="px-8 py-4 bg-primary hover:bg-primary-dark text-text-primary font-black rounded-2xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                                >
                                    ไปเรียนต่อกันเลย
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/courses"
                                    className="px-8 py-4 border-2 border-border text-text-secondary hover:border-primary hover:text-primary-dark font-bold rounded-2xl transition-all flex items-center justify-center"
                                >
                                    ดูคอร์สอื่นเพิ่ม
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </PageTransition>
    );
}
