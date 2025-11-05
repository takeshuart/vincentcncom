import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchArtData, fetchConfigData, QueryParams } from '../api/ArtworkApi';
import { QueryKeys } from '@/types/enum';

const AUTO_LOAD_THRESHOLD = 2;
const PAGE_SIZE = 9;

export type UpdateQueryFilterFn = (key: QueryKeys, value: string) => void;

interface ConfigData {
  genres: string[];
  techniques: string[];
}

export const useArtSearch = () => {

  // useSearchParams gives you a stateful interface to read and update the URL query parameters.
  // It automatically syncs with the current location (include url querystring)
  // This allows restoring filter states when the user navigates back to the SearchPage from DetailPage.
  const [searchParams, setSearchParams] = useSearchParams();

  // The 'query' object is memoized using useMemo.
  // Whenever any of the search parameters change, a new query object reference is created.
  // This is important because useInfiniteQuery depends on 'queryKey'.
  // When the query object's reference changes, it signals React Query that the queryKey has changed,
  // causing useInfiniteQuery to automatically re-run its queryFn and fetch new data.

  const query: QueryParams = useMemo(() => {
    const newQuery: QueryParams = {
      hasImage: searchParams.get(QueryKeys.HAS_IMAGE) !== 'false', //default is TRUE
      searchText: searchParams.get(QueryKeys.SEARCH_TEXT) ?? '',
      genre: searchParams.get(QueryKeys.GENRE) ?? '',
      period: searchParams.get(QueryKeys.PERIOD) ?? '',
      technique: searchParams.get(QueryKeys.TECHNIQUE) ?? '',
      color: searchParams.get(QueryKeys.COLOR) ?? '',
    }
    newQuery.queryString = JSON.stringify(newQuery);

    return newQuery
  }, [searchParams])

  const {
    data: configData = { genres: [], techniques: [] },
    isSuccess: isConfigLoaded,
  } = useQuery<ConfigData>({
    queryKey: ['configData'],
    queryFn: fetchConfigData,
    staleTime: Infinity,
    gcTime: Infinity,//only load once
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });


  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage, //queryFn
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    //The array is a composite key for the cache.
    //execute queryFn when the array data (cache key) has Chanaged
    queryKey: [query.queryString],

    queryFn: async ({ pageParam }: { pageParam?: number }) => {
      const page = pageParam ?? 1
      query.page = page; //default is 1
      query.pageSize = PAGE_SIZE
      const artData = await fetchArtData(query);
      return {
        page,
        rows: artData.rows || [],
        totalCount: artData.totalCount || 0,
        totalPages: Math.ceil((artData.totalCount || 0) / PAGE_SIZE),
      };
    },
    initialPageParam: 1, // pass to pageParam
    getNextPageParam: (pagingInfo) =>//from queryFn return value
      pagingInfo.page < pagingInfo.totalPages ? pagingInfo.page + 1 : undefined,
    refetchOnWindowFocus: false,//Forbid reload while switch browser TAB
    refetchOnReconnect: false,   // Forbid reload while network reconnect
    //The cached data is always used until its gcTime expires, the cache is cleared, and a new request for data is initiated.
    staleTime: Infinity, 
    // gcTime: 0, // 
    // Use previous data as a placeholder to prevent UI flicker(if `data`=undefined) when the queryKey changes.
    // Data remains visible while `isFetching` is true and the new results load.
    placeholderData: (previousData) => previousData
  });

  const isFirstLoad = isLoading && !data; // not cache any data
  // console.log(`isFirstLoad: ${isFirstLoad}`)
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

  // ---------------------- UI ----------------------
  const isNewSearch = isFetching && !isFetchingNextPage;
  const remainingCount = Math.max(0, totalResults - artworks.length);
  const remainingPages = Math.max(0, Math.ceil(remainingCount / PAGE_SIZE));

  //Cleans up URL query parameters: if a new value is falsy (e.g., null, '', undefined, or empty array),
  //the corresponding key is deleted from the URL to prevent empty parameters like '?key='.
  const updateFilter: UpdateQueryFilterFn = (key, newValue) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const newParams = { ...currentParams }; //copy old entries
    const isEmpty = !newValue || (Array.isArray(newValue) && newValue.length === 0);
    if (isEmpty) {
      delete newParams[key]
    } else {
      newParams[key] = newValue;
    }
    console.log(`Change Filter ${key} to ${newValue}`)
    setSearchParams(newParams);//reset all Params
  };



  // ---------------------- 导出 ----------------------
  return {
    query,
    artworks,
    totalResults,
    isConfigLoaded,
    isFirstLoad,
    isNewSearch,
    isFetching,
    hasNextPage,
    autoLoadNextPage,
    manualLoadNextPage,
    canAutoLoad,
    remainingCount,
    updateFilter,
  };
};