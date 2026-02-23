'use client';

import { useState } from 'react';
import { useSiteData } from '@/components/SiteDataProvider';
import { Save, Globe, Facebook, MessageCircle, Instagram, Share2, Search } from 'lucide-react';

export default function SEOSocialForm() {
    const { data, updateSettings } = useSiteData();
    const [settings, setSettings] = useState(data.settings);
    const [isSaving, setIsSaving] = useState(false);

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
                    <Search className="w-5 h-5 text-primary-dark" />
                    SEO (Search Engine Optimization)
                </h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Meta Title (ชื่อหน้าเว็บสำหรับ Google)</label>
                        <input
                            type="text"
                            value={settings.metaTitle || ''}
                            onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                            placeholder="เช่น อรรถปัญญา | สถาบันกวดวิชาชั้นนำ"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Meta Description (คำอธิบายสั้นๆ)</label>
                        <textarea
                            value={settings.metaDescription || ''}
                            onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none h-24 resize-none"
                            placeholder="คำอธิบายที่จะแสดงในหน้าค้นหา Google..."
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-primary-dark" />
                    โซเชียลมีเดีย
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Facebook Page URL</label>
                        <div className="relative">
                            <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="url"
                                value={settings.facebookUrl || ''}
                                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Line ID (ไม่ต้องมี @)</label>
                        <div className="relative">
                            <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                value={settings.lineId || ''}
                                onChange={(e) => setSettings({ ...settings, lineId: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                                placeholder="เช่น attapanya"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Instagram URL</label>
                        <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="url"
                                value={settings.instagramUrl || ''}
                                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">TikTok URL</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="url"
                                value={settings.tiktokUrl || ''}
                                onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                            />
                        </div>
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
