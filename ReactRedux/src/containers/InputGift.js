var bindActionCreators = require('redux').bindActionCreators;

var connect = require('react-redux').connect;

var addGift = require('../actions/actions').addGift;
var deleteGift = require('../actions/actions').deleteGift;

var GiftManagement = require('../components/GiftManagement');

function mapStateToProps(state) {
    return {
        gifts: state.gifts
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addGift: bindActionCreators(addGift, dispatch),
        deleteGift: bindActionCreators(deleteGift, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(GiftManagement);
