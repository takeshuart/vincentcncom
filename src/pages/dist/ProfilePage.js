"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var material_1 = require("@mui/material");
var Edit_1 = require("@mui/icons-material/Edit");
var Save_1 = require("@mui/icons-material/Save");
var Close_1 = require("@mui/icons-material/Close");
var Lock_1 = require("@mui/icons-material/Lock");
var useAuth_1 = require("@/hooks/useAuth");
var requests_1 = require("@/api/requests");
var react_hot_toast_1 = require("react-hot-toast");
var PasswordField_1 = require("@/components/PasswordField");
function ProfilePage() {
    var _this = this;
    var _a, _b;
    var user = useAuth_1.useAuth().user;
    var userData = user !== null && user !== void 0 ? user : null;
    var _c = react_1.useState((_a = userData === null || userData === void 0 ? void 0 : userData.nickName) !== null && _a !== void 0 ? _a : ""), nickName = _c[0], setNickName = _c[1];
    var _d = react_1.useState((_b = userData === null || userData === void 0 ? void 0 : userData.email) !== null && _b !== void 0 ? _b : ""), email = _d[0], setEmail = _d[1];
    var _e = react_1.useState(""), password = _e[0], setPassword = _e[1];
    var _f = react_1.useState(""), confirm = _f[0], setConfirm = _f[1];
    var _g = react_1.useState(null), editing = _g[0], setEditing = _g[1];
    var _h = react_1.useState(false), loading = _h[0], setLoading = _h[1];
    var _j = react_1.useState(""), passwordError = _j[0], setPasswordError = _j[1];
    var _k = react_1.useState(""), apiError = _k[0], setApiError = _k[1];
    var ART_BLUE = "#215A8F";
    var HOVER_BLUE = "#17436B";
    var ACTIVE_BLUE = "#0E2C48";
    var LIGHT_BACKGROUND = "#d8dbf0ff";
    // Removed validatePassword as it's now imported from PasswordField component
    react_1.useEffect(function () {
        var _a, _b;
        setNickName((_a = userData === null || userData === void 0 ? void 0 : userData.nickName) !== null && _a !== void 0 ? _a : "");
        setEmail((_b = userData === null || userData === void 0 ? void 0 : userData.email) !== null && _b !== void 0 ? _b : "");
    }, [userData === null || userData === void 0 ? void 0 : userData.nickName, userData === null || userData === void 0 ? void 0 : userData.email]);
    var startEdit = function (key) {
        setEditing(key);
        setPassword("");
        setConfirm("");
        setPasswordError("");
        setApiError("");
    };
    var cancelEdit = function () {
        var _a, _b;
        setEditing(null);
        setPassword("");
        setConfirm("");
        setPasswordError("");
        setApiError("");
        // reset to original values
        setNickName((_a = userData === null || userData === void 0 ? void 0 : userData.nickName) !== null && _a !== void 0 ? _a : "");
        setEmail((_b = userData === null || userData === void 0 ? void 0 : userData.email) !== null && _b !== void 0 ? _b : "");
    };
    var saveField = function (key) { return __awaiter(_this, void 0, void 0, function () {
        var pwdValidation, payload, err_1, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!key)
                        return [2 /*return*/];
                    setApiError("");
                    if (key === "password") {
                        if (!password) {
                            react_hot_toast_1.toast.error("请输入新密码");
                            return [2 /*return*/];
                        }
                        pwdValidation = PasswordField_1.validatePassword(password);
                        if (!pwdValidation.valid) {
                            setPasswordError(pwdValidation.error || "密码格式不正确");
                            return [2 /*return*/];
                        }
                        if (password !== confirm) {
                            react_hot_toast_1.toast.error("两次输入的密码不一致");
                            return [2 /*return*/];
                        }
                    }
                    payload = {};
                    if (key === "nickName")
                        payload.nickName = nickName || undefined;
                    if (key === "email")
                        payload.email = email || undefined;
                    if (key === "password")
                        payload.password = password;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setLoading(true);
                    return [4 /*yield*/, requests_1["default"].patch("/users/me", payload)];
                case 2:
                    _a.sent();
                    react_hot_toast_1.toast.success("保存成功");
                    setEditing(null);
                    // refresh to update auth context
                    setTimeout(function () { return window.location.reload(); }, 700);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    msg = (err_1 === null || err_1 === void 0 ? void 0 : err_1.displayMessage) || (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || "保存失败";
                    setApiError(msg);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement(material_1.Box, { sx: {
            backgroundColor: LIGHT_BACKGROUND,
            display: "flex",
            justifyContent: "center",
            minHeight: "100vh",
            pt: { xs: 6, md: 12 },
            px: 2
        } },
        react_1["default"].createElement(material_1.Paper, { sx: { width: "100%", maxWidth: 760, p: { xs: 3, md: 5 }, borderRadius: 4, backgroundColor: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" } },
            react_1["default"].createElement(material_1.Typography, { variant: "h5", sx: { fontWeight: 700, mb: 1, color: ART_BLUE } }, "\u4E2A\u4EBA\u8D44\u6599"),
            react_1["default"].createElement(material_1.Typography, { sx: { color: "text.secondary", mb: 3 } }, "\u7BA1\u7406\u4F60\u7684\u8D26\u6237\u4FE1\u606F\u3002\u70B9\u51FB\u53F3\u4FA7\u7684\u7F16\u8F91\u56FE\u6807\u53EF\u4EE5\u4FEE\u6539\u5BF9\u5E94\u5B57\u6BB5\u3002"),
            apiError && (react_1["default"].createElement(material_1.Alert, { severity: "error", sx: { width: "100%", mb: 2 } }, apiError)),
            react_1["default"].createElement(material_1.Box, { sx: { display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.25 } },
                react_1["default"].createElement(material_1.Box, null,
                    react_1["default"].createElement(material_1.Typography, { sx: { fontSize: 13, color: "text.secondary" } }, "\u6635\u79F0"),
                    editing === "nickName" ? (react_1["default"].createElement(material_1.TextField, { size: "small", value: nickName, onChange: function (e) { return setNickName(e.target.value); }, sx: { mt: 1, width: 360 } })) : (react_1["default"].createElement(material_1.Typography, { sx: { fontSize: 16, fontWeight: 600, mt: 0.5 } }, nickName || "未设置"))),
                react_1["default"].createElement(material_1.Box, null, editing === "nickName" ? (react_1["default"].createElement(material_1.Stack, { direction: "row", spacing: 1 },
                    react_1["default"].createElement(material_1.Tooltip, { title: "\u4FDD\u5B58" },
                        react_1["default"].createElement(material_1.IconButton, { sx: { bgcolor: ART_BLUE, color: "white", '&:hover': { bgcolor: HOVER_BLUE } }, onClick: function () { return saveField("nickName"); }, disabled: loading },
                            react_1["default"].createElement(Save_1["default"], null))),
                    react_1["default"].createElement(material_1.Tooltip, { title: "\u53D6\u6D88" },
                        react_1["default"].createElement(material_1.IconButton, { onClick: cancelEdit },
                            react_1["default"].createElement(Close_1["default"], null))))) : (react_1["default"].createElement(material_1.Tooltip, { title: "\u7F16\u8F91\u6635\u79F0" },
                    react_1["default"].createElement(material_1.IconButton, { onClick: function () { return startEdit("nickName"); } },
                        react_1["default"].createElement(Edit_1["default"], null)))))),
            react_1["default"].createElement(material_1.Divider, null),
            react_1["default"].createElement(material_1.Box, { sx: { display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.25 } },
                react_1["default"].createElement(material_1.Box, null,
                    react_1["default"].createElement(material_1.Typography, { sx: { fontSize: 13, color: "text.secondary" } }, "\u90AE\u7BB1"),
                    editing === "email" ? (react_1["default"].createElement(material_1.TextField, { size: "small", value: email, onChange: function (e) { return setEmail(e.target.value); }, sx: { mt: 1, width: 360 } })) : (react_1["default"].createElement(material_1.Typography, { sx: { fontSize: 16, fontWeight: 600, mt: 0.5 } }, email || "未设置"))),
                react_1["default"].createElement(material_1.Box, null, editing === "email" ? (react_1["default"].createElement(material_1.Stack, { direction: "row", spacing: 1 },
                    react_1["default"].createElement(material_1.Tooltip, { title: "\u4FDD\u5B58" },
                        react_1["default"].createElement(material_1.IconButton, { sx: { bgcolor: ART_BLUE, color: "white", '&:hover': { bgcolor: HOVER_BLUE } }, onClick: function () { return saveField("email"); }, disabled: loading },
                            react_1["default"].createElement(Save_1["default"], null))),
                    react_1["default"].createElement(material_1.Tooltip, { title: "\u53D6\u6D88" },
                        react_1["default"].createElement(material_1.IconButton, { onClick: cancelEdit },
                            react_1["default"].createElement(Close_1["default"], null))))) : (react_1["default"].createElement(material_1.Tooltip, { title: "\u7F16\u8F91\u90AE\u7BB1" },
                    react_1["default"].createElement(material_1.IconButton, { onClick: function () { return startEdit("email"); } },
                        react_1["default"].createElement(Edit_1["default"], null)))))),
            react_1["default"].createElement(material_1.Divider, null),
            react_1["default"].createElement(material_1.Box, { sx: { display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.25 } },
                react_1["default"].createElement(material_1.Box, null,
                    react_1["default"].createElement(material_1.Typography, { sx: { fontSize: 13, color: "text.secondary" } }, "\u5BC6\u7801"),
                    editing === "password" ? (react_1["default"].createElement(material_1.Box, { sx: { display: "flex", gap: 1, mt: 1 } },
                        react_1["default"].createElement(material_1.Box, { sx: { flex: 1 } },
                            react_1["default"].createElement(PasswordField_1["default"], { label: "\u65B0\u5BC6\u7801", value: password, onChange: function (value) {
                                    setPassword(value);
                                    if (value) {
                                        var validation = PasswordField_1.validatePassword(value);
                                        setPasswordError(validation.error || "");
                                    }
                                    else {
                                        setPasswordError("");
                                    }
                                }, error: passwordError, disabled: loading, showRequirements: true, showVisibilityToggle: true, size: "small" })),
                        react_1["default"].createElement(material_1.TextField, { size: "small", label: "\u786E\u8BA4\u5BC6\u7801", type: "password", value: confirm, onChange: function (e) { return setConfirm(e.target.value); } }))) : (react_1["default"].createElement(material_1.Box, { sx: { display: "flex", alignItems: "center", gap: 1, mt: 0.5 } },
                        react_1["default"].createElement(Lock_1["default"], { fontSize: "small", color: "disabled" }),
                        react_1["default"].createElement(material_1.Typography, { sx: { fontSize: 16, fontWeight: 600 } }, "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022")))),
                react_1["default"].createElement(material_1.Box, null, editing === "password" ? (react_1["default"].createElement(material_1.Stack, { direction: "row", spacing: 1 },
                    react_1["default"].createElement(material_1.Tooltip, { title: "\u4FDD\u5B58" },
                        react_1["default"].createElement(material_1.IconButton, { sx: { bgcolor: ART_BLUE, color: "white", '&:hover': { bgcolor: HOVER_BLUE } }, onClick: function () { return saveField("password"); }, disabled: loading },
                            react_1["default"].createElement(Save_1["default"], null))),
                    react_1["default"].createElement(material_1.Tooltip, { title: "\u53D6\u6D88" },
                        react_1["default"].createElement(material_1.IconButton, { onClick: cancelEdit },
                            react_1["default"].createElement(Close_1["default"], null))))) : (react_1["default"].createElement(material_1.Tooltip, { title: "\u4FEE\u6539\u5BC6\u7801" },
                    react_1["default"].createElement(material_1.IconButton, { onClick: function () { return startEdit("password"); } },
                        react_1["default"].createElement(Edit_1["default"], null)))))),
            react_1["default"].createElement(material_1.Divider, { sx: { my: 2 } }),
            react_1["default"].createElement(material_1.Box, { sx: { display: "flex", justifyContent: "flex-end", gap: 1 } },
                react_1["default"].createElement(material_1.Button, { variant: "outlined", onClick: function () { return window.history.back(); }, sx: { textTransform: "none" } }, "\u8FD4\u56DE")))));
}
exports["default"] = ProfilePage;
