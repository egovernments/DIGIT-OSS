import { isMobile } from 'react-device-detect';
import {
    blackColor,
    hexToRgb
  } from "../../assets/Home";

const styles = theme => ({
    root: {
        padding: '12px',
    },
    pageHeader: {
        fontFamily: 'Roboto',
        fontSize: '36px',
        fontWeight: '700',
        flex: 1,
        textAlign: 'left',
        wordBreak: "break-word"
    },
    posit: {
        display: 'flex',
        flexDirection: 'row-reverse',
        marginTop: '3px'
    },
    actions: {
        display: 'flex',
        flexDirection: 'row',
        margin: '12px 12px 12px 12px !important',

    },
    paper: {
        padding: '18px 12px 30px 12px !important',
    },
    filter: {
        textAlign: 'left',
        fontFamily: 'Roboto',
        fontSize: '16px',
        fontWeight: '500',
        color: '#fe7a51',
        padding: '0px 12px 12px 12px !important'
    },
    title: {
        textAlign: 'left',
        fontFamily: 'Roboto',
        fontSize: '16px',
        fontWeight: '500',
        color: 'rgba(0, 0, 0, 0.87)',
        // padding: '12px !important'
    },
    subTitle: {
        textAlign: 'left',
        fontFamily: 'Roboto',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(0, 0, 0, 0.87)'
    },
    cardTitle: {
        fontFamily: 'Roboto',
        fontSize: '22px',
        fontWeight: '600',
        margin: '10px 18px 0px 18px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    paperTitle: {
        fontFamily: 'Roboto',
        fontSize: '20px',
        fontWeight: '500',
        padding: isMobile ? '15px 5px 5px 15px' : '0px 5px 5px 5px',
        margin: '0px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
       
    },
    value: {
        textAlign: 'left',
        fontFamily: 'Roboto',
        fontSize: '16px',
        fontWeight: '500',
        color: 'rgba(0, 0, 0, 0.87)'
    },
    variant: {
        textAlign: 'left',
        fontFamily: 'Roboto',
        fontSize: '16px',
        fontWeight: '400',
        color: '#259b24'
    },
    customCard: {
        padding: '5px'
    },
    iconPaper: {
        // backgroundColor: '#2196F3',
        // color: 'white',
        // height: '73px',
        // width: '93px',
        // verticalAlign: 'middle',
        // paddingTop: '20px'
        marginTop:"-20px"
    },
    paperContainer: {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row'
    },
    paperValues: {
        width: '100%',
        paddingLeft: isMobile ? '0px' : '10px'
    },
    paperStyle: {
        padding: '15px', backgroundColor: 'rgba(33, 150, 243, 0.24)', cursor: 'pointer',
        // transition: theme.transitions.create(['border-color', 'box-shadow']),
        borderBottom: '0.5px solid rgba(0, 0, 0, 0.04)',
        boxShadow: "0 1px 4px 0 rgba(" + hexToRgb(blackColor) + ", 0.14)",
        '&:hover': {
            boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12)",

        },
    },
    '@media (max-width: 3000px)': {
        root: {
            padding: '0px 12px 0px 12px !important',
        },
        paper: {
            padding: '2px 12px 0px 12px !important',

        },
        customCard: {
            padding: '5px'
        },
        actions: {
            margin: '12px 12px 12px 12px !important',
        }
    },
    // '@media (max-width: 1150px)': {
    //     grid: {
    //         paddingLeft: '30px'
    //     },
    // },
    '@media (max-width:823px)': {
        root: {
            padding: '10px 5px 10px 5px !important',
        },
        paper: {
            padding: '10px 5px 10px 5px !important',
        },
        // customCard: {
        //     padding: '15px'
        // },
        actions: {
            margin: '10px 5px 10px 5px !important',
        },

    },
});

export default styles;