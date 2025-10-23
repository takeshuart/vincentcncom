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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * 辅助函数：清洗和预处理艺术品数据中的 JSON 字段和图片路径
 * @param {object} fetchedArtwork - 原始 API 返回的作品数据
 * @returns {object} 包含解析后字段的艺术品数据和外部链接对象
 */
var cleanArtworkData = function cleanArtworkData(fetchedArtwork) {
  var processedArtwork = _objectSpread({}, fetchedArtwork);

  var extLinks = {}; // 3. 解析 exhibitions

  try {
    processedArtwork.exhibitionHistory = processedArtwork.exhibitions ? JSON.parse(processedArtwork.exhibitions) : [];
  } catch (e) {
    console.error('Error parsing exhibitionHistory JSON:', e);
    processedArtwork.exhibitionHistory = [];
  } // 4. 图片路径处理 (可选，但原代码有，这里保留)


  if (processedArtwork.primaryImageLarge) {
    processedArtwork.primaryImageLarge = "/all-collections/".concat(processedArtwork.primaryImageLarge);
  } else if (processedArtwork.primaryImageSmall) {
    processedArtwork.primaryImageLarge = "https://www.pubhist.com".concat(processedArtwork.primaryImageSmall);
  }

  return {
    processedArtwork: processedArtwork,
    extLinks: extLinks
  };
};
/**
 * 封装作品详情页的数据获取、清洗和状态管理。
 * @param {string} id - 作品 ID
 * @returns {object} 包含作品数据、状态和操作函数的对象。
 */


var useArtworkDetails = function useArtworkDetails(id) {
  var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      artwork = _useState2[0],
      setArtwork = _useState2[1];

  var _useState3 = (0, _react.useState)({}),
      _useState4 = _slicedToArray(_useState3, 2),
      extLinks = _useState4[0],
      setExtLinks = _useState4[1];

  var _useState5 = (0, _react.useState)('overview'),
      _useState6 = _slicedToArray(_useState5, 2),
      activeSection = _useState6[0],
      setActiveSection = _useState6[1]; //default section
  // 延迟加载数据和状态


  var _useState7 = (0, _react.useState)(null),
      _useState8 = _slicedToArray(_useState7, 2),
      lettersData = _useState8[0],
      setLettersData = _useState8[1];

  var _useState9 = (0, _react.useState)(false),
      _useState10 = _slicedToArray(_useState9, 2),
      isLoadingLetters = _useState10[0],
      setIsLoadingLetters = _useState10[1];

  var _useState11 = (0, _react.useState)(true),
      _useState12 = _slicedToArray(_useState11, 2),
      isLoadingArtwork = _useState12[0],
      setIsLoadingArtwork = _useState12[1];

  (0, _react.useEffect)(function () {
    if (!id) return;

    var fetchAndCleanArtwork = function fetchAndCleanArtwork() {
      var fetchedArtwork, _cleanArtworkData, processedArtwork, cleanedExtLinks;

      return regeneratorRuntime.async(function fetchAndCleanArtwork$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              setIsLoadingArtwork(true);
              setArtwork(null); // 重置数据

              setExtLinks({});
              _context.prev = 3;
              _context.next = 6;
              return regeneratorRuntime.awrap((0, _ArtworkApi.fetchArtworkById)(id));

            case 6:
              fetchedArtwork = _context.sent;
              _cleanArtworkData = cleanArtworkData(fetchedArtwork), processedArtwork = _cleanArtworkData.processedArtwork, cleanedExtLinks = _cleanArtworkData.extLinks;
              setArtwork(processedArtwork);
              setExtLinks(cleanedExtLinks);
              _context.next = 16;
              break;

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](3);
              console.error('Error fetching artwork data', _context.t0);
              setArtwork(null);

            case 16:
              _context.prev = 16;
              setIsLoadingArtwork(false);
              return _context.finish(16);

            case 19:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[3, 12, 16, 19]]);
    };

    fetchAndCleanArtwork();
  }, [id]); // --- 2. 动态计算导航栏目 (保持不变) ---

  var sections = (0, _react.useMemo)(function () {
    if (!artwork) return [];
    var sectionsList = [{
      id: 'overview',
      label: '详情',
      dataField: 'shortDesc'
    }, {
      id: 'letters',
      label: '梵高书信',
      dataField: 'letters'
    }, {
      id: 'exhibition',
      label: '展出信息',
      dataField: 'exhibitions'
    }];
    return sectionsList.filter(function (section) {
      if (section.id === 'overview') return true;
      if (section.id === 'letters') return artwork.letters && String(artwork.letters).length > 0;
      if (section.id === 'exhibition') return artwork.exhibitions && artwork.exhibitions.length > 0; // 检查其他字段是否有值

      return !!artwork[section.dataField];
    });
  }, [artwork]);
  (0, _react.useEffect)(function () {
    if (activeSection === 'letters' && !isLoadingLetters) {
      var loadLetters = function loadLetters() {
        var data;
        return regeneratorRuntime.async(function loadLetters$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                setIsLoadingLetters(true);
                _context2.prev = 1;
                _context2.next = 4;
                return regeneratorRuntime.awrap((0, _ArtworkApi.getLettersByIds)(artwork.letters));

              case 4:
                data = _context2.sent;
                setLettersData(data);
                _context2.next = 12;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](1);
                console.error("Error loading letters:", _context2.t0);
                setLettersData([]);

              case 12:
                _context2.prev = 12;
                setIsLoadingLetters(false);
                return _context2.finish(12);

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, null, null, [[1, 8, 12, 15]]);
      };

      loadLetters();
    }
  }, [activeSection]); //load letters while switch to Letters Tab

  return {
    artwork: artwork,
    extLinks: extLinks,
    activeSection: activeSection,
    lettersData: lettersData,
    isLoadingLetters: isLoadingLetters,
    isLoadingArtwork: isLoadingArtwork,
    sections: sections,
    setActiveSection: setActiveSection
  };
};

var _default = useArtworkDetails;
exports["default"] = _default;