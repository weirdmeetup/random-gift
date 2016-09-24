var React = require('react');

var Link = require('react-router').Link;
var withRouter = require('react-router').withRouter;

var connect = require('react-redux').connect;

var initializeLottery = require('../actions/actions').initializeLottery;
var startLottery = require('../actions/actions').startLottery;
var setWinner = require('../actions/actions').setWinner;

var LotteryItem = React.createClass({
    handleClick: function(e) {
        e.preventDefault();

        this.props.handleStart(this.props.index);
    },

    render: function() {
        var buttonOrLabel = ( <input type="button" value="추첨 시작" onClick={ this.handleClick } /> );

        if (this.props.done) {
            buttonOrLabel = ( <b>추첨 완료</b> );
        }

        return (
            <li>
                <b>{ this.props.name }</b> { this.props.count } 개 - { buttonOrLabel }
            </li>
        );
    }
});

var LotteryList = React.createClass({
    handleStart: function(index) {
        this.props.handleStartLottery(index);
    },

    render: function() {
        var listGifts = [];
        var giftList = this.props.giftList;

        if (giftList) {
            for (var i = 0; i < giftList.length; i++) {
                listGifts.push(
                    <LotteryItem
                        key={ i }
                        index={ i }
                        name={ giftList[i].name }
                        count={ giftList[i].count }
                        done={ giftList[i].done }
                        handleStart={ this.handleStart }
                    />
                );
            }
        }

        return (
            <div>
                <h1>경품 목록</h1>
                <ul>
                    { listGifts }
                </ul>
            </div>
        );
    }
});

var WinnerList = React.createClass({
    render: function() {
        var winnerList = [];
        for (var i = 0; i < this.props.winnerList.length; i++) {
            winnerList.push(
                <li key={ i }>
                    { this.props.winnerList[i] }
                </li>
            );
        }

        return (
            <div>
                <h1><b>{ this.props.giftName } </b>당첨자 목록</h1>
                <ul>
                    { winnerList }
                </ul>
            </div>
        );
    }
});

var LotteryDraw = React.createClass({
    handleDraw: function() {
        this.props.handleDraw();
    },

    render: function() {
        var lotteryButton = ( <p>추첨 <b>완료</b></p> );
        if (this.props.isDoing) {
            lotteryButton = (
                <p>
                    <input type="button" value="추첨 하기" onClick={ this.handleDraw }/>
                </p>
            );
        }

        return (
            <div>
                <h1>{ this.props.gift.name } - 총 { this.props.gift.count }개</h1>

                { lotteryButton }

                <WinnerList giftName={ this.props.gift.name} winnerList={ this.props.gift.winnerList } />
            </div>
        );
    }
});

var Lottery = withRouter(React.createClass({
    componentWillMount: function() {
        if (this.props.gifts.list) {
            this.props.dispatch(initializeLottery(this.props.gifts.list));
        } else {
            this.props.router.replace('/');
        }
    },

    handleDraw: function() {
        var applicants = this.props.applicants.list;

        var min = 1;
        var max = applicants.length;
        var index = 1;
        do {
            index = Math.floor(Math.random() * (max - min)) + min;
        } while (applicants[index].win);

        var email = this.props.applicants.list[index].email;

        this.props.dispatch(setWinner(index, email));
    },

    handleStartLottery: function(index) {
        console.log(this.props.lottery.giftList[index]);

        this.props.dispatch(startLottery(index, this.props.lottery.giftList[index]));
    },

    render: function() {
        var isDoing = this.props.lottery.isDoing;

        return (
            <div>
                <h1>경품 추첨</h1>
                <p>각 경품을 받을 응모자를 추첨합니다.</p>

                { !isDoing &&
                    (
                        <LotteryList
                            giftList={ this.props.lottery.giftList }
                            handleStartLottery={ this.handleStartLottery }
                        />
                    )
                }

                { (typeof this.props.lottery.currentGiftIndex !== 'undefined') &&
                    (
                        <LotteryDraw
                            isDoing={ this.props.lottery.isDoing }
                            gift={ this.props.lottery.giftList[this.props.lottery.currentGiftIndex] }
                            handleDraw={ this.handleDraw }
                        />
                    )
                }

                {
                    ( this.props.lottery.lotteryDone &&
                        <p>모든 추첨이 종료되었습니다. <Link to="/winner">여기</Link>를 눌러서 추첨 결과를 확인합니다.</p>
                    )
                }
            </div>
        );
    }
}));

function mapStateToProps(state) {
    return {
        applicants: state.applicants,
        gifts: state.gifts,
        lottery: state.lottery
    };
}

module.exports = connect(mapStateToProps)(Lottery);
