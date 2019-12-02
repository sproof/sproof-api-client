import {combineReducers} from 'redux';
import {i18nReducer} from 'react-redux-i18n';
import configReducer from './reducers/reducer-config'

const appReducer = combineReducers({
    i18n: i18nReducer,
    config: configReducer
});


export default appReducer;
