const constants = {
  'RESET' : 'PATH_RESET',
  'SET_PATH' : "PATH_SET",
  'ADD_PATH' : "PATH_ADD",
  'ADJUST_PATH' : "PATH_ADJUST",
  'GO_BACK' : "PATH_GO_BACK"

};

const defaultState = [];

export default function pathReducer(state = defaultState, action) {
  switch (action.type) {
    case constants.RESET:
      return [];
    case constants.SET_PATH:
      return [action.data];
    case constants.ADD_PATH:
      let path = [...state].filter(p => p.key !== action.data.key)
      return [ ...path, action.data];
    case constants.GO_BACK:
      path = [...state];
      path.pop();
      return [...path];
    case constants.ADJUST_PATH:
      return [ ...state.slice(0, action.data.index+1)];
    default: {
      return state;
    }
  }
}


export function resetPath() {
  window.location = '/#/';
  return {
    type: constants.RESET,
  }
}

export function adjustPath(index) {
  index = index >= 0 ? 0 : index;


  return {
    type: constants.ADJUST_PATH,
    data : {index}
  }
}



export function clickIndex(index) {
  return (dispatch, getState) => {
    let element = getState().path[index];

    window.location = element.path;

    dispatch(adjustPath(index));
  };
}

  export function goBack() {
    return (dispatch, getState) => {
      let len = getState().path.length;
      if (len === 0) return dispatch(resetPath());
      len = len -2;
      let index = len >= 0 ? len : 0;
      return dispatch(clickIndex(index));
    };
  };

function getPath (key, value, name) {
  switch (key) {
    case 'myProfile':
      return {key, path: '/#/profile/', name};
    case 'profile':
      return {key, path: `/#/profile/${value}`, name};
    case 'profiles':
      return {key, path: '/#/profiles/', name};
    case 'myDocuments':
      return {key, path: '/#/documents/', name};
    case 'editProfile':
      return {key, path: '/#/profile/edit', name};
    case 'addDocument' :
      return {key, path: '/#/documents/add', name};
    case 'verifyDomain' :
      return {key, path: '/#/profile/domain', name};
    default: return {}
  }
}

export function setPath(key, value) {
  let p = getPath(key, value);
  window.location = p.path;

  return {
    type: constants.SET_PATH,
    data : p
  }
}

export function addPath(key, value, name){
  let p = getPath(key, value, name);
  window.location = p.path;
  return{
    type: constants.ADD_PATH,
    data: p
  }
}


