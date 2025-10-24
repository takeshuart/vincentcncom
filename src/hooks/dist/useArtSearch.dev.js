"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useArtSearch = void 0;

var _react = require("react");

var _reactRouterDom = require("react-router-dom");

var _ArtworkApi = require("../api/ArtworkApi");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var pageSize = 11;
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
      setKeywordInput = _useState2[1]; // recover filters from querystring


  var query = (0, _react.useMemo)(function () {
    return {
      page: parseInt(searchParams.get('page') || String(DEFAULT_QUERY.page), 10),
      hasImage: searchParams.get('hasImage') === 'true' || DEFAULT_QUERY.hasImage,
      genre: searchParams.get('genre') || DEFAULT_QUERY.genre,
      period: searchParams.get('period') || '',
      technique: searchParams.get('technique') || DEFAULT_QUERY.technique,
      keyword: searchParams.get('keyword') || DEFAULT_QUERY.keyword,
      color: searchParams.get('color') || DEFAULT_QUERY.color
    };
  }, [searchParams]); // Initialize keywordInput from URL on mount/URL update

  (0, _react.useEffect)(function () {
    setKeywordInput(query.keyword);
  }, [query.keyword]); // --- Data and Loading States ---

  var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      artworks = _useState4[0],
      setArtWorks = _useState4[1];

  var _useState5 = (0, _react.useState)(0),
      _useState6 = _slicedToArray(_useState5, 2),
      totalPages = _useState6[0],
      setTotalPages = _useState6[1];

  var _useState7 = (0, _react.useState)(0),
      _useState8 = _slicedToArray(_useState7, 2),
      totalResults = _useState8[0],
      setTotalResults = _useState8[1];

  var _useState9 = (0, _react.useState)(false),
      _useState10 = _slicedToArray(_useState9, 2),
      isLoading = _useState10[0],
      setIsLoading = _useState10[1];

  var _useState11 = (0, _react.useState)(false),
      _useState12 = _slicedToArray(_useState11, 2),
      isConfigLoaded = _useState12[0],
      setIsConfigLoaded = _useState12[1];

  var _useState13 = (0, _react.useState)({
    genres: [],
    techniques: []
  }),
      _useState14 = _slicedToArray(_useState13, 2),
      configData = _useState14[0],
      setConfigData = _useState14[1]; // --- Configuration Fetch (Run Once) ---


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
    var resetPage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
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

    if (resetPage) {
      newParams.page = String(1);
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
  }; // Handler for Pagination (only changes page parameter, does not reset other filters)


  var handlePageChange = function handlePageChange(event, value) {
    updateSearchParams({
      page: value
    }, false);
  }; // --- Main Data Fetching Logic (Runs on query change) ---


  function fetchData() {
    var artData, received;
    return regeneratorRuntime.async(function fetchData$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
            _context.prev = 1;
            setIsLoading(true);
            _context.next = 5;
            return regeneratorRuntime.awrap((0, _ArtworkApi.fetchArtData)(query.page, pageSize, query.keyword, query.hasImage, query.genre, query.period, query.technique, query.color));

          case 5:
            artData = _context.sent;
            received = Array.isArray(artData.rows) ? artData.rows : [];
            setArtWorks(received);
            setTotalPages(Math.ceil(artData.totalCount / pageSize));
            setTotalResults(artData.totalCount);
            _context.next = 18;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](1);
            console.error('Error fetching art data', _context.t0);
            setArtWorks([]);
            setTotalPages(0);
            setTotalResults(0);

          case 18:
            _context.prev = 18;
            setIsLoading(false);
            return _context.finish(18);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 12, 18, 21]]);
  } // Effect to trigger data fetching whenever 'query' changes


  (0, _react.useEffect)(function () {
    fetchData();
  }, [query]); // --- Return all necessary states and handlers ---

  return {
    // Query/Input States
    query: query,
    keywordInput: keywordInput,
    setKeywordInput: setKeywordInput,
    // Only keywordInput setter is needed by the component
    // Data States
    artworks: artworks,
    totalPages: totalPages,
    totalResults: totalResults,
    isLoading: isLoading,
    isConfigLoaded: isConfigLoaded,
    configData: configData,
    // Handlers
    handleFilterChange: handleFilterChange,
    handleColorSelect: handleColorSelect,
    handlePeriodChange: handlePeriodChange,
    handleSearchTrigger: handleSearchTrigger,
    handlePageChange: handlePageChange
  };
};

exports.useArtSearch = useArtSearch;