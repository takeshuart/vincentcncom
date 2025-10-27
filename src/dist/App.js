"use strict";
exports.__esModule = true;
exports.TOTAL_HEADER_OFFSET = exports.CONTENT_GAP = exports.HEADER_HEIGHT = void 0;
// src/App.js
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var VincentAdmin_1 = require("./pages/VincentAdmin");
var HomePage_1 = require("./pages/HomePage");
var DetailsPage_1 = require("./pages/DetailsPage");
var material_1 = require("@mui/material");
var AppHeader_1 = require("./components/AppHeader");
var SearchPage_1 = require("./pages/SearchPage");
require("./styles/index.css");
// Header 的实际高度
exports.HEADER_HEIGHT = 40;
// Header 下方与子内容之间的间距
exports.CONTENT_GAP = 40;
// 结合高度和间距，这是 main Box 需要的完整偏移量
exports.TOTAL_HEADER_OFFSET = exports.HEADER_HEIGHT + exports.CONTENT_GAP;
var GlobalLayout = function () {
    return (react_1["default"].createElement(material_1.Box, { sx: { minHeight: '100vh', display: 'flex', flexDirection: 'column' } },
        react_1["default"].createElement(AppHeader_1["default"], null),
        react_1["default"].createElement(material_1.Box, { component: "main", sx: {
                flexGrow: 1,
                // 负外边距：让内容的背景向上延伸覆盖顶部空白区
                marginTop: "-" + exports.TOTAL_HEADER_OFFSET + "px",
                // // 内边距：将 Outlet 内容推到 Header 下边缘 + 20px 的位置
                paddingTop: exports.TOTAL_HEADER_OFFSET + "px"
            } },
            react_1["default"].createElement(material_1.Box, { sx: {
                    flexGrow: 1,
                    minHeight: '100%',
                    width: '100%',
                    // 默认的背景色仍然留给子组件来设置 (保持透明)
                    bgcolor: 'transparent'
                } },
                react_1["default"].createElement(react_router_dom_1.Outlet, null),
                " "))));
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
