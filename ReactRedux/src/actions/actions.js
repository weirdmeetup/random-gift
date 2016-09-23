
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

Actions.addGift = function(giftName, giftCount) {
    return {
        type: ActionTypes.ADD_GIFT,
        giftName: giftName,
        giftCount: giftCount
    };
};

module.exports = Actions;
