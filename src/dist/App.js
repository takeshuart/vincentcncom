"use strict";
exports.__esModule = true;
// src/App.js
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var VincentAdmin_1 = require("./pages/VincentAdmin");
var HomePage_1 = require("./pages/HomePage");
var DetailsPage_1 = require("./pages/DetailsPage");
var material_1 = require("@mui/material");
var AppHeader_1 = require("./components/AppHeader");
var SearchPage_1 = require("./pages/SearchPage");
var GlobalLayout = function () {
    return (react_1["default"].createElement(material_1.Box, { sx: { minHeight: '100vh', display: 'flex', flexDirection: 'column' } },
        react_1["default"].createElement(AppHeader_1["default"], null),
        react_1["default"].createElement(material_1.Box, { component: "main", sx: { flexGrow: 1 } },
            react_1["default"].createElement(react_router_dom_1.Outlet, null))));
};
function App() {
    return (react_1["default"].createElement(react_router_dom_1.BrowserRouter, null,
        react_1["default"].createElement(react_router_dom_1.Routes, null,
            react_1["default"].createElement(react_router_dom_1.Route, { path: "/", element: react_1["default"].createElement(GlobalLayout, null) },
                react_1["default"].createElement(react_router_dom_1.Route, { path: "/vincent", element: react_1["default"].createElement(HomePage_1["default"], null) }),
                react_1["default"].createElement(react_router_dom_1.Route, { path: "/vincent/search", element: react_1["default"].createElement(SearchPage_1["default"], null) }),
                react_1["default"].createElement(react_router_dom_1.Route, { path: "/vincent/id/:id", element: react_1["default"].createElement(DetailsPage_1["default"], null) })),
            react_1["default"].createElement(react_router_dom_1.Route, { path: "/", element: react_1["default"].createElement(VincentAdmin_1["default"], null) }))));
}
exports["default"] = App;
