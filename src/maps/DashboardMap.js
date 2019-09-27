import React, { Component } from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker, Circle, Polygon} from 'react-google-maps';
import Geocode from "react-geocode";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";

/*jslint sub: true, maxerr: 50, indent: 4, browser: true */
/*global console */

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Region(points) {
    this.points = points || [];
    this.length = points.length;
}

Region.prototype.area = function () {
    var area = 0,
        i,
        j,
        point1,
        point2;

    for (i = 0, j = this.length - 1; i < this.length; j=i,i++) {
        point1 = this.points[i];
        point2 = this.points[j];
        area += point1.x * point2.y;
        area -= point1.y * point2.x;
    }
    area /= 2;

    return area;
};

Region.prototype.centroid = function () {
    var x = 0,
        y = 0,
        i,
        j,
        f,
        point1,
        point2;

    for (i = 0, j = this.length - 1; i < this.length; j=i,i++) {
        point1 = this.points[i];
        point2 = this.points[j];
        f = point1.x * point2.y - point2.x * point1.y;
        x += (point1.x + point2.x) * f;
        y += (point1.y + point2.y) * f;
    }

    f = this.area() * 6;

    return new Point(x / f, y / f);
};

function currentPosition(callback){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            callback(pos);
            // return pos;
            // infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            // infoWindow.open(map);
            // map.setCenter(pos);
        }, function () {
            // handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        // handleLocationError(false, infoWindow, map.getCenter());
    }
}

function addressGeocode(address, callback){
    Geocode.fromAddress(address).then(
        response => {
            const { lat, lng } = response.results[0].geometry.location;
            callback({lat, lng});
        },
        error => {
            console.error(error);
        }
    );
}



class DashboardMap extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            currentCoords: {lat: 40.756795, lng: -73.954298},
            currentMarker: false,
            currentZoom: 13,
            areaShape: "",
            circleRadius: 100,
            circleCoords:{},
            polyCoords: [],
            polyCenter: {lat: 40.756795, lng: -73.954298},
            refresh: true
        };

        this.circle = React.createRef();
        this.getCurrentLocation = this.getCurrentLocation.bind(this);

        this.refreshMap = this.refreshMap.bind(this);

        // this.getCurrentPosition = this.getCurrentPosition.bind(this);
        // this.getAddressPosition = this.getAddressPosition.bind(this);
        //
        // this.setAreaShape = this.setAreaShape.bind(this);
        // this.setCircleRadius = this.setCircleRadius.bind(this);
        //
        // this.radiusChanged = this.radiusChanged.bind(this);
        // this.dragEndCircle = this.dragEndCircle.bind(this);
        // this.dragEndPolygon = this.dragEndPolygon.bind(this);
        //
        // this.getPolygonPaths = this.getPolygonPaths.bind(this);
        // this.getCircleCoords = this.getCircleCoords.bind(this);

        // this.state = {
        //     stores: [{lat: 47.49855629475769, lng: -122.14184416996333},
        //         {latitude: 47.359423, longitude: -122.021071},
        //         {latitude: 47.2052192687988, longitude: -121.988426208496},
        //         {latitude: 47.6307081, longitude: -122.1434325},
        //         {latitude: 47.3084488, longitude: -122.2140121},
        //         {latitude: 47.5524695, longitude: -122.0425407}]
        // }
    }
    componentDidMount(){
        this.getCurrentLocation();
        this.getCurrentPositionTimer = setInterval(
            () => this.getCurrentLocation(),
            5000
        );
    }

    getCurrentLocation(){
        currentPosition(function(position){
            this.setState({
                currentCoords: position,
                currentMarker: true,
                currentZoom: 15
                // circleCoords: position
            });
        }.bind(this));
        console.log("hello");
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.auth) {
            console.log("unmount");
            clearInterval(this.getCurrentPositionTimer);
        }

        if (nextProps.errors) {
            this.setState({errors : nextProps.errors});
        }
    }

    //map can't be always updating when dragging polygon or circle
    shouldComponentUpdate(nextProps,nextState) {
        // if(this.state.refresh === true){
        //     this.setState({refresh: false});
        //     return true;
        // }
        return true;
    }

    refreshMap(){
        this.setState({
            currentCoords: {lat: 40.756795, lng: -73.954298},
            currentMarker: false,
            currentZoom: 13,
            areaShape: "",
            circleRadius: 100,
            circleCoords:{},
            polyCoords: []
        });
    }

    bindRefPoly = ref => this.ref = ref;
    bindRefCircle = ref => this.refCircle = ref;

    render() {
        const DashMap = withScriptjs(withGoogleMap(props => (
            <GoogleMap
                defaultCenter = { this.state.currentCoords }
                defaultZoom = { this.state.currentZoom }
            >
                {this.state.currentMarker &&
                <Marker
                    options={{
                        icon : {
                            url: 'http://plebeosaur.us/etc/map/bluedot_retina.png',
                            size: null,
                            origin: null,
                            anchor: {x: 8, y: 8},
                            scaledSize: {width: 15, height: 15},
                        },
                        title: 'currentLocationMarker',
                        position: this.state.currentCoords,
                    }}
                />}

                {this.state.areaShape === 'circle' && <Circle ref={this.bindRefCircle} options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    center: this.state.circleCoords,
                    radius: this.state.circleRadius,
                    draggable: true,
                    editable: true,
                }} onDragEnd={this.dragEndCircle} onRadiusChanged={this.radiusChanged}/>}

                {this.state.areaShape === 'polygon' && <Polygon ref={this.bindRefPoly} options={{
                    paths: this.state.polyCoords,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    draggable: true,
                    editable: true,
                }} onDragEnd= {this.dragEndPolygon}/>}
            </GoogleMap>
        )));
        return(
            <DashMap
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRZhF4x6LCA-Icm2TPu7akX4y5C07yP1o&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `400px` }} />}
                containerElement={<div style={{ height: `auto`, width: "auto"}} />}
                mapElement={<div id={'map_canvas'} style={{ height: `1000px` }}/>}
            />
        );
    }
}

DashboardMap.propTypes = {
    auth: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = function(state){
    return {
        auth: state.authenticate.authentication,
        user: state.authenticate.userInfo,
        errors: state.errors
    }
};

export default withRouter(connect(mapStateToProps)(DashboardMap));