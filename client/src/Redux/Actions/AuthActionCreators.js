
import axios from 'axios';

import * as actionTypes from './ActionTypes';


export const register = (username, email, password) => async (dispatch) => {

    try{

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = JSON.stringify({username, email, password});

        await axios.post('http://localhost:8080/auth/register', body, config);
        // console.log(res.data);


        dispatch({
            type: actionTypes.REGISTER_SUCCESS,
            // payload: res.data
        });

        return {
            status: 'success'
        }



    }catch(err){
        console.log(err);
        dispatch({
            type: actionTypes.ERROR,
            payload: err.response.data.error
        });
        setTimeout(() => {
            dispatch({
                type: actionTypes.CLEAR_ERRORS
            });
        }, 3000);

        return {
            status: 'fail'
        }
    }
}



export const login = (email, password) => async (dispatch) => {

    try{

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = JSON.stringify({email, password});

        const res = await axios.post('http://localhost:8080/auth/login', body, config);
        // console.log(res.data);

        dispatch({
            type: actionTypes.LOGIN_SUCCESS,
            payload: res.data
        });

        return {
            status: 'success'
        }

    }catch(err){
        console.log(err);
        dispatch({
            type: actionTypes.ERROR,
            payload: err.response.data.error
        });
        setTimeout(() => {
            dispatch({
                type: actionTypes.CLEAR_ERRORS
            });
        }, 3000);

        return {
            status: 'fail'
        }
    }
}


export const logout = () => {
    return {
        type: actionTypes.LOGOUT
    }
}


export const askResetPassword = (email) => async (dispatch) => {
    
    try{
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = JSON.stringify({email});

        await axios.post('http://localhost:8080/auth/request-resetPassword', body, config);

        dispatch({
            type: actionTypes.ASK_RESET_PASSWORD
        });

        return {
            status: 'success'
        }

    }catch(err){
        console.log(err);
        dispatch({
            type: actionTypes.ERROR,
            payload: err.response.data.error
        });
        setTimeout(() => {
            dispatch({
                type: actionTypes.CLEAR_ERRORS
            });
        }, 3000);

        return {
            status: 'fail'
        }
    }
}


export const resetPassword = (password, token) => async (dispatch) => {

    try{
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = JSON.stringify({password});

        await axios.post(`http://localhost:8080/auth/resetPassword/${token}`, body, config);
        // console.log(res.data);

        dispatch({
            type: actionTypes.RESET_PASSWORD_SUCCESS
        });

        return {
            status: 'success'
        }


    }catch(err){
        console.log(err);
        dispatch({
            type: actionTypes.ERROR,
            payload: err.response.data.error
        });
        setTimeout(() => {
            dispatch({
                type: actionTypes.CLEAR_ERRORS
            });
        }, 3000);

        return {
            status: 'fail'
        }
    }
}



export const getUser = () => async (dispatch, getState) => {

    try{

        const token = getState().auth.token;
        if (!token){
            return {
                status: 'fail'
            }
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        }

        const res = await axios.get('http://localhost:8080/auth/getUser', config);
        // console.log(res.data);

        dispatch({
            type: actionTypes.GET_USER,
            payload: res.data
        });

        return {
            status: 'success'
        }


    }catch(err){
        console.log(err);
        dispatch({
            type: actionTypes.ERROR,
            payload: ''
        });
        setTimeout(() => {
            dispatch({
                type: actionTypes.CLEAR_ERRORS
            });
        }, 3000);

        return {
            status: 'fail'
        }

    }
}


export const changeMyPassword = (oldPassword, newPassword) => async (dispatch, getState) => {

    try{

        const token = getState().auth.token;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        }

        const body = JSON.stringify({oldPassword, newPassword});

        await axios.patch('http://localhost:8080/auth/reset-mypassword', body, config);
        // console.log(res.data);

        dispatch({
            type: actionTypes.UPDATE_PASSWORD,
            // payload: res.data
        })



        return {
            status: 'success'
        }

    }catch(err){
        console.log(err.response);
        dispatch({
            type: actionTypes.ERROR,
            payload: err.response.data.error.message
        });
        setTimeout(() => {
            dispatch({
                type: actionTypes.CLEAR_ERRORS
            });
        }, 3000);

        return {
            status: 'fail'
        }
    }
}


export const changeProfilePicture = (img) => async (dispatch, getState) => {

    try{
        const token = getState().auth.token;
        if (!token){
            return {
                status: 'fail'
            }
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        }

        const formData = new FormData();
        if (img){
            formData.append('image', img, img.filename);
        }

        const res = await axios.patch(`http://localhost:8080/auth/changeProfilePic`, formData, config);
        console.log(res);

        dispatch({
            type: actionTypes.CHANGE_PROFILE_PICTURE,
            payload: res.data.data.user
        });

        return {
            status: 'success'
        }
        
    }catch(err){
        console.log(err.response);
        dispatch({
            type: actionTypes.ERROR,
            payload: err.response.data.error.message
        });
        setTimeout(() => {
            dispatch({
                type: actionTypes.CLEAR_ERRORS
            });
        }, 3000);

        return {
            status: 'fail'
        }

    }
}