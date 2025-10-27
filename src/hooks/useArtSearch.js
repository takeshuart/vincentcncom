import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchArtData, fetchConfigData } from '../api/ArtworkApi';

const pageSize = 9;
const AUTO_LOAD_THRESHOLD = 2;
const DEFAULT_QUERY = {
    hasImage: true,
    genre: '',
    technique: '',
    keyword: '',
    color: '',
};

export const useArtSearch = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [keywordInput, setKeywordInput] = useState('');

    const [internalPage, setInternalPage] = useState(1);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
    const [lastQueryParams, setLastQueryParams] = useState('');
    const [pagesSinceMoreButton, setPagesSinceMoreButton] = useState(0);

    // recover filters from querystring (page parameter excluded)
    //TODO Config Data使用本地缓存，在一次会话中不再重复加载
    const query = useMemo(() => {
        const newQuery = {
            hasImage: searchParams.get('hasImage') === 'true' || DEFAULT_QUERY.hasImage,
            genre: searchParams.get('genre') || DEFAULT_QUERY.genre,
            period: searchParams.get('period') || '',
            technique: searchParams.get('technique') || DEFAULT_QUERY.technique,
            keyword: searchParams.get('keyword') || DEFAULT_QUERY.keyword,
            color: searchParams.get('color') || DEFAULT_QUERY.color,
        };
        newQuery.queryString = new URLSearchParams(newQuery).toString();
        return newQuery;
    }, [searchParams]);

    useEffect(() => {
        setKeywordInput(query.keyword);
    }, [query.keyword]);

    // --- Data and Loading States ---
    const [artworks, setArtWorks] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalResults, setTotalResults] = useState(0);
    //loading first page
    const [isNewSearch, setIsNewSearch] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isConfigLoaded, setIsConfigLoaded] = useState(false);
    const [configData, setConfigData] = useState({ genres: [], techniques: [] });



    useEffect(() => {
        fetchConfigData()
            .then(data => { setConfigData(data); setIsConfigLoaded(true); })
            .catch(error => { console.error('Error fetching config data', error); setIsConfigLoaded(true); });
    }, []);

    // --- Utility Function to Update URL Parameters ---
    const updateSearchParams = (newValues) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        let newParams = { ...currentParams };

        for (const key in newValues) {
            let value = newValues[key];
            const isEmpty = !value || (Array.isArray(value) && value.length === 0);
            if (isEmpty) {
                delete newParams[key];
            } else {
                newParams[key] = String(value);
            }
        }
        setSearchParams(newParams);
    };

    // --- Handlers (Filter, Search) ---
    const handleFilterChange = (key) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        updateSearchParams({ [key]: value });
    };

    const handleColorSelect = (color) => {
        updateSearchParams({ color: color, keyword: keywordInput });
    };

    const handlePeriodChange = (value) => {
        updateSearchParams({ period: value });
    };

    const handleSearchTrigger = (event) => {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        updateSearchParams({ keyword: keywordInput });
    };

    // --- Core Data Fetching Logic ---
    //append: 是否第一页
    const executeFetch = useCallback(async (page, append = false) => {
        if (append) {
            setIsFetchingNextPage(true);
        } else {
            setIsNewSearch(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        try {
            const artData = await fetchArtData(
                page, pageSize,
                query.keyword, query.hasImage,
                query.genre, query.period, query.technique,
                query.color
            );

            const received = Array.isArray(artData.rows) ? artData.rows : [];
            const newTotalPages = Math.ceil(artData.totalCount / pageSize);

            if (append) {
                // 加载下一页：追加数据
                setArtWorks(prevArtworks => [...prevArtworks, ...received]);
            } else {
                // 新搜索/筛选：替换数据并重置页码
                setArtWorks(received);
                setInternalPage(page);
            }

            setTotalPages(newTotalPages);
            setTotalResults(artData.totalCount);

        } catch (error) {
            console.error('Error fetching art data', error);
            if (!append) {
                setArtWorks([]);
                setTotalPages(0);
                setTotalResults(0);
            }
        } finally {
            if (append) {
                setIsFetchingNextPage(false);
            } else {
                if (isInitialLoading) {
                    setIsInitialLoading(false);
                }
                setIsNewSearch(false);
            }
        }
    }, [
        query.keyword, query.hasImage, query.genre,
        query.period, query.technique, query.color,
        isInitialLoading
    ]);

    // Effect to reset state on new query
    useEffect(() => {
        // 首次加载后，isConfigLoaded 变为 true 
        const isReadyToFetchFirstTime = isConfigLoaded && isInitialLoading;

        // 新的搜索/筛选：isConfigLoaded=true 且 query.queryString 确实发生了变化
        const isNewQuery = isConfigLoaded && query.queryString !== lastQueryParams && !isInitialLoading; // 确保只在首次加载完成后才检查查询变化

        // 【修正后的逻辑】
        if (isReadyToFetchFirstTime || isNewQuery) {
            executeFetch(1, false);
            setLastQueryParams(query.queryString);
            setPagesSinceMoreButton(0);
        }

    }, [query.queryString, lastQueryParams, executeFetch, isConfigLoaded, isInitialLoading]); // 新增 isInitialLoading 依赖项

    // 【新增函数 1】 IntersectionObserver 调用的自动加载函数
    const autoLoadNextPage = useCallback(() => {
        const nextPage = internalPage + 1;

        if (internalPage < totalPages && !isFetchingNextPage && !isNewSearch) {
            // 检查是否达到自动加载阈值
            if (pagesSinceMoreButton < AUTO_LOAD_THRESHOLD) {
                executeFetch(nextPage, true);
                setInternalPage(nextPage);
                // 自动加载计数 +1
                setPagesSinceMoreButton(prev => prev + 1);
            }
        }
    }, [internalPage, totalPages, isFetchingNextPage, executeFetch, pagesSinceMoreButton, isNewSearch]);

    // 【新增函数 2】 按钮点击调用的手动加载函数
    const manualLoadNextPage = useCallback(() => {
        const nextPage = internalPage + 1;

        if (internalPage < totalPages && !isFetchingNextPage && !isNewSearch) {
            executeFetch(nextPage, true);
            setInternalPage(nextPage);
            // 按钮加载后，重置计数为 0，允许下一次自动加载批次从头开始
            setPagesSinceMoreButton(0);
        }
    }, [internalPage, totalPages, isFetchingNextPage, executeFetch, isNewSearch]);

    // --- 导出状态和计算值 ---
    // 是否允许 IntersectionObserver 触发自动加载
    const canAutoLoad = internalPage < totalPages && pagesSinceMoreButton < AUTO_LOAD_THRESHOLD;

    // 剩余数量计算
    const hasNextPage = internalPage < totalPages;
    const remainingCount = totalResults - artworks.length;
    // 确保剩余页数至少为 0
    const remainingPages = Math.max(0, Math.ceil(remainingCount / pageSize));


    // --- Return all necessary states and handlers ---
    return {
        // Query/Input States
        query,
        keywordInput,
        setKeywordInput,

        // Data States
        artworks,
        totalPages,
        totalResults,
        isConfigLoaded,
        configData,

        // 【合并后状态】
        isInitialLoading,
        isNewSearch: isNewSearch && !isInitialLoading,

        // 混合加载状态和函数
        hasNextPage,
        autoLoadNextPage,
        manualLoadNextPage,
        isFetchingNextPage, // 分页加载中
        canAutoLoad,

        // 剩余数量信息
        remainingCount,
        remainingPages,

        // Handlers
        handleFilterChange,
        handleColorSelect,
        handlePeriodChange,
        handleSearchTrigger,
    };
};