'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Trophy, TrendingUp, Users, Star, GraduationCap, ChevronLeft, ChevronRight, MessageCircle, Quote } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import CourseCard from '@/components/CourseCard';
import PageTransition from '@/components/PageTransition';
import { courses, hallOfFame, tutors, testimonials } from '@/lib/data';
import type { CourseCategory } from '@/types';

const categories: { label: string; value: CourseCategory | 'all' }[] = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'A-Level', value: 'A-Level' },
  { label: 'TGAT', value: 'TGAT' },
  { label: 'ม.ต้น', value: 'ม.ต้น' },
];

const stats = [
  { icon: Users, label: 'นักเรียน', value: '2,500+' },
  { icon: Trophy, label: 'สอบติดมหาลัย', value: '98%' },
  { icon: TrendingUp, label: 'คะแนนเฉลี่ยเพิ่ม', value: '35%' },
];

const heroQuotes = [
  { line1: 'ออกแบบกระบวนการคิด', line2: 'สอนวิธีคิดอย่างเป็นระบบ', line3: 'กระชับ เข้าใจง่าย สอบติดทุกสนามสอบ' },
  { line1: 'เข้าใจฟิสิกส์จากรากฐาน', line2: 'สอนผ่านการทดลองจริง', line3: 'คิดเป็น วิเคราะห์ได้ แก้ปัญหาเป็น' },
  { line1: 'เรียนภาษาให้สนุก', line2: 'ฝึกทักษะแบบครบวงจร', line3: 'พร้อมพิชิตทุกข้อสอบภาษา' },
  { line1: 'เคมีไม่ยากอย่างที่คิด', line2: 'สอนด้วยภาพและแผนผัง', line3: 'เข้าใจลึก จำแม่น ใช้ได้จริง' },
  { line1: 'คิดวิเคราะห์อย่างมีเหตุผล', line2: 'ฝึกตรรกะอย่างเป็นระบบ', line3: 'พร้อมรับมือทุกข้อสอบ TGAT' },
  { line1: 'ชีววิทยาเข้าใจง่าย', line2: 'สอนด้วย Mind Map ภาพจำ', line3: 'จำง่าย เข้าใจลึก ทำข้อสอบได้' },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<CourseCategory | 'all'>('all');
  const [heroIndex, setHeroIndex] = useState(0);

  // Auto-slide hero every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % tutors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredCourses =
    activeCategory === 'all'
      ? courses
      : courses.filter((c) => c.category === activeCategory);

  return (
    <PageTransition>
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden min-h-[520px] lg:min-h-[580px]" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 40%, #B45309 100%)' }}>
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-yellow-300/10 rounded-full blur-3xl translate-y-1/2" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
          {/* Curved wave at bottom */}
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 80" fill="none">
            <path d="M0 40C360 80 720 0 1080 40C1260 60 1380 60 1440 40V80H0V40Z" fill="white" fillOpacity="0.08" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          {/* Left/Right Navigation Arrows */}
          <button onClick={() => setHeroIndex((prev) => (prev - 1 + tutors.length) % tutors.length)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-lg border border-white/20">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={() => setHeroIndex((prev) => (prev + 1) % tutors.length)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-lg border border-white/20">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="grid lg:grid-cols-2 gap-8 items-end min-h-[440px]">
            {/* Left: Tutor Image */}
            <motion.div
              key={tutors[heroIndex]?.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start items-end"
            >
              <div className="relative">
                {/* Glow behind image */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/20 blur-2xl rounded-full" />
                <img
                  src={tutors[heroIndex]?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutors[heroIndex]?.name.replace('อ.', '') || 'T')}&size=400&background=92400E&color=fff&bold=true&font-size=0.35`}
                  alt={tutors[heroIndex]?.name || ''}
                  className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-3xl object-cover shadow-2xl ring-4 ring-white/20"
                />
                {/* Name badge on image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-amber-700 px-5 py-2 rounded-full shadow-lg font-semibold text-sm whitespace-nowrap"
                >
                  {tutors[heroIndex]?.name}
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Quote + CTA */}
            <motion.div
              key={`text-${heroIndex}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white text-center lg:text-left pb-8"
            >
              {/* Quote */}
              <div className="mb-6">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-md">
                  &ldquo;{heroQuotes[heroIndex % heroQuotes.length].line1}
                  <br />
                  {heroQuotes[heroIndex % heroQuotes.length].line2}
                  <br />
                  {heroQuotes[heroIndex % heroQuotes.length].line3}&rdquo;
                </p>
              </div>

              {/* Tutor info */}
              <p className="text-white/80 text-lg mb-8">
                — {tutors[heroIndex]?.title} —
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark text-gray-900 font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/30 text-base"
                >
                  ทดลองเรียนฟรี
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl transition-all backdrop-blur-sm border border-white/30 text-base"
                >
                  คลังข้อสอบ
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex gap-6 justify-center lg:justify-start mt-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {tutors.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === heroIndex ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tutor Profiles Section ─── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 rounded-full text-sm font-medium text-primary-dark mb-4">
                <GraduationCap className="w-4 h-4" />
                ทีมอาจารย์
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-3">
                อาจารย์ผู้สอนคุณภาพ
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                ทีมอาจารย์ผู้เชี่ยวชาญเฉพาะทาง พร้อมประสบการณ์สอนมากกว่า 7 ปี
              </p>
            </div>
          </ScrollReveal>

          {/* Tutor Carousel */}
          <div className="relative group/carousel">
            {/* Left/Right buttons */}
            <button onClick={() => { const el = document.getElementById('tutor-carousel'); if (el) el.scrollBy({ left: -320, behavior: 'smooth' }); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-primary/20 -translate-x-1/2">
              <ChevronLeft className="w-5 h-5 text-text-primary" />
            </button>
            <button onClick={() => { const el = document.getElementById('tutor-carousel'); if (el) el.scrollBy({ left: 320, behavior: 'smooth' }); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-primary/20 translate-x-1/2">
              <ChevronRight className="w-5 h-5 text-text-primary" />
            </button>

            <div id="tutor-carousel" className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
              {tutors.map((tutor, i) => {
                const colors = ['EAB308', '3B82F6', 'EC4899', '8B5CF6', 'F97316', '10B981'];
                const bg = colors[i % colors.length];
                const avatarUrl = tutor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name.replace('อ.', ''))}&size=200&background=${bg}&color=fff&bold=true&font-size=0.4`;
                return (
                  <ScrollReveal key={tutor.id} delay={i * 0.08}>
                    <div className="snap-start shrink-0 w-72 sm:w-80 bg-white rounded-2xl border border-border p-6 hover:shadow-card-hover transition-all duration-300 group text-center">
                      {/* Avatar */}
                      <div className="relative w-24 h-24 mx-auto mb-5">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                        <img src={avatarUrl} alt={tutor.name}
                          className="relative w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg" />
                      </div>
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-primary-dark transition-colors mb-0.5">{tutor.name}</h3>
                      <p className="text-sm text-primary-dark font-medium mb-3">{tutor.title}</p>
                      <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">{tutor.bio}</p>
                      <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                        {tutor.expertise.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 bg-surface text-text-secondary text-xs rounded-full">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-border">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-primary-dark fill-primary-dark" />
                          <span className="font-medium text-text-primary">{tutor.rating}</span>
                        </div>
                        <span>{tutor.experienceYears} ปีประสบการณ์</span>
                        <span>{tutor.studentsCount.toLocaleString()} นักเรียน</span>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Course Filter Tabs ─── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-3">
                คอร์สยอดนิยม
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                เลือกหมวดหมู่ที่สนใจ แล้วค้นหาคอร์สที่เหมาะกับคุณ
              </p>
            </div>
          </ScrollReveal>

          {/* Tabs */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.value
                    ? 'bg-primary text-text-primary shadow-md shadow-primary/20'
                    : 'bg-surface text-text-secondary hover:bg-surface-dark'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16 text-text-muted">
              ยังไม่มีคอร์สในหมวดหมู่นี้
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-border text-text-secondary hover:border-primary hover:text-primary-dark font-medium rounded-xl transition-all"
            >
              ดูคอร์สทั้งหมด
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Hall of Fame ─── */}
      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 rounded-full text-sm font-medium text-primary-dark mb-4">
                <Trophy className="w-4 h-4" />
                Hall of Fame
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-3">
                ผลงานนักเรียนรุ่นพี่
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                คะแนนสอบจากนักเรียนของเราที่พิสูจน์คุณภาพการสอน
              </p>
            </div>
          </ScrollReveal>

          {/* Hall of Fame Carousel */}
          <div className="relative group/carousel">
            <button onClick={() => { const el = document.getElementById('fame-carousel'); if (el) el.scrollBy({ left: -280, behavior: 'smooth' }); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-primary/20 -translate-x-1/2">
              <ChevronLeft className="w-5 h-5 text-text-primary" />
            </button>
            <button onClick={() => { const el = document.getElementById('fame-carousel'); if (el) el.scrollBy({ left: 280, behavior: 'smooth' }); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-primary/20 translate-x-1/2">
              <ChevronRight className="w-5 h-5 text-text-primary" />
            </button>

            <div id="fame-carousel" className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
              {hallOfFame.map((entry, i) => {
                const stuColors = ['F59E0B', '6366F1', 'EF4444', '14B8A6', 'F97316', '8B5CF6', 'EC4899', '06B6D4'];
                const bg = stuColors[i % stuColors.length];
                const avatarUrl = entry.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}&size=160&background=${bg}&color=fff&bold=true&font-size=0.38`;
                return (
                  <ScrollReveal key={entry.id} delay={i * 0.08}>
                    <div className="snap-start shrink-0 w-56 sm:w-64 bg-white rounded-2xl p-6 border border-border hover:shadow-card-hover transition-all duration-300 text-center group">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                        <img src={avatarUrl} alt={entry.name}
                          className="relative w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg" />
                      </div>
                      <p className="text-4xl font-bold text-gold mb-1 group-hover:text-gold-light transition-colors">
                        {entry.score}<span className="text-lg text-text-muted font-normal">/{entry.maxScore}</span>
                      </p>
                      <p className="font-semibold text-text-primary mb-1">{entry.name}</p>
                      <p className="text-sm text-text-secondary">{entry.subject} • {entry.exam}</p>
                      {entry.university && <p className="text-xs text-primary-dark mt-1">{entry.university}</p>}
                      <p className="text-xs text-text-muted mt-1">ปีการศึกษา {entry.year}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials / Reviews ─── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 rounded-full text-sm font-medium text-primary-dark mb-4">
                <MessageCircle className="w-4 h-4" />
                รีวิวจากนักเรียน
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-3">
                เสียงจากนักเรียนของเรา
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                ความรู้สึกจริงจากนักเรียนที่เรียนกับอรรถปัญญา
              </p>
            </div>
          </ScrollReveal>

          {/* Review Carousel */}
          <div className="relative group/carousel">
            <button onClick={() => { const el = document.getElementById('review-carousel'); if (el) el.scrollBy({ left: -340, behavior: 'smooth' }); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-primary/20 -translate-x-1/2">
              <ChevronLeft className="w-5 h-5 text-text-primary" />
            </button>
            <button onClick={() => { const el = document.getElementById('review-carousel'); if (el) el.scrollBy({ left: 340, behavior: 'smooth' }); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-primary/20 translate-x-1/2">
              <ChevronRight className="w-5 h-5 text-text-primary" />
            </button>

            <div id="review-carousel" className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
              {testimonials.map((review, i) => {
                const reviewColors = ['F59E0B', '3B82F6', 'EC4899', '8B5CF6', 'F97316', '10B981', 'EF4444', '06B6D4'];
                const bg = reviewColors[i % reviewColors.length];
                const avatarUrl = review.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&size=120&background=${bg}&color=fff&bold=true&font-size=0.4`;
                return (
                  <ScrollReveal key={review.id} delay={i * 0.08}>
                    <div className="snap-start shrink-0 w-80 sm:w-96 bg-white rounded-2xl p-6 border border-border hover:shadow-card-hover transition-all duration-300 group relative">
                      {/* Quote icon */}
                      <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/15" />
                      {/* Stars */}
                      <div className="flex gap-0.5 mb-4">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star key={si} className={`w-4 h-4 ${si < review.rating ? 'text-primary-dark fill-primary-dark' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      {/* Review text */}
                      <p className="text-text-secondary leading-relaxed mb-5 line-clamp-4">
                        &ldquo;{review.text}&rdquo;
                      </p>
                      {/* Author */}
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <img src={avatarUrl} alt={review.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-border" />
                        <div>
                          <p className="font-semibold text-text-primary text-sm">{review.name}</p>
                          <p className="text-xs text-text-muted">{review.course} • {review.date}</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-text-primary to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              พร้อมเริ่มต้นเส้นทางสู่ความสำเร็จ?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              สมัครเรียนวันนี้ แล้วค้นพบว่าทำไมนักเรียนกว่า 2,500 คนถึงเลือกอรรถปัญญา
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark text-text-primary font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                สมัครสมาชิกฟรี
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                ดูคอร์สเรียน
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
}
