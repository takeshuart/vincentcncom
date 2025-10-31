"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.useArtSearch = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_query_1 = require("@tanstack/react-query");
var ArtworkApi_1 = require("../api/ArtworkApi");
var pageSize = 9;
var AUTO_LOAD_THRESHOLD = 2;
var DEFAULT_QUERY = {
    hasImage: true,
    genre: '',
    technique: '',
    keyword: '',
    color: ''
};
exports.useArtSearch = function () {
    var _a, _b, _c, _d;
    var _e = react_router_dom_1.useSearchParams(), searchParams = _e[0], setSearchParams = _e[1];
    var _f = react_1.useState(function () { return searchParams.get('keyword') || ''; }), keywordInput = _f[0], setKeywordInput = _f[1];
    // ---------------------- 解析 URL 参数 ----------------------
    var query = react_1.useMemo(function () {
        var newQuery = {
            hasImage: searchParams.get('hasImage') === 'true' || DEFAULT_QUERY.hasImage,
            genre: searchParams.get('genre') || DEFAULT_QUERY.genre,
            period: searchParams.get('period') || '',
            technique: searchParams.get('technique') || DEFAULT_QUERY.technique,
            keyword: searchParams.get('keyword') || DEFAULT_QUERY.keyword,
            color: searchParams.get('color') || DEFAULT_QUERY.color
        };
        var queryString = new URLSearchParams({
            hasImage: String(newQuery.hasImage),
            genre: newQuery.genre,
            period: newQuery.period,
            technique: newQuery.technique,
            keyword: newQuery.keyword,
            color: newQuery.color
        }).toString();
        return __assign(__assign({}, newQuery), { queryString: queryString });
    }, [searchParams]);
    // ---------------------- 配置数据 ----------------------
    var _g = react_query_1.useQuery({
        queryKey: ['configData'],
        queryFn: ArtworkApi_1.fetchConfigData,
        staleTime: Infinity,
        gcTime: Infinity
    }), _h = _g.data, configData = _h === void 0 ? { genres: [], techniques: [] } : _h, isConfigLoaded = _g.isSuccess;
    // ---------------------- 无限滚动加载 ----------------------
    var _j = react_query_1.useInfiniteQuery({
        queryKey: ['artworks', query.queryString],
        queryFn: function (_a) {
            var pageParam = _a.pageParam;
            return __awaiter(void 0, void 0, void 0, function () {
                var page, artData;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            page = pageParam !== null && pageParam !== void 0 ? pageParam : 1;
                            return [4 /*yield*/, ArtworkApi_1.fetchArtData(page, pageSize, query.keyword, query.hasImage, query.genre, query.period, query.technique, query.color)];
                        case 1:
                            artData = _b.sent();
                            return [2 /*return*/, {
                                    page: page,
                                    rows: artData.rows || [],
                                    totalCount: artData.totalCount || 0,
                                    totalPages: Math.ceil((artData.totalCount || 0) / pageSize)
                                }];
                    }
                });
            });
        },
        initialPageParam: 1,
        getNextPageParam: function (lastPage) {
            return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
        },
        refetchOnWindowFocus: false
    }), data = _j.data, isFetching = _j.isFetching, isFetchingNextPage = _j.isFetchingNextPage, fetchNextPage = _j.fetchNextPage, hasNextPage = _j.hasNextPage, isInitialLoading = _j.isLoading;
    // ---------------------- 数据整合 ----------------------
    var artworks = react_1.useMemo(function () { return (data ? data.pages.flatMap(function (p) { return p.rows; }) : []); }, [data]);
    var totalResults = ((_b = (_a = data === null || data === void 0 ? void 0 : data.pages) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.totalCount) || 0;
    var totalPages = ((_d = (_c = data === null || data === void 0 ? void 0 : data.pages) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.totalPages) || 0;
    // ---------------------- 自动加载逻辑 ----------------------
    var _k = react_1.useState(0), pagesSinceMoreButton = _k[0], setPagesSinceMoreButton = _k[1];
    var canAutoLoad = hasNextPage && pagesSinceMoreButton < AUTO_LOAD_THRESHOLD && !isFetchingNextPage;
    var autoLoadNextPage = react_1.useCallback(function () {
        if (canAutoLoad) {
            fetchNextPage();
            setPagesSinceMoreButton(function (prev) { return prev + 1; });
        }
    }, [fetchNextPage, canAutoLoad]);
    var manualLoadNextPage = react_1.useCallback(function () {
        if (hasNextPage) {
            fetchNextPage();
            setPagesSinceMoreButton(0);
        }
    }, [fetchNextPage, hasNextPage]);
    // ---------------------- UI 辅助逻辑 ----------------------
    var isNewSearch = isFetching && !isFetchingNextPage; // ✅ 保留搜索时半透明效果
    var remainingCount = Math.max(0, totalResults - artworks.length);
    var remainingPages = Math.max(0, Math.ceil(remainingCount / pageSize));
    // ---------------------- URL 更新函数 ----------------------
    var updateSearchParams = function (newValues) {
        var currentParams = Object.fromEntries(searchParams.entries());
        var newParams = __assign({}, currentParams);
        for (var key in newValues) {
            var value = newValues[key];
            var isEmpty = !value || (Array.isArray(value) && value.length === 0);
            if (isEmpty)
                delete newParams[key];
            else
                newParams[key] = String(value);
        }
        setSearchParams(newParams);
    };
    // ---------------------- Handlers ----------------------
    var handleFilterChange = function (key) { return function (event) {
        var _a;
        var value = event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value;
        updateSearchParams((_a = {}, _a[key] = value, _a));
    }; };
    var handleColorSelect = function (color) {
        updateSearchParams({ color: color, keyword: keywordInput });
    };
    var handlePeriodChange = function (value) {
        updateSearchParams({ period: value });
    };
    var handleSearchTrigger = function (event) {
        if (event && event.preventDefault)
            event.preventDefault();
        updateSearchParams({ keyword: keywordInput });
    };
    // ---------------------- 导出 ----------------------
    return {
        query: query,
        keywordInput: keywordInput,
        setKeywordInput: setKeywordInput,
        artworks: artworks,
        totalResults: totalResults,
        totalPages: totalPages,
        isConfigLoaded: isConfigLoaded,
        configData: configData,
        isInitialLoading: isInitialLoading,
        isNewSearch: isNewSearch,
        isFetchingNextPage: isFetchingNextPage,
        hasNextPage: hasNextPage,
        autoLoadNextPage: autoLoadNextPage,
        manualLoadNextPage: manualLoadNextPage,
        canAutoLoad: canAutoLoad,
        remainingCount: remainingCount,
        remainingPages: remainingPages,
        handleFilterChange: handleFilterChange,
        handleColorSelect: handleColorSelect,
        handlePeriodChange: handlePeriodChange,
        handleSearchTrigger: handleSearchTrigger
    };
};
