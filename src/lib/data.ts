import type {
    Course,
    Lesson,
    User,
    UserProgress,
    Payment,
    HallOfFameEntry,
    ScheduleEntry,
} from '@/types';

// ─── Courses ─────────────────────────────────────────────
export const courses: Course[] = [
    {
        id: '1',
        title: 'คณิตศาสตร์ A-Level เข้มข้น',
        description:
            'คอร์สเตรียมสอบ A-Level คณิตศาสตร์แบบครบเนื้อหา ตั้งแต่พีชคณิต แคลคูลัส ความน่าจะเป็น พร้อมเทคนิคทำโจทย์ให้เร็ว',
        price: 3500,
        thumbnail: '/thumbnails/math-alevel.jpg',
        tutorName: 'อ.สมชาย ปัญญาดี',
        category: 'A-Level',
        subject: 'คณิตศาสตร์',
        totalHours: 48,
        totalLessons: 32,
        rating: 4.9,
        enrolledCount: 245,
        createdAt: '2025-01-15',
    },
    {
        id: '2',
        title: 'ฟิสิกส์ A-Level พิชิตข้อสอบ',
        description:
            'ฟิสิกส์ A-Level ครบทุกบท กลศาสตร์ คลื่น ไฟฟ้า อะตอม พร้อมสรุปสูตรและเทคนิคการทำโจทย์',
        price: 3200,
        thumbnail: '/thumbnails/physics-alevel.jpg',
        tutorName: 'อ.วิทยา แสงทอง',
        category: 'A-Level',
        subject: 'ฟิสิกส์',
        totalHours: 42,
        totalLessons: 28,
        rating: 4.8,
        enrolledCount: 189,
        createdAt: '2025-02-01',
    },
    {
        id: '3',
        title: 'TGAT ภาษาอังกฤษ',
        description:
            'เตรียมสอบ TGAT ภาษาอังกฤษ ทั้ง Reading, Grammar, Vocabulary พร้อมเทคนิคเก็บคะแนนเต็ม',
        price: 2800,
        thumbnail: '/thumbnails/tgat-eng.jpg',
        tutorName: 'อ.แพรวา ภาษาเด่น',
        category: 'TGAT',
        subject: 'ภาษาอังกฤษ',
        totalHours: 36,
        totalLessons: 24,
        rating: 4.7,
        enrolledCount: 312,
        createdAt: '2025-01-20',
    },
    {
        id: '4',
        title: 'เคมี A-Level ครบสูตร',
        description:
            'คอร์สเคมี A-Level เรียนรู้ตั้งแต่โครงสร้างอะตอม พันธะเคมี สมดุลเคมี กรด-เบส จนถึงเคมีอินทรีย์',
        price: 3000,
        thumbnail: '/thumbnails/chem-alevel.jpg',
        tutorName: 'อ.ณัฐพล เคมีเทพ',
        category: 'A-Level',
        subject: 'เคมี',
        totalHours: 40,
        totalLessons: 26,
        rating: 4.8,
        enrolledCount: 156,
        createdAt: '2025-03-01',
    },
    {
        id: '5',
        title: 'คณิตศาสตร์ ม.ต้น พื้นฐาน',
        description:
            'เสริมพื้นฐานคณิตศาสตร์ ม.1-3 จำนวนเต็ม เศษส่วน สมการ เรขาคณิต สถิติ อย่างเข้าใจง่าย',
        price: 2000,
        thumbnail: '/thumbnails/math-junior.jpg',
        tutorName: 'อ.สมชาย ปัญญาดี',
        category: 'ม.ต้น',
        subject: 'คณิตศาสตร์',
        totalHours: 30,
        totalLessons: 20,
        rating: 4.9,
        enrolledCount: 178,
        createdAt: '2025-02-15',
    },
    {
        id: '6',
        title: 'TGAT วิชาการคิดอย่างมีเหตุผล',
        description:
            'พิชิตข้อสอบ TGAT ส่วนการคิดอย่างมีเหตุผล ฝึกวิเคราะห์ตรรกะ แก้ปัญหาเชิงตัวเลขและภาษา',
        price: 2500,
        thumbnail: '/thumbnails/tgat-logic.jpg',
        tutorName: 'อ.ปรีชา ตรรกะเทพ',
        category: 'TGAT',
        subject: 'คณิตศาสตร์',
        totalHours: 28,
        totalLessons: 18,
        rating: 4.6,
        enrolledCount: 267,
        createdAt: '2025-01-10',
    },
    {
        id: '7',
        title: 'ชีววิทยา A-Level สรุปครบ',
        description:
            'ชีววิทยา A-Level สรุปเนื้อหาครบทุกบท เซลล์ พันธุศาสตร์ นิเวศวิทยา วิวัฒนาการ พร้อมโจทย์ฝึก',
        price: 2800,
        thumbnail: '/thumbnails/bio-alevel.jpg',
        tutorName: 'อ.ธนิดา ชีวะเก่ง',
        category: 'A-Level',
        subject: 'ชีววิทยา',
        totalHours: 38,
        totalLessons: 25,
        rating: 4.7,
        enrolledCount: 134,
        createdAt: '2025-03-10',
    },
    {
        id: '8',
        title: 'ภาษาอังกฤษ ม.ต้น เน้นสนทนา',
        description:
            'เรียนภาษาอังกฤษ ม.ต้น แบบเน้นใช้จริง Grammar, Conversation, Reading Comprehension',
        price: 1800,
        thumbnail: '/thumbnails/eng-junior.jpg',
        tutorName: 'อ.แพรวา ภาษาเด่น',
        category: 'ม.ต้น',
        subject: 'ภาษาอังกฤษ',
        totalHours: 24,
        totalLessons: 16,
        rating: 4.5,
        enrolledCount: 210,
        createdAt: '2025-02-20',
    },
];

