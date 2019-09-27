import { combineReducers } from "redux";
import authenticate from "./authenticate";
import errors from "./errors"

export default combineReducers({ authenticate, errors});
