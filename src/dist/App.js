"use strict";
exports.__esModule = true;
var react_router_dom_1 = require("react-router-dom");
var HomePage_1 = require("./pages/HomePage");
var DetailsPage_1 = require("./pages/DetailsPage");
var material_1 = require("@mui/material");
// import AppHeader from './components/AppHeader';
var Header_1 = require("./components/header/Header");
var SearchPage_1 = require("./pages/SearchPage");
require("./styles/index.css");
var AuthPage_1 = require("./pages/AuthPage");
var ProfilePage_1 = require("./pages/ProfilePage");
var ScrollToTop_1 = require("./components/ScrollToTop");
var FavoritesPage_1 = require("./pages/FavoritesPage");
var react_hot_toast_1 = require("react-hot-toast");
var GlobalLayout = function () {
    var isMobile = material_1.useMediaQuery("(max-width: 600px)");
    return (React.createElement(material_1.Box, { sx: { minHeight: '100vh', display: 'flex', flexDirection: 'column' } },
        React.createElement(Header_1["default"], null),
        React.createElement(material_1.Box, { component: "main", sx: { flexGrow: 1, pb: isMobile ? 7 : 0 } },
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
    return (React.createElement(React.Fragment, null,
        React.createElement(react_hot_toast_1.Toaster, { position: "top-center", toastOptions: {
                duration: 2000,
                style: {
                    padding: '6px 12px',
                    fontSize: '10px',
                    borderRadius: '8px',
                    background: 'rgba(33, 90, 143, 0.1)',
                    color: '#215A8F',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }
            } }),
        React.createElement(ScrollToTop_1["default"], null),
        React.createElement(react_router_dom_1.Routes, null,
            React.createElement(react_router_dom_1.Route, { path: "/", element: React.createElement(GlobalLayout, null) },
                React.createElement(react_router_dom_1.Route, { index: true, element: React.createElement(HomePage_1["default"], null) }),
                React.createElement(react_router_dom_1.Route, { path: "auth", element: React.createElement(AuthPage_1["default"], null) }),
                React.createElement(react_router_dom_1.Route, { path: "profile", element: React.createElement(ProfilePage_1["default"], null) }),
                React.createElement(react_router_dom_1.Route, { path: "search", element: React.createElement(SearchPage_1["default"], null) }),
                React.createElement(react_router_dom_1.Route, { path: "vincent/:id", element: React.createElement(DetailsPage_1["default"], null) }),
                React.createElement(react_router_dom_1.Route, { path: "favorites", element: React.createElement(FavoritesPage_1["default"], null) })))));
}
exports["default"] = App;
