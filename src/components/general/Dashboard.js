import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import {BrowserRouter as Router, Route, Link, withRouter} from "react-router-dom";
import DashboardMap from "../../maps/DashboardMap";
import {registerUser} from "../../actions/authActions";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withScriptjs, withGoogleMap, GoogleMap, Marker, Circle} from 'react-google-maps';
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyBRZhF4x6LCA-Icm2TPu7akX4y5C07yP1o");

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLoc: {lat: 40.756795, lng: -73.954298},
            currentMarker: false,
            currentZoom: 13,
            areaName: "",
            address: "",
            city: "",
        };

        // this.getLocation = this.getLocation.bind(this);

        this.child = React.createRef();
        //
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    shouldComponentUpdate(nextProps,nextState) {
        return false
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.auth) {
            this.props.history.push("/home");
        }

        if (nextProps.errors) {
            this.setState({errors : nextProps.errors});
        }
    }

    handleChange(event) {
    }

    handleSubmit(event){
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
                    <Row className="justify-content-center">
                        <Col md="10" >
                            <Teststyle>
                                <Row className="justify-content-center"style={{paddingTop: 50, paddingBottom: 50}} >
                                    <Col md="12">
                                        <DashboardMap ref={this.child} dragEndCircle={this.dragOnEndCircle} dragEndPolygon={this.dragOnEndPolygon}/>
                                    </Col>
                                </Row>
                            </Teststyle>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

// export default Dashboard;

Dashboard.propTypes = {
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

export default withRouter(connect(mapStateToProps)(Dashboard));