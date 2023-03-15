import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles/CardIconStyles";

const useStyles = makeStyles(styles);

export default function CardIcon(props) {
  const classes = useStyles();
  const { className, children, color, bgColor,...rest } = props;
  const cardIconClasses = classNames({
    [classes.cardIcon]: true,
    [classes[color + "CardHeader"]]: color,
    [className]: className !== undefined
  });
  return (
    <div className={cardIconClasses} {...rest} style={{color: 'white', background: bgColor, width:'60px', height: '63px'}}> 
      {children}
    </div>
  );
}

CardIcon.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};