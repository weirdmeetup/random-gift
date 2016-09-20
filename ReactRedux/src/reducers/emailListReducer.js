var ActionTypes = require('../constants/actionTypes');

var emailListReducer = function(state, action) {
    if (typeof state === 'undefined') {
        return {
            emailList: []
        };
    }

    switch (action.type) {
    case ActionTypes.LOAD_EMAIL_LIST:
        return {
            emailList: action.emailList
        };

    case ActionTypes.RESET:
        return {
            emailList: []
        };

    default:
        return state;
    }
};

module.exports = emailListReducer;
