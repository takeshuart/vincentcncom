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
var react_query_1 = require("@tanstack/react-query");
var cleanArtworkData = function (fetchedArtwork) {
    var processedArtwork = __assign(__assign({}, fetchedArtwork), { exhibitionHistory: [] });
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
    return { processedArtwork: processedArtwork };
};
var useArtworkDetails = function (id) {
    // const [artwork, setArtwork] = useState<Artwork | null>(null);
    var _a = react_1.useState('overview'), activeSection = _a[0], setActiveSection = _a[1];
    var _b = react_query_1.useQuery({
        queryKey: ['artwork', id],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var fetchedArtwork, processedArtwork;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ArtworkApi_1.fetchArtworkById(id)];
                    case 1:
                        fetchedArtwork = _a.sent();
                        processedArtwork = cleanArtworkData(fetchedArtwork).processedArtwork;
                        // setArtwork(processedArtwork);
                        return [2 /*return*/, processedArtwork];
                }
            });
        }); },
        staleTime: 1000 * 60 * 5,
        retry: 2,
        gcTime: 1000 * 60 * 10
    }), artwork = _b.data, isLoadingArtwork = _b.isLoading, artworkError = _b.error;
    // --- 2. 动态计算导航栏目  ---
    var sections = react_1.useMemo(function () {
        var _a;
        var result = [{ id: 'overview', label: '概览', dataField: 'overview' },];
        if (artwork === null || artwork === void 0 ? void 0 : artwork.letters) {
            result.push({ id: 'letters', label: '梵高书信', dataField: 'letters' });
        }
        if ((_a = artwork === null || artwork === void 0 ? void 0 : artwork.exhibitionHistory) === null || _a === void 0 ? void 0 : _a.length) {
            result.push({ id: 'exhibition', label: '展览历史', dataField: 'exhibitionHistory' });
        }
        return result;
    }, [artwork]);
    var _c = react_query_1.useQuery({
        queryKey: ['letters', artwork === null || artwork === void 0 ? void 0 : artwork.letters],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ArtworkApi_1.getLettersByIds(String(artwork === null || artwork === void 0 ? void 0 : artwork.letters))];
                    case 1:
                        res = _a.sent();
                        if (Array.isArray(res))
                            return [2 /*return*/, res];
                        return [2 /*return*/, []];
                }
            });
        }); },
        enabled: activeSection === 'letters' && !!(artwork === null || artwork === void 0 ? void 0 : artwork.letters),
        retry: 1,
        gcTime: 1000 * 60 * 10
    }), lettersData = _c.data, isLoadingLetters = _c.isLoading;
    return {
        artwork: artwork,
        activeSection: activeSection,
        lettersData: lettersData,
        isLoadingLetters: isLoadingLetters,
        isLoadingArtwork: isLoadingArtwork,
        sections: sections,
        setActiveSection: setActiveSection
    };
};
exports["default"] = useArtworkDetails;
