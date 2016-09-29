var ActionTypes = require('../constants/actionTypes');

var giftsReducer = function(state, action) {
    var newList = [];

    if (typeof state === 'undefined') {
        return {
            list: undefined
        };
    }

    switch (action.type) {
    case ActionTypes.ADD_GIFT:
        if (state.list) {
            newList = state.list.slice();
        }

        newList.push({
            name: action.name,
            count: action.count
        });

        return {
            list: newList
        };

    case ActionTypes.DELETE_GIFT:
        var deleted = false;

        var oldList = state.list;
        if (oldList) {
            for (var i = 0; i < oldList.length; i++) {
                if (deleted) {
                    newList.push(oldList[i]);
                    continue;
                }

                if ((oldList[i].name === action.name) && (oldList[i].count === action.count)) {
                    deleted = true;
                    continue;
                }

                newList.push(oldList[i]);
            }
        }

        return {
            list: newList
        };

    case ActionTypes.RESET:
        return {
            list: undefined
        };

    default:
        return state;
    }
};

module.exports = giftsReducer;
