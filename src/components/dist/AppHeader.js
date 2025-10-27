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
    return (React.createElement(material_1.AppBar, { position: "absolute" //脱离文档流，固定视口位置
        , color: 'transparent', sx: {
            // boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)', //轻微阴影
            boxShadow: 'none',
            height: "40px",
            zIndex: 999 // 确保更高的层级
        } },
        React.createElement(material_1.Toolbar, { sx: {
                bgcolor: 'transparent'
            } },
            shouldShowBack ? (React.createElement(material_1.Box, { display: "flex", alignItems: "center", onClick: goBack, style: { cursor: 'pointer', color: 'black' }, sx: { mr: 2 } },
                React.createElement(ArrowBack_1["default"], null))) : (
            // Return Logo Placeholder
            React.createElement(material_1.Box, { sx: { width: 30, mr: 2 } })),
            React.createElement(material_1.Typography, { component: react_router_dom_1.Link, to: "/vincent", sx: {
                    color: 'black',
                    fontWeight: '500',
                    textDecoration: 'none',
                    fontSize: { xs: '1rem', sm: '1rem', md: '1.25rem' }
                } }, "\u68B5\u00B7\u9AD8\u6863\u6848\u9986"),
            React.createElement(material_1.Box, { sx: { display: 'flex', alignItems: 'center', ml: 'auto' } },
                React.createElement(material_1.Button, { sx: { color: 'black' } }, "\u767B\u5F55")))));
};
exports["default"] = AppHeader;
