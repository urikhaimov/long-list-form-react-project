export function localReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_DEBOUNCED_SEARCH_TERM':
      return { ...state, debouncedSearchTerm: action.payload };
    case 'SET_LIST_WIDTH':
      return { ...state, listWidth: action.payload };
    case 'CLEAR_STATE':
      return {
        ...state,
        searchTerm: '',
        debouncedSearchTerm: '',
        listWidth: 0,
      };
    default:
      return state;
  }
}
