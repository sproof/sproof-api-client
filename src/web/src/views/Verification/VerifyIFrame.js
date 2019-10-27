import React, {Component} from 'react';
import VerificationWP from '../../components/VerifyDocument/VerificationIFrame'
import withStyles from '@material-ui/core/styles/withStyles'
import {connect} from "react-redux";
import verifyIFrameStyle from "../../style/components/verifyIFrameStyle";
import {setLocale} from 'react-redux-i18n';
import moment from 'moment'

class VerifyIFrame extends Component{

  constructor(props) {
    super(props);

    let locale = props.match.params.locale;
    props.setLocale(locale === 'de' ? 'de' : 'en')
    moment.locale(locale === 'de' ? 'de' : 'en')


  }

  render() {
    return <VerificationWP standalone={this.props.match.params.locale} className={this.props.classes.rootWordpress}/>
  }
}

export default connect(
  state => ({}),
  {
    setLocale: setLocale,
  }
)(withStyles(verifyIFrameStyle)(VerifyIFrame));
