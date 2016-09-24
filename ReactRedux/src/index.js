var React = require('react');
var ReactDOM = require('react-dom');

var Provider = require('react-redux').Provider;

var Route = require('react-router').Route;
var Router = require('react-router').Router;
var HashHistory = require('react-router').hashHistory;
var IndexRoute = require('react-router').IndexRoute;

var store = require('./store');

var Main = require('./containers/Main');
var UploadCSV = require('./containers/UploadCSV');
var InputGift = require('./containers/InputGift');
var Lottery = require('./containers/Lottery');
var Winner = require('./containers/Winner');

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
