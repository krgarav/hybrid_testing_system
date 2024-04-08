import {
    FETCH_USER_SUCCESS,
    ADD_USER_SUCCESS,
    UPDATE_USER_SUCCESS,
    DELETE_USER_SUCCESS,
    USER_OPERATION_FAILURE
} from './actionTypes';

const initialState = {
    users: [],  // This will store an array of user objects
    error: null   // To handle any errors
};

function userReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER_SUCCESS:
            return { users: action.payload, error: null };

        case ADD_USER_SUCCESS:
            // return { users: [state.users, action.payload], error: null };
            return { users: [], error: null };

        case UPDATE_USER_SUCCESS:
            // return {
            //     ...state,
            //     users: state.users.map(cls =>
            //         cls.id === action.payload.id ? action.payload : cls
            //     ),
            //     error: null
            // };
            return { users: [], error: null };

        case DELETE_USER_SUCCESS:
            // return {
            //     ...state,
            //     users: state.users.filter(cls => cls.id !== action.payload),
            //     error: null
            // };
            return { users: [], error: null };

        case USER_OPERATION_FAILURE:
            return { ...state, error: action.payload };

        default:
            return state;
    }
}

export default userReducer;
