import { SET_CURRENT_USER } from "../actionTypes";
// const empty = require("is-empty");

const initialState = {
    authentication: false,
    userInfo: {}
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                authentication: action.payload.auth,
                userInfo: action.payload.user
            };
        default:
            return state;
    }
}
