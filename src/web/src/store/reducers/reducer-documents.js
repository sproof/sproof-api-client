const constants = {
  'GET_DOCUMENTS'           : 'DOCUMENTS_LOAD',
  'GET_DOCUMENTS_SUCCESS'   : 'DOCUMENTS_LOAD_SUCCESS',
  'GET_DOCUMENTS_FAIL'      : 'DOCUMENTS_LOAD_FAIL',

};


const defaultState = {
  query: '',
  results: [],
  error: null,
  loading: false
};

export default function documentReducer(state = defaultState, action) {
  switch (action.type) {
    case constants.GET_DOCUMENTS:
      return { ...state, loading: true };
    case constants.GET_DOCUMENTS_SUCCESS:
      return { ...state, loading: false, error: action.payload.data.error, results: action.payload.data.result };
    case constants.GET_DOCUMENTS_FAIL:
      return {
        ...state,
        loading: false,
        error: 'Error while fetching documents'
      };
    // case constants.ADD:
    //   return {...state, data: [action.data, ...state.activities]}
    default: {
      return state;
    }
  }
}


export function getDocumentsByAddress(address) {
  return {
    type: constants.GET_DOCUMENTS,
    payload: {
      request: {
        url: `registrations?issuer=${address}`
      }
    }
  }
}