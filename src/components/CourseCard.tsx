'use client';

import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import type { Course } from '@/types';
import { Clock, Users, Star, BookOpen, Calculator, Atom, FlaskConical, Dna, Globe, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

// Subject-specific gradient + icon mapping
const subjectStyles: Record<string, { gradient: string; icon: React.ElementType }> = {
    'คณิตศาสตร์': { gradient: 'from-blue-500 to-indigo-600', icon: Calculator },
    'ฟิสิกส์': { gradient: 'from-purple-500 to-violet-600', icon: Atom },
    'เคมี': { gradient: 'from-emerald-500 to-teal-600', icon: FlaskConical },
    'ชีววิทยา': { gradient: 'from-green-500 to-lime-600', icon: Dna },
    'ภาษาอังกฤษ': { gradient: 'from-orange-400 to-red-500', icon: Globe },
    'ตรรกศาสตร์': { gradient: 'from-pink-500 to-rose-600', icon: Brain },
};

const defaultStyle = { gradient: 'from-primary to-primary-dark', icon: BookOpen };

interface CourseCardProps {
    course: Course;
    index?: number;
}

export default function CourseCard({ course, index = 0 }: CourseCardProps) {
    const style = subjectStyles[course.subject] || defaultStyle;
    const Icon = style.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
        >
            <Link href={`/courses/${course.id}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                    {/* Thumbnail */}
                    <div className={`relative h-44 overflow-hidden ${!course.thumbnail ? `bg-gradient-to-br ${style.gradient}` : ''}`}>
                        {course.thumbnail ? (
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <>
                                {/* Decorative circles */}
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <Icon className="w-20 h-20 text-white/25" />
                                </div>
                                {/* Subject icon */}
                                <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </>
                        )}
                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-full">
                                {course.category}
                            </span>
                        </div>
                        {/* Rating */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Star className="w-3.5 h-3.5 text-primary-dark fill-primary-dark" />
                            <span className="text-xs font-medium">{course.rating}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        <p className="text-xs text-text-secondary mb-1">{course.subject}</p>
                        <h3 className="font-semibold text-text-primary group-hover:text-primary-dark transition-colors line-clamp-2 leading-snug mb-3">
                            {course.title}
                        </h3>
                        <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                            {course.description}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {course.totalHours} ชม.
                            </span>
                            <span className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5" />
                                {course.totalLessons} บท
                            </span>
                            <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {course.enrolledCount}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                            <p className="text-xs text-text-secondary">{course.tutorName}</p>
                            <p className="text-lg font-bold text-primary-dark">
                                {formatPrice(course.price)}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
