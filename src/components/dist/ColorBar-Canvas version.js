"use strict";
exports.__esModule = true;
exports.ColorSearchBar = void 0;
var react_1 = require("react");
var material_1 = require("@mui/material");
function rgbToHex(r, g, b) {
    var toHex = function (n) { return n.toString(16).padStart(2, '0'); };
    return ("#" + toHex(r) + toHex(g) + toHex(b)).toUpperCase();
}
exports.ColorSearchBar = function (_a) {
    var onColorSelect = _a.onColorSelect, _b = _a.initialColor, initialColor = _b === void 0 ? '#800080' : _b;
    var _c = react_1.useState(initialColor), selectedColor = _c[0], setSelectedColor = _c[1];
    var _d = react_1.useState(50), indicatorPosition = _d[0], setIndicatorPosition = _d[1];
    // ref for the visible gradient div (for size) and offscreen canvas
    var barRef = react_1.useRef(null);
    var canvasRef = react_1.useRef(null);
    var isDraggingRef = react_1.useRef(false);
    // gradient stops - keep in sync with CSS gradient below
    var colorStops = [
        { pos: 0, color: 'hsl(220, 80%, 50%)' },
        { pos: 20, color: 'hsl(160, 80%, 50%)' },
        { pos: 40, color: 'hsl(50, 80%, 50%)' },
        { pos: 60, color: 'hsl(15, 80%, 50%)' },
        { pos: 80, color: 'hsl(320, 60%, 50%)' },
        { pos: 100, color: 'hsl(280, 60%, 50%)' },
    ];
    // CSS for visible gradient bar (must match the gradient we draw on canvas)
    var gradientCss = {
        height: '30px',
        borderRadius: '4px',
        cursor: 'crosshair',
        backgroundImage: 'linear-gradient(to right, hsl(220,80%,50%), hsl(160,80%,50%), hsl(50,80%,50%), hsl(15,80%,50%), hsl(320,60%,50%), hsl(280,60%,50%))',
        border: '1px solid #ddd',
        position: 'relative',
        overflow: 'hidden'
    };
    // create / resize offscreen canvas and draw gradient that mirrors CSS exactly
    var prepareCanvas = react_1.useCallback(function () {
        var bar = barRef.current;
        if (!bar)
            return;
        var rect = bar.getBoundingClientRect();
        var w = Math.max(1, Math.floor(rect.width));
        var h = 1; // only need 1px high to sample colors horizontally
        // create canvas if not exist or size changed
        var canvas = canvasRef.current;
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvasRef.current = canvas;
        }
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }
        var ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        var grad = ctx.createLinearGradient(0, 0, w, 0);
        // add stops using colorStops (positions are percent)
        colorStops.forEach(function (stop) {
            grad.addColorStop(stop.pos / 100, stop.color);
        });
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }, [colorStops]);
    react_1.useEffect(function () {
        // prepare once on mount
        prepareCanvas();
        // re-prepare on window resize so canvas matches visible bar width
        var onResize = function () {
            prepareCanvas();
        };
        window.addEventListener('resize', onResize);
        return function () { return window.removeEventListener('resize', onResize); };
    }, [prepareCanvas]);
    // helper: given event (mouse or touch) compute percentage 0-100 and sample color
    var sampleColorAtEvent = react_1.useCallback(function (clientX) {
        var bar = barRef.current;
        var canvas = canvasRef.current;
        if (!bar || !canvas)
            return null;
        var rect = bar.getBoundingClientRect();
        var x = Math.min(Math.max(clientX - rect.left, 0), rect.width - 1);
        var idx = Math.floor((x / rect.width) * canvas.width);
        var ctx = canvas.getContext('2d');
        if (!ctx)
            return null;
        var pixel = ctx.getImageData(idx, 0, 1, 1).data; // [r,g,b,a]
        var hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
        var percentage = (idx / Math.max(1, canvas.width - 1)) * 100;
        return { hex: hex, percentage: percentage };
    }, []);
    // click handler
    var handlePointerDown = react_1.useCallback(function (e) {
        e.preventDefault();
        isDraggingRef.current = true;
        var clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        var sampled = sampleColorAtEvent(clientX);
        if (sampled) {
            setSelectedColor(sampled.hex);
            setIndicatorPosition(sampled.percentage);
            onColorSelect(sampled.hex);
        }
    }, [onColorSelect, sampleColorAtEvent]);
    var handlePointerMove = react_1.useCallback(function (e) {
        if (!isDraggingRef.current)
            return;
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var sampled = sampleColorAtEvent(clientX);
        if (sampled) {
            setSelectedColor(sampled.hex);
            setIndicatorPosition(sampled.percentage);
            onColorSelect(sampled.hex);
        }
    }, [onColorSelect, sampleColorAtEvent]);
    var handlePointerUp = react_1.useCallback(function () {
        isDraggingRef.current = false;
    }, []);
    react_1.useEffect(function () {
        // add global listeners for dragging
        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('touchmove', handlePointerMove, { passive: false });
        window.addEventListener('mouseup', handlePointerUp);
        window.addEventListener('touchend', handlePointerUp);
        return function () {
            window.removeEventListener('mousemove', handlePointerMove);
            window.removeEventListener('touchmove', handlePointerMove);
            window.removeEventListener('mouseup', handlePointerUp);
            window.removeEventListener('touchend', handlePointerUp);
        };
    }, [handlePointerMove, handlePointerUp]);
    // initial sync: draw canvas, and if initialColor given, try find nearest pos (optional)
    react_1.useEffect(function () {
        prepareCanvas();
        // Optionally, if you want initialColor to reflect position, you could search canvas for the closest match.
        // For simplicity we keep initial indicator at current indicatorPosition (default 50).
    }, [prepareCanvas]);
    return (react_1["default"].createElement(material_1.Box, { sx: { width: '100%', my: 2 } },
        react_1["default"].createElement(material_1.Box, { ref: barRef, sx: gradientCss, onMouseDown: handlePointerDown, onTouchStart: handlePointerDown },
            react_1["default"].createElement(material_1.Box, { sx: {
                    position: 'absolute',
                    top: '50%',
                    left: indicatorPosition + "%",
                    transform: 'translate(-50%, -50%)',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: '2px solid white',
                    backgroundColor: selectedColor,
                    transition: 'left 0.08s linear, background-color 0.08s linear',
                    boxShadow: '0 0 6px rgba(0,0,0,0.5)',
                    pointerEvents: 'none'
                } }))));
};
exports["default"] = exports.ColorSearchBar;
