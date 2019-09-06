const constants = {
    'SET_QUERY'                     : 'TRANSACTIONS_SET_QUERY',
    'GET_TRANSACTIONS'              : 'TRANSACTIONS_LOAD',
    'GET_TRANSACTIONS_SUCCESS'      : 'TRANSACTIONS_LOAD_SUCCESS',
    'GET_TRANSACTIONS_FAIL'         : 'TRANSACTIONS_LOAD_FAIL',
};

const defaultState = {
    query: '',
    results: [],
    error: null,
    loading: false
};

export default function transactionsReducer(state = defaultState, action) {
    switch (action.type) {
        case constants.SET_QUERY: return {...state, query: action.data.query};
        case constants.GET_TRANSACTIONS: return { ...state, loading: true , results: []};
        case constants.GET_TRANSACTIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                results: (action.payload.data.result || []),
                error: action.payload.data.error };
        case constants.GET_TRANSACTIONS_FAIL:
            return {
                ...state,
                loading: false,
                results: [],
                error: 'Error while fetching transactions'
            };
        default: return state;
    }
}

export function getTransactions(query) {
    query = query || '';
    return {
        type: constants.GET_TRANSACTIONS,
        payload: {
            request: {
                url: `transactions`
            }
        }
    }
}