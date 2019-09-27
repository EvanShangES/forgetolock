import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import {BrowserRouter as Router, Route, Link, withRouter} from "react-router-dom";
import Map from "../../maps/Map";
import {loginUser, registerUser} from "../../actions/authActions";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withScriptjs, withGoogleMap, GoogleMap, Marker, Circle} from 'react-google-maps';
import { createServiceArea } from "../../actions/userActions";
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyBRZhF4x6LCA-Icm2TPu7akX4y5C07yP1o");

class ServiceAreas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            areaName: "",
            address: "",
            city: "",
            latLng: {},
            validAddressForm: true,
            validLocationForm: true,
            areaShape: "",
            formStep: "one",
            circleCoords: {},
            circleRadius: 200,
            polyPaths: [],
            polyCenter: {},
        };

        this.child = React.createRef();

        this.setCurrentPosition = this.setCurrentPosition.bind(this);
        this.setAddressPosition = this.setAddressPosition.bind(this);

        this.setAreaShape = this.setAreaShape.bind(this);

        this.prevStep = this.prevStep.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        console.log(this.props);
    }
    componentWillReceiveProps(nextProps) {
        console.log('nextprops');
        console.log(nextProps);
        this.props = nextProps;
        if (nextProps.auth) {
            this.props.history.push("/dashboard");
        }else{
            this.props.history.push("/home");
        }

        if (nextProps.errors) {
            this.setState({errors : nextProps.errors});
        }
    }

    setCurrentPosition(){
        console.log(this);
        this.child.current.getCurrentPosition(function(position){
            console.log("current position");
            console.log(position);
            this.setState({
                latLng: position,
                formStep :  "two"
            });
        }.bind(this));
    }

    setAddressPosition(){
        let address = this.state.address + " " + this.state.city;
        console.log(address);
        this.child.current.getAddressPosition(address, function(position){
            console.log("location position");
            console.log(position);
            this.setState({
                latLng: position,
                formStep :  "two"
            });
        }.bind(this));
    }

    setAreaShape(shape){
        this.child.current.setAreaShape(shape);
    }

    prevStep(){
        this.child.current.refreshMap();
        this.setState({
            formStep :  "one"
        });
    }

    getPolygonPaths(callback){
        this.child.current.getPolygonPaths(function(paths, center){
            this.setState({polyPaths: paths, polyCenter: center});
            callback(paths, center)
        }.bind(this));
    }

    getCircleCoords(callback){
        this.child.current.getCircleCoords(function(coords, radius){
            this.setState({circleCoords: coords, circleRadius: radius});
            callback(coords, radius)
        }.bind(this));
    }

    shouldComponentUpdate(nextProps,nextState) {
        if(this.state.formStep !== nextState.formStep || this.state.areaShape && nextState.areaShape === "circle"){
            return true;
        }
        return false
    }

    handleChange(event) {
        if(event.target.id === 'areaName'){
            this.setState({areaName : event.target.value});
        }
        if(event.target.id === 'address'){
            this.setState({address: event.target.value});
        }
        if(event.target.id === 'city'){
            this.setState({city: event.target.value});
        }

        if(event.target.id === 'radio1' || event.target.id === 'radio2'){
            this.setState({areaShape: event.target.value});
            this.setAreaShape(event.target.value);
        }

        if(event.target.id === 'radius'){
            // console.log(event.target.value);
            this.setState({circleRadius: event.target.value}, function(){
                this.props.setCircleRadius(this.state.circleRadius);
            }.bind(this));
        }
    }

    handleSubmit(event){
        event.preventDefault();
        let areaData = {};
        if(this.state.areaShape === "circle"){
            this.getCircleCoords(function(circleCoords, circleRadius){
                areaData = {
                    areaLabel: this.state.areaName,
                    city: this.state.city,
                    address: this.state.address,
                    areaShape: this.state.areaShape,
                    circleCoords: circleCoords,
                    circleRadius: circleRadius
                }
            }.bind(this));

        }else if(this.state.areaShape === "polygon"){
            this.getPolygonPaths(function(polyPaths, polyCenter){
                console.log("polygon");
                areaData = {
                    areaLabel: this.state.areaName,
                    city: this.state.city,
                    address: this.state.address,
                    areaShape: this.state.areaShape,
                    polyPaths: polyPaths,
                    polyCenter: polyCenter
                }
            }.bind(this));
        }
        console.log(areaData);
        this.props.createServiceArea(areaData, this.props.user._id);
        // console.log(this.areaNameInput.value);
        // this.setState({city: this.areaNameInput.value});
        console.log(this);
    }


    render() {
        // const { errors } = this.state;

        const style = { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '..', height: '..', color: 'black'};

        const Teststyle = styled.div`
            align-content: center;
            background: rgba(255, 255, 255);
            box-shadow: 1px 2px 8px rgba(255, 255, 255, 1);
            // justify-content: center;
            // alignItems: center;
        `;

        return (
            <div id="home_logo" style={style} >
                <Container>
                    <Row className="justify-content-md-center">
                        <Col style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img width={500} src={require('../../resources/images/logo.svg')} style={{marginTop: 50}} alt={"LOGO HEREE"}/>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md="6" >
                            <Teststyle>
                                <Row className="justify-content-center"style={{paddingTop: 50, paddingBottom: 50}} >
                                    <Col md="8">
                                        <Row>
                                            <div>
                                                <h2>New Service Area</h2>
                                            </div>
                                        </Row>
                                        <form onSubmit={this.handleSubmit}>
                                            <div hidden={!(this.state.formStep === "one")}>
                                                <div className={'form-group row '}>
                                                    <input name="areaName" id="areaName" type="text"
                                                           className={"form-control "}
                                                           onChange={this.handleChange}
                                                           // value={this.state.areaName}
                                                           placeholder="Area Label" style={{marginBottom: 0, height: 50}}
                                                    />
                                                </div>
                                                <p>Set From Address</p>
                                                <div className={'form-group row '}>
                                                    <div className="col-md-6" style={{paddingRight: 5, paddingLeft: 0}}>
                                                        <input name="address" id="address" type="text"
                                                               className={"form-control "}
                                                               onChange={this.handleChange}
                                                               // value={this.state.address}
                                                               placeholder="Address" style={{marginBottom: 0, height: 50}}
                                                        />
                                                    </div>
                                                    <div className="col-md-6" style={{paddingLeft: 5, paddingRight: 0}}>
                                                        <input name="city" id="city" type="text"
                                                               className={"form-control "}
                                                               onChange={this.handleChange}
                                                               // value={this.state.city}
                                                               placeholder="City" style={{marginBottom: 0, height: 50}}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row" style={{marginBottom: 25}}>
                                                    <button type="button" disabled={!this.state.validAddressForm} onClick={this.setAddressPosition} className="btn btn-primary" style={{width: '100%', height: 50, marginLeft: 0 }}><i className=""></i>Set Location</button>
                                                </div>
                                                <p>Set From Current Location</p>
                                                <div className="form-group row" style={{marginBottom: 25}}>
                                                    <button type="button" className="btn btn-primary" disabled={!this.state.validLocationForm} onClick={this.setCurrentPosition} style={{width: '100%', height: 50, marginLeft: 0 }}><i className=""></i>Set as Current Location</button>
                                                </div>
                                            </div>

                                            <div hidden={!(this.state.formStep === "two")}>
                                                <h2>Radio Buttons</h2>
                                                <div className="inputGroup row">
                                                    <input  id="radio1" name="radio" type="radio" value={"circle"} onChange={this.handleChange}/>
                                                    <label htmlFor="radio1">Circle</label>
                                                </div>
                                                <div className="inputGroup row">
                                                    <input id="radio2" name="radio" type="radio" value={"polygon"} onChange={this.handleChange}/>
                                                    <label htmlFor="radio2">Polygon</label>
                                                </div>
                                                <div className="form-group row" style={{marginBottom: 25}}>
                                                    <button type="submit" className="btn btn-primary" style={{width: '100%', height: 50, marginLeft: 0 }}><i className=""></i>Save Service Area</button>
                                                    <p style={{width: '100%', paddingTop:'10px'}}><a className="pull-left" onClick={this.prevStep} >&#x2190; Previous Step</a></p>
                                                </div>
                                            </div>
                                        </form>
                                    </Col>
                                </Row>
                            </Teststyle>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md ="6">
                            <div>
                                <Map ref={this.child}/>
                            </div>
                        </Col>

                    </Row>
                </Container>
            </div>
        );
    }
}

// export default ServiceAreas;
//
ServiceAreas.propTypes = {
    auth: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    createServiceArea: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = function(state){
    return {
        auth: state.authenticate.authentication,
        user: state.authenticate.userInfo,
        errors: state.errors
    }
};

export default withRouter(connect(mapStateToProps, {createServiceArea})(ServiceAreas));