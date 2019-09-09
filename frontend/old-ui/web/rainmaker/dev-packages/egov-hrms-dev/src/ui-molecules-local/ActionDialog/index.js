import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const data = {
  title: "Deactivate Employee",
  content: {
    dropdown: {
      text: "Reason for Deactivation",
      items: [
        { value: "ASD", label: "Asd" },
        { value: "OTHERS", label: "Others" }
      ]
    },
    datepicker: true,
    textInput1: {
      text: "Order No.",
      placeholder: "Enter Order No."
    },
    fileupload: true,
    textInput2: {
      text: "Remarks",
      placeholder: "Enter Remarks"
    }
  }
};

const styles = theme => ({
  formControl: {
    minWidth: 400,
    width: "100%"
  },
  textField: {
    marginTop: 20,
    width: "100%"
  }
});

class ActionDialog extends React.Component {
  deactivateEmployeeClick() {
    console.log("DEACTIVATE EMPLOYEE!");
  }

  render() {
    const {
      classes,
      open,
      onFieldChange,
      screenKey,
      componentJsonpath
    } = this.props;
    return (
      <div>
        <Dialog
          open={open}
          onClose={() =>
            onFieldChange(screenKey, componentJsonpath, "props.open", false)
          }
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{data.title}</DialogTitle>
          <DialogContent>
            <FormControl className={classes.formControl} required="true">
              <InputLabel shrink htmlFor="age-label-placeholder">
                {data.content.dropdown.text}
              </InputLabel>
              <Select
                onChange={this.handleChange}
                input={<Input name="age" id="age-label-placeholder" />}
                displayEmpty
                name="age"
                className={classes.selectEmpty}
              >
                {data.content.dropdown.items.map(item => {
                  return <MenuItem value={item.value}>{item.label}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <TextField
              id="date"
              label="Date"
              type="date"
              className={classes.textField}
              required="true"
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              id="order"
              label="Order No."
              placeholder="Enter Remarks"
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
            />
            <Typography className={classes.textField}>
              Supporting Documents
            </Typography>
            <Typography variant="caption" gutterBottom>
              Only .jpg and .pdf files. 5MB max file size.
            </Typography>
            <Button variant="outlined" className={classes.button}>
              UPLOAD FILE
            </Button>
            <TextField
              id="remarks"
              label="Remarks"
              placeholder="Enter Remarks"
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.deactivateEmployeeClick}
              color="primary"
              variant="contained"
            >
              DEACTIVATE EMPLOYEE
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(ActionDialog);
