import 'date-fns';
import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CustomCalendar from './customCalander/cCalander';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import SwitchButton from '../switchButtons/switchButtons';
import { withStyles } from '@material-ui/core/styles';
import style from './style';
import moment from 'moment';
import _ from 'lodash';
import getFinancialYearObj from '../../../actions/getFinancialYearObj';

const year = (new Date()).getFullYear();
let fYearObj = getFinancialYearObj('',true)
class DateRange extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      currentDate: new Date(),
      fromDate: '',
      toDate: '',
      value: null,
      default:5,
      title: this.props.title1,
      fYearObj:fYearObj,      
      dateRanges: Array.from(new Array(20), (x, i) => i + year - 10),
      buttons: [{ key: "1", value: "Today" },
      { key: "2", value: "This Week" },
      { key: "3", value: "This Month" },
      { key: "4", value: "This Quarter" },
      { key: "5", value: fYearObj[0].title},
      { key: "6", value: fYearObj[1].title},
      { key: "7", value: "Custom" },
      ],
    }
  }
  handleCancel = () => {
    this.props.onClose();
  };

  handleOk = () => {
    let { handleSelectedOk } = this.props;
    handleSelectedOk(false, 'duration', this.getDateFilter(this.state.value))
  };

  getDuration(startDate, endDate) {
    let noOfDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)
    if (noOfDays > 91) {
      return 'month'
    }
    if (noOfDays < 90 && noOfDays >= 14) {
      return 'week'
    }
    if (noOfDays <= 14) {
      return 'day'
    }
  }

  getDateFilter(value) {
    switch (_.toUpper(value)) {
      case 'TODAY':

        return {
          title: "TODAY",
          value: {
            startDate: moment().startOf('day').unix(),
            endDate: moment().endOf('day').unix(),
            interval: 'day'
          }
        }
      case 'THIS WEEK':

        return {
          title: "WEEK",
          value: {
            startDate: moment().startOf('week').unix(),
            endDate: moment().endOf('week').unix(),
            interval: 'week'
          }
        }
      case 'THIS MONTH':
        return {
          title: "MONTH",
          value: {
            startDate: moment().startOf('month').unix(),
            endDate: moment().endOf('month').unix(),
            interval: 'week'
          }
        }
      case 'THIS QUARTER':
        return {
          title: "QUARTER",
          value: {
            startDate: moment().startOf('quarter').unix(),
            endDate: moment().endOf('quarter').unix(),
            interval: 'week'
          }
        }
      case 'THIS YEAR':
        return {
          title: "YEAR",
          value: {
            startDate: moment().startOf('year').unix(),
            endDate: moment().endOf('year').unix(),
            interval: 'month'
          }
        }
      case 'CUSTOM':
        let duration1 = this.getDuration(moment(this.state.from || new Date(), "DD/MM/YYYY"), moment(this.state.to || new Date(), "DD/MM/YYYY"))

        return {
          title: "CUSTOM",
          value: {
            startDate: moment(this.state.from || new Date(), "DD/MM/YYYY").startOf('day').unix(),
            endDate: moment(this.state.to || new Date(), "DD/MM/YYYY").endOf('day').unix(),
            interval: duration1
          }
        }

      default:
        return this.getFinancialYearObj(value)
    }
  }

  getFinancialYearObj(value){
      let fYearObj = this.state.fYearObj, returnObj;
      for(var i=0; i<fYearObj.length;i++){
        if(fYearObj[i] && fYearObj[i].title == value){
          returnObj = fYearObj[i];
          break;
        } 
      }
      return returnObj;
  }

  /**
   * this is for duration selection
   * @param {open or close state} open 
   * @param {target name} target 
   * @param {selected value} value 
   */
  handleChanges(open, target, value) {
    if (target) {
      this.setState({
        value: value,
        title: value
      })
    }
  }

  svgWrapper = ({ dangerouslySetInnerHTML, className }) => {
    return (
      <span
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        className={className}
      />
    );
  }
  selectCDate(target, value) {
    if (target) {
      this.setState({
        [target]: value,
      })
    }
  }
  render() {
    let { classes, open } = this.props;
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        aria-labelledby="date-range"
        open={open}

        classes={{ paper: classes.root }}
      >
        <DialogTitle style={{ fontFamily: 'Roboto', fontSize: '10px', color: '#fe7a51' }}>
          {this.state.title}
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.fils}>
            <SwitchButton
              data={this.state.buttons}
              selected={this.state.value ||  this.state.buttons[this.state.default].value}
              type="normal" target={"duration"} 
              handleSelected={this.handleChanges.bind(this)}>
            </SwitchButton>
          </div>
          {this.state.value === 'Custom' &&
            <div className={classes.calanderDisplay}>
              <div className={classes.calanderclass}>
                <CustomCalendar key="from" position="from" selectCDate={this.selectCDate.bind(this, 'from')} />
              </div>
              <div className={classes.to}>
                <span>to</span>
              </div>
              <div className={classes.calanderclass}>
                <CustomCalendar key="to" position="to" selectCDate={this.selectCDate.bind(this, 'to')} />
              </div>
            </div>
          }

        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button className={classes.cancelbtn} onClick={this.handleCancel.bind(this)}>
            {this.props.cancelBtn}
          </Button>
          <Button className={classes.okbtn} variant="contained" elevation={1} onMouseLeave={() => { this.setState({ buttonHovered: false }) }} onMouseEnter={() => { this.setState({ buttonHovered: true }) }} onClick={this.handleOk.bind(this)}>
            {this.props.selectBtn}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

}
export default withStyles(style)(DateRange)