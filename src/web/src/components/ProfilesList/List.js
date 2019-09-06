import React from 'react';

import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import {withStyles} from "@material-ui/core/styles/index";
import {connect} from "react-redux";

import ProfileItem from './Item';

import * as pathActions from '../../store/reducers/reducer-path'

class ProfilesList extends React.Component {

    onItemClick = (address, name) => {
      this.props.addPath('profile', address, name)
    };

    render () {
        return (
            <div>
                <Grid item xs={12}>
                  <List>
                    {this.props.profiles.map(item => <ProfileItem key={item._id} onClick={(address, name) => this.onItemClick(address,name)} item={item}/>
                    )}
                    {this.props.profiles.length === 0 &&
                      <ListItem>
                        <ListItemText secondary={this.props.notFoundText}/>
                      </ListItem>

                    }
                  </List>
                </Grid>
            </div>
        );
    }
}

export default connect(
  state => ({

  }),
  {
    addPath : pathActions.addPath
  }
)(withStyles({})(ProfilesList));
