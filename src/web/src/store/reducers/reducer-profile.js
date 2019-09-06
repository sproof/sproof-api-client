const constants = {
  'GET'               : 'PROFILE_LOAD',
  'GET_SUCCESS'       : 'PROFILE_LOAD_SUCCESS',
  'GET_FAIL'          : 'PROFILE_LOAD_FAIL',
  'CONF_POS_GET'               : 'PROFILE_CONF_POS_LOAD',
  'CONF_POS_GET_SUCCESS'       : 'PROFILE_CONF_POS_LOAD_SUCCESS',
  'CONF_POS_GET_FAIL'          : 'PROFILE_CONF_POS_LOAD_FAIL',
  'CONF_NEG_GET'               : 'PROFILE_CONF_NEG_LOAD',
  'CONF_NEG_GET_SUCCESS'       : 'PROFILE_CONF_NEG_LOAD_SUCCESS',
  'CONF_NEG_GET_FAIL'          : 'PROFILE_CONF_NEG_LOAD_FAIL'
};


export default function profileReducer(state = { data: null, posConfirmations: [], negConfirmations:[] }, action) {
  switch (action.type) {
    case constants.GET:
      return { ...state, loading: true, data: null};
    case constants.GET_SUCCESS:
      return { ...state, loading: false, error: action.payload.data.error, data: action.payload.data.result};
    case constants.GET_FAIL:
      return {
        ...state,
        loading: false,
        data: null,
        error: 'Error while fetching profile'
      };

    case constants.CONF_POS_GET:
      return { ...state, loading_pos: true, posConfirmations: []};
    case constants.CONF_POS_GET_SUCCESS:
      return { ...state, loading_pos: false, error_pos: action.payload.data.error,
        posConfirmations: action.payload.data.result.map(c => c.from)
      };
    case constants.CONF_POS_GET_FAIL:
      return {
        ...state,
        loading_pos: false,
        posConfirmations: [],
        error_pos: 'Error while fetching profile'
      };


    case constants.CONF_NEG_GET:
      return { ...state, loading_neg: true, negConfirmations: []};
    case constants.CONF_NEG_GET_SUCCESS:
      return { ...state, loading_neg: false, error_pos: action.payload.data.error,
        negConfirmations: action.payload.data.result.map(c => c.from)
      };
    case constants.CONF_NEG_GET_FAIL:
      return {
        ...state,
        loading_neg: false,
        negConfirmations: [],
        error: 'Error while fetching profile'
      };
    default: {
      return state;
    }
  }
}

export function loadConfirmations(address, value) {
  return {
    type: value ? constants.CONF_POS_GET: constants.CONF_NEG_GET,
    payload: {
      request: {
        url: `/confirmations?to=${address}&value=${value}&sort_by=from.counts.confPosIn,desc`
      }
    }
  }
}

export function loadProfile(address) {

  return (dispatch) => {
    dispatch({
      type: constants.GET,
      payload: {
        request: {
          url: `/profiles/${address}`
        }
      }
    });
    // dispatch(loadConfirmations(address, true))
    // dispatch(loadConfirmations(address, false))
  }
}
