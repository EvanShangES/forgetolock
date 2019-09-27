import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";
import axios from "axios/index";

import { connect } from "react-redux";
import { loginUser , loggedIn } from "../../actions/authActions";
import PropTypes from "prop-types";
import isEmpty from "is-empty";

class LoginForm extends Component{
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: {},
            validForm: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({errors : {}});

        if(event.target.id === 'email'){
            this.setState({email: event.target.value});
        }else if(event.target.id === 'password'){
            this.setState({password: event.target.value});
        }

        if(this.state.email !== "" && this.state.password !== ""){
            this.setState({validForm: true});
        }else{
            this.setState({validForm: false});
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        console.log(this);

        const userData = {
            email: this.state.email,
            password: this.state.password
        };


        this.props.loginUser(userData);
    }

    componentDidMount(){
        if (this.props.auth) {
            this.props.history.push("/dashboard");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth) {
            this.props.history.push("/dashboard");
        }

        if (nextProps.errors) {
            this.setState({errors : nextProps.errors});
        }
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <div className={'form-group row ' + (this.state.errors.status === 404  ? "invalid-feedback" : "")} style={{marginBottom: 25}}>
                    <div className="col-md-12" style={{padding: 0, visibility: this.state.errors.status === 404 ? 'visible': 'hidden'}}>
                        <p className="help-block" style={{marginBottom: 5, visibility: this.state.errors.status === 404 ? 'visible': 'hidden'}}>{this.state.errors.status === 404 ? this.state.errors.message  : ""}</p>
                    </div>
                    <input id="email" type="email" name="email"
                           className={"form-control " + (this.state.errors.status === 404 ? 'is-invalid' : '' )}
                           value={this.state.email}
                           onChange={this.handleChange}
                           placeholder="Email" style={{height: 50}}
                    />
                </div>
                <div className={'form-group row ' + (this.state.errors.status === 401  ? "invalid-feedback" : "")} style={{marginBottom: 25}}>
                    <div className="col-md-12" style={{padding: 0, visibility: this.state.errors.status === 401 ? 'visible': 'hidden'}}>
                        <p className="help-block" style={{marginBottom: 5, visibility: this.state.errors.status === 401 ? 'visible': 'hidden'}}>{(this.state.errors.status === 401 ? this.state.errors.message : "")}</p>
                    </div>
                    <input id="password" type="password" name="password"
                           className={"form-control " + (this.state.errors.status === 401 ? 'is-invalid' : '' )}
                           value={this.state.password}
                           onChange={this.handleChange}
                           placeholder="Password" style={{height: 50}}
                    />
                </div>
                <div className="form-group row" style={{marginBottom: 25}}>
                    <p style={{width: '100%'}}><a className="pull-right">Forgot your password?</a></p>
                    <button  type="submit" disabled={!this.state.validForm} className="btn btn-primary" style={{width: '100%', height: 50, marginLeft: 0 }}><i className=""></i>Login</button>
                </div>
            </form>
        )
    }
}

LoginForm.propTypes = {
    loginUser: PropTypes.func.isRequired,
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


export default withRouter(connect(mapStateToProps, {loginUser})(LoginForm));