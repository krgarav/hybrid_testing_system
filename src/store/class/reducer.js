import {
    FETCH_CLASS_SUCCESS,
    ADD_CLASS_SUCCESS,
    UPDATE_CLASS_SUCCESS,
    DELETE_CLASS_SUCCESS,
    CLASS_OPERATION_FAILURE
} from './actionTypes';

const initialState = {
    classes: [],  // This will store an array of class objects
    classAdd: false,
    error: null   // To handle any errors
};

function classesReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CLASS_SUCCESS:
            return { classes: action.payload, error: null };

        case ADD_CLASS_SUCCESS:
            console.log("class add hiu")
            // state.classAdd = true;
            return { classes: [], classAdd: true, error: null };

        case UPDATE_CLASS_SUCCESS:
            // return {
            //     ...state,
            //     classes: state.classes.map(cls =>
            //         cls.id === action.payload.id ? action.payload : cls
            //     ),
            //     error: null
            // };
            return { classes: [], error: null };

        case DELETE_CLASS_SUCCESS:
            // return {
            //     ...state,
            //     classes: state.classes.filter(cls => cls.id !== action.payload),
            //     error: null
            // };
            return { classes: [], error: null };

        case CLASS_OPERATION_FAILURE:
            return { ...state, error: action.payload };

        default:
            return state;
    }
}

export default classesReducer;
