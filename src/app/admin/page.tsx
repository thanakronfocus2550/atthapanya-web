'use client';

import { motion } from 'framer-motion';
import { DollarSign, Users, BookOpen, TrendingUp, ArrowUpRight } from 'lucide-react';
import { payments, courses, users, monthlyRevenue } from '@/lib/data';
import { formatPrice, formatDate } from '@/lib/utils';

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
        <div>
            <h1 className="text-2xl font-bold text-text-primary mb-6">ภาพรวม</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-2xl border border-border p-5"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-success flex items-center gap-0.5">
                                {stat.change}
                                <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                        <p className="text-sm text-text-secondary mt-0.5">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-border p-6">
                    <h3 className="font-semibold text-text-primary mb-6">รายได้รายเดือน</h3>
                    <div className="flex items-end gap-2 h-56">
                        {monthlyRevenue.map((m, i) => (
                            <motion.div
                                key={m.month}
                                initial={{ height: 0 }}
                                animate={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                                transition={{ duration: 0.6, delay: i * 0.05 }}
                                className="flex-1 bg-gradient-to-t from-primary to-primary-light rounded-t-lg relative group cursor-pointer"
                            >
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-text-primary text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {formatPrice(m.revenue)}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                        {monthlyRevenue.map((m) => (
                            <div key={m.month} className="flex-1 text-center text-xs text-text-muted">
                                {m.month}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-white rounded-2xl border border-border p-6">
                    <h3 className="font-semibold text-text-primary mb-4">รายการชำระเงินล่าสุด</h3>
                    <div className="space-y-3">
                        {payments.slice(0, 5).map((p) => (
                            <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-text-primary">{p.userName}</p>
                                    <p className="text-xs text-text-muted">{p.courseTitle}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-text-primary">{formatPrice(p.amount)}</p>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'SUCCESS'
                                                ? 'bg-green-50 text-success'
                                                : p.status === 'PENDING'
                                                    ? 'bg-yellow-50 text-warning'
                                                    : 'bg-red-50 text-danger'
                                            }`}
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
