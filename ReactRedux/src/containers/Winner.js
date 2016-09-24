var React = require('react');

var withRouter = require('react-router').withRouter;

var connect = require('react-redux').connect;

var WinnerList = React.createClass({
    render: function() {
        var list = [];
        for (var i = 0; i < this.props.gift.winnerList.length; i++) {
            list.push(
                <li key={ i }>{ this.props.gift.winnerList[i] }</li>
            );
        }

        return (
            <div>
                <h2>{ this.props.gift.name } 당첨자</h2>
                <ul>
                    { list }
                </ul>
            </div>
        );
    }
});

var Winner = withRouter(React.createClass({
    componentWillMount: function() {
        if (!this.props.giftList) {
            this.props.router.replace('/');
        }
    },

    render: function() {
        var list = [];
        for (var i = 0; i < this.props.giftList.length; i++) {
            list.push(
                <WinnerList key={ i } gift={ this.props.giftList[i] } />
            );
        }

        return (
            <div>
                <h1>당첨자 목록</h1>

                경품별 당첨자 목록입니다.

                { list }

            </div>
        );
    }
}));

function mapStateToProps(state) {
    return {
        giftList: state.lottery.giftList
    };
}

module.exports = connect(mapStateToProps)(Winner);
