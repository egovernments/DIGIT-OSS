import variables from '../../../styles/variables';
const styles = theme => ({
    rootDialogue: {
        maxWidth: '100%'
    },
    innerContainer: {
        background: '#F4F8FB',
        color: variables.black,
        maxWidth: '100%'
    },
    dialogueHeading: {
        background: variables.white,
        color: variables.black,
        padding: '30px 0px 18px 23px',
        margin: 0,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    heading: {
        display: 'flex',
        flexDerection: 'row',
        cursor: 'pointer',
        padding: ' 20px 50px 20px 23px',
    },
    title: {
        marginTop: 'auto',
        marginBottom: 'auto',
        fontFamily: 'Roboto',
        fontSize: '16px',
        fontWeight: '500',
    },
    '@media (max-width: 768px)': {
        marginRight: 0
    }
});

export default styles;