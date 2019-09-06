let customTheme = {
  overrides: {
    MuiAvatar: {
      img: {
        // handle correctly non-square images
        objectFit: 'cover',
        height: null,
        width: '100%'
      }
    },
    MuiTab : {
      wrapper: {
        flexDirection: 'row !important'
      }
    },

    MuiButton: {
      root: {
        color: '#FFFFFF',
        borderWidth: '2px',
        padding: '26px',
        paddingBottom: '13px',
        paddingTop: '13px',
        lineHeight: '24px !important',
        minWidth: '200px',
        fontSize: '12px !important',
        borderRadius: 'inherit',
        fontWeight: '600',
        letterSpacing: '1pt'
      }
    },
    MuiGrid: {
      container: {
        width: '100% !important',
        margin: '0 !important'
      },
      item : {
        wordWrap : 'break-word !important'
      }
    }
  },

  palette: {
    primary: { main: '#42e48b', text: '#FFFFFF' }, // Purple and green play nicely together.
    //primary: { main: '#343434' }, // Purple and green play nicely together.
    secondary: {
      main: '#42e48b',
      text: '#FFFFFF'
    },
    success: '#42e48b',
    warning: '#eaac33',

  },
  iFrameBtn : {
    color: '#ffffff',
    background: '#42e48b',
    borderWidth : '2px',
    padding: '26px',
    paddingBottom: '13px',
    paddingTop: '13px',
    lineHeight: '24px',
    minWidth: '200px',
    fontSize: '12px !important',
    borderRadius: 'inherit',
    fontWeight : '600',
  },

  typography: {
    color: '#333333',
    useNextVariants: true,
    fontFamily: [
      'Catamaran',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    button: {
      fontWeight: 800,
      fontSize: 14.65,
    },

    headline : {
      fontSize: 25,
      paddingTop: 20,
      fontWeight: 'bold'
    }
  }
};

export default customTheme;