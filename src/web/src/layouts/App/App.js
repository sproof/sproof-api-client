import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route, Switch} from 'react-router-dom';
import {withStyles} from 'material-ui';
import {Header, Notification} from 'components/';

import appRoutes from 'routes/app';

import appStyle from 'style/components/appStyle';

import logo from 'assets/logo.png';

class App extends React.Component {
  state = {
    mobileOpen: false
  };
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  componentDidUpdate() {
    this.refs.mainPanel.scrollTop = 0;
  }
  render() {
    var { classes, ...rest } = this.props;

    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={appRoutes}
          logo={logo}
          logoText = {'sproof.it'}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color='green'
          {...rest}
        />
        <div className={classes.mainPanel} ref='mainPanel'>
          <Header
            routes={appRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
            <div className={classes.content}>
              <div className={classes.container}>
                  <Switch>
                    {appRoutes.map((prop, key) => {
                      if (prop.redirect)
                        return <Redirect from={prop.path} to={prop.to} key={key} />;
                      return <Route path={prop.path} component={prop.component} key={key} />;
                    })}
                  </Switch>
              </div>
            </div>
          <Footer />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(appStyle)(App);
