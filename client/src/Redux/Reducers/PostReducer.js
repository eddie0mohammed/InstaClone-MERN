

import * as actionTypes from '../Actions/ActionTypes';


const initialState = {
    posts: [],

}


const postReducer = (state = initialState, action) => {

    switch(action.type){

        case (actionTypes.CREATE_POST):

            return {
                ...state,
                posts: [...state.posts, action.payload]
            }

        case (actionTypes.GET_ALL_POSTS):
            return {
                ...state,
                posts: [...action.payload]
            }

        case (actionTypes.DELETE_POST):
            const filteredPosts = state.posts.filter(elem => elem._id !== action.payload);
            return {
                ...state,
                posts: filteredPosts
            }

        case (actionTypes.UPDATE_POST):
            const currentPosts = [...state.posts];
            const index = currentPosts.findIndex(elem => elem._id === action.payload._id);
            currentPosts[index] = {...action.payload};
            return {
                ...state,
                posts: currentPosts
            }

        case (actionTypes.LIKE):
            const currentPosts1 = [...state.posts];
            const index1 = currentPosts1.findIndex(elem => elem._id === action.payload.postId);
            const currentPost = currentPosts1[index1];
            currentPost.likes = [...currentPost.likes, action.payload.userId]
            currentPosts1[index1] = currentPost;
            // console.log(currentPosts1);
            return {
                ...state,
                posts: currentPosts1
            }

        case (actionTypes.UNLIKE):
            const currentPosts2 = [...state.posts];
            const index2 = currentPosts2.findIndex(elem => elem._id === action.payload.postId);
            const currentPost1 = currentPosts2[index2];
            currentPost1.likes = currentPost1.likes.filter(elem => elem !== action.payload.userId)
            currentPosts2[index2] = currentPost1;
            // console.log(currentPosts2);
            return {
                ...state,
                posts: currentPosts2
            }

        case (actionTypes.ADD_COMMENT):
            const post = state.posts.filter(elem => elem._id === action.payload.postId)[0];
            const postIndex = state.posts.findIndex(elem => elem._id === action.payload.postId);
            post.comments = action.payload.comments;
            const updatedPosts = [...state.posts];
            updatedPosts[postIndex] = post;

            return {
                ...state,
                posts: updatedPosts
            }

        case (actionTypes.REMOVE_COMMENT):
    
                const post1 = state.posts.filter(elem => elem._id === action.payload.postId)[0];
                const postIndex1 = state.posts.findIndex(elem => elem._id === action.payload.postId);
                post1.comments = action.payload.comments;
                const updatedPosts1 = [...state.posts];
                updatedPosts1[postIndex1] = post1;

            return {
                ...state,
                posts: updatedPosts1
            }



        default:    
            return state
    }
}

export default postReducer;