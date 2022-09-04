import { baseUrl } from './src/api/request';
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/ajax',
    createProxyMiddleware({
      target: baseUrl,
      changeOrigin: true,
    })
  );
};