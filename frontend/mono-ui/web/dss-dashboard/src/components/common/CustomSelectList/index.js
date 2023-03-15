import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import styles from './Style';
import CustomTextField from '../Inputs/TextInput/CustomTextField';
import Grid from '@material-ui/core/Grid';


class CustomSelectList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: [],
            rowData: []
        };
        this.UpdateParentWithData = this.UpdateParentWithData.bind(this)
    }

    handleToggle = (value, idx) => () => {
        const { checked, rowData } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        const newRowData = [...rowData]
        if (currentIndex === -1) {
            newChecked.push(value);
            var selectesNode = this.getItemByKey(value);
            newRowData.push({
                ...selectesNode[0],
                Username: '',
                password: '',
                path: ''
            });
        } else {
            newChecked.splice(currentIndex, 1);
            newRowData.splice(currentIndex, 1)
        }

        this.setState({
            checked: newChecked,
            rowData: newRowData
        });
        let { needTextboxs } = this.props;
        if (!needTextboxs) {
            this.updateParent(newChecked);
        }else{
            this.props.updateParentTextBoxData(newRowData);
        }
    };

    updateValues(val, tar) {
        const { checked } = this.state;
        var target = tar.split('.')[0];
        var Key = tar.split('.')[2];
        var newdata = {};
        const currentIndex = checked.indexOf(Key);
        Object.assign(newdata, this.state.rowData);
        switch (target) {
            case 'Username':
                newdata[currentIndex].Username = val;
                this.setState({
                    rowData: newdata
                })
                break;
            case 'password':
                newdata[currentIndex].password = val;
                this.setState({
                    rowData: newdata
                })
                break;
            case 'path':
                newdata[currentIndex].path = val;
                this.setState({
                    rowData: newdata
                })
                break;
        }
        this.UpdateParentWithData()

    }
    UpdateParentWithData() {
        let { needTextboxs } = this.props;
        let { rowData } = this.state;
        if (needTextboxs && typeof (this.props.updateParentTextBoxData) === 'function') {
            this.props.updateParentTextBoxData(rowData)
        }

    }

    getSelectedObjects(newChecked) {
        let { UniqueProp, items } = this.props;
        return items.filter(item => {
            return newChecked.indexOf(item[UniqueProp]) != -1
        })
    }

    updateParent(newChecked) {
        let { items } = this.props;
        if (items[0] && typeof (items[0]) === 'object') {
            this.props.updateSelected(this.getSelectedObjects(newChecked))
        } else {
            this.props.updateSelected(newChecked)
        }

    }
    getItemByKey(key) {
        let { UniqueProp, items } = this.props;
        return items.filter(item => {
            return item[UniqueProp] + '' === key + ''
        })
    }
    getItemForSelect(obj) {
        let { UniqueProp } = this.props;
        if (typeof (obj) === 'object') {
            return obj[UniqueProp] + '';
        } else {
            return obj;
        }
    }
    getItemForDisplay(obj) {
        if (typeof (obj) === 'object') {
            return Object.keys(obj).map(function (k) { return obj[k] }).join(",");
        } else {
            return obj;
        }
    }

    render() {
        let { classes, items, maxHeight, NeedCheckbox, needTextboxs } = this.props;
        var maximumHeight = maxHeight || '100%';
        return (
            <div className={classes.root}>
                <List className={classes.alternativeColor}>
                    {items.map((value, index) => (
                        <ListItem
                            key={this.getItemForSelect(value)}
                            role={undefined}
                            dense
                            disableRipple
                            button
                            divider={true}
                            className={classes.listItem}
                        >
                            <Grid container spacing={24}>
                                <Grid item lg={1} sm={1}>
                                    {NeedCheckbox
                                        ?
                                        <Checkbox
                                            checked={this.state.checked.indexOf(this.getItemForSelect(value)) !== -1}
                                            tabIndex={-1}
                                            onClick={this.handleToggle(this.getItemForSelect(value), index)}
                                            disableRipple
                                            className={classes.checkboxClass}
                                        />
                                        : null}
                                </Grid>
                                <Grid item lg={10} sm={10}>
                                    <ListItemText className={classes.listItemTest} primary={this.getItemForDisplay(value)} />
                                </Grid>
                            </Grid>
                            {needTextboxs && this.state.checked.indexOf(this.getItemForSelect(value)) !== -1
                                ?
                                <Grid container spacing={24}>
                                    <Grid item lg={4} sm={4}>
                                        <CustomTextField type="text" label={'User Name'} target={`Username.${index}.${this.getItemForSelect(value)}`} UpdateValues={this.updateValues.bind(this)} />
                                    </Grid>
                                    <Grid item lg={4} sm={4}>
                                        <CustomTextField type="text" label={'Password'} target={`password.${index}.${this.getItemForSelect(value)}`} UpdateValues={this.updateValues.bind(this)} />
                                    </Grid>
                                    <Grid item lg={4} sm={4}>
                                        <CustomTextField type="text" label={'Path'} target={`path.${index}.${this.getItemForSelect(value)}`} UpdateValues={this.updateValues.bind(this)} />
                                    </Grid>
                                </Grid>
                                : null
                            }

                            {/* <div classname={classes.box}>



                                <div classname={classes.box}>

                                    <div className={classes.inputContainer}>
                                        <br />



                                    </div>
                                    : null
                                }
                                </div>
                            </div> */}
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    }
}
CustomSelectList.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CustomSelectList);