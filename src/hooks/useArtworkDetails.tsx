import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchArtworkById, getLettersByIds } from '../api/ArtworkApi';
import { useQuery } from '@tanstack/react-query';

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

interface Artwork extends RawArtwork {
    exhibitionHistory: any[];
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
    artwork?: Artwork;
    activeSection: string;
    lettersData?: LetterData[]
    isLoadingLetters: boolean;
    isLoadingArtwork: boolean;
    sections: Section[];
    setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

const cleanArtworkData = (fetchedArtwork: RawArtwork): { processedArtwork: Artwork } => {
    const processedArtwork: Artwork = { ...fetchedArtwork, exhibitionHistory: [] };

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

    return { processedArtwork };
};


const useArtworkDetails = (id: string): UseArtworkDetailsResult => {
    // const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [activeSection, setActiveSection] = useState<string>('overview');

    const {
        data: artwork,
        isLoading: isLoadingArtwork,
        error: artworkError
    } = useQuery({
        queryKey: ['artwork', id],
        queryFn: async () => {
            const fetchedArtwork = await fetchArtworkById(id);
            const { processedArtwork } = cleanArtworkData(fetchedArtwork);
            // setArtwork(processedArtwork);
            return processedArtwork;
        },
        staleTime: 1000 * 60 * 5,
        retry: 2,
        gcTime: 1000 * 60 * 10,
    });

    // --- 2. 动态计算导航栏目  ---
    const sections = useMemo<Section[]>(() => {
        const result: Section[] = [{ id: 'overview', label: '概览', dataField: 'overview' },];
        if (artwork?.letters) {
            result.push({ id: 'letters', label: '梵高书信', dataField: 'letters' });
        }
        if (artwork?.exhibitionHistory?.length) {
            result.push({ id: 'exhibition', label: '展览历史', dataField: 'exhibitionHistory' });
        }
        return result;
    }, [artwork]);

    const {
        data: lettersData,
        isLoading: isLoadingLetters,
    } = useQuery({
        queryKey: ['letters', artwork?.letters],
        queryFn: async () => {
            const res = await getLettersByIds(String(artwork?.letters));
            if (Array.isArray(res)) return res;
            return [];
        },
        enabled: activeSection === 'letters' && !!artwork?.letters,
        retry: 1,
        gcTime: 1000 * 60 * 10,
    });

    return {
        artwork,
        activeSection,
        lettersData,
        isLoadingLetters,
        isLoadingArtwork,
        sections,
        setActiveSection
    };
};

export default useArtworkDetails;