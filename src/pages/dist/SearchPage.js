"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var react_1 = require("react");
var material_1 = require("@mui/material");
var react_router_dom_1 = require("react-router-dom");
var useArtSearch_1 = require("../hooks/useArtSearch");
var Filters_1 = require("./Filters");
var ColorSearchBar_1 = require("../components/ColorSearchBar");
var PeriodBar_1 = require("../components/PeriodBar");
var styles_1 = require("@mui/material/styles");
require("../styles/ArtTableStyles.css");
var STORAGE_KEY = 'currentPageContext';
// ----------------------------
// ArtSearchPage
// ----------------------------
function ArtSearchPage() {
    var location = react_router_dom_1.useLocation();
    var querystring = location.search;
    var loadMoreRef = react_1.useRef(null);
    var _a = useArtSearch_1.useArtSearch(), query = _a.query, keywordInput = _a.keywordInput, setKeywordInput = _a.setKeywordInput, artworks = _a.artworks, totalResults = _a.totalResults, isConfigLoaded = _a.isConfigLoaded, isInitialLoading = _a.isInitialLoading, isNewSearch = _a.isNewSearch, hasNextPage = _a.hasNextPage, autoLoadNextPage = _a.autoLoadNextPage, manualLoadNextPage = _a.manualLoadNextPage, isFetchingNextPage = _a.isFetchingNextPage, canAutoLoad = _a.canAutoLoad, remainingCount = _a.remainingCount, handleColorSelect = _a.handleColorSelect, handlePeriodChange = _a.handlePeriodChange, handleSearchTrigger = _a.handleSearchTrigger;
    var saveSearchContext = function (currentId) {
        var allLoadedIds = artworks.map(function (item) { return String(item.id); });
        var indexInList = allLoadedIds.findIndex(function (id) { return id === String(currentId); });
        var context = {
            idList: allLoadedIds,
            currentIndex: indexInList
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
    };
    // ----------------------------
    // IntersectionObserver 自动加载
    // ----------------------------
    react_1.useEffect(function () {
        if (!loadMoreRef.current || !canAutoLoad || isFetchingNextPage)
            return;
        var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                autoLoadNextPage();
            }
        }, {
            rootMargin: '200px 0px',
            threshold: 0.1
        });
        observer.observe(loadMoreRef.current);
        return function () {
            if (loadMoreRef.current)
                observer.unobserve(loadMoreRef.current);
        };
    }, [canAutoLoad, isFetchingNextPage, autoLoadNextPage]);
    var isNewSearchPending = isNewSearch && artworks.length > 0;
    var isReady = isConfigLoaded && !isInitialLoading;
    return (React.createElement(React.Fragment, null,
        React.createElement(ThemedLoadingOverlay, { isLoading: isInitialLoading }),
        React.createElement(material_1.Container, { maxWidth: false, disableGutters: true },
            React.createElement(material_1.Container, { maxWidth: false, sx: {
                    width: '90%',
                    mx: 'auto',
                    '@media (max-width: 600px)': { width: '100%', px: '1px' },
                    pt: '60px'
                } },
                React.createElement(material_1.Grid, { container: true, justifyContent: "center" },
                    React.createElement(material_1.Grid, { item: true, xs: 12, md: 10 },
                        React.createElement(material_1.Box, { sx: {
                                '@media (max-width: 600px)': { width: '90%', mx: 'auto' }
                            } },
                            React.createElement(material_1.Grid, { container: true, sx: { mb: { xs: '20px', md: '30px' } } },
                                React.createElement(Filters_1.SearchInput, { value: keywordInput, onChange: function (e) {
                                        return setKeywordInput(e.target.value);
                                    }, onKeyDown: function (e) {
                                        if (e.key === 'Enter')
                                            handleSearchTrigger(e);
                                    }, onClick: handleSearchTrigger })),
                            React.createElement(material_1.Grid, { container: true },
                                React.createElement(PeriodBar_1["default"], { selectedValue: query.period, onSelectionChange: function (v) { return handlePeriodChange(v !== null && v !== void 0 ? v : ''); } })),
                            React.createElement(material_1.Grid, { item: true, xs: 12 },
                                React.createElement(ColorSearchBar_1["default"], { onColorSelect: handleColorSelect, initialColor: query.color }))),
                        React.createElement(material_1.Grid, { container: true, justifyContent: "center" },
                            React.createElement(material_1.Box, { sx: {
                                    minHeight: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                } }, isNewSearchPending ? (React.createElement(material_1.CircularProgress, { size: 20, sx: { color: '#9694c2ff', m: 0 } })) : (React.createElement(material_1.Typography, { variant: "subtitle1", sx: { color: 'grey' } },
                                "\u53D1\u73B0",
                                ' ',
                                React.createElement("span", { style: { fontWeight: 'bold' } }, totalResults),
                                " \u4E2A\u4F5C\u54C1")))),
                        React.createElement(material_1.Grid, { container: true, justifyContent: "center", sx: { mt: 4, minHeight: 600, '@media (max-width: 600px)': { mt: 0 } } },
                            artworks.length === 0 && !isNewSearch && (React.createElement(material_1.Box, { sx: {
                                    width: '100%',
                                    minHeight: 300,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    py: 5
                                } },
                                React.createElement(material_1.Typography, { variant: "h6", color: "text.secondary" }, "\u672A\u627E\u5230\u7B26\u5408\u6761\u4EF6\u7684\u4F5C\u54C1 \uD83E\uDD14"))), artworks === null || artworks === void 0 ? void 0 :
                            artworks.map(function (artwork, index) { return (React.createElement(ArtworkCard, { key: index, artwork: artwork, querystring: querystring, saveSearchContext: saveSearchContext, isNewSearchPending: isNewSearchPending })); }),
                            React.createElement(material_1.Grid, { item: true, xs: 12 },
                                React.createElement(material_1.Box, { ref: loadMoreRef, sx: {
                                        py: 4,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        minHeight: isFetchingNextPage || (hasNextPage && !isNewSearchPending)
                                            ? '150px'
                                            : '50px'
                                    } },
                                    isFetchingNextPage && (React.createElement(React.Fragment, null,
                                        React.createElement(material_1.CircularProgress, { size: 40 }),
                                        React.createElement(material_1.Typography, { variant: "body1", sx: { ml: 2, color: 'text.secondary' } }, "\u52A0\u8F7D\u4E2D..."))),
                                    hasNextPage && !isNewSearchPending && !isFetchingNextPage && (React.createElement(material_1.Button, { onClick: manualLoadNextPage, disabled: isFetchingNextPage, variant: "text", size: "large", sx: {
                                            textTransform: 'none',
                                            fontWeight: 500,
                                            fontSize: '1rem',
                                            py: 0.5,
                                            px: 2,
                                            '&:hover': { textDecoration: 'underline', backgroundColor: 'transparent' }
                                        } },
                                        "\u52A0\u8F7D\u66F4\u591A... (\u5269\u4F59",
                                        remainingCount,
                                        ")")),
                                    !hasNextPage && artworks.length > 0 && !isFetchingNextPage && (React.createElement(material_1.Typography, { variant: "subtitle1", color: "text.secondary" }, "\u5DF2\u52A0\u8F7D\u5168\u90E8\u4F5C\u54C1 \uD83D\uDDBC\uFE0F")))))))))));
}
exports["default"] = ArtSearchPage;
// ----------------------------
// Loading Overlay
// ----------------------------
var fadeOut = styles_1.keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  from { opacity: 1; }\n  to { opacity: 0; }\n"], ["\n  from { opacity: 1; }\n  to { opacity: 0; }\n"])));
var TransitioningOverlay = styles_1.styled(material_1.Box)(function (_a) {
    var isLeaving = _a.isLeaving;
    return ({
        position: 'absolute',
        paddingTop: 10,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 998,
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1,
        transition: 'opacity 0.5s ease-out',
        animation: isLeaving ? fadeOut + " 0.5s ease-out forwards" : 'none',
        pointerEvents: isLeaving ? 'none' : 'auto'
    });
});
var ThemedLoadingOverlay = function (_a) {
    var isLoading = _a.isLoading;
    var _b = react_1.useState(isLoading), controlVisibility = _b[0], setControlVisibility = _b[1];
    react_1.useEffect(function () {
        if (isLoading) {
            setControlVisibility(true);
        }
        else {
            var timer_1 = setTimeout(function () { return setControlVisibility(false); }, 500);
            return function () { return clearTimeout(timer_1); };
        }
    }, [isLoading]);
    if (!controlVisibility)
        return null;
    return (React.createElement(TransitioningOverlay, { isLeaving: !isLoading }, isLoading && React.createElement(material_1.CircularProgress, { size: 60, sx: { color: '#FFC700' } })));
};
// ----------------------------
// Artwork Card
// ----------------------------
var ArtworkCard = function (_a) {
    var _b;
    var artwork = _a.artwork, querystring = _a.querystring, saveSearchContext = _a.saveSearchContext, isNewSearchPending = _a.isNewSearchPending;
    var showCardOverlay = isNewSearchPending;
    var theme = material_1.useTheme();
    var isMobile = material_1.useMediaQuery(theme.breakpoints.down('sm'));
    var HOVER_OVERLAY_CLASS = 'hover-ripple-overlay';
    // 1. 定义蒙版的透明度 (Alpha)。0.15 通常比较合适，效果不会太重。
    var HOVER_ALPHA = 0.15;
    var hoverOverlayColor = "rgba(" + artwork.r + ", " + artwork.g + ", " + artwork.b + ", " + HOVER_ALPHA + ")";
    return (React.createElement(material_1.Grid, { item: true, xs: 12, sm: 4, md: 4, sx: {
            padding: '10px 40px 20px 10px',
            position: 'relative',
            '@media (max-width: 600px)': { p: 1 }
        } },
        React.createElement(material_1.Card, { variant: "outlined", sx: {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: 'none',
                position: 'relative',
                '&:hover': (_b = {
                        cursor: 'pointer'
                    },
                    // 1. 悬停覆盖层展开并显示
                    _b["& ." + HOVER_OVERLAY_CLASS] = {
                        transform: 'scale(1)',
                        opacity: 1
                    },
                    // 2. 图片和文字透明度降低（如果您需要这个效果）
                    _b['& .MuiCardMedia-root, & .MuiCardContent-root'] = {
                        opacity: 0.99,
                        transition: 'opacity 0.5s'
                    },
                    _b)
            } },
            showCardOverlay && (React.createElement(material_1.Box, { sx: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 10,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pointerEvents: 'none'
                } })),
            React.createElement(material_1.Box, { className: HOVER_OVERLAY_CLASS, sx: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: hoverOverlayColor,
                    zIndex: 1,
                    pointerEvents: 'none',
                    //实现扩散蒙版效果
                    transform: 'scale(0.95)',
                    opacity: 0,
                    // 动画过渡
                    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
                } }),
            React.createElement(react_router_dom_1.Link, { target: "_self", style: { textDecoration: 'none' }, to: "/vincent/" + artwork.id + querystring, onClick: function () { return saveSearchContext(artwork.id); } },
                React.createElement(material_1.CardMedia, { component: "img", image: "https://artworks-1257857866.cos.ap-beijing.myqcloud.com" + artwork.primaryImageSmall, alt: "", sx: {
                        width: '100%',
                        height: { xs: 'auto', sm: '250px' },
                        objectFit: { xs: 'initial', sm: 'contain' },
                        objectPosition: 'center',
                        backgroundColor: '#fdfbfbff',
                        // '&:hover': { backgroundColor: '#f0f0f0' },
                        opacity: showCardOverlay ? 0.6 : 1,
                        transition: 'opacity 0.3s'
                    } }),
                React.createElement(material_1.CardContent, { sx: {
                        textAlign: 'left',
                        opacity: showCardOverlay ? 0.6 : 1,
                        transition: 'opacity 0.3s',
                        pb: 0
                    } },
                    React.createElement(material_1.Typography, { sx: {
                            fontWeight: 400,
                            fontSize: { xs: 14, md: 18 },
                            textAlign: 'left',
                            color: 'black'
                        } }, artwork.titleZh || artwork.titleEn),
                    React.createElement(material_1.Typography, { color: "text.secondary", variant: "body2", sx: { textAlign: 'left' } },
                        artwork.displayDateZh,
                        artwork.placeOfOrigin ? ", " + artwork.placeOfOrigin : ''),
                    artwork.collection && (React.createElement(material_1.Typography, { variant: "body2", color: "text.secondary", textAlign: "left" }, artwork.collectionZh)))))));
};
var templateObject_1;
