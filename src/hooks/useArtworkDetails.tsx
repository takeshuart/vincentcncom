import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchArtworkById, getLettersByIds } from '../api/ArtworkApi';

interface RawArtwork {
    id: string;
    exhibitions?: string;
    letters?: string | number | null;
    primaryImageLarge?: string | null;
    primaryImageSmall?: string | null;
    shortDesc?: string | null;
    // 补充其他您会用到的字段，例如 title, artist, date 等
    [key: string]: any; // 允许其他未显式声明的属性
}

// 清洗后的艺术品数据结构
interface Artwork extends RawArtwork {
    exhibitionHistory: any[];
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
    id: string;
    title: string;
    content: string;
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

/**
 * 辅助函数：清洗和预处理艺术品数据中的 JSON 字段和图片路径
 * @param fetchedArtwork - 原始 API 返回的作品数据
 */
const cleanArtworkData = (fetchedArtwork: RawArtwork): { processedArtwork: Artwork, extLinks: ExternalLinks } => {
    const processedArtwork: Artwork = { ...fetchedArtwork, exhibitionHistory: [] };
    const extLinks: ExternalLinks = {};

    try {
        if (processedArtwork.exhibitions) {
            processedArtwork.exhibitionHistory = JSON.parse(processedArtwork.exhibitions);
        } else {
            processedArtwork.exhibitionHistory = [];
        }
    } catch (e) {
        console.error('Error parsing exhibitionHistory JSON:', e);
        processedArtwork.exhibitionHistory = [];
    }

    if (processedArtwork.primaryImageLarge) {
        processedArtwork.primaryImageLarge = `/all-collections/${processedArtwork.primaryImageLarge}`;
    } else if (processedArtwork.primaryImageSmall) {
        processedArtwork.primaryImageLarge = `https://www.pubhist.com${processedArtwork.primaryImageSmall}`;
    }

    return { processedArtwork, extLinks };
};

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
        setActiveSection
    };
};

export default useArtworkDetails;