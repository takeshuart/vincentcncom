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
var useAuth_1 = require("@/hooks/useAuth");
var react_hook_form_1 = require("react-hook-form");
var react_router_dom_1 = require("react-router-dom");
var react_hot_toast_1 = require("react-hot-toast");
var PasswordField_1 = require("@/components/PasswordField");
var AuthApi_1 = require("@/api/AuthApi");
var errors_1 = require("@/utils/errors");
var ART_BLUE = "#215A8F";
var HOVER_BLUE = "#17436B";
var LIGHT_BACKGROUND = "#f5f7fa";
function ProfilePage() {
    var _this = this;
    var _a, _b, _c, _d, _e;
    var auth = useAuth_1.useAuth();
    var navigate = react_router_dom_1.useNavigate();
    var userData = (_a = auth.user) !== null && _a !== void 0 ? _a : null;
    var _f = react_1.useState(null), editing = _f[0], setEditing = _f[1];
    var _g = react_1.useState(false), loading = _g[0], setLoading = _g[1];
    var _h = react_1.useState(""), apiError = _h[0], setApiError = _h[1];
    var _j = react_hook_form_1.useForm({
        mode: "onChange",
        defaultValues: {
            nickName: (_b = userData === null || userData === void 0 ? void 0 : userData.nickName) !== null && _b !== void 0 ? _b : "",
            email: (_c = userData === null || userData === void 0 ? void 0 : userData.email) !== null && _c !== void 0 ? _c : "",
            password: "",
            confirmPassword: "",
            currentPassword: ""
        }
    }), control = _j.control, reset = _j.reset, getValues = _j.getValues;
    react_1.useEffect(function () {
        var _a, _b;
        reset({
            nickName: (_a = userData === null || userData === void 0 ? void 0 : userData.nickName) !== null && _a !== void 0 ? _a : "",
            email: (_b = userData === null || userData === void 0 ? void 0 : userData.email) !== null && _b !== void 0 ? _b : "",
            password: "",
            confirmPassword: "",
            currentPassword: ""
        });
    }, [userData, reset]);
    var startEdit = function (key) {
        setEditing(key);
        setApiError("");
    };
    var cancelEdit = function () {
        var _a, _b;
        setEditing(null);
        setApiError("");
        reset({
            nickName: (_a = userData === null || userData === void 0 ? void 0 : userData.nickName) !== null && _a !== void 0 ? _a : "",
            email: (_b = userData === null || userData === void 0 ? void 0 : userData.email) !== null && _b !== void 0 ? _b : "",
            password: "",
            confirmPassword: "",
            currentPassword: ""
        });
    };
    var saveField = function (key) { return __awaiter(_this, void 0, void 0, function () {
        var formValues, payload, pwdValidation, updatedUser, err_1, code, msg;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!key)
                        return [2 /*return*/];
                    setApiError("");
                    formValues = getValues();
                    payload = {};
                    // 不提交重复值
                    if (key === "nickName" && formValues.nickName === (userData === null || userData === void 0 ? void 0 : userData.nickName)) {
                        setEditing(null);
                        return [2 /*return*/];
                    }
                    if (key === "email" && formValues.email === (userData === null || userData === void 0 ? void 0 : userData.email)) {
                        setEditing(null);
                        return [2 /*return*/];
                    }
                    if (key === "password" && !formValues.password) {
                        react_hot_toast_1.toast.error("请输入新密码");
                        return [2 /*return*/];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    setLoading(true);
                    if (key === "nickName") {
                        if (!formValues.nickName.trim()) {
                            react_hot_toast_1.toast.error("昵称不能为空");
                            return [2 /*return*/];
                        }
                        payload.nickname = formValues.nickName;
                    }
                    else if (key === "email") {
                        if (!formValues.email.trim()) {
                            react_hot_toast_1.toast.error("邮箱不能为空");
                            return [2 /*return*/];
                        }
                        if (!formValues.currentPassword) {
                            react_hot_toast_1.toast.error("修改邮箱需要输入当前密码");
                            return [2 /*return*/];
                        }
                        payload.email = formValues.email;
                        payload.currentPassword = formValues.currentPassword;
                    }
                    else if (key === "password") {
                        pwdValidation = PasswordField_1.validatePassword(formValues.password);
                        if (!pwdValidation.valid) {
                            react_hot_toast_1.toast.error(pwdValidation.error || "密码格式不正确");
                            return [2 /*return*/];
                        }
                        if (formValues.password !== formValues.confirmPassword) {
                            react_hot_toast_1.toast.error("两次输入的密码不一致");
                            return [2 /*return*/];
                        }
                        if (!formValues.currentPassword) {
                            react_hot_toast_1.toast.error("修改密码需要输入当前密码");
                            return [2 /*return*/];
                        }
                        payload.password = formValues.password;
                        payload.currentPassword = formValues.currentPassword;
                    }
                    return [4 /*yield*/, AuthApi_1.updateUserApi(payload)];
                case 2:
                    updatedUser = _c.sent();
                    auth.setUser(updatedUser);
                    setEditing(null);
                    react_hot_toast_1.toast.success("修改成功", { duration: 1500, position: "top-center" });
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _c.sent();
                    code = (_b = (_a = err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.errorCode;
                    msg = errors_1.ERROR_MESSAGES[code];
                    setApiError(msg);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    /** FieldRow 组件 */
    var FieldRow = function (_a) {
        var label = _a.label, displayValue = _a.displayValue, editKey = _a.editKey, children = _a.children;
        var isEditing = editing === editKey;
        return (react_1["default"].createElement(material_1.Box, { sx: { mb: 3 } },
            react_1["default"].createElement(material_1.Typography, { sx: { fontSize: { xs: 12, sm: 13 }, color: "#666", mb: 1 } }, label),
            isEditing ? (react_1["default"].createElement(material_1.Box, { sx: { display: "flex", flexDirection: "column", gap: 1.5 } },
                children,
                react_1["default"].createElement(material_1.Box, { sx: { alignSelf: "flex-end" } },
                    react_1["default"].createElement(material_1.Button, { size: "small", sx: {
                            minWidth: 0,
                            px: 1,
                            color: ART_BLUE,
                            fontWeight: 700,
                            textTransform: "none",
                            "&:hover": { backgroundColor: "transparent", color: HOVER_BLUE }
                        }, onClick: function () { return saveField(editKey); }, disabled: loading }, "\u2713"),
                    react_1["default"].createElement(material_1.Button, { size: "small", variant: "text", sx: {
                            ml: 1,
                            minWidth: 0,
                            px: 1,
                            textTransform: "none",
                            color: "#999"
                        }, onClick: cancelEdit, disabled: loading }, "\u2715")))) : (react_1["default"].createElement(material_1.Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                react_1["default"].createElement(material_1.Typography, { sx: { fontSize: { xs: 14, sm: 16 }, color: "#333" } }, label === "密码" ? "••••••••" : displayValue || "未设置"),
                react_1["default"].createElement(material_1.Button, { size: "small", variant: "text", sx: {
                        textTransform: "none",
                        minWidth: 0,
                        px: 1,
                        color: ART_BLUE
                    }, onClick: function () { return startEdit(editKey); } },
                    react_1["default"].createElement(Edit_1["default"], { fontSize: "small" }))))));
    };
    return (react_1["default"].createElement(material_1.Box, { sx: { mt: { xs: 8, sm: 6, md: 8 }, px: { xs: 1, sm: 2 } } },
        react_1["default"].createElement(material_1.Container, null,
            react_1["default"].createElement(material_1.Box, { sx: { mb: 3, textAlign: 'center' } },
                react_1["default"].createElement(material_1.Typography, { variant: "h6", sx: { fontWeight: 700, color: ART_BLUE, fontSize: { xs: 18, sm: 22 } } }, "\u4E2A\u4EBA\u8D44\u6599")),
            react_1["default"].createElement(material_1.Paper, { sx: { borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" } },
                react_1["default"].createElement(material_1.Box, { sx: { p: { xs: 2, sm: 3, md: 4 } } },
                    apiError && react_1["default"].createElement(material_1.Alert, { severity: "error", sx: { mb: 2, fontSize: { xs: 12, sm: 13 } }, onClose: function () { return setApiError(""); } }, apiError),
                    react_1["default"].createElement(material_1.Box, { sx: { mb: 2 } },
                        react_1["default"].createElement(material_1.Typography, { variant: "body2", sx: { color: "#999", textAlign: "left" } },
                            "\u7528\u6237ID: ", userData === null || userData === void 0 ? void 0 :
                            userData.userId)),
                    react_1["default"].createElement(material_1.Divider, { sx: { my: 1 } }),
                    react_1["default"].createElement(FieldRow, { label: "\u6635\u79F0", displayValue: (_d = userData === null || userData === void 0 ? void 0 : userData.nickName) !== null && _d !== void 0 ? _d : "", editKey: "nickName" },
                        react_1["default"].createElement(react_hook_form_1.Controller, { name: "nickName", control: control, render: function (_a) {
                                var field = _a.field;
                                return react_1["default"].createElement(material_1.TextField, __assign({}, field, { size: "small", variant: "standard", placeholder: "\u8F93\u5165\u6635\u79F0", disabled: loading, fullWidth: true }));
                            } })),
                    react_1["default"].createElement(material_1.Divider, { sx: { my: 1 } }),
                    react_1["default"].createElement(FieldRow, { label: "\u90AE\u7BB1", displayValue: (_e = userData === null || userData === void 0 ? void 0 : userData.email) !== null && _e !== void 0 ? _e : "", editKey: "email" },
                        react_1["default"].createElement(react_hook_form_1.Controller, { name: "email", control: control, render: function (_a) {
                                var field = _a.field;
                                return react_1["default"].createElement(material_1.TextField, __assign({}, field, { size: "small", variant: "standard", placeholder: "\u8F93\u5165\u90AE\u7BB1", disabled: loading, fullWidth: true }));
                            } }),
                        react_1["default"].createElement(react_hook_form_1.Controller, { name: "currentPassword", control: control, render: function (_a) {
                                var field = _a.field;
                                return react_1["default"].createElement(material_1.TextField, __assign({}, field, { size: "small", variant: "standard", placeholder: "\u8F93\u5165\u5F53\u524D\u5BC6\u7801", type: "password", disabled: loading, fullWidth: true }));
                            } })),
                    react_1["default"].createElement(material_1.Divider, { sx: { my: 1 } }),
                    react_1["default"].createElement(FieldRow, { label: "\u5BC6\u7801", displayValue: "", editKey: "password" }, editing === "password" && (react_1["default"].createElement(material_1.Box, { sx: { display: "flex", flexDirection: "column", gap: 1.5 } },
                        react_1["default"].createElement(react_hook_form_1.Controller, { name: "currentPassword", control: control, render: function (_a) {
                                var field = _a.field;
                                return react_1["default"].createElement(material_1.TextField, __assign({}, field, { size: "small", 
                                    // variant="standard" 
                                    placeholder: "\u8F93\u5165\u5F53\u524D\u5BC6\u7801", type: "password", disabled: loading, fullWidth: true }));
                            } }),
                        react_1["default"].createElement(PasswordField_1["default"], { control: control, name: "password", label: "\u65B0\u5BC6\u7801", size: "small", 
                            // variant="standard"
                            showRequirements: false, showVisibilityToggle: true, disabled: loading }),
                        react_1["default"].createElement(react_hook_form_1.Controller, { name: "confirmPassword", control: control, render: function (_a) {
                                var field = _a.field;
                                return react_1["default"].createElement(material_1.TextField, __assign({}, field, { size: "small", placeholder: "\u518D\u6B21\u8F93\u5165\u65B0\u5BC6\u7801", type: "password", disabled: loading, fullWidth: true }));
                            } })))))),
            react_1["default"].createElement(material_1.Box, { sx: { display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 } },
                react_1["default"].createElement(material_1.Button, { variant: "outlined", onClick: function () { return navigate(-1); }, sx: { textTransform: "none", borderColor: "#ddd" }, size: "small" }, "\u8FD4\u56DE")))));
}
exports["default"] = ProfilePage;
