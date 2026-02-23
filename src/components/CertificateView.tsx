'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Share2, ShieldCheck, Calendar, User, BookOpen } from 'lucide-react';
import { UserCertificate } from '@/types';

interface CertificateViewProps {
    certificate: UserCertificate;
    onClose?: () => void;
}

export default function CertificateView({ certificate, onClose }: CertificateViewProps) {
    const certificateRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex flex-col items-center">
            {/* Certificate Canvas */}
            <div
                ref={certificateRef}
                className="relative w-full aspect-[1.414/1] bg-white border-[16px] border-double border-primary/20 p-12 overflow-hidden shadow-2xl rounded-sm"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.02) 1px, transparent 0)', backgroundSize: '24px 24px' }}
            >
                {/* Decorative Borders */}
                <div className="absolute inset-4 border border-primary/10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                {/* Content */}
                <div className="h-full flex flex-col items-center justify-between text-center relative z-10">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Award className="w-10 h-10 text-primary-dark" />
                        </div>
                        <h1 className="text-3xl font-black text-text-primary tracking-widest uppercase mb-1">Certificate of Completion</h1>
                        <p className="text-sm font-bold text-primary-dark tracking-[0.2em] uppercase">Attapanya Institute of Excellence</p>
                    </div>

                    <div>
                        <p className="text-text-secondary italic mb-2">This is to certify that</p>
                        <h2 className="text-4xl font-black text-text-primary mb-2 underline decoration-primary/30 decoration-4 underline-offset-8">
                            {certificate.studentName}
                        </h2>
                        <p className="text-text-secondary max-w-md">
                            has successfully completed the comprehensive online course
                        </p>
                        <h3 className="text-xl font-bold text-primary-dark mt-2 tracking-tight">
                            &quot;{certificate.courseTitle}&quot;
                        </h3>
                    </div>

                    <div className="w-full flex justify-between items-end border-t border-border/50 pt-8 mt-4 px-8">
                        <div className="text-left">
                            <div className="flex items-center gap-2 text-text-muted mb-1">
                                <Calendar className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Issued On</span>
                            </div>
                            <p className="text-xs font-bold text-text-primary">
                                {new Date(certificate.issuedAt).toLocaleDateString('th-TH', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-16 h-1 bg-text-primary mb-2" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Director Signature</p>
                        </div>

                        <div className="text-right">
                            <div className="flex items-center justify-end gap-2 text-text-muted mb-1">
                                <ShieldCheck className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Verification Code</span>
                            </div>
                            <p className="text-[10px] font-mono font-bold text-text-primary">{certificate.verificationCode}</p>
                        </div>
                    </div>
                </div>

                {/* Watermark Logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none rotate-[-15deg]">
                    <Award className="w-64 h-64" />
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4 no-print">
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-3 bg-text-primary text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg"
                >
                    <Download className="w-5 h-5" />
                    Print / Save PDF
                </button>
                <button
                    className="flex items-center gap-2 px-6 py-3 border border-border bg-white text-text-primary rounded-2xl font-bold hover:bg-surface transition-colors"
                >
                    <Share2 className="w-5 h-5" />
                    Share
                </button>
            </div>

            <style jsx global>{`
                @media print {
                    nav, footer, .no-print, .backdrop-blur-md {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        padding: 0 !important;
                    }
                    .max-w-7xl {
                        max-width: none !important;
                        padding: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}
