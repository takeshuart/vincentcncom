"use strict";
exports.__esModule = true;
var material_1 = require("@mui/material");
var Logout_1 = require("@mui/icons-material/Logout");
var react_1 = require("react");
var stringToColor = function (str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return "hsl(" + hash % 360 + ", 58%, 59%)";
};
function AvatarMenu(_a) {
    var _b;
    var user = _a.user, onLogout = _a.onLogout;
    var _c = react_1.useState(null), anchorEl = _c[0], setAnchorEl = _c[1];
    var nickname = (_b = user === null || user === void 0 ? void 0 : user.nickName) !== null && _b !== void 0 ? _b : "User";
    var letter = nickname.charAt(0).toUpperCase();
    var color = stringToColor(nickname);
    var open = Boolean(anchorEl);
    return (React.createElement(React.Fragment, null,
        React.createElement(material_1.IconButton, { onClick: function (e) { return setAnchorEl(e.currentTarget); }, sx: { ml: 1 } },
            React.createElement(material_1.Avatar, { sx: {
                    bgcolor: color, color: "white", fontWeight: 600,
                    width: { xs: 30, sm: 35 },
                    height: { xs: 30, sm: 35 }
                } }, letter)),
        React.createElement(material_1.Menu, { anchorEl: anchorEl, open: open, onClose: function () { return setAnchorEl(null); }, disableScrollLock: true, PaperProps: {
                elevation: 0,
                sx: {
                    mt: 1.5,
                    px: 1,
                    py: 1,
                    minWidth: 180,
                    borderRadius: "16px",
                    bgcolor: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(18px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.15)"
                }
            } },
            React.createElement(material_1.Box, { sx: { display: "flex", alignItems: "center", px: 1, py: 1 } },
                React.createElement(material_1.Avatar, { sx: { bgcolor: color, color: "white", mr: 1.5 } }, letter),
                React.createElement(material_1.Typography, { sx: { fontSize: "0.95rem", fontWeight: 600 } }, nickname)),
            React.createElement(material_1.MenuItem, { onClick: onLogout, sx: { borderRadius: "10px", py: 1.1, fontSize: "0.95rem" } },
                React.createElement(material_1.ListItemIcon, null,
                    React.createElement(Logout_1["default"], { fontSize: "small" })),
                "\u6CE8\u9500"))));
}
exports["default"] = AvatarMenu;
