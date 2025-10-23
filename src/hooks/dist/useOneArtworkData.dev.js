"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _ArtworkApi = require("../api/ArtworkApi");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// 假设路径正确
var useOneArtworkData = function useOneArtworkData(id) {
  var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      artwork = _useState2[0],
      setArtwork = _useState2[1];

  var _useState3 = (0, _react.useState)({}),
      _useState4 = _slicedToArray(_useState3, 2),
      extLinks = _useState4[0],
      setExtLinks = _useState4[1];

  var _useState5 = (0, _react.useState)(null),
      _useState6 = _slicedToArray(_useState5, 2),
      lettersData = _useState6[0],
      setLettersData = _useState6[1];

  var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      isLoadingLetters = _useState8[0],
      setIsLoadingLetters = _useState8[1];

  var _useState9 = (0, _react.useState)(null),
      _useState10 = _slicedToArray(_useState9, 2),
      error = _useState10[0],
      setError = _useState10[1]; // 核心数据获取和预处理


  (0, _react.useEffect)(function () {
    if (!id) return;

    var fetchData = function fetchData() {
      var fetchedArtwork;
      return regeneratorRuntime.async(function fetchData$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              setError(null);
              _context.prev = 1;
              _context.next = 4;
              return regeneratorRuntime.awrap((0, _ArtworkApi.fetchArtworkById)(id));

            case 4:
              fetchedArtwork = _context.sent;

              // --- 数据清洗和预处理（将原始组件中的逻辑移到此处） ---
              // 1. 外部链接
              if (fetchedArtwork.extLinks) {
                setExtLinks(JSON.parse(fetchedArtwork.extLinks));
              } // 2. 图片路径处理


              if (fetchedArtwork.primaryImageLarge) {
                fetchedArtwork.primaryImageLarge = "/all-collections/".concat(fetchedArtwork.primaryImageLarge);
              } else {
                fetchedArtwork.primaryImageLarge = "https://www.pubhist.com".concat(fetchedArtwork.primaryImageSmall);
              } // 3. 解析 Letters 和 Exhibitions，确保它们是安全的数组/对象


              fetchedArtwork.parsedLetters = fetchedArtwork.letters ? JSON.parse(fetchedArtwork.letters) : [];
              fetchedArtwork.exhibitionHistory = fetchedArtwork.exhibitions ? JSON.parse(fetchedArtwork.exhibitions) : [];
              setArtwork(fetchedArtwork);
              _context.next = 16;
              break;

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](1);
              console.error('Error fetching artwork data:', _context.t0);
              setError('无法加载作品详情。');

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[1, 12]]);
    };

    fetchData();
  }, [id]); // 独立获取书信数据

  var loadLettersData = (0, _react.useCallback)(function _callee() {
    var letterIds, data;
    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(!artwork || !artwork.parsedLetters || isLoadingLetters)) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return");

          case 2:
            setIsLoadingLetters(true);
            _context2.prev = 3;
            // artwork.parsedLetters 是一个 JSON.parse 后的数组，包含 letters ID
            letterIds = artwork.parsedLetters;
            _context2.next = 7;
            return regeneratorRuntime.awrap((0, _ArtworkApi.getLettersByIds)(letterIds));

          case 7:
            data = _context2.sent;
            setLettersData(data);
            _context2.next = 16;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](3);
            console.error("Error loading letters:", _context2.t0);
            setError("无法加载梵高书信数据。");
            setLettersData([]);

          case 16:
            _context2.prev = 16;
            setIsLoadingLetters(false);
            return _context2.finish(16);

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[3, 11, 16, 19]]);
  }, [artwork, isLoadingLetters]); // 依赖 artwork 确保使用最新的 letters ID
  // 定义页面分段 (只在 artwork 变化时重新计算)

  var sections = (0, _react.useMemo)(function () {
    if (!artwork) return [];
    var sectionsList = [{
      id: 'overview',
      label: '详情',
      dataField: 'shortDesc'
    }, {
      id: 'letters',
      label: '梵高书信',
      dataField: 'parsedLetters'
    }, // 使用预处理后的字段
    {
      id: 'exhibition',
      label: '展出信息',
      dataField: 'exhibitionHistory'
    }, // 使用预处理后的字段
    {
      id: 'provenance',
      label: '出处 (Provenance)',
      dataField: 'provenance'
    }, {
      id: 'references',
      label: '参考文献',
      dataField: 'references'
    }]; // 筛选有数据的 section

    return sectionsList.filter(function (section) {
      var data = artwork[section.dataField];

      if (section.id === 'overview' || data) {
        return true;
      }

      if (Array.isArray(data)) {
        return data.length > 0;
      }

      return false;
    });
  }, [artwork]);
  return {
    artwork: artwork,
    extLinks: extLinks,
    sections: sections,
    lettersData: lettersData,
    isLoadingLetters: isLoadingLetters,
    error: error,
    loadLettersData: loadLettersData
  };
};

var _default = useOneArtworkData;
exports["default"] = _default;