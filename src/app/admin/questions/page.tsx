'use client';

import React, { useState } from 'react';
import { useSiteData } from '@/components/SiteDataProvider';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Search, Filter, CheckCircle2,
    Clock, Send, User, BookOpen, AlertCircle,
    ChevronRight, CornerDownRight
} from 'lucide-react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';

export default function AdminQuestionsPage() {
    const { data, addAnswer } = useSiteData();
    const { questions = [], courses = [] } = data;

    const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'ANSWERED'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    const filteredQuestions = questions.filter(q => {
        const matchesStatus =
            filterStatus === 'ALL' ||
            (filterStatus === 'PENDING' && (!q.answers || q.answers.length === 0)) ||
            (filterStatus === 'ANSWERED' && (q.answers && q.answers.length > 0));

        const questionCourse = courses.find(c => c.id === q.courseId);
        const matchesSearch =
            q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            questionCourse?.title.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    const selectedQuestion = filteredQuestions.find(q => q.id === selectedQuestionId);
    const selectedQuestionCourse = courses.find(c => c?.id === selectedQuestion?.courseId);

    const handleSendReply = () => {
        if (!selectedQuestionId || !replyContent.trim()) return;

        addAnswer({
            id: Date.now().toString(),
            questionId: selectedQuestionId,
            userId: 'admin-1',
            userName: 'อาจารย์อรรถปัญญา',
            role: 'ADMIN',
            content: replyContent,
            createdAt: new Date().toISOString()
        });

        setReplyContent('');
        // Optional: Close or show success
    };

    return (
        <PageTransition>
            <div className="p-4 md:p-8 max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-text-primary mb-1">จัดการคำถามจากนักเรียน</h1>
                        <p className="text-sm text-text-secondary">ตอบกลับข้อสงสัยขอนักเรียนเพื่อเสริมสร้างการเรียนรู้</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-white rounded-2xl border border-border p-1 flex shadow-sm">
                            <button
                                onClick={() => setFilterStatus('ALL')}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-bold rounded-xl transition-all",
                                    filterStatus === 'ALL' ? "bg-primary text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"
                                )}
                            >
                                ทั้งหมด
                            </button>
                            <button
                                onClick={() => setFilterStatus('PENDING')}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-bold rounded-xl transition-all",
                                    filterStatus === 'PENDING' ? "bg-red-500 text-white shadow-sm" : "text-text-muted hover:text-text-primary"
                                )}
                            >
                                รอคนตอบ ({questions.filter(q => !q.answers || q.answers.length === 0).length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('ANSWERED')}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-bold rounded-xl transition-all",
                                    filterStatus === 'ANSWERED' ? "bg-green-500 text-white shadow-sm" : "text-text-muted hover:text-text-primary"
                                )}
                            >
                                ตอบแล้ว
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-6">
                    {/* Questions List */}
                    <div className="w-full md:w-[400px] flex flex-col bg-white border border-border rounded-[32px] overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-border bg-surface-dark">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาตามคำถาม, ชื่อนักเรียน..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {filteredQuestions.length > 0 ? (
                                filteredQuestions.map((q) => {
                                    const course = courses.find(c => c.id === q.courseId);
                                    const isSelected = selectedQuestionId === q.id;
                                    const hasAnswers = q.answers && q.answers.length > 0;

                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => setSelectedQuestionId(q.id)}
                                            className={cn(
                                                "w-full text-left p-4 rounded-2xl transition-all group relative",
                                                isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-surface border border-transparent"
                                            )}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    hasAnswers ? "bg-green-500" : "bg-red-500 animate-pulse"
                                                )} />
                                                <span className="text-[10px] font-black text-primary-dark uppercase tracking-wider truncate flex-1">
                                                    {course?.title || 'Unknown Course'}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-text-primary line-clamp-1 mb-1 group-hover:text-primary-dark transition-colors">
                                                {q.content}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-text-muted font-medium flex items-center gap-1">
                                                    <User className="w-2.5 h-2.5" />
                                                    {q.userName}
                                                </span>
                                                <span className="text-[10px] text-text-muted">
                                                    {new Date(q.createdAt).toLocaleDateString('th-TH')}
                                                </span>
                                            </div>
                                            {isSelected && (
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                    <ChevronRight className="w-5 h-5 text-primary-dark" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Filter className="w-6 h-6 text-text-muted" />
                                    </div>
                                    <p className="text-sm font-bold text-text-muted">ไม่พบรายการที่ค้นหา</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat/Reply Area */}
                    <div className="flex-1 flex flex-col bg-white border border-border rounded-[32px] overflow-hidden shadow-sm relative">
                        {selectedQuestion ? (
                            <>
                                <div className="p-6 border-b border-border bg-surface-dark flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary-dark font-black text-xl">
                                            {selectedQuestion.userName[0]}
                                        </div>
                                        <div>
                                            <h2 className="font-black text-text-primary">{selectedQuestion.userName}</h2>
                                            <p className="text-xs text-text-secondary flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" />
                                                {selectedQuestionCourse?.title}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5",
                                        selectedQuestion.answers && selectedQuestion.answers.length > 0
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    )}>
                                        {selectedQuestion.answers && selectedQuestion.answers.length > 0 ? (
                                            <>
                                                <CheckCircle2 className="w-3 h-3" />
                                                ตอบแล้ว
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-3 h-3" />
                                                รอกำลังตอบ
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {/* The Student Question */}
                                    <div className="bg-surface-dark rounded-2xl p-6 border border-border relative">
                                        <span className="absolute -top-3 left-6 bg-white border border-border text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Student Query</span>
                                        <p className="text-text-primary leading-relaxed">{selectedQuestion.content}</p>
                                        <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center text-[10px] text-text-muted">
                                            <span>ส่งเมื่อ: {new Date(selectedQuestion.createdAt).toLocaleString('th-TH')}</span>
                                            <span className="bg-primary/10 text-primary-dark px-1.5 rounded font-bold">ID: #{selectedQuestion.id.slice(-4)}</span>
                                        </div>
                                    </div>

                                    {/* Previous Replies */}
                                    {selectedQuestion.answers?.map((a) => (
                                        <div key={a.id} className="flex gap-4">
                                            <div className="shrink-0 mt-2">
                                                <CornerDownRight className="w-5 h-5 text-text-muted" />
                                            </div>
                                            <div className="flex-1 bg-primary/5 border border-primary/20 rounded-2xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-black text-primary-dark flex items-center gap-1">
                                                        อาจารย์อรรถปัญญา (Official Reply)
                                                        <ShieldCheck className="w-3 h-3" />
                                                    </span>
                                                    <span className="text-[10px] text-text-muted">{new Date(a.createdAt).toLocaleString('th-TH')}</span>
                                                </div>
                                                <p className="text-sm text-text-primary leading-relaxed">{a.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 border-t border-border bg-surface-dark">
                                    <div className="relative">
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="พิมพ์คำแนะนำเพื่อช่วยให้นักเรียนเข้าใจมากขึ้น..."
                                            className="w-full bg-white border border-border rounded-2xl p-4 pr-16 text-sm resize-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all min-h-[100px]"
                                        />
                                        <button
                                            onClick={handleSendReply}
                                            disabled={!replyContent.trim()}
                                            className="absolute bottom-4 right-4 p-3 bg-primary text-text-primary rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:bg-surface disabled:text-text-muted"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6"
                                >
                                    <MessageSquare className="w-12 h-12 text-text-muted" />
                                </motion.div>
                                <h3 className="text-xl font-black text-text-primary mb-2">เลือกคำถามเพื่อดูรายละเอียด</h3>
                                <p className="text-text-secondary max-w-xs">คำตอบของคุณมีค่ามากสำหรับความสำเร็จของนักเรียน</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </PageTransition>
    );
}

function ShieldCheck({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={cn("w-4 h-4 text-primary-dark", className)}
        >
            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.961 4.054 10.97 9.531 12.334a.75.75 0 0 0 .438 0c5.477-1.364 9.531-6.373 9.531-12.334 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516 11.21 11.21 0 0 1-7.877-3.08Zm3.013 7.582a.75.75 0 0 0-1.06-1.06l-4.218 4.219-1.469-1.47a.75.75 0 1 0-1.06 1.061l2 2a.75.75 0 0 0 1.06 0l4.747-4.75Z" clipRule="evenodd" />
        </svg>
    );
}
