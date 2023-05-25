const styles = theme => ({
    root: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
    row: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row'
    },
    chartRow: {
        display: 'flex',
        margin: '0'
    },
    tab: {
        display: 'flex'
    },
    header: {
        paddingLeft: '10px',
        marginTop: '20px',
        marginBottom: '10px',
        fontFamily: 'Roboto',
        fontSize: '16px',
        fontWeight: 'normal',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: '#000000'
    },
    '@media (max-width:823px)': {
        chartRow: {
            flexDirection: 'column'
        }
    }

});
export default styles;