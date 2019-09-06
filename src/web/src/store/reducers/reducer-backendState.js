let constants =
  {
    'SET'      :         'BACKEND_STATE_SET',
    'SET_VALUE'      :   'BACKEND_STATE_SET_VALUE'
  };
const initialState = {

};

export default function backendStateReducer(state = initialState, action) {
  switch (action.type) {
    case constants.SET:
      return {
        ...state,
        ...action.data,
      };
    case constants.SET_VALUE:
      return {
        ...state,
        [action.data.key] :  action.data.value,
      };
    default:
      return state;
  }
}

export function setValue(key, value) {
  return {
    type: constants.SET_VALUE,
    data : {
      key, value
    }
  }
}

export function setState(state) {
  return {
    type: constants.SET,
    data : {
      ...state
    }
  }
}