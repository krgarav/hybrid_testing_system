import {
    FETCH_QUESTION_SUCCESS,
    ADD_QUESTION_SUCCESS,
    UPDATE_QUESTION_SUCCESS,
    DELETE_QUESTION_SUCCESS,
    QUESTION_OPERATION_FAILURE
} from './actionTypes';

const initialState = {
    questions: [],  // This will store an array of question objects
    error: null   // To handle any errors
};

function questionsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_QUESTION_SUCCESS:
            return { questions: action.payload, error: null };

        case ADD_QUESTION_SUCCESS:
            // return { questions: [state.questions, action.payload], error: null };
            return { questions: [], error: null };

        case UPDATE_QUESTION_SUCCESS:
            // return {
            //     ...state,
            //     questions: state.questions.map(cls =>
            //         cls.id === action.payload.id ? action.payload : cls
            //     ),
            //     error: null
            // };
            return { ...state, error: null };

        case DELETE_QUESTION_SUCCESS:
            // return {
            //     ...state,
            //     questions: state.questions.filter(cls => cls.id !== action.payload),
            //     error: null
            // };
            return { questions: [], error: null };

        case QUESTION_OPERATION_FAILURE:
            return { ...state, error: action.payload };

        default:
            return state;
    }
}

export default questionsReducer;
