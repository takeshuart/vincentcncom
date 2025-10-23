// src/hooks/useArtworkDetails.js

import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchArtworkById, getLettersByIds } from '../api/ArtworkApi';

/**
 * 辅助函数：清洗和预处理艺术品数据中的 JSON 字段和图片路径
 * @param {object} fetchedArtwork - 原始 API 返回的作品数据
 * @returns {object} 包含解析后字段的艺术品数据和外部链接对象
 */
const cleanArtworkData = (fetchedArtwork) => {
    const processedArtwork = { ...fetchedArtwork };
    const extLinks = {};


    // 3. 解析 exhibitions
    try {
        processedArtwork.exhibitionHistory = processedArtwork.exhibitions
            ? JSON.parse(processedArtwork.exhibitions)
            : [];
    } catch (e) {
        console.error('Error parsing exhibitionHistory JSON:', e);
        processedArtwork.exhibitionHistory = [];
    }

    // 4. 图片路径处理 (可选，但原代码有，这里保留)
    if (processedArtwork.primaryImageLarge) {
        processedArtwork.primaryImageLarge = `/all-collections/${processedArtwork.primaryImageLarge}`;
    } else if (processedArtwork.primaryImageSmall) {
        processedArtwork.primaryImageLarge = `https://www.pubhist.com${processedArtwork.primaryImageSmall}`;
    }

    return { processedArtwork, extLinks };
};

/**
 * 封装作品详情页的数据获取、清洗和状态管理。
 * @param {string} id - 作品 ID
 * @returns {object} 包含作品数据、状态和操作函数的对象。
 */
const useArtworkDetails = (id) => {
    const [artwork, setArtwork] = useState(null);
    const [extLinks, setExtLinks] = useState({});
    const [activeSection, setActiveSection] = useState('overview');//default section

    // 延迟加载数据和状态
    const [lettersData, setLettersData] = useState(null);
    const [isLoadingLetters, setIsLoadingLetters] = useState(false);

    const [isLoadingArtwork, setIsLoadingArtwork] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchAndCleanArtwork = async () => {
            setIsLoadingArtwork(true);
            setArtwork(null); // 重置数据
            setExtLinks({});

            try {
                const fetchedArtwork = await fetchArtworkById(id);
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

    // --- 2. 动态计算导航栏目 (保持不变) ---
    const sections = useMemo(() => {
        if (!artwork) return [];

        const sectionsList = [
            { id: 'overview', label: '详情', dataField: 'shortDesc' },
            { id: 'letters', label: '梵高书信', dataField: 'letters' },
            { id: 'exhibition', label: '展出信息', dataField: 'exhibitions' },
        ];

        return sectionsList.filter(section => {
            if (section.id === 'overview') return true;
            if (section.id === 'letters') return artwork.letters && String(artwork.letters).length > 0
            if (section.id === 'exhibition') return artwork.exhibitions && artwork.exhibitions.length > 0;

            // 检查其他字段是否有值
            return !!artwork[section.dataField];
        });
    }, [artwork]);


    useEffect(() => {

        if (activeSection === 'letters' && !isLoadingLetters) {
            const loadLetters = async () => {
                setIsLoadingLetters(true);
                try {
                    const data = await getLettersByIds(artwork.letters);
                    setLettersData(data);
                } catch (error) {
                    console.error("Error loading letters:", error);
                    setLettersData([]);
                } finally {
                    setIsLoadingLetters(false);
                }
            };
            loadLetters();
        }
    }, [activeSection]); //load letters while switch to Letters Tab


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