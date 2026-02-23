'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import { useSiteData } from '@/components/SiteDataProvider';
import type { CourseCategory, Subject } from '@/types';

const categoryFilters: CourseCategory[] = ['A-Level', 'TGAT', 'ม.ต้น', 'ม.ปลาย'];
const subjectFilters: Subject[] = ['คณิตศาสตร์', 'ฟิสิกส์', 'เคมี', 'ชีววิทยา', 'ภาษาอังกฤษ', 'ภาษาไทย'];

export default function CoursesPage() {
    const { data } = useSiteData();
    const { courses = [] } = data;

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CourseCategory | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const filtered = courses.filter((c) => {
        const matchSearch = c.title.includes(search) || c.tutorName.includes(search) || c.description.includes(search);
        const matchCat = !selectedCategory || c.category === selectedCategory;
        const matchSub = !selectedSubject || c.subject === selectedSubject;
        return matchSearch && matchCat && matchSub;
    });

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedSubject(null);
        setSearch('');
    };

    const hasFilters = selectedCategory || selectedSubject || search;

    const FilterSidebar = () => (
        <div className="space-y-6">
            {/* Search */}
            <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">ค้นหา</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="ค้นหาคอร์ส..."
                        className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">ระดับชั้น</label>
                <div className="space-y-1.5">
                    {categoryFilters.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${selectedCategory === cat
                                ? 'bg-primary/15 text-primary-dark font-medium'
                                : 'text-text-secondary hover:bg-surface-dark'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Subject */}
            <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">วิชา</label>
                <div className="space-y-1.5">
                    {subjectFilters.map((sub) => (
                        <button
                            key={sub}
                            onClick={() => setSelectedSubject(selectedSubject === sub ? null : sub)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${selectedSubject === sub
                                ? 'bg-primary/15 text-primary-dark font-medium'
                                : 'text-text-secondary hover:bg-surface-dark'
                                }`}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </div>

            {hasFilters && (
                <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-sm text-danger hover:bg-danger/5 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                    ล้างตัวกรอง
                </button>
            )}
        </div>
    );

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <ScrollReveal>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-text-primary mb-2">คอร์สเรียนทั้งหมด</h1>
                        <p className="text-text-secondary">
                            เลือกคอร์สที่เหมาะกับคุณจากคอร์สทั้งหมด {courses.length} คอร์ส
                        </p>
                    </div>
                </ScrollReveal>

                {/* Mobile filter toggle */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setShowMobileFilter(!showMobileFilter)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-dark transition-all"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        ตัวกรอง
                        {hasFilters && (
                            <span className="w-5 h-5 bg-primary text-text-primary text-xs rounded-full flex items-center justify-center">
                                !
                            </span>
                        )}
                    </button>
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24 bg-white rounded-2xl border border-border p-5">
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* Mobile Filter Drawer */}
                    {showMobileFilter && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="absolute inset-0 bg-black/30" onClick={() => setShowMobileFilter(false)} />
                            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-semibold text-lg">ตัวกรอง</h3>
                                    <button onClick={() => setShowMobileFilter(false)}>
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <FilterSidebar />
                            </div>
                        </div>
                    )}

                    {/* Course Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-text-secondary">
                                แสดง {filtered.length} จาก {courses.length} คอร์ส
                            </p>
                        </div>

                        {filtered.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filtered.map((course, i) => (
                                    <CourseCard key={course.id} course={course} index={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
                                <p className="text-text-secondary font-medium">ไม่พบคอร์สที่ตรงกับตัวกรอง</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-3 text-sm text-primary-dark hover:underline"
                                >
                                    ล้างตัวกรอง
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
