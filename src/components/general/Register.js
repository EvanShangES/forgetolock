import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import RegisterForm from "../forms/RegisterForm";

class Register extends Component {
    render() {
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
                                    <Col md="8" >
                                        <Row>
                                            <div>
                                                <h2>Get Started!</h2>
                                                <br/>
                                                <h4>Never forget to lock your door ever again.</h4>
                                                <br/>
                                            </div>
                                        </Row>
                                        <RegisterForm/>
                                        <div style={{textAlign: 'center'}}>
                                            <p>Already have an account?<span> </span>
                                                <Link to="/login" style={{textDecoration: 'underline'}}>Log In here</Link>
                                            </p>
                                            <button onClick={this.onClick}>
                                                Click me
                                            </button>
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

export default Register;
