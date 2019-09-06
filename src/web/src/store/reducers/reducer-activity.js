const constants = {
  'GET_PROFILES'           : 'PROFILES_ACTIVITY_LOAD',
  'GET_PROFILES_SUCCESS'   : 'PROFILES_ACTIVITY_LOAD_SUCCESS',
  'GET_PROFILES_FAIL'      : 'PROFILES_ACTIVITY_LOAD_FAIL',

};


export default function activityReducer(state = { profiles: [] }, action) {
  switch (action.type) {
    case constants.GET_PROFILES:
      return { ...state, loading: true };
    case constants.GET_PROFILES_SUCCESS:
      return { ...state, loading: false, error: action.payload.data.error, profiles: action.payload.data.result };
    case constants.GET_PROFILES_FAIL:
      return {
        ...state,
        loading: false,
        error: 'Error while fetching profiles'
      };
    // case constants.ADD:
    //   return {...state, data: [action.data, ...state.activities]}
    default: {
      return state;
    }
  }
}


export function getProfiles() {
  return {
    type: constants.GET_PROFILES,
    payload: {
      request: {
        url: `profiles?sort_by=counts.confPosIn,desc&per_page=5`
      }
    }
  }
}