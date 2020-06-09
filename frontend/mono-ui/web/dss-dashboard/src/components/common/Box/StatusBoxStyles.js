import variables from '../../../styles/variables';

const styles = theme => ({
    container:{
        width:100,
        paddingLeft:32
    },
    row : {
        display:"flex",
        flexDirection:"row"
    },
    indicatorBox: {
        width:15,
        height:15,
        borderRadius:2
    },
    heading:{
        marginLeft:5,
        fontSize:20,
        fontFamily:'montserrat'
    },
    desc:{
        marginTop:5,
        fontSize:13
    },

    red:{
        backgroundColor:variables.red
    },
    orange:{
        backgroundColor:variables.orange
    },
    yellow:{
        backgroundColor:variables.darkyellow
    },
    green : {
        backgroundColor:variables.lightgreen
    }
});

export default styles;