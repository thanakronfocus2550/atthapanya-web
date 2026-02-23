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
  stats?: UserStats;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastActivityDate?: string;
  totalStudyMinutes: number;
  completedCoursesCount: number;
  badges?: Badge[];
  certificates?: UserCertificate[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt: string;
}

export interface UserCertificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  issuedAt: string;
  verificationCode: string;
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
  resourceUrl?: string; // Link to PDF or other resources
}

export interface Tutor {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  expertise: string[];
  education?: string[];
  links?: {
    facebook?: string;
    line?: string;
    instagram?: string;
  };
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
  couponCode?: string;
  discountAmount?: number;
}

export interface Question {
  id: string;
  lessonId: string;
  courseId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  role: 'STUDENT' | 'ADMIN' | 'TUTOR';
  content: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minPurchase?: number;
  expiryDate?: string;
  active: boolean;
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

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'URGENT' | 'NEW' | 'UPDATE';
  active: boolean;
}

export interface SiteSettings {
  // Branding
  siteName: string;
  siteDescription?: string;
  primaryColor: string;
  logo?: string;

  // SEO & Social
  metaTitle?: string;
  metaDescription?: string;
  facebookUrl?: string;
  lineId?: string;
  instagramUrl?: string;
  tiktokUrl?: string;

  // Contact Info
  email: string;
  phone: string;
  address?: string;
  mapUrl?: string;

  // Landing Page
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;

  // Announcement Popup
  showPopup?: boolean;
  popupTitle?: string;
  popupDescription?: string;
  popupCtaText?: string;
  popupCtaUrl?: string;
  popupImages?: string[];

  // Gamification Config (Optional for future admin control)
  xpPerLesson?: number;
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
