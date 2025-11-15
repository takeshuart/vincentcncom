"use strict";
exports.__esModule = true;
exports.validatePassword = void 0;
var react_1 = require("react");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
exports.validatePassword = function (pwd) {
    if (!pwd)
        return { valid: false, error: "密码不能为空" };
    if (pwd.length < 8 || pwd.length > 16)
        return { valid: false, error: "密码长度必须为 8-16 个字符" };
    if (/\s/.test(pwd))
        return { valid: false, error: "密码不能包含空格" };
    if (/^(.)\1+$/.test(pwd))
        return { valid: false, error: "密码不能都是相同字符" };
    var chars = pwd.split("");
    var allAlpha = /^[A-Za-z]+$/.test(pwd);
    var allDigit = /^[0-9]+$/.test(pwd);
    if (allAlpha || allDigit) {
        for (var i = 0; i < chars.length - 2; i++) {
            var c1 = chars[i].charCodeAt(0);
            var c2 = chars[i + 1].charCodeAt(0);
            var c3 = chars[i + 2].charCodeAt(0);
            if ((c2 === c1 + 1 && c3 === c2 + 1) || (c2 === c1 - 1 && c3 === c2 - 1)) {
                return { valid: false, error: "密码不能有连续递增或递减的字符或数字 (如 abc 或 123)" };
            }
        }
    }
    return { valid: true };
};
var PasswordField = function (_a) {
    var _b = _a.label, label = _b === void 0 ? "密码" : _b, value = _a.value, onChange = _a.onChange, _c = _a.error, error = _c === void 0 ? "" : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d, _e = _a.showRequirements, showRequirements = _e === void 0 ? false : _e, _f = _a.showVisibilityToggle, showVisibilityToggle = _f === void 0 ? true : _f, _g = _a.fullWidth, fullWidth = _g === void 0 ? true : _g, _h = _a.margin, margin = _h === void 0 ? "normal" : _h, _j = _a.size, size = _j === void 0 ? "medium" : _j;
    var _k = react_1.useState(false), showPassword = _k[0], setShowPassword = _k[1];
    var handleClickShowPassword = function () {
        setShowPassword(function (show) { return !show; });
    };
    var handleMouseDownPassword = function (event) {
        event.preventDefault();
    };
    return (react_1["default"].createElement(material_1.Box, null,
        react_1["default"].createElement(material_1.TextField, { value: value, onChange: function (e) { return onChange(e.target.value); }, margin: margin, fullWidth: fullWidth, label: label, type: showPassword ? "text" : "password", error: !!error, helperText: error, disabled: disabled, size: size, InputProps: {
                endAdornment: showVisibilityToggle ? (react_1["default"].createElement(material_1.InputAdornment, { position: "end" },
                    react_1["default"].createElement(material_1.IconButton, { "aria-label": "toggle password visibility", onClick: handleClickShowPassword, onMouseDown: handleMouseDownPassword, edge: "end", disabled: disabled }, showPassword ? react_1["default"].createElement(icons_material_1.VisibilityOff, null) : react_1["default"].createElement(icons_material_1.Visibility, null)))) : undefined
            } }),
        showRequirements && !value && (react_1["default"].createElement(material_1.Box, { sx: { mt: 1 } },
            react_1["default"].createElement(material_1.Typography, { sx: { fontSize: 11, color: "text.secondary", mb: 0.25 } }, "\u5BC6\u7801\u8981\u6C42\uFF1A"),
            react_1["default"].createElement(material_1.Typography, { sx: { fontSize: 11, color: "text.secondary" } },
                "\u2022 8-16 \u4E2A\u5B57\u7B26\uFF0C\u4E0D\u80FD\u6709\u7A7A\u683C",
                react_1["default"].createElement("br", null),
                "\u2022 \u4E0D\u80FD\u90FD\u662F\u76F8\u540C\u5B57\u7B26",
                react_1["default"].createElement("br", null),
                "\u2022 \u4E0D\u80FD\u6709\u8FDE\u7EED\u9012\u589E/\u9012\u51CF\u7684\u5B57\u7B26\u6216\u6570\u5B57"))),
        showRequirements && value && error && (react_1["default"].createElement(material_1.Typography, { sx: { fontSize: 12, color: "error.main", mt: 0.5 } }, error)),
        showRequirements && value && !error && (react_1["default"].createElement(material_1.Typography, { sx: { fontSize: 12, color: "success.main", mt: 0.5 } }, "\u2713 \u5BC6\u7801\u683C\u5F0F\u6B63\u786E"))));
};
exports["default"] = PasswordField;
