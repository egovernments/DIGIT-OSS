import variables from "../../../styles/variables";

const styles = theme => ({

    "#customCalander": {
        backgroundColor: 'red'
    },

    root: {
        flexGrow: 1,
        maxWidth: '100%',
        top: 0,
        left: 0,
        position: 'absolute'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    title: {
        '& h2': {
            width: '94px',
            height: '19px',
            fontFamily: 'Roboto',
            fontSize: '14px',
            fontWeight: 'normal',
            fontStretch: 'normal',
            fontStyle: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            color: '#000000',
        }
    },
    cardheader: {

    },
    divider: {
        width: "741px",
        height: "1px",
        background: "#d9d9d9",
    },
    changeyear: {
        fontFamily: 'Roboto',
        fontSize: '8px',
        fontWeight: 500,
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: variables.blueyGrey
    },
    fils: {
        display: 'flex',
    },
    filterS: {
        display: 'flex',
        flexDirection: 'column',
        margin: '0 0 0 34px',
        '& div:nth-child(2n)': {
        }
    },

    datedisplay: {
        display: 'flex',
        marginTop: 10
    },
    back: {
        margin: '0 15px 0 0px',
        '& svg': {
            width: '8px',
            height: '5px',
        }
    },
    next: {
        margin: '0 0 0 15px',
        '& svg': {
            width: '8px',
            height: '5px',
            objectFit: 'contain',
            transform: 'rotate(180deg)',
        }
    },
    rectangle: {
        width: '305px',
        height: '30px',
        borderRadius: '2px',
        border: 'solid 1px #d9d9d9',
        backgroundColor: variables.white,
        textAlign: 'center',
        fontFamily: 'roboto',
        '& span': {
            width: '92px',
            height: '16px',
            fontFamily: 'Roboto',
            fontSize: '12px',
            fontWeight: 500,
            fontStretch: 'normal',
            fontStyle: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            textAlign: 'center',
            color: '#000000',
        }
    },
    to: {
        margin: '0 10px 0 10px',
        textAlign: 'center',
        '& span': {
            width: '11px',
            height: '16px',
            fontFamily: 'Roboto',
            fontSize: '12px',
            fontWeight: 500,
            fontStretch: 'normal',
            fontStyle: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            color: '#000000',
        }
    },
    calanderDisplay: {
        display: 'flex',
    },
    calanderclass: {
        backgroundColor: '#fcfcfc',
    },
    space: {
        width: 29
    },
    actions: {
        display: 'flex',
        justifyContent: 'center'
    },
    cancelbtn: {
        borderRadius: 2,
        backgroundColor: variables.white,
        fontFamily: 'Roboto',
        fontSize: 12,
        fontWeight: 500,
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: '#656565',
    },
    okbtn: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        fontFamily: 'Roboto',
        fontSize: 12,
        fontWeight: 500,
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: 'white',
        backgroundColor: '#fe7a51',
        cursor: 'pointer',
        '&:hover': {
            boxShadow: theme.shadows[5],
            backgroundColor: '#FE7A51',
            color: variables.whiteColor
        }
    },
trans: {
    background: 'transparent'
},
'@media (max-width: 1115px)': {
    root: {
        top: 0,
            left: 0,

        },
    calanderDisplay: {
        display: 'flex',
            flexDirection: 'column'
    },
    fils: {
        display: 'flex',
            flexDirection: 'column'
    },

},
'@media (max-width: 1000px)': {
    root: {
        top: 0,
            left: 0,
                width: '100vw',
                    position: 'inherit'
    },
    calanderDisplay: {
        display: 'flex',
            flexDirection: 'column'
    },
    fils: {
        display: 'flex',
            flexDirection: 'column'
    },
    actions: {
        display: 'flex',
            justifyContent: 'center',
                margin: '10px 0 10px 0'
    }
}
})

export default styles