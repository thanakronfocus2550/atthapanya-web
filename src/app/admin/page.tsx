'use client';

import { motion } from 'framer-motion';
import { DollarSign, Users, BookOpen, TrendingUp, ArrowUpRight } from 'lucide-react';
import { payments, courses, users, monthlyRevenue } from '@/lib/data';
import { formatPrice, formatDate, cn } from '@/lib/utils';

const stats = [
    {
        label: 'รายได้ทั้งหมด',
        value: formatPrice(monthlyRevenue.reduce((a, b) => a + b.revenue, 0)),
        icon: DollarSign,
        change: '+12%',
        color: 'bg-green-50 text-success',
    },
    {
        label: 'นักเรียนทั้งหมด',
        value: users.filter((u) => u.role === 'STUDENT').length.toString(),
        icon: Users,
        change: '+5',
        color: 'bg-blue-50 text-blue-500',
    },
    {
        label: 'คอร์สทั้งหมด',
        value: courses.length.toString(),
        icon: BookOpen,
        change: '+2',
        color: 'bg-purple-50 text-purple-500',
    },
    {
        label: 'รายได้เดือนนี้',
        value: formatPrice(monthlyRevenue[monthlyRevenue.length - 1].revenue),
        icon: TrendingUp,
        change: '+8%',
        color: 'bg-orange-50 text-orange-500',
    },
];

export default function AdminDashboard() {
    const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-black text-text-primary mb-2">ภาพรวมระบบ</h1>
                <p className="text-text-secondary text-sm">ข้อมูลสรุปผลการดำเนินงานของสถาบันอรรถปัญญา</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-[24px] border border-border p-6 shadow-sm hover:shadow-md transition-all group cursor-default"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] font-bold text-success flex items-center gap-1 px-2 py-1 bg-success/10 rounded-full">
                                {stat.change}
                                <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                        <p className="text-2xl font-black text-text-primary tracking-tight">{stat.value}</p>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="xl:col-span-2 bg-white rounded-[32px] border border-border p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="font-bold text-lg text-text-primary">สถิติรายได้</h3>
                            <p className="text-xs text-text-muted mt-1">เปรียบเทียบรายได้รายเดือนในปีปัจจุบัน</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-dark rounded-lg text-[10px] font-bold text-text-muted">
                            <span className="w-2 h-2 bg-primary rounded-full" />
                            Revenue 2024
                        </div>
                    </div>

                    <div className="flex items-end gap-3 h-64 px-2">
                        {monthlyRevenue.map((m, i) => (
                            <div key={m.month} className="flex-1 flex flex-col items-center gap-4 h-full group">
                                <div className="flex-1 w-full bg-surface-dark rounded-xl relative overflow-hidden flex flex-col justify-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.05, ease: "circOut" }}
                                        className="w-full bg-gradient-to-t from-primary-dark via-primary to-primary-light rounded-t-lg relative group-hover:brightness-110 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]"
                                    >
                                        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
                                    </motion.div>

                                    {/* Tooltip */}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-text-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-xl pointer-events-none z-10">
                                        {formatPrice(m.revenue)}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-t-text-primary border-l-transparent border-r-transparent" />
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-text-muted group-hover:text-text-primary transition-colors">{m.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-white rounded-[32px] border border-border p-8 shadow-sm">
                    <h3 className="font-bold text-lg text-text-primary mb-6">ธุรกรรมล่าสุด</h3>
                    <div className="space-y-4">
                        {payments.slice(0, 6).map((p) => (
                            <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-dark transition-colors border border-transparent hover:border-border group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary-dark group-hover:scale-110 transition-transform">
                                        {p.userName[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-primary leading-none mb-1">{p.userName}</p>
                                        <p className="text-[11px] text-text-muted truncate max-w-[120px]">{p.courseTitle}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-text-primary mb-1">{formatPrice(p.amount)}</p>
                                    <span
                                        className={cn(
                                            "text-[10px] font-black uppercase px-2 py-0.5 rounded-md",
                                            p.status === 'SUCCESS'
                                                ? 'bg-success/10 text-success'
                                                : p.status === 'PENDING'
                                                    ? 'bg-warning/10 text-warning'
                                                    : 'bg-danger/10 text-danger'
                                        )}
                                    >
                                        {p.status === 'SUCCESS' ? 'สำเร็จ' : p.status === 'PENDING' ? 'รอตรวจ' : 'ปฏิเสธ'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
