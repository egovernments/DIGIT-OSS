import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles/Card";
import history from '../../../utils/web.history'

const useStyles = makeStyles(styles);

function handleNavigation(page) {
  history.push(`${process.env.PUBLIC_URL}/`+ page)
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
    <div onClick={()=> handleNavigation(page)} style={{  cursor: 'pointer' }}>
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