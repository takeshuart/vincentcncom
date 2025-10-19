import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';


/**
 * 弃用原因：
 * 1. 渐变色带中的很多色彩无法匹配到作品
 * 2. 通过色彩分析，发现梵高的作品整体偏黄、土、灰绿三大块色域；鲜艳纯蓝和紫色几乎缺席。
 * 改成由梵高作品中占比较高的色块，形成一个“梵高色谱”。
 * 3. 限制选择可使筛选更符合艺术风格与调性。例如，用户选“赭黄”更容易获得有意义的结果（麦田、向日葵等）。
 * 
 * 折中方案：使用 6–8 个主色块展示为默认入口，同时保留一个“小色盘”或“更多颜色”按钮，供进阶用户进行连续选择。
 * 
 * @file ColorSearchBar.tsx
 * @description 颜色检索条组件。提供一个高精度的、可拖动的色彩渐变选择器。
 *
 * 核心功能：
 * 1. 在视觉上展示一条平滑的艺术化色彩渐变带。
 * 2. 允许用户通过点击或拖动来选择色带上的任意颜色。
 * 3. 将选中的颜色（HEX 值）实时输出给父组件，用于触发筛选或检索。
 *
 * 关键实现原理（解决前端难题）：
 * 浏览器无法直接从 CSS 渐变中读取像素颜色，为实现高精度取色：
 * 1. 采用 **离屏 Canvas 代理** 技术。
 * 2. 在内存中创建一个 1px 高的 Canvas，并用 JS API 绘制一个与可见 CSS 渐变完全一致的渐变。
 * 3. 用户点击时，根据点击位置，从 Canvas 上使用 `getImageData()` API **精确读取**对应的像素颜色。
 * 4. 通过全局事件监听 (`mousemove`, `touchmove`)，实现流畅的拖动体验。
 */

