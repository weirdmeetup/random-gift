var React = require('react');
var ReactDOM = require('react-dom');

var connect = require('react-redux').connect;
var Provider = require('react-redux').Provider;

var Route = require('react-router').Route;
var Router = require('react-router').Router;
var HashHistory = require('react-router').hashHistory;
var IndexRoute = require('react-router').IndexRoute;
var Link = require('react-router').Link;

var isEmail = require('validator/lib/isEmail');

var store = require('./store');

var loadEmailList = require('./actions/actions').loadEmailList;

var Main = React.createClass({
    render: function() {
        return (
            <div>
                <h1>Main</h1>
                <Link to="/uploadCSV">Upload CSV</Link>
            </div>
        );
    }
});

var UploadCSV = connect()(React.createClass({
    handleFile: function(e) {
        this.file = e.target.files[0];
    },

    handleSubmit: function() {
        var reader = new FileReader();
        var dispatch = this.props.dispatch;

        reader.onload = function() {
            var array = [];

            // By lines
            var lines = this.result.split('\n');
            for(var line = 0; line < lines.length; line++){
                if (isEmail(lines[line])) {
                    array.push(lines[line]);
                } else {
                    console.log('"' + lines[line] + '" is not valid email.');
                }
            }

            dispatch(loadEmailList(array));
        };
        reader.readAsText(this.file);
    },

    render: function() {
        return (
            <div>
                <h1>Main component</h1>
                <form onSubmit={ this.handleSubmit }>
                    <input type="file" name="file" id="file" onChange={ this.handleFile }/>
                    <input type="submit" value="올리기" />
                </form>
                <Link to="/inputGift">Input Gift</Link>
            </div>
        );
    }
}));

var InputGift = React.createClass({
    handleGiftName: function(e) {
        console.log(e.target.value);
    },

    handleGiftCount: function(e) {
        console.log(e.target.value);
    },

    handleSubmit: function() {
        console.log('submit');
    },

    render: function() {
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
                    <li>
                        선물1 2개
                        <input type="button" value="삭제" />
                    </li>
                    <li>
                        선물2 2개
                        <input type="button" value="삭제" />
                    </li>
                </ul>

            </div>
        );
    }
});

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
