import variables from '../../../styles/variables';
const tabsStyles = theme => ({
    root: {
        fontFamily: 'Roboto',
        fontSize: variables.fs_14,
        fontWeight: variables.f_500,
        background: variables.white,
        margin: '12px !important'
    },
    indicator: {
        fontFamily: 'Roboto',
        background: '#FE7A51'
    },
    tab: {
        fontFamily: 'Roboto',
        fontSize: variables.fs_14,
        fontWeight: variables.f_500,
    },
    '@media (max-width: 3000px)': {
        root: {
            margin: '12px 12px 12px 12px !important',
        }
    },
    '@media (max-width:823px)': {
        root: {
            margin: '10px 5px 10px 5px !important',
        },

    }

});

export default tabsStyles;