import {
    FETCH_SECTION_SUCCESS,
    ADD_SECTION_SUCCESS,
    UPDATE_SECTION_SUCCESS,
    DELETE_SECTION_SUCCESS,
    SECTION_OPERATION_FAILURE
} from './actionTypes';

const initialState = {
    sections: [],  // This will store an array of section objects
    error: null   // To handle any errors
};

function sectionsReducer(state = initialState, action) {

    switch (action.type) {
        case FETCH_SECTION_SUCCESS:
            return { sections: action.payload, error: null };
        case ADD_SECTION_SUCCESS:
            // return { sections: [state.sections, action.payload], error: null };
            return { sections: [], error: null };

        case UPDATE_SECTION_SUCCESS:
            // return {
            //     ...state,
            //     sections: state.sections.map(cls =>
            //         cls.id === action.payload.id ? action.payload : cls
            //     ),
            //     error: null
            // };
            return { sections: [], error: null };

        case DELETE_SECTION_SUCCESS:
            // return {
            //     ...state,
            //     sections: state.sections.filter(cls => cls.id !== action.payload),
            //     error: null
            // };
            return { sections: [], error: null };

        case SECTION_OPERATION_FAILURE:
            return { ...state, error: action.payload };

        default:
            return state;
    }
}

export default sectionsReducer;
