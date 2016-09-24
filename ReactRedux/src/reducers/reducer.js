var combineReducers = require('redux').combineReducers;

var applicantsReducer = require('./applicantsReducer');
var giftsReducer = require('./giftsReducer');
var lotteryReducer = require('./lotteryReducer');

var reducer = combineReducers({
    applicants: applicantsReducer,
    gifts: giftsReducer,
    lottery: lotteryReducer
});

module.exports = reducer;
