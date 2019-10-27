import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ListItemText from '@material-ui/core/ListItemText'
import moment from 'moment';
import Button from '@material-ui/core/Button'
import {I18n} from 'react-redux-i18n';
import verifyIFrameStyle from "../../style/components/verifyIFrameStyle";
import Icon from '../Icons'
import axios from "axios";
import Dropzone from 'react-dropzone'
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

const isInTimeRange = (validFrom, validUntil) => {
  let currentUnixTimestamp = (new Date()/1000);
  validFrom = validFrom ? validFrom : 0;
  validUntil = validUntil ? validUntil : Number.MAX_VALUE;
  return (validFrom < currentUnixTimestamp) && (currentUnixTimestamp < validUntil);
}

const getStatus = (registration) => {
  let isRegistrationNotRevoked = registration.valid;
  let isRegistrationNotOutdated = isInTimeRange(registration.validFrom, registration.validUntil);

  return {
    valid: isRegistrationNotRevoked && isRegistrationNotOutdated,
    revoked: !registration.valid,
    outdated: isRegistrationNotOutdated
  };
};

const getHeaderText = (registrations) => {
  return I18n.t(`web.verify.${isRegistered(registrations) ? 'registered' : 'notRegistered'}`)
}


const getSecondaryHeaderText = (registrations, name) => {

  // let headerText = status.valid ? I18n.t('web.explorer.registration.validDocument') : (
  //   status.revoked ? I18n.t(`web.documents.revokeReason.${registration.revokedReason}`) :  I18n.t('web.explorer.registration.outdatedDocument')
  // );
  return I18n.t(`web.verify.${isRegistered(registrations) ? 'registeredText' : 'notRegisteredText'}`, {name, count: registrations.length})
}

const getSecondaryText = (r) => {
  let status = getStatus(r.registration);

  if (status.valid)
    return `${I18n.t('web.verify.issuedBy')} ${r.profile ? r.profile.data.name : 'unknown'} ${moment.unix(r.registration.timestamp).fromNow()}`
  else if (status.revoked)
    return `${I18n.t('web.verify.revokedBy')} ${r.profile ? r.profile.data.name : 'unknown'} ${moment.unix(r.registration.revokedAt).fromNow()}`
  else
    return `${I18n.t('web.verify.issuedBy')} ${r.profile ? r.profile.data.name : 'unknown'} ${moment.unix(r.registration.timestamp).fromNow()}`
}


const isRegistered = (registrations) => {
  return registrations.length > 0;
}


