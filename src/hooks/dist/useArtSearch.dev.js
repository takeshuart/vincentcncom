"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useArtSearch = void 0;

var _react = require("react");

var _reactRouterDom = require("react-router-dom");

var _ArtworkApi = require("../api/ArtworkApi");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var pageSize = 9; // 【关键新增】常量：设置自动加载的页数限制 (N=3)

var AUTO_LOAD_THRESHOLD = 2;
var DEFAULT_QUERY = {
  hasImage: true,
  genre: '',
  technique: '',
  keyword: '',
  color: ''
};

var useArtSearch = function useArtSearch() {
  var _useSearchParams = (0, _reactRouterDom.useSearchParams)(),
      _useSearchParams2 = _slicedToArray(_useSearchParams, 2),
      searchParams = _useSearchParams2[0],
      setSearchParams = _useSearchParams2[1];

  var _useState = (0, _react.useState)(''),
      _useState2 = _slicedToArray(_useState, 2),
      keywordInput = _useState2[0],
      setKeywordInput = _useState2[1]; // --- 混合加载状态 ---


  var _useState3 = (0, _react.useState)(1),
      _useState4 = _slicedToArray(_useState3, 2),
      internalPage = _useState4[0],
      setInternalPage = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      isFetchingNextPage = _useState6[0],
      setIsFetchingNextPage = _useState6[1];

  var _useState7 = (0, _react.useState)(''),
      _useState8 = _slicedToArray(_useState7, 2),
      lastQueryParams = _useState8[0],
      setLastQueryParams = _useState8[1]; // 【关键新增】追踪自从上次点击按钮以来自动加载了多少页


  var _useState9 = (0, _react.useState)(0),
      _useState10 = _slicedToArray(_useState9, 2),
      pagesSinceButton = _useState10[0],
      setPagesSinceButton = _useState10[1]; // recover filters from querystring (page parameter excluded)


  var query = (0, _react.useMemo)(function () {
    var newQuery = {
      hasImage: searchParams.get('hasImage') === 'true' || DEFAULT_QUERY.hasImage,
      genre: searchParams.get('genre') || DEFAULT_QUERY.genre,
      period: searchParams.get('period') || '',
      technique: searchParams.get('technique') || DEFAULT_QUERY.technique,
      keyword: searchParams.get('keyword') || DEFAULT_QUERY.keyword,
      color: searchParams.get('color') || DEFAULT_QUERY.color
    };
    newQuery.queryString = new URLSearchParams(newQuery).toString();
    return newQuery;
  }, [searchParams]);
  (0, _react.useEffect)(function () {
    setKeywordInput(query.keyword);
  }, [query.keyword]); // --- Data and Loading States ---

  var _useState11 = (0, _react.useState)([]),
      _useState12 = _slicedToArray(_useState11, 2),
      artworks = _useState12[0],
      setArtWorks = _useState12[1];

  var _useState13 = (0, _react.useState)(0),
      _useState14 = _slicedToArray(_useState13, 2),
      totalPages = _useState14[0],
      setTotalPages = _useState14[1];

  var _useState15 = (0, _react.useState)(0),
      _useState16 = _slicedToArray(_useState15, 2),
      totalResults = _useState16[0],
      setTotalResults = _useState16[1]; // isLoading: 用于初始加载和新搜索/筛选


  var _useState17 = (0, _react.useState)(true),
      _useState18 = _slicedToArray(_useState17, 2),
      isLoading = _useState18[0],
      setIsLoading = _useState18[1];

  var _useState19 = (0, _react.useState)(false),
      _useState20 = _slicedToArray(_useState19, 2),
      isConfigLoaded = _useState20[0],
      setIsConfigLoaded = _useState20[1];

  var _useState21 = (0, _react.useState)({
    genres: [],
    techniques: []
  }),
      _useState22 = _slicedToArray(_useState21, 2),
      configData = _useState22[0],
      setConfigData = _useState22[1]; // --- Configuration Fetch (Run Once) ---


  (0, _react.useEffect)(function () {
    (0, _ArtworkApi.fetchConfigData)().then(function (data) {
      setConfigData(data);
      setIsConfigLoaded(true);
    })["catch"](function (error) {
      console.error('Error fetching config data', error);
      setIsConfigLoaded(true);
    });
  }, []); // --- Utility Function to Update URL Parameters ---

  var updateSearchParams = function updateSearchParams(newValues) {
    var currentParams = Object.fromEntries(searchParams.entries());

    var newParams = _objectSpread({}, currentParams);

    for (var key in newValues) {
      var value = newValues[key];
      var isEmpty = !value || Array.isArray(value) && value.length === 0;

      if (isEmpty) {
        delete newParams[key];
      } else {
        newParams[key] = String(value);
      }
    }

    setSearchParams(newParams);
  }; // --- Handlers (Filter, Search) ---


  var handleFilterChange = function handleFilterChange(key) {
    return function (event) {
      var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      updateSearchParams(_defineProperty({}, key, value));
    };
  };

  var handleColorSelect = function handleColorSelect(color) {
    updateSearchParams({
      color: color,
      keyword: keywordInput
    });
  };

  var handlePeriodChange = function handlePeriodChange(value) {
    updateSearchParams({
      period: value
    });
  };

  var handleSearchTrigger = function handleSearchTrigger(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    updateSearchParams({
      keyword: keywordInput
    });
  }; // --- Core Data Fetching Logic ---


  var executeFetch = (0, _react.useCallback)(function _callee(page) {
    var append,
        artData,
        received,
        newTotalPages,
        _args = arguments;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            append = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;

            if (append) {
              setIsFetchingNextPage(true);
            } else {
              setIsLoading(true);
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }

            _context.prev = 2;
            _context.next = 5;
            return regeneratorRuntime.awrap((0, _ArtworkApi.fetchArtData)(page, pageSize, query.keyword, query.hasImage, query.genre, query.period, query.technique, query.color));

          case 5:
            artData = _context.sent;
            received = Array.isArray(artData.rows) ? artData.rows : [];
            newTotalPages = Math.ceil(artData.totalCount / pageSize);

            if (append) {
              // 加载下一页：追加数据
              setArtWorks(function (prevArtworks) {
                return [].concat(_toConsumableArray(prevArtworks), _toConsumableArray(received));
              });
            } else {
              // 新搜索/筛选：替换数据并重置页码
              setArtWorks(received);
              setInternalPage(page);
            }

            setTotalPages(newTotalPages);
            setTotalResults(artData.totalCount);
            _context.next = 17;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](2);
            console.error('Error fetching art data', _context.t0);

            if (!append) {
              setArtWorks([]);
              setTotalPages(0);
              setTotalResults(0);
            }

          case 17:
            _context.prev = 17;

            if (append) {
              setIsFetchingNextPage(false);
            } else {
              setIsLoading(false);
            }

            return _context.finish(17);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[2, 13, 17, 20]]);
  }, [query.keyword, query.hasImage, query.genre, query.period, query.technique, query.color]); // Effect to reset state on new query

  (0, _react.useEffect)(function () {
    if (query.queryString !== lastQueryParams) {
      executeFetch(1, false);
      setLastQueryParams(query.queryString); // 【关键修改】新搜索/筛选时，重置自动加载计数

      setPagesSinceButton(0);
    }
  }, [query.queryString, lastQueryParams, executeFetch]); // 【新增函数 1】 IntersectionObserver 调用的自动加载函数

  var autoLoadNextPage = (0, _react.useCallback)(function () {
    var nextPage = internalPage + 1;

    if (internalPage < totalPages && !isFetchingNextPage && !isLoading) {
      // 检查是否达到自动加载阈值
      if (pagesSinceButton < AUTO_LOAD_THRESHOLD) {
        executeFetch(nextPage, true);
        setInternalPage(nextPage); // 自动加载计数 +1

        setPagesSinceButton(function (prev) {
          return prev + 1;
        });
      }
    }
  }, [internalPage, totalPages, isFetchingNextPage, isLoading, executeFetch, pagesSinceButton]); // 【新增函数 2】 按钮点击调用的手动加载函数

  var manualLoadNextPage = (0, _react.useCallback)(function () {
    var nextPage = internalPage + 1;

    if (internalPage < totalPages && !isFetchingNextPage && !isLoading) {
      executeFetch(nextPage, true);
      setInternalPage(nextPage); // 按钮加载后，重置计数为 0，允许下一次自动加载批次从头开始

      setPagesSinceButton(0);
    }
  }, [internalPage, totalPages, isFetchingNextPage, isLoading, executeFetch]); // --- 导出状态和计算值 ---
  // 是否允许 IntersectionObserver 触发自动加载

  var canAutoLoad = internalPage < totalPages && pagesSinceButton < AUTO_LOAD_THRESHOLD; // 剩余数量计算

  var hasNextPage = internalPage < totalPages;
  var remainingCount = totalResults - artworks.length; // 确保剩余页数至少为 0

  var remainingPages = Math.max(0, Math.ceil(remainingCount / pageSize)); // --- Return all necessary states and handlers ---

  return {
    // Query/Input States
    query: query,
    keywordInput: keywordInput,
    setKeywordInput: setKeywordInput,
    // Data States
    artworks: artworks,
    totalPages: totalPages,
    totalResults: totalResults,
    isLoading: isLoading,
    isConfigLoaded: isConfigLoaded,
    configData: configData,
    // 混合加载状态和函数
    hasNextPage: hasNextPage,
    autoLoadNextPage: autoLoadNextPage,
    // 供 Intersection Observer 调用
    manualLoadNextPage: manualLoadNextPage,
    // 供按钮调用
    isFetchingNextPage: isFetchingNextPage,
    canAutoLoad: canAutoLoad,
    // 控制 Intersection Observer 的开关
    // 剩余数量信息
    remainingCount: remainingCount,
    remainingPages: remainingPages,
    // Handlers
    handleFilterChange: handleFilterChange,
    handleColorSelect: handleColorSelect,
    handlePeriodChange: handlePeriodChange,
    handleSearchTrigger: handleSearchTrigger // handlePageChange 已移除

  };
};

exports.useArtSearch = useArtSearch;