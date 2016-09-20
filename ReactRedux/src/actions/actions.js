
var ActionTypes = require('../constants/actionTypes');

var Actions = {};

Actions.reset = function() {
    return {
        type: ActionTypes.RESET
    };
};

Actions.loadEmailList = function(emailList) {
    return {
        type: ActionTypes.LOAD_EMAIL_LIST,
        emailList: emailList
    };
};

module.exports = Actions;
