const constants = {
  'SET_STYLE' : 'CONFIG_SET_STYLE'
};

const defaultState = {

};

export default function configReducer(state = defaultState, action) {
  switch (action.type) {
    case constants.SET_STYLE: {
      return {
        ...state,
        ...action.data
      }
    }

    default: {
      return state;
    }
  }
}


export function setUIStyle(style) {

  return {
    type: constants.SET_STYLE,
    data: style
  }
}

