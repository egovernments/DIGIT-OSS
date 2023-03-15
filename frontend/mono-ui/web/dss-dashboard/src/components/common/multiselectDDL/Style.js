import variables from "../../../styles/variables";

const styles = theme => ({
    container: {
        width: '100%'
    },
    checkbox: {
        color: variables.black,
        marginLeft:30,
        marginTop:10,
        marginBottom:10        
    },
    checkboxinput:{
        border:`1px solid ${variables.black}`,
        borderRadius: 0,
        left: 16,
        height: 18,
        width: 18
    },
    list: {
        display: 'flex',
        flexDirection: 'column'
    },
    searchSection: {
        width: '100%'
    },
    inputCnt: {
        position: 'relative'
    },
    searchInput: {
        backgroundColor: variables.lightestgray,
        borderRadius: 0
    },
    searchIcon: {
        color: variables.lighterGray
    },
    searchCnt: {
        position: 'absolute',
        right: 10,
        marginTop: 11,
        zIndex: 9999
    },
    listCnt: {
        maxHeight: 200,
        overflow: 'auto',
        overflowY: 'scroll',
        overflowX: 'hidden'
    },
    row: {
        display: 'flex',
        flexDirection: 'row'
    }
})

export default styles;