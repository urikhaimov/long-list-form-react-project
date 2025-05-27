export function localReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_DEBOUNCED_SEARCH_TERM':
      return { ...state, debouncedSearchTerm: action.payload };
    case 'SET_LIST_WIDTH':
      return { ...state, listWidth: action.payload };
    case 'TOGGLE_MODAL':
      return { ...state, isModalOpen: action.payload };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_SCROLL_TOP':
      return { ...state, showScrollTop: action.payload };
    case 'SET_SAVE_SUCCESS':
      return { ...state, saveSuccess: action.payload };
    default:
      return state;
  }
}