// ─── Lessons ─────────────────────────────────────────────
export const lessons: Lesson[] = [
    // Course 1 lessons
    { id: 'l1', courseId: '1', title: 'บทที่ 1: เซตและตรรกศาสตร์', videoUrl: '#', duration: 90, orderIndex: 1 },
    { id: 'l2', courseId: '1', title: 'บทที่ 2: ระบบจำนวนจริง', videoUrl: '#', duration: 85, orderIndex: 2 },
    { id: 'l3', courseId: '1', title: 'บทที่ 3: ความสัมพันธ์และฟังก์ชัน', videoUrl: '#', duration: 95, orderIndex: 3 },
    { id: 'l4', courseId: '1', title: 'บทที่ 4: เรขาคณิตวิเคราะห์', videoUrl: '#', duration: 100, orderIndex: 4 },
    { id: 'l5', courseId: '1', title: 'บทที่ 5: ลำดับและอนุกรม', videoUrl: '#', duration: 90, orderIndex: 5 },
    { id: 'l6', courseId: '1', title: 'บทที่ 6: แคลคูลัสเบื้องต้น', videoUrl: '#', duration: 110, orderIndex: 6 },
    { id: 'l7', courseId: '1', title: 'บทที่ 7: ความน่าจะเป็น', videoUrl: '#', duration: 80, orderIndex: 7 },
    { id: 'l8', courseId: '1', title: 'บทที่ 8: สถิติ', videoUrl: '#', duration: 75, orderIndex: 8 },
    // Course 2 lessons
    { id: 'l9', courseId: '2', title: 'บทที่ 1: การเคลื่อนที่แนวตรง', videoUrl: '#', duration: 90, orderIndex: 1 },
    { id: 'l10', courseId: '2', title: 'บทที่ 2: แรงและกฎการเคลื่อนที่', videoUrl: '#', duration: 95, orderIndex: 2 },
    { id: 'l11', courseId: '2', title: 'บทที่ 3: งานและพลังงาน', videoUrl: '#', duration: 85, orderIndex: 3 },
    { id: 'l12', courseId: '2', title: 'บทที่ 4: โมเมนตัม', videoUrl: '#', duration: 80, orderIndex: 4 },
    { id: 'l13', courseId: '2', title: 'บทที่ 5: คลื่นกล', videoUrl: '#', duration: 90, orderIndex: 5 },
    { id: 'l14', courseId: '2', title: 'บทที่ 6: ไฟฟ้าสถิต', videoUrl: '#', duration: 100, orderIndex: 6 },
    // Course 3 lessons
    { id: 'l15', courseId: '3', title: 'Part 1: Reading Comprehension', videoUrl: '#', duration: 90, orderIndex: 1 },
    { id: 'l16', courseId: '3', title: 'Part 2: Grammar Essentials', videoUrl: '#', duration: 85, orderIndex: 2 },
    { id: 'l17', courseId: '3', title: 'Part 3: Vocabulary Building', videoUrl: '#', duration: 80, orderIndex: 3 },
    { id: 'l18', courseId: '3', title: 'Part 4: Sentence Completion', videoUrl: '#', duration: 75, orderIndex: 4 },
];

