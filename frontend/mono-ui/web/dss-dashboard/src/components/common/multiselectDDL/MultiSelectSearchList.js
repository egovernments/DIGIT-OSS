import React, { Component } from 'react';
import { Container, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import FontAwesomeIcon from "react-fontawesome";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';

import UiDropDown from '../UiDropDown/UiDropDown';

import styles from './Style';


class MultiSelectSearchList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isSelectAll:false,
            dropDownSelectedValue: [],
            searchValue: '',
            dropDownList: [],
            selectionList: []
        }
        this.selectAllList = this.selectAllList.bind(this);
        this.selectItem = this.selectItem.bind(this);
    }

    componentDidMount() {
        this.setState({ selectionList: this.props.selectionList });
    }

    searchList(event) {
        this.setState({ searchValue: event.target.value });
    }

    selectAllList(event) {

        this.setState({isSelectAll:!this.state.isSelectAll})
        let updatedList = Object.assign([],this.state.selectionList);
        updatedList.map((item) => {
            item.checked = event.target.checked;
        });        
        this.setState({dropDownSelectedValue:updatedList});

    }

    selectItem(index,value,event) {
        let selected = this.state.dropDownSelectedValue;
        selected[index] = {item:value,checked:event.target.checked};
        this.setState({dropDownSelectedValue:selected});
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <div className={classes.row}>
                    {
                        this.props.select &&
                        <UiDropDown error={(this.props.ERROR && this.props.ERROR.selectitem)} defaultSelectedItem={this.state.selectedItem} open={this.state.isOpen} select={this.setSelectItem} item={this.state.list || []} width={"100%"} />

                    }
                    {
                        this.props.search &&
                        <div className={classes.searchSection}>
                            <InputGroup className={classes.inputCnt}>
                                <Input placeholder="Search" className={classes.searchInput} onChange={(event) => this.searchList(event)} />
                                <InputGroupAddon addonType="append" className={classes.searchCnt}>
                                    <FontAwesomeIcon name={"search"} className={[classes.searchIcon, "fa fa-search"].join(' ')} />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    }
                </div>

                <div className={classes.listCnt}>
                    <FormControlLabel value={'selectall'} classes={{ label: classes.checkbox }} control={<Checkbox
                        checked={this.state.isSelectAll}
                        className={classes.checkboxinput}
                        onChange={(event) => this.selectAllList(event)}
                        disableRipple
                        value="selectAll"
                    />} label="Select All" />
                    {this.state.selectionList &&
                        <div className={classes.list}>
                            {this.state.selectionList.map((item, index) => {
                                if (this.state.searchValue.length === 0 || item.title.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1) {
                                    let checked = (this.state.dropDownSelectedValue[index])?this.state.dropDownSelectedValue[index].checked:false;
                                    return (
                                        <FormControlLabel key={index} value={item.value} classes={{ label: classes.checkbox}} control={<Checkbox
                                            checked={checked}
                                            className={classes.checkboxinput}
                                            onChange={(event) => this.selectItem(index,item.value,event)}
                                            disableRipple
                                            value={item.value}
                                        />} label={item.title} />
                                    )
                                }

                            })}
                        </div>
                    }
                </div>

            </div>


        )
    }

}

export default withStyles(styles)(MultiSelectSearchList);