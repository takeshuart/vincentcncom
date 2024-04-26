"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchArtworkById = fetchArtworkById;
exports.fetchArtData = fetchArtData;
exports.fetchConfigData = fetchConfigData;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var apiDomain = 'http://192.168.50.156:5001/artworks';

function fetchArtworkById(artworkId) {
  var response;
  return regeneratorRuntime.async(function fetchArtworkById$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].get("".concat(apiDomain, "/vincent/id/").concat(artworkId)));

        case 3:
          response = _context.sent;
          return _context.abrupt("return", response.data);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          throw new Error('Error fetching artwork details');

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

function fetchArtData(page, pageSize, searchKeyword, hasImage, genreSelected, periodSelected, techniqueSelected) {
  var response;
  return regeneratorRuntime.async(function fetchArtData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].get(apiDomain + '/vincent/bypage', {
            params: {
              page: page,
              pageSize: pageSize,
              search: searchKeyword,
              hasImage: hasImage,
              genres: genreSelected ? [genreSelected] : [],
              periods: periodSelected ? [periodSelected] : [],
              techniques: techniqueSelected ? [techniqueSelected] : []
            }
          }));

        case 3:
          response = _context2.sent;
          return _context2.abrupt("return", response.data);

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          throw new Error('Error fetching art data');

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
} //对数据表所有数据执行distinct操作，成本价高
//TODO 考虑单独维护一个配置表


function fetchConfigData() {
  var _ref, _ref2, genreRes, periodRes, techniques;

  return regeneratorRuntime.async(function fetchConfigData$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Promise.all([_axios["default"].get(apiDomain + '/vincent/config?cond=genre'), _axios["default"].get(apiDomain + '/vincent/config?cond=period'), _axios["default"].get(apiDomain + '/vincent/config?cond=technique')]));

        case 3:
          _ref = _context3.sent;
          _ref2 = _slicedToArray(_ref, 3);
          genreRes = _ref2[0];
          periodRes = _ref2[1];
          techniques = _ref2[2];
          return _context3.abrupt("return", {
            genres: genreRes.data,
            periods: periodRes.data,
            techniques: techniques.data
          });

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          throw new Error('Error fetching config data');

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
}