'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Upload, CheckCircle, ArrowLeft, ArrowRight,
    Loader2, ImageIcon, X, AlertCircle
} from 'lucide-react';
import { useSiteData } from '@/components/SiteDataProvider';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import { useParams, useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export default function UploadSlipPage() {
    const params = useParams();
    const router = useRouter();
    const { data, addPayment } = useSiteData();
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Find the current payment/course info (simulated for flow)
    // In a real app, this would fetch from a database based on paymentId
    const course = data.courses?.[0] || { id: '1', title: 'Loading...', price: 0 };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('ขนาดไฟล์ต้องไม่เกิน 5MB');
                return;
            }
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const compressImage = (base64: string): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.6)); // Compress to 60% quality
            };
        });
    };

    const handleUpload = async () => {
        if (!preview) {
            setError('กรุณาเลือกไฟล์สลิป');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            // Compress the image before saving
            const compressedSlip = await compressImage(preview);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const payment = {
                id: Math.random().toString(36).substr(2, 9),
                userId: 'U001', // Simulation
                userName: 'ทดสอบ นักเรียน',
                courseId: course.id,
                courseTitle: course.title,
                amount: course.price,
                slipImageUrl: compressedSlip,
                status: 'PENDING' as const,
                createdAt: new Date().toISOString()
            };

            addPayment(payment);
            setIsUploading(false);
            router.push('/checkout/thank-you');
        } catch (err) {
            console.error('Upload error:', err);
            setError('เกิดข้อผิดพลาดในการประมวลผลรูปภาพ กรุณาลองใหม่อีกครั้ง');
            setIsUploading(false);
        }
    };

    return (
        <PageTransition>
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-text-primary mb-3">แจ้งชำระเงิน</h1>
                    <p className="text-text-secondary">อัปโหลดหลักฐานการโอนเงินเพื่อปลดล็อกคอร์สเรียน</p>
                </div>

                <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm">
                    {/* Header Info */}
                    <div className="bg-surface p-6 border-b border-border">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-text-secondary">คอร์สที่ซื้อ</span>
                            <span className="text-sm font-bold text-primary-dark">{course.title}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-text-secondary">ยอดรวมที่ต้องโอน</span>
                            <span className="text-2xl font-bold text-text-primary">{formatPrice(course.price)}</span>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* QR Code Ref (Optional Display) */}
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-4">
                            <AlertCircle className="w-5 h-5 text-primary-dark shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-bold text-text-primary mb-1">ตรวจสอบความถูกต้องก่อนอัปโหลด</p>
                                <p className="text-text-secondary">กรุณาตรวจสอบยอดเงินและวันเวลาในสลิปให้ตรงตามที่โอนจริง</p>
                            </div>
                        </div>

                        {/* Upload Zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative border-2 border-dashed rounded-3xl transition-all cursor-pointer overflow-hidden ${preview
                                ? 'border-primary bg-primary/5'
                                : error
                                    ? 'border-danger/40 bg-danger/5'
                                    : 'border-border hover:border-primary/40 hover:bg-surface'
                                }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />

                            {preview ? (
                                <div className="relative group aspect-[3/4] sm:aspect-video flex items-center justify-center p-4">
                                    <img
                                        src={preview}
                                        alt="Slip Preview"
                                        className="h-full w-auto object-contain rounded-xl shadow-lg"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreview(null);
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="py-16 flex flex-col items-center justify-center space-y-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                                        <Upload className="w-8 h-8 text-primary-dark" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-text-primary">คลิกเพื่ออัปโหลดสลิป</p>
                                        <p className="text-xs text-text-muted mt-1">ไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <p className="text-sm text-center text-danger font-medium">{error}</p>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={isUploading || !preview}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isUploading || !preview
                                ? 'bg-surface text-text-muted cursor-not-allowed'
                                : 'bg-primary hover:bg-primary-dark text-text-primary shadow-lg shadow-primary/20'
                                }`}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    กำลังอัปโหลด...
                                </>
                            ) : (
                                <>
                                    ยืนยันการชำระเงิน
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/dashboard" className="text-sm text-text-muted hover:text-primary-dark transition-colors">
                        ยกเลิกและกลับสู่หน้าหลัก
                    </Link>
                </div>
            </div>
        </PageTransition>
    );
}
