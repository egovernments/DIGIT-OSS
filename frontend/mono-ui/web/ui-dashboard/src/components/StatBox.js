import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  card: {
    minWidth: 180,
    marginBottom: 12,
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  title: {
    color: '#FF9800',
    'font-weight': 'bold',
  },
});

const StatBox = (props) => {
  const { classes, dataTransformer } = props;
  let { value } = props;
  if (value) {
    if (typeof dataTransformer === 'function') value = dataTransformer(value);
  }
  return (
    <Card raised className={classes.card}>
      <CardContent>
        <Typography className={classes.title} variant="headline" component="h2">
          {value}
        </Typography>
        <Typography className={classes.pos}>{props.heading}</Typography>
      </CardContent>
    </Card>
  );
};

StatBox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  heading: PropTypes.string.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  dataTransformer: PropTypes.func,
};

StatBox.defaultProps = {
  value: '',
  dataTransformer: undefined,
};

export default withStyles(styles)(StatBox);
