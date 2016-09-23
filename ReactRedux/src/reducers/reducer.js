var combineReducers = require('redux').combineReducers;

var applicantsReducer = require('./applicantsReducer');
var giftsReducer = require('./giftsReducer');

var reducer = combineReducers({
    applicants: applicantsReducer,
    gifts: giftsReducer
});

module.exports = reducer;
