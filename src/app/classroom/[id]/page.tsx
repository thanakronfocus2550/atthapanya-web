'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Play, Pause, SkipForward, SkipBack, Volume2, Maximize,
    CheckCircle, PlayCircle, Lock, ArrowLeft, BookOpen
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { courses, lessons, userProgress } from '@/lib/data';

export default function ClassroomPage() {
    const params = useParams();
    const course = courses.find((c) => c.id === params.id);
    const courseLessons = lessons.filter((l) => l.courseId === params.id);
    const [activeLesson, setActiveLesson] = useState(courseLessons[0] || null);
    const [isPlaying, setIsPlaying] = useState(false);

    if (!course || !activeLesson) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">ไม่พบคอร์ส</h2>
                    <Link href="/dashboard" className="text-primary-dark hover:underline">
                        กลับไปแดชบอร์ด
                    </Link>
                </div>
            </div>
        );
    }

    const getLessonStatus = (lessonId: string) => {
        const prog = userProgress.find((p) => p.lessonId === lessonId && p.userId === 'u1');
        return prog?.status || 'NOT_STARTED';
    };

    return (
        <PageTransition>
            {/* Top bar */}
            <div className="bg-text-primary text-white px-4 sm:px-6 py-3">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <p className="font-medium text-sm">{course.title}</p>
                            <p className="text-xs text-gray-400">{activeLesson.title}</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                        <BookOpen className="w-4 h-4" />
                        {courseLessons.indexOf(activeLesson) + 1}/{courseLessons.length} บทเรียน
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row">
                {/* Video Player - 75% */}
                <div className="lg:w-3/4">
                    <div className="relative bg-black aspect-video flex items-center justify-center">
                        {/* Video Placeholder */}
                        <div className="text-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-20 h-20 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors mb-4"
                            >
                                {isPlaying ? (
                                    <Pause className="w-8 h-8 text-white" />
                                ) : (
                                    <Play className="w-8 h-8 text-white ml-1" />
                                )}
                            </motion.button>
                            <p className="text-white/60 text-sm">วิดีโอบทเรียน (Mock)</p>
                        </div>

                        {/* Controls Bar */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            {/* Progress bar */}
                            <div className="h-1 bg-white/20 rounded-full mb-3 cursor-pointer group">
                                <div className="h-full w-1/3 bg-primary rounded-full relative">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                    </button>
                                    <button className="hover:text-primary transition-colors">
                                        <SkipBack className="w-4 h-4" />
                                    </button>
                                    <button className="hover:text-primary transition-colors">
                                        <SkipForward className="w-4 h-4" />
                                    </button>
                                    <span className="text-xs text-white/70 ml-2">12:34 / {activeLesson.duration}:00</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="hover:text-primary transition-colors">
                                        <Volume2 className="w-4 h-4" />
                                    </button>
                                    <button className="hover:text-primary transition-colors">
                                        <Maximize className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lesson Description */}
                    <div className="p-6 bg-white border-b border-border">
                        <h2 className="text-xl font-bold text-text-primary mb-2">{activeLesson.title}</h2>
                        <p className="text-sm text-text-secondary">
                            ระยะเวลา: {activeLesson.duration} นาที • {course.tutorName}
                        </p>
                    </div>
                </div>

                {/* Lesson Sidebar - 25% */}
                <aside className="lg:w-1/4 bg-white border-l border-border overflow-y-auto lg:h-[calc(100vh-120px)]">
                    <div className="p-4 border-b border-border">
                        <h3 className="font-semibold text-text-primary text-sm">รายการบทเรียน</h3>
                        <p className="text-xs text-text-muted mt-0.5">{courseLessons.length} บทเรียน</p>
                    </div>
                    <div className="divide-y divide-border">
                        {courseLessons.map((lesson, i) => {
                            const status = getLessonStatus(lesson.id);
                            const isActive = activeLesson.id === lesson.id;
                            return (
                                <button
                                    key={lesson.id}
                                    onClick={() => setActiveLesson(lesson)}
                                    className={`w-full text-left p-4 hover:bg-surface/50 transition-colors ${isActive ? 'bg-primary/10 border-l-3 border-primary' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            {status === 'COMPLETED' ? (
                                                <CheckCircle className="w-5 h-5 text-success" />
                                            ) : status === 'WATCHING' ? (
                                                <PlayCircle className="w-5 h-5 text-primary-dark" />
                                            ) : (
                                                <Lock className="w-5 h-5 text-text-muted" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${isActive ? 'text-primary-dark' : 'text-text-primary'
                                                }`}>
                                                {i + 1}. {lesson.title}
                                            </p>
                                            <p className="text-xs text-text-muted mt-0.5">{lesson.duration} นาที</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>
            </div>
        </PageTransition>
    );
}
