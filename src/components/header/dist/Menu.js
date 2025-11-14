"use strict";
exports.__esModule = true;
var material_1 = require("@mui/material");
var Home_1 = require("@mui/icons-material/Home");
var TravelExplore_1 = require("@mui/icons-material/TravelExplore");
var Favorite_1 = require("@mui/icons-material/Favorite");
function Menu(_a) {
    var isMobile = _a.isMobile, drawerOpen = _a.drawerOpen, setDrawerOpen = _a.setDrawerOpen, goHome = _a.goHome, goSearch = _a.goSearch, goFavorites = _a.goFavorites;
    if (isMobile) {
        return (React.createElement(material_1.Drawer, { anchor: "left", open: drawerOpen, onClose: function () { return setDrawerOpen(false); } },
            React.createElement(material_1.Box, { sx: { width: 250, p: 2 } },
                React.createElement(material_1.Typography, { sx: { fontWeight: 700, fontSize: "1.1rem", mb: 2 } }, "\u83DC\u5355"),
                React.createElement(material_1.MenuItem, { onClick: function () { setDrawerOpen(false); goHome(); } },
                    React.createElement(material_1.ListItemIcon, null,
                        React.createElement(Home_1["default"], { sx: { color: "#444" } })),
                    React.createElement(material_1.ListItemText, { primary: "\u4E3B\u9875" })),
                React.createElement(material_1.MenuItem, { onClick: function () { setDrawerOpen(false); goSearch(); } },
                    React.createElement(material_1.ListItemIcon, null,
                        React.createElement(TravelExplore_1["default"], { sx: { color: "#444" } })),
                    React.createElement(material_1.ListItemText, { primary: "\u63A2\u7D22" })),
                React.createElement(material_1.MenuItem, { onClick: function () { setDrawerOpen(false); goFavorites(); } },
                    React.createElement(material_1.ListItemIcon, null,
                        React.createElement(Favorite_1["default"], { sx: { color: "#0c0c0cff" } })),
                    React.createElement(material_1.ListItemText, { primary: "\u6211\u7684\u6536\u85CF" })))));
    }
    // PC 模式
    return (React.createElement(material_1.Box, { sx: { display: "flex", gap: 2, alignItems: "center", ml: "auto", mr: 5 } },
        React.createElement(material_1.Button, { onClick: goHome, sx: btnStyle }, "\u4E3B\u9875"),
        React.createElement(material_1.Button, { onClick: goSearch, sx: btnStyle }, "\u63A2\u7D22"),
        React.createElement(material_1.Button, { onClick: goFavorites, sx: btnStyle }, "\u6211\u7684\u6536\u85CF")));
}
exports["default"] = Menu;
var btnStyle = {
    textTransform: "none",
    color: "#444",
    fontSize: "0.95rem",
    fontWeight: 500,
    px: 1,
    "&:hover": { color: "#b02d2d" }
};
