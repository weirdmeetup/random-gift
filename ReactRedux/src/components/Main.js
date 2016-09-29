var React = require('react');
var Link = require('react-router').Link;

var Main = React.createClass({
    render: function() {
        return (
            <div>
                <h1>이모콘 경품 추첨</h1>
                <p>이모콘에서 경품 추첨을 위해 사용하기 위해 작성된 소프트웨어입니다.</p>
                <p>다음 순서로 경품 추첨을 하게 됩니다.</p>
                <ol>
                    <li>참가자 목록이 담긴 CSV 파일을 읽어들입니다.</li>
                    <li>경품을 입력합니다.</li>
                    <li>경품별로 추첨을 합니다.</li>
                    <li>당첨자들을 확인합니다.</li>
                </ol>
                <p>
                    경품 추첨을 시작하려면 <Link to="/uploadCSV">여기</Link>를 눌러주세요.
                </p>
            </div>
        );
    }
});

module.exports = Main;
