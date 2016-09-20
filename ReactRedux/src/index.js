var React = require('react');
var ReactDOM = require('react-dom');

var Route = require('react-router').Route;
var Router = require('react-router').Router;
var HashHistory = require('react-router').hashHistory;
var IndexRoute = require('react-router').IndexRoute;
var Link = require('react-router').Link;a

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

var UploadCSV = React.createClass({
    handleFile: function(e) {
        this.file = e.target.files[0];
    },

    handleSubmit: function() {
        var reader = new FileReader();
        reader.onload = function() {
            // Entire file
            // console.log(this.result);

            var array = [];

            // By lines
            var lines = this.result.split('\n');
            for(var line = 0; line < lines.length; line++){
                array.push(lines[line]);
            }
            console.log(array);
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
});

var InputGift = React.createClass({
    render: function() {
        return (
            <div>
                <h1>InputGift</h1>
                <Link to="/lottery">Go to lottery</Link>
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
            </div>
        );
    }
});


ReactDOM.render(
    <Router history={HashHistory}>
        <Route path="/">
            <IndexRoute component={ Main } />

            <Route path="uploadCSV" component={ UploadCSV } />
            <Route path="inputGift" component={ InputGift } />
            <Route path="lottery" component={ Lottery } />
            <Route path="winner" component={ Winner } />
        </Route>
    </Router>
    ,
    document.getElementById('content')
);
