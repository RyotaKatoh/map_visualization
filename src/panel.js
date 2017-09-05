import React, {Component, PropTypes} from 'react';
import TWEEN from 'tween.js';

const propTypes = {
    settings: PropTypes.object.isRequired
};

export default class Panel extends Component {
    constructor(props) {
        super(props);

        const timeState = {time: 0};

        this.timeTween = new TWEEN.Tween(timeState)
                             .to({time: 1800}, 60000)
                             .onUpdate(() => this.props.onChange(timeState))
                             .repeat(Infinity);
    }

    _renderData(data) {
        return (
            <div>
                <h1>Store: {data.store_name}</h1>
                <h1>Amount: ¥{data.amount}</h1>
            </div>
        );
    }

    render() {
        return (
            <div>
                { this._renderData(this.props.settings) }
            </div>
        );
    }

}

Panel.propTypes = propTypes;