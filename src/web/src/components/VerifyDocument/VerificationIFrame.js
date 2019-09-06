import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListItemText from '@material-ui/core/ListItemText'
import moment from 'moment';
import Button from '@material-ui/core/Button'
import {I18n} from 'react-redux-i18n';
import verifyIFrameStyle from "../../style/components/verifyIFrameStyle";
import Icon from '../Icons'
import axios from "axios";
import Divider from "@material-ui/core/Divider";
import Avatar from '../Avatar'
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

const allValid = (registrations) =>  {
  let vs = registrations.map(r => {
    return getStatus(r.registration).valid
  });
  return !vs.includes(false)
};

const allInvalid = (registrations) =>  {
  let vs = registrations.map(r => {
    return getStatus(r.registration).valid
  });
  return !vs.includes(true)
};

const isRegistered = (registrations) => {
  return registrations.length > 0;
}

const getMainIcon = (registrations) => {
  return registrations.length === 0 ? 'sad' : 'registration'
}

const getSecondaryIcon = (registrations) => {
  if (registrations.length === 0) return undefined;
  if (allValid(registrations)) return 'check';
  else if (allInvalid(registrations)) return 'close';
  else return 'question'
}

const getSecondaryIconColor = (registrations) => {
  if (allValid(registrations)) return registrations;
  return 'error';
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

  //  let regSingle = registrations.length === 1 ? registrations[0] : null;

    // let icon, iconClass, headerText;
    // headerText = I18n.t('web.verify.multipleHeader');

    // if (regSingle) {
    //   icon = this.getRegistrationIcon(regSingle)
    //   iconClass = this.getRegistrationIconClass(regSingle)
    //   headerText = this.getRegistrationStatusText(regSingle)
    // }


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
            <a target='_blank' href={'https://app.sproof.io/#/view/registration/'+registration.registration._id}><ExpansionPanelSummary
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


  renderError(error, onUploadClick) {
    let {classes} = this.props;
    let additionalText, icon = 'sad';

    let iconClass = classes.checkIconColor;

    let errorHeader = `${error.status} Error`
    console.log(error.status)
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

    //let result = {"result":[{"validation":{"registration":true,"profile":true},"registration":{"dependencies":[],"valid":true,"receivers":[],"_id":"0x66873992085befaf9cd7aa7c9889ad4b15d3dc35ca26012628b294f118ffa08c","issuer":"0x10f21a10316d5d533e1413137df4be126d108644","event":{"_id":"0xafd315aeecd398d1053d09e5929f414791721f4200c56189c333f9dc407c4248","eventType":"DOCUMENT_REGISTER","data":{"documentHash":"0x005f7a128084a98444d9c6d5dbe41ed0a23f23bd548c2295e90138896652bb7f","name":"sproof: A platform for issuing and verifying documents in a public blockchain"},"transaction":{"events":["0xafd315aeecd398d1053d09e5929f414791721f4200c56189c333f9dc407c4248","0x3796e6cf37888e588870b430e6429052a8189977a37fc1f5bff53f2207a13356"],"_id":"0xcc8879273f1e7e106846638d81bacfc20c4e8d8645dd99c9c70b60489054ddfc","blockNumber":5964355,"blockHash":"0xaabd1b8ee1b772ad32351d61b6ba3759a52d9447746f0704602d991bdf5392f6","transactionHash":"0x93d5baaba451ca38a91292486ae860cf8ec9e11b00da532153f3da6bb4196500","from":"0x10f21a10316d5d533e1413137df4be126d108644","timestamp":1562780889,"dhtHash":"QmPEP8Z3eJYLLBdWbQzyyrn6hti2Rg75NmK3om2BMf6Aib","chainId":"3","chain":"ethereum","nonce":3},"from":"0x10f21a10316d5d533e1413137df4be126d108644","blockNumber":5964355,"timestamp":1562780889},"timestamp":1562780889,"validFrom":null,"validUntil":null,"documentHash":"0x005f7a128084a98444d9c6d5dbe41ed0a23f23bd548c2295e90138896652bb7f","name":"sproof: A platform for issuing and verifying documents in a public blockchain"},"profile":{"votesIn":{"up":["0xa45173a76f46838d4dec97a821e2bcb3a8ade103"],"down":[]},"votesOut":{"up":[],"down":[]},"confirmedWebsite":true,"events":["0x02ffee28e7e7b1d0ca4d4c84483a96aff7053e05261da8545ca5ce4dfdf5c5bc","0x6996b4d93d2295311587124bf16a0c4c1e6764f452f3c5b16d6d8574bed2fef0","0xafd315aeecd398d1053d09e5929f414791721f4200c56189c333f9dc407c4248","0x3796e6cf37888e588870b430e6429052a8189977a37fc1f5bff53f2207a13356"],"registrations":[],"valid":true,"_id":"0x10f21a10316d5d533e1413137df4be126d108644","data":{"image":"QmQFKzphjvy7RT13vEzgxLmds5KqWuP3T7ayK48ZWuN656","name":"Clemens Brunner","website":"https://app.sproof.io"},"counts":{"events":4,"confPosIn":1,"confPosOut":0,"confNegIn":0,"confNegOut":0,"registrations":1,"transactions":3},"publicKey":"0x4502ac4474e2eae40fbf072053c5743b6868784dde87723f9723b677cb55fa872998cb3b5d894a77007957a074c3e8ca6d4aaf240e4f73e288d110238b566c30","timestamp":1562780589,"lastUpdate":1562780889,"lastWebsiteCheck":1563127669}},{"validation":{"registration":true,"profile":true},"registration":{"dependencies":[],"valid":true,"receivers":[],"_id":"0x26d627d0b2a6cba0c8316aaa184083d882e6affc07d50988adcf7f5669f5cfac","issuer":"0x711d88f76c98a023a7ecf27e167df3f533661626","event":{"_id":"0x2ad48f565d69e9198a88554a592b94f0a98ba88adcd7ae9f2f1aca0c41f61683","eventType":"DOCUMENT_REGISTER_BULK","data":[{"documentHash":"0x005f7a128084a98444d9c6d5dbe41ed0a23f23bd548c2295e90138896652bb7f","locationHash":"QmQxv1zbzyb8F8HppW6VFkSrEpKJYapfMXtSwSrrwnL3m6","documentId":"0xd7be164a18cafb90aeb33ee38d1929a21d3658e7c168c1c2da3ed468d021dca1"}],"transaction":{"events":["0x2ad48f565d69e9198a88554a592b94f0a98ba88adcd7ae9f2f1aca0c41f61683"],"_id":"0x3d15c8dc93dd05ece33952bfc0fa542c40b93e58950dbf18bb37ee416d53fef6","blockNumber":5992121,"blockHash":"0x6774b98bc29cf62d55300b9977174181530f6bc5b410df394754c0d6c4094bf1","transactionHash":"0xf71088135d2bf8a4f9e14d32b96338115cd7aae42eaf3a8083e37428d0dbf3d5","from":"0x711d88f76c98a023a7ecf27e167df3f533661626","timestamp":1563192278,"dhtHash":"QmTXeUSUkSyytxGBEu7jn6HUFvcUkz7Xmz5zuxrZ828FiL","chainId":"3","chain":"ethereum","nonce":2},"from":"0x711d88f76c98a023a7ecf27e167df3f533661626","blockNumber":5992121,"timestamp":1563192278},"timestamp":1563192278,"validFrom":null,"validUntil":null,"documentHash":"0x005f7a128084a98444d9c6d5dbe41ed0a23f23bd548c2295e90138896652bb7f","locationHash":"QmQxv1zbzyb8F8HppW6VFkSrEpKJYapfMXtSwSrrwnL3m6"},"profile":{"votesIn":{"up":[],"down":[]},"votesOut":{"up":[],"down":[]},"confirmedWebsite":false,"events":["0x19d5be0d6b4964610f3834dd4f14cf770e1cee88cf841aa78112d6adcc660a48","0x2ad48f565d69e9198a88554a592b94f0a98ba88adcd7ae9f2f1aca0c41f61683"],"registrations":[],"valid":true,"_id":"0x711d88f76c98a023a7ecf27e167df3f533661626","data":{"image":"QmeD3rE7MGvV1AXr9mY5JWfX4YBKaSUkwUKynMFs8V9jaX","name":"Zentrum für sichere Energieinformatik (ZSE)","website":"https://en-trust.at"},"counts":{"events":2,"confPosIn":0,"confPosOut":0,"confNegIn":0,"confNegOut":0,"registrations":1,"transactions":2},"publicKey":"0xbff7b2ad29abce2678e71c3540d8fe1e820a9b3b6877320da01ef995b7d9bedb399371e66b95b67812741d732e820127d8a2ee91b132ba4f20324bf9c5957f91","timestamp":1563183319,"lastUpdate":1563192278,"lastWebsiteCheck":1563204239}},{"validation":{"registration":true,"profile":true},"registration":{"dependencies":[],"valid":true,"receivers":[],"_id":"0x3a1cb2dd2f1f8528113dfa12be4f7b6eac4d991f280cd3030b56d8bf13c4feaa","issuer":"0xa45173a76f46838d4dec97a821e2bcb3a8ade103","event":{"_id":"0x228a7608cb04440d590720dea3fbb9699f1fb3926ad588670495c83a7cb8d2cc","eventType":"DOCUMENT_REGISTER_BULK","data":[{"documentHash":"0x005f7a128084a98444d9c6d5dbe41ed0a23f23bd548c2295e90138896652bb7f","locationHash":"QmQxv1zbzyb8F8HppW6VFkSrEpKJYapfMXtSwSrrwnL3m6","documentId":"0xd7be164a18cafb90aeb33ee38d1929a21d3658e7c168c1c2da3ed468d021dca1"}],"transaction":{"events":["0x228a7608cb04440d590720dea3fbb9699f1fb3926ad588670495c83a7cb8d2cc"],"_id":"0x81ee2240935cb9d585a111ac5e7857ccb09a166f91e8179a9206bc0579b019ce","blockNumber":5992133,"blockHash":"0xee898ae4c258b37a5d84c6ff4a15c615bb18bcaf6076c3e7839cd504d59bd0cf","transactionHash":"0x7e3ba8e19d657e3dcde23ee31af764599d0749827d00a6f26ed9d63e5b987131","from":"0xa45173a76f46838d4dec97a821e2bcb3a8ade103","timestamp":1563192407,"dhtHash":"QmdsKCcc6QPvQgPj8ugoQ55hCFZQBswB2cPsBAG9XsKm9t","chainId":"3","chain":"ethereum","nonce":19},"from":"0xa45173a76f46838d4dec97a821e2bcb3a8ade103","blockNumber":5992133,"timestamp":1563192407},"timestamp":1563192407,"validFrom":null,"validUntil":null,"documentHash":"0x005f7a128084a98444d9c6d5dbe41ed0a23f23bd548c2295e90138896652bb7f","locationHash":"QmQxv1zbzyb8F8HppW6VFkSrEpKJYapfMXtSwSrrwnL3m6"},"profile":{"votesIn":{"up":[],"down":[]},"votesOut":{"up":["0x10f21a10316d5d533e1413137df4be126d108644"],"down":[]},"confirmedWebsite":false,"events":["0x4a0f00cf650c1fc15e22cce74b26b51436188bc27dbd12c4baca0499f3379369","0x690928ae099a1d287dd2f75d6a0b199171b78c5921edf15921ec189a60f6beec","0x0d57cd181b7aedb2c2484a70ca483994d3926722ff0532d04a93a44ef493c3f6","0xf1d859d28ac81fbd132ecbba17647eb1a25879f3cea57e9435eb78acf6537008","0x9134374527461419818eb5ee2b5e0d76e633da8c6f6b0de23d3bc19275ce9ad7","0x9884266f2b528d38554ba4375583e5f844021f2b31e3832d97ce1572eed44a30","0x4f88aa5561c73565f18617673ecb86fa767c94d28ab0d584d8ac9833e81b9c9f","0x1d4079bbff2ccab81a72d407c5913dc8b9e1f5ba2b09fe24c7df1c8a24caf33e","0xc4ba7d014ed3d0c177a9c5783036d53439b9eedb3f4fcbc1c2af8a069fa6df1b","0x9ed1ef70321978d8cf5447d3babf4bc9ef69bf512ebaba84c8ed550760aa7251","0x1ce23db7ad8687cd21a201ad18f48375f7a368685483b00a57df38395c21ab7d","0x32d28bfaf4f265a9923257b8c1dd791fffab5156f8c046a5f5e30bfeb32168e5","0x22d4619905d889267998ce699ea18764a1c4a30e18c227538565b03218e7bf18","0xfa6d31d408f8530583834c0c8aca20c5d3e4b1e50eecbdde24194fc187f54d8e","0xbe4768e7b28157beaec706ea4a4330a98e2d7718a2bdb09b412ab89e0471c4bd","0x939fd397c02791933379f96f045eac39a5b9a88b91cb9d3a43ac355132889c79","0x44868697685207059fe493c5037f1454cf144b108bd0a5f4703819ea79062227","0xd56328c05b97a5dad60ecf34e2cf7ec82ca71a45796ea7c926fd8a605f999e55","0x5ced13f754270290cc53ac62a3f2b3ae8a6a3181ae49e9cf07b9128a138f48ea","0x228a7608cb04440d590720dea3fbb9699f1fb3926ad588670495c83a7cb8d2cc","0x90d8ee6343806a81725703105129daaba61eff6a5294486dac46c931f0123d4f","0x490d0ba540e841bac8cf93735233a037968588ce023ba14301584556ef21732a"],"registrations":[],"valid":true,"_id":"0xa45173a76f46838d4dec97a821e2bcb3a8ade103","data":{"image":"QmWXMb3H9RGMMwfTCNXTn8JZFR2UV5cyWzBtHGw72TGjQY","name":"sproof","website":"https://app.sproof.io"},"counts":{"events":22,"confPosIn":0,"confPosOut":1,"confNegIn":0,"confNegOut":0,"registrations":17,"transactions":21},"publicKey":"0x83c332eac7fde012c0e92f5eaa84a6b63e8a8eb1f47e25500d34115f2a787539065be1daac34b65dcc004390bc09f450ec8bf0cbea3e848e2e02534dfade6025","timestamp":1562870666,"lastUpdate":1563202149,"lastWebsiteCheck":1563204271}}],"error":null}

    //registrations = result.result;


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
                {!isLoading && registrations && {...this.renderRegistration(registrations, onClick)}}
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