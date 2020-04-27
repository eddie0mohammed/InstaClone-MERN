
import * as actionTypes from '../Actions/ActionTypes';

const initialState = {
    error: ''
}

const errorReducer = (state = initialState, action) => {
    

    switch (action.type){

        case (actionTypes.CLEAR_ERRORS):
            return {
                ...state,
                error: ''
            }

        case (actionTypes.ERROR):
            return {
                ...state,
                error: action.payload
            }
          

        default:
            return state;
    }
}

export default errorReducer;