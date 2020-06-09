const styles = theme => ({
    pageHeader: {
        fontFamily: 'Roboto',
        fontSize: '24px', 
        fontWeight: '500',
        flex: 1, 
        textAlign: 'left',
        wordBreak: "break-word"
    },
    dashboard: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 auto'
    },
    elemClass: {
        display: 'flex',
        flex: 1
    },
    heading: {
        width: '129px',
        height: '26px',
        fontfamily: 'Roboto',
        fontSize: '20px',
        fontWeight: 'normal',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: '#000000',
        display: 'flex',
        cursor: 'pointer'
    },
    btn1: { borderRadius: '2px', height: 'fit-content', backgroundColor: "#fe7a51", color: "white" },
    actions: {
        display: 'flex',
        margin: '12px !important'
    },
    posit: {
        display: 'flex',
        flex: 1,
        justifyContent: 'end'
    },
    acbtn: {
        display: 'flex'
    },
    '@media (max-width: 2560px)': {
        actions: {
            flexDirection: 'row'
        },
        posit: {
            flexDirection: 'row-reverse',
            marginTop: '3px'
        }
    },
    '@media (max-width: 768px)': {
        actions: {
            flexDirection: 'column',
        },
        posit: {
            flexDirection: 'row-reverse',
            marginTop: '3px'
        }
    },

    '@media (max-width: 3000px)': {
        actions: {
            margin: '12px 12px 12px 12px !important',
        }
    },
    '@media (max-width:823px)': {
        actions: {
            margin: '10px 5px 10px 5px !important',
        },

    }
});

export default styles;