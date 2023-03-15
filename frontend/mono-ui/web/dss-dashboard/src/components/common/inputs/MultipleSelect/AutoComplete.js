import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import _ from 'lodash';
import SVG from 'react-inlinesvg';
import districts_icon from '../../../../images/icon-districts.svg';
import ulbs_icon from '../../../../images/icon-ul-bs.svg';
import styles from './Styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import variables from '../../../../styles/variables';
import { isMobile } from 'react-device-detect';
import Chip from '@material-ui/core/Chip';
import { getLocaleLabels } from '../../../../utils/commons';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" style={{ color: 'grey' }} />;


const theme = createMuiTheme({
    overrides: {
        typography: {
            useNextVariants: true,
            fontFamily: variables.primaryFont
        },
        MuiAutocomplete: {
            option: {
                fontSize: '0.8rem'
            },
            popupIndicator: {
                float: 'right'
            },
            inputRoot: {
                paddingRight: '0px !important',
                minWidth: '180px',
                '@media (min-width: 1367px)': {
                    minWidth: '180px !important',
                    maxWidth: '180px !important'
                },
                '@media (min-width: 1026px) and (max-width:1300px)': {
                    minWidth: '150px !important',
                    maxWidth: '150px !important'
                }
            },
            endAdornment: {
                bottom: '0px !important',
                top: 'initial !important'
            },
            clearIndicator: {
                display: 'none !important'
            }
        }

    }
});

const localaliseTenant = ((tenant, type) => {
    let prefix = 'DDR_'
    if (type == "DDRS") {
        prefix = `DDR_` ;
    } else if (type == "ULBS") {
        prefix = `TENANT_TENANTS_` ; 
    }
    return getLocaleLabels(`${prefix}${getTransformedLocale(tenant)}`);
})


const getTransformedLocale = label => {
    if (typeof label === "number") return label;
    label=label?.trim();
    return label && label.toUpperCase().replace(/[.:-\s\/]/g, "_");
};
class CheckboxesTags extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            label: "All " + this.props.target,
            name: this.props.defaultValue || [],
            search: '',
            localItems: this.props.item || [],
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.item !== this.props.item && this.props.item) {
            this.setState({
                localItems: this.props.item
            })
        }

        if ((prevProps.item !== this.props.item) && Array.isArray(this.props.item) && this.props.item.length <= 0) {
            this.setState({
                label: "All " + this.props.target,
            })
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultValue !== this.props.defaultValue) {
            this.setState({
                name: nextProps.defaultValue
            });
        }
    }

    handleChange = (event, values) => {
        if (values && Array.isArray(values) && values.length > 0) {
            this.setState({
                label: ''
            })
        } else {
            this.setState({
                label: 'All ' + this.props.target
            })
        }

        let { target } = this.props;
        let newVals = _.compact(values);
        if (newVals.length > 0) {
            this.setState({ name: newVals });
            this.props.handleSelected(false, target, newVals)
        } else {
            this.setState({ name: [] });
            this.props.handleSelected(false, target, [])
        }
        this.props.handleClear()
    };

    render() {
        const { classes, logo } = this.props;
        let svgicon;
        if (logo === "DDRs") {
            svgicon = districts_icon;
        } else if (logo === "ULBS" || "Wards") {
            svgicon = ulbs_icon;
        }

        return (
            <MuiThemeProvider theme={theme}>

                <div className={classes.root}>

                    <FormControl className={classes.formControl} style={isMobile ? { width: "100%" } : {}} >
                        {/* <InputLabel htmlFor="select-multiple-checkbox">{label || 'Select'}</InputLabel> */}
                        <div className={classes.list}>
                            {/* <div>
                                <SVG src={svgicon} className={classes.CloseButton} >

                                </SVG>
                            </div> */}


                            {
                                this.props.type === 'Wards' ? <Autocomplete
                                    onChange={this.handleChange.bind(this)}
                                    style={isMobile ? { width: "100%", margin: "-6" } : ''}
                                    multiple
                                    id="checkboxes-tags-demo"
                                    options={this.state.localItems.sort().map(value => value)}
                                    disableCloseOnSelect
                                    getOptionLabel={value => localaliseTenant(value)}
                                    defaultValue={this.props.defaultValue ? this.props.defaultValue : []}
                                    value={this.props.defaultValue ? this.props.defaultValue : []}

                                    renderOption={(option, { selected }) => (
                                        <React.Fragment>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{ margin: '0px 0px 2px 0px', padding: 0, color: 'black' }}
                                                checked={selected}
                                            />
                                            {localaliseTenant(option, this.props.logo)}
                                        </React.Fragment>
                                    )}

                                    renderTags={(value, getTagProps) => {
                                        return this.state.localItems && this.state.localItems.length > 0 ? value.map((option, index) => (
                                            (this.props.defaultValue && this.props.defaultValue.includes(option)) || this.props.type !== 'Wards' ? <Chip label={localaliseTenant(option, this.props.logo)} {...getTagProps({ index })} /> : <div></div>
                                        )) : ''
                                    }
                                    }

                                    style={(isMobile) ? { width: "100%", margin: "-6" } : {}}
                                    renderInput={params => (
                                        <div style={isMobile ? { color: 'black', margin: "0px -6px 0px 0px" } : { color: 'black' }}>

                                            <TextField
                                                {...params}
                                                variant="standard"
                                                fullWidth
                                                placeholder={localaliseTenant(this.state.label)}
                                                style={isMobile ? { color: 'black', margin: "0px -6px 0 0" } : { color: 'black' }}
                                            /></div>
                                    )}
                                /> : <Autocomplete
                                    onChange={this.handleChange.bind(this)}
                                    style={isMobile ? { width: "100%", margin: "-6" } : ''}
                                    multiple
                                    id="checkboxes-tags-demo"
                                    options={this.state.localItems.sort().map(option => option)}
                                    disableCloseOnSelect
                                    getOptionLabel={value => value}

                                    renderOption={(option, { selected }) => (
                                        <React.Fragment>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{ margin: '0px 0px 2px 0px', padding: 0, color: 'black' }}
                                                checked={selected}
                                            />
                                            {localaliseTenant(option, this.props.logo)}
                                        </React.Fragment>
                                    )}

                                    renderTags={(value, getTagProps) => {
                                        return this.state.localItems && this.state.localItems.length > 0 ? value.map((option, index) => (
                                            (this.props.defaultValue && this.props.defaultValue.includes(option)) || this.props.type !== 'Wards' ? <Chip label={localaliseTenant(option, this.props.logo)} {...getTagProps({ index })} /> : <div></div>
                                        )) : ''
                                    }
                                    }

                                    style={(isMobile) ? { width: "100%", margin: "-6" } : {}}
                                    renderInput={params => (
                                        <div style={isMobile ? { color: 'black', margin: "0px -6px 0px 0px" } : { color: 'black' }}>

                                            <TextField
                                                {...params}
                                                variant="standard"
                                                fullWidth
                                                placeholder={localaliseTenant(this.state.label)}
                                                style={isMobile ? { color: 'black', margin: "0px -6px 0 0" } : { color: 'black' }}
                                            // InputLabelProps={{
                                            //     style: {

                                            //     } }}
                                            // // InputLabelProps={{
                                            // //     className: classes.floatingLabelFocusStyle,
                                            // // }}
                                            /></div>
                                    )}
                                />}
                        </div>
                    </FormControl>

                </div>
            </MuiThemeProvider>

        );
    }

}

CheckboxesTags.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(CheckboxesTags);


