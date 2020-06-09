import variables from '../../../styles/variables';

const styles = theme => ({
    root: theme.mixins.gutters({
        marginTop: theme.spacing(1),
        backgroundColor:variables.paper_background,
        paddingLeft:'15px !important',
        paddingRight:'15px !important'
    }),
    critical:{
        borderLeft:`3px solid ${variables.red}`,
    },
    kpiBlock:{
        paddingTop:0,
    },
    major:{
        borderLeft:`3px solid ${variables.orange}`,
    },
    minor:{
        borderLeft:`3px solid ${variables.darkyellow}`,
    },
    healthy:{
        borderLeft:`3px solid ${variables.lightgreen}`,
    }
});

export default styles;