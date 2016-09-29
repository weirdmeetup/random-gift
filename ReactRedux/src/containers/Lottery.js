var bindActionCreators = require('redux').bindActionCreators;

var connect = require('react-redux').connect;

var initializeLottery = require('../actions/actions').initializeLottery;
var startLottery = require('../actions/actions').startLottery;
var setWinner = require('../actions/actions').setWinner;

var LotteryManagement = require('../components/LotteryManagement');

function mapStateToProps(state) {
    return {
        applicants: state.applicants,
        gifts: state.gifts,
        lottery: state.lottery
    };
}

function mapDispatchToProps(dispatch) {
    return {
        initializeLottery: bindActionCreators(initializeLottery, dispatch),
        startLottery: bindActionCreators(startLottery, dispatch),
        setWinner: bindActionCreators(setWinner, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(LotteryManagement);
