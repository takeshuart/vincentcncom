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
var axios_1 = require("axios");
var material_1 = require("@mui/material");
var material_2 = require("@mui/material");
var Select_1 = require("@mui/material/Select");
var x_data_grid_1 = require("@mui/x-data-grid");
var TableRows_1 = require("@mui/icons-material/TableRows");
require("../styles/ArtTableStyles.css");
var columns = [
    {
        field: 'primaryImageSmall', headerName: 'Image', width: 100,
        renderCell: function (params) {
            return params.value ? (react_1["default"].createElement("img", { src: "https://www.pubhist.com" + params.value, style: { width: 80, height: 80, objectFit: 'cover' }, alt: "" })) : '';
        }
    },
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'titleEn', headerName: 'Title', width: 250, editable: true },
    { field: 'genre', headerName: 'Genre', width: 200, editable: true },
    { field: 'fCode', headerName: 'F Number', width: 200 },
    { field: 'jhCode', headerName: 'JH Number', width: 150 },
    { field: 'collection', headerName: 'Collection', width: 200 },
    { field: 'period', headerName: 'Period', width: 200 },
    { field: 'dimension', headerName: 'Dimension', width: 150 },
    { field: 'inventoryCode', headerName: 'Inventory No', width: 150 }
];
var drawerWidth = 240;
var apiDomain = 'http://localhost:5001/artworks/vincent';
function ArtTable() {
    var _this = this;
    var _a = react_1.useState([]), artworks = _a[0], setArtWorks = _a[1];
    var _b = react_1.useState(0), totalRows = _b[0], setTotalRows = _b[1];
    var _c = react_1.useState({ page: 0, pageSize: 20 }), paginationModel = _c[0], setPaginationModel = _c[1];
    var _d = react_1.useState([]), genreSelected = _d[0], setSelectedItems = _d[1];
    var _e = react_1.useState([]), genresCond = _e[0], setGenresCond = _e[1];
    var _f = react_1.useState([]), periodsCond = _f[0], setPeriodsCond = _f[1];
    react_1.useEffect(function () {
        var fetchArtData = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1["default"].get(apiDomain + '/bypage', {
                                params: {
                                    page: paginationModel.page + 1,
                                    pageSize: paginationModel.pageSize,
                                    genres: genreSelected
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        setArtWorks(response.data.rows);
                        setTotalRows(response.data.count);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error fetching art data', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchArtData();
        // Fetch config data only once when the component mounts
        var fetchConfigData = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, genreRes, periodRes, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                axios_1["default"].get(apiDomain + '/config?cond=genre'),
                                axios_1["default"].get(apiDomain + '/config?cond=period')
                            ])];
                    case 1:
                        _a = _b.sent(), genreRes = _a[0], periodRes = _a[1];
                        setGenresCond(genreRes.data);
                        setPeriodsCond(periodRes.data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        console.log('Error fetching config data', error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchConfigData();
    }, [paginationModel, genreSelected]); // 当 currentPage 或 pageSize 变化时重新触发
    var handleChange = function (event) {
        var value = event.target.value;
        setSelectedItems(value);
    };
    return (react_1["default"].createElement(material_1.Box, { sx: { display: 'flex' } },
        react_1["default"].createElement(material_1.Drawer, { variant: "permanent", sx: {
                width: drawerWidth,
                '& .MuiDrawer-paper': { width: drawerWidth }
            } },
            react_1["default"].createElement(material_1.Toolbar, null),
            react_1["default"].createElement(material_1.Box, { sx: { overflow: 'auto' } },
                react_1["default"].createElement(material_1.List, null,
                    react_1["default"].createElement(material_1.ListItem, null,
                        react_1["default"].createElement(material_1.ListItemButton, null,
                            react_1["default"].createElement(material_1.ListItemIcon, null,
                                react_1["default"].createElement(TableRows_1["default"], null)),
                            react_1["default"].createElement(material_1.ListItemText, { primary: "ArtWork Table" })))))),
        react_1["default"].createElement(material_1.Box, { sx: { flexGrow: 1, width: "calc(100% - " + drawerWidth + "px)" } },
            react_1["default"].createElement(material_1.Container, { maxWidth: false },
                react_1["default"].createElement(material_1.Typography, { variant: "h6", marginBottom: 2 }, "ArtWorks Database"),
                react_1["default"].createElement(material_2.FormControl, { fullWidth: true, variant: "filled" },
                    react_1["default"].createElement(material_2.InputLabel, { id: "mutiple-checkbox-label" }, "Items"),
                    react_1["default"].createElement(Select_1["default"], { labelId: "mutiple-checkbox-label", id: "mutiple-checkbox", multiple: true, value: genreSelected, onChange: handleChange, input: react_1["default"].createElement(material_2.OutlinedInput, { label: "Items" }), renderValue: function (selected) { return selected.join(', '); }, MenuProps: {
                            PaperProps: {
                                style: {
                                    maxHeight: 300
                                }
                            }
                        } }, genresCond.map(function (item) { return (react_1["default"].createElement(material_2.MenuItem, { key: item.genre, value: item.genre },
                        react_1["default"].createElement(material_2.Checkbox, { checked: genreSelected.indexOf(item.value) > -1 }),
                        react_1["default"].createElement(material_1.ListItemText, { primary: item.genre }))); }))),
                react_1["default"].createElement(material_2.FormControl, { fullWidth: true },
                    react_1["default"].createElement(material_2.InputLabel, { id: "mutiple-checkbox-label" }, "Items"),
                    react_1["default"].createElement(Select_1["default"], { labelId: "mutiple-checkbox-label", id: "mutiple-checkbox", multiple: true, value: genreSelected, onChange: handleChange, input: react_1["default"].createElement(material_2.OutlinedInput, { label: "Items" }), renderValue: function (selected) { return selected.join(', '); }, MenuProps: {
                            PaperProps: {
                                style: {
                                    maxHeight: 300
                                }
                            }
                        } }, periodsCond.map(function (item) { return (react_1["default"].createElement(material_2.MenuItem, { key: item.period, value: item.period },
                        react_1["default"].createElement(material_2.Checkbox, { checked: genreSelected.indexOf(item.period) > -1 }),
                        react_1["default"].createElement(material_1.ListItemText, { primary: item.period }))); }))),
                react_1["default"].createElement(material_1.TextField, { fullWidth: true, label: "Search", sx: { mb: 2 } }),
                react_1["default"].createElement(material_1.Paper, { sx: { height: 850, mb: 3 } },
                    react_1["default"].createElement(x_data_grid_1.DataGrid, { rowHeight: 100, rows: artworks, columns: columns, paginationModel: paginationModel, onPaginationModelChange: setPaginationModel, pageSizeOptions: [10, 20, 30], rowCount: totalRows, paginationMode: "server", loading: !artworks.length }))))));
}
exports["default"] = ArtTable;
