import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ActionButton from '../inputs/ActionButtons';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import styles from './localStyles';

class SwitchButton extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }

    }

    handleAlignment = (event, newAlignment) => {
    };

    handleClick(value) {
        let { target } = this.props;
        this.setState({
            value: value
        });
        if (typeof this.props.handleSelected === 'function') {
            this.props.handleSelected(true, target, value)
        }

    }
    renderSmallbtns() {
        let { data, selected } = this.props;
        return data && data.map(item => {
            return (< ActionButton key={item.value}
                checked={item.value === selected}
                buttonType="small"
                value={item.value}
                targer={item.value}
                text={item.value}
                selected={item.value === selected}
                handleClick={this.handleClick.bind(this)}
                padding={this.props.padding}
                fontSize={this.props.fontSize}
            />
            )
        });
    }
    renderBigbtns() {
        let { data, selected } = this.props;
        return data && data.map(item => {
            return (< ActionButton key={item.value}
                checked={item.value === selected}
                buttonType="normal"
                value={item.value}
                targer={item.value}
                text={item.value}
                selected={item.value === selected}
                handleClick={this.handleClick.bind(this)}
            />
            )
        });
    }

    renderbtns() {
        let { type } = this.props;

        switch (type) {
            case "small":
                return this.renderSmallbtns();
            case "normal":
                return this.renderBigbtns();
            default:
                return this.renderSmallbtns();
        }

    }

    render() {
        let { classes, type, selected, topMmargin } = this.props;
        let classcontainer = type === 'small' ? classes.toggleContainer : classes.toggleContainer_big
        return (<div className={classes.togglemainContainer}>
            <ToggleButtonGroup key="switch-btn"
                style={{ marginTop : topMmargin ? topMmargin : '' }}
                className={classcontainer}
                value={this.state.value || selected}
                exclusive
                onChange={this.handleAlignment.bind(this)}
                aria-label="text alignment">
                {this.renderbtns()}
            </ToggleButtonGroup>
        </div>
        )
    }
}

export default withStyles(styles)(SwitchButton);