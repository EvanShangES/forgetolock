import axios from "axios";
import {SET_CURRENT_USER, GET_ERRORS} from "../redux/actionTypes";

export const createServiceArea = (areaData, userId)=> dispatch =>{
    console.log(areaData);
    console.log(userId);
    axios.post('/userApi/'+userId+'/serviceArea/create', areaData)
        .then(function (response) {
            // handle success
            console.log(response);
            // return response.data;
            // dispatch(setCurrentUser(response));
        })
        .catch(function (error) {
            // handle error
            console.log(error.response);
            // dispatch({
            //     type: GET_ERRORS,
            //     payload: {
            //         status: error.response.status,
            //         message: error.response.data
            //     }
            // })
        })
        .finally(function () {
            // always executed
        });
};
