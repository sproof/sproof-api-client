import customTheme from './customTheme';

const theme = {

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
    primary: { main: '#42e48b', text: '#333333' }, // Purple and green play nicely together.
    //primary: { main: '#343434' }, // Purple and green play nicely together.
    secondary: {
      main: '#a6a6a6',
      text: '#FFFFFF'
    }, // This is just green.A700 as hex.
    success: '#42e48b',
    warning: '#eaac33'
  },
  // button: {
  //   height: 40,
  //     paddingLeft: 16,
  //     paddingRight: 16
  // },

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
      // letterSpacing: 1.25,
      fontSize: 14.65,
      fontFamily: "'Catamaran', sans-serif",
      //marginRight: 16
    },



    headline : {
      fontFamily: "'Catamaran', sans-serif",
      fontSize: 25,
      fontWeight: 'bold'
    }
  }
};

export default {...theme, ...customTheme};