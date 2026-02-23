'use client';

import { useState } from 'react';
import { useSiteData } from '@/components/SiteDataProvider';
import { Save, Layout, Type, MousePointer2 } from 'lucide-react';

export default function HeroEditor() {
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
                    <Layout className="w-5 h-5 text-primary-dark" />
                    หน้าแรก (Hero Section)
                </h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">หัวข้อหลัก (Main Title)</label>
                        <textarea
                            value={settings.heroTitle || ''}
                            onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none h-20 resize-none font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">หัวข้อย่อย (Subtitle)</label>
                        <textarea
                            value={settings.heroSubtitle || ''}
                            onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none h-24 resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">ข้อความปุ่ม (Button Text)</label>
                        <div className="relative">
                            <MousePointer2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                value={settings.heroCtaText || ''}
                                onChange={(e) => setSettings({ ...settings, heroCtaText: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary/40 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Preview Card */}
                <div className="mt-8 p-6 bg-surface rounded-2xl border border-border">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 text-center">ตัวอย่างการแสดงผล</p>
                    <div className="text-center max-w-md mx-auto">
                        <h1 className="text-2xl font-bold mb-2">{settings.heroTitle}</h1>
                        <p className="text-sm text-text-secondary mb-4">{settings.heroSubtitle}</p>
                        <div className="inline-block px-6 py-2 bg-primary text-text-primary rounded-xl font-bold text-sm shadow-sm">
                            {settings.heroCtaText}
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
