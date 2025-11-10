"use strict";
exports.__esModule = true;
// src/theme/theme.ts
var styles_1 = require("@mui/material/styles");
var ART_BLUE = "#215A8F"; // 深普鲁士蓝
// 创建主题
var customTheme = styles_1.createTheme({
    palette: {
        primary: {
            main: ART_BLUE
        },
        secondary: {
            main: '#DAB459'
        },
        background: {
            "default": '#F7F7F7'
        }
    },
    components: {
        MuiFormLabel: {
            styleOverrides: {
                // remove  TextField/FormControl requiew *
                asterisk: {
                    display: 'none'
                }
            }
        }
    }
});
exports["default"] = customTheme;
