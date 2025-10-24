"use strict";
exports.__esModule = true;
var material_1 = require("@mui/material");
var react_router_dom_1 = require("react-router-dom");
var ArrowBack_1 = require("@mui/icons-material/ArrowBack");
var AppHeader = function () {
    var navigate = react_router_dom_1.useNavigate();
    var location = react_router_dom_1.useLocation();
    var shouldShowBack = !(location.pathname === '/vincent');
    //go back searchPage
    var goBack = function () {
        //返回上一页 而不是直接到搜索页。
        //navigate(-1)
        navigate("/vincent/search" + location.search); //recover search fitlers from querystring
    };
    return (React.createElement(material_1.AppBar, { position: "static", sx: { bgcolor: '#A7A6C3', boxShadow: 'none' } },
        React.createElement(material_1.Toolbar, null,
            shouldShowBack ? (React.createElement(material_1.Box, { display: "flex", alignItems: "center", onClick: goBack, style: { cursor: 'pointer', color: 'black' }, sx: { mr: 2 } },
                React.createElement(ArrowBack_1["default"], null))) : (
            // Return Logo Placeholder
            React.createElement(material_1.Box, { sx: { width: 30, mr: 2 } })),
            React.createElement(material_1.Typography, { component: react_router_dom_1.Link, to: "/vincent", sx: {
                    flexGrow: 1,
                    color: 'black',
                    fontWeight: '500',
                    textDecoration: 'none',
                    fontSize: { xs: '1rem', sm: '1rem', md: '1.25rem' }
                } }, "\u68B5\u00B7\u9AD8\u6863\u6848\u9986"),
            React.createElement(material_1.Button, { color: "inherit", sx: { color: 'black' } }, "\u767B\u5F55"))));
};
exports["default"] = AppHeader;
