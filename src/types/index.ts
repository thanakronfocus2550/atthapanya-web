// ─── Enums ───────────────────────────────────────────────
export type UserRole = 'ADMIN' | 'STUDENT';
export type ProgressStatus = 'NOT_STARTED' | 'WATCHING' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'REJECTED';
export type CourseCategory = 'A-Level' | 'TGAT' | 'ม.ต้น' | 'ม.ปลาย' | 'GAT' | 'PAT';
export type Subject = 'คณิตศาสตร์' | 'ฟิสิกส์' | 'เคมี' | 'ชีววิทยา' | 'ภาษาอังกฤษ' | 'ภาษาไทย';

// ─── Models ──────────────────────────────────────────────
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
    createdAt: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    tutorName: string;
    tutorAvatar?: string;
    category: CourseCategory;
    subject: Subject;
    totalHours: number;
    totalLessons: number;
    rating: number;
    enrolledCount: number;
    createdAt: string;
}

export interface Lesson {
    id: string;
    courseId: string;
    title: string;
    videoUrl: string;
    duration: number; // minutes
    orderIndex: number;
    description?: string;
}

export interface UserProgress {
    id: string;
    userId: string;
    lessonId: string;
    courseId: string;
    status: ProgressStatus;
    lastWatchedSecond: number;
}

export interface Payment {
    id: string;
    userId: string;
    userName: string;
    courseId: string;
    courseTitle: string;
    amount: number;
    slipImageUrl: string;
    status: PaymentStatus;
    createdAt: string;
}

export interface CartItem {
    course: Course;
    quantity: number;
}

export interface HallOfFameEntry {
    id: string;
    name: string;
    score: number;
    maxScore: number;
    subject: string;
    exam: string;
    year: string;
    avatar?: string;
    image?: string;
    university?: string;
}

export interface ScheduleEntry {
    id: string;
    courseTitle: string;
    day: string;
    time: string;
    tutorName: string;
    room?: string;
}

/*
  ─── Prisma Schema Reference ─────────────────────────────
  
  model User {
    id        String   @id @default(cuid())
    name      String
    email     String   @unique
    password  String
    role      Role     @default(STUDENT)
    avatar    String?
    phone     String?
    createdAt DateTime @default(now())
    progress  UserProgress[]
    payments  Payment[]
  }

  model Course {
    id            String   @id @default(cuid())
    title         String
    description   String
    price         Float
    thumbnail     String
    tutorName     String
    tutorAvatar   String?
    category      String
    subject       String
    totalHours    Float
    totalLessons  Int
    rating        Float    @default(0)
    enrolledCount Int      @default(0)
    createdAt     DateTime @default(now())
    lessons       Lesson[]
    payments      Payment[]
  }

  model Lesson {
    id          String   @id @default(cuid())
    courseId     String
    course      Course   @relation(fields: [courseId], references: [id])
    title       String
    videoUrl    String
    duration    Int
    orderIndex  Int
    description String?
    progress    UserProgress[]
  }

  model UserProgress {
    id               String @id @default(cuid())
    userId           String
    user             User   @relation(fields: [userId], references: [id])
    lessonId         String
    lesson           Lesson @relation(fields: [lessonId], references: [id])
    courseId          String
    status           ProgressStatus @default(NOT_STARTED)
    lastWatchedSecond Int   @default(0)
    @@unique([userId, lessonId])
  }

  model Payment {
    id          String        @id @default(cuid())
    userId      String
    user        User          @relation(fields: [userId], references: [id])
    courseId     String
    course      Course        @relation(fields: [courseId], references: [id])
    amount      Float
    slipImageUrl String
    status      PaymentStatus @default(PENDING)
    createdAt   DateTime      @default(now())
  }

  enum Role { ADMIN STUDENT }
  enum ProgressStatus { NOT_STARTED WATCHING COMPLETED }
  enum PaymentStatus { PENDING SUCCESS REJECTED }
*/
