"use strict";
exports.__esModule = true;
var react_1 = require("react");
var material_1 = require("@mui/material");
var ui_1 = require("@fancyapps/ui");
require("@fancyapps/ui/dist/fancybox/fancybox.css");
function ArtworkImage(_a) {
    var src = _a.src, isMobile = _a.isMobile;
    var _b = react_1.useState(false), loaded = _b[0], setLoaded = _b[1];
    var imageRef = react_1.useRef(null);
    var fullSrc = "https://artworks-1257857866.cos.ap-beijing.myqcloud.com" + src;
    react_1.useEffect(function () {
        // 每次 fullSrc 变化时，重置状态
        setLoaded(false);
        var active = true;
        var img = new Image();
        img.src = fullSrc; // 触发加载
        // 1. 检查图片是否已加载完成 (complete)
        if (img.complete && img.naturalWidth > 0) {
            // 图片已在缓存中，且已同步完成加载
            setLoaded(true);
        }
        else {
            // 2. 否则，设置异步监听器
            img.onload = function () {
                if (active) {
                    setLoaded(true);
                }
            };
            img.onerror = function () {
                console.error('图片加载失败：', fullSrc);
                if (active) {
                    setLoaded(true); // 即使失败也要更新状态，显示占位图或错误
                }
            };
        }
        return function () {
            active = false;
            img.onload = null;
            img.onerror = null;
        };
    }, [fullSrc]);
    var openFancybox = function () {
        if (loaded && imageRef.current) {
            ui_1.Fancybox.show([
                {
                    src: fullSrc,
                    type: 'image'
                },
            ]);
        }
    };
    return (react_1["default"].createElement(material_1.Box, { sx: {
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'center'
        } },
        react_1["default"].createElement(material_1.Box, { sx: {
                position: 'relative',
                width: '100%',
                // maxWidth: '800px',
                // aspectRatio: isMobile ? '1 / 1' : '4 / 3',
                // height: isMobile ? 300 : 650,
                height: isMobile ? '80vh' : 650,
                overflow: 'hidden',
                borderRadius: '10px',
                cursor: loaded ? 'zoom-in' : 'default'
            }, onClick: openFancybox },
            !loaded && (react_1["default"].createElement(material_1.Box, { sx: {
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                } },
                react_1["default"].createElement(material_1.CircularProgress, { size: 48, thickness: 4 }))),
            react_1["default"].createElement("img", { ref: imageRef, src: fullSrc, alt: "Artwork", style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                    display: 'block'
                } }))));
}
exports["default"] = ArtworkImage;
