import React, {Component}  from 'react';
import ReactDOM from 'react-dom';


import {HashRouter, Route, Switch} from 'react-router-dom';
import indexRoutes from './routes/index';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import theme from './style/theme'

import {connect} from "react-redux";


class MainComponent extends  Component{
  constructor(props){
    super(props);
  }

  getTheme = (theme) => {

    let myTheme = { ...theme };

    if (this.props.config.color)
      myTheme.palette.primary.main = '#'+this.props.config.color

    if (this.props.config.btnFontColor)
      myTheme.palette.primary.text = '#'+this.props.config.btnFontColor

    if (this.props.config.font)
      myTheme.typography.fontFamily = `${this.props.config.font}, ${myTheme.typography.fontFamily}`

    return myTheme
  }


  render() {
    return <MuiThemeProvider theme={createMuiTheme(this.getTheme(theme))}>
      <HashRouter>
        <Switch>
          {indexRoutes.map((prop, key) => {
            return <Route path={prop.path} component={prop.component} key={key} />;
          })}
        </Switch>
      </HashRouter>
    </MuiThemeProvider>
  }
}


export default connect(
  state => ({
    config: state.config,
  }),
  {
  }
)(MainComponent);


