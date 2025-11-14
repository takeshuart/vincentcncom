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
// define a skeleton component to show while loading favorites
var FavoriteSkeleton = function () {
    var skeletonItems = __spreadArrays(Array(8).keys());
    return (react_1["default"].createElement(material_1.ImageList, { variant: "masonry", cols: 4, gap: 8 }, skeletonItems.map(function (i) { return (react_1["default"].createElement(material_1.ImageListItem, { key: i },
        react_1["default"].createElement(material_1.Skeleton, { variant: "rectangular", 
            // height={Math.random() * 100 + 150}
            sx: { borderRadius: 2 } }))); })));
};
var FavoritesPage = function () {
    var user = useAuth_1.useAuth().user;
    var navigate = react_router_dom_1.useNavigate();
    var theme = material_1.useTheme();
    var isMobile = material_1.useMediaQuery(theme.breakpoints.down("sm"));
    var userId = user === null || user === void 0 ? void 0 : user.userId;
    if (!userId) {
        navigate("/auth");
    }
    var _a = useFavorites_1.useFavoritesQuery(userId !== null && userId !== void 0 ? userId : ''), data = _a.data, isLoading = _a.isLoading, isFetching = _a.isFetching, isFetched = _a.isFetched;
    if (isLoading || isFetching || !isFetched) {
        return (react_1["default"].createElement(material_1.Container, { sx: { display: 'flex', paddingTop: 15, justifyContent: 'center' } },
            react_1["default"].createElement(material_1.Box, { sx: { p: { xs: 2, md: 4 } } },
                react_1["default"].createElement(material_1.Skeleton, { width: 200, height: 30, sx: { mb: 2 } }),
                " ",
                react_1["default"].createElement(FavoriteSkeleton, null))));
    }
    if (!data || data.length === 0) {
        return (react_1["default"].createElement(material_1.Box, { sx: { p: 20, textAlign: "center", paddingTop: 15 } },
            react_1["default"].createElement(material_1.Typography, { variant: "h6", color: "text.secondary" }, "\u6682\u65E0\u6536\u85CF\u4F5C\u54C1")));
    }
    var favorites = data;
    return (react_1["default"].createElement(material_1.Container, { sx: { display: 'flex', paddingTop: { xs: 10, md: 15 } } },
        react_1["default"].createElement(material_1.Box, { sx: { p: { xs: 2, md: 4 }, justifyContent: 'center' } },
            react_1["default"].createElement(material_1.Typography, { variant: "subtitle1", sx: { fontWeight: 600, color: "black" } },
                "\u6211\u7684\u6536\u85CF\uFF08",
                favorites.length,
                "\uFF09"),
            react_1["default"].createElement(material_1.ImageList, { variant: "masonry", cols: isMobile ? 2 : 4, gap: 8 }, favorites.map(function (fav) {
                var artwork = fav.artwork;
                var transparency = 0.8;
                var hoverOverlayColor = "rgba(" + (artwork.r || 0) + ", " + (artwork.g || 0) + ", " + (artwork.b || 0) + ", " + transparency + ")";
                return (react_1["default"].createElement(material_1.ImageListItem, { key: artwork.id, sx: {
                        position: "relative",
                        cursor: "pointer",
                        borderRadius: 0.5,
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
