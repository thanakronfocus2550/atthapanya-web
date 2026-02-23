'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ChevronLeft, Play, Lock, CheckCircle,
    BookOpen, Clock, Menu, X, ArrowLeft,
    CheckCircle2, Download, FileText, MessageSquare, Send, Award, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteData } from '@/components/SiteDataProvider';
import VideoPlayer from '@/components/VideoPlayer';
import PageTransition from '@/components/PageTransition';
import { cn } from '@/lib/utils';
import CertificateView from '@/components/CertificateView';

export default function ClassroomPage() {
    const { courseId } = useParams();
    const router = useRouter();
    const { data, updateLessonProgress, addQuestion } = useSiteData();
    const { courses = [], lessons = [], userProgress = [] } = data;

    const course = courses.find(c => c.id === courseId);
    const courseLessons = lessons
        .filter(l => l.courseId === courseId)
        .sort((a, b) => a.orderIndex - b.orderIndex);

    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [sidebarTab, setSidebarTab] = useState<'content' | 'qa'>('content');
    const [newQuestion, setNewQuestion] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);

    const { claimCertificate } = useSiteData();

    const getLessonStatus = (lessonId: string) => {
        const prog = userProgress.find((p) => p.lessonId === lessonId);
        return prog?.status || 'NOT_STARTED';
    };

    useEffect(() => {
        if (courseLessons.length > 0 && !activeLessonId) {
            // Check for lessonId in URL
            const urlParams = new URLSearchParams(window.location.search);
            const lessonIdParam = urlParams.get('lessonId');

            if (lessonIdParam && courseLessons.some(l => l.id === lessonIdParam)) {
                setActiveLessonId(lessonIdParam);
            } else {
                setActiveLessonId(courseLessons[0].id);
            }
        }
    }, [courseLessons, activeLessonId]);

    useEffect(() => {
        if (activeLessonId) {
            updateLessonProgress({
                id: Date.now().toString(),
                userId: 'u1',
                lessonId: activeLessonId,
                courseId: courseId as string,
                status: 'WATCHING',
                lastWatchedSecond: 0
            });
        }
    }, [activeLessonId, courseId]);

    const progressPercent = courseLessons.length > 0
        ? Math.round((courseLessons.filter(l => getLessonStatus(l.id) === 'COMPLETED').length / courseLessons.length) * 100)
        : 0;

    useEffect(() => {
        if (progressPercent === 100) {
            // Only show if not already shown in this session
            const hasCelebrated = sessionStorage.getItem(`celebrated_${courseId}`);
            if (!hasCelebrated) {
                setShowCelebration(true);
                sessionStorage.setItem(`celebrated_${courseId}`, 'true');
            }
        }
    }, [progressPercent, courseId]);

    const handleClaimCertificate = () => {
        const cert = {
            id: `cert_${Date.now()}`,
            courseId: courseId as string,
            courseTitle: course!.title,
            studentName: 'ธนภัทร ศรีสวัสดิ์', // In real app, from user profile
            issuedAt: new Date().toISOString(),
            verificationCode: Math.random().toString(36).substring(2, 10).toUpperCase()
        };
        claimCertificate(cert);
        setShowCelebration(false);
        setShowCertificate(true);
    };

    const activeLesson = courseLessons.find(l => l.id === activeLessonId);

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">ไม่พบคอร์สเรียน</h1>
                <Link href="/courses" className="text-primary-dark hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    กลับไปหน้ารวมคอร์ส
                </Link>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-surface-dark">
                    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto">
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-white rounded-xl transition-colors text-text-secondary"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <div className="flex-1">
                                <h1 className="text-lg md:text-xl font-bold text-text-primary line-clamp-1">{course.title}</h1>
                                <p className="text-sm text-text-secondary hidden md:block">บทเรียนที่ {activeLesson?.orderIndex || 1}: {activeLesson?.title}</p>
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-border"
                            >
                                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="mb-8">
                            {activeLesson ? (
                                <VideoPlayer url={activeLesson.videoUrl} />
                            ) : (
                                <div className="aspect-video bg-black rounded-2xl flex items-center justify-center text-white">
                                    <p>ยังไม่มีบทเรียนในคอร์สนี้</p>
                                </div>
                            )}
                        </div>

                        {activeLesson && (
                            <div className="bg-white rounded-2xl p-6 md:p-8 border border-border shadow-sm">
                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <span className="px-3 py-1 bg-primary/10 text-primary-dark text-xs font-bold rounded-full uppercase tracking-wider">
                                        กำลังเล่นอยู่
                                    </span>
                                    {getLessonStatus(activeLesson.id) === 'COMPLETED' ? (
                                        <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                            เรียนจบแล้ว
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => updateLessonProgress({
                                                id: Date.now().toString(),
                                                userId: 'u1',
                                                lessonId: activeLesson.id,
                                                courseId: courseId as string,
                                                status: 'COMPLETED',
                                                lastWatchedSecond: 0
                                            })}
                                            className="text-xs font-bold text-primary-dark hover:underline"
                                        >
                                            ทำเครื่องหมายว่าเรียนจบแล้ว
                                        </button>
                                    )}
                                    <div className="flex items-center gap-1.5 text-sm text-text-muted">
                                        <Clock className="w-4 h-4" />
                                        {activeLesson.duration} นาที
                                    </div>
                                    {activeLesson.resourceUrl && (
                                        <a
                                            href={activeLesson.resourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-sm text-primary-dark font-bold hover:underline"
                                        >
                                            <Download className="w-4 h-4" />
                                            ดาวน์โหลดเอกสาร
                                        </a>
                                    )}
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">{activeLesson.title}</h2>
                                {activeLesson.description && (
                                    <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                                        {activeLesson.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </main>

                {/* Sidebar */}
                <AnimatePresence mode="wait">
                    {isSidebarOpen && (
                        <motion.aside
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            className={cn(
                                "fixed inset-y-16 lg:inset-y-0 right-0 z-40 w-80 bg-white border-l border-border flex flex-col shadow-2xl lg:shadow-none lg:static lg:h-full",
                                !isSidebarOpen && "hidden"
                            )}
                        >
                            <div className="border-b border-border">
                                <div className="flex p-2 gap-1 bg-surface-dark m-3 rounded-xl">
                                    <button
                                        onClick={() => setSidebarTab('content')}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-bold transition-all",
                                            sidebarTab === 'content'
                                                ? "bg-white text-primary-dark shadow-sm"
                                                : "text-text-secondary hover:text-text-primary"
                                        )}
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        เนื้อหา
                                    </button>
                                    <button
                                        onClick={() => setSidebarTab('qa')}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-bold transition-all",
                                            sidebarTab === 'qa'
                                                ? "bg-white text-primary-dark shadow-sm"
                                                : "text-text-secondary hover:text-text-primary"
                                        )}
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        ถาม-ตอบ
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {sidebarTab === 'content' ? (
                                    <div className="p-3 space-y-1">
                                        <div className="px-4 py-2 mb-2">
                                            <h3 className="font-bold text-text-primary text-sm">เนื้อหาบทเรียน</h3>
                                            <p className="text-xs text-text-muted mt-0.5">{courseLessons.length} บทเรียน</p>
                                        </div>
                                        {courseLessons.map((lesson) => {
                                            const isActive = lesson.id === activeLessonId;
                                            const status = getLessonStatus(lesson.id);
                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => {
                                                        setActiveLessonId(lesson.id);
                                                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full flex gap-3 p-4 rounded-xl transition-all text-left group",
                                                        isActive
                                                            ? "bg-primary text-text-primary shadow-sm"
                                                            : "hover:bg-surface text-text-secondary"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs border transition-colors",
                                                        isActive
                                                            ? "bg-white/20 border-white/30 text-text-primary"
                                                            : status === 'COMPLETED'
                                                                ? "bg-green-50 border-green-200 text-green-600"
                                                                : "bg-surface-dark border-border text-text-muted group-hover:border-primary/30"
                                                    )}>
                                                        {status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> : lesson.orderIndex}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-text-primary group-hover:text-primary-dark transition-colors truncate">
                                                            {lesson.title}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-[10px] text-text-muted flex items-center gap-1">
                                                                <Clock className="w-2.5 h-2.5" />
                                                                {lesson.duration} นาที
                                                            </span>
                                                            {lesson.videoUrl ? (
                                                                <span className="text-[10px] text-text-muted flex items-center gap-1">
                                                                    <Play className="w-2.5 h-2.5" />
                                                                    วิดีโอ
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] text-text-muted flex items-center gap-1">
                                                                    <Lock className="w-2.5 h-2.5" />
                                                                    จำกัด
                                                                </span>
                                                            )}
                                                            {lesson.resourceUrl && (
                                                                <div className="text-[8px] bg-primary-dark/10 text-primary-dark px-1 rounded font-bold">PDF</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                        {courseLessons.length === 0 && (
                                            <div className="text-center py-10 opacity-50">
                                                <p className="text-sm italic">ไม่มีเนื้อหา</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-5 flex flex-col h-full">
                                        <div className="mb-6">
                                            <h3 className="font-bold text-text-primary mb-2 text-sm">ถามอาจารย์เกี่ยวกับบทเรียนนี้</h3>
                                            <div className="relative">
                                                <textarea
                                                    value={newQuestion}
                                                    onChange={(e) => setNewQuestion(e.target.value)}
                                                    placeholder="พิมพ์คำถามของคุณที่นี่..."
                                                    className="w-full bg-surface-dark border-border rounded-xl p-4 text-sm resize-none h-32 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12"
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (!newQuestion.trim()) return;
                                                        addQuestion({
                                                            id: Date.now().toString(),
                                                            lessonId: activeLessonId!,
                                                            courseId: courseId as string,
                                                            userId: 'u1',
                                                            userName: 'นายธนภัทร ศรีสวัสดิ์',
                                                            content: newQuestion,
                                                            answers: [],
                                                            createdAt: new Date().toISOString()
                                                        });
                                                        setNewQuestion('');
                                                    }}
                                                    className="absolute bottom-3 right-3 p-2 bg-primary text-text-primary rounded-lg shadow-sm hover:scale-105 transition-transform"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto pr-1">
                                            <div className="space-y-8 pb-20">
                                                {data.questions
                                                    .filter(q => q.lessonId === activeLessonId)
                                                    .map((q) => (
                                                        <div key={q.id} className="space-y-4">
                                                            {/* Student Question Bubble */}
                                                            <div className="flex flex-col items-start max-w-[90%]">
                                                                <div className="flex items-center gap-2 mb-1.5 ml-1">
                                                                    <div className="w-5 h-5 bg-primary/20 text-primary-dark rounded-full flex items-center justify-center text-[10px] font-bold">
                                                                        {q.userName[0]}
                                                                    </div>
                                                                    <span className="text-[10px] font-bold text-text-secondary">{q.userName}</span>
                                                                    <span className="text-[9px] text-text-muted">
                                                                        {new Date(q.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                <div className="bg-white border border-border rounded-2xl rounded-tl-none p-4 shadow-sm text-sm text-text-primary leading-relaxed">
                                                                    {q.content}
                                                                </div>
                                                            </div>

                                                            {/* Tutor Answers Bubble */}
                                                            {q.answers && q.answers.map((a) => (
                                                                <div key={a.id} className="flex flex-col items-end max-w-[95%] ml-auto">
                                                                    <div className="flex items-center gap-2 mb-1.5 mr-1">
                                                                        <span className="text-[9px] text-text-muted">
                                                                            {new Date(a.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                                                        </span>
                                                                        <span className="text-[10px] font-bold text-primary-dark flex items-center gap-1">
                                                                            {a.userName}
                                                                            <ShieldCheck className="w-3 h-3" />
                                                                        </span>
                                                                        <div className="w-5 h-5 bg-primary-dark text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                                                                            {a.userName[0]}
                                                                        </div>
                                                                    </div>
                                                                    <div className="bg-primary/5 border border-primary/20 rounded-2xl rounded-tr-none p-4 shadow-sm text-sm text-text-primary leading-relaxed relative group">
                                                                        <div className="absolute -top-2 -left-2 bg-primary text-[8px] font-black px-1.5 rounded uppercase tracking-tighter">Verified Tutor</div>
                                                                        {a.content}
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {(!q.answers || q.answers.length === 0) && (
                                                                <div className="flex items-center gap-2 text-[10px] text-text-muted italic ml-3">
                                                                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                                                                    รออาจารย์มาพบคำตอบจากคำถามของคุณ...
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}

                                                {data.questions.filter(q => q.lessonId === activeLessonId).length === 0 && (
                                                    <div className="text-center py-10 opacity-50 flex flex-col items-center gap-3">
                                                        <MessageSquare className="w-10 h-10 text-text-muted" />
                                                        <p className="text-sm italic">ยังไม่มีคำถามในบทนี้</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>

            {/* Completion Celebration Overlay */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <Confetti />
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[40px] p-10 max-w-lg w-full text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-primary-dark to-primary" />

                            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 scale-110">
                                <Award className="w-12 h-12 text-primary-dark" />
                            </div>

                            <h2 className="text-3xl font-black text-text-primary mb-2">ยินดีด้วย! คุณเก่งมาก 🎉</h2>
                            <p className="text-text-secondary mb-8">
                                คุณเรียนจบหลักสูตร <span className="font-bold text-primary-dark">{course.title}</span> ครบ 100% แล้ว! เราภูมิใจในความพยายามของคุณ
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleClaimCertificate}
                                    className="w-full py-4 bg-primary text-text-primary font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-lg"
                                >
                                    รับเกียรติบัตรของคุณ 🎓
                                </button>
                                <button
                                    onClick={() => setShowCelebration(false)}
                                    className="w-full py-3 text-text-muted font-bold hover:text-text-primary transition-colors"
                                >
                                    ไว้ทีหลัง
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {showCertificate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto"
                    >
                        <div className="max-w-4xl w-full my-8">
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setShowCertificate(false)}
                                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <CertificateView
                                certificate={data.userStats.certificates!.find(c => c.courseId === courseId)!}
                                onClose={() => setShowCertificate(false)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition >
    );
}

function Confetti() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[101]">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        top: "100%",
                        left: `${Math.random() * 100}%`,
                        scale: Math.random() * 0.5 + 0.5,
                        rotate: 0,
                        opacity: 1
                    }}
                    animate={{
                        top: "-10%",
                        left: `${Math.random() * 100}%`,
                        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                        opacity: [1, 1, 0]
                    }}
                    transition={{
                        duration: Math.random() * 2 + 2,
                        ease: "easeOut",
                        repeat: Infinity,
                        delay: Math.random() * 5
                    }}
                    className={cn(
                        "absolute w-4 h-4 rounded-sm",
                        ["bg-primary", "bg-primary-dark", "bg-yellow-200", "bg-orange-400"][Math.floor(Math.random() * 4)]
                    )}
                />
            ))}
        </div>
    );
}
