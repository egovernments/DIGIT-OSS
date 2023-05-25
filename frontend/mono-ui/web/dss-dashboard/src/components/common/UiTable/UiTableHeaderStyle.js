import variables from '../../../styles/variables';

const toolbarStyles = theme => ({
    root: {
        backgroundColor: variables.headerGrey,
        '& thead': {
            width: '100%',
            '& tr': {
                '& th': {
                    textAlign: 'left'
                }
            }
        },
        '& tr': {
            '& th': {
                width: 'auto',
                padding: '0px 0px 0px 0px',
                border: 'solid 1px #e6e6e6 !important',
                backgroundColor: variables.tableheaBackgrount,
                '& span': {
                    color: variables.tableHeadetTextColor,
                    fontSize: variables.fs_14,
                    fontWeight: variables.f_500,
                    fontFamily: variables.primaryFont,
                    '&:hover': {
                        color: variables.tableHeaderColor
                    },
                    '&:focus': {
                        color: variables.tableHeaderColor
                    },
                    '& cursor': 'inherit'
                }
            },
            '& th:nth-child(1)': {
                width: 'auto !important',
                // position: 'sticky',
                // left: 0,
                // zIndex: 1,
            },
            '& th:nth-child(2)': {
                position: 'sticky',
                left: -1,
                zIndex: 1,
            }
        }
    },
});

export default toolbarStyles;