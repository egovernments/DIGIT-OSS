import variables from "../../../styles/variables";
const styles = theme => ({
    togglemainContainer: {
        flex: 1,
        display:'flex',
        flexDirection:'column'
    },
    toggleContainer: {
        width: '91px',
        // height: '17px',
        backgroundColor: '#f0f0f0'
    },
    toggleContainer_big: {
        // width: '520px',
        // height: '30px',
        minWidth: '100%',
        display: 'flex',
        // flex: 1,
        // backgroundColor: 'red'
    },
    MuiButtonRoot: {
        textTransform: 'capitalize'
    },
    activeTab: {
        color: variables.red
    },
    '@media (max-width: 768px)': {
        mainFilter: {
            display: 'flex',
            flexDirection: 'column',
        }
    },
    '@media (max-width: 375px)': {
        toggleContainer_big: {
            display: 'flex',
            flexDirection: 'column',
        }
    },'@media (max-width: 1000px)': {
        toggleContainer_big: {
            display: 'flex',
            flexDirection: 'column',
        }
    }
});

export default styles;