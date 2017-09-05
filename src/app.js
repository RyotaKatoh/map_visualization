/* global window, document */
import React, {Component} from 'react';
import autobind from 'react-autobind';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import {Simplex} from 'noise';
import SimplexNoise from 'simplex-noise';

import Layers from './layers/layers.js';
import Panel from './panel.js';

// import ControlPanel from './control-panel';
import TWEEN from 'tween.js';

const animate = () => {
    TWEEN.update();

    window.requestAnimationFrame(animate);  
};


const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;



const dummyStores = [
{
    store_name: 'HOGEHOGE',
    amount: 52320,
    latitude: 35.6611054,
    longitude: 139.697334
},
{
    store_name: 'FUGAFUGA',
    amount: 52320,
    latitude: 35.6746532,
    longitude: 139.7652724
},
{
    store_name: 'BAR BUZZ',
    amount: 52320,
    latitude: 35.667412,
    longitude: 139.704543
},
{
    store_name: 'SPAM HAM',
    amount: 52320,
    latitude: 35.705342,
    longitude: 139.5769035
},
{
    store_name: 'PIYO FUGA',
    amount: 52320,
    latitude: 35.6866334,
    longitude: 139.6986412
},
{
    store_name: 'fuga',
    amount: 52320,
    latitude: 35.6904290,
    longitude: 139.7029412
},
{
    store_name: 'bar',
    amount: 52320,
    latitude: 35.346044,
    longitude: 139.407823
},
{
    store_name: 'buzz',
    amount: 52320,
    latitude: 35.6175433,
    longitude: 139.704890
},
{
    store_name: 'spam',
    amount: 52320,
    latitude: 36.4909145,
    longitude: 139.9041623
}
]

class Root extends Component{

    constructor(props) {
        super(props);
        this.bearing = -10.0;
        this.latitude = 35.685175;
        this.longitude = 139.7506055; 
        this.state = {
            viewport: {
                width: 500,
                height: 500,
                longitude: this.longitude,
                latitude: this.latitude,
                zoom: 15.5,
                maxZoom: 16,
                pitch: 40.5,
                bearing: this.bearing
            },
            settings: {
                time: 0,
                store_name: '',
                amount: 0,
                store_latitude: 35.685175,
                store_longitude: 139.7506055
            }
        };

        this.frameNum = 0;

        autobind(this);
    }

    componentDidMount(){
        // EvendListener
        window.addEventListener('resize', this._onResize);
        window.addEventListener('keypress', this.pay);
        
        this._animate();
        this._onResize();
        animate();
    }

    componentWillUnmount(){
        this._cameraAnimation.stop();

        // remove EventListener
        window.removeEventListener('resize', this._onResize);
        window.removeEventListener('keypress', this.pay(key));
    }
    
    updateLatLng(pos){
        this.latitude = pos.latitude;
        this.longitude = pos.longitude;
    }

    pay(key) {
        let k = key.witch || key.keyCode;
        if (k == 32 /* space */) {
            console.log('pay!!!');
            // do on fire procedure
            //
            const idx = Math.floor( Math.random() * dummyStores.length );
            const target = dummyStores[idx];
            this._updateSettings({
                store_name: target.store_name,
                amount: target.amount,
                store_latitude: target.latitude,
                store_longitude: target.longitude
            });
            
            console.log(this.state.settings.store_name);
            const positionState = {latitude: this.latitude, longitude: this.longitude};
            this._cameraAnimation = new TWEEN.Tween(positionState)
                                        .to({latitude: this.state.settings.store_latitude, longitude: this.state.settings.store_longitude}, 500)
                                        .easing(TWEEN.Easing.Quartic.Out)
                                        .onUpdate(() => this.updateLatLng(positionState));

            this._cameraAnimation.start();
        }
    }
    
    _animate() {
        this.frameNum += 1;
        
        const simplex = new SimplexNoise(Math.random);
        let lat = this.latitude + Math.sin(this.frameNum * 0.01) * 0.001;// simplex.noise2D(10, 0) * 0.0001 ;
        let lng = this.longitude + Math.cos(this.frameNum * 0.01) * 0.001;// simplex.noise2D(0, 10) * 0.0001;

        this.bearing += 0.02;
        this._updateViewport({
            latitude: lat, 
            longitude: lng, 
            bearing: this.bearing
        });
        window.requestAnimationFrame(this._animate);
    }

    _onResize() {
        this._updateViewport({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    _updateViewport(viewport) {
        this.setState({
            viewport: {...this.state.viewport, ...viewport}
        });
    }

    _updateSettings(settings){
        this.setState({
            settings: {...this.state.settings, ...settings}
        });
    }

    render() {
        const {viewport, settings} = this.state;
        return (
            <div>
                <MapGL
                    {...viewport}
                    mapStyle="mapbox://styles/ryotakatoh/cj65q9gfx6no02rn3jbwkfrji"
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                    perspectiveEnabled
                    onChangeViewport={this._updateViewport}>

                    <Layers viewport={viewport} settings={settings} />
                </MapGL>

                <div className="control-panel">
                    <Panel settings={settings}/>
                </div>
            </div>
        )
    }
}

render(<Root />, document.body.appendChild(document.createElement('div')));