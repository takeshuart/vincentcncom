// src/hooks/useArtworkDetails.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
// 假设这些 API 函数存在且已导出
import { fetchArtworkById, getLettersByIds } from '../api/ArtworkApi'; 

// =================================================================
// 1. 类型定义 (Interfaces)
// =================================================================

// 假设从 API 获取的原始艺术品数据结构
interface RawArtwork {
    id: string;
    exhibitions?: string; // 原始数据中的 JSON 字符串
    letters?: string | number | null; // 可能是 ID 字符串、数字或 null
    primaryImageLarge?: string | null;
    primaryImageSmall?: string | null;
    shortDesc?: string | null;
    // ⚠️ 补充其他您会用到的字段，例如 title, artist, date 等
    [key: string]: any; // 允许其他未显式声明的属性
}

// 清洗后的艺术品数据结构
interface Artwork extends RawArtwork {
    exhibitionHistory: any[]; // 解析后的数组
}

interface ExternalLinks {
    // 根据实际使用的外部链接字段进行补充
    [key: string]: string;
}

interface Section {
    id: 'overview' | 'letters' | 'exhibition' | string;
    label: string;
    dataField: keyof Artwork | string;
}

interface LetterData {
    // 假设书信数据是一个对象数组
    id: string;
    title: string;
    content: string;
    // ...
}

interface UseArtworkDetailsResult {
    artwork: Artwork | null;
    extLinks: ExternalLinks;
    activeSection: string;
    lettersData: LetterData[] | null;
    isLoadingLetters: boolean;
    isLoadingArtwork: boolean;
    sections: Section[];
    setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

// =================================================================
// 2. 辅助函数
// =================================================================

/**
 * 辅助函数：清洗和预处理艺术品数据中的 JSON 字段和图片路径
 * @param fetchedArtwork - 原始 API 返回的作品数据
 * @returns 包含解析后字段的艺术品数据和外部链接对象
 */
const cleanArtworkData = (fetchedArtwork: RawArtwork): { processedArtwork: Artwork, extLinks: ExternalLinks } => {
    // 确保使用 RawArtwork 接口的属性
    const processedArtwork: Artwork = { ...fetchedArtwork, exhibitionHistory: [] };
    const extLinks: ExternalLinks = {};

    // 3. 解析 exhibitions
    try {
        if (processedArtwork.exhibitions) {
            // 尝试解析 JSON 字符串
            processedArtwork.exhibitionHistory = JSON.parse(processedArtwork.exhibitions);
        } else {
            processedArtwork.exhibitionHistory = [];
        }
    } catch (e) {
        console.error('Error parsing exhibitionHistory JSON:', e);
        processedArtwork.exhibitionHistory = [];
    }

    // 4. 图片路径处理
    if (processedArtwork.primaryImageLarge) {
        processedArtwork.primaryImageLarge = `/all-collections/${processedArtwork.primaryImageLarge}`;
    } else if (processedArtwork.primaryImageSmall) {
        processedArtwork.primaryImageLarge = `https://www.pubhist.com${processedArtwork.primaryImageSmall}`;
    }
    // 注意：如果原图 small 和 large 都不存在，primaryImageLarge 可能会保留原值或为 null

    return { processedArtwork, extLinks };
};

// =================================================================
// 3. 自定义 Hook
// =================================================================

/**
 * 封装作品详情页的数据获取、清洗和状态管理。
 * @param id - 作品 ID (通常是字符串)
 * @returns 包含作品数据、状态和操作函数的对象。
 */
const useArtworkDetails = (id: string): UseArtworkDetailsResult => {
    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [extLinks, setExtLinks] = useState<ExternalLinks>({});
    const [activeSection, setActiveSection] = useState<string>('overview');

    // 延迟加载数据和状态
    const [lettersData, setLettersData] = useState<LetterData[] | null>(null);
    const [isLoadingLetters, setIsLoadingLetters] = useState<boolean>(false);

    const [isLoadingArtwork, setIsLoadingArtwork] = useState<boolean>(true);

    // --- 1. 艺术品数据获取 (useEffect) ---
    useEffect(() => {
        if (!id) return;

        const fetchAndCleanArtwork = async (): Promise<void> => {
            setIsLoadingArtwork(true);
            setArtwork(null); 
            setExtLinks({});

            try {
                // 假设 fetchArtworkById 返回 RawArtwork 类型
                const fetchedArtwork: RawArtwork = await fetchArtworkById(id); 
                const { processedArtwork, extLinks: cleanedExtLinks } = cleanArtworkData(fetchedArtwork);

                setArtwork(processedArtwork);
                setExtLinks(cleanedExtLinks);

            } catch (error) {
                console.error('Error fetching artwork data', error);
                setArtwork(null);
            } finally {
                setIsLoadingArtwork(false);
            }
        };

        fetchAndCleanArtwork();
    }, [id]);

    // --- 2. 动态计算导航栏目 (useMemo) ---
    const sections = useMemo<Section[]>(() => {
        if (!artwork) return [];

        const sectionsList: Section[] = [
            { id: 'overview', label: '详情', dataField: 'shortDesc' },
            { id: 'letters', label: '梵高书信', dataField: 'letters' },
            { id: 'exhibition', label: '展出信息', dataField: 'exhibitions' },
            // ... 其他 section
        ];

        return sectionsList.filter(section => {
            if (section.id === 'overview') return true;

            const dataFieldKey = section.dataField as keyof Artwork;
            const dataFieldValue = artwork[dataFieldKey];

            // 针对 letters 字段进行特殊检查，因为它可能是 number 或 string
            if (section.id === 'letters') {
                return dataFieldValue != null && String(dataFieldValue).length > 0;
            }

            // 针对 exhibitions 字段进行特殊检查
            if (section.id === 'exhibition') {
                 // 检查原始字符串字段 exhibitions 
                return dataFieldValue && String(dataFieldValue).length > 0; 
            }

            // 检查其他字段是否有值
            return !!dataFieldValue;
        });
    }, [artwork]);

    // --- 3. 延迟加载书信数据 (useEffect) ---
    useEffect(() => {
        // 只有当切换到 'letters' 选项卡 且 尚未开始加载时，才执行加载
        if (artwork && activeSection === 'letters' && !lettersData && !isLoadingLetters) {
            const loadLetters = async (): Promise<void> => {
                setIsLoadingLetters(true);
                try {
                    // 假设 artwork.letters 是一个逗号分隔的 ID 字符串
                    if (artwork.letters) {
                         // 假设 getLettersByIds 接收 ID 字符串并返回 LetterData[]
                        const data: LetterData[] = await getLettersByIds(String(artwork.letters));
                        setLettersData(data);
                    } else {
                        setLettersData([]);
                    }
                } catch (error) {
                    console.error("Error loading letters:", error);
                    setLettersData([]);
                } finally {
                    setIsLoadingLetters(false);
                }
            };
            loadLetters();
        }
    }, [activeSection, artwork, lettersData, isLoadingLetters]); 
    // 依赖项中添加 artwork, lettersData 和 isLoadingLetters 以确保逻辑的正确性

    // --- 4. 返回结果 ---
    return {
        artwork,
        extLinks,
        activeSection,
        lettersData,
        isLoadingLetters,
        isLoadingArtwork,
        sections,
        setActiveSection,
    };
};

export default useArtworkDetails;