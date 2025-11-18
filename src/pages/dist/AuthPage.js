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
var useAuth_1 = require("@/hooks/useAuth");
var react_router_dom_1 = require("react-router-dom");
var react_hook_form_1 = require("react-hook-form");
var errors_1 = require("@/utils/errors");
var PasswordField_1 = require("@/components/PasswordField");
var ART_BLUE = "#215A8F"; // 深普鲁士蓝 (主色)
var HOVER_BLUE = "#17436B"; // 悬停加深色
var ACTIVE_BLUE = "#0E2C48"; // 按下色
var LIGHT_BACKGROUND = "#d8dbf0ff"; // 纯色背景
var AuthPage = function () {
    var _a = useAuth_1.useAuth(), login = _a.login, register = _a.register, user = _a.user;
    var navigate = react_router_dom_1.useNavigate();
    var _b = react_1.useState(true), isLogin = _b[0], setIsLogin = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState(undefined), apiError = _d[0], setApiError = _d[1];
    var _e = react_hook_form_1.useForm({
        mode: "onChange",
        defaultValues: {
            credential: "", password: "", confirmPassword: "", phone: ""
        }
    }), control = _e.control, handleSubmit = _e.handleSubmit, errors = _e.formState.errors, reset = _e.reset, watch = _e.watch;
    react_1.useEffect(function () {
        if (user)
            navigate("/");
    }, [user, navigate]);
    var onSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var err_1, code, msg;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setApiError(undefined);
                    setLoading(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    if (!isLogin) return [3 /*break*/, 3];
                    return [4 /*yield*/, login({ id: data.credential, password: data.password })];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, register({ password: data.password, email: data.credential, phone: data.phone })];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    navigate("/");
                    return [3 /*break*/, 8];
                case 6:
                    err_1 = _c.sent();
                    code = (_b = (_a = err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.errorCode;
                    msg = errors_1.ERROR_MESSAGES[code];
                    setApiError(msg);
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var toggleMode = function () {
        setIsLogin(function (prev) { return !prev; });
        setApiError(undefined);
        reset();
    };
    return (react_1["default"].createElement(material_1.Container, { component: "main", maxWidth: false, sx: {
            backgroundColor: LIGHT_BACKGROUND,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            py: { xs: 8, sm: 8, md: 25 }
        } },
        react_1["default"].createElement(material_1.Box, { sx: {
                width: "100%",
                maxWidth: 400,
                p: { xs: 3, sm: 5 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 4,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
            } },
            react_1["default"].createElement(material_1.Typography, { component: "h1", fontWeight: 700, fontSize: { xs: 18, sm: 26, md: 28 }, sx: { mb: 1, color: ART_BLUE } }, isLogin ? "欢迎回来" : "创建新账户"),
            react_1["default"].createElement(material_1.Typography, { variant: "body2", color: "text.secondary", sx: { mb: { xs: 1, md: 4 } } }, isLogin ? "登录后探索更多艺术品。" : "加入我们，体验梵高数字档案。"),
            apiError && (react_1["default"].createElement(material_1.Alert, { severity: "error", sx: { width: "100%", mb: 3 } }, apiError)),
            react_1["default"].createElement(material_1.Box, { component: "form", onSubmit: handleSubmit(onSubmit), noValidate: true, sx: { mt: 1, width: "100%" } },
                react_1["default"].createElement(react_hook_form_1.Controller, { name: "credential", control: control, rules: {
                        required: true,
                        validate: {
                            isEmailValid: function (value) {
                                return isLogin || validator.isEmail(value) || "请输入有效的电子邮箱格式";
                            }
                        }
                    }, render: function (_a) {
                        var field = _a.field;
                        return (react_1["default"].createElement(material_1.TextField, __assign({}, field, { variant: "outlined", margin: "normal", fullWidth: true, id: "credential", label: "\u90AE\u7BB1", autoComplete: "username", autoFocus: true, error: !!errors.credential, helperText: errors.credential ? errors.credential.message : undefined, disabled: loading, size: "small", sx: { mb: { xs: 2, md: 3 } } })));
                    } }),
                isLogin ? (react_1["default"].createElement(react_hook_form_1.Controller, { name: "password", control: control, rules: { required: true }, render: function (_a) {
                        var field = _a.field, error = _a.fieldState.error;
                        return (react_1["default"].createElement(material_1.TextField, __assign({}, field, { margin: "normal", fullWidth: true, label: "\u5BC6\u7801", type: "password", id: "password", autoComplete: "current-password", error: !!error, helperText: error ? error.message : undefined, disabled: loading, size: "small", sx: { mb: 2 } })));
                    } })) : (react_1["default"].createElement(PasswordField_1["default"], { control: control, name: "password", disabled: loading, showRequirements: false, showVisibilityToggle: true })),
                react_1["default"].createElement(material_1.Button, { type: "submit", fullWidth: true, variant: "contained", disableElevation: true, sx: {
                        mt: 2,
                        mb: 3,
                        py: 1.5,
                        backgroundColor: ART_BLUE,
                        color: 'white',
                        textTransform: "none",
                        fontWeight: 700,
                        boxShadow: 'none',
                        transition: 'background-color 0.2s ease-out, box-shadow 0.2s ease-out, transform 0.2s ease-out',
                        '&:hover': {
                            backgroundColor: HOVER_BLUE,
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2), 0 0 15px 3px " + ART_BLUE + "99",
                            transform: 'translateY(-2px)'
                        },
                        '&:active': {
                            backgroundColor: ACTIVE_BLUE,
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2) inset',
                            transform: 'translateY(0)'
                        }
                    }, disabled: loading }, loading ? react_1["default"].createElement(material_1.CircularProgress, { size: 24, color: "inherit" }) : isLogin ? "登录" : "注册")),
            react_1["default"].createElement(material_1.Stack, { direction: "row", justifyContent: "center", alignItems: "center", sx: { mt: 1 } },
                react_1["default"].createElement(material_1.Typography, { variant: "body2", color: "text.secondary" }, isLogin ? "没有账户？" : "已有账户？"),
                react_1["default"].createElement(material_1.Link, { component: "button", variant: "body2", onClick: toggleMode, disabled: loading, sx: {
                        textTransform: "none",
                        ml: 0.5,
                        fontWeight: "bold",
                        color: ART_BLUE,
                        "&:hover": { textDecoration: "underline" }
                    } }, isLogin ? "立即注册" : "返回登录")))));
};
exports["default"] = AuthPage;
