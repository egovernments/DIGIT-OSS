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

const StackedBarChart = (props) => {
  const { dataTransformer } = props;
  let { data } = props;
  if (data) {
    if (typeof dataTransformer === 'function') data = dataTransformer(data);
  }
  const { closed, open } = data;
  if (closed && open) {
    for (let i = 0; i < open.length; i += 1) {
      const curr = closed[i];
      curr.open = open[i].open;
    }
  }

  return (
    <Card raised className={props.classes.card}>
      <CardContent>
        <Typography className={props.classes.pos}>{props.heading}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart isAnimationActive data={closed}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="closed" name="Closed" legendType="circle" fill="#0088FE" />
            <Bar dataKey="open" name="Open" legendType="circle" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

StackedBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  heading: PropTypes.string.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  dataTransformer: PropTypes.func,
};

StackedBarChart.defaultProps = {
  data: {},
  dataTransformer: undefined,
};

export default withStyles(styles)(StackedBarChart);
