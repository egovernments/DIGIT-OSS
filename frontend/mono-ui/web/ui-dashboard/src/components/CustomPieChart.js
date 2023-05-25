import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
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
    color: theme.palette.text.primary,
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
});

const CustomPieChart = (props) => {
  const {
    classes, labelKey, valueKey, heading, onClick, data, tooltip,
  } = props;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  let content;
  if (data) {
    content = data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />);
  }
  return (
    <Card raised className={classes.card}>
      <CardContent>
        <Typography className={classes.pos}>{heading}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              onClick={onClick}
              data={data}
              nameKey={!labelKey && 'name'}
              dataKey={!valueKey && 'value'}
              legendType="circle"
              outerRadius="100%"
              isAnimationActive
            >
              {content}
            </Pie>
            <Tooltip content={tooltip} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

CustomPieChart.propTypes = {
  heading: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.number,
  })),
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  tooltip: PropTypes.element,
};

CustomPieChart.defaultProps = {
  labelKey: undefined,
  valueKey: undefined,
  tooltip: undefined,
  data: [],
};

export default withStyles(styles)(CustomPieChart);
