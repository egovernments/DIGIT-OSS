import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import { BarChart, XAxis, YAxis, Bar, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
});

const CustomBarChart = (props) => {
  const { classes, data } = props;
  return (
    <Card raised className={classes.card}>
      <CardContent>
        <Typography className={classes.pos}>{props.heading}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart isAnimationActive layout="vertical" data={data}>
            <XAxis type="number" />
            <YAxis dataKey={!props.labelKey && 'name'} type="category" />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={!props.valueKey && 'value'}
              name="Complaints"
              legendType="circle"
              fill="#0088FE"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

CustomBarChart.propTypes = {
  heading: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
  })),
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
};

CustomBarChart.defaultProps = {
  labelKey: undefined,
  valueKey: undefined,
  data: [],
};

export default withStyles(styles)(CustomBarChart);
