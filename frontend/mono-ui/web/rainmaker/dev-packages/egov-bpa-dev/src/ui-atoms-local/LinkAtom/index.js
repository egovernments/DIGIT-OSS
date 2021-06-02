import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { LabelContainer } from "egov-ui-framework/ui-containers";

const styles = {
  root: {
    color: 'rgba(0, 0, 0, 0.54)',
    // fontSize: '16px',
    fontWeight: "bold",
    // paddingBottom: "6px",
    fontSize: "12px",
    // lineHeight: '1.375em',
  },
  linkDetails : {
    color: 'rgb(245, 117, 66)',
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'Roboto',
    lineHeight: '19px',
    letterSpacing: '0.67px',
    textDecoration : 'none',
    '&:hover':{
      color: 'rgb(245, 117, 66)',
    },
    '&:active':{
      color: 'rgb(245, 117, 66)',
    },
    '&:visited':{
      color: 'rgb(245, 117, 66)',
    },
    '&:link':{
      color: 'rgb(245, 117, 66)',
    }

  },
};

const LinkAtom = (props) => {
  const {
    linkDetail,
    classes
  } = props;
  return (
    <div>
        <div className={classes.root}><LabelContainer labelKey={linkDetail.labelName}/></div>
        {linkDetail.value ? 
         <a className={classes.linkDetails} href={linkDetail.value} target="_blank"  rel="noopener noreferrer">
          {linkDetail.valueName}
        </a>: <div className={classes.linkDetails}>{linkDetail.valueName}</div>} 
      </div>
  );
};

// LinkAtom.propTypes = {
// };
export default withStyles(styles)(LinkAtom);