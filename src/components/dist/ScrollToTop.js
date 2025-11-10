"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
//Automatically scrolls to the top of the page whenever the route (pathname) changes.
var ScrollToTop = function () {
    var pathname = react_router_dom_1.useLocation().pathname;
    react_1.useEffect(function () {
        window.scrollTo({ top: 0, behavior: 'instant' }); // 或 smooth
    }, [pathname]);
    return null;
};
exports["default"] = ScrollToTop;