class Upload extends Component{
  defaultState = {viewDetails: false, registrations : null, error: undefined, loading: false};
  loadingState = {viewDetails: false, registrations : null, error: undefined, loading: true};

  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.state = this.defaultState;
  }

  toBuffer(ab) {
    var buf = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }
    return buf;
  }

  onDrop (files){
    this.setState(this.loadingState);
    let file = files[0];

    let reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = ((data) => {
      let sp = window.sp;
      let buffer = this.toBuffer(reader.result);
      let documentHash = sp.getHash(buffer);
      axios.post(`${window.host}api/v1/file/verify/${documentHash}`, {}).then(res => {
        this.setState({loading: false, documentHash, name: file.name, registrations : res.data.result});
      }).catch (err => {
        this.setState({loading: false, documentHash, name: file.name, error: {status: err.response ? err.response.status : "Network", message: err.message}});
      })
    });
  }

  renderStart(onUploadClick) {
    let {classes } = this.props;
    return <Grid
      container
      direction='column'
      justify='center'
      alignItems='center'
      style={{maxWidth: '400px'}}
      spacing={1}
      >
        <Grid item><Typography className={classes.header}> {I18n.t('web.verify.verifyBtnHeader')}</Typography></Grid>
        <Grid item><Button  className={classes.iFrameButton}  onClick={onUploadClick} color='primary' variant={'contained'}> {I18n.t('web.verify.verifyBtnText')} </Button></Grid>
    </Grid>
  }


  renderRegistration(registrations, onUploadClick) {

    let {classes } = this.props;


    return <Grid
      container
      direction='row'
      justify='center'
      alignItems='center'
      style={{maxWidth: '900px', paddingBottom: '20px', paddingTop: '20px'}}
      spacing={1}
    >


      <Grid item><Typography className={classes.header}></Typography></Grid>
        <Grid item>
          <Typography align='center' variant={'h5'}>
            {getHeaderText(registrations)}
          </Typography>

          <Typography align='center' variant={'body1'}>
            {getSecondaryHeaderText(registrations, this.state.name )}
          </Typography>
        </Grid>

      <Grid item xs={12}>
        {/*<Typography style={{fontWeight: 'bold'}} variant={'caption'}>{I18n.t('web.verify.issuedBy')}</Typography>*/}

        {registrations.map(registration => <ExpansionPanel defaultExpanded={false} key={registration.registration._id}>
            <a target='_blank' rel="noopener noreferrer" href={'https://app.sproof.io/#/view/registration/'+registration.registration._id}><ExpansionPanelSummary
              //expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              onClick={() => this.setState({viewDetails: !this.state.viewDetails})}
            >
              <ListItemAvatar className={classes.avatar}>
                <Icon size='30' name={getStatus(registration.registration).valid ? 'check' : 'close'}
                      color={getStatus(registration.registration).valid ? 'successColor' : 'warningColor'}/>
              </ListItemAvatar>
              <ListItemText primary={registration.registration.name ? registration.registration.name : 'This file has no name' }
                            secondary={getSecondaryText(registration)}/>
            </ExpansionPanelSummary>
            </a>
          </ExpansionPanel>

        )}

      </Grid>
      <Grid item> <Button className={classes.iFrameButton} color='primary'  variant={'contained'}  onClick={onUploadClick}> {I18n.t('web.verify.tryAnother')} </Button> </Grid>
      <Grid item xs={12}> <div style={{minHeight: '50px', backgroundColor:'white', minWidth: '10px'}}/></Grid>

    </Grid>
  }


  renderPending(nextCommit, onUploadClick) {
    let {classes} = this.props;
    let additionalText, icon = 'clock';

    let iconClass = classes.checkIconColor;

    let header = I18n.t(`web.verify.documentPendingMode`)

    additionalText = I18n.t('web.verify.pendingAdditionalText');

    if (nextCommit){
      additionalText = additionalText + ' ' + I18n.t('web.verify.scheduleNextCommit') + moment.unix(nextCommit).calendar()   ;
    }


    return <Grid
      container
      direction='column'
      justify='center'
      alignItems='center'
      style={{maxWidth: '600px'}}
      spacing={1}
    >
      <Grid item><Typography className={classes.header}> <Icon size={'60'} className={iconClass} name={icon}/></Typography></Grid>
      <Grid item><Typography className={classes.header}>{header}</Typography></Grid>
      <Grid item><Typography align={"justify"} className={classes.text}>{additionalText}</Typography></Grid>
      <Grid item> <Button  className={classes.iFrameButton}   color='primary' variant={'contained'} onClick={onUploadClick} >{I18n.t('web.verify.tryAnother')}</Button> </Grid>
    </Grid>

  }

  renderExistsButNotConfirmed(documentHash,fileName, onUploadClick) {
    let {classes} = this.props;
    let additionalText, icon = 'sad';

    let iconClass = classes.checkIconColor;

    let header = I18n.t(`web.verify.existsByNotConfirmedHeader`)

    additionalText = I18n.t('web.verify.existsByNotConfirmedText');

    return <Grid
      container
      direction='column'
      justify='center'
      alignItems='center'
      style={{maxWidth: '600px'}}
      spacing={1}
    >
      <Grid item><Typography className={classes.header}> <Icon size={'60'} className={iconClass} name={icon}/></Typography></Grid>
      <Grid item><Typography className={classes.header}>{header}</Typography></Grid>
      <Grid item><Typography align={"justify"} className={classes.text}>{additionalText}</Typography></Grid>
      <Grid item>
        <a target='_blank' rel="noopener noreferrer" href={'https://app.sproof.io/#/view/documentHash/'+documentHash+'/'+fileName}>
        <Typography align={"justify"} style={{textDecoration: "underline"}} className={classes.text}>{I18n.t('web.verify.clickForMoreInformation')}</Typography>
        </a>
      </Grid>
      <Grid item> <Button  className={classes.iFrameButton}   color='primary' variant={'contained'} onClick={onUploadClick} >{I18n.t('web.verify.tryAnother')}</Button> </Grid>
    </Grid>

  }


  renderError(error, onUploadClick) {
    let {classes} = this.props;
    let additionalText, icon = 'sad';

    let iconClass = classes.checkIconColor;

    let errorHeader = `${error.status} Error`
    if (error.status === 404) {
      icon = 'sad'
      errorHeader = I18n.t(`web.verify.documentNotRegistered`)
    }
    if (error.status === "Network") {
      errorHeader = I18n.t(`web.verify.networkError`)
      additionalText = I18n.t(`web.verify.networkErrorText`)
    }

    return <Grid
      container
      direction='column'
      justify='center'
      alignItems='center'
      style={{maxWidth: '400px'}}
      spacing={1}
    >
      <Grid item><Typography className={classes.header}> <Icon size={'60'} className={iconClass} name={icon}/></Typography></Grid>
      <Grid item><Typography className={classes.header}>{errorHeader}</Typography></Grid>
      <Grid item><Typography className={classes.text}>{additionalText}</Typography></Grid>
      <Grid item> <Button  className={classes.iFrameButton}   color='primary' variant={'contained'} onClick={onUploadClick} >{I18n.t('web.verify.tryAnother')}</Button> </Grid>
    </Grid>
  }



  render() {
    let {classes } = this.props;
    let {registrations, error} = this.state;
    let isLoading = this.state.loading;


    let pending = false;
    let notConfirmed = false;
    let nextCommit = false;

    if (!(registrations instanceof Array) && registrations && registrations.pending){
      pending = registrations.pending;
      nextCommit = registrations.nextCommit;
    }

    if (!(registrations instanceof Array) && registrations && registrations.existsButNotConfirmed){
      notConfirmed = registrations.existsButNotConfirmed;
    }



    return <Dropzone filesLimit={1} onDrop={this.onDrop}>
      {({getRootProps, getInputProps, isDragActive}) => {
        let rootProps = getRootProps();
        let onClick = rootProps.onClick;
        let rootPropsWithoutClick = {...rootProps, onClick: event => event.stopPropagation() }

        return (<div style={{height: '100%'}} {...rootPropsWithoutClick}>
            <input {...getInputProps()}/>
              <Grid container className={classes.container} direction={'column'} justify={'center'} alignItems={'center'}>
                {isLoading && <Grid item><CircularProgress color='primary'/></Grid>}

                {!isLoading && isDragActive && <div className={classes.dragFilesContainer}>
                  <div className={classes.dragFilesBorder}>
                    <div><Typography className={classes.dragText} variant="h6">{I18n.t('web.verify.placeYourFile')}</Typography></div>
                  </div>
                </div>}
                {(!isLoading && !registrations && !error) && { ...this.renderStart(onClick) }}
                {!isLoading && registrations && !pending && !notConfirmed && {...this.renderRegistration(registrations, onClick)}}
                {!isLoading && registrations && pending && !notConfirmed && {...this.renderPending(nextCommit, onClick)}}
                {!isLoading && registrations && notConfirmed && !pending && {...this.renderExistsButNotConfirmed(this.state.documentHash, this.state.name, onClick)}}

                {!isLoading && error && {...this.renderError(error, onClick)}}
              </Grid>


            <div style={{bottom: 0, right: 0, width: '100%', backgroundColor: 'white', position: 'fixed'}}>
              <Grid container
                    spacing={2}
                    direction="row"
                    justify="flex-end"
                    alignItems="center">
                <a href={'https://www.sproof.io'} target={'_blank'}>
                <Grid item> <img style={{paddingRight: '8px'}} height={'40px'} src={'sproof_logo.svg'} alt={'sproof logo'}/> </Grid>
                </a>

              </Grid>
            </div>
          </div>
        )}}
    </Dropzone>
  }
}


export default connect(
  state => ({
  }),
  {
  }
)(withStyles(verifyIFrameStyle)(Upload));
