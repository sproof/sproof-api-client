
const constants = {
  'SET_USER'           : 'USER_SET',
  'GET_USER'           : 'USER_LOAD',
  'GET_USER_SUCCESS'   : 'USER_LOAD_SUCCESS',
  'GET_USER_FAIL'      : 'USER_LOAD_FAIL',

};


const defaultState = {
  loading: false,
  result: {counts: {}}

};

export default function userReducer(state = defaultState, action) {
  switch (action.type) {
    case constants.GET_USER:
      return { ...state, loading: true, error: undefined };

    case constants.GET_USER_SUCCESS:{
      return { ...state, loading: false, result: {
          ...state.result,
          ...action.result,
          data: {
          ...state.result.data,
          ...action.result.data
        }
      }};
    }
    case constants.SET_USER:{
      return { ...state, loading: false, result: action.data };
    }
    case constants.GET_USER_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.error
      };
    }
    default: {
      return state;
    }
  }
}

export function setUser(data){
  return {
    type: constants.SET_USER,
    data : {...data, counts: {}}
  }
}

export function getUser() {
  return (dispatch) => {
    let sproof = window.sp;
    dispatch({type: constants.GET_USER});
    sproof.getUser ((err, res) => {
      if (err) dispatch({type: constants.GET_USER_FAIL, error: err})
      else dispatch({type: constants.GET_USER_SUCCESS,  result: res })
    });
 }
}