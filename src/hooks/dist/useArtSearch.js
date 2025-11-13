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
var enum_1 = require("@/types/enum");
var AUTO_LOAD_THRESHOLD = 2;
var PAGE_SIZE = 9;
exports.useArtSearch = function () {
    var _a, _b, _c, _d;
    // useSearchParams gives you a stateful interface to read and update the URL query parameters.
    // It automatically syncs with the current location (include url querystring)
    // This allows restoring filter states when the user navigates back to the SearchPage from DetailPage.
    var _e = react_router_dom_1.useSearchParams(), searchParams = _e[0], setSearchParams = _e[1];
    // The 'query' object is memoized using useMemo.
    // Whenever any of the search parameters change, a new query object reference is created.
    // This is important because useInfiniteQuery depends on 'queryKey'.
    // When the query object's reference changes, it signals React Query that the queryKey has changed,
    // causing useInfiniteQuery to automatically re-run its queryFn and fetch new data.
    var query = react_1.useMemo(function () {
        var _a, _b, _c, _d, _e;
        var newQuery = {
            hasImage: searchParams.get(enum_1.QueryKeys.HAS_IMAGE) !== 'false',
            searchText: (_a = searchParams.get(enum_1.QueryKeys.SEARCH_TEXT)) !== null && _a !== void 0 ? _a : '',
            genre: (_b = searchParams.get(enum_1.QueryKeys.GENRE)) !== null && _b !== void 0 ? _b : '',
            period: (_c = searchParams.get(enum_1.QueryKeys.PERIOD)) !== null && _c !== void 0 ? _c : '',
            technique: (_d = searchParams.get(enum_1.QueryKeys.TECHNIQUE)) !== null && _d !== void 0 ? _d : '',
            color: (_e = searchParams.get(enum_1.QueryKeys.COLOR)) !== null && _e !== void 0 ? _e : ''
        };
        newQuery.queryString = JSON.stringify(newQuery);
        return newQuery;
    }, [searchParams]);
    var _f = react_query_1.useQuery({
        queryKey: ['configData'],
        queryFn: ArtworkApi_1.fetchConfigData,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    }), _g = _f.data, configData = _g === void 0 ? { genres: [], techniques: [] } : _g, isConfigLoading = _f.isLoading, isConfigLoaded = _f.isSuccess;
    var _h = react_query_1.useInfiniteQuery({
        //The array is a composite key for the cache.
        //execute queryFn when the array data (cache key) has Chanaged
        queryKey: [query.queryString],
        queryFn: function (_a) {
            var pageParam = _a.pageParam;
            return __awaiter(void 0, void 0, void 0, function () {
                var page, artData;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            page = pageParam !== null && pageParam !== void 0 ? pageParam : 1;
                            query.page = page; //default is 1
                            query.pageSize = PAGE_SIZE;
                            return [4 /*yield*/, ArtworkApi_1.fetchArtData(query)];
                        case 1:
                            artData = _d.sent();
                            return [2 /*return*/, {
                                    page: page,
                                    rows: artData.data || [],
                                    totalCount: ((_b = artData.meta) === null || _b === void 0 ? void 0 : _b.totalCount) || 0,
                                    totalPages: Math.ceil((((_c = artData.meta) === null || _c === void 0 ? void 0 : _c.totalCount) || 0) / PAGE_SIZE)
                                }];
                    }
                });
            });
        },
        initialPageParam: 1,
        getNextPageParam: function (pagingInfo) {
            return pagingInfo.page < pagingInfo.totalPages ? pagingInfo.page + 1 : undefined;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        //The cached data is always used until its gcTime expires, the cache is cleared, and a new request for data is initiated.
        staleTime: Infinity,
        // gcTime: 0, // 
        // Use previous data as a placeholder to prevent UI flicker(if `data`=undefined) when the queryKey changes.
        // Data remains visible while `isFetching` is true and the new results load.
        placeholderData: function (previousData) { return previousData; }
    }), data = _h.data, isFetching = _h.isFetching, //
    isFetchingNextPage = _h.isFetchingNextPage, fetchNextPage = _h.fetchNextPage, //queryFn
    hasNextPage = _h.hasNextPage, isPageLoading = _h.isLoading;
    var isSearchInitializing = isConfigLoading && isPageLoading && !data; //first enter search page
    // console.log(`isFirstLoad: ${isFirstLoad}`)
    // ---------------------- 数据整合 ----------------------
    var artworks = react_1.useMemo(function () { return (data ? data.pages.flatMap(function (p) { return p.rows; }) : []); }, [data]);
    var totalResults = ((_b = (_a = data === null || data === void 0 ? void 0 : data.pages) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.totalCount) || 0;
    var totalPages = ((_d = (_c = data === null || data === void 0 ? void 0 : data.pages) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.totalPages) || 0;
    // ---------------------- 自动加载逻辑 ----------------------
    var _j = react_1.useState(0), pagesSinceMoreButton = _j[0], setPagesSinceMoreButton = _j[1];
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
    // ---------------------- UI ----------------------
    var isNewSearch = isFetching && !isFetchingNextPage;
    var remainingCount = Math.max(0, totalResults - artworks.length);
    var remainingPages = Math.max(0, Math.ceil(remainingCount / PAGE_SIZE));
    //Cleans up URL query parameters: if a new value is falsy (e.g., null, '', undefined, or empty array),
    //the corresponding key is deleted from the URL to prevent empty parameters like '?key='.
    var updateFilter = function (key, newValue) {
        var currentParams = Object.fromEntries(searchParams.entries());
        var newParams = __assign({}, currentParams); //copy old entries
        var isEmpty = !newValue || (Array.isArray(newValue) && newValue.length === 0);
        if (isEmpty) {
            delete newParams[key];
        }
        else {
            newParams[key] = newValue;
        }
        console.log("Change Filter " + key + " to " + newValue);
        setSearchParams(newParams); //reset all Params
    };
    // ---------------------- 导出 ----------------------
    return {
        query: query,
        artworks: artworks,
        totalResults: totalResults,
        isConfigLoaded: isConfigLoaded,
        isSearchInitializing: isSearchInitializing,
        isNewSearch: isNewSearch,
        isFetching: isFetching,
        isFetchingNextPage: isFetchingNextPage,
        hasNextPage: hasNextPage,
        autoLoadNextPage: autoLoadNextPage,
        manualLoadNextPage: manualLoadNextPage,
        canAutoLoad: canAutoLoad,
        remainingCount: remainingCount,
        updateFilter: updateFilter
    };
};
