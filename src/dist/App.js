"use strict";
exports.__esModule = true;
var react_router_dom_1 = require("react-router-dom");
var HomePage_1 = require("./pages/HomePage");
var DetailsPage_1 = require("./pages/DetailsPage");
var material_1 = require("@mui/material");
var AppHeader_1 = require("./components/AppHeader");
var SearchPage_1 = require("./pages/SearchPage");
require("./styles/index.css");
var GlobalLayout = function () {
    return (React.createElement(material_1.Box, { sx: { minHeight: '100vh', display: 'flex', flexDirection: 'column' } },
        React.createElement(AppHeader_1["default"], null),
        React.createElement(material_1.Box, { component: "main", sx: { flexGrow: 1 } },
            React.createElement(material_1.Box, { sx: {
                    flexGrow: 1,
                    minHeight: '100%',
                    width: '100%',
                    // 默认的背景色仍然留给子组件来设置 (保持透明)
                    bgcolor: 'transparent'
                } },
                React.createElement(react_router_dom_1.Outlet, null),
                " "))));
};
function App() {
    return (React.createElement(react_router_dom_1.Routes, null,
        React.createElement(react_router_dom_1.Route, { path: "/", element: React.createElement(GlobalLayout, null) },
            React.createElement(react_router_dom_1.Route, { index: true, element: React.createElement(HomePage_1["default"], null) }),
            React.createElement(react_router_dom_1.Route, { path: "search", element: React.createElement(SearchPage_1["default"], null) }),
            React.createElement(react_router_dom_1.Route, { path: "vincent/:id", element: React.createElement(DetailsPage_1["default"], null) }))));
}
exports["default"] = App;
