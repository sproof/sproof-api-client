const constants = {
    'SET_QUERY'                     : 'REGISTRATIONS_SET_QUERY',
    'GET_REGISTRATIONS'             : 'REGISTRATIONS_LOAD',
    'GET_REGISTRATIONS_SUCCESS'     : 'REGISTRATIONS_LOAD_SUCCESS',
    'GET_REGISTRATIONS_FAIL'        : 'REGISTRATIONS_LOAD_FAIL',
};

const defaultState = {
    query: '',
    results: [],
    error: null,
    loading: false
};

export default function registrationsReducer(state = defaultState, action) {
    switch (action.type) {
        case constants.SET_QUERY: return {...state, query: action.data.query};
        case constants.GET_REGISTRATIONS: return { ...state, loading: true , results: []};
        case constants.GET_REGISTRATIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                results: (action.payload.data.result || []),
                error: action.payload.data.error };
        case constants.GET_REGISTRATIONS_FAIL:
            return {
                ...state,
                loading: false,
                results: [],
                error: 'Error while fetching registrations'
        };
        default: return state;
    }
}

export function getRegistrations(query) {
    query = query || '';
    return {
        type: constants.GET_REGISTRATIONS,
        payload: {
            request: {
                url: 'registrations'
            }
        }
    }
}