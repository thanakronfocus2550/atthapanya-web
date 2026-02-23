'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Course, FAQ, SiteSettings, HallOfFameEntry, ScheduleEntry, Lesson, Announcement, UserProgress, Tutor, Payment, Question, Answer, Coupon, UserStats, UserCertificate } from '@/types';
import {
    courses as initialCourses,
    hallOfFame as initialHallOfFame,
    schedule as initialSchedule,
    lessons as initialLessons
} from '@/lib/data';

interface SiteData {
    courses: Course[];
    faqs: FAQ[];
    settings: SiteSettings;
    hallOfFame: HallOfFameEntry[];
    schedule: ScheduleEntry[];
    lessons: Lesson[];
    announcements: Announcement[];
    enrolledCourseIds: string[];
    userProgress: UserProgress[];
    tutors: Tutor[];
    payments: Payment[];
    questions: Question[];
    coupons: Coupon[];
    userStats: UserStats;
}

interface SiteDataContextType {
    data: SiteData;
    updateCourses: (courses: Course[]) => void;
    updateSettings: (settings: SiteSettings) => void;
    updateFAQs: (faqs: FAQ[]) => void;
    updateHallOfFame: (entries: HallOfFameEntry[]) => void;
    updateSchedule: (entries: ScheduleEntry[]) => void;
    updateLessons: (lessons: Lesson[]) => void;
    updateAnnouncements: (announcements: Announcement[]) => void;
    updateTutors: (tutors: Tutor[]) => void;
    updatePayments: (payments: Payment[]) => void;
    enrollInCourse: (courseId: string) => void;
    updateLessonProgress: (progress: UserProgress) => void;
    addPayment: (payment: Payment) => void;
    processPayment: (paymentId: string, status: 'SUCCESS' | 'REJECTED') => void;
    addQuestion: (question: Question) => void;
    addAnswer: (answer: Answer) => void;
    updateCoupons: (coupons: Coupon[]) => void;
    claimCertificate: (certificate: UserCertificate) => void;
    isLoading: boolean;
}

const defaultSettings: SiteSettings = {
    siteName: 'อรรถปัญญา',
    primaryColor: '#FACC15',
    email: 'info@attapanya.com',
    phone: '081-234-5678',
    heroTitle: 'เรียนรู้อย่างชาญฉลาด พัฒนาศักยภาพสู่ความสำเร็จ',
    heroSubtitle: 'สถาบันกวดวิชาอรรถปัญญา ช่วยให้การสอบเข้ามหาวิทยาลัยเป็นเรื่องง่าย',
    heroCtaText: 'ดูคอร์สระเรียนทั้งหมด',
    metaTitle: 'สถาบันกวดวิชาอรรถปัญญา',
    metaDescription: 'สถาบันกวดวิชาชั้นนำ มุ่งเน้นพัฒนาศักยภาพผู้เรียนสู่ความสำเร็จ',
    showPopup: true,
    popupTitle: 'เปิดรับสมัครรอบใหม่! พร้อมโปรโมชั่นสุดพิเศษ',
    popupDescription: 'คอร์สออนไลน์ที่ออกแบบมาเพื่อคุณโดยเฉพาะ เตรียมตัวให้พร้อมสำหรับสนามสอบ A-Level และ TGAT',
    popupCtaText: 'เลือกคอร์สที่ใช่สำหรับคุณ',
    popupCtaUrl: '/courses',
    popupImages: [
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
        'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80'
    ],
};

const defaultStats: UserStats = {
    xp: 0,
    level: 1,
    streak: 0,
    totalStudyMinutes: 0,
    completedCoursesCount: 0,
    lastActivityDate: new Date().toISOString()
};