// ─── Users (Mock) ────────────────────────────────────────
export const users: User[] = [
    {
        id: 'u1',
        name: 'นายธนภัทร ศรีสวัสดิ์',
        email: 'thanapat@example.com',
        password: 'hashed',
        role: 'STUDENT',
        phone: '081-234-5678',
        createdAt: '2025-01-05',
    },
    {
        id: 'u2',
        name: 'น.ส.ปภาวี จิตรดี',
        email: 'papawee@example.com',
        password: 'hashed',
        role: 'STUDENT',
        phone: '089-876-5432',
        createdAt: '2025-01-12',
    },
    {
        id: 'u3',
        name: 'นายภูมิพัฒน์ วงศ์ทอง',
        email: 'pumipat@example.com',
        password: 'hashed',
        role: 'STUDENT',
        createdAt: '2025-02-01',
    },
    {
        id: 'admin1',
        name: 'Admin',
        email: 'admin@attapanya.com',
        password: 'hashed',
        role: 'ADMIN',
        createdAt: '2024-01-01',
    },
];

// ─── User Progress ───────────────────────────────────────
export const userProgress: UserProgress[] = [
    { id: 'p1', userId: 'u1', lessonId: 'l1', courseId: '1', status: 'COMPLETED', lastWatchedSecond: 5400 },
    { id: 'p2', userId: 'u1', lessonId: 'l2', courseId: '1', status: 'COMPLETED', lastWatchedSecond: 5100 },
    { id: 'p3', userId: 'u1', lessonId: 'l3', courseId: '1', status: 'WATCHING', lastWatchedSecond: 2400 },
    { id: 'p4', userId: 'u1', lessonId: 'l9', courseId: '2', status: 'COMPLETED', lastWatchedSecond: 5400 },
    { id: 'p5', userId: 'u1', lessonId: 'l10', courseId: '2', status: 'WATCHING', lastWatchedSecond: 1800 },
    { id: 'p6', userId: 'u2', lessonId: 'l1', courseId: '1', status: 'COMPLETED', lastWatchedSecond: 5400 },
    { id: 'p7', userId: 'u2', lessonId: 'l2', courseId: '1', status: 'COMPLETED', lastWatchedSecond: 5100 },
    { id: 'p8', userId: 'u2', lessonId: 'l3', courseId: '1', status: 'COMPLETED', lastWatchedSecond: 5700 },
    { id: 'p9', userId: 'u2', lessonId: 'l4', courseId: '1', status: 'COMPLETED', lastWatchedSecond: 6000 },
    { id: 'p10', userId: 'u2', lessonId: 'l5', courseId: '1', status: 'WATCHING', lastWatchedSecond: 3000 },
    { id: 'p11', userId: 'u3', lessonId: 'l15', courseId: '3', status: 'COMPLETED', lastWatchedSecond: 5400 },
    { id: 'p12', userId: 'u3', lessonId: 'l16', courseId: '3', status: 'WATCHING', lastWatchedSecond: 2700 },
];

