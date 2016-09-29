var React = require('react');

var withRouter = require('react-router').withRouter;

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

var DisplayWinner = withRouter(React.createClass({
    componentWillMount: function() {
        if (!this.props.giftList) {
            this.props.router.replace('/');
        }
    },

    render: function() {
        if (!this.props.giftList) {
            this.props.router.replace('/');
        }

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

module.exports = DisplayWinner;
