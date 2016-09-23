var combineReducers = require('redux').combineReducers;

var applicantsReducer = require('./applicantsReducer');
var giftReducer = require('./giftReducer');

var reducer = combineReducers({
    applicants: applicantsReducer,
    giftList: giftReducer
});

module.exports = reducer;
