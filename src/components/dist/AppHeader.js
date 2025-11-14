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
var ArrowBack_1 = require("@mui/icons-material/ArrowBack");
var icons_material_1 = require("@mui/icons-material");
var react_1 = require("react");
var useAuth_1 = require("@/hooks/useAuth");
/**  */
var stringToColor = function (str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return "hsl(" + hash % 360 + ", 58%, 59%)";
};
var Header = function () {
    var navigate = react_router_dom_1.useNavigate();
    var location = react_router_dom_1.useLocation();
    var shouldShowBack = location.pathname.startsWith("/vincent/");
    var _a = useAuth_1.useAuth(), user = _a.user, logout = _a.logout, isLoading = _a.isLoading;
    var isLoggedIn = !!user;
    var _b = react_1.useState(null), anchorEl = _b[0], setAnchorEl = _b[1];
    var open = Boolean(anchorEl);
    var avatarDetails = react_1.useMemo(function () {
        var _a, _b;
        var nickname = (_a = user === null || user === void 0 ? void 0 : user.nickName) !== null && _a !== void 0 ? _a : "Guest";
        var letter = ((_b = nickname.charAt(0)) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || "G";
        return { color: stringToColor(nickname), letter: letter };
    }, [user]);
    var handleMenuOpen = function (e) { return setAnchorEl(e.currentTarget); };
    var handleMenuClose = function () { return setAnchorEl(null); };
    var handleLogoutClick = function () {
        logout();
        handleMenuClose();
        navigate("/search");
    };
    var goBack = function () { return navigate(-1); };
    var goToFavorites = function () {
        if (!isLoggedIn)
            navigate("/auth");
        else
            navigate("/favorites");
    };
    return (React.createElement(material_1.AppBar, { elevation: 0, position: "absolute", color: "transparent", sx: {
            backdropFilter: "blur(18px)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            height: 56,
            display: "flex",
            justifyContent: "center",
            zIndex: 999
        } },
        React.createElement(material_1.Toolbar, { sx: { minHeight: "56px !important" } },
            shouldShowBack ? (React.createElement(material_1.IconButton, { onClick: goBack, sx: { color: "#333", mr: 1 } },
                React.createElement(ArrowBack_1["default"], null))) : (React.createElement(material_1.Box, { sx: { width: 40, mr: 1 } })),
            React.createElement(material_1.Typography, { component: react_router_dom_1.Link, to: "/", sx: {
                    color: "#222",
                    fontWeight: 600,
                    fontSize: "1.15rem",
                    textDecoration: "none",
                    letterSpacing: 0.5,
                    mr: 4
                } }, "\u68B5\u00B7\u9AD8\u6863\u6848\u9986"),
            React.createElement(material_1.Box, { sx: { display: "flex", gap: 2, alignItems: "center", ml: "auto" } },
                React.createElement(material_1.Button, { onClick: function () { return navigate('/'); }, sx: __assign({}, MenuStyles) }, "\u4E3B\u9875"),
                React.createElement(material_1.Button, { onClick: function () { return navigate('/search'); }, sx: __assign({}, MenuStyles) }, "\u63A2\u7D22"),
                React.createElement(material_1.Button, { onClick: goToFavorites, sx: __assign({}, MenuStyles) }, "\u6211\u7684\u6536\u85CF"),
                React.createElement(material_1.Box, { sx: { width: 30 } }),
                isLoading ? (React.createElement(material_1.CircularProgress, { size: 22, sx: { color: "#777" } })) : isLoggedIn ? (React.createElement(React.Fragment, null,
                    React.createElement(material_1.IconButton, { onClick: handleMenuOpen, size: "small", sx: { p: 0, ml: 1 } },
                        React.createElement(material_1.Avatar, { sx: {
                                width: 38,
                                height: 38,
                                bgcolor: avatarDetails.color,
                                color: "white",
                                fontWeight: 600,
                                boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
                            } }, avatarDetails.letter)),
                    React.createElement(material_1.Menu, { anchorEl: anchorEl, open: open, onClose: handleMenuClose, 
                        /* Disable MUI's automatic body padding adjustment when opening the menu */
                        disableScrollLock: true, PaperProps: {
                            elevation: 0,
                            sx: {
                                mt: 2,
                                px: 1.2,
                                py: 1,
                                minWidth: 180,
                                borderRadius: "16px",
                                bgcolor: "rgba(255,255,255,0.9)",
                                backdropFilter: "blur(18px)",
                                border: "1px solid rgba(255,255,255,0.25)",
                                boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                                transform: 'translateX(-20px) !important'
                            }
                        } },
                        React.createElement(material_1.Box, { sx: {
                                display: "flex",
                                alignItems: "center", px: 1, py: 1, mb: 0.5
                            } },
                            React.createElement(material_1.Avatar, { sx: {
                                    bgcolor: avatarDetails.color,
                                    color: "white", mr: 1.5, width: 38, height: 38,
                                    fontWeight: 600
                                } }, avatarDetails.letter),
                            React.createElement(material_1.Typography, { sx: { fontSize: "0.95rem", fontWeight: 600 } }, (user === null || user === void 0 ? void 0 : user.nickName) || "User")),
                        React.createElement(material_1.Box, { sx: { height: 1, bgcolor: "rgba(0,0,0,0.06)", mx: 1, my: 1 } }),
                        React.createElement(material_1.MenuItem, { onClick: handleLogoutClick, sx: {
                                borderRadius: "10px",
                                py: 1.1,
                                fontSize: "0.95rem",
                                "&:hover": { background: "rgba(0,0,0,0.06)" }
                            } },
                            React.createElement(material_1.ListItemIcon, null,
                                React.createElement(icons_material_1.Logout, { fontSize: "small" })),
                            "\u6CE8\u9500")))) : (React.createElement(material_1.Button, { onClick: function () { return navigate("/auth"); }, variant: "contained", disableElevation: true, sx: {
                        textTransform: "none",
                        borderRadius: "8px",
                        px: 3,
                        py: 0.7,
                        fontSize: "0.95rem",
                        background: "#2f6fa0",
                        "&:hover": { background: "#295f8a" }
                    } }, "\u767B\u5F55"))))));
};
exports["default"] = Header;
var MenuStyles = {
    textTransform: "none",
    color: "#444",
    fontSize: "0.95rem",
    fontWeight: 500,
    px: 1,
    "&:hover": { color: "#b02d2d" }
};
