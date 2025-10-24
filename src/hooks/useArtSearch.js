import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchArtData, fetchConfigData } from '../api/ArtworkApi';

const pageSize = 9;
// 【新增常量】自动加载的页数限制 (N=3)

const DEFAULT_QUERY = {
    page: 1,
    hasImage: true,
    genre: '',
    technique: '',
    keyword: '',
    color: '',
};

export const useArtSearch = () => {

    //reading search parameters from url querystring 
    const [searchParams, setSearchParams] = useSearchParams();

    // Local state for the text input (transient state for typing speed)
    const [keywordInput, setKeywordInput] = useState('');
    // 【修改 2.3】 新增内部状态
    const [internalPage, setInternalPage] = useState(1);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
    const [lastQueryParams, setLastQueryParams] = useState(''); // 用于检测 URL 筛选条件是否变化
    // recover filters from querystring
    const query = useMemo(() => {
        const newQuery = { // 【修改 2.4】 从 URL 读取参数时，排除 page
            hasImage: searchParams.get('hasImage') === 'true' || DEFAULT_QUERY.hasImage,
            genre: searchParams.get('genre') || DEFAULT_QUERY.genre,
            period: searchParams.get('period') || '',
            technique: searchParams.get('technique') || DEFAULT_QUERY.technique,
            keyword: searchParams.get('keyword') || DEFAULT_QUERY.keyword,
            color: searchParams.get('color') || DEFAULT_QUERY.color,
        };
        // 添加一个用于唯一标识当前筛选状态的属性
        newQuery.queryString = new URLSearchParams(newQuery).toString();
        return newQuery;
    }, [searchParams]);

    // Initialize keywordInput from URL on mount/URL update
    useEffect(() => {
        setKeywordInput(query.keyword);
    }, [query.keyword]);

    // --- Data and Loading States ---
    const [artworks, setArtWorks] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalResults, setTotalResults] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfigLoaded, setIsConfigLoaded] = useState(false);
    const [configData, setConfigData] = useState({ genres: [], techniques: [] });

    // --- Configuration Fetch (Run Once) ---
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
        // Apply the new parameter set to the URL
        setSearchParams(newParams);
    };


    // Handler for general filter changes (genre, technique, etc.)
    const handleFilterChange = (key) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        updateSearchParams({ [key]: value });
    };

    // Handler for color selection
    const handleColorSelect = (color) => {
        updateSearchParams({ color: color, keyword: keywordInput });
    };

    // Handler for period changes (timeline)
    const handlePeriodChange = (value) => {
        updateSearchParams({ period: value });
    };

    // Handler for search button click and Enter key press
    const handleSearchTrigger = (event) => {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        // Sync keywordInput to URL
        updateSearchParams({ keyword: keywordInput });
    };

    // --- Main Data Fetching Logic (Runs on query change) ---
    // 【修改 2.8】 核心数据获取逻辑，增加了 append 参数
    const executeFetch = useCallback(async (page, append = false) => {

        if (append) {
            setIsFetchingNextPage(true);
        } else {
            setIsLoading(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        try {
            const artData = await fetchArtData(
                page, pageSize, // 使用传入的页码
                query.keyword,
                query.hasImage,
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
                setInternalPage(page); // 重置 internalPage 为 1
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
                setIsLoading(false);
            }
        }
    }, [
        query.keyword, query.hasImage, query.genre,
        query.period, query.technique, query.color
    ]);

    // 【修改 2.9】 Effect to trigger data fetching whenever 'query' (filters/search) changes
    useEffect(() => {
        // 如果 URL 参数字符串发生变化，说明是新的搜索或筛选
        if (query.queryString !== lastQueryParams) {
            // 重置并从第一页开始加载 (非追加模式)
            executeFetch(1, false);
            setLastQueryParams(query.queryString); // 更新上次的查询参数字符串
        }
    }, [query.queryString, lastQueryParams, executeFetch]);

    // 【修改 2.10】 暴露给组件的“加载下一页”函数
    const fetchNextPage = useCallback(() => {
        // 只有当还有下一页并且当前没有其他加载在进行时才执行
        if (internalPage < totalPages && !isFetchingNextPage && !isLoading) {
            const nextPage = internalPage + 1;
            executeFetch(nextPage, true); // 加载下一页，并设置为追加模式 (true)

            // 【重要】在成功请求发起后立即更新 internalPage，防止重复触发
            setInternalPage(nextPage);
        }
    }, [internalPage, totalPages, isFetchingNextPage, isLoading, executeFetch]);

    // 【修改 2.11】 判断是否还有下一页
    const hasNextPage = internalPage < totalPages;
    // --- Return all necessary states and handlers ---
    return {
        // Query/Input States
        query,
        keywordInput,
        setKeywordInput, // Only keywordInput setter is needed by the component

        // Data States
        artworks,
        // 移除 query.page
        totalPages,
        totalResults,
        isLoading,
        isConfigLoaded,
        configData,

        // 【修改 2.12】 新增的无限滚动相关状态和函数
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,

        // Handlers
        handleFilterChange,
        handleColorSelect,
        handlePeriodChange,
        handleSearchTrigger,
        // 移除 handlePageChange
    };
};