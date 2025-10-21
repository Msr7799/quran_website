"use client";

import { useState, useEffect } from "react";
import { DotLoader } from "./dot-loader";

// Loading animation frames
const loading = [
    [0, 2, 4, 6, 20, 34, 48, 46, 44, 42, 28, 14, 8, 22, 36, 38, 40, 26, 12, 10, 16, 30, 24, 18, 32],
    [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47],
    [8, 22, 36, 38, 40, 26, 12, 10, 16, 30, 24, 18, 32],
    [9, 11, 15, 17, 19, 23, 25, 29, 31, 33, 37, 39],
    [16, 30, 24, 18, 32],
    [17, 23, 31, 25],
    [24],
];

// Searching animation frames
const searching = [
    [9, 16, 17, 15, 23],
    [10, 17, 18, 16, 24],
    [11, 18, 19, 17, 25],
    [18, 25, 26, 24, 32],
    [25, 32, 33, 31, 39],
    [32, 39, 40, 38, 46],
    [31, 38, 39, 37, 45],
    [30, 37, 38, 36, 44],
    [23, 30, 31, 29, 37],
    [31, 29, 37, 22, 24, 23, 38, 36],
    [16, 23, 24, 22, 30],
];

// Syncing animation frames (للتحسين والترجمة)
const syncing = [
    [45, 38, 31, 24, 17, 23, 25],
    [38, 31, 24, 17, 10, 16, 18],
    [31, 24, 17, 10, 3, 9, 11],
    [24, 17, 10, 3, 2, 4],
    [17, 10, 3],
    [10, 3],
    [3],
    [],
    [45],
    [45, 38, 44, 46],
    [45, 38, 31, 37, 39],
    [45, 38, 31, 24, 30, 32],
];

type LoadingIndicatorProps = {
    type?: "loading" | "searching" | "syncing";
    text?: string;
    className?: string;
};

export const LoadingIndicator = ({ 
    type = "loading", 
    text,
    className = "" 
}: LoadingIndicatorProps) => {
    const [currentType, setCurrentType] = useState<"loading" | "searching" | "syncing">(type);
    
    useEffect(() => {
        setCurrentType(type);
    }, [type]);
    
    // اختيار الـ frames حسب النوع
    const frames = currentType === "loading" 
        ? loading 
        : currentType === "searching" 
        ? searching 
        : syncing;
    
    // النص الافتراضي حسب النوع
    const defaultText = currentType === "loading" 
        ? "جاري التحميل..." 
        : currentType === "searching" 
        ? "جاري البحث..." 
        : "جاري المعالجة...";
    
    const displayText = text || defaultText;
    
    // السرعة حسب النوع
    const duration = currentType === "loading" ? 200 : currentType === "searching" ? 150 : 100;
    
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <DotLoader
                frames={frames}
                className="gap-px"
                isPlaying={true}
                repeatCount={-1}
                duration={duration}
                dotClassName="bg-chart-3/30 [&.active]:bg-chart-3 size-1.5 rounded-sm"
            />
            <span className="text-sm text-neutral-400 arabic-font">
                {displayText}
            </span>
        </div>
    );
};
