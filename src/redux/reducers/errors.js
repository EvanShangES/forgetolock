import { GET_ERRORS } from "../actionTypes"

const initialState = {
    status: "",
    message: ""
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            return {
                ...state,
                authentication: action.payload.status,
                userInfo: action.payload.data
            };
        default:
            return state;
    }
}