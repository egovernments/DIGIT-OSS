import variables from '../../styles/variables';
const PerformanceChartStyles = theme => ({
    maincls: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
        margin: '20px 0px'
    },
    progess: {
        margin: '5px 0px',
        height: '5px',
        borderRadius: '2.5px'
    },
    topLabel: {
        fontFamily: 'Roboto',
        fontSize: '14px',
        fontWeight: '500',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: '#000000'
    },
    bottomLabel: {
        fontFamily: 'Roboto',
        fontSize: '12px',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: '#000000'
    },
    lightTooltip: {
        background: variables.white,
        color: variables.black,
        boxShadow: theme.shadows[1],
        fontSize: 11,
        fontFamily: variables.SecondaryFont
    },
    progess: {
        height: 5,
        margin: '5px 0px',
        borderRadius: 2.5,
        display: 'flex',
        overflow: 'hidden',
        fontSize: '.75rem',
        background: '#e9ecef',
    },
    progressLine: {
        height: 5
    },
    bottomDiv: {
        textAlign: 'initial'
    },
    body: {
        display: 'flex',
        flexDirection: 'column'
    }

});

export default PerformanceChartStyles;