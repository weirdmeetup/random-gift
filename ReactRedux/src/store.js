var createStore = require('redux').createStore;
var applyMiddleware = require('redux').applyMiddleware;

var createLogger = require('redux-logger');

var reducer = require('./reducers/reducer');

var logger = createLogger();

var store = createStore(reducer, {}, applyMiddleware(logger));

module.exports = store;
