"use strict";
// src/hooks/useArtSearch.tsx (重构)
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.useArtSearch = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_query_1 = require("@tanstack/react-query");
var ArtworkApi_1 = require("../api/ArtworkApi"); // 导入重构后的 API
var DEFAULT_QUERY = {
    hasImage: true,
    genre: '',
    technique: '',
    keyword: '',
    color: '',
    period: ''
};
// -------------------------------------------------------------
// 核心自定义 Hook：使用 useInfiniteQuery 实现搜索与分页
// -------------------------------------------------------------
exports.useArtSearch = function () {
    var _a, _b, _c;
    var _d = react_router_dom_1.useSearchParams(), searchParams = _d[0], setSearchParams = _d[1];
    // 1. 状态管理：从 URL 同步搜索参数
    var getQueryState = react_1.useCallback(function () {
        var newQuery = {
            hasImage: searchParams.get('hasImage') === 'true' || DEFAULT_QUERY.hasImage,
            genre: searchParams.get('genre') || DEFAULT_QUERY.genre,
            period: searchParams.get('period') || DEFAULT_QUERY.period,
            technique: searchParams.get('technique') || DEFAULT_QUERY.technique,
            keyword: searchParams.get('keyword') || DEFAULT_QUERY.keyword,
            color: searchParams.get('color') || DEFAULT_QUERY.color
        };
        // 生成一个唯一字符串作为 queryKey 的一部分
        var queryString = new URLSearchParams(newQuery).toString();
        return __assign(__assign({}, newQuery), { queryString: queryString });
    }, [searchParams]);
    var query = getQueryState();
    // 用于输入框的双向绑定，避免每次输入都触发 URL/Query 变更
    var _e = react_1.useState(query.keyword), keywordInput = _e[0], setKeywordInput = _e[1];
    useEffect(function () {
        setKeywordInput(query.keyword);
    }, [query.keyword]);
    // 2. 配置数据加载 (使用 useQuery 进行单次缓存)
    var configResults = react_query_1.useQuery({
        queryKey: ['artConfig'],
        queryFn: ArtworkApi_1.fetchConfigData,
        staleTime: Infinity,
        placeholderData: { genres: [], techniques: [], periods: [] }
    });
    // 3. 艺术作品无限查询 (核心)
    var artResults = react_query_1.useInfiniteQuery({
        // 关键：Query Key 必须包含所有用于搜索的参数，变化时自动重置
        queryKey: ['artSearch', query.queryString],
        queryFn: function (_a) {
            var _b = _a.pageParam, pageParam = _b === void 0 ? 1 : _b;
            return ArtworkApi_1.fetchArtData({
                page: pageParam,
                searchKeyword: query.keyword,
                hasImage: query.hasImage,
                genreSelected: query.genre,
                selectedPeriod: query.period,
                techniqueSelected: query.technique,
                colorSelected: query.color
            });
        },
        initialPageParam: 1,
        getNextPageParam: function (lastPage) { return lastPage.nextPage; },
        enabled: configResults.isSuccess
    });
    // 4. 结果合并与计算
    var artworks = react_1.useMemo(function () {
        var _a;
        return ((_a = artResults.data) === null || _a === void 0 ? void 0 : _a.pages.flatMap(function (page) { return page.artworks; })) || [];
    }, [artResults.data]);
    var totalResults = (_c = (_b = (_a = artResults.data) === null || _a === void 0 ? void 0 : _a.pages[0]) === null || _b === void 0 ? void 0 : _b.totalResults) !== null && _c !== void 0 ? _c : 0;
    var remainingCount = totalResults - artworks.length;
    // 5. 搜索和过滤操作函数 (更新 URL Search Params)
    var updateSearchParams = react_1.useCallback(function (newValues) {
        var currentParams = Object.fromEntries(searchParams.entries());
        var newParams = __assign({}, currentParams);
        for (var key in newValues) {
            var value = newValues[key];
            var isEmpty = value === null || value === '' || (Array.isArray(value) && value.length === 0);
            if (isEmpty) {
                delete newParams[key];
            }
            else {
                newParams[key] = String(value);
            }
        }
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);
    var handleColorSelect = react_1.useCallback(function (color) {
        updateSearchParams({ color: color, keyword: keywordInput });
    }, [updateSearchParams, keywordInput]);
    var handlePeriodChange = react_1.useCallback(function (value) {
        updateSearchParams({ period: value });
    }, [updateSearchParams]);
    // 注意：原代码中的 handleSearchTrigger 接受一个 event 参数
    var handleSearchTrigger = react_1.useCallback(function () {
        updateSearchParams({ keyword: keywordInput });
    }, [updateSearchParams, keywordInput]);
    // 6. 状态映射到原有 Hook 接口
    var isInitialLoading = artResults.isLoading && configResults.isLoading;
    var isFetchingNextPage = artResults.isFetchingNextPage;
    var hasNextPage = artResults.hasNextPage;
    // 新查询状态：如果正在获取数据，且当前已加载作品数为 0，则认为是新的搜索
    var isNewSearch = artResults.isFetching && artworks.length === 0;
    // 自动加载条件：有下一页且当前没有在加载
    var canAutoLoad = hasNextPage && !isFetchingNextPage;
    return {
        // Query/Input States
        query: query,
        keywordInput: keywordInput,
        setKeywordInput: setKeywordInput,
        // Data States
        artworks: artworks,
        totalResults: totalResults,
        isConfigLoaded: configResults.isSuccess,
        // TanStack Query 驱动的状态和方法
        isInitialLoading: isInitialLoading,
        isNewSearch: isNewSearch,
        hasNextPage: hasNextPage,
        // TanStack Query 提供的分页函数
        autoLoadNextPage: artResults.fetchNextPage,
        manualLoadNextPage: artResults.fetchNextPage,
        isFetchingNextPage: isFetchingNextPage,
        canAutoLoad: canAutoLoad,
        remainingCount: remainingCount,
        // Handlers
        handleColorSelect: handleColorSelect,
        handlePeriodChange: handlePeriodChange,
        handleSearchTrigger: handleSearchTrigger
    };
};
