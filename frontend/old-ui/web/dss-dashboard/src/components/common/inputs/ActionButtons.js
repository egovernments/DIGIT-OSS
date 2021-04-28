import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import styles from './ActionButtonsStyles';
import { Tooltip } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import MoreVertIcon  from '@material-ui/icons/MoreVert';
import CloudDownloadSharp from '@material-ui/icons/CloudDownloadSharp';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import RefreshIcon from '@material-ui/icons/Refresh';
import { isMobile } from 'react-device-detect';

class ActionButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonHovered: false
        }

    }

    handleClick(event) {
        this.props.handleClick(this.props.value, this.props.target, event)
    }

    renderInfoButton() {
        const { classes, text } = this.props;
        return (
            <Tooltip title= {text ? text : "Download"} classes={{ tooltip: classes.lightTooltip }} placement="top">
                <div>
                    <Button className={classes.cancelButton} onClick={this.handleClick.bind(this)}>
                        <MoreVertIcon    className={classes.Actionmenus}> {text} </MoreVertIcon >
                    </Button>
                </div>
            </Tooltip>
        );
    }
    renderDefaultButton() {
        const { classes, text, disabled, clas, type } = this.props;
        if(this.props.containedButton === true){
            return (
                <Tooltip title= {text ? text : "info"} classes={{ tooltip: classes.lightTooltip }} placement="top">
                    <div style={{marginRight: '2px'}}>
                        <Button disabled={disabled} variant="contained" onMouseLeave={()=>{this.setState({buttonHovered: false})}} onMouseEnter={()=>{this.setState({buttonHovered: true})}} className={`${classes.actionButton1} ${clas}`} onClick={this.handleClick.bind(this)} style={{color: 'white', backgroundColor: '#fe7a51', fontSize:this.props.fontSize ? this.props.fontSize : ''}}>
                            {text}
                        </Button>
                    </div>
                </Tooltip>
            );
        } else {
            return (
                <Tooltip title= {text ? text : "info"} classes={{ tooltip: classes.lightTooltip }} placement="top">
                    <div>
                        {(!isMobile && type==="clearButton") ?
                        <RefreshIcon
                        disabled={disabled} onMouseLeave={()=>{this.setState({buttonHovered: false})}} onMouseEnter={()=>{this.setState({buttonHovered: true})}} className={`${clas}`} onClick={this.handleClick.bind(this)} 
                        style={{
                            color:this.state.buttonHovered ? '#FE7A51': "#00000099", 
                            fontSize:"32px"}}/>
                            // this.props.fontSize ? this.props.fontSize : ''}}/>
                        :<Button disabled={disabled} onMouseLeave={()=>{this.setState({buttonHovered: false})}} onMouseEnter={()=>{this.setState({buttonHovered: true})}} className={`${classes.actionButton1} ${clas}`} onClick={this.handleClick.bind(this)} style={{color:this.state.buttonHovered ? 'white': "#96989a", fontSize:this.props.fontSize ? this.props.fontSize : ''}}>
                            {text}
                        </Button>}
                    </div>
                </Tooltip>
            );
        }
        
    }
    renderSmallButton() {
        const { classes, text, disabled, value, checked } = this.props;
        return (
            <ToggleButton
                key={value}
                value={value}
                aria-label="bold"
                disabled={disabled}
                disableRipple
                selected={checked}
                className={classes.actionButton_small}
                style={{padding: this.props.padding ? this.props.padding : '', fontSize: this.props.fontSize}}
                onClick={this.handleClick.bind(this)}>
                {text}
            </ToggleButton>
        )
    }
    renderBigButton() {
        const { classes, text, disabled, value, checked } = this.props;
        return (
            <ToggleButton
                key={value}
                value={value}
                aria-label="bold"
                disabled={disabled}
                disableRipple
                selected={checked}
                className={classes.actionButton_big}
                onClick={this.handleClick.bind(this)}>
                {text}
            </ToggleButton>
        )
    }
    renderDownloadButton() {
        const { classes, text } = this.props;
        return (
            <Tooltip title= {text ? text : "info"} classes={{ tooltip: classes.lightTooltip }} placement="top">
                <div className={`${classes.actionButton} ${classes.download}`} onClick={this.handleClick.bind(this)}>
                    {/* <Fab aria-label="download" > */}
                        <CloudDownloadSharp />
                    {/* </Fab> */}
                    {/* <Button disabled={disabled} className={`${classes.actionButton} ${clas}`} >
                        {text}
                    </Button> */}
                </div>
            </Tooltip>
        );
    }
    rederSwitch() {
        const { buttonType } = this.props;
        switch (buttonType) {
            case "default":
                return this.renderDefaultButton()
            case 'small':
                return this.renderSmallButton()
            case 'normal':
                return this.renderBigButton()
            case 'download':
                return this.renderDownloadButton()
                case 'info':
                    return this.renderInfoButton()
            default:
                return "na";
            // break;
        }
    }
    render() {
        return (
            this.rederSwitch()
        )
    }
}

export default withStyles(styles)(ActionButton);