import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route, Switch} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';

import HeaderAbout from '../../components/Header/HeaderAbout';

import publicRoutes from '../../routes/public';
import Notification from '../../components/Notification/Notification'
import appStyle from '../../style/components/appStyle';

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


class Public extends React.Component {
  render() {
    let { classes } = this.props;
    // let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    // let contentHeight = document.getElementById('root').clientHeight;
    // console.log('1h', h);
    // console.log('1ch', contentHeight);
    return (
      <div>
        <Notification/>
        <HeaderAbout layout={layout}/>
        <div  className={classes.content}>
          <Switch>
            {publicRoutes.map((prop, key) => {
              if (prop.redirect)
                return <Redirect from={prop.path} to={prop.to} key={key} />;
              else
                return <Route exact path={`${this.props.match.path}${prop.path}`} component={prop.component} key={key} />;
            })}
          </Switch>
        </div>
        <footer className={classes.footer}>
          <Transaction layout={layout} />
          {/*<Footer layout={layout}/>*/}
        </footer>
      </div>
    );
  }
}

Public.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(appStyle)(Public);
