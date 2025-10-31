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
// src/pages/HomePage.tsx
var material_1 = require("@mui/material");
var react_router_dom_1 = require("react-router-dom");
var SurpriseBox_1 = require("../components/SurpriseBox");
var react_query_1 = require("@tanstack/react-query");
var ArtworkApi_1 = require("../api/ArtworkApi");
function HomePage() {
    var _this = this;
    var navigate = react_router_dom_1.useNavigate();
    var queryClient = react_query_1.useQueryClient();
    var _a = react_query_1.useQuery({
        queryKey: ['surpriseArtwork'],
        queryFn: ArtworkApi_1.fetchSurpriseArt,
        staleTime: 1000 * 60 * 5,
        retry: 1
    }), surpriseArtwork = _a.data, isSurpriseLoading = _a.isLoading, isError = _a.isError, refetchSurpriseArt = _a.refetch;
    var handleStartExplore = function () {
        navigate('/search');
    };
    return (React.createElement(material_1.Container, { maxWidth: false, disableGutters: true, sx: { bgcolor: '#d8dbf0ff', pt: 10 } },
        React.createElement(material_1.Container, { maxWidth: false, sx: { width: '90%', mx: 'auto' } },
            React.createElement(SurpriseBox_1["default"], { artwork: surpriseArtwork !== null && surpriseArtwork !== void 0 ? surpriseArtwork : null, isSurpriseLoading: isSurpriseLoading, fetchSurpriseArtWork: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, refetchSurpriseArt()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                }); }); } }),
            React.createElement(material_1.Box, { sx: { textAlign: 'center', padding: 4 } },
                React.createElement(material_1.Button, { variant: "contained", color: "secondary", size: "large", onClick: handleStartExplore, disabled: isSurpriseLoading, sx: {
                        padding: { xs: '10px 20px', md: '15px 40px' },
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#FFC700',
                        color: '#212121',
                        '&:hover': {
                            backgroundColor: '#FFA500',
                            boxShadow: '0 6px 15px rgba(255, 199, 0, 0.6)'
                        }
                    } }, isSurpriseLoading ? React.createElement(material_1.CircularProgress, { size: 24, color: "inherit" }) : '开始探索'),
                React.createElement(material_1.Typography, { variant: "caption", display: "block", sx: { mt: 1, color: 'text.secondary' } }, "\u70B9\u51FB\u8FDB\u5165\u5B8C\u6574\u7684\u4F5C\u54C1\u68C0\u7D22\u548C\u7B5B\u9009\u76EE\u5F55")))));
}
exports["default"] = HomePage;
