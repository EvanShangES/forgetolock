import React, { Component } from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Link, withRouter} from "react-router-dom";
import {registerUser} from "../../actions/authActions";
import PropTypes from "prop-types";
import {connect} from "react-redux";

class RegisterForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
            errors: {},
            validForm: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.formValidator= this.formValidator.bind(this);
    }

    componentDidMount() {
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

    checkEmail(email, callback){
        axios.get('/userApi/email/' + email)
            .then(function (response) {
                callback(response.data);
            })
            .catch(function (error) {
                console.log("error: " + error);
            })
            .finally(function () {
            });
    };

    handleSubmit(event) {
        event.preventDefault();
        const userData = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phone: this.state.phone,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.password,
        };

        this.props.registerUser(userData);
    }

    // front end custom input validators
    handleChange(event) {
        let inputName = event.target.name;

        if(event.target.id === 'initFirstName'){
            this.setState({firstName: event.target.value}, function() {
                this.formValidator(inputName);
            });
        }
        if(event.target.id === 'initLastName'){
            this.setState({lastName: event.target.value}, function() {
                this.formValidator(inputName);
            });
        }
        if(event.target.id === 'initPhone'){
            const x = event.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            event.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            this.setState({phone: event.target.value}, function(){
                this.formValidator(inputName);
            });
        }
        if(event.target.id === 'initEmail')
            this.setState({email: event.target.value}, function(){
                this.formValidator(inputName);
            });
        if(event.target.id === 'initPass')
            this.setState({password: event.target.value}, function(){
                this.formValidator(inputName);
            });
        if(event.target.id === 'initPassConfirm')
            this.setState({confirmPassword: event.target.value}, function(){
                this.formValidator(inputName);
            });
    }

    formValidator(inputName){
        let fieldData = this.state[inputName];
        let errors = this.state.errors;

        console.log("data: " +  fieldData);

        if(inputName === 'firstName') {
            if (typeof fieldData === 'undefined' || fieldData === '')
                errors[inputName] = "Your full name is required.";
            else
                delete errors[inputName];
        }

        if(inputName === 'lastName') {
            if (typeof fieldData === 'undefined' || fieldData === '')
                errors[inputName] = "Your full name is required.";
            else
                delete errors[inputName];
        }

        if(inputName === 'phone') {
            if (fieldData.length < 14 || fieldData === '')
                errors[inputName] = "Please enter a valid 10-digit number.";
            else
                delete errors[inputName];
        }

        if(inputName === 'email'){
            console.log(fieldData);
            const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if(fieldData !== ''){
                if(pattern.test(String(fieldData).toLowerCase())){
                    delete errors[inputName];

                    this.checkEmail(fieldData, function(response){
                        console.log(response);
                        if(response.status === 200){
                            delete errors[inputName];
                        }else{
                            errors[inputName] = "duplicate";
                            this.setState({errors: errors});
                        }
                    }.bind(this));

                    console.log(this.state.errors);
                }else{
                    errors[inputName] =  "Email is invalid, please enter a valid email.";
                    console.log(errors[inputName]);
                }
            }

        }

        if(inputName === 'password'){
            const pattern = {
                charLength: function() {
                    if(fieldData.length >= 8 ) {
                        return true;
                    }
                },
                lowercase: function() {
                    let regex = /^(?=.*[a-z]).+$/;

                    if( regex.test(fieldData) ) {
                        return true;
                    }
                },
                uppercase: function() {
                    let regex = /^(?=.*[A-Z]).+$/;

                    if( regex.test(fieldData) ) {
                        return true;
                    }
                },
                special: function() {
                    let regex = /^(?=.*[0-9_\W]).+$/;

                    if( regex.test(fieldData) ) {
                        return true;
                    }
                }
            };

            let charLen = pattern.charLength();
            let lowercase = pattern.lowercase();
            let uppercase = pattern.uppercase();
            let special = pattern.special();

            if(charLen && lowercase && uppercase && special){
                delete errors[inputName];
            }else{
                errors[inputName] = "Invalid password, does not meet criteria.";
            }
        }

        if(inputName === 'confirmPassword'){
            if(fieldData === this.state.password && fieldData !== "")
                delete errors[inputName];
            else
                errors[inputName] = "Your passwords do not match.";
        }

        if(this.state.firstName !== "" && this.state.lastName !== "" && this.state.phone !== "" && this.state.email !== "" && this.state.password !== "" && this.state.confirmPassword !== ""){
            // this.setState({validForm: true});
            console.log("heelo");
            console.log(this.state);

            if(Object.entries(this.state.errors).length === 0 && this.state.errors.constructor === Object){
                this.setState({validForm: true});
            }

            this.setState({errors: errors});
            // if(this.state.errors === {}){
            //     console.log(this.state + "in if");
            // }
        }else{
            this.setState({validForm: false});
            this.setState({errors: errors});
            console.log(errors);

        }
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit} noValidate name="signupForm">
                <div className={'form-group row ' + (this.state.errors.firstName || this.state.errors.lastName  ? "invalid-feedback" : "") } style={{marginBottom: 25}}>
                    <div className="col-md-12" style={{padding: 0, visibility: this.state.errors.firstName || this.state.errors.lastName ? 'visible': 'hidden'}}>
                        <p className="help-block"  style={{marginBottom: 5}}>
                            {(this.state.errors.firstName ? this.state.errors.firstName : "") || (this.state.errors.lastName ? this.state.errors.lastName : "")}
                        </p>
                    </div>
                    <div className="col-md-6" style={{paddingRight: 5, paddingLeft: 0}}>
                        <input name="firstName" id="initFirstName" type="text"
                               className={"form-control " + (this.state.errors.firstName  ? 'is-invalid' : '' ) + (this.state.firstName !== "" ? "is-valid" : "")}
                               value={this.state.firstName}
                               onChange={this.handleChange}
                               placeholder="First Name" style={{marginBottom: 0, height: 50}}
                        />
                    </div>
                    <div className="col-md-6" style={{paddingLeft: 5, paddingRight: 0}}>
                        <input name="lastName" id="initLastName" type="text"
                               className={"form-control " + (this.state.errors.lastName  ? 'is-invalid' : '' ) + (this.state.lastName !== "" ? "is-valid" : "")}
                               value={this.state.lastName}
                               onChange={this.handleChange}
                               placeholder="Last Name" style={{marginBottom: 0, height: 50}}
                        />
                    </div>
                </div>
                <div className={'form-group row ' + (this.state.errors.phone  ? "invalid-feedback" : "")} style={{marginBottom: 25}}>
                    <div className="col-md-12" style={{padding: 0, visibility: this.state.errors.phone ? 'visible': 'hidden'}}>
                        <p className="help-block"  style={{marginBottom: 5}}>{(this.state.errors.phone ? this.state.errors.phone : "")}</p>
                    </div>
                    <div className="input-group" style={{height: 50}}>
                        <div className="input-group-prepend">
                            <div className="input-group-text" style={{height: 50, width: 50}}>+1</div>
                        </div>
                        <input id="initPhone" name="phone" type="tel" value={this.state.phone}
                               onChange={this.handleChange} className={"form-control " + (this.state.errors.phone  ? 'is-invalid' : '' ) + (this.state.phone.length === 14 ? "is-valid" : "")}
                               placeholder="Phone" style={{height: 50}}/>
                    </div>
                </div>
                <div className={'form-group row ' + (this.state.errors.email  ? "invalid-feedback" : "")} style={{marginBottom: 25}}>
                    <div className="col-md-12" style={{padding: 0, visibility: this.state.errors.email ? 'visible': 'hidden'}}>
                        <p className="help-block" style={{marginBottom: 5, visibility: this.state.errors.email ? 'visible': 'hidden'}}>{this.state.errors.email === "duplicate" ? <span>This email exists, please <Link to='/home' style={{textDecoration: 'underline'}}>Log In here</Link></span> : this.state.errors.email}
                        </p>
                    </div>
                    {/*<p ng-show="signupForm.email.$error.duplicate && !signupForm.email.$pristine" className="help-block" style="margin-bottom: 5px">This email exists, please <a ui-sref="home.login">Login</a></p>*/}
                    {/*<p ng-show="signupForm.email.$error.valid && !signupForm.email.$error.duplicate && !signupForm.email.$pristine" className="help-block" style="margin-bottom: 5px">Email is invalid, please enter a valid email.</p>*/}
                    <input id="initEmail" type="email" name="email"
                           className={"form-control " + (this.state.errors.email ? 'is-invalid' : '' ) + (!this.state.errors.email && this.state.email !== '' ? "is-valid" : "")}
                           value={this.state.email}
                           onChange={this.handleChange}
                           placeholder="Email" style={{height: 50}}
                    />
                </div>

                <div className={'form-group row ' + (this.state.errors.password  ? "invalid-feedback" : "")} style={{marginBottom: 25}}>
                    <div className="col-md-12" style={{padding: 0, visibility: this.state.errors.password ? 'visible': 'hidden'}}>
                        <p className="help-block" style={{marginBottom: 5, visibility: this.state.errors.password ? 'visible': 'hidden'}}>{(this.state.errors.password ? this.state.errors.password : "")}</p>
                    </div>
                    <div className="input-group" style={{height: 50}}>
                        <div className="input-group-prepend">
                            <div className="input-group-text" style={{fontFamily: 'FontAwesome', height: 50, width: 50}} data-toggle="tooltip" title="Password must be more than 7 characters containing a lowercase letter, an uppercase letter and a number or special character"><i className="fa-key"></i></div>
                        </div>
                        <input id="initPass" type="password" name="password"
                               className={"form-control " + (this.state.errors.password ? 'is-invalid' : '' ) + (!this.state.errors.password && this.state.password !== "" ? "is-valid" : "")}
                               value={this.state.password}
                               onChange={this.handleChange}
                               placeholder="Password" style={{height: 50}}
                        />
                    </div>

                </div>

                <div className={'form-group row ' + (this.state.errors.confirmPassword  ? "invalid-feedback" : "")} style={{marginBottom: 25}}>
                    <div className="col-md-12" style={{padding: 0, visibility: this.state.errors.confirmPassword ? 'visible': 'hidden'}}>
                        <p className="help-block" style={{marginBottom: 5, visibility: this.state.errors.confirmPassword ? 'visible': 'hidden'}}>{(this.state.errors.confirmPassword ? this.state.errors.confirmPassword : "")}</p>
                    </div>
                    <input id="initPassConfirm" type="password" name="confirmPassword"
                           className={"form-control " + (this.state.errors.confirmPassword ? 'is-invalid' : '' ) + (!this.state.errors.confirmPassword && this.state.confirmPassword !== "" ? "is-valid" : "")}
                           value={this.state.confirmPassword}
                           onChange={this.handleChange}
                           placeholder="Confirm Password" style={{height: 50}}
                    />
                </div>

                <div className="form-group row" style={{marginBottom: 25}}>
                    <button  type="submit" disabled={!this.state.validForm} className="btn btn-primary" style={{width: '100%', height: 50, marginLeft: 0 }}><i className=""></i>Sign Up!</button>
                </div>
            </form>
        )
    }
}

RegisterForm.propTypes = {
    registerUser: PropTypes.func.isRequired,
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

export default withRouter(connect(mapStateToProps, {registerUser})(RegisterForm));
