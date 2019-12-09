import React, {Component} from 'react';
import VerificationWP from '../../components/VerifyDocument/VerificationIFrame'
import withStyles from '@material-ui/core/styles/withStyles'
import {connect} from "react-redux";
import verifyIFrameStyle from "../../style/components/verifyIFrameStyle";
import {setLocale} from 'react-redux-i18n';
import moment from 'moment'
import * as configActions from '../../store/reducers/reducer-config'

class VerifyIFrame extends Component{

  getParam(params, name) {
    let p = params.find(p => p.name == name)
    if (p) return p.value
    return undefined;
  }

  constructor(props) {
    super(props);

    let locale = props.match.params.locale;
    props.setLocale(locale === 'de' ? 'de' : 'en')
    moment.locale(locale === 'de' ? 'de' : 'en')

    let params = props.location.search;

    params = params.replace('?','').split('&');

    params = params.map(p => {return {name: p.split('=')[0], value: p.split('=')[1]} } )
    this.state = {params}


    props.setUIStyle({
      profile: this.getParam(params, 'profile'),
      color: this.getParam(params, 'color'),
      font: this.getParam(params, 'font'),
      btnFontColor: this.getParam(params, 'btnFontColor')
    });

  }

  render() {
    return <VerificationWP standalone={this.props.match.params.locale} className={this.props.classes.rootWordpress}/>
  }
}

export default connect(
  state => ({}),
  {
    setLocale: setLocale,
    setUIStyle: configActions.setUIStyle
  }
)(withStyles(verifyIFrameStyle)(VerifyIFrame));
