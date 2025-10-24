"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _reactRouterDom = require("react-router-dom");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * 详情页的上一个/下一个按钮功能
 */
var STORAGE_KEY = 'currentPageContext';

var useSearchContextNavigation = function useSearchContextNavigation(currentId) {
  var navigate = (0, _reactRouterDom.useNavigate)();

  var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      searchContext = _useState2[0],
      setSearchContext = _useState2[1];

  var _useState3 = (0, _react.useState)(-1),
      _useState4 = _slicedToArray(_useState3, 2),
      currentIndex = _useState4[0],
      setCurrentIndex = _useState4[1];

  var _useState5 = (0, _react.useState)([]),
      _useState6 = _slicedToArray(_useState5, 2),
      list = _useState6[0],
      setList = _useState6[1]; //a URL querystring, start with '?'


  var querystring = (0, _reactRouterDom.useLocation)().search;
  (0, _react.useEffect)(function () {
    var contextJson = sessionStorage.getItem(STORAGE_KEY);

    if (contextJson) {
      try {
        var context = JSON.parse(contextJson);
        var artworkList = context.idList || [];
        var idString = String(currentId); // 尝试找到当前 ID 在列表中的位置

        var index = artworkList.findIndex(function (id) {
          return String(id) === idString;
        });

        if (index !== -1) {
          setSearchContext(context);
          setList(artworkList);
          setCurrentIndex(index); //update current index

          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(_objectSpread({}, context, {
            currentIndex: index
          })));
        } else {
          //if not exist id ,hide arrow (maybe from Surprise Page)
          sessionStorage.removeItem(STORAGE_KEY);
          setSearchContext(null);
          setList([]);
          setCurrentIndex(-1);
        }
      } catch (e) {
        console.error('Error parsing search context from sessionStorage:', e);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [currentId]); //update sessionStorage while detailPage changed

  var goToNext = (0, _react.useCallback)(function () {
    if (currentIndex < list.length - 1) {
      var nextIndex = currentIndex + 1;
      var nextId = list[nextIndex];
      navigate("/vincent/id/".concat(nextId).concat(querystring));
    }
  }, [currentIndex, list, navigate]);
  var goToPrev = (0, _react.useCallback)(function () {
    if (currentIndex > 0) {
      var prevIndex = currentIndex - 1;
      var prevId = list[prevIndex];
      navigate("/vincent/id/".concat(prevId).concat(querystring));
    }
  }, [currentIndex, list, navigate]); // 3. 计算是否可以导航

  var canGoNext = (0, _react.useMemo)(function () {
    return currentIndex !== -1 && currentIndex < list.length - 1;
  }, [currentIndex, list]);
  var canGoPrev = (0, _react.useMemo)(function () {
    return currentIndex > 0;
  }, [currentIndex]);
  return {
    searchContext: searchContext,
    canGoNext: canGoNext,
    canGoPrev: canGoPrev,
    goToNext: goToNext,
    goToPrev: goToPrev
  };
};

var _default = useSearchContextNavigation;
exports["default"] = _default;