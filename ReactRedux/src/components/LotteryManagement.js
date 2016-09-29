var React = require('react');

var Link = require('react-router').Link;
var withRouter = require('react-router').withRouter;

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
        var list = [];
        var giftList = this.props.giftList;

        if (giftList) {
            for (var i = 0; i < giftList.length; i++) {
                list.push(
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
                    { list }
                </ul>
            </div>
        );
    }
});

var WinnerList = React.createClass({
    render: function() {
        var winnerList = [];
        for (var i = 0; i < this.props.winnerList.length; i++) {
            if (i === this.props.winnerList.length - 1) {
                winnerList.push(
                    <li key={ i }>
                        <b>{ this.props.winnerList[i] }</b>
                    </li>
                );
            } else {
                winnerList.push(
                    <li key={ i }>
                        { this.props.winnerList[i] }
                    </li>
                );
            }
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
                    <input
                        type="button"
                        value="추첨 하기"
                        onClick={ this.handleDraw }
                    />
                </p>
            );
        }

        return (
            <div>
                <h1>{ this.props.gift.name } - 총 { this.props.gift.count }개</h1>

                { lotteryButton }

                <WinnerList
                    giftName={ this.props.gift.name }
                    winnerList={ this.props.gift.winnerList }
                />
            </div>
        );
    }
});

var LotteryManagement = withRouter(React.createClass({
    componentWillMount: function() {
        if (!this.props.applicants) {
            this.props.router.replace('/');
        }

        if (this.props.gifts.list) {
            this.props.initializeLottery(this.props.gifts.list);
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

        var email = applicants[index].email;

        this.props.setWinner(index, email);
    },

    handleStartLottery: function(index) {
        this.props.startLottery(index, this.props.lottery.giftList[index]);
    },

    render: function() {

        if (!this.props.applicants || !this.props.gifts.list) {
            this.props.router.replace('/');
        }

        var isDoing = this.props.lottery.isDoing;

        return (
            <div>
                <h1>경품 추첨</h1>
                <p>각 경품별로 당첨자를 추첨합니다.</p>

                {
                    !isDoing &&
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
                            isDoing={ isDoing }
                            gift={ this.props.lottery.giftList[this.props.lottery.currentGiftIndex] }
                            handleDraw={ this.handleDraw }
                        />
                    )
                }

                {
                    ( this.props.lottery.lotteryDone &&
                        <div>
                            <p>모든 추첨이 종료되었습니다.</p>
                            <p>추첨 결과를 확인하려면 <Link to="/winner">여기</Link>를 눌러주세요.</p>
                        </div>
                    )
                }
            </div>
        );
    }
}));

module.exports = LotteryManagement;
