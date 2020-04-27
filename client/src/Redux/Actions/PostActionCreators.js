
import axios from 'axios';

import * as actionTypes from './ActionTypes';


export const createPost = (imageFile, description) => async (dispatch, getState) => {


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
        formData.append('description', description);
        formData.append('image', imageFile);

        const res = await axios.post('http://localhost:8080/post', formData, config);
        // console.log(res.data);

        dispatch({
            type: actionTypes.CREATE_POST,
            payload: res.data.data.post
        })

        return {
            status: 'success'
        }


    }catch(err){
        console.log(err);

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


export const getAllPosts = () => async (dispatch) => {

    try{
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.get('http://localhost:8080/post', config);
        // console.log(res.data);

        dispatch({
            type: actionTypes.GET_ALL_POSTS,
            payload: res.data.data.posts
        });

        return {
            status: 'success'
        }

    }catch(err){
        console.log(err);

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

export const deletePost = (postId) => async (dispatch, getState) => {

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

        await axios.delete(`http://localhost:8080/post/${postId}`, config);

        dispatch({
            type: actionTypes.DELETE_POST,
            payload: postId
        });

        return {
            status: 'success'
        }
        

    }catch(err){
        console.log(err);

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


export const editPost = (imageFile, description, postId) => async (dispatch, getState) => {

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
        };

        const formData = new FormData();
        if (description){
            formData.append('description', description);
        }
        if (imageFile){
            formData.append('image', imageFile);
        }

        const res = await axios.patch(`http://localhost:8080/post/${postId}`, formData, config);
        // console.log(res.data);

        dispatch({
            type: actionTypes.UPDATE_POST,
            payload: res.data.data.post

        })
        return {
            status: 'success'
        }

    }catch(err){
        console.log(err);

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



export const likePost = (postId) => async (dispatch, getState) => {

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

        const body = JSON.stringify({});

        await axios.patch(`http://localhost:8080/post/like/${postId}`, body, config);
        // console.log(res.data);

        dispatch({
            type: actionTypes.LIKE,
            payload: {
                userId: getState().auth.user._id,
                postId: postId
            }
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

export const unlikePost = (postId) => async (dispatch, getState) => {

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

        const body = JSON.stringify({});

        await axios.patch(`http://localhost:8080/post/unlike/${postId}`, body, config);
        // console.log(res.data);

        dispatch({
            type: actionTypes.UNLIKE,
            payload: {
                userId: getState().auth.user._id,
                postId: postId
            }
        })

        return {
            status: 'success'
        }
        

    }catch(err){
        // console.log(err)
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

export const addComment = (comment, postId, username) => async (dispatch, getState) => {

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

        const body = JSON.stringify({comment, username});

        const res = await axios.patch(`http://localhost:8080/post/addcomment/${postId}`, body, config);
        // console.log(res.data);

        dispatch({
            type: actionTypes.ADD_COMMENT,
            payload: {
                comments: res.data.data.post.comments,
                postId: postId
            }
        });
        
        return {
            status: 'success'
        }


    }catch(err){
        console.log(err);

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



export const removeComment = (index, postId) => async (dispatch, getState) => {

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

        const body = JSON.stringify({key: index});
        const res = await axios.patch(`http://localhost:8080/post/removecomment/${postId}`, body, config);
        // console.log(res.data);

        dispatch({
            type: actionTypes.REMOVE_COMMENT,
            payload: {
                comments: res.data.data.post.comments,
                postId: postId
            }
        });
        
        return {
            status: 'success'
        }

    }catch(err){
        console.log(err);

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