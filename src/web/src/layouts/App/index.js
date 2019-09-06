import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route, Switch} from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import HeaderAbout from '../../components/Header/HeaderAbout';
import Notification from '../../components/Notification/Notification'
import appStyle from '../../style/components/appStyle';
import Grid from '@material-ui/core/Grid';
import appRoutes from '../../routes/app';
import Transactions from '../../components/Transactions'

let layout = {
  side : {
    xl: 2,
    lg: 1,
    md: false,
    sm: false,
    xs: false
  },
  center: {
    xl : 8,
    lg : 10,
    md: 12,
    sm: 12,
    xs: 12
  }
};

class App extends React.Component {

  render() {
    var { classes } = this.props;
    return (
      <div className={classes.root}>
        <Notification/>
        <HeaderAbout layout={layout}/>
        <div className={classes.content}>
          <Grid container spacing={0}>
            <Grid item {...layout.side} />
            <Grid item {...layout.center} className={classes.center} >

              <Switch>
                {appRoutes.map((prop, key) => {
                  if (prop.redirect)
                    return <Redirect from={prop.path} to={prop.to} key={key} />;
                  return <Route path={`${prop.path}`} component={prop.component} key={key} />;
                })}
              </Switch>
            </Grid>
            <Grid item {...layout.side}/>
          </Grid>
        </div>
        <footer className={classes.stickyFooter}>
        <Transactions layout={layout} />
        </footer>
        {/*<footer className={classes.footer}>*/}
          {/*/!*<Footer layout={layout}/>*!/*/}
        {/*</footer>*/}
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(appStyle)(App);