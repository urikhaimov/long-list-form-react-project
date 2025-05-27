
export function localReducer(state, action) {
    switch (action.type) {
        case 'SET_ORIGINAL':
            return { ...state, originalData: action.payload };
        case 'SET_JUST_SAVED':
            return { ...state, justSaved: action.payload };
        default:
            return state;
    }
}