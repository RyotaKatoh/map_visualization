/* global, window */
import React, {Component, PropTypes} from 'react';
import DeckGL from 'deck.gl';

import TWEEN from 'tween.js';

const propTypes = {
    viewport: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
};

export default class Layers extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null
        };
    };

    componentDidMount() {
        console.log('layers did mount');
    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillUnmount() {

    }
    
    render() {
        const {viewport, settings} = this.props;
        const {data} = this.state;

        const layers = [].filter(Boolean);

        return (
            <DeckGL
                glOptions={{webgl2: true}}
                {...viewport}
                layers={layers}
                useDevicePixelRatio={true} />
        );
    }
}

Layers.propTypes = propTypes