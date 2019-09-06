import {combineReducers} from 'redux';
import {i18nReducer} from 'react-redux-i18n';

const appReducer = combineReducers({
    i18n: i18nReducer,
});


export default appReducer;
