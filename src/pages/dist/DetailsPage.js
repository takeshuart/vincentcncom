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
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var material_1 = require("@mui/material");
require("react-photo-view/dist/react-photo-view.css");
var useArtworkDetails_1 = require("../hooks/useArtworkDetails");
var ArtworkImage_1 = require("../components/ArtworkImage");
var ArrowBackIos_1 = require("@mui/icons-material/ArrowBackIos");
var ArtworkSections_1 = require("../components/ArtworkSections");
var icons_material_1 = require("@mui/icons-material");
var useSearchContextNavigation_1 = require("../hooks/useSearchContextNavigation");
var titleStyle = {
    fontWeight: 600,
    lineHeight: 2,
    fontFamily: 'Microsoft YaHei',
    fontSize: { xs: 18, md: 18 },
    color: '#333'
};
var DetailsPage = function () {
    var isMobile = material_1.useMediaQuery('(max-width:600px)');
    var id = react_router_dom_1.useParams().id;
    var artworkId = id;
    var _a = useArtworkDetails_1["default"](artworkId), artwork = _a.artwork, extLinks = _a.extLinks, activeSection = _a.activeSection, lettersData = _a.lettersData, isLoadingLetters = _a.isLoadingLetters, isLoadingArtwork = _a.isLoadingArtwork, sections = _a.sections, setActiveSection = _a.setActiveSection;
    var _b = useSearchContextNavigation_1["default"](id), canGoNext = _b.canGoNext, canGoPrev = _b.canGoPrev, goToNext = _b.goToNext, goToPrev = _b.goToPrev;
    var renderContent = function () {
        if (!artwork)
            return null;
        switch (activeSection) {
            case 'overview':
                return react_1["default"].createElement(ArtworkSections_1.ArtworkOverview, { artwork: artwork, extLinks: extLinks });
            case 'letters':
                return react_1["default"].createElement(ArtworkSections_1.ArtworkLetters, { isLoading: isLoadingLetters, lettersData: lettersData });
            case 'exhibition':
                return react_1["default"].createElement(ArtworkSections_1.ArtworkExhibition, { exhibitions: artwork.exhibitionHistory });
            case 'provenance':
                return react_1["default"].createElement(material_1.Typography, null, artwork.provenance || '暂无作品出处信息。');
            case 'references':
                return react_1["default"].createElement(material_1.Typography, null, artwork.references || '暂无参考文献。');
            default:
                return null;
        }
    };
    if (isLoadingArtwork) {
        return (react_1["default"].createElement(material_1.Box, { sx: { p: 5, textAlign: 'center' } },
            react_1["default"].createElement(material_1.CircularProgress, null)));
    }
    if (!artwork) {
        return react_1["default"].createElement(material_1.Box, { sx: { p: 5, textAlign: 'center' } }, "\u672A\u80FD\u52A0\u8F7D\u4F5C\u54C1\u8BE6\u60C5\u3002");
    }
    return (react_1["default"].createElement(material_1.Grid, { container: true, justifyContent: "center", sx: { paddingTop: 10 } },
        react_1["default"].createElement(material_1.Box, { sx: {
                position: 'relative',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                height: isMobile ? '80vh' : 650
            } },
            react_1["default"].createElement(ArtworkImage_1["default"], { src: artwork.primaryImageMedium, isMobile: isMobile }),
            canGoPrev && (react_1["default"].createElement(material_1.Box, { onClick: goToPrev, sx: __assign(__assign({}, NAV_BUTTON_STYLE), { left: '5%' }) },
                react_1["default"].createElement(ArrowBackIos_1["default"], { fontSize: "small", sx: __assign({}, ARROWICON) }))),
            canGoNext && (react_1["default"].createElement(material_1.Box, { onClick: goToNext, sx: __assign(__assign({}, NAV_BUTTON_STYLE), { right: '5%' }) },
                react_1["default"].createElement(icons_material_1.ArrowForwardIos, { fontSize: "small", sx: __assign({}, ARROWICON) })))),
        react_1["default"].createElement(material_1.Grid, { container: true, justifyContent: "center" },
            react_1["default"].createElement(material_1.Grid, { item: true, xs: 10, sm: 8, md: 6 },
                react_1["default"].createElement(material_1.Divider, { sx: { my: 3 } }),
                react_1["default"].createElement(material_1.Typography, { sx: titleStyle }, artwork.titleZh || artwork.titleEn),
                react_1["default"].createElement(material_1.Typography, { color: "#999595ff", fontWeight: 600, sx: { mb: 2, fontSize: 14 } }, artwork.displayDate))),
        artwork.shortDesc && (react_1["default"].createElement(material_1.Grid, { container: true, justifyContent: "center" },
            react_1["default"].createElement(material_1.Grid, { item: true, xs: 10, sm: 8, md: 6 },
                react_1["default"].createElement(material_1.Box, { sx: { mb: 3, mt: 3 } },
                    react_1["default"].createElement(material_1.Typography, null, artwork.shortDesc))))),
        react_1["default"].createElement(material_1.Grid, { container: true, justifyContent: "center", sx: { mt: 5, mb: 10 } },
            react_1["default"].createElement(material_1.Grid, { item: true, xs: 10, sm: 8, md: 8 },
                react_1["default"].createElement(material_1.Grid, { container: true },
                    !isMobile && (react_1["default"].createElement(material_1.Grid, { item: true, md: 2, sx: { pr: 3, borderRight: '1px solid #eee' } },
                        react_1["default"].createElement(material_1.List, { component: "nav", sx: { p: 0 } }, sections.map(function (section) { return (react_1["default"].createElement(material_1.ListItem, { key: section.id, disablePadding: true },
                            react_1["default"].createElement(material_1.ListItemButton, { selected: activeSection === section.id, onClick: function () { return setActiveSection(section.id); }, sx: {
                                    borderRadius: '4px',
                                    '&.Mui-selected': {
                                        backgroundColor: '#f0f0f0',
                                        borderRight: '3px solid #C93636',
                                        color: '#C93636',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            backgroundColor: '#e0e0e0'
                                        }
                                    },
                                    py: 1
                                } },
                                react_1["default"].createElement(material_1.Typography, { variant: "body1" }, section.label)))); })))),
                    react_1["default"].createElement(material_1.Grid, { item: true, xs: 12, md: 10, sx: { pl: isMobile ? 0 : 3 } },
                        react_1["default"].createElement(material_1.Box, { sx: { minHeight: '400px' } }, renderContent()))))),
        react_1["default"].createElement(material_1.Grid, { container: true, mt: "50px", justifyContent: "center", sx: { backgroundColor: '#fafafa', height: '100px', width: '100%', py: 3 } },
            react_1["default"].createElement(material_1.Typography, { alignContent: "center" }, "\u68B5\u00B7\u9AD8\u6863\u6848\u9986 2024"))));
};
exports["default"] = DetailsPage;
var NAV_BUTTON_STYLE = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 100,
    cursor: 'pointer',
    width: '60px',
    height: '60px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    ml: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 3,
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        boxShadow: 4
    },
    '@media (max-width:600px)': {
        width: '40px',
        height: '40px',
        ml: 1,
        boxShadow: 1,
        '&:hover': { boxShadow: 2 }
    }
};
var ARROWICON = {
    ml: 0.5,
    color: '#31d847ff'
};
