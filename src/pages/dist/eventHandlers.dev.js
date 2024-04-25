"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleSearch = handleSearch;
exports.handleKeyDown = handleKeyDown;
exports.handleSearchBtn = handleSearchBtn;
exports.handlePageChange = handlePageChange;
exports.handleHasImageChange = handleHasImageChange;
exports.handleGenreChange = handleGenreChange;
exports.handlePeriodChange = handlePeriodChange;
exports.handleTechniqueChange = handleTechniqueChange;
exports.handleSearchChange = void 0;

var _api = require("./api");

function handleSearch(value, setHasImage, setGenreItems, setPeriodItems, setTechniqueItems) {
  (0, _api.fetchArtData)();
  (0, _api.fetchConfigData)(); // 重置

  setHasImage(false);
  setGenreItems('');
  setPeriodItems('');
  setTechniqueItems('');
}

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    handleSearch();
  }
}

function handleSearchBtn(event, setSearchKeyword) {
  setSearchKeyword(event.target.value);
}

var handleSearchChange = function handleSearchChange(event, setSearchKeyword) {
  setSearchKeyword(event.target.value);
};

exports.handleSearchChange = handleSearchChange;

function handlePageChange(event, value, setPage) {
  setPage(value);
}

function handleHasImageChange(event, setHasImage) {
  setHasImage(event.target.checked);
}

function handleGenreChange(event, setGenreItems) {
  var value = event.target.value;
  setGenreItems(value);
}

function handlePeriodChange(event, setPeriodItems) {
  var value = event.target.value;
  setPeriodItems(value);
}

function handleTechniqueChange(event, setTechniqueItems) {
  var value = event.target.value;
  setTechniqueItems(value);
}