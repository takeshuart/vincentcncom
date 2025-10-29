"use strict";

/**
 * !!!启动时无法加载，没找到问题。
 * 开发环境本地代理，类似Nginx反向代理。
 * /src/setupProxy.js  固定的目录和文件名
 * 仅在npm start起作用：npm start 时，CRA 的 Webpack Dev Server 会自动查找并执行 src/setupProxy.js 文件。
 * 启动 npm run build 并部署生产版时，这个代理机制不会生效
 */
var _require = require('http-proxy-middleware'),
    createProxyMiddleware = _require.createProxyMiddleware;

module.exports = function (app) {
  app.use('/api/v1', createProxyMiddleware({
    target: 'http://localhost:5001',
    changeOrigin: true // pathRewrite: { '^/api/v1': '' }, // 如需去掉前缀可打开

  }));
  console.log('Proxy config loaded...');
};