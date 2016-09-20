var combineReducers = require('redux').combineReducers;

var emailListReducer = require('./emailListReducer');
var giftReducer = require('./giftReducer');

var reducer = combineReducers({
    emailList: emailListReducer,
    giftList: giftReducer
});

module.exports = reducer;
