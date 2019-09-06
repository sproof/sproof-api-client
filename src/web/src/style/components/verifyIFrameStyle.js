const verifyIFrameStyle = theme => {

  let colorSuccess = theme.palette.success || '#42e48b';
  let colorWarning = theme.palette.warning || '#FF0000';

  let iFrameBtn = theme.iFrameBtn || {
    color: theme.palette.primary.text,
    background: theme.palette.primary.main,
    borderWidth : '2px',
    padding: '26px',
    paddingBottom: '13px',
    paddingTop: '13px',
    lineHeight: '24px',
    minWidth: '200px',
    fontSize: '12px !important',
    borderRadius: 'inherit',
    fontWeight : '600',
    border: `2px solid${theme.palette.primary.main} !important`,
    letterSpacing : '1pt',

    '&:hover': {
      background: theme.palette.primary.main
    }
  };

  return {

    iFrameButton: iFrameBtn,

    container: {
      minHeight: '100%',
    //  position: 'absolute',
      // top: 0,
      // bottom: 0,
      // left: 0,
      // right: 0,
      //margin: 'auto',
    },
    dragFilesContainer : {
      width: '100%',
      height:'100%',
      backgroundColor: 'white',
      zIndex: "1",
      opacity: '0.91',
      position: 'fixed',
      bottom: '0px',
      top: '0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    dragFilesBorder : {
      width: 'calc(100% - 50px)',
      position:'fixed',
      height:'calc(100% - 50px)',
      border: `8px dashed ${theme.palette.primary.main}`,
      borderRadius: '50px',
      bottom: '0px',
      top: '0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: "1",
      opacity: '0.91',
    },

    dragText: {
      fontWeight: 'bold'
    },

    successColor : {
      color: `${colorSuccess}`
    },

    warningColor : {
      color: `${colorWarning}`
    },

    header: {
      fontSize: '24px',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    p: {
      fontWeight: 'bold',
      textAlign: 'center',
    },


    rootWordpress: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }

  }
};

export default verifyIFrameStyle;