"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchQuotes = fetchQuotes;

function fetchQuotes() {
  var response, data, randomIndex, quote;
  return regeneratorRuntime.async(function fetchQuotes$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch('/vangogh-quotes.json'));

        case 3:
          response = _context.sent;

          if (response.ok) {
            _context.next = 6;
            break;
          }

          throw new Error('Failed to fetch quotes');

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          data = _context.sent;
          randomIndex = Math.floor(Math.random() * data.length);
          quote = data[randomIndex].content;
          return _context.abrupt("return", quote);

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching quotes:', _context.t0);
          throw _context.t0;

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
}

;