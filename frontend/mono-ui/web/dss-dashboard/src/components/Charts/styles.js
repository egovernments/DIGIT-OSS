import variables from "../../styles/variables";

const styles = theme => ({
    root: {
        color: 'rgba(0, 0, 0, 0.87)',
        display: 'flex',
        flex: 1,
        fontFamily: variables.primaryFont,
        '& span': {

            fontSize: variables.fs_20,
            fontWeight: variables.f_500,
            height: 32
        }

    },
    tableChart: {
        maxWidth: '100vw',
        margin: 'auto'
    },
    collection: {
        display: 'flex',
      //  borderBottom: '1px solid #f4f7fb'
    },
    collectionRow: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        padding: '15px 0',

    },
    CollectionLabel: {
        display: 'flex',
        fontSize: variables.fs_14,
        fontFamily: variables.primaryFont,
        color: variables.black,
        wordBreak: "break-word"


    },
    collectionChart: {
        display: 'flex',
        flexDirection: 'column',
        '& div:last-child': {
            borderBottom: 'none'
        }
    },
    lineChart: {
        display: 'flex'
    },
    '@media (max-width:823px)': {
        tableChart: {
            maxWidth: '85vw',
        },

    }

});
export default styles;