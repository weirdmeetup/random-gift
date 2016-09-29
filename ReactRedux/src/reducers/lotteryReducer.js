var ActionTypes = require('../constants/actionTypes');

var lotteryReducer = function(state, action) {
    var i = 0;
    var giftList = [];

    if (typeof state === 'undefined') {
        return {
            giftList: undefined,
            currentGiftIndex: undefined,
            isDoing: false,
            lotteryDone: false
        };
    }

    switch (action.type) {
    case ActionTypes.INITIALIZE_LOTTERY:
        for (i = 0; i < action.giftList.length; i++) {
            var gift = action.giftList[i];
            giftList.push({
                name: gift.name,
                count: gift.count,
                done: false,
                winnerList: []
            });
        }

        return {
            giftList: giftList,
            currentGiftIndex: undefined,
            isDoing: false,
            lotteryDone: false
        };

    case ActionTypes.START_LOTTERY:
        return {
            giftList: state.giftList,
            currentGiftIndex: action.giftIndex,
            isDoing: true,
            lotteryDone: false
        };

    case ActionTypes.SET_WINNER:
        giftList = state.giftList.slice();

        giftList[state.currentGiftIndex].winnerList.push(action.email);

        var lotteryDone = false;
        var isDoing = true;
        if (giftList[state.currentGiftIndex].winnerList.length == giftList[state.currentGiftIndex].count) {
            giftList[state.currentGiftIndex].done = true;
            isDoing = false;

            var allDone = true;
            for (i = 0; i < giftList.length; i++) {
                if (!giftList[i].done) {
                    allDone = false;
                    break;
                }
            }
            lotteryDone = allDone;
        }

        return {
            giftList: giftList,
            currentGiftIndex: state.currentGiftIndex,
            isDoing: isDoing,
            lotteryDone: lotteryDone
        };

    default:
        return state;
    }
};

module.exports = lotteryReducer;
