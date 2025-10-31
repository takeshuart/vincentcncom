import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
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

interface QueryParams {
  hasImage: boolean;
  genre: string;
  period: string;
  technique: string;
  keyword: string;
  color: string;
  queryString: string;
}

interface ArtItem {
  id?: string | number;
  [key: string]: any;
}

interface ArtPage {
  page: number;
  rows: ArtItem[];
  totalCount: number;
  totalPages: number;
}

interface ConfigData {
  genres: string[];
  techniques: string[];
}

export const useArtSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keywordInput, setKeywordInput] = useState(() => searchParams.get('keyword') || '');

  // ---------------------- 解析 URL 参数 ----------------------
  const query: QueryParams = useMemo(() => {
    const newQuery = {
      hasImage: searchParams.get('hasImage') === 'true' || DEFAULT_QUERY.hasImage,
      genre: searchParams.get('genre') || DEFAULT_QUERY.genre,
      period: searchParams.get('period') || '',
      technique: searchParams.get('technique') || DEFAULT_QUERY.technique,
      keyword: searchParams.get('keyword') || DEFAULT_QUERY.keyword,
      color: searchParams.get('color') || DEFAULT_QUERY.color,
    };
    const queryString = new URLSearchParams({
      hasImage: String(newQuery.hasImage),
      genre: newQuery.genre,
      period: newQuery.period,
      technique: newQuery.technique,
      keyword: newQuery.keyword,
      color: newQuery.color,
    }).toString();
    return { ...newQuery, queryString };
  }, [searchParams]);


  // ---------------------- 配置数据 ----------------------
  const {
    data: configData = { genres: [], techniques: [] },
    isSuccess: isConfigLoaded,
  } = useQuery<ConfigData>({
    queryKey: ['configData'],
    queryFn: fetchConfigData,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // ---------------------- 无限滚动加载 ----------------------
  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading: isInitialLoading,
  } = useInfiniteQuery({
    queryKey: ['artworks', query.queryString],
    queryFn: async ({ pageParam }: { pageParam?: number }) => {
      const page = pageParam ?? 1;
      const artData = await fetchArtData(
        page,
        pageSize,
        query.keyword,
        query.hasImage,
        query.genre,
        query.period,
        query.technique,
        query.color
      );
      return {
        page,
        rows: artData.rows || [],
        totalCount: artData.totalCount || 0,
        totalPages: Math.ceil((artData.totalCount || 0) / pageSize),
      };
    },
    initialPageParam: 1, // ✅ React Query v5 必须显式定义初始页参数
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    refetchOnWindowFocus: false,
  });

  // ---------------------- 数据整合 ----------------------
  const artworks = useMemo(() => (data ? data.pages.flatMap((p) => p.rows) : []), [data]);
  const totalResults = data?.pages?.[0]?.totalCount || 0;
  const totalPages = data?.pages?.[0]?.totalPages || 0;

  // ---------------------- 自动加载逻辑 ----------------------
  const [pagesSinceMoreButton, setPagesSinceMoreButton] = useState(0);
  const canAutoLoad =
    hasNextPage && pagesSinceMoreButton < AUTO_LOAD_THRESHOLD && !isFetchingNextPage;

  const autoLoadNextPage = useCallback(() => {
    if (canAutoLoad) {
      fetchNextPage();
      setPagesSinceMoreButton((prev) => prev + 1);
    }
  }, [fetchNextPage, canAutoLoad]);

  const manualLoadNextPage = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
      setPagesSinceMoreButton(0);
    }
  }, [fetchNextPage, hasNextPage]);

  // ---------------------- UI 辅助逻辑 ----------------------
  const isNewSearch = isFetching && !isFetchingNextPage; // ✅ 保留搜索时半透明效果
  const remainingCount = Math.max(0, totalResults - artworks.length);
  const remainingPages = Math.max(0, Math.ceil(remainingCount / pageSize));

  // ---------------------- URL 更新函数 ----------------------
  const updateSearchParams = (newValues: Record<string, any>) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const newParams = { ...currentParams };
    for (const key in newValues) {
      const value = newValues[key];
      const isEmpty = !value || (Array.isArray(value) && value.length === 0);
      if (isEmpty) delete newParams[key];
      else newParams[key] = String(value);
    }
    setSearchParams(newParams);
  };

  // ---------------------- Handlers ----------------------
  const handleFilterChange = (key: string) => (event: any) => {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    updateSearchParams({ [key]: value });
  };

  const handleColorSelect = (color: string) => {
    updateSearchParams({ color, keyword: keywordInput });
  };

  const handlePeriodChange = (value: string) => {
    updateSearchParams({ period: value });
  };

  const handleSearchTrigger = (event?: any) => {
    if (event && event.preventDefault) event.preventDefault();
    updateSearchParams({ keyword: keywordInput });
  };

  // ---------------------- 导出 ----------------------
  return {
    query,
    keywordInput,
    setKeywordInput,
    artworks,
    totalResults,
    totalPages,
    isConfigLoaded,
    configData,
    isInitialLoading,
    isNewSearch,
    isFetchingNextPage,
    hasNextPage,
    autoLoadNextPage,
    manualLoadNextPage,
    canAutoLoad,
    remainingCount,
    remainingPages,
    handleFilterChange,
    handleColorSelect,
    handlePeriodChange,
    handleSearchTrigger,
  };
};