// ─── Payments ────────────────────────────────────────────
export const payments: Payment[] = [
    {
        id: 'pay1',
        userId: 'u1',
        userName: 'นายธนภัทร ศรีสวัสดิ์',
        courseId: '1',
        courseTitle: 'คณิตศาสตร์ A-Level เข้มข้น',
        amount: 3500,
        slipImageUrl: '/slips/slip1.jpg',
        status: 'SUCCESS',
        createdAt: '2025-01-15T10:30:00',
    },
    {
        id: 'pay2',
        userId: 'u1',
        userName: 'นายธนภัทร ศรีสวัสดิ์',
        courseId: '2',
        courseTitle: 'ฟิสิกส์ A-Level พิชิตข้อสอบ',
        amount: 3200,
        slipImageUrl: '/slips/slip2.jpg',
        status: 'SUCCESS',
        createdAt: '2025-02-05T14:20:00',
    },
    {
        id: 'pay3',
        userId: 'u2',
        userName: 'น.ส.ปภาวี จิตรดี',
        courseId: '1',
        courseTitle: 'คณิตศาสตร์ A-Level เข้มข้น',
        amount: 3500,
        slipImageUrl: '/slips/slip3.jpg',
        status: 'SUCCESS',
        createdAt: '2025-01-20T09:15:00',
    },
    {
        id: 'pay4',
        userId: 'u3',
        userName: 'นายภูมิพัฒน์ วงศ์ทอง',
        courseId: '3',
        courseTitle: 'TGAT ภาษาอังกฤษ',
        amount: 2800,
        slipImageUrl: '/slips/slip4.jpg',
        status: 'PENDING',
        createdAt: '2025-03-12T16:45:00',
    },
    {
        id: 'pay5',
        userId: 'u2',
        userName: 'น.ส.ปภาวี จิตรดี',
        courseId: '4',
        courseTitle: 'เคมี A-Level ครบสูตร',
        amount: 3000,
        slipImageUrl: '/slips/slip5.jpg',
        status: 'PENDING',
        createdAt: '2025-03-14T11:00:00',
    },
];

// ─── Hall of Fame ────────────────────────────────────────
export const hallOfFame: HallOfFameEntry[] = [
    { id: 'h1', name: 'เบญจมาศ ศรีวิลัย', score: 95, maxScore: 100, subject: 'คณิตศาสตร์', exam: 'A-Level', year: '2568' },
    { id: 'h2', name: 'กิตติพงศ์ วรรณสิริ', score: 92, maxScore: 100, subject: 'ฟิสิกส์', exam: 'A-Level', year: '2568' },
    { id: 'h3', name: 'พิมพ์ชนก อัศวเดช', score: 98, maxScore: 100, subject: 'ภาษาอังกฤษ', exam: 'TGAT', year: '2568' },
    { id: 'h4', name: 'ธีรภัทร สุขสมบูรณ์', score: 89, maxScore: 100, subject: 'เคมี', exam: 'A-Level', year: '2568' },
    { id: 'h5', name: 'สุชาดา แก้วมณี', score: 94, maxScore: 100, subject: 'ชีววิทยา', exam: 'A-Level', year: '2568' },
    { id: 'h6', name: 'ณัฐวุฒิ เกียรติสถาพร', score: 91, maxScore: 100, subject: 'คณิตศาสตร์', exam: 'A-Level', year: '2567' },
    { id: 'h7', name: 'วรัญญา ตันติพงศ์', score: 96, maxScore: 100, subject: 'ภาษาอังกฤษ', exam: 'TGAT', year: '2567' },
    { id: 'h8', name: 'ปิยะ สว่างจิต', score: 88, maxScore: 100, subject: 'ฟิสิกส์', exam: 'A-Level', year: '2567' },
];

// ─── Testimonials / Reviews ─────────────────────────────
export interface Testimonial {
    id: string;
    name: string;
    course: string;
    rating: number;
    text: string;
    image?: string;
    date: string;
}

