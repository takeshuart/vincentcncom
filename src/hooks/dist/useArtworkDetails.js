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
var ArtworkApi_1 = require("../api/ArtworkApi");
/**
 * 辅助函数：清洗和预处理艺术品数据中的 JSON 字段和图片路径
 * @param fetchedArtwork - 原始 API 返回的作品数据
 */
var cleanArtworkData = function (fetchedArtwork) {
    var processedArtwork = __assign(__assign({}, fetchedArtwork), { exhibitionHistory: [] });
    var extLinks = {};
    try {
        if (processedArtwork.exhibitions) {
            processedArtwork.exhibitionHistory = JSON.parse(processedArtwork.exhibitions);
        }
        else {
            processedArtwork.exhibitionHistory = [];
        }
    }
    catch (e) {
        console.error('Error parsing exhibitionHistory JSON:', e);
        processedArtwork.exhibitionHistory = [];
    }
    if (processedArtwork.primaryImageLarge) {
        processedArtwork.primaryImageLarge = "/all-collections/" + processedArtwork.primaryImageLarge;
    }
    else if (processedArtwork.primaryImageSmall) {
        processedArtwork.primaryImageLarge = "https://www.pubhist.com" + processedArtwork.primaryImageSmall;
    }
    return { processedArtwork: processedArtwork, extLinks: extLinks };
};
/**
 * 封装作品详情页的数据获取、清洗和状态管理。
 * @param id - 作品 ID (通常是字符串)
 * @returns 包含作品数据、状态和操作函数的对象。
 */
var useArtworkDetails = function (id) {
    var _a = react_1.useState(null), artwork = _a[0], setArtwork = _a[1];
    var _b = react_1.useState({}), extLinks = _b[0], setExtLinks = _b[1];
    var _c = react_1.useState('overview'), activeSection = _c[0], setActiveSection = _c[1];
    // 延迟加载数据和状态
    var _d = react_1.useState(null), lettersData = _d[0], setLettersData = _d[1];
    var _e = react_1.useState(false), isLoadingLetters = _e[0], setIsLoadingLetters = _e[1];
    var _f = react_1.useState(true), isLoadingArtwork = _f[0], setIsLoadingArtwork = _f[1];
    // --- 1. 艺术品数据获取 (useEffect) ---
    react_1.useEffect(function () {
        if (!id)
            return;
        var fetchAndCleanArtwork = function () { return __awaiter(void 0, void 0, Promise, function () {
            var fetchedArtwork, _a, processedArtwork, cleanedExtLinks, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setIsLoadingArtwork(true);
                        setArtwork(null);
                        setExtLinks({});
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, ArtworkApi_1.fetchArtworkById(id)];
                    case 2:
                        fetchedArtwork = _b.sent();
                        _a = cleanArtworkData(fetchedArtwork), processedArtwork = _a.processedArtwork, cleanedExtLinks = _a.extLinks;
                        setArtwork(processedArtwork);
                        setExtLinks(cleanedExtLinks);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _b.sent();
                        console.error('Error fetching artwork data', error_1);
                        setArtwork(null);
                        return [3 /*break*/, 5];
                    case 4:
                        setIsLoadingArtwork(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchAndCleanArtwork();
    }, [id]);
    // --- 2. 动态计算导航栏目 (useMemo) ---
    var sections = react_1.useMemo(function () {
        if (!artwork)
            return [];
        var sectionsList = [
            { id: 'overview', label: '详情', dataField: 'shortDesc' },
            { id: 'letters', label: '梵高书信', dataField: 'letters' },
            { id: 'exhibition', label: '展出信息', dataField: 'exhibitions' },
        ];
        return sectionsList.filter(function (section) {
            if (section.id === 'overview')
                return true;
            var dataFieldKey = section.dataField;
            var dataFieldValue = artwork[dataFieldKey];
            // 针对 letters 字段进行特殊检查，因为它可能是 number 或 string
            if (section.id === 'letters') {
                return dataFieldValue != null && String(dataFieldValue).length > 0;
            }
            // 针对 exhibitions 字段进行特殊检查
            if (section.id === 'exhibition') {
                // 检查原始字符串字段 exhibitions 
                return dataFieldValue && String(dataFieldValue).length > 0;
            }
            // 检查其他字段是否有值
            return !!dataFieldValue;
        });
    }, [artwork]);
    // --- 3. 延迟加载书信数据 (useEffect) ---
    react_1.useEffect(function () {
        // 只有当切换到 'letters' 选项卡 且 尚未开始加载时，才执行加载
        if (artwork && activeSection === 'letters' && !lettersData && !isLoadingLetters) {
            var loadLetters = function () { return __awaiter(void 0, void 0, Promise, function () {
                var data, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setIsLoadingLetters(true);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, 6, 7]);
                            if (!artwork.letters) return [3 /*break*/, 3];
                            return [4 /*yield*/, ArtworkApi_1.getLettersByIds(String(artwork.letters))];
                        case 2:
                            data = _a.sent();
                            setLettersData(data);
                            return [3 /*break*/, 4];
                        case 3:
                            setLettersData([]);
                            _a.label = 4;
                        case 4: return [3 /*break*/, 7];
                        case 5:
                            error_2 = _a.sent();
                            console.error("Error loading letters:", error_2);
                            setLettersData([]);
                            return [3 /*break*/, 7];
                        case 6:
                            setIsLoadingLetters(false);
                            return [7 /*endfinally*/];
                        case 7: return [2 /*return*/];
                    }
                });
            }); };
            loadLetters();
        }
    }, [activeSection, artwork, lettersData, isLoadingLetters]);
    // 依赖项中添加 artwork, lettersData 和 isLoadingLetters 以确保逻辑的正确性
    // --- 4. 返回结果 ---
    return {
        artwork: artwork,
        extLinks: extLinks,
        activeSection: activeSection,
        lettersData: lettersData,
        isLoadingLetters: isLoadingLetters,
        isLoadingArtwork: isLoadingArtwork,
        sections: sections,
        setActiveSection: setActiveSection
    };
};
exports["default"] = useArtworkDetails;
