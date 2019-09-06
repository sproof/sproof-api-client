const constants = {
  'SET' :                'COOKIES_ACCEPT'
};

const initialState = {
  acceptCookies: false
};


export default function cookieReducer(state = initialState, action) {
    switch (action.type) {
      case constants.SET:
            return {
               acceptCookies: true
      };

      default:
            return state;
    }
}


export function setAcceptCookies(){
  return {type: constants.SET }
}