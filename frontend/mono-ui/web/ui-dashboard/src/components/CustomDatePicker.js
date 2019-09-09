import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import { ListItem } from 'material-ui/List';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    margin: theme.spacing.unit,
    minWidth: 170,
  },
});

const CustomDatePicker = (props) => {
  const { classes } = props;
  return (
    <ListItem>
      <form className={classes.container} noValidate>
        <TextField
          id={props.id}
          name={props.id}
          label={props.name}
          type="date"
          className={classes.textField}
          onChange={props.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
    </ListItem>
  );
};

CustomDatePicker.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};
export default withStyles(styles)(CustomDatePicker);
