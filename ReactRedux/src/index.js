var React = require('react');
var ReactDOM = require('react-dom');

var connect = require('react-redux').connect;
var Provider = require('react-redux').Provider;

var Route = require('react-router').Route;
var Router = require('react-router').Router;
var HashHistory = require('react-router').hashHistory;
var IndexRoute = require('react-router').IndexRoute;
var Link = require('react-router').Link;

var store = require('./store');

var addGift = require('./actions/actions').addGift;

var Main = require('./containers/Main');
var UploadCSV = require('./containers/UploadCSV');

var GiftItem = React.createClass({
    render: function() {
        return (
            <li>
                { this.props.name } - { this.props.count }
                <input type="button" value="삭제" />
            </li>
        );
    }
});

function mapStateToProps(state) {
    return {
        giftList: state.giftList
    };
}

var InputGift = connect(mapStateToProps)(React.createClass({

    handleGiftName: function(e) {
        this.giftName = e.target.value.trim();
    },

    handleGiftCount: function(e) {
        this.giftCount = parseInt(e.target.value);
    },

    handleSubmit: function(e) {
        e.preventDefault();

        if (!this.giftName || this.giftName === '') {
            return;
        }

        if (!this.giftCount) {
            this.giftCount = 1;
        }

        this.props.dispatch(addGift(this.giftName, this.giftCount));
    },

    render: function() {
        var giftList = [];
        if (this.props.giftList) {
            var list = this.props.giftList.giftList;
            for (var i = 0; i < list.length; i++) {
                giftList.push( <GiftItem key={ i } name={ list[i].name } count={ list[i].count } /> );
            }
        }

        return (
            <div>
                <h1>InputGift</h1>
                <form onSubmit={ this.handleSubmit }>
                    <input type="text" onChange={ this.handleGiftName }/>
                    <input type="number" defaultValue="1" min="1" onChange={ this.handleGiftCount }/>
                    <input type="submit" value="경품 추가" />
                </form>
                <Link to="/lottery">Go to lottery</Link>

                <h1>Gift List</h1>
                <ul>
                    { giftList }
                </ul>

            </div>
        );
    }
}));

var Lottery = React.createClass({
    render: function() {
        return (
            <div>
                <h1>Lottery</h1>
                <Link to="/winner">Go to winner</Link>
                <h1>경품 목록</h1>
                <ul>
                    <li>
                        선물 1 / 2 - <b>a@gmail.com</b>
                    </li>
                    <li>
                        선물 2 / 2 - <input type="button" value="추첨" />
                    </li>
                </ul>
            </div>
        );
    }
});

var Winner = React.createClass({
    render: function() {
        return (
            <div>
                <h1>Winner</h1>
                <Link to="/">Reset</Link>
                <h1>경품 목록</h1>
                <ul>
                    <li>
                        선물 1 / 2 - <b>a@gmail.com</b>
                    </li>
                    <li>
                        선물 2 / 2 - <b>b@gmail.com</b>
                    </li>
                </ul>
            </div>
        );
    }
});


ReactDOM.render(
    <Provider store={ store } >
        <Router history={HashHistory}>
            <Route path="/">
                <IndexRoute component={ Main } />

                <Route path="uploadCSV" component={ UploadCSV } />
                <Route path="inputGift" component={ InputGift } />
                <Route path="lottery" component={ Lottery } />
                <Route path="winner" component={ Winner } />
            </Route>
        </Router>
    </Provider>
    ,
    document.getElementById('content')
);
