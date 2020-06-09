import variables from "../../../styles/variables";

//import variables from '../../../styles/variables';
const styles = theme => ({
    textField: {
        display: 'flex',
        // margin: '17px 19px 0 0',
        // right: 10,
        // position: 'absolute',
        // top: 216,
        flexGrow: 1,
        flexDirection: 'row-reverse',
        '& label': {
            display: 'none'
        },
        '& p': {
            display: 'none'
        },
        '& div': {
            marginTop: 0
        },
        '& div:nth-child(2)': {
           // flexGrow: 1,
        }

    },
    textField1: {
        display: 'flex',
        // margin: '17px 19px 0 0',
        // right: 10,
        // position: 'absolute',
        // top: 262,
        flexDirection: 'row-reverse',
        '& label': {
            display: 'none'
        },
        '& p': {
            display: 'none'
        },
        '& div': {
            marginTop: 0
        }

    },
    searchIcon: {
        display: 'flex',
        width: 42,
        height: 25,
        marginTop: 10,
        marginBottom:5
    },
    searchIconDiv: {
        display: 'flex',
        border: '1px solid',
        height: 36,
        borderColor: variables.borderColor,
        '& svg': {
            marginTop: 5
        }
    },
    searchIconDiv_small: {
        width: 25,
        height: 36,
        margin: '9px 10px 0px -35px',
        fill:variables.black,
        zIndex: 1,
        // '& path': {
        //     fill: variables.white
        // }
    }

});

export default styles;