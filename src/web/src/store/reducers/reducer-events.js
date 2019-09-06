const constants = {
    'SET_QUERY'               : 'EVENTS_SET_QUERY',
    'GET_EVENTS'              : 'EVENTS_LOAD',
    'GET_EVENTS_SUCCESS'      : 'EVENTS_LOAD_SUCCESS',
    'GET_EVENTS_FAIL'         : 'EVENTS_LOAD_FAIL',
};

const defaultState = {
    query: '',
    results: [],
    error: null,
    loading: false
};

export default function eventsReducer(state = defaultState, action) {
    switch (action.type) {
        case constants.SET_QUERY: return {...state, query: action.data.query};
        case constants.GET_EVENTS: return { ...state, loading: true , results: []};
        case constants.GET_EVENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                results: (action.payload.data.result || []),
                error: action.payload.data.error };
        case constants.GET_EVENTS_FAIL:
            return {
                ...state,
                loading: false,
                results: [],
                error: 'Error while fetching events'
        };
        default: return state;
    }
}

export function getEvents(query) {
    query = query || '';
    return {
        type: constants.GET_EVENTS,
        payload: {
            request: {
                url: 'events'
            }
        }
    }
}

export function updateQuery(query) {
    query = query || '';
    return {
        type: constants.SET_QUERY,
        data: {query}
    }
}