import React from 'react';
import Avatar from '../Avatar'
import Icon from '../Icons'
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';

import ListItemText from '@material-ui/core/ListItemText';

import {withStyles} from "@material-ui/core/styles/index";
import userStyle from "../../style/components/userStyle";

const Item = function (props) {
    let {item, onClick, classes} = props;

    return <ListItem key={item._id} dense button={!!onClick} onClick={onClick ? () => {
        onClick(item._id, item.data.name)
    } : false}>
        <Grid container direction={'row'} justify={'space-between'} alignItems={'center'}>
            <Grid item xs={12} sm={8}>
                <ListItem style={{paddingLeft: '0px'}}>
                    <Avatar hash={item.data.image} name={item.data.name}/>
                    <ListItemText primary={item.data.name} secondary={
                        `${(item.confirmedWebsite ? ` [${item.data.website.replace('www.', '')}]` : '')}`}/>
                </ListItem>
            </Grid>
            <Hidden xsDown>
                <Grid item sm={2}>
                    <ListItem>
                        <Icon size={30} color='primary' className={classes.listItem} name={'thumbUp'}/>
                        <Typography style={{paddingLeft: '16px'}} variant={'h6'}> {item.counts.confPosIn} </Typography>

                    </ListItem>
                </Grid>
                <Grid item sm={2}>
                    <ListItem>
                        <Icon size={30} color='primary' className={classes.listItem} name={'thumbDown'}/>
                        <Typography style={{paddingLeft: '16px'}} variant={'h6'}> {item.counts.confNegIn} </Typography>
                    </ListItem>
                </Grid>
            </Hidden>
        </Grid>
    </ListItem>
}

export default withStyles(userStyle)(Item);


//${I18n.t('web.search.confirmation', {count: item.counts.confPosIn})},