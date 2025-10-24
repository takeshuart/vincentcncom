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

var pageSize = 9; // 【新增常量】自动加载的页数限制 (N=3)

var DEFAULT_QUERY = {
  page: 1,
  hasImage: true,
  genre: '',
  technique: '',
  keyword: '',
  color: ''
};

var useArtSearch = function useArtSearch() {
  //reading search parameters from url querystring 
  var _useSearchParams = (0, _reactRouterDom.useSearchParams)(),
      _useSearchParams2 = _slicedToArray(_useSearchParams, 2),
      searchParams = _useSearchParams2[0],
      setSearchParams = _useSearchParams2[1]; // Local state for the text input (transient state for typing speed)


  var _useState = (0, _react.useState)(''),
      _useState2 = _slicedToArray(_useState, 2),
      keywordInput = _useState2[0],
      setKeywordInput = _useState2[1]; // 【修改 2.3】 新增内部状态


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
      setLastQueryParams = _useState8[1]; // 用于检测 URL 筛选条件是否变化
  // recover filters from querystring


  var query = (0, _react.useMemo)(function () {
    var newQuery = {
      // 【修改 2.4】 从 URL 读取参数时，排除 page
      hasImage: searchParams.get('hasImage') === 'true' || DEFAULT_QUERY.hasImage,
      genre: searchParams.get('genre') || DEFAULT_QUERY.genre,
      period: searchParams.get('period') || '',
      technique: searchParams.get('technique') || DEFAULT_QUERY.technique,
      keyword: searchParams.get('keyword') || DEFAULT_QUERY.keyword,
      color: searchParams.get('color') || DEFAULT_QUERY.color
    }; // 添加一个用于唯一标识当前筛选状态的属性

    newQuery.queryString = new URLSearchParams(newQuery).toString();
    return newQuery;
  }, [searchParams]); // Initialize keywordInput from URL on mount/URL update

  (0, _react.useEffect)(function () {
    setKeywordInput(query.keyword);
  }, [query.keyword]); // --- Data and Loading States ---

  var _useState9 = (0, _react.useState)([]),
      _useState10 = _slicedToArray(_useState9, 2),
      artworks = _useState10[0],
      setArtWorks = _useState10[1];

  var _useState11 = (0, _react.useState)(0),
      _useState12 = _slicedToArray(_useState11, 2),
      totalPages = _useState12[0],
      setTotalPages = _useState12[1];

  var _useState13 = (0, _react.useState)(0),
      _useState14 = _slicedToArray(_useState13, 2),
      totalResults = _useState14[0],
      setTotalResults = _useState14[1];

  var _useState15 = (0, _react.useState)(false),
      _useState16 = _slicedToArray(_useState15, 2),
      isLoading = _useState16[0],
      setIsLoading = _useState16[1];

  var _useState17 = (0, _react.useState)(false),
      _useState18 = _slicedToArray(_useState17, 2),
      isConfigLoaded = _useState18[0],
      setIsConfigLoaded = _useState18[1];

  var _useState19 = (0, _react.useState)({
    genres: [],
    techniques: []
  }),
      _useState20 = _slicedToArray(_useState19, 2),
      configData = _useState20[0],
      setConfigData = _useState20[1]; // --- Configuration Fetch (Run Once) ---


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
    } // Apply the new parameter set to the URL


    setSearchParams(newParams);
  }; // Handler for general filter changes (genre, technique, etc.)


  var handleFilterChange = function handleFilterChange(key) {
    return function (event) {
      var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      updateSearchParams(_defineProperty({}, key, value));
    };
  }; // Handler for color selection


  var handleColorSelect = function handleColorSelect(color) {
    updateSearchParams({
      color: color,
      keyword: keywordInput
    });
  }; // Handler for period changes (timeline)


  var handlePeriodChange = function handlePeriodChange(value) {
    updateSearchParams({
      period: value
    });
  }; // Handler for search button click and Enter key press


  var handleSearchTrigger = function handleSearchTrigger(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    } // Sync keywordInput to URL


    updateSearchParams({
      keyword: keywordInput
    });
  }; // --- Main Data Fetching Logic (Runs on query change) ---
  // 【修改 2.8】 核心数据获取逻辑，增加了 append 参数


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
            return regeneratorRuntime.awrap((0, _ArtworkApi.fetchArtData)(page, pageSize, // 使用传入的页码
            query.keyword, query.hasImage, query.genre, query.period, query.technique, query.color));

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
              setInternalPage(page); // 重置 internalPage 为 1
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
  }, [query.keyword, query.hasImage, query.genre, query.period, query.technique, query.color]); // 【修改 2.9】 Effect to trigger data fetching whenever 'query' (filters/search) changes

  (0, _react.useEffect)(function () {
    // 如果 URL 参数字符串发生变化，说明是新的搜索或筛选
    if (query.queryString !== lastQueryParams) {
      // 重置并从第一页开始加载 (非追加模式)
      executeFetch(1, false);
      setLastQueryParams(query.queryString); // 更新上次的查询参数字符串
    }
  }, [query.queryString, lastQueryParams, executeFetch]); // 【修改 2.10】 暴露给组件的“加载下一页”函数

  var fetchNextPage = (0, _react.useCallback)(function () {
    // 只有当还有下一页并且当前没有其他加载在进行时才执行
    if (internalPage < totalPages && !isFetchingNextPage && !isLoading) {
      var nextPage = internalPage + 1;
      executeFetch(nextPage, true); // 加载下一页，并设置为追加模式 (true)
      // 【重要】在成功请求发起后立即更新 internalPage，防止重复触发

      setInternalPage(nextPage);
    }
  }, [internalPage, totalPages, isFetchingNextPage, isLoading, executeFetch]); // 【修改 2.11】 判断是否还有下一页

  var hasNextPage = internalPage < totalPages; // --- Return all necessary states and handlers ---

  return {
    // Query/Input States
    query: query,
    keywordInput: keywordInput,
    setKeywordInput: setKeywordInput,
    // Only keywordInput setter is needed by the component
    // Data States
    artworks: artworks,
    // 移除 query.page
    totalPages: totalPages,
    totalResults: totalResults,
    isLoading: isLoading,
    isConfigLoaded: isConfigLoaded,
    configData: configData,
    // 【修改 2.12】 新增的无限滚动相关状态和函数
    hasNextPage: hasNextPage,
    fetchNextPage: fetchNextPage,
    isFetchingNextPage: isFetchingNextPage,
    // Handlers
    handleFilterChange: handleFilterChange,
    handleColorSelect: handleColorSelect,
    handlePeriodChange: handlePeriodChange,
    handleSearchTrigger: handleSearchTrigger // 移除 handlePageChange

  };
};

exports.useArtSearch = useArtSearch;