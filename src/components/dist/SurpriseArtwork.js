"use strict";
exports.__esModule = true;
var react_1 = require("react");
var material_1 = require("@mui/material");
var react_router_dom_1 = require("react-router-dom");
var icons_material_1 = require("@mui/icons-material");
// --------------------------------------------------------
// 辅助函数：解析图片 URL
// --------------------------------------------------------
var getImageUrl = function (primaryImageSmall) {
    if (!primaryImageSmall)
        return '';
    var parts = primaryImageSmall.split(';').map(function (p) { return p.trim(); });
    var valid = parts.find(function (p) { return p.startsWith('/works/'); });
    return "https://artworks-1257857866.cos.ap-beijing.myqcloud.com" + (valid || parts[0] || '');
};
// --------------------------------------------------------
// 3. Surprise Artwork 独立组件 (使用 forwardRef 处理 Ref)
// --------------------------------------------------------
var SurpriseArtworkBlock = react_1["default"].forwardRef(function (_a, ref) {
    var surpriseArtwork = _a.surpriseArtwork, isSurpriseLoading = _a.isSurpriseLoading, fetchSurpriseArtWork = _a.fetchSurpriseArtWork;
    // 使用 isSurpriseLoading 来控制加载状态
    var isLoading = isSurpriseLoading || !surpriseArtwork;
    return (react_1["default"].createElement(material_1.Box, { ref: ref, sx: {
            minHeight: { xs: 350, md: 650 },
            mb: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f8f8',
            borderRadius: 2,
            position: 'relative'
        } }, isLoading ? (react_1["default"].createElement(material_1.CircularProgress, { size: 80 })) : (react_1["default"].createElement(material_1.Grid, { container: true, spacing: 4, alignItems: "center", sx: { p: 4 } },
        react_1["default"].createElement(material_1.Grid, { item: true, xs: 12, md: 8, display: "flex", justifyContent: "center" },
            react_1["default"].createElement(material_1.Box, { sx: {
                    width: { xs: '100%', md: 600 },
                    height: { xs: 200, md: 500 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    overflow: 'hidden'
                } },
                react_1["default"].createElement("img", { 
                    // 使用可选链和类型断言确保 surpriseArtwork 存在
                    src: getImageUrl(surpriseArtwork.primaryImageSmall), alt: surpriseArtwork.titleZh || surpriseArtwork.titleEn, style: {
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                    } }))),
        react_1["default"].createElement(material_1.Grid, { item: true, xs: 12, md: 4 },
            react_1["default"].createElement(material_1.Box, { sx: { textAlign: { xs: 'center', md: 'left' } } },
                react_1["default"].createElement(material_1.Typography, { variant: "h4", sx: { fontWeight: 'bold', mb: 1, fontSize: { xs: '1.5rem', md: '2.5rem' } } }, surpriseArtwork.titleZh || surpriseArtwork.titleEn),
                react_1["default"].createElement(material_1.Typography, { variant: "h6", color: "text.secondary", sx: { mb: 2, fontStyle: 'italic', fontSize: { xs: '1rem', md: '1.25rem' } } }, surpriseArtwork.displayDate),
                react_1["default"].createElement(material_1.Typography, { variant: "subtitle1", sx: { mb: 4, color: 'gray', fontSize: { xs: '0.875rem', md: '1rem' } } },
                    surpriseArtwork.artistName || '文森特·梵·高',
                    react_1["default"].createElement("br", null),
                    surpriseArtwork.collection || '（收藏信息）'),
                react_1["default"].createElement(material_1.Box, { sx: {
                        display: 'flex',
                        justifyContent: { xs: 'center', md: 'flex-start' }
                    } },
                    react_1["default"].createElement(react_router_dom_1.Link, { to: "/vincent/id/" + surpriseArtwork.id, style: { textDecoration: 'none' } },
                        react_1["default"].createElement("button", { className: "btn btn-primary me-3", style: { fontSize: '1.1rem', padding: '10px 20px' } }, "\u67E5\u770B\u8BE6\u60C5")),
                    react_1["default"].createElement("button", { className: "btn btn-outline-secondary", onClick: fetchSurpriseArtWork, style: {
                            width: '44px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0
                        } },
                        react_1["default"].createElement(icons_material_1.Casino, { sx: { fontSize: '1.5rem' } })))))))));
});
exports["default"] = SurpriseArtworkBlock;
