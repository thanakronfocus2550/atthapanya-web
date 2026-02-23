'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Palette, HelpCircle, Save, Globe, Bell } from 'lucide-react';
import { useSiteData } from '@/components/SiteDataProvider';
import { cn } from '@/lib/utils';
import BrandingForm from '@/app/admin/settings/BrandingForm';
import FAQManager from '@/app/admin/settings/FAQManager';
import SEOSocialForm from '@/app/admin/settings/SEOSocialForm';
import HeroEditor from '@/app/admin/settings/HeroEditor';
import PopupManager from '@/app/admin/settings/PopupManager';

import PageTransition from '@/components/PageTransition';

type Tab = 'branding' | 'faq' | 'social' | 'hero' | 'popup';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('branding');
    const { updateSettings, updateFAQs } = useSiteData();

    const tabs = [
        { id: 'branding' as Tab, label: 'แบรนด์และธีม', icon: Palette },
        { id: 'hero' as Tab, label: 'หน้าต่างต้อนรับ', icon: Settings },
        { id: 'popup' as Tab, label: 'หน้าต่างประกาศ', icon: Bell },
        { id: 'social' as Tab, label: 'SEO & โซเชียล', icon: Globe },
        { id: 'faq' as Tab, label: 'คำถาม (FAQ)', icon: HelpCircle },
    ];

    return (
        <PageTransition>
            <div className="max-w-5xl mx-auto space-y-10">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary-dark shadow-inner border border-primary/20">
                        <Settings className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-text-primary mb-1">ตั้งค่าเว็บไซต์</h1>
                        <p className="text-text-secondary text-sm font-medium">จัดการข้อมูลพื้นฐาน อัตลักษณ์ของแบรนด์ และการตั้งค่าระบบ</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-surface-dark rounded-[24px] border border-border w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all",
                                activeTab === tab.id
                                    ? "bg-white text-text-primary shadow-lg shadow-black/5 ring-1 ring-border"
                                    : "text-text-muted hover:text-text-secondary hover:bg-white/50"
                            )}
                        >
                            <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-primary" : "text-text-muted")} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-[32px] border border-border shadow-sm overflow-hidden">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="p-10"
                    >
                        {activeTab === 'branding' && <BrandingForm />}
                        {activeTab === 'hero' && <HeroEditor />}
                        {activeTab === 'social' && <SEOSocialForm />}
                        {activeTab === 'faq' && <FAQManager />}
                        {activeTab === 'popup' && <PopupManager />}
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}
