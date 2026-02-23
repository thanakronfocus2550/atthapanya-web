export default function Logo({ size = 36, src }: { size?: number, src?: string }) {
    if (src) {
        return (
            <img
                src={src}
                alt="Logo"
                width={size}
                height={size}
                className="rounded-lg object-contain"
                onError={(e) => {
                    // Fallback to SVG if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />
        );
    }
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Background circle */}
            <circle cx="24" cy="24" r="24" fill="url(#logo-grad)" />
            {/* Book shape */}
            <path
                d="M14 16C14 15.4 14.4 15 15 15H22C22.6 15 23 15.4 23 16V33C23 33.6 22.6 34 22 34H15C14.4 34 14 33.6 14 33V16Z"
                fill="#FFFFFF"
                opacity="0.9"
            />
            <path
                d="M25 16C25 15.4 25.4 15 26 15H33C33.6 15 34 15.4 34 16V33C34 33.6 33.6 34 33 34H26C25.4 34 25 33.6 25 33V16Z"
                fill="#FFFFFF"
                opacity="0.7"
            />
            {/* Center line */}
            <rect x="23" y="14" width="2" height="21" rx="1" fill="#FFFFFF" />
            {/* Star / sparkle on top */}
            <path
                d="M24 10L25.2 12.4L27.8 12.8L25.9 14.6L26.4 17.2L24 16L21.6 17.2L22.1 14.6L20.2 12.8L22.8 12.4L24 10Z"
                fill="#FFFFFF"
            />
            <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="var(--primary-color, #FACC15)" />
                    <stop offset="1" stopColor="var(--primary-color-dark, #D97706)" />
                </linearGradient>
            </defs>
        </svg>
    );
}
