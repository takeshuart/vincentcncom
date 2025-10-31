"use strict";
exports.__esModule = true;
exports.SearchInput = exports.FilterAccordion = void 0;
var react_1 = require("react");
var material_1 = require("@mui/material");
var ArrowDownward_1 = require("@mui/icons-material/ArrowDownward");
var Selector_1 = require("../components/Selector");
var x_data_grid_1 = require("@mui/x-data-grid");
exports.FilterAccordion = function (_a) {
    var changeHandler = _a.changeHandler, genreSelected = _a.genreSelected, techniqueSelected = _a.techniqueSelected, hasImage = _a.hasImage, configData = _a.configData;
    var isMobile = material_1.useMediaQuery('(max-width:600px)');
    if (isMobile) {
        return (react_1["default"].createElement(material_1.Accordion, { style: { width: '100%' } },
            react_1["default"].createElement(material_1.AccordionSummary, { expandIcon: react_1["default"].createElement(ArrowDownward_1["default"], null) },
                react_1["default"].createElement(material_1.Typography, null, "\u8FC7\u6EE4\u5668"))));
    }
    return (react_1["default"].createElement(material_1.Grid, { container: true, sx: { marginTop: '10px', marginBottom: '20px' } },
        react_1["default"].createElement(material_1.Grid, { item: true, xs: 12, sm: 6, md: 3, sx: { '@media (min-width: 600px)': { marginRight: '20px' } } },
            react_1["default"].createElement(Selector_1.FilterSelect, { label: "\u4E3B\u9898", value: genreSelected, onChange: changeHandler('genre'), items: configData.genres, itemValueKey: "genre", itemLabelKey: "genre" })),
        react_1["default"].createElement(material_1.Grid, { item: true, xs: 12, sm: 6, md: 2, sx: { '@media (min-width: 600px)': { marginRight: '20px' } } },
            react_1["default"].createElement(Selector_1.FilterSelect, { label: "\u6280\u6CD5\u7C7B\u578B", value: techniqueSelected, onChange: changeHandler('technique'), items: configData.techniques, itemValueKey: "technique", itemLabelKey: "technique" })),
        react_1["default"].createElement(material_1.Grid, { item: true, xs: 12, sm: 6, md: 2, justifyContent: "center", alignItems: "center" },
            react_1["default"].createElement(material_1.FormGroup, null,
                react_1["default"].createElement(material_1.FormControlLabel, { control: react_1["default"].createElement(material_1.Checkbox, { checked: hasImage, onChange: changeHandler('hasImage') }), label: "\u6709\u56FE\u7247" })))));
};
exports.SearchInput = function (_a) {
    var value = _a.value, onChange = _a.onChange, onKeyDown = _a.onKeyDown, onClick = _a.onClick;
    return (react_1["default"].createElement(material_1.TextField, { variant: "standard", size: "medium", fullWidth: true, label: "\u4F5C\u54C1\u540D\u8BCD/\u535A\u7269\u9986/\u4F5C\u54C1\u7F16\u7801\uFF08\u652F\u6301\u4E2D/\u82F1\uFF09", value: value, onChange: onChange, onKeyDown: onKeyDown, InputProps: {
            endAdornment: (react_1["default"].createElement(material_1.InputAdornment, { position: "end" },
                react_1["default"].createElement(material_1.IconButton, { onClick: onClick },
                    react_1["default"].createElement(x_data_grid_1.GridSearchIcon, null))))
        } }));
};
