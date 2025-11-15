"use strict";
exports.__esModule = true;
var material_1 = require("@mui/material");
var Logout_1 = require("@mui/icons-material/Logout");
var AccountCircle_1 = require("@mui/icons-material/AccountCircle");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var stringToColor = function (str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return "hsl(" + hash % 360 + ", 58%, 59%)";
};
function AvatarMenu(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var user = _a.user, onLogout = _a.onLogout;
    var _k = react_1.useState(null), anchorEl = _k[0], setAnchorEl = _k[1];
    var navigate = react_router_dom_1.useNavigate();
    var userData = (_c = (_b = user === null || user === void 0 ? void 0 : user.data) !== null && _b !== void 0 ? _b : user) !== null && _c !== void 0 ? _c : null;
    var isLoggedIn = Boolean(userData && (userData.nickName || userData.userId));
    var nickname = (_e = (_d = userData === null || userData === void 0 ? void 0 : userData.nickName) !== null && _d !== void 0 ? _d : userData === null || userData === void 0 ? void 0 : userData.userId) !== null && _e !== void 0 ? _e : "User";
    var letter = (nickname && nickname.charAt(0).toUpperCase()) || "V";
    var color = stringToColor(nickname);
    var email = (_f = userData === null || userData === void 0 ? void 0 : userData.email) !== null && _f !== void 0 ? _f : "";
    var registeredAt = (_h = (_g = userData === null || userData === void 0 ? void 0 : userData.registeredAt) !== null && _g !== void 0 ? _g : userData === null || userData === void 0 ? void 0 : userData.registered_at) !== null && _h !== void 0 ? _h : null;
    var registeredStr = registeredAt ? new Date(registeredAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) : null;
    var open = Boolean(anchorEl);
    var handleClose = function () { return setAnchorEl(null); };
    var handleProfile = function () {
        handleClose();
        navigate("/profile");
    };
    return (React.createElement(React.Fragment, null,
        !isLoggedIn ? (React.createElement(material_1.Button, { color: "inherit", onClick: function () { return navigate('/auth'); }, sx: { p: 0, minWidth: "auto" } }, "\u767B\u5F55")) : (React.createElement(material_1.IconButton, { onClick: function (e) { return setAnchorEl(e.currentTarget); }, sx: { p: 0, width: "100%", height: "100%" } },
            React.createElement(material_1.Avatar, { sx: {
                    bgcolor: color, color: "white", fontWeight: 500,
                    width: { xs: 30, sm: 35 },
                    height: { xs: 30, sm: 35 },
                    fontSize: { xs: "1rem", sm: "1.25rem" }
                } }, letter))),
        React.createElement(material_1.Menu, { anchorEl: anchorEl, open: open, onClose: handleClose, disableScrollLock: true, anchorOrigin: { vertical: "bottom", horizontal: "right" }, transformOrigin: { vertical: "top", horizontal: "right" }, PaperProps: {
                elevation: 6,
                sx: {
                    mt: 1.5,
                    mr: 1.5,
                    minWidth: 220,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    boxShadow: "rgba(15, 15, 15, 0.06) 0px 6px 24px"
                }
            } },
            React.createElement(material_1.Stack, { direction: "row", spacing: 1.5, alignItems: "center", sx: { px: 0, py: 1 } },
                React.createElement(material_1.Avatar, { sx: {
                        bgcolor: color,
                        color: "white",
                        width: 44,
                        height: 44,
                        fontSize: "1.15rem",
                        fontWeight: 500
                    } }, letter),
                React.createElement(material_1.Box, { sx: { display: "flex", flexDirection: "column" } },
                    React.createElement(material_1.Typography, { sx: { fontSize: "0.95rem", fontWeight: 700 } }, nickname),
                    email ? (React.createElement(material_1.Typography, { sx: { fontSize: "0.82rem", color: "text.secondary" } }, email)) : (React.createElement(material_1.Typography, { sx: { fontSize: "0.82rem", color: "text.secondary" } },
                        "ID: ", (_j = userData === null || userData === void 0 ? void 0 : userData.userId) !== null && _j !== void 0 ? _j : "-")))),
            registeredStr && (React.createElement(material_1.Typography, { sx: { fontSize: "0.75rem", color: "text.secondary", px: 1, mt: 0.25 } },
                "\u6CE8\u518C\u4E8E ",
                registeredStr)),
            React.createElement(material_1.Divider, { sx: { my: 1 } }),
            React.createElement(material_1.MenuItem, { onClick: handleProfile, sx: { py: 1 } },
                React.createElement(material_1.ListItemIcon, { sx: { minWidth: 36 } },
                    React.createElement(AccountCircle_1["default"], { fontSize: "small" })),
                React.createElement(material_1.Typography, { sx: { fontSize: "0.95rem" } }, "\u7F16\u8F91\u4E2A\u4EBA\u4FE1\u606F")),
            React.createElement(material_1.MenuItem, { onClick: function () {
                    handleClose();
                    onLogout();
                }, sx: { py: 1 } },
                React.createElement(material_1.ListItemIcon, { sx: { minWidth: 36 } },
                    React.createElement(Logout_1["default"], { fontSize: "small" })),
                React.createElement(material_1.Typography, { sx: { fontSize: "0.95rem" } }, "\u6CE8\u9500")))));
}
exports["default"] = AvatarMenu;
