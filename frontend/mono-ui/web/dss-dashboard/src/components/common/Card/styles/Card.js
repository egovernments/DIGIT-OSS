import {
  blackColor,
  whiteColor,
  hexToRgb
} from "../../../../assets/Home";

const cardStyle= theme => ({
  card: {
    border: "0",
    marginBottom: "30px",
    marginTop: "30px",
    borderRadius: "6px",
    color: "rgba(" + hexToRgb(blackColor) + ", 0.87)",
    background: whiteColor,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12)",

    },
    position: "relative",
    display: "flex",
    flexDirection: "column",
    wordWrap: "break-word",
    fontSize: ".875rem"
  },
  cardPlain: {
    background: "transparent",
    boxShadow: "none"
  },
  cardProfile: {
    marginTop: "30px",
    textAlign: "center"
  },
  cardChart: {
    "& p": {
      marginTop: "0px",
      paddingTop: "0px"
    }
  },
  '@media (max-width: 3000px)': {
    card: {
      minHeight: '205px',
    }
  },
  '@media (max-width:823px)': {
    card: {
      minHeight: '205px',
    }
  },
});

export default cardStyle;