import {
    FETCH_SUBSECTION_SUCCESS,
    ADD_SUBSECTION_SUCCESS,
    UPDATE_SUBSECTION_SUCCESS,
    DELETE_SUBSECTION_SUCCESS,
    SUBSECTION_OPERATION_FAILURE
} from './actionTypes';

const initialState = {
    subSections: [],  // This will store an array of subSection objects
    error: null   // To handle any errors
};

function subSectionsReducer(state = initialState, action) {

    switch (action.type) {
        case FETCH_SUBSECTION_SUCCESS:
            return { subSections: action.payload, error: null };
        case ADD_SUBSECTION_SUCCESS:
            // return { subSections: [state.subSections, action.payload], error: null };
            return { subSections: [], error: null };

        case UPDATE_SUBSECTION_SUCCESS:
            // return {
            //     ...state,
            //     subSections: state.subSections.map(cls =>
            //         cls.id === action.payload.id ? action.payload : cls
            //     ),
            //     error: null
            // };
            return { subSections: [], error: null };

        case DELETE_SUBSECTION_SUCCESS:
            // return {
            //     ...state,
            //     subSections: state.subSections.filter(cls => cls.id !== action.payload),
            //     error: null
            // };
            return { subSections: [], error: null };

        case SUBSECTION_OPERATION_FAILURE:
            return { ...state, error: action.payload };

        default:
            return state;
    }
}

export default subSectionsReducer;
