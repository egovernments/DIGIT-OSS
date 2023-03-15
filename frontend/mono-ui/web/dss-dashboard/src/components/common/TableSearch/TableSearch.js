import React, { Component } from 'react';
import styles from './Styles';
import { withStyles } from '@material-ui/core/styles';
import CustomTextField from '../inputs/TextInput/CustomTextField';
import _ from 'lodash';
import Search from '@material-ui/icons/Search'
import { getLocaleLabels } from '../../../utils/commons';

class TableSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displaySearchBox: true,
            isLocalSearch: true,
            searchText: ''
        }
        this.reduseSize = this.reduseSize.bind(this);
        this.renderSearchIcon = this.renderSearchIcon.bind(this);
        this.defaultSearch = this.defaultSearch.bind(this);
        this.columnSearch = this.columnSearch.bind(this);
        this.multipleSearch = this.multipleSearch.bind(this);
    }

    defaultSearch(list, value) {
        var newlist = _.filter(list, item => {
            var isFound = false;
            _.forOwn(item, kk => {
                if ((kk || '').toString().toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                    isFound = true
                }
            })
            return isFound
        });
        this.props.updated(newlist);
    }
    columnSearch(list, pair) {
        var newlist = _.filter(list, item => {
            var isFound = false;
            _.forOwn(item, (kk, vv) => {
                if (_.chain(pair).get('column').eq(vv)) {
                    if ((kk || '').toString().toLowerCase().indexOf(_.get(pair, 'val').toLowerCase()) !== -1) {
                        isFound = true
                    }
                }
            })
            return isFound
        });
        this.props.updated(newlist);
    }
    multipleSearch(list, values) {
        var newlist = _.filter(list, item => {
            var isFound = false;
            _.forOwn(item, (kk, vv) => {

                _.each(values, value => {
                    if ((kk || '').toString().toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                        isFound = true
                    }
                })
            })
            return isFound
        });
        this.props.updated(newlist);
    }
    multipleAndSearch(list, values) {

    }

    handleChanges_search(value) {

        var list = this.props.list;
        let result = "none";
        result = _.some(value, (el) => _.includes(':', el)) ?
            'column' :
            (_.some(value, (el) => _.includes('&', el)) ?
                'and' :
                (_.some(value, (el) => _.includes('|', el)) ?
                    'or' :
                    'none'
                )
            );

        switch (result) {
            case "column":
                let pair = {
                    column: _.first(_.split(value, ':')),
                    val: _.last(_.split(value, ':'))
                }
                this.columnSearch(list, pair)
                break;
            case "or":
                let newVals = _.split(value, '|')
                this.multipleSearch(list, newVals)
                break;
            case "and":
                let newand = _.split(value, '%')
                this.multipleAndSearch(list, newand)
                break;
            default:
                this.defaultSearch(list, value)
                break;
        }
        this.setState({ searchText: value });
    }

    displaySearch() {
        this.setState({
            displaySearchBox: true
        }, () => {
            this.searchOnServer()
        })
    }
    reduseSize() {
        const { classes } = this.props;
        // const { displaySearchBox } = this.state;
        // return displaySearchBox ? classes.searchIconDiv_small : classes.searchIconDiv;
        return classes.searchIconDiv_small;
    }
    renderSearchIcon() {
        const { classes } = this.props;
        return (<div className={this.reduseSize()} >
            <Search className={classes.searchIcon}
                onClick={this.displaySearch.bind(this)}
            /> </div>
        );
    }
    searchOnServer(needLastKey) {
        if (this.props.search && typeof (this.props.search) === 'function') {
            this.props.search({
                searchText: this.state.searchText,
                needLastKey: needLastKey
            });
        }
    }
    _handleKeyDown(e) {

        if (e.key === 'Enter') {
            this.searchOnServer(false)
        }
    }
    render() {
        const { classes, tableType } = this.props;
        const { displaySearchBox } = this.state;
        return (<div className={tableType !== "ALERT_TABLE" ? classes.textField : classes.textField1} > {this.renderSearchIcon()} {
            displaySearchBox ?
                <CustomTextField
                    label={getLocaleLabels('DSS_SEARCH')}
                    defaultValue=""
                    type="text"
                    styl={{ border:'1px solid #e6e6e6'}}
                    onKeyDown={this._handleKeyDown.bind(this)}
                    UpdateValues={this.handleChanges_search.bind(this)}
                /> : null
        } </div>
        );
    }

}

export default withStyles(styles)(TableSearch);