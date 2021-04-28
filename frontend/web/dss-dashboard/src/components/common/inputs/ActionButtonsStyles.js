import variables from '../../../styles/variables';
const actionButtonStyles = theme => ({
    Actionmenus: {
        width: 21,
        height: 21,
        color: variables.gray1,
        '& svg': {
            fill: `${variables.gray1} !important`,
            '& rect, & path': {
                fill: `${variables.gray1} !important`
            }
        }
    },
    cancelButton: {
        minWidth: 0
    },
    closeClassRed: {
        color: variables.red,
        border: '2px solid',
        borderColor: '#F5F5F5'
    },
    closeClassGreen: {
        color: variables.green,
        border: '1px solid',
        borderColor: variables.green
    },
    lightTooltip: {
        boxShadow: theme.shadows[1],
        fontSize: 11,
        fontFamily: variables.SecondaryFont
    },
    actionButton: {
        display: 'flex',
        fontFamily: variables.SecondaryFont,
        textTransform: 'capitalize',
        fontSize: 16,
        color: variables.white,
        cursor: 'pointer',
        'flex-direction': 'row',
        border: 'none',
    },
    Actionmenus_defaultAdd: {
        width: 24,
        height: 24,
        margin: '0',
        marginLeft: 15,
        float: 'right',
        display: 'flex',
        '& svg': {
            fill: variables.white,
            width: '100%',
            height: '100%',
            float: 'right',
        }
    },
    download: {
        width: 24,
        height: 24,
        margin: 'auto',
        marginLeft: 15,
        display: 'flex',
        '& svg': {
            fill: variables.blackColor,
        }
    },
    actionButton_exportdata: {
        background: variables.white,
        color: variables.alertExportDataTextColor,
        fontFamily: variables.SecondaryFont,
        fontSize: variables.fs_14,
        margin: '0 5px 0 5px',
        border: '1px solid',
        flexDirection: 'row-reverse',
        display: 'flex',
        '&:hover': {
            backgroundColor: variables.white,
            color: variables.black,
            fontFamily: variables.SecondaryFont,
            fontSize: variables.fs_14,
        },
        '&:focus': {
            backgroundColor: variables.white,
            color: variables.black,
            fontFamily: variables.SecondaryFont,
            fontSize: variables.fs_14,
        },
        '&:disabled': {
            color: 'rgba(45, 40, 40, 0.3)'
        }
    },
    actionmenus_exportdata: {
        width: 24,
        height: 24,
        margin: '0px 17px 0 0',
        float: 'right',
        display: 'flex',
        '& svg': {
            width: '100%',
            height: '100%',
            float: 'right',
            '& path': {
                fill: variables.alertExportDataIconColor,
            }
        }
    },
    actionButton_download: {
        display: 'flex',
        fontFamily: variables.SecondaryFont,
        textTransform: 'capitalize',
        fontSize: 16,
        background: '#27BB80',
        color: variables.white,
        'flex-direction': 'row',
        border: 'none',
        '&:hover': {
            backgroundColor: '#27BB80',
        },
        '&:focus': {
            backgroundColor: '#27BB80'
        },
    },
    Actionmenus_download: {
        width: 24,
        height: 24,
        margin: '0',
        marginLeft: 15,
        float: 'right',
        display: 'flex',
        '& svg': {
            fill: variables.white,
            width: '100%',
            height: '100%',
            float: 'right',
            '& path': {
                fill: 'white !important'
            }
        }
    },
    actionButton_multiEdit: {
        background: variables.whiteColor,
        color: variables.lightBlack,
        'flex-direction': 'row',
        border: 'none'
    },
    actionmenus_multiEdit: {
        width: 24,
        height: 24,
        margin: '0 12px 0 0',
        float: 'left',
        display: 'flex',
        '& svg': {
            width: 32,
            height: 32,
            float: 'left',
            'margin-top': -2,
            '& path': {
                fill: variables.lightBlack,
            }
        }
    },
    actionButton_multiexportdata: {
        background: variables.whiteColor,
        color: variables.lightBlack,
        'flex-direction': 'row',
        border: 'none'
    },
    actionmenus_multiexportdata: {
        width: 24,
        height: 24,
        margin: '0 12px 0 0',
        float: 'left',
        display: 'flex',
        '& svg': {
            width: 32,
            height: 32,
            float: 'left',
            'margin-top': -2,
            '& path': {
                fill: variables.lightBlack,
            }
        }
    },
    KPIButton: {
        background: variables.whiteColor,
        color: variables.black,
        'border': '1px solid #CACACA',
        'border-radius': 0,
        display: 'flex',
        textTransform: 'capitalize'
    },
    menuIcons_KPIButton: {
        height: 24,
        width: 24,
        'margin': '-3px 10px 0 0',
        '& svg': {
            fill: variables.white,
            width: 32,
            height: 32,
        }
    },
    Notify_KPIButton: {
        background: variables.whiteColor,
        color: variables.black,
        'border': '1px solid #CACACA',
        'border-radius': 0,
        display: 'flex',
        textTransform: 'capitalize'
    },
    menuIcons_Notify_KPI: {
        height: 24,
        width: 24,
        'margin': '-3px 20px 0 0',
        '& svg': {
            fill: variables.white,
            width: 32,
            height: 30,
        }
    },
    kpiBox: {
        color: variables.lighterGray,
    },
    activeLink: {
        borderLeft: `3px solid ${variables.blue}`,
        color: variables.white,
        '& p': {
            color: variables.white
        }
    },
    menuIcons: {
        height: 40,
        width: 40,
        marginLeft: 'auto',
        '& svg': {
            fill: '#5A5B5F',
            '& path': {
                fill: '#5A5B5F'
            }
        }
    },
    activeIcon: {
        height: 40,
        width: 40,
        marginLeft: 'auto',
        '& svg': {
            fill: variables.white,
            '& path': {
                fill: variables.white
            }
        }
    },
    itemLbl: {
        position: "absolute",
        paddingTop: 60,
        paddingLeft: 22,
        width: '100%',
        textAlign: 'center'
    },
    lightTooltip1: {
        background: variables.white,
        color: variables.black,
        boxShadow: theme.shadows[1],
        fontSize: 11,
        fontFamily: variables.SecondaryFont,
        '& span': {
            color: '#3293f5 !important'
        }
    },
    actionButton1: {
        cursor: 'pointer',
        fontSize: '16px',
        fontFamily: 'Roboto',
        textTransform: 'uppercase',
        marginTop: 20,
        '&:hover': {
            backgroundColor: '#FE7A51',
            color: variables.whiteColor
        }

    },
    barClass: {
        backgroundColor: '#000',
    },
    check: {
        color: '#3293f5 !important'
    },
    base: {
        color: '#fff'
    },
    actionButton_small: {
        padding: 0,
        minWidth: '32px',
        textTransform: 'capitalize',
        height: 'auto',
        fontFamily: 'Roboto',
        fontSize: '10px',
        fontWeight: 'normal',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        textAlign: 'center',
        color: '#000000',
        borderRadius: 0,
        background: '#f0f0f0',
        cursor: 'pointer',
    },
    actionButton_big: {
        padding: 0,
        minWidth: '32px',
        height: '30px',
        borderRadius: '2px',
        border: 'solid 1px #d9d9d9',
        backgroundColor: variables.white,
        textTransform: 'capitalize',
        fontFamily: 'Roboto',
        fontSize: '10px',
        fontWeight: 'normal',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        textAlign: 'center',
        color: '#000000',
        borderRadius: 0,
        background: '#f0f0f0',
        cursor: 'pointer',
        '& span': {
            margin: '0 5px 0 5px',
            fontFamily: 'Roboto',
            fontSize: '12px',
            fontWeight: '500',
            fontStretch: 'normal',
            fontStyle: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            textAlign: 'center',
        }
    },


});

export default actionButtonStyles;