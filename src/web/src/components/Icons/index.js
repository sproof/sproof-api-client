//File ProjectIcons.js
import verifyIFrameStyle from '../../style/components/verifyIFrameStyle'
import React from 'react'
import Badge from '@material-ui/core/Badge'
import CircularProgress from '@material-ui/core/CircularProgress'
import {Icon} from 'react-icons-kit'
import {userSecret} from 'react-icons-kit/fa/userSecret'
import {ic_arrow_back} from 'react-icons-kit/md/ic_arrow_back'
import {ic_refresh} from 'react-icons-kit/md/ic_refresh'
import {warning} from 'react-icons-kit/fa/warning'
import {clockO} from 'react-icons-kit/fa/clockO'
import {creditCardAlt} from 'react-icons-kit/fa/creditCardAlt'
import {
  ban,
  check,
  envelope,
  filePdfO,
  dashboard,
  filesO,
  gear,
  github,
  hashtag,
  institution,
  mobile,
  plus,
  search,
  send,
  user,
  users,
} from 'react-icons-kit/fa'
import {documents, network} from 'react-icons-kit/entypo'

import {fileText} from 'react-icons-kit/fa/fileText'


import {ic_account_circle as account_circle} from 'react-icons-kit/md/ic_account_circle'
import {thumbsOUp} from 'react-icons-kit/fa/thumbsOUp'
import {question} from 'react-icons-kit/fa/question'

import {thumbsODown} from 'react-icons-kit/fa/thumbsODown'
import {upload} from 'react-icons-kit/fa/upload'
import {download} from 'react-icons-kit/fa/download'
import {close} from 'react-icons-kit/fa/close'
import {save} from 'react-icons-kit/fa/save'

import {signOut} from 'react-icons-kit/fa/signOut'


import {ic_verified_user} from 'react-icons-kit/md/ic_verified_user'
//lets say the icons on your side navigation are all color red
import {ic_keyboard_arrow_right} from 'react-icons-kit/md/ic_keyboard_arrow_right'
import {ic_keyboard_arrow_up as up} from 'react-icons-kit/md/ic_keyboard_arrow_up'
import {ic_keyboard_arrow_down as down} from 'react-icons-kit/md/ic_keyboard_arrow_down'

import {ic_mode_edit} from 'react-icons-kit/md/ic_mode_edit'
import {exclamationTriangle} from 'react-icons-kit/fa/exclamationTriangle'
import {externalLink} from 'react-icons-kit/fa/externalLink'
import {withStyles} from "@material-ui/core/styles/index";
import {frownO} from 'react-icons-kit/fa/frownO'
import {lock} from 'react-icons-kit/fa/lock'
import {listAlt} from 'react-icons-kit/fa/listAlt'

const getIcon = (name) => {
  switch (name) {
    case 'creditCard' : return creditCardAlt;
    case 'explorer':  return search;
    case 'profile' : return user;
    case 'profiles' : return users;
    case 'confirmations': return thumbsOUp;
    case 'registration' : return fileText;
    case 'documentHash' : return fileText;
    case 'error' : return exclamationTriangle;
    case 'registrations' : return filesO;
    case 'sad': return frownO;
    case 'website': return externalLink;
    case 'block' : return hashtag;
    case 'dailyTransaction' : return clockO;
    case 'network' : return network;
    case 'event' : return send;
    case 'events' : return send;
    case 'submitTransaction' : return network;
    case 'receiver': return user;
    case 'issuer' : return institution;
    case 'verifier' : return search;
    case 'order' : return filePdfO;
    case 'user' : return user;
    case 'question' : return question;
    case 'register': return fileText;
    case 'lock' : return lock;
    case 'reset' : return lock;
    case 'users' : return users;
    case 'mobile' : return mobile;
    case 'contactus'  : return envelope;
    case 'pdf' : return filePdfO;
    case 'github' : return github;
    case 'revoke': return close;
    case 'check' : return check;
    case 'transactions': return network;
    case 'transaction': return network;
    case 'settings' : return gear;
    case 'account_circle' : return account_circle;
    case 'edit' :  return ic_mode_edit;
    case 'thumbUp':  return thumbsOUp;
    case 'waiting' : return save;
    case 'thumbDown': return thumbsODown;
    case 'cloud' : return upload;
    case 'signout' : return signOut;
    case 'download' : return download;
    case 'dashboard': return dashboard;
    case 'close' : return close;
    case 'documents': return filesO;
    case 'verify' : return ic_verified_user;
    case 'arrow' : return ic_keyboard_arrow_right;
    case 'add' :    return plus;
    case 'search' : return search;
    case 'up' : return up;
    case 'down': return down;
    case 'pseudonym': return userSecret;
    case 'notInterestedIcon': return exclamationTriangle;
    case 'back' : return ic_arrow_back;
    case 'reload' : return ic_refresh;
    case 'warning' : return warning;

    default: console.log("Icon not found: " + name); return ban;
  }
}


const StyledBadge = withStyles((theme) => ({
  badge: {
    top: 'auto',
    bottom: 0,
    right: -3,
    // The border color match the background color.
  },
}))(Badge);

const getColor = (color) => {
  if (!color) return '#333333';
  else if (color == 'error' || color == 'warning' || color == 'success' ){
    return undefined;
  }
  else
    return color;

}

let Container = (props) => {
  return props.secondName ? <StyledBadge badgeContent={<Icon
    style={{color : getColor(props.secondColor)}}
    className={props.classes[props.secondColor]}
    icon={getIcon(props.secondName)}
    size={props.secondSize}/>}> {props.children} </StyledBadge> : props.children
}

const myIcon = (props) => {
  if (props.name === 'loading' ) return <CircularProgress style={{padding:8}} color={'primary'}/>


  let color = getColor(props.color);
  console.log(color);
  console.log(props.color);

  return <Container {...props} >
    <Icon style={{color}} className={props.classes[props.color]} {...props} icon={getIcon(props.name)}/>
  </Container>
}

export default withStyles(verifyIFrameStyle)(myIcon);

