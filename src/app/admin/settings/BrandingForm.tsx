'use client';

import { useState } from 'react';
import { useSiteData } from '@/components/SiteDataProvider';
import { Save, Upload, Type, Palette, Mail, Phone, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BrandingForm() {
    const { data, updateSettings } = useSiteData();
    const [settings, setSettings] = useState(data?.settings || {});
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;

        setIsUploading(true);
        try {
            const base64 = await compressAndConvertToBase64(file);
            setSettings({ ...settings, logo: base64 });
        } catch (error) {
            console.error('Error uploading logo:', error);
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
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
                    const MAX_SIZE = 200; // Logos don't need to be huge
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    const compressedBase64 = canvas.toDataURL('image/png', 0.8);
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
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary-dark" />
                    อัตลักษณ์ (Branding)
                </h3>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Logo Upload */}
                    <div className="w-full md:w-auto flex flex-col items-center gap-4">
                        <div className="relative w-32 h-32 rounded-3xl bg-surface border border-border overflow-hidden group">
                            {settings.logo ? (
                                <img src={settings.logo} alt="Logo" className="w-full h-full object-contain p-4" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-text-muted">
                                    <GraduationCap className="w-12 h-12" />
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <Upload className="w-6 h-6 text-white" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={isUploading} />
                            </label>
                            {isUploading && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-3xl">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] font-black uppercase text-text-muted tracking-widest text-center leading-tight">
                            Logo สถาบัน<br />(แนะนำ 200x200)
                        </p>
                    </div>

                    {/* Site Name & Color */}
                    <div className="flex-1 grid grid-cols-1 gap-6 w-full">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">ชื่อสถาบัน / เว็บไซต์</label>
                            <input
                                type="text"
                                value={settings.siteName || ''}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all font-bold"
                                placeholder="เช่น อรรถปัญญา"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">สีธีมหลัก (Brand Color)</label>
                            <div className="flex gap-3">
                                <input
                                    type="color"
                                    value={settings.primaryColor || '#FACC15'}
                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                    className="h-10 w-20 p-1 rounded-lg border border-border cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.primaryColor || ''}
                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                    className="flex-1 px-4 py-2 rounded-xl border border-border text-sm font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary-dark" />
                    ข้อมูลติดต่อ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">อีเมล</label>
                        <input
                            type="email"
                            value={settings.email || ''}
                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">เบอร์โทรศัพท์</label>
                        <input
                            type="text"
                            value={settings.phone || ''}
                            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                        />
                    </div>
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
