var React = require('react');

var Link = require('react-router').Link;

var extend = require('extend');

var GiftItem = React.createClass({
    handleDelete: function(e) {
        e.preventDefault();

        this.props.handleDelete(this.props.name, this.props.count);
    },

    render: function() {
        return (
            <li>
                <b>{ this.props.name }</b> { this.props.count } 개
                <input type="button" value="삭제" onClick={ this.handleDelete }/>
            </li>
        );
    }
});

var GiftManagement = React.createClass({
    getInitialState: function() {
        return {
            giftName: '',
            giftCount: 1
        };
    },

    handleDeleteGift: function(name, count) {
        this.props.deleteGift(name, count);
    },

    handleGiftName: function(e) {
        var name = e.target.value.trim();
        this.setState(extend({}, this.state, { giftName: name }));
    },

    handleGiftCount: function(e) {
        var count = parseInt(e.target.value);
        this.setState(extend({}, this.state, { giftCount: count }));
    },

    handleSubmit: function(e) {
        e.preventDefault();

        if (!this.state.giftName || this.state.giftName === '') {
            return;
        }

        this.props.addGift(this.state.giftName, this.state.giftCount);

        this.setState({
            giftName: '',
            giftCount: 1
        });
    },

    render: function() {
        var giftsAdded = false;
        var gifts = [];
        if (this.props.gifts.list && this.props.gifts.list.length > 0) {
            giftsAdded = true;
            var list = this.props.gifts.list;
            for (var i = 0; i < list.length; i++) {
                gifts.push(
                    ( <GiftItem key={ i } name={ list[i].name } count={ list[i].count } handleDelete={ this.handleDeleteGift }/> )
                );
            }
        }

        return (
            <div>
                <h1>경품 입력</h1>
                <p>경품의 이름과 수량을 입력 후, <b>경품 추가</b>를 누르면 경품이 추가됩니다.</p>
                <form onSubmit={ this.handleSubmit }>
                    <ul>
                        <li>경품 이름: <input type="text" onChange={ this.handleGiftName } value={ this.state.giftName }/></li>
                        <li>경품 개수: <input type="number" min="1" onChange={ this.handleGiftCount } value={ this.state.giftCount }/></li>
                        <li><input type="submit" value="경품 추가" /></li>
                    </ul>
                </form>

                <h1>경품 목록</h1>

                { !giftsAdded && ( <p>입력된 경품이 없습니다. 경품을 추가해주세요.</p> ) }

                <ul>
                    { gifts }
                </ul>

                { giftsAdded &&
                    ( <p>경품 추첨을 하려면 <Link to="/lottery">여기</Link>를 눌러주세요.</p> )
                }

            </div>
        );
    }
});

module.exports = GiftManagement;
