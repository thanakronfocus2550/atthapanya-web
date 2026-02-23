'use client';

import React from 'react';
import { Play, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
    url: string;
    onEnded?: () => void;
}

export default function VideoPlayer({ url, onEnded }: VideoPlayerProps) {
    // Basic YouTube ID extractor
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Basic Vimeo ID extractor
    const getVimeoId = (url: string) => {
        const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
        return match ? match[1] : null;
    };

    const youtubeId = getYouTubeId(url);
    const vimeoId = getVimeoId(url);

    if (youtubeId) {
        return (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube Video"
                />
            </div>
        );
    }

    if (vimeoId) {
        return (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                <iframe
                    src={`https://player.vimeo.com/video/${vimeoId}?autoplay=0&muted=0`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Vimeo Video"
                />
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-surface-dark flex flex-col items-center justify-center border-2 border-dashed border-border group">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary-dark mb-4 transition-transform group-hover:scale-110">
                <Play className="w-8 h-8 fill-primary-dark" />
            </div>
            <h3 className="text-text-primary font-bold mb-2">ไม่พบ URL วิดีโอที่รองรับ</h3>
            <p className="text-text-secondary text-sm px-8 text-center max-w-sm">
                โปรดใช้ URL จาก YouTube หรือ Vimeo เพื่อแสดงผลวิดีโอในหน้านี้
            </p>
            {url && (
                <div className="mt-4 p-3 bg-white rounded-xl border border-border text-xs font-mono text-text-muted select-all">
                    {url}
                </div>
            )}
        </div>
    );
}
