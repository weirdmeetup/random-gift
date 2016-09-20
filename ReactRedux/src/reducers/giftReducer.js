var ActionTypes = require('../constants/actionTypes');

var giftReducer = function(state, action) {
    if (typeof state === 'undefined') {
        return {
            giftList: []
        };
    }

    switch (action.type) {
    case ActionTypes.ADD_GIFT:
        var newGiftList = state.giftList.slice();
        newGiftList.push({
            name: action.giftName,
            count: action.giftCount
        });

        return {
            giftList: newGiftList
        };

    case ActionTypes.RESET:
        return {
            giftList: []
        };

    default:
        return state;
    }
};

module.exports = giftReducer;
