"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var material_1 = require("@mui/material");
var react_router_dom_1 = require("react-router-dom");
var useAuth_1 = require("@/hooks/useAuth");
var Menu_1 = require("./Menu");
var AvatarMenu_1 = require("./AvatarMenu");
function Header() {
    var navigate = react_router_dom_1.useNavigate();
    var _a = useAuth_1.useAuth(), user = _a.user, logout = _a.logout, isLoading = _a.isLoading;
    var isMobile = material_1.useMediaQuery("(max-width: 600px)");
    var isLoggedIn = !!user;
    var goHome = function () { return navigate("/"); };
    var goSearch = function () {
        navigate("/search");
        window.scrollTo(0, 0);
    };
    var goFavorites = function () {
        if (!isLoggedIn)
            navigate("/auth");
        else
            navigate("/favorites");
    };
    var handleLogout = function () {
        logout();
        navigate("/search");
    };
    var logic = {
        goHome: goHome,
        goSearch: goSearch,
        goFavorites: goFavorites,
        handleLogout: handleLogout,
        user: user,
        isLoggedIn: isLoggedIn,
        isLoading: isLoading,
        isMobile: isMobile
    };
    // ------------------------------
    return (React.createElement(React.Fragment, null,
        React.createElement(material_1.AppBar, { elevation: 0, position: "fixed", color: "transparent", sx: {
                // backdropFilter: "blur(18px)",//毛玻璃效果
                // borderBottom: "1px solid rgba(0,0,0,0.05)",
                height: 56,
                zIndex: 999
            } },
            React.createElement(material_1.Toolbar, { sx: { minHeight: "56px !important", px: 1 } },
                React.createElement(material_1.Typography, { component: react_router_dom_1.Link, to: "/", sx: {
                        color: "#222",
                        fontWeight: 600,
                        fontSize: { xs: "1rem", md: "1.15rem" },
                        textDecoration: "none",
                        flexGrow: isMobile ? 1 : 0,
                        pl: 0
                    } }, "\u68B5\u00B7\u9AD8\u6863\u6848\u9986"),
                React.createElement(material_1.Typography, { sx: {
                        fontStyle: "italic",
                        color: "#666",
                        fontSize: { xs: "0.3rem", md: "1rem" },
                        textAlign: { xs: "center", md: "left" },
                        mt: 1,
                        ml: 2
                    } }, !isMobile ? (React.createElement(React.Fragment, null, "\u201C\u6211\u4EEC\u771F\u7684\u4E0D\u60F3\u5728\u751F\u547D\u7684\u5C3D\u5934\u53D1\u73B0\u81EA\u5DF1\u50CF\u68A6\u6E38\u8005\u4E00\u6837\u8D70\u8FC7\u8FD9\u4E2A\u4E16\u754C\u3002\u201D")) :
                    React.createElement(React.Fragment, null)),
                !isMobile && React.createElement(Menu_1["default"], __assign({}, logic)),
                React.createElement(material_1.Box, { sx: { ml: 1, width: { xs: 30, sm: 35 }, height: { xs: 30, sm: 35 }, display: "flex", alignItems: "center", justifyContent: "center" } }, isLoading ? (React.createElement(material_1.CircularProgress, { size: 20, sx: { color: "#777" } })) : (React.createElement(AvatarMenu_1["default"], { user: user, onLogout: handleLogout }))))),
        isMobile && React.createElement(Menu_1["default"], __assign({}, logic))));
}
exports["default"] = Header;
