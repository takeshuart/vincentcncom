"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var material_1 = require("@mui/material");
var useFavorites_1 = require("@/hooks/useFavorites");
var useAuth_1 = require("@/hooks/useAuth");
var react_router_dom_1 = require("react-router-dom");
var constants_1 = require("@/utils/constants");
var FavoritesPage = function () {
    var user = useAuth_1.useAuth().user;
    var navigate = react_router_dom_1.useNavigate();
    var userId = user === null || user === void 0 ? void 0 : user.userId;
    if (!userId) {
        navigate("/auth");
    }
    var _a = useFavorites_1.useFavoritesQuery(userId !== null && userId !== void 0 ? userId : ''), data = _a.data, isLoading = _a.isLoading;
    var favorites = data !== null && data !== void 0 ? data : [];
    if (isLoading) {
        return (react_1["default"].createElement(material_1.Box, { sx: { p: 4 } },
            react_1["default"].createElement(material_1.Typography, { variant: "h6", gutterBottom: true }, "\u6B63\u5728\u52A0\u8F7D\u6536\u85CF\u4F5C\u54C1..."),
            react_1["default"].createElement(material_1.Box, { sx: { display: "flex", flexWrap: "wrap", gap: 2 } }, __spreadArrays(Array(8)).map(function (_, i) { return (react_1["default"].createElement(material_1.Skeleton, { key: i, variant: "rectangular", width: 200, height: 180 })); }))));
    }
    if (!favorites.length) {
        return (react_1["default"].createElement(material_1.Box, { sx: { p: 4, textAlign: "center" } },
            react_1["default"].createElement(material_1.Typography, { variant: "h6", color: "text.secondary" }, "\u6682\u65E0\u6536\u85CF\u4F5C\u54C1")));
    }
    return (react_1["default"].createElement(material_1.Container, { sx: { display: 'flex', paddingTop: 20 } },
        react_1["default"].createElement(material_1.Box, { sx: { p: { xs: 2, md: 4 }, justifyContent: 'center' } },
            react_1["default"].createElement(material_1.ImageList, { variant: "masonry", cols: 4, gap: 8 }, favorites.map(function (fav) {
                var artwork = fav.artwork;
                var transparency = 0.8;
                var hoverOverlayColor = "rgba(" + (artwork.r || 0) + ", " + (artwork.g || 0) + ", " + (artwork.b || 0) + ", " + transparency + ")";
                return (react_1["default"].createElement(material_1.ImageListItem, { key: artwork.id, sx: {
                        position: "relative",
                        cursor: "pointer",
                        borderRadius: 2,
                        overflow: "hidden",
                        transition: "transform 0.3s ease",
                        "&:hover .overlay": {
                            opacity: 1
                        }
                    }, onClick: function () { return navigate("/vincent/" + artwork.id); } },
                    react_1["default"].createElement("img", { src: "" + constants_1.IMAGE_DOMAIN + artwork.primaryImageSmall, alt: artwork.titleZh, loading: "lazy", style: {
                            width: "100%",
                            height: "auto",
                            display: "block",
                            borderRadius: "8px"
                        } }),
                    react_1["default"].createElement(material_1.Box, { className: "overlay", sx: {
                            position: "absolute",
                            inset: 0,
                            backgroundColor: hoverOverlayColor,
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: 'center',
                            p: 2,
                            color: "white",
                            backdropFilter: "blur(1px)"
                        } },
                        react_1["default"].createElement(material_1.Typography, { variant: "subtitle1", sx: { fontWeight: 600, color: "#fff" } }, artwork.titleZh || artwork.titleEn),
                        react_1["default"].createElement(material_1.Typography, { variant: "body2", sx: { color: "#f0f0f0", fontSize: "0.85rem" } }, artwork.collectionZh || ""),
                        react_1["default"].createElement(material_1.Typography, { variant: "body2", sx: { color: "#f0f0f0", fontSize: "0.8rem" } }, artwork.displayDate || ""))));
            })))));
};
exports["default"] = FavoritesPage;
