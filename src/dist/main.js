"use strict";
exports.__esModule = true;
var react_1 = require("react");
var client_1 = require("react-dom/client");
var App_1 = require("./App");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
//React Enter File
/**
 * 全局状态管理器，管理了所有的 查询缓存、失效策略、重试策略 等。
 * useQuery/useMutation会自动使用该管理器
 */
var queryClient = new react_query_1.QueryClient();
//load 
client_1["default"].createRoot(document.getElementById('root')).render(react_1["default"].createElement(react_1["default"].StrictMode, null,
    react_1["default"].createElement(react_query_1.QueryClientProvider, { client: queryClient },
        react_1["default"].createElement(react_router_dom_1.BrowserRouter, null,
            react_1["default"].createElement(App_1["default"], null)))));
