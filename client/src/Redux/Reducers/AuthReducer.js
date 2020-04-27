
import * as actionTypes from '../Actions/ActionTypes';

const initialState = {
    user: null,
    isAuthenticated: localStorage.getItem('token') ? true : false,
    token: localStorage.getItem('token'),
    requestResetPassword: false,

}

const authReducer = (state = initialState, action) => {

    switch (action.type){

        case (actionTypes.REGISTER_SUCCESS):
            return {
                ...state
            }

        case (actionTypes.LOGIN_SUCCESS):
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.data.user,
                token: action.payload.token
            }

        case (actionTypes.LOGOUT):
            localStorage.removeItem('token');
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null
                
            }

        case (actionTypes.ASK_RESET_PASSWORD):
            return {
                ...state,
                requestResetPassword: true
            }

        case (actionTypes.RESET_PASSWORD_SUCCESS):
            return {
                ...state,
                requestResetPassword: false
            }

        case (actionTypes.GET_USER):
            return {
                ...state,
                user: action.payload.data.user
            }

        case (actionTypes.CHANGE_PROFILE_PICTURE):
            return {
                ...state,
                user: action.payload
            }

        default:
            return state
    }
}

export default authReducer;