export const testimonials: Testimonial[] = [
    {
        id: 'r1', name: 'ปณิตา จันทร์สว่าง', course: 'คณิตศาสตร์ A-Level เข้มข้น',
        rating: 5, text: 'เรียนกับอ.สมชายแล้วเข้าใจเลยค่ะ สอนละเอียดมาก มีเทคนิคลัดตัดเวลาทำข้อสอบ คะแนนขึ้นจาก 50 เป็น 85 ภายใน 3 เดือน!',
        date: '2568',
    },
    {
        id: 'r2', name: 'ภูมิพัฒน์ รัตนกุล', course: 'ฟิสิกส์ A-Level พิชิตข้อสอบ',
        rating: 5, text: 'อ.วิทยาสอนให้เข้าใจจากรากฐานจริงๆ ครับ ไม่ใช่แค่ท่องสูตร แต่เข้าใจว่าทำไมถึงเป็นแบบนั้น ทำให้แก้โจทย์ยากๆ ได้',
        date: '2568',
    },
    {
        id: 'r3', name: 'มนัสนันท์ ชาญวิทย์', course: 'TGAT ภาษาอังกฤษ',
        rating: 5, text: 'อ.แพรวาสอนสนุกมากค่ะ ทำให้ภาษาอังกฤษไม่น่าเบื่ออีกต่อไป TGAT ได้ 92 คะแนน เกินคาดมาก!',
        date: '2568',
    },
    {
        id: 'r4', name: 'กฤษฎา สมบูรณ์ดี', course: 'เคมี A-Level ครบสูตร',
        rating: 4, text: 'เคมีเคยเป็นวิชาที่ไม่ชอบเลย แต่พอเรียนกับอ.ณัฐพลแล้วเริ่มเข้าใจ สอนด้วยภาพทำให้จำง่ายมากครับ',
        date: '2567',
    },
    {
        id: 'r5', name: 'ศิริพร แก้วประเสริฐ', course: 'คณิตศาสตร์ ม.ต้น พื้นฐาน',
        rating: 5, text: 'ลูกเรียนกับที่นี่ตั้งแต่ ม.1 ค่ะ คะแนนสอบเพิ่มขึ้นทุกเทอม อาจารย์ใจดี ดูแลเด็กดีมาก แนะนำค่ะ',
        date: '2568',
    },
    {
        id: 'r6', name: 'ธนดล วิจิตรศิลป์', course: 'ฟิสิกส์ A-Level พิชิตข้อสอบ',
        rating: 5, text: 'คอร์สนี้ช่วยให้ผมสอบ A-Level ฟิสิกส์ได้ 88 คะแนนครับ เนื้อหาครบถ้วน มีข้อสอบเก่าให้ฝึกเยอะมาก',
        date: '2567',
    },
    {
        id: 'r7', name: 'พิชชาภา นิลเพชร', course: 'TGAT ภาษาอังกฤษ',
        rating: 5, text: 'เรียนออนไลน์สะดวกมากค่ะ กลับมาดูย้อนหลังได้ ระบบห้องเรียนใช้ง่าย อาจารย์ตอบคำถามเร็ว',
        date: '2568',
    },
    {
        id: 'r8', name: 'วีรภัทร ศรีสุข', course: 'คณิตศาสตร์ A-Level เข้มข้น',
        rating: 5, text: 'สอบติดวิศวะจุฬาครับ! ขอบคุณอรรถปัญญามาก เรียนที่นี่ทำให้มีเป้าหมายและมั่นใจในตัวเอง',
        date: '2567',
    },
];
export const schedule: ScheduleEntry[] = [
    { id: 's1', courseTitle: 'คณิตศาสตร์ A-Level เข้มข้น', day: 'จันทร์', time: '18:00 - 20:00', tutorName: 'อ.สมชาย ปัญญาดี' },
    { id: 's2', courseTitle: 'ฟิสิกส์ A-Level พิชิตข้อสอบ', day: 'อังคาร', time: '18:00 - 20:00', tutorName: 'อ.วิทยา แสงทอง' },
    { id: 's3', courseTitle: 'TGAT ภาษาอังกฤษ', day: 'พุธ', time: '18:00 - 20:00', tutorName: 'อ.แพรวา ภาษาเด่น' },
    { id: 's4', courseTitle: 'เคมี A-Level ครบสูตร', day: 'พฤหัสบดี', time: '18:00 - 20:00', tutorName: 'อ.ณัฐพล เคมีเทพ' },
    { id: 's5', courseTitle: 'คณิตศาสตร์ ม.ต้น พื้นฐาน', day: 'ศุกร์', time: '16:00 - 18:00', tutorName: 'อ.สมชาย ปัญญาดี' },
];

// ─── Tutors ──────────────────────────────────────────────
export interface Tutor {
    id: string;
    name: string;
    title: string;
    bio: string;
    image?: string;
    expertise: string[];
    experienceYears: number;
    studentsCount: number;
    rating: number;
}

