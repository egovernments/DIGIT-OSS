import variables from '../../../../styles/variables';
const styles = theme => ({

    buttonDisplay: {
        display: 'block',

    },
    btnSecondary: {
        border: 'none'
    },
    select: {
        minWidth: '200px',
        '& .btn-secondary': {
            backgroundColor: 'white',
            color: 'black',
            borderRadius: 0
        },
        '& .dropdown-menu': {
            height: '145px',
            overflow: 'auto'
        },
        flex: 1
    },
    dropdownToggle: {
        width: '100%'
    },
    dropdownMenu: {
        width: '100%'
    },
    dropdownToggle: {
        border: 'none'
    },
    ddl: {
        display: 'flex',
        // minWidth: '200'
    },
    list: {
        // display: 'flex',
        '& div': {
            flex: 1,
            minWidth:180,
            // top: -4
        }
    },
    formControl: {
        minWidth: 'auto'
    },
    CloseButton: {
        marginTop: '4px',
        marginRight: '5px'
    },
    '@media (max-width:1024px)': {
        list: {
        // display: 'flex',
        '& div': {
             minWidth:177,
            }
        }
    },
    '@media (min-width: 900px) and (max-width:1300px)':{
        list: {
        // display: 'flex',
        '& div': {
             minWidth:95,
            }
        }
    }
});

export default styles;