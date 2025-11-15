"use strict";
exports.__esModule = true;
var material_1 = require("@mui/material");
var Home_1 = require("@mui/icons-material/Home");
var TravelExplore_1 = require("@mui/icons-material/TravelExplore");
var Favorite_1 = require("@mui/icons-material/Favorite");
var react_1 = require("react");
function Menu(_a) {
    var isMobile = _a.isMobile, goHome = _a.goHome, goSearch = _a.goSearch, goFavorites = _a.goFavorites;
    var _b = react_1.useState(0), value = _b[0], setValue = _b[1];
    if (isMobile) {
        return (React.createElement(material_1.BottomNavigation, { value: value, onChange: function (event, newValue) {
                setValue(newValue);
                if (newValue === 0)
                    goHome();
                else if (newValue === 1)
                    goSearch();
                else if (newValue === 2)
                    goFavorites();
            }, sx: {
                position: "fixed",
                bottom: 0, left: 0, right: 0,
                width: "100%",
                borderTop: "1px solid rgba(0,0,0,0.08)",
                backgroundColor: "#fff",
                zIndex: 50
            } },
            React.createElement(material_1.BottomNavigationAction, { icon: React.createElement(Home_1["default"], { sx: { fontSize: "1.5rem" } }), sx: MOBILE_BUTTON_STYLE }),
            React.createElement(material_1.BottomNavigationAction, { icon: React.createElement(TravelExplore_1["default"], { sx: { fontSize: "1.5rem" } }), sx: MOBILE_BUTTON_STYLE }),
            React.createElement(material_1.BottomNavigationAction, { icon: React.createElement(Favorite_1["default"], { sx: { fontSize: "1.5rem" } }), sx: MOBILE_BUTTON_STYLE })));
    }
    // PC 模式
    return (React.createElement(material_1.Box, { sx: { display: "flex", gap: 2, alignItems: "center", ml: "auto", mr: 5 } },
        React.createElement(material_1.Button, { onClick: goHome, sx: PC_BUTTON_STYLE }, "\u4E3B\u9875"),
        React.createElement(material_1.Button, { onClick: goSearch, sx: PC_BUTTON_STYLE }, "\u63A2\u7D22"),
        React.createElement(material_1.Button, { onClick: goFavorites, sx: PC_BUTTON_STYLE }, "\u6211\u7684\u6536\u85CF")));
}
exports["default"] = Menu;
var PC_BUTTON_STYLE = {
    textTransform: "none",
    color: "#444",
    fontSize: "0.95rem",
    fontWeight: 500,
    px: 1,
    "&:hover": { color: "#b02d2d" }
};
var MOBILE_BUTTON_STYLE = {
    color: "#666",
    "&.Mui-selected": { color: "#215A8F" }
};
