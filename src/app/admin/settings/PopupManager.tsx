'use client';

import { useState } from 'react';
import { useSiteData } from '@/components/SiteDataProvider';
import { Save, Bell, Type, MousePointer2, ToggleLeft, ToggleRight, Sparkles, Image as ImageIcon, Plus, Trash2, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PopupManager() {
    const { data, updateSettings } = useSiteData();
    const [settings, setSettings] = useState(data?.settings || {});
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

    if (!settings) return null;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newImages = [...(settings.popupImages || [])];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) continue;

            try {
                const base64 = await compressAndConvertToBase64(file);
                newImages.push(base64);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        setSettings({ ...settings, popupImages: newImages });
        setIsUploading(false);
        // Reset input
        e.target.value = '';
    };

    const compressAndConvertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 600;
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

                    // Compress to 70% quality to save space
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedBase64);
                };
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        updateSettings(settings);
        setTimeout(() => setIsSaving(false), 500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary-dark" />
                        หน้าต่างประกาศ (Announcement Popup)
                    </h3>
                    <button
                        type="button"
                        onClick={() => setSettings({ ...settings, showPopup: !settings.showPopup })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${settings.showPopup ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                            }`}
                    >
                        {settings.showPopup ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        {settings.showPopup ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                            <Type className="w-4 h-4" />
                            หัวข้อประกาศ (Title)
                        </label>
                        <input
                            type="text"
                            value={settings.popupTitle || ''}
                            onChange={(e) => setSettings({ ...settings, popupTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none font-bold"
                            placeholder="ระบุชื่อหัวข้อ..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                            <Type className="w-4 h-4" />
                            ข้อความรายละเอียด (Description)
                        </label>
                        <textarea
                            value={settings.popupDescription || ''}
                            onChange={(e) => setSettings({ ...settings, popupDescription: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none h-32 resize-none"
                            placeholder="ระบุรายละเอียดประกาศ..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                                <MousePointer2 className="w-4 h-4" />
                                ข้อความบนปุ่ม (CTA Text)
                            </label>
                            <input
                                type="text"
                                value={settings.popupCtaText || ''}
                                onChange={(e) => setSettings({ ...settings, popupCtaText: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none"
                                placeholder="เช่น ดูรายละเอียดเพิ่มเติม"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                                <MousePointer2 className="w-4 h-4" />
                                ลิงก์ปลายทาง (CTA URL)
                            </label>
                            <input
                                type="text"
                                value={settings.popupCtaUrl || ''}
                                onChange={(e) => setSettings({ ...settings, popupCtaUrl: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none"
                                placeholder="/courses"
                            />
                        </div>
                    </div>
                </div>

                {/* Image Management Section */}
                <div className="mt-8 pt-8 border-t border-border/50">
                    <h4 className="text-sm font-bold text-text-secondary mb-4 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        รูปภาพประกอบ (Banner Images)
                    </h4>

                    <div className="mb-6">
                        <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:bg-surface transition-colors group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 text-text-muted group-hover:text-primary transition-colors mb-2" />
                                <p className="text-sm text-text-secondary">
                                    <span className="font-bold">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวางที่นี่
                                </p>
                                <p className="text-xs text-text-muted mt-1">แนะนำขนาด 800x450 (JPG, PNG)</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleFileUpload}
                                disabled={isUploading}
                            />
                            {isUploading && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                                    <div className="flex items-center gap-3 text-primary font-bold">
                                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        กำลังจัดการรูปภาพ...
                                    </div>
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {(settings.popupImages || []).map((img, idx) => (
                            <div key={idx} className="group relative aspect-video bg-surface rounded-xl border border-border overflow-hidden">
                                <img src={img} alt={`Popup ${idx}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const filtered = (settings.popupImages || []).filter((_, i) => i !== idx);
                                            setSettings({ ...settings, popupImages: filtered });
                                        }}
                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Preview */}
                <div className="mt-10 p-8 bg-surface rounded-[2rem] border border-border relative overflow-hidden">
                    <div className="absolute top-4 right-4 z-10 text-[10px] font-black text-text-muted uppercase tracking-widest bg-white px-2 py-1 rounded-md shadow-sm border border-border/50">
                        Live Preview
                    </div>

                    <div className="max-w-xs mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-border/30 transform scale-90 sm:scale-100">
                        {/* Preview Header/Carousel */}
                        <div className="relative h-40 bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
                            {settings.popupImages && settings.popupImages.length > 0 ? (
                                <>
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={currentPreviewIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            src={settings.popupImages[currentPreviewIndex]}
                                            className="w-full h-full object-cover"
                                        />
                                    </AnimatePresence>
                                    {settings.popupImages.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentPreviewIndex(p => (p - 1 + settings.popupImages!.length) % settings.popupImages!.length)}
                                                className="absolute left-1 top-1/2 -translate-y-1/2 p-1 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentPreviewIndex(p => (p + 1) % settings.popupImages!.length)}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <Bell className="w-8 h-8 text-white" />
                                </div>
                            )}
                        </div>

                        <div className="p-6 text-center">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded-full text-[10px] font-black text-primary-dark mb-3 uppercase tracking-wider">
                                <Sparkles className="w-3 h-3" />
                                Announcement
                            </div>
                            <h4 className="text-base font-black text-text-primary mb-2 leading-tight">
                                {settings.popupTitle || 'หัวข้อของคุณจะแสดงที่นี่'}
                            </h4>
                            <p className="text-[11px] text-text-secondary mb-4 line-clamp-3">
                                {settings.popupDescription || 'รายละเอียดประกาศของคุณจะแสดงที่ส่วนนี้ เพื่อแจ้งข้อมูลสำคัญให้กับนักเรียน'}
                            </p>
                            <div className="py-2 bg-primary text-text-primary font-black rounded-xl text-xs shadow-md">
                                {settings.popupCtaText || 'ปุ่มกด'}
                            </div>
                        </div>
                    </div>

                    {!settings.showPopup && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                            <div className="bg-white border border-border px-4 py-2 rounded-xl shadow-lg font-bold text-text-muted">
                                ปิดการใช้งานอยู่
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-text-primary font-semibold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
                </button>
            </div>
        </form>
    );
}
