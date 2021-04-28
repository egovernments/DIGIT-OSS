const navPillsStyle = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#fff",
    width: '100%'
  },
  tabsRoot: {
    borderBottom: "1px solid #e8e8e8"
  },
  tabsIndicator: {
    backgroundColor: theme.palette.primary.main
  },
  tabRoot: {
    textTransform: "initial",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:hover": {
      color: theme.palette.primary.main,
      opacity: 1
    },
    "&$tabSelected": {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightMedium
    },
    "&:focus": {
      color: theme.palette.primary.main
    }
  },
  tabSelected: {},
  tabContent: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 0,
    paddingRight: 0
  }
});

export default navPillsStyle;