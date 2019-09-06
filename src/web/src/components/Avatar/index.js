import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import {getIPFSLink}  from "../../env";
import Icon from "../../components/Icons"
import CircularProgress from '@material-ui/core/CircularProgress'

export default function MyAvatar(props) {
  //todo: change
  let base = getIPFSLink();

  if (props.loading)
    return <CircularProgress color='primary'/>

  console.log(props)

  if (props.defaultIcon)
    return <Avatar {...props} > <Icon name={'user'}/> </Avatar>
  if (props.hash)
    return <Avatar {...props} src={`${base}${props.hash}`} />
  else
    return <Avatar style={{marginRight: "16px"}}>{props.name.substring(0,1)}</Avatar>
}
