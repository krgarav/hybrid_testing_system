import {
    FETCH_LANGUAGE_SUCCESS,
    ADD_LANGUAGE_SUCCESS,
    UPDATE_LANGUAGE_SUCCESS,
    DELETE_LANGUAGE_SUCCESS,
    LANGUAGE_OPERATION_FAILURE
} from './actionTypes';

const initialState = {
    languages: [],  // This will store an array of language objects
    error: null   // To handle any errors
};

function languagesReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_LANGUAGE_SUCCESS:
            return { languages: action.payload, error: null };

        case ADD_LANGUAGE_SUCCESS:
            // return { languages: [state.languages, action.payload], error: null };
            return { languages: [], error: null };

        case UPDATE_LANGUAGE_SUCCESS:
            // return {
            //     ...state,
            //     languages: state.languages.map(cls =>
            //         cls.id === action.payload.id ? action.payload : cls
            //     ),
            //     error: null
            // };
            return { languages: [], error: null };

        case DELETE_LANGUAGE_SUCCESS:
            // return {
            //     ...state,
            //     languages: state.languages.filter(cls => cls.id !== action.payload),
            //     error: null
            // };
            return { languages: [], error: null };

        case LANGUAGE_OPERATION_FAILURE:
            return { ...state, error: action.payload };

        default:
            return state;
    }
}

export default languagesReducer;