const defaultFAQs: FAQ[] = [
    {
        id: '1',
        question: 'สถาบันตั้งอยู่ที่ไหน?',
        answer: 'เรามีสาขาที่สยามสแควร์ และพญาไท เดินทางสะดวกด้วย BTS ครับ',
    },
    {
        id: '2',
        question: 'คอร์สเรียนมีอายุการใช้งานนานเท่าไหร่?',
        answer: 'ส่วนใหญ่จะมีอายุ 1 ปีหลังจากสมัครเรียนครับ สามารถดูซ้ำได้ไม่จำกัด',
    },
];

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<SiteData>({
        courses: initialCourses,
        faqs: defaultFAQs,
        settings: defaultSettings,
        hallOfFame: initialHallOfFame,
        schedule: initialSchedule,
        lessons: initialLessons || [],
        announcements: [],
        enrolledCourseIds: ['1', '2'], // Mock default enrollments for demo
        userProgress: [],
        tutors: [],
        payments: [],
        questions: [],
        coupons: [
            { id: 'c1', code: 'FIRST50', type: 'PERCENTAGE', value: 50, active: true },
            { id: 'c2', code: 'PROMO100', type: 'FIXED', value: 100, active: true }
        ],
        userStats: defaultStats,
    });
    const [isLoading, setIsLoading] = useState(true);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Load from localStorage
        const savedData = localStorage.getItem('site_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setData(prev => ({
                    ...prev,
                    ...parsed,
                    courses: parsed.courses || prev.courses,
                    faqs: parsed.faqs || prev.faqs,
                    hallOfFame: parsed.hallOfFame || prev.hallOfFame,
                    schedule: parsed.schedule || prev.schedule,
                    lessons: parsed.lessons || prev.lessons,
                    announcements: parsed.announcements || prev.announcements,
                    enrolledCourseIds: parsed.enrolledCourseIds || prev.enrolledCourseIds,
                    userProgress: parsed.userProgress || prev.userProgress,
                    tutors: parsed.tutors || prev.tutors || [],
                    payments: parsed.payments || prev.payments || [],
                    questions: parsed.questions || prev.questions || [],
                    coupons: parsed.coupons || prev.coupons || [],
                    settings: { ...prev.settings, ...(parsed.settings || {}) },
                    userStats: parsed.userStats || prev.userStats || defaultStats
                }));
            } catch (e) {
                console.error('Failed to parse site data:', e);
            }
        }
        setIsLoading(false);
    }, []);

    const trimData = (newData: SiteData): SiteData => {
        // Keep only last 15 payments to save space
        const trimmedPayments = newData.payments.slice(0, 15);
        // Keep only last 100 progress entries
        const trimmedProgress = newData.userProgress.slice(-100);
        // Keep only last 100 questions
        const trimmedQuestions = newData.questions.slice(-100);

        return {
            ...newData,
            payments: trimmedPayments,
            userProgress: trimmedProgress,
            questions: trimmedQuestions
        };
    };

    const saveData = (newData: SiteData) => {
        try {
            setData(newData);
            localStorage.setItem('site_data', JSON.stringify(newData));
        } catch (e) {
            console.error('Storage quota exceeded, trimming data...', e);
            // If it fails, try trimming the data first
            const trimmed = trimData(newData);
            setData(trimmed);
            try {
                localStorage.setItem('site_data', JSON.stringify(trimmed));
            } catch (retryError) {
                console.error('Even trimmed data exceeds quota. Emergency clear of non-essential data.', retryError);
                // Emergency: Clear all payments and questions and try again
                const minimal = { ...trimmed, payments: [], questions: [] };
                setData(minimal);
                localStorage.setItem('site_data', JSON.stringify(minimal));
            }
        }
    };

    const updateCourses = (courses: Course[]) => {
        saveData({ ...data, courses });
    };

    const updateSettings = (settings: SiteSettings) => {
        saveData({ ...data, settings });
    };

    const updateFAQs = (faqs: FAQ[]) => {
        saveData({ ...data, faqs });
    };

    const updateHallOfFame = (hallOfFame: HallOfFameEntry[]) => {
        saveData({ ...data, hallOfFame });
    };

    const updateSchedule = (schedule: ScheduleEntry[]) => {
        saveData({ ...data, schedule });
    };

    const updateLessons = (lessons: Lesson[]) => {
        saveData({ ...data, lessons });
    };

    const updateAnnouncements = (announcements: Announcement[]) => {
        saveData({ ...data, announcements });
    };

    const updateTutors = (tutors: Tutor[]) => {
        saveData({ ...data, tutors });
    };

    const updatePayments = (payments: Payment[]) => {
        saveData({ ...data, payments });
    };

    const enrollInCourse = (courseId: string) => {
        if (!data.enrolledCourseIds.includes(courseId)) {
            // In a real system, this would happen AFTER payment SUCCESS.
            // But for the cart flow, we might want to allow "Free" or immediate testing.
            // For Phase 9, we'll rely on processPayment to do the actual enrollment.
            saveData({
                ...data,
                enrolledCourseIds: [...data.enrolledCourseIds, courseId]
            });
        }
    };

    const addPayment = (payment: Payment) => {
        saveData({
            ...data,
            payments: [payment, ...data.payments]
        });
    };

    const processPayment = (paymentId: string, status: 'SUCCESS' | 'REJECTED') => {
        const payment = data.payments.find(p => p.id === paymentId);
        if (!payment) return;

        const updatedPayments = data.payments.map(p =>
            p.id === paymentId ? { ...p, status } : p
        );

        let updatedEnrolledCourseIds = [...data.enrolledCourseIds];
        if (status === 'SUCCESS' && !updatedEnrolledCourseIds.includes(payment.courseId)) {
            updatedEnrolledCourseIds.push(payment.courseId);
        }

        saveData({
            ...data,
            payments: updatedPayments,
            enrolledCourseIds: updatedEnrolledCourseIds
        });
    };

    const updateLessonProgress = (newProgress: UserProgress) => {
        const existingProgressIndex = data.userProgress.findIndex(
            p => p.lessonId === newProgress.lessonId && p.userId === newProgress.userId
        );

        let updatedProgress: UserProgress[];
        if (existingProgressIndex !== -1) {
            updatedProgress = [...data.userProgress];
            updatedProgress[existingProgressIndex] = {
                ...updatedProgress[existingProgressIndex],
                ...newProgress
            };
        } else {
            updatedProgress = [...data.userProgress, newProgress];
        }

        // Award XP if lesson is newly completed
        let xpGained = 0;
        if (newProgress.status === 'COMPLETED') {
            const alreadyCompleted = data.userProgress.some(
                p => p.lessonId === newProgress.lessonId && p.userId === newProgress.userId && p.status === 'COMPLETED'
            );
            if (!alreadyCompleted) {
                xpGained = 50; // Base XP for completing a lesson
            }
        }

        // Update User Stats (Streak & XP)
        let updatedStats = { ...data.userStats };
        if (xpGained > 0) {
            updatedStats.xp += xpGained;
            // Level up logic (every 500 XP)
            updatedStats.level = Math.floor(updatedStats.xp / 500) + 1;

            // Streak logic
            const today = new Date().toISOString().split('T')[0];
            const lastActivity = updatedStats.lastActivityDate?.split('T')[0];

            if (lastActivity !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastActivity === yesterdayStr) {
                    updatedStats.streak += 1;
                } else if (!lastActivity || lastActivity < yesterdayStr) {
                    updatedStats.streak = 1;
                }
                updatedStats.lastActivityDate = new Date().toISOString();
            }
        }

        saveData({
            ...data,
            userProgress: updatedProgress,
            userStats: updatedStats
        });
    };

    const addQuestion = (question: Question) => {
        saveData({
            ...data,
            questions: [question, ...data.questions]
        });
    };

    const addAnswer = (answer: Answer) => {
        const updatedQuestions = data.questions.map(q =>
            q.id === answer.questionId
                ? { ...q, answers: [...(q.answers || []), answer] }
                : q
        );
        saveData({ ...data, questions: updatedQuestions });
    };

    const updateCoupons = (coupons: Coupon[]) => {
        saveData({ ...data, coupons });
    };

    const claimCertificate = (certificate: UserCertificate) => {
        // If certificate already exists for this course, don't add again
        if (data.userStats.certificates?.some(c => c.courseId === certificate.courseId)) return;

        const updatedStats = {
            ...data.userStats,
            certificates: [...(data.userStats.certificates || []), certificate],
            completedCoursesCount: (data.userStats.completedCoursesCount || 0) + 1
        };

        saveData({ ...data, userStats: updatedStats });
    };

    return (
        <SiteDataContext.Provider value={{
            data,
            updateCourses,
            updateSettings,
            updateFAQs,
            updateHallOfFame,
            updateSchedule,
            updateLessons,
            updateAnnouncements,
            updateTutors,
            updatePayments,
            enrollInCourse,
            updateLessonProgress,
            addPayment,
            processPayment,
            addQuestion,
            addAnswer,
            updateCoupons,
            claimCertificate,
            isLoading
        }}>
            {(!isMounted || isLoading) ? (
                <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-bold text-text-secondary animate-pulse">กำลังโหลดข้อมูล...</p>
                    </div>
                </div>
            ) : children}
        </SiteDataContext.Provider>
    );
}

export function useSiteData() {
    const context = useContext(SiteDataContext);
    if (context === undefined) {
        throw new Error('useSiteData must be used within a SiteDataProvider');
    }
    return context;
}
