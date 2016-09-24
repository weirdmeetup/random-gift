var connect = require('react-redux').connect;

var DisplayWinner = require('../components/DisplayWinner');

function mapStateToProps(state) {
    return {
        giftList: state.lottery.giftList
    };
}

module.exports = connect(mapStateToProps)(DisplayWinner);
