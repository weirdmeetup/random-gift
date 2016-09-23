
var ActionTypes = require('../constants/actionTypes');

var Actions = {};

Actions.reset = function() {
    return {
        type: ActionTypes.RESET
    };
};

Actions.loadApplicants = function(applicants) {
    return {
        type: ActionTypes.LOAD_APPLICANTS,
        applicants: applicants
    };
};

Actions.addGift = function(name, count) {
    return {
        type: ActionTypes.ADD_GIFT,
        name: name,
        count: count
    };
};

Actions.deleteGift = function(name, count) {
    return {
        type: ActionTypes.DELETE_GIFT,
        name: name,
        count: count
    };
};

module.exports = Actions;
