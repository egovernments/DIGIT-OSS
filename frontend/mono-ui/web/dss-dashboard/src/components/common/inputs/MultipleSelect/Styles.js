import variables from '../../../../styles/variables';
const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        color: 'black',
        // minWidth: '200px',
        flex: 1,
        '& div': {
            color: variables.black,
            margin: '0 3px 0 0',
            // flex: 1,
            // '& div:before': '',
            // '& svg': {
            //   color: variables.black,
            //   marginTop: '6px'
            // }
        }
    },
    CloseButton: {
        marginTop: '4px',
        marginRight: '5px'
    },
    formControl: {
        margin: '0',
        minWidth: 120,
        // 'flex-grow': 1,
        '& label': {
            color: variables.black,
            top: '-15px'
        },
    },
    listItem: {
        color: `${variables.white} !important`,
    },
    selectItem: {
        background: `${variables.white} !important`,
        // '& div': {
        //   '& div': {
        //     background: `${variables.white} !important`,
        //     color: variables.black,
        //   }
        // },
    },
    select: {
        // border: '1px solid ' + variables.borderColor
        '& div': {
            '& div': {
                '& div': {
                    backgroundColor: variables.transparent,
                    '& span': {
                        paddingLeft: 0,
                        paddingRight: 0,
                        overflow: 'hidden'
                    },
                    '& svg': {
                        width: 12,
                        height: 12,
                        margin: '-7px 2px 0 8px'
                    }
                }
            }
        }
    },
    menuItem: {
        // display: 'flex',
        // width: '100%',
        //border: '1px solid ' + variables.borderColor,
        '& div:nth-child(1)': {
            marginLeft: 5
        },
        backgroundColor: `${variables.white} !important`,
        '& span': {
            color: variables.black,
            textTransform: 'capitalize'
        },
        '&:active': {
            backgroundColor: `${variables.white} !important`,
        },
        '&:hover': {
            backgroundColor: `${variables.white} !important`,
        },
        '&:focus': {
            backgroundColor: `${variables.white} !important`,
        },
    },
    multiselectlist: {
        '& ul': {
            maxHeight: 200,
            overflowY: 'scroll'
        },
        // '& div:nth-child(2)':{
        //   top:'160px !important'
        // }
    },
    list: {
        display: 'flex'
    },
    searchInput: {
        display: 'flex',
        flexDiraction: 'column'
    },
    bootstrapRoot: {
        padding: 0,
        'label + &': {
            marginTop: theme.spacing(3),
            fontFamily: variables.SecondaryFont,
        },

    },
    bootstrapInput: {
        borderRadius: 0,
        fontFamily: variables.SecondaryFont,
        fontWeight: variables.f_500,
        fontSize: variables.fs_14,
        color: variables.lightBlack,
        backgroundColor: variables.white,
        border: '1px solid ' + variables.transparent,
        padding: '10px 12px',
        width: 'calc(100% - 24px)',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            border: `1px solid ${variables.textbox_border}`,
            // boxShadow: '0 0 0 0.1rem #E4E4E4',
        },
        '&:disabled': {
            background: variables.disableTxt
        }
    }    
});

export default styles;