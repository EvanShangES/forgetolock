import axios from "axios";
import {SET_CURRENT_USER, GET_ERRORS} from "../redux/actionTypes";

export const registerUser = userData => dispatch =>{
    axios.post('/userApi/register', userData)
        .then(function (response) {
            // handle success
            console.log(response);
            // return response.data;
            dispatch(setCurrentUser(response));
        })
        .catch(function (error) {
            // handle error
            console.log(error.response);
            dispatch({
                type: GET_ERRORS,
                payload: {
                    status: error.response.status,
                    message: error.response.data
                }
            })
        })
        .finally(function () {
            // always executed
        });
};


export const loginUser = userData => dispatch =>{
    axios.post('/userApi/login', userData)
        .then(function (response) {
            // handle success
            console.log(response);
            // return response.data;
            dispatch(setCurrentUser(response));
        })
        .catch(function (error) {
            // handle error
            console.log(error.response);
            dispatch({
                type: GET_ERRORS,
                payload: {
                    status: error.response.status,
                    message: error.response.data
                }
            })
        })
        .finally(function () {
            // always executed
        });
};

export function loggedIn(callback){
    axios.get('/userApi/loggedIn')
        .then(function (response) {
            // handle success
            // console.log(response);
            callback(response);
            // return response.data;
            // dispatch(setCurrentUser(response));
        })
        .catch(function (error) {
            // handle error
            // console.log(error.response);
            callback(error.response);
            // dispatch(getErrors(error));
        })
        .finally(function () {
            // always executed
        });
}

export const logout = () => dispatch => {
    axios.get('/userApi/logout')
        .then(function (response) {
            dispatch(setCurrentUser(response));
        })
        .catch(function (error) {
            // handle error
            console.log(error.response);
            // callback(error.response);
            dispatch(getErrors(error));
        })
        .finally(function () {
            // always executed
        });
};


export const setCurrentUser = response => {
    return {
        type: SET_CURRENT_USER,
        payload: {
            auth: response.data.auth,
            user: response.data.user
        }
    };
};

export const getErrors = response => {
    return {
        type: GET_ERRORS,
        payload: {
            status: response.status,
            message: response.data
        }
    };
};
