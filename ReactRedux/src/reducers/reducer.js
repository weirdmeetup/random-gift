var combineReducers = require('redux').combineReducers;

var emailListReducer = require('./emailListReducer');

var reducer = combineReducers({
    emailList: emailListReducer
});

module.exports = reducer;
