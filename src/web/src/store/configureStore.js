import { applyMiddleware, createStore } from 'redux';
import reduxThunk                       from 'redux-thunk';
import { createLogger }                 from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist'
import storage                          from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import rootReducer                      from './rootReducer';
import { loadTranslations, setLocale, syncTranslationWithStore } from 'react-redux-i18n';


import translationsObject  from '../languages';
import axios                            from 'axios';
import axiosMiddleware                  from 'redux-axios-middleware';
import moment from 'moment'
import {getHost} from '../env'

//todo: change
let base = `${getHost()}api/v1`


const client = axios.create({
  baseURL: base,
  responseType: 'json'
});


export default function configureStore(initialState) {
  const logger = createLogger({
    collapsed: false,
    predicate: () => process.env.NODE_ENV === 'development'
  });

  const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['i18n','notification','config', 'search', 'form', 'log', 'profile', 'activity']
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const middleware = applyMiddleware(axiosMiddleware(client), reduxThunk, logger);

  const store = middleware(createStore)(persistedReducer, initialState);

  let persistor = persistStore(store);


  syncTranslationWithStore(store);
  store.dispatch(loadTranslations(translationsObject));
  let userLang = window.navigator.language || window.navigator.userLanguage;
  userLang = userLang.split('-')[0] === 'de' ? 'de' : 'en';

  store.dispatch(setLocale('en'));

  moment.locale(userLang);

  return {store, persistor} ;
}
