const proxy = require('http-proxy-middleware');

module.exports = (app) => {
	app.use(proxy('/socket', { target: 'http://localhost:5000', ws: true }));
};
