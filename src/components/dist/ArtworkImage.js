"use strict";
exports.__esModule = true;
var react_1 = require("react");
var material_1 = require("@mui/material");
var react_photo_view_1 = require("react-photo-view");
require("react-photo-view/dist/react-photo-view.css");
/**
 * Show skeleton while the image is loading, to prevent layout shift.
 */
function ArtworkImage(_a) {
    var src = _a.src, isMobile = _a.isMobile;
    var _b = react_1.useState(false), loaded = _b[0], setLoaded = _b[1];
    var fullSrc = "https://artworks-1257857866.cos.ap-beijing.myqcloud.com" + src;
    return (React.createElement(material_1.Box, { sx: {
            marginTop: '50px',
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'center'
        } },
        React.createElement(material_1.Box, { sx: {
                position: 'relative',
                width: '100%',
                maxWidth: '800px',
                aspectRatio: isMobile ? '1 / 1' : '4 / 3',
                height: isMobile ? 300 : 650,
                overflow: 'hidden',
                borderRadius: '12px'
            } },
            !loaded && (React.createElement(material_1.Box, { sx: {
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                } },
                React.createElement(material_1.CircularProgress, { size: 48, thickness: 4 }))),
            React.createElement(react_photo_view_1.PhotoProvider, { maskOpacity: 0.1, bannerVisible: false },
                React.createElement(react_photo_view_1.PhotoView, { src: fullSrc },
                    React.createElement("img", { src: fullSrc, alt: "", onLoad: function () { return setLoaded(true); }, onError: function () { return console.error('图片加载失败：', fullSrc); }, style: {
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            opacity: loaded ? 1 : 0,
                            transition: 'opacity 0.5s ease',
                            display: 'block'
                        } }))))));
}
exports["default"] = ArtworkImage;
