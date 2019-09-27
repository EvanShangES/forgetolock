import React, { Component } from 'react';
import styled from 'styled-components';
import {BrowserRouter as Router, Route, Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {createServiceArea} from "../../actions/userActions";
import PropTypes from "prop-types";
import {logout} from "../../actions/authActions";

class NavMenu extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
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
            <nav className="navbar-white" role="navigation" style={{paddingBottom: 0, height: 75, width:'100%'}}>
                <div className="row" style={{height: 'inherit', paddingTop: '5px', width: '100%'}}>
                    <div className="col-sm-4" style={{height: '100%', paddingLeft: 0, paddingRight: 0}}>
                        <div style={{textAlign: 'center'}}>
                            <img width={'auto'} height={60} src={require('../../resources/images/logo.svg')} style={{marginTop: 0}} alt={"LOGO HEREE"}/>
                            {/*<img src="../../resources/images/logo.svg" style="height: 70px;width: auto;padding-bottom: 2px; padding-top: 2px">*/}
                        </div>
                    </div>

                    <div className="col-sm-8" style={{height: '100%', paddingLeft: 0, paddingRight: 0}}>

                        <div className="row" style={{height: 'inherit', marginRight: 0}}>
                            <div className="tabs tabs-style-bar" style={{height: 'inherit'}}>
                                <nav>
                                    {/*style={{width: '100%', height: 50, marginRight: 25 }}><button type="button" className="btn btn-primary" style={{width: '100%', height: 50, marginRight: 25 }}>Login</button></Link>*/}

                                    <ul hidden={this.props.auth} style={{marginRight: 0}}>
                                        <li className="menuTab" ><Link to="/home"><i className="fa fa-home"></i><span>&nbsp;Home</span></Link></li>
                                        <li className="menuTab" ><Link to="/login"><i className="fa fa-sign-in"></i><span>&nbsp;Login</span></Link></li>
                                        <li className="menuTab" ><Link to="/register"><i className="fa fa-user-plus"></i><span>&nbsp;Sign Up</span></Link></li>
                                        {/*<li className="menuTab" ><a className="icon icon-config"><span>Profile</span></a></li>*/}
                                        {/*<li className="menuTab" ><a className="icon"><i className="fa fa-sign-out"></i><span>Logout</span></a></li>*/}
                                    </ul>
                                    <ul hidden={!this.props.auth} style={{marginRight: 0}}>
                                        <li className="menuTab" ><Link to="/dashboard"><i className="fa fa-home"></i><span>&nbsp;Dashboard</span></Link></li>
                                        <li className="menuTab" ><Link to="/serviceAreas"><i className="fa fa-sign-in"></i><span>&nbsp;Service Areas</span></Link></li>
                                        <li className="menuTab" ><Link to="/home" onClick={this.props.logout}><i className="fa fa-user-plus"></i><span>&nbsp;Logout</span></Link></li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

    );}
}


NavMenu.propTypes = {
    auth: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = function(state){
    return {
        auth: state.authenticate.authentication,
        user: state.authenticate.userInfo,
        errors: state.errors
    }
};

export default withRouter(connect(mapStateToProps, {logout})(NavMenu));