function rgbToHex(r: number, g: number, b: number) {
    const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
    const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

interface ColorSearchBarProps {
    onColorSelect: (colorValue: string) => void;
    initialColor?: string;
}

const COLOR_STOPS = [
    { pos: 0, color: '#1F4287' }, // 深藏青
    { pos: 20, color: '#2F9C95' }, // 沉静青绿
    { pos: 40, color: '#F7B500' }, // 油画黄
    { pos: 60, color: '#F35335' }, // 焦橙红
    { pos: 80, color: '#C44C8F' }, // 深玫瑰红
    { pos: 100, color: '#8F3985' }, // 深紫罗兰
];

// --- ColorSearchBar 组件 ---
const ColorSearchBar: React.FC<ColorSearchBarProps> = ({
    onColorSelect,
    initialColor = COLOR_STOPS[0].color,
}) => {
    const [selectedColor, setSelectedColor] = useState<string>(initialColor);
    const [indicatorPosition, setIndicatorPosition] = useState<number>(0); // 初始位置设为 0%

    const barRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isDraggingRef = useRef(false);

    // CSS for visible gradient bar
    const gradientCss = {
        height: '30px',
        borderRadius: '4px',
        cursor: 'crosshair',
        backgroundImage:
            'linear-gradient(to right, #1F4287, #2F9C95, #F7B500, #F35335, #C44C8F, #8F3985)',
        border: '1px solid #ddd',
        position: 'relative' as const,
        overflow: 'hidden',
    };

    const prepareCanvas = useCallback(() => {
        const bar = barRef.current;
        if (!bar) return;

        // 获取可见色条的精确宽度
        const rect = bar.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect.width));
        const h = 1; // 只需要 1px 高度即可进行水平采样
        let canvas = canvasRef.current;
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvasRef.current = canvas;
        }
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 绘制与 CSS 渐变完全一致的渐变
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        COLOR_STOPS.forEach((stop) => {
            grad.addColorStop(stop.pos / 100, stop.color);
        });

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }, []);

    // 根据点击/拖动位置采样颜色
    const sampleColorAtEvent = useCallback(
        (clientX: number) => {
            const bar = barRef.current;
            const canvas = canvasRef.current;
            if (!bar || !canvas || canvas.width === 0) return null;

            const rect = bar.getBoundingClientRect();
            // 限制 x 坐标在色条范围内
            const x = Math.min(Math.max(clientX - rect.left, 0), rect.width - 1); 
            
            // 计算 Canvas 上的像素索引
            const idx = Math.floor((x / rect.width) * canvas.width);

            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            const pixel = ctx.getImageData(idx, 0, 1, 1).data; 
            const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
            
            // 计算指示器位置百分比 (基于像素索引)
            const percentage = (idx / Math.max(1, canvas.width - 1)) * 100;

            return { hex, percentage };
        },
        []
    );
    
    // --- 事件处理函数 ---
    
    // PointerDown (点击开始 / 拖动开始)
    const handlePointerDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
            e.preventDefault();
            isDraggingRef.current = true;
            
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
            const sampled = sampleColorAtEvent(clientX);
            
            if (sampled) {
                setSelectedColor(sampled.hex);
                setIndicatorPosition(sampled.percentage);
                onColorSelect(sampled.hex);
            }
        },
        [onColorSelect, sampleColorAtEvent]
    );
    
    // PointerMove (拖动中)
    const handlePointerMove = useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (!isDraggingRef.current) return;
            
            const clientX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
            const sampled = sampleColorAtEvent(clientX);
            
            if (sampled) {
                setSelectedColor(sampled.hex);
                setIndicatorPosition(sampled.percentage);
                onColorSelect(sampled.hex);
            }
        },
        [onColorSelect, sampleColorAtEvent]
    );

    // PointerUp (拖动结束)
    const handlePointerUp = useCallback(() => {
        isDraggingRef.current = false;
    }, []);

    // --- Effects: Canvas 准备和事件监听 ---
    
    // 1. 准备 Canvas 和 窗口尺寸监听
    useEffect(() => {
        // 首次挂载和窗口尺寸改变时重绘 Canvas
        prepareCanvas();
        const onResize = () => {
            // 使用 setTimeout 延迟，确保 DOM 布局稳定后再获取宽度
            setTimeout(prepareCanvas, 100); 
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [prepareCanvas]);
    
    // 2. 注册全局拖动事件
    useEffect(() => {
        // 注册到 window 上，以便用户在色条外释放鼠标时也能停止拖动
        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('touchmove', handlePointerMove, { passive: false });
        window.addEventListener('mouseup', handlePointerUp);
        window.addEventListener('touchend', handlePointerUp);
        
        return () => {
            window.removeEventListener('mousemove', handlePointerMove);
            window.removeEventListener('touchmove', handlePointerMove);
            window.removeEventListener('mouseup', handlePointerUp);
            window.removeEventListener('touchend', handlePointerUp);
        };
    }, [handlePointerMove, handlePointerUp]);

    // 3. 初始颜色同步 (如果需要，可将初始颜色设置到指示器位置)
    /* useEffect(() => {
        if (initialColor) {
             // 这是一个高级操作，需要搜索 Canvas 找到 initialColor 的位置，这里省略
        }
    }, [initialColor]); */
    
    return (
        <Box sx={{ width: '100%', my: 2 }}>
            <Box
                ref={barRef}
                sx={gradientCss}
                onMouseDown={handlePointerDown as any} // 鼠标点击和拖动
                onTouchStart={handlePointerDown as any} // 触摸开始
            >
                {/* 颜色指示器圆点 */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: `${indicatorPosition}%`,
                        transform: 'translate(-50%, -50%)',
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: '2px solid white',
                        backgroundColor: selectedColor, // ⭐️ 显示精确的颜色
                        transition: 'left 0.08s linear, background-color 0.08s linear',
                        boxShadow: '0 0 6px rgba(0,0,0,0.5)',
                        pointerEvents: 'none', // 确保点击穿透到 barRef
                    }}
                />
            </Box>
        </Box>
    );
};

