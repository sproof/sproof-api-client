const constants = {
  'HIDE_BACKUP' : 'UI_HIDE_BACKUP',
  'HIDE_WEBSITE' : 'UI_HIDE_WEBSITE',
  'TOGGLE_TRANSACTIONS' : 'UI_TOGGLE_TRANSACTIONS',
};

const defaultState = {
  hideBackup: false,
  hideConfirmWebsite: false,
};

export default function uiReducer(state = defaultState, action) {
  switch (action.type) {
    case constants.HIDE_BACKUP:
      return { ...state, hideBackup: true};
    case constants.HIDE_WEBSITE:
      return { ...state, hideConfirmWebsite: true};
    case constants.TOGGLE_TRANSACTIONS:
      return {...state, showTransactions : !state.showTransactions}
    default: {
      return state;
    }
  }
}


export function hideBackup() {

  return {
    type: constants.HIDE_BACKUP,
  }
}

export function toggleTransactions() {

  return ({
    type: constants.TOGGLE_TRANSACTIONS,
  })
}


export function hideConfirmWebsite() {

  return {
    type: constants.HIDE_WEBSITE,
  }
}

