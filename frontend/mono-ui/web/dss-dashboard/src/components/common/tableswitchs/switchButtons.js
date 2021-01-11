import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import styles from './styles';
import { getLocaleLabels } from '../../../utils/commons';

class SwitchButton extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: this.props.chartParent[0].id,
            // value: 'demandCollectionIndexBoundaryRevenue'
        }
    }
    handleAlignment = (event, newValue) => {
        this.setState({
            value: newValue
        })
        this.props.clickFromTab(newValue,event.currentTarget.innerText);
    };

    render() {
        let { classes, chartParent,strings={} } = this.props;
        //let switchLabel = ["Boundary", "Usage"];
        return (
            <ToggleButtonGroup
                value={this.state.value}
                exclusive
                defaultChecked={true}
                onChange={this.handleAlignment}
                aria-label="text alignment"
            >
                {chartParent.map((d, i) =>
                    <ToggleButton key={i} checked={this.state.value === d.id} className={classes.toggleButton} value={d.id} aria-label="left aligned" >{getLocaleLabels(`DSS_TAB_${d.tabName}`,strings)}</ToggleButton>
                )}
            </ToggleButtonGroup>
        );
    }
}

export default withStyles(styles)(SwitchButton);
