var React = require('react');
var Link = require('react-router').Link;

var isEmail = require('validator/lib/isEmail');

var CSVUploader = React.createClass({
    handleFile: function(e) {
        this.file = e.target.files[0];
    },

    handleSubmit: function(e) {
        e.preventDefault();

        if (!this.file) {
            console.log('file is not selected.');
            return;
        }

        var reader = new FileReader();
        var loadApplicants = this.props.loadApplicants;
        reader.onload = function() {
            var array = [];

            // By lines
            var lines = this.result.split('\n');
            for(var line = 0; line < lines.length; line++){
                if (isEmail(lines[line])) {
                    array.push({
                        email: lines[line],
                        win: false
                    });
                } else {
                    console.log('"' + lines[line] + '" is not a valid email.');
                }
            }

            loadApplicants(array);
        };
        reader.readAsText(this.file);
    },

    render: function() {
        var loaded = false;
        var statusLabel = ( <p>아직 응모자 명단이 입력되지 않았습니다.</p> );

        if (this.props.applicants.list) {
            loaded = true;
            statusLabel = ( <p> 응모자 <b>{ this.props.applicants.list.length }</b> 명이 입력되었습니다. </p> );
        }

        return (
            <div>
                <h1>응모자 입력</h1>
                <p><b>파일 선택</b>을 눌러 응모자 명단이 들어있는 CSV파일을 선택합니다.</p>
                <p><b>올리기</b> 버튼을 눌러 응모자 명단을 입력합니다.</p>
                <form onSubmit={ this.handleSubmit }>
                    <input type="file" name="file" id="file" onChange={ this.handleFile }/>
                    <input type="submit" value="올리기" />
                </form>

                { statusLabel }

                { loaded && ( <p>경품을 입력하려면 <Link to="/inputGift">여기</Link>를 눌러주세요.</p> ) }

            </div>
        );
    }
});

module.exports = CSVUploader;
