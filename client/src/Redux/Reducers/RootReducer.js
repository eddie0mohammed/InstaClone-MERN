

import {combineReducers} from 'redux';

import authReducer from './AuthReducer';
import errorReducer from './ErrorReducer';
import postReducer from './PostReducer';


const rootReducer = combineReducers({

    auth: authReducer,
    error: errorReducer,
    post: postReducer,

});

export default rootReducer;