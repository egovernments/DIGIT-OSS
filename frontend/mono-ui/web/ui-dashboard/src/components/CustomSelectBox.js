import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'material-ui/Form';
import { withStyles } from 'material-ui/styles';
import Select from 'material-ui/Select';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { ListItem } from 'material-ui/List';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 170,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

const CustomSelectBox = (props) => {
  const { data } = props;
  const options = data.map(item => (
    <MenuItem value={item} key={item}>
      {item}
    </MenuItem>
  ));

  return (
    <ListItem>
      <FormControl className={props.classes.formControl}>
        <InputLabel htmlFor={props.id}>{props.name}</InputLabel>
        <Select name={props.id} value={props.value} onChange={props.handleChange}>
          <MenuItem value="all" key="all">
            All
          </MenuItem>
          {options}
        </Select>
      </FormControl>
    </ListItem>
  );
};

CustomSelectBox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
};

CustomSelectBox.defaultProps = {
  data: [],
};

export default withStyles(styles, { withTheme: true })(CustomSelectBox);
