const constants = {
  'SET_QUERY'           : 'PROFILES_SET_QUERY',
  'GET_PROFILES'           : 'PROFILES_LOAD',
  'GET_PROFILES_SUCCESS'   : 'PROFILES_LOAD_SUCCESS',
  'GET_PROFILES_FAIL'      : 'PROFILES_LOAD_FAIL',

};


const defaultState = {
  query: '',
  results: [],
  error: null,
  loading: false
};

export default function activityReducer(state = defaultState, action) {
  switch (action.type) {
    case constants.GET_PROFILES:
      return { ...state, loading: true , results: []};
    case constants.SET_QUERY:
      return {...state, query: action.data.query};
    case constants.GET_PROFILES_SUCCESS:
      return { ...state, loading: false, error: action.payload.data.error, results: (action.payload.data.result || []) };
    case constants.GET_PROFILES_FAIL:
      return {
        ...state,
        loading: false,
        results: [],
        error: 'Error while fetching profiles'
      };
    // case constants.ADD:
    //   return {...state, data: [action.data, ...state.activities]}
    default: {
      return state;
    }
  }
}


export function getProfiles(query) {
  query = query || '';
  return {
    type: constants.GET_PROFILES,
    payload: {
      request: {
        url: `profiles?sort_by=counts.confPosIn,desc&counts.confPosIn,desc&per_page=10&confirmedWebsite=true&data.name={in}${query}`
      }
    }
  }
}

export function updateQuery(query) {
  query = query || '';
  return {
    type: constants.SET_QUERY,
    data : {query}
  }
}