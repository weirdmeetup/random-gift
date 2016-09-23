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

    default:
        return state;
    }
};

module.exports = applicantsReducer;
