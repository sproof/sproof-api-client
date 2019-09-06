
const userStyle = theme => ({
  image: {
    marginBottom: '0',
    overflow: 'visible',
    maxWidth: '400px',
    maxHeight: '400px',
    width: '100%',
    height: 'auto'
  },

  listItem : {
    color: theme.palette.primary.main
  },

  container: {
    position: 'relative',
    minHeight: '100%'
  },

  card: {
    position: 'relative'
  },

  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },

  iconLeft: {
      marginLeft: theme.spacing.unit
  },

  iconRight: {
    right: theme.spacing.unit,
    position: 'absolute'
  },
  media: {
    padding: 8,
    width: '100%'
  }
});
export default userStyle;
