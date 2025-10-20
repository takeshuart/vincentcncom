"use strict";
exports.__esModule = true;
exports.ColorSearchBar = void 0;
var react_1 = require("react");
var material_1 = require("@mui/material"); // 移除了 IconButton
// 梵高调色板（根据非素描作品RGB分析结果）
var VAN_GOGH_COLORS = [
    { name: '淡赭黄', color: '#D9C19D' },
    { name: '奶油米白', color: '#E8D7BC' },
    { name: '温柔灰褐', color: '#BDAF8F' },
    { name: '天蓝灰', color: '#AAB6B3' },
    { name: '橄榄绿', color: '#8E835A' },
    { name: '焦赭红', color: '#C59966' },
    { name: '深青灰', color: '#655E4A' },
    { name: '苍绿蓝', color: '#768980' },
    { name: '浅赭橙', color: '#D6B079' },
    { name: '暖灰白', color: '#DCCFB9' },
];
exports.ColorSearchBar = function (_a) {
    var onColorSelect = _a.onColorSelect, _b = _a.initialColor, initialColor = _b === void 0 ? '' : _b;
    var _c = react_1.useState(initialColor), selectedColor = _c[0], setSelectedColor = _c[1];
    // 优化选择逻辑：支持二次点击取消和“全部”按钮
    var handleSelect = react_1.useCallback(function (color) {
        // 如果点击的颜色就是当前选中的颜色，则取消选择（设置为 ''）
        var newColor = selectedColor === color ? '' : color;
        setSelectedColor(newColor);
        onColorSelect(newColor); // 通知父组件执行新查询
    }, [selectedColor, onColorSelect]);
    return (react_1["default"].createElement(material_1.Box, { sx: { width: '100%', my: 2 } },
        react_1["default"].createElement(material_1.Box, { sx: {
                display: 'flex',
                alignItems: 'stretch',
                height: 30,
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid #ccc'
            } },
            react_1["default"].createElement(material_1.Box, { onClick: function () { return handleSelect(''); }, title: "\u53D6\u6D88\u989C\u8272\u7B5B\u9009\uFF0C\u663E\u793A\u6240\u6709\u4F5C\u54C1", sx: {
                    minWidth: '60px',
                    flexShrink: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 1,
                    // 统一使用更平滑的 transition
                    transition: 'all 0.25s ease-in-out',
                    // 选中时的样式：当 selectedColor 为空时
                    backgroundColor: selectedColor === '' ? '#777' : '#f5f5f5',
                    color: selectedColor === '' ? 'white' : '#555',
                    boxShadow: selectedColor === '' ? 'inset 0 0 5px rgba(0,0,0,0.3)' : 'none',
                    zIndex: 1,
                    fontWeight: selectedColor === '' ? 'bold' : 'normal',
                    // 右侧分隔线
                    borderRight: '1px solid #ccc',
                    // 悬停和选中状态下的放大效果
                    transform: selectedColor === '' ? 'scale(1.05)' : 'scale(1)',
                    '&:hover': {
                        backgroundColor: selectedColor === '' ? '#777' : '#e0e0e0',
                        transform: 'scale(1.05)',
                        zIndex: 2
                    }
                } },
                react_1["default"].createElement(material_1.Typography, { variant: "caption", sx: { lineHeight: 1, fontSize: '0.8rem' } }, "\u6E05\u9664")),
            VAN_GOGH_COLORS.map(function (block) {
                var isSelected = selectedColor === block.color;
                return (react_1["default"].createElement(material_1.Box, { key: block.color, onClick: function () { return handleSelect(block.color); }, title: "" + block.name + (isSelected ? ' (已选中)' : ''), sx: {
                        flex: 1,
                        backgroundColor: block.color,
                        cursor: 'pointer',
                        // 统一使用更平滑的 transition
                        transition: 'all 0.25s ease-in-out',
                        // ⭐️ 选中时应用放大效果
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        // 保持白色描边和阴影（如果放大效果不足够，可以稍微增强阴影）
                        border: isSelected
                            ? '2px solid white'
                            : '2px solid transparent',
                        boxShadow: isSelected
                            ? '0 0 8px rgba(0,0,0,0.7)' // 略微增强阴影让放大效果更明显
                            : 'none',
                        // 确保选中元素在最上层
                        zIndex: isSelected ? 3 : 1,
                        '&:hover': {
                            // 悬停时也应用放大效果
                            transform: 'scale(1.1)',
                            zIndex: 2
                        }
                    } }));
            }))));
};
exports["default"] = exports.ColorSearchBar;
