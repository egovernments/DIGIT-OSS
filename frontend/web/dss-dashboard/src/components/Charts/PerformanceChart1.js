import React from 'react';
import { withStyles } from '@material-ui/core/styles';
const style = {
  maincls:{
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left'
  },
  progess : {
    margin: '5px 0px'
  },
  topLabel : {
    fontFamily: 'Roboto',
    fontSize: '12px',
    fontWeight: '500',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#000000'
  }    
}

class PerformanceChart1 extends React.Component{
    render(){
       const { classes } = this.props;
        return( <div>
                    <ul className="list-inline" style={{paddingBottom:'15px'}}>
                       <li className="pull-left">
                         <h6>Bottom 3 Performing ULBs</h6>
                       </li>
                       <li className="pull-right"><span className="pull-right"><i className="fa fa-info-circle"></i></span></li>
                       </ul>
                       <div className={classes.maincls}>
                         <span className={classes.progess}> Bhatinda (1st Rank)</span>
                         
                         <div className="progress">
                           <div className="progress-bar" role="progressbar" style={{width: '87%', backgroundColor: this.props.color}} aria-valuenow={87} aria-valuemin={0} aria-valuemax={100} />
                         </div>
                         <span className="label">CE: 87%</span>
                       </div>
                       <div className={classes.maincls}>
                         <span className={classes.progess}> Pathankot (2nd Rank)</span>
                         
                         <div className="progress">
                           <div className="progress-bar" role="progressbar" style={{width: '54%', backgroundColor: this.props.color}} aria-valuenow={84} aria-valuemin={0} aria-valuemax={100} />
                         </div>
                         <span>CE: 84%</span>
                       </div>
                       <div className={classes.maincls}>
                         <span className="pull-left"> Patiala (3rd Rank)</span>
                         
                         <div className="progress">
                           <div className="progress-bar" role="progressbar" style={{width: '11%', backgroundColor: 'red'}} aria-valuenow={81} aria-valuemin={0} aria-valuemax={100} />
                         </div>
                         <span>CE: 81%</span>
                       </div>
                     </div>)
    }
}

export default withStyles(style)(PerformanceChart1);