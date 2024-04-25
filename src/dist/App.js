"use strict";
exports.__esModule = true;
// src/App.js
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var VincentAdmin_1 = require("./pages/VincentAdmin");
var VincentGrid_1 = require("./pages/VincentGrid");
var VincentArtworkDetail_1 = require("./pages/VincentArtworkDetail");
function App() {
    return (react_1["default"].createElement(react_router_dom_1.BrowserRouter, null,
        react_1["default"].createElement(react_router_dom_1.Routes, null,
            react_1["default"].createElement(react_router_dom_1.Route, { path: "/", element: react_1["default"].createElement(VincentAdmin_1["default"], null) }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: "/vincent", element: react_1["default"].createElement(VincentGrid_1["default"], null) }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: "/vincent/id/:id", element: react_1["default"].createElement(VincentArtworkDetail_1["default"], null) }))));
}
exports["default"] = App;
