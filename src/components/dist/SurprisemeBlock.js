"use strict";
exports.__esModule = true;
var react_1 = require("react");
var material_1 = require("@mui/material");
var react_router_dom_1 = require("react-router-dom");
var icons_material_1 = require("@mui/icons-material");
var getImageUrl = function (primaryImageSmall) {
    if (!primaryImageSmall)
        return '';
    var parts = primaryImageSmall.split(';').map(function (p) { return p.trim(); });
    var valid = parts.find(function (p) { return p.startsWith('/works/'); });
    return "https://artworks-1257857866.cos.ap-beijing.myqcloud.com" + (valid || parts[0] || '');
};
var SurprisemeBlock = react_1["default"].forwardRef(function (_a, ref) {
    var surpriseArtwork = _a.surpriseArtwork, isSurpriseLoading = _a.isSurpriseLoading, fetchSurpriseArtWork = _a.fetchSurpriseArtWork;
    var isLoading = isSurpriseLoading || !surpriseArtwork;
    return (react_1["default"].createElement(material_1.Box, { ref: ref, sx: {
            minHeight: { xs: 350, md: 700 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f8f8',
            borderRadius: 2,
            position: 'relative'
        } },
        react_1["default"].createElement(material_1.Button, { onClick: fetchSurpriseArtWork, sx: {
                position: 'absolute',
                top: { xs: 16, md: 24 },
                right: { xs: 16, md: 24 },
                minWidth: 'auto',
                padding: 1,
                borderRadius: '50%',
                zIndex: 10
            } },
            react_1["default"].createElement(icons_material_1.Casino, { sx: { fontSize: { xs: 36, md: 50 } } })),
        isLoading ? (react_1["default"].createElement(material_1.CircularProgress, { size: 80 })) : (react_1["default"].createElement(material_1.Grid, { container: true, alignItems: "center", sx: { p: 0 } },
            react_1["default"].createElement(material_1.Grid, { item: true, xs: 12, md: 8, display: "flex", justifyContent: "center" },
                react_1["default"].createElement(material_1.Box, { sx: {
                        width: { xs: '100%', md: 700 },
                        height: { xs: 300, md: 650 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                        overflow: 'hidden'
                    } },
                    react_1["default"].createElement("img", { src: getImageUrl(surpriseArtwork.primaryImageMedium), alt: surpriseArtwork.titleZh || surpriseArtwork.titleEn, style: {
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain'
                        } }))),
            react_1["default"].createElement(material_1.Grid, { item: true, xs: 12, sm: 6, md: 4 },
                react_1["default"].createElement(material_1.Box, { sx: { textAlign: { xs: 'center', md: 'left' } } },
                    react_1["default"].createElement(material_1.Typography
                    // variant="h4" 
                    , { 
                        // variant="h4" 
                        sx: { fontWeight: 'bold', mb: 1, fontSize: { xs: '1.5rem', md: '2.5rem' } } }, surpriseArtwork.titleZh || surpriseArtwork.titleEn),
                    react_1["default"].createElement(material_1.Typography, { sx: { fontSize: { xs: '0.875rem', md: '1.25rem' } } }, surpriseArtwork.titleEn),
                    react_1["default"].createElement(material_1.Typography, { variant: "subtitle1", color: "text.secondary", sx: { mb: 2, fontStyle: 'italic', display: { xs: 'none', md: 'block' } } }, surpriseArtwork.displayDate),
                    react_1["default"].createElement(material_1.Typography, { variant: "subtitle1", sx: {
                            mb: 4, color: 'gray',
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            display: { xs: 'none', md: 'block' }
                        } }, surpriseArtwork.collection || '收藏地：未知'),
                    react_1["default"].createElement(material_1.Box, { sx: {
                            display: 'flex',
                            justifyContent: { xs: 'center', md: 'flex-start' }
                        } },
                        react_1["default"].createElement(react_router_dom_1.Link, { to: "/vincent/id/" + surpriseArtwork.id, target: "_self", style: { textDecoration: 'none' } },
                            react_1["default"].createElement(material_1.Button, { variant: "contained", size: 'large' }, "\u67E5\u770B\u8BE6\u60C5")))))))));
});
exports["default"] = SurprisemeBlock;
