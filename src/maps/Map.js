import React, { Component } from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker, Circle, Polygon} from 'react-google-maps';
import Geocode from "react-geocode";

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
            console.log(this);
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



class Map extends Component {
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
            polyCenter: {lat: 40.756795, lng: -73.954298}
        };

        this.circle = React.createRef();

        this.refreshMap = this.refreshMap.bind(this);

        this.getCurrentPosition = this.getCurrentPosition.bind(this);
        this.getAddressPosition = this.getAddressPosition.bind(this);

        this.setAreaShape = this.setAreaShape.bind(this);
        this.setCircleRadius = this.setCircleRadius.bind(this);

        this.radiusChanged = this.radiusChanged.bind(this);
        this.dragEndCircle = this.dragEndCircle.bind(this);
        this.dragEndPolygon = this.dragEndPolygon.bind(this);

        this.getPolygonPaths = this.getPolygonPaths.bind(this);
        this.getCircleCoords = this.getCircleCoords.bind(this);

        // this.state = {
        //     stores: [{lat: 47.49855629475769, lng: -122.14184416996333},
        //         {latitude: 47.359423, longitude: -122.021071},
        //         {latitude: 47.2052192687988, longitude: -121.988426208496},
        //         {latitude: 47.6307081, longitude: -122.1434325},
        //         {latitude: 47.3084488, longitude: -122.2140121},
        //         {latitude: 47.5524695, longitude: -122.0425407}]
        // }
    }

    //map can't be always updating when dragging polygon or circle
    shouldComponentUpdate(nextProps,nextState) {
        if(this.state.currentCoords !== nextState.currentCoords || this.state.areaShape !== nextState.areaShape){
            return true;
        }
        return false
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

    getCurrentPosition(callback) {
        currentPosition(function(position){
            this.setState({
                currentCoords: position,
                currentMarker: true,
                currentZoom: 17,
                circleCoords: position
            });
            callback(position);
        }.bind(this));
    }

    getAddressPosition(address, callback) {
        addressGeocode(address, function(position){
            this.setState({
                currentCoords: position,
                currentMarker: true,
                currentZoom: 17,
                circleCoords: position
            });
            callback(position);
        }.bind(this));
    }

    radiusChanged(e){
        // console.log('wtf');
        // console.log(e);
        console.log(this.refCircle.getRadius());
        this.setState({
            circleRadius: this.refCircle.getRadius()
        });
    }

    dragEndCircle(e){
        this.setState({
            circleCoords: {
                lat : e.latLng.lat(),
                lng : e.latLng.lng()
            }
        });

        // this.props.dragEndCircle(e);
        //
        // console.log(paths);
        console.log(e.latLng.lat());
        console.log(e.latLng.lng());
    };

    dragEndPolygon(){
        let pathArray = this.ref.getPath().getArray();
        let paths = [];
        let polygon = [];
        for(let i = 0; i < pathArray.length; i++){
            paths.push({
                lat: pathArray[i].lat(),
                lng: pathArray[i].lng()
            });

            polygon.push({
                "x": pathArray[i].lat(),
                "y": pathArray[i].lng()
            })
            // console.log(paths[i]);
        }
        this.setState({polyCoords: paths});
        let region = new Region(polygon);
        console.log(region.centroid());
        this.setState({polyCoords: paths, polyCenter: {lat: region.centroid().x, lng: region.centroid().y}});

        //
        // let polygon = [
        //         {"x": -1.2, "y": 5.1},
        //         {"x": -1.3, "y": 5.2},
        //         {"x": -1.8, "y": 5.9},
        //         {"x": -1.9, "y": 5.8}
        //     ],
        //
        // let lat = e.latLng.lat();
        // let lng = e.latLng.lng();
        //
        // this.props.dragFunc();
        //
        console.log(paths);
        // console.log(lat);
        // console.log(lng);
    }

    getPolygonPaths(callback){
        callback(this.state.polyCoords, this.state.polyCenter);
    }

    getCircleCoords(callback){
        console.log(this.state.circleCoords);
        callback(this.state.circleCoords, this.state.circleRadius);
    }



    setLocation(position){
        this.setState({
            currentCoords: position,
            currentMarker: true,
            currentZoom: 17,
            circleCoords: position
        });
    }

    setAreaShape(shape){
        console.log(shape);
        this.setState({areaShape: shape});
        if(shape === 'polygon'){
            let coords = [
                {lat: this.state.currentCoords.lat - 0.00100, lng: this.state.currentCoords.lng + 0.0015},
                {lat: this.state.currentCoords.lat - 0.00100, lng: this.state.currentCoords.lng - 0.0015},
                {lat: this.state.currentCoords.lat + 0.00100, lng: this.state.currentCoords.lng - 0.0015},
                {lat: this.state.currentCoords.lat + 0.00100, lng: this.state.currentCoords.lng + 0.0015},
            ];
            this.setState({polyCoords: coords});
        }else{
            let coords = this.state.currentCoords;
            this.setState({circleCoords: coords})
        }

        // if(shape === "circle"){
        // }else if(shape === "polygon"){
        //
        // }
    }
    setCircleRadius(radius){
        this.setState({circleRadius: Number(radius)});

        // if(shape === "circle"){
        // }else if(shape === "polygon"){
        //
        // }
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
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div id={'map_canvas'} style={{ height: `100%` }}/>}
            />
        );
    }
}
export default Map;