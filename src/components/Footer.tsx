'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Facebook, MessageCircle, Instagram } from 'lucide-react';
import Logo from '@/components/Logo';
import { useSiteData } from '@/components/SiteDataProvider';

export default function Footer() {
    const pathname = usePathname();
    const { data } = useSiteData();
    const { settings } = data;

    // Don't render on admin pages
    if (pathname.startsWith('/admin')) return null;

    return (
        <footer className="bg-text-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2.5 mb-4">
                            <Logo size={36} src={settings.logo} />
                            <span className="font-bold text-lg">{settings.siteName}</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            สถาบันกวดวิชาชั้นนำ มุ่งเน้นพัฒนาศักยภาพผู้เรียน
                            สู่ความสำเร็จในการสอบเข้ามหาวิทยาลัย
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-2">
                            {settings.facebookUrl && (
                                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary/20 flex items-center justify-center transition-colors">
                                    <Facebook className="w-4 h-4 text-gray-400" />
                                </a>
                            )}
                            {settings.lineId && (
                                <a href={`https://line.me/ti/p/~${settings.lineId}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary/20 flex items-center justify-center transition-colors">
                                    <MessageCircle className="w-4 h-4 text-gray-400" />
                                </a>
                            )}
                            {settings.instagramUrl && (
                                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary/20 flex items-center justify-center transition-colors">
                                    <Instagram className="w-4 h-4 text-gray-400" />
                                </a>
                            )}
                            <a href={`mailto:${settings.email}`} className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary/20 flex items-center justify-center transition-colors">
                                <Mail className="w-4 h-4 text-gray-400" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-primary">ลิงก์ด่วน</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white transition-colors">หน้าแรก</Link></li>
                            <li><Link href="/courses" className="hover:text-white transition-colors">คอร์สเรียน</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">เกี่ยวกับเรา</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">ติดต่อเรา</Link></li>
                            <li><Link href="/login" className="hover:text-white transition-colors">เข้าสู่ระบบ</Link></li>
                        </ul>
                    </div>

                    {/* Courses */}
                    <div>
                        <h4 className="font-semibold mb-4 text-primary">หมวดหมู่คอร์ส</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/courses" className="hover:text-white transition-colors">A-Level</Link></li>
                            <li><Link href="/courses" className="hover:text-white transition-colors">TGAT</Link></li>
                            <li><Link href="/courses" className="hover:text-white transition-colors">ม.ต้น</Link></li>
                            <li><Link href="/courses" className="hover:text-white transition-colors">ม.ปลาย</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4 text-primary">ติดต่อเรา</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                {settings.phone}
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                {settings.email}
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                123 ถ.รัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} {settings.siteName} สงวนลิขสิทธิ์
                </div>
            </div>
        </footer>
    );
}
