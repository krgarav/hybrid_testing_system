import {
    FETCH_QUESTIONPAPER_SUCCESS,
    ADD_QUESTIONPAPER_SUCCESS,
    UPDATE_QUESTIONPAPER_SUCCESS,
    DELETE_QUESTIONPAPER_SUCCESS,
    QUESTIONPAPER_OPERATION_FAILURE
} from './actionTypes';

const initialState = {
    questionPapers: [],  // This will store an array of questionPaper objects
    error: null   // To handle any errors
};

function questionPapersReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_QUESTIONPAPER_SUCCESS:
            return { questionPapers: action.payload, error: null };

        case ADD_QUESTIONPAPER_SUCCESS:
            // return { questionPapers: [state.questionPapers, action.payload], error: null };
            return { questionPapers: [], error: null };

        case UPDATE_QUESTIONPAPER_SUCCESS:
            // return {
            //     ...state,
            //     questionPapers: state.questionPapers.map(cls =>
            //         cls.id === action.payload.id ? action.payload : cls
            //     ),
            //     error: null
            // };
            return { questionPapers: [], error: null };

        case DELETE_QUESTIONPAPER_SUCCESS:
            // return {
            //     ...state,
            //     questionPapers: state.questionPapers.filter(cls => cls.id !== action.payload),
            //     error: null
            // };
            return { questionPapers: [], error: null };

        case QUESTIONPAPER_OPERATION_FAILURE:
            return { ...state, error: action.payload };

        default:
            return state;
    }
}

export default questionPapersReducer;
