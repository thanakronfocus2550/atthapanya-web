'use client';

import { useEffect } from 'react';
import { useSiteData } from '@/components/SiteDataProvider';

export default function MetadataUpdater() {
    const { data } = useSiteData();
    const { settings } = data;

    useEffect(() => {
        if (settings.metaTitle) {
            document.title = settings.metaTitle;
        } else {
            document.title = settings.siteName || 'อรรถปัญญา';
        }

        if (settings.metaDescription) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', settings.metaDescription);
            }
        }
    }, [settings.metaTitle, settings.metaDescription, settings.siteName]);

    return null;
}
