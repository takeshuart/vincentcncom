"use strict";
exports.__esModule = true;
var material_1 = require("@mui/material");
var react_router_dom_1 = require("react-router-dom");
var ArrowBack_1 = require("@mui/icons-material/ArrowBack");
var AppHeader = function () {
    var navigate = react_router_dom_1.useNavigate();
    var location = react_router_dom_1.useLocation();
    var isHomePage = location.pathname === '/';
    var shouldShowBack = !isHomePage;
    var goBack = function () {
        navigate(-1);
    };
    return (React.createElement(material_1.AppBar, { position: "static", sx: { backgroundColor: '#FDB813', boxShadow: 'none' } },
        React.createElement(material_1.Toolbar, null,
            shouldShowBack ? (React.createElement(material_1.Box, { display: "flex", alignItems: "center", onClick: goBack, style: { cursor: 'pointer', color: 'black' }, sx: { mr: 2 } },
                React.createElement(ArrowBack_1["default"], null))) : (
            // Return Logo Placeholder
            React.createElement(material_1.Box, { sx: { width: 40, mr: 2 } })),
            React.createElement(material_1.Typography, { component: react_router_dom_1.Link, to: "/vincent", variant: "h6", sx: { flexGrow: 1, color: 'black', fontWeight: 'bold' } }, "\u68B5\u00B7\u9AD8\u6863\u6848\u9986"),
            React.createElement(material_1.Button, { color: "inherit", sx: { color: 'black' } }, "\u767B\u5F55"))));
};
exports["default"] = AppHeader;
