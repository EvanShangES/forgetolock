import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from "axios/index";
// import Signup from './signup';
import NavMenu from "../layout/NavMenu";

class Home extends Component {
    render() {
        // const { errors } = this.state;

        const style = { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '..', height: '..', color: 'black', paddingTop: '100px'};

        const Teststyle = styled.div`
            align-content: center;
            background: rgba(255, 255, 255);
            box-shadow: 1px 2px 8px rgba(255, 255, 255, 1);
            vertical-align: center
            // justify-content: center;
            // alignItems: center;
        `;
        return (
            <div id="home_logo" style={style}>
                <Container>
                    <Row className="justify-content-md-center">
                        <Col style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img width={500} src={require('../../resources/images/logo.svg')} style={{marginTop: 50}} alt={"LOGO HEREE"}/>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md="10" >
                            <Teststyle>
                                <Row className="justify-content-center"style={{paddingTop: 50, paddingBottom: 50}} >
                                    <Col md="10">
                                        <Row className="justify-content-center">
                                            <div>
                                                <h2>React Geo-Fencing & Geo-Location App!</h2>
                                                <ul>
                                                    <li>Login or Register your account</li>
                                                    <li>Set up Service Area(s)</li>
                                                    <li>Application will notify you once you enter or leave an area</li>
                                                </ul>
                                            </div>
                                        </Row>
                                        <div style={{textAlign: 'center', paddingTop: 25}}>
                                            <div className="btn-group" style={{width: "450px"}}>
                                                <Link to="/login" style={{width: '100%', height: 50, marginRight: 25 }}><button type="button" className="btn btn-primary" style={{width: '100%', height: 50, marginRight: 25 }}>Login</button></Link>
                                                <Link to="/register"style={{width: '100%', height: 50, marginLeft: 25 }}><button type="button" className="btn btn-primary" style={{width: '100%', height: 50, marginLeft: 25 }}>Sign up</button></Link>
                                            </div>
                                        </div>
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

export default Home;
