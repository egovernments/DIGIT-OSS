import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles/Card";
import history from '../../../utils/web.history';


/* Enabled modules will get redirected to new digit - ui , will revisit this constant to move into some mdms config  */
const enabledModulesInDigitUI = ["fsm","mCollect","ws","noc","obps","national-firenoc","national-mcollect","national-ws","nss-obps","national-overview","national-propertytax","national-tradelicense","national-pgr","national-overview","nss-birth-death","birth-death","finance"];

const useStyles = makeStyles(styles);

function handleNavigation(page) {
  if (page && page.includes && page.includes('digit-ui')) {
    window.location.href = page.startsWith('/digit') ? page : `/${page}`;
    return;
  } else if (page && page.includes && enabledModulesInDigitUI.includes(page)) {
    let homeWindow=window.parent;
    homeWindow.open(`/digit-ui/employee/dss/dashboard/${page}`, '_self')
    return;
  } else {
    history.push(`${process.env.PUBLIC_URL}/` + page);
  }

}

export default function Card(props) {
  const classes = useStyles();
  const { className, children, color, bgColor, plain, profile, chart, page, ...rest } = props;
  const cardClasses = classNames({
    [classes.card]: true,
    [classes[color + "Card"]]: color,
    [classes.cardPlain]: plain,
    [classes.cardProfile]: profile,
    [classes.cardChart]: chart,
    [className]: className !== undefined
  });
  return (
    <div onClick={() => handleNavigation(page)} style={{ cursor: 'pointer' }}>
      <div className={cardClasses} {...rest} style={{ backgroundColor: bgColor }}>
        {children}
      </div>
    </div>
  );
}

Card.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  chart: PropTypes.bool,
  children: PropTypes.node
};