export const tutors: Tutor[] = [
    {
        id: 't1',
        name: 'อ.สมชาย ปัญญาดี',
        title: 'ผู้เชี่ยวชาญด้านคณิตศาสตร์',
        bio: 'จบปริญญาโทคณิตศาสตร์ประยุกต์ จุฬาลงกรณ์มหาวิทยาลัย ประสบการณ์สอนกว่า 15 ปี เน้นเทคนิคทำโจทย์ให้เร็วและแม่นยำ',
        expertise: ['แคลคูลัส', 'พีชคณิต', 'ความน่าจะเป็น', 'สถิติ'],
        experienceYears: 15,
        studentsCount: 3200,
        rating: 4.9,
    },
    {
        id: 't2',
        name: 'อ.วิทยา แสงทอง',
        title: 'ผู้เชี่ยวชาญด้านฟิสิกส์',
        bio: 'จบปริญญาเอกฟิสิกส์ มหาวิทยาลัยมหิดล อดีตอาจารย์มหาวิทยาลัย สอนให้เข้าใจง่ายด้วยการทดลองจริง',
        expertise: ['กลศาสตร์', 'คลื่นและแสง', 'ไฟฟ้า', 'อะตอม'],
        experienceYears: 12,
        studentsCount: 2100,
        rating: 4.8,
    },
    {
        id: 't3',
        name: 'อ.แพรวา ภาษาเด่น',
        title: 'ผู้เชี่ยวชาญด้านภาษาอังกฤษ',
        bio: 'IELTS 8.5 จบปริญญาโท Linguistics จาก University of Edinburgh สอนภาษาอังกฤษให้สนุกและใช้ได้จริง',
        expertise: ['TGAT English', 'Grammar', 'Reading', 'Vocabulary'],
        experienceYears: 8,
        studentsCount: 2800,
        rating: 4.7,
    },
    {
        id: 't4',
        name: 'อ.ณัฐพล เคมีเทพ',
        title: 'ผู้เชี่ยวชาญด้านเคมี',
        bio: 'จบปริญญาโทเคมี มหาวิทยาลัยเกษตรศาสตร์ สอนเคมีให้เข้าใจง่ายด้วยภาพและแผนผัง เน้นสร้างพื้นฐานที่แข็งแกร่ง',
        expertise: ['เคมีทั่วไป', 'เคมีอินทรีย์', 'สมดุลเคมี', 'กรด-เบส'],
        experienceYears: 10,
        studentsCount: 1800,
        rating: 4.8,
    },
    {
        id: 't5',
        name: 'อ.ปรีชา ตรรกะเทพ',
        title: 'ผู้เชี่ยวชาญด้านตรรกศาสตร์',
        bio: 'จบปริญญาโทปรัชญา จุฬาลงกรณ์มหาวิทยาลัย สอนการคิดเชิงวิเคราะห์และตรรกะ เน้นฝึกทำโจทย์จริงจาก TGAT',
        expertise: ['การคิดเชิงวิเคราะห์', 'ตรรกศาสตร์', 'เหตุผลเชิงตัวเลข', 'เหตุผลเชิงภาษา'],
        experienceYears: 9,
        studentsCount: 1500,
        rating: 4.6,
    },
    {
        id: 't6',
        name: 'อ.ธนิดา ชีวะเก่ง',
        title: 'ผู้เชี่ยวชาญด้านชีววิทยา',
        bio: 'จบปริญญาเอก Molecular Biology มศว. สอนชีววิทยาด้วยภาพจำและ mind map ทำให้จำง่าย เข้าใจลึก',
        expertise: ['เซลล์', 'พันธุศาสตร์', 'นิเวศวิทยา', 'วิวัฒนาการ'],
        experienceYears: 7,
        studentsCount: 1200,
        rating: 4.7,
    },
];

// ─── Admin Stats ─────────────────────────────────────────
export const monthlyRevenue = [
    { month: 'ม.ค.', revenue: 85000 },
    { month: 'ก.พ.', revenue: 120000 },
    { month: 'มี.ค.', revenue: 95000 },
    { month: 'เม.ย.', revenue: 140000 },
    { month: 'พ.ค.', revenue: 160000 },
    { month: 'มิ.ย.', revenue: 175000 },
    { month: 'ก.ค.', revenue: 200000 },
    { month: 'ส.ค.', revenue: 185000 },
    { month: 'ก.ย.', revenue: 210000 },
    { month: 'ต.ค.', revenue: 195000 },
    { month: 'พ.ย.', revenue: 230000 },
    { month: 'ธ.ค.', revenue: 250000 },
];
