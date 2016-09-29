var ActionTypes = require('../constants/actionTypes');

var applicantsReducer = function(state, action) {
    if (typeof state === 'undefined') {
        return {
            list: undefined
        };
    }

    switch (action.type) {
    case ActionTypes.LOAD_APPLICANTS:
        return {
            list: action.applicants
        };

    case ActionTypes.RESET:
        return {
            list: undefined
        };

    case ActionTypes.SET_WINNER:
        var newList = state.list.slice();
        newList[action.applicantIndex].win = true;

        return {
            list: newList
        };

    default:
        return state;
    }
};

module.exports = applicantsReducer;
