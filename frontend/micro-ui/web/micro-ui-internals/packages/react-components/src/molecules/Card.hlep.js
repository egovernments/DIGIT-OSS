import { makeStyles } from "@material-ui/core/styles";



export const useStyles = makeStyles({
    formLabel: {
        color: "#48494B !important"
    },
    formGroup: {
        border: "2px solid #e9ecef",
        margin: 5
    },
    row: {
        marginTop: 20,
        marginBottom: 20
    },
    required:{ 
        color: "red" 
    },
    fieldContainer:{ 
        display: "flex"
    },
    formControl:{ 
        maxWidth: 200, 
        marginRight: 5, 
        height: 30 
    },
    card:{
        maxWidth: 200, 
        marginRight: 5, 
        height: 100 
    }
});