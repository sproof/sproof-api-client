const constants = {
  'SET' :                'ACCOUNT_SET',
  'CREATE' :                'ACCOUNT_CREATE',
  'STORE' :                 'ACCOUNT_STORE',
  'DELETE' :                'ACCOUNT_DELETE',
  'GET_ACCOUNT' :                       'ACCOUNT_GET_LOAD',
  'GET_ACCOUNT_FAIL' :                  'ACCOUNT_GET_LOAD_FAIL',
  'GET_ACCOUNT_SUCCESS' :               'ACCOUNT_GET_LOAD_SUCCESS',
  'CHECK_DOMAIN'      :     'ACCOUNT_CHECK_DOMAIN_LOAD',
  'CHECK_DOMAIN_SUCCESS' :  'ACCOUNT_CHECK_DOMAIN_LOAD_SUCCESS',
  'CHECK_DOMAIN_FAIL' :     'ACCOUNT_CHECK_DOMAIN_LOAD_FAIL',
  'GET_BLOCKCHAIN_ACCOUNT'      :     'ACCOUNT_BLOCKCHAIN_LOAD',
  'GET_BLOCKCHAIN_ACCOUNT_SUCCESS' :  'ACCOUNT_BLOCKCHAIN_LOAD_SUCCESS',
  'GET_BLOCKCHAIN_ACCOUNT_FAIL' :     'ACCOUNT_BLOCKCHAIN_LOAD_FAIL',
  "GET_ETHER"                   : 'ACCOUNT_GET_ETHER',
  "GET_ETHER_SUCCESS"           : 'ACCOUNT_GET_ETHER_SUCCESS',
  "GET_ETHER_FAIL"              : 'ACCOUNT_GET_ETHER_FAIL',
  "BACKUP"                      : 'ACCOUNT_BACKUP'
};

const initialState = {
  address: null,
  public: false,
  key: {
      encrypted: false,
      privateKey: null
  },
  backup: false,
  domainCheck : {result: false},
  blockchainAccount : {
    ether: '0',
    uploads: '0'
  },
  requestEther : {
    loading: false,
    error: false,
  }
};


export default function accountReducer(state = initialState, action) {
    switch (action.type) {
      case constants.CREATE:
            return {
               ...action.data
      };
      case constants.SET:
        return {
          ...action.data
        }
      case constants.STORE:
        return {
          ...state,
          ...action.data
        };

      case constants.GET_ACCOUNT:
        return {
          ...state,
          loading : true,
          error: false
        }

      case constants.GET_ACCOUNT_SUCCESS:
        return {
          ...state,
          public: Boolean(action.payload.data.user),
          ...action.payload.data,
          loading: false,
          error: false
        }

      case constants.GET_ACCOUNT_FAIL:
        return {
          ...state,
          error : true,
          loading: false
        }

      case constants.DELETE:
      {
        return initialState;
      }
      case constants.CHECK_DOMAIN:
      {
        return {
          ...state,
          domainCheck: { loading: true, result: false}
        }
      }
      case constants.CHECK_DOMAIN_FAIL:
      {
        return {
          ...state,
          domainCheck: { loading: false, error: true }
        }
      }
      case constants.CHECK_DOMAIN_SUCCESS:
      {
        return {
          ...state,
          domainCheck: { loading: false, result: action.payload.data.domainCheck }
        }
      }
      case constants.GET_BLOCKCHAIN_ACCOUNT:
      {
        return {
          ...state,
          blockchainAccount: { ...state.blockchainAccount, loading: true, error: false}
        }
      }
      case constants.GET_BLOCKCHAIN_ACCOUNT_FAIL:
      {
        return {
          ...state,
          blockchainAccount: { loading: false, error: true }
        }
      }
      case constants.GET_BLOCKCHAIN_ACCOUNT_SUCCESS:
      {
        return {
          ...state,
          blockchainAccount: { loading: false, error: false, ...action.payload.data.blockchainAccount }
        }
      }

      case constants.GET_ETHER : {
        return {
          ...state,
          requestEther: {
            loading: true,
            error: false,
            timestamp: action.data.timestamp
          }
        }
      }
      case constants.GET_ETHER_SUCCESS : {
        return {
          ...state,
          requestEther: {
            ...state.requestEther,
            loading: false,
            error: false
          }
        }
      }
      case constants.GET_ETHER_FAIL : {
        return {
          ...state,
          requestEther: {
            ...state.requestEther,
            loading: false,
            error: true
          }
        }
      }

      case constants.BACKUP : {
        return {
          ...state,
          backup: true
        }
      }

      default:
            return state;
    }
}


export function createAccount(seed, core) {
  let account = core.blockchain.createAccount(seed);
  return (dispatch, getState) => {
    dispatch({type: constants.CREATE, data: account})
  }
}

export function storeAccount(account){
  return {type: constants.STORE, data: account}
}

export function deleteAccount() {
  return {
    type: constants.DELETE
  };
}

export function setAccount(account, backup) {
  return {
    type: constants.SET,
    data: {
      ...account,
      backup : backup,
      interaction: false
    }
  };
}

export function backupAccount() {
  return {
    type: constants.BACKUP
  }
}


export function checkDomain (account, domain){
  return {
    type: constants.CHECK_DOMAIN,
    payload: {
      request: {
        url: `/checkDomain/${account}/${encodeURIComponent(domain)}`
      }
    }
  }
}

export function getBlockchainAccount (account){
  return {
    type: constants.GET_BLOCKCHAIN_ACCOUNT,
    payload: {
      request: {
        url: `/getBlockchainAccount/${account}`
      }
    }
  }
}

export function getAccount (account){
  return {
    type: constants.GET_ACCOUNT,
    payload: {
      request: {
        url: `/account/${account}`
      }
    }
  }
}

export function requestEther (account){
  return {
    type: constants.GET_ETHER,
    data: {
      timestamp:
        Math.round(new Date().getTime()/1000)
    },
    payload: {
      request: {
        url: `/requestEther/${account}`
      }
    }
  }
}