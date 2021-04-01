import variables from '../../../styles/variables';
export const CardStyle = {
    root: {
        margin: '10px 10px 10px 10px !important !important'
    },
    card: {
        minWidth: 150,
        backgroundColor: variables.widget_background,
    },
    cardheader: {
        paddingBottom: 0,
        paddingLeft: '20px',
        paddingTop: '20px',        
        maxWidth: '100% !important',
        wordBreak: 'break-all',
        display: 'flex',
        textAlign: 'left',
        '& div': {
            '& span': {
                fontSize: variables.fs_16,
            }
        }
    },
    fullw: {
        flex: 1,
        flexDirection: 'row-reverse',
        minHeight: '20px'
    },
    full: {
        width: '100%',
        margin: '12px !important',
    },
    redused: {
        maxWidth: '97%',
        margin: '12px 12px 12px 12px !important',
    },
    cardContent: {
        paddingTop: 5,
        paddingBottom: 0,
        height: '100%'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontWeight: '500',
        fontFamily: 'Roboto'
    },
    pos: {
        marginBottom: 12,
    },
    actionMenues: {
        display: 'flex',
        paddingRight: '5px',
        paddingTop: '10px'
    },
    actions: {
        padding: 0,
        display: 'flex',
        flexDirection: 'row-reverse'
    },
    headRoot: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row'
    },
    menuItem: {
        padding: '0px 9px 0px 12px',
        fontSize: '10px !important',
        minHeight: '20px',
    },
    itemIcon: {
        minWidth: '30px'
    },    
    '@media (max-width: 3000px)': {
        redused: {
            maxWidth: '100%',
            margin: '12px 12px 12px 12px !important',
        }
    },
    '@media (max-width:823px)': {
        redused: {
            margin: '10px 5px 10px 5px !important',
        },

    },
    '@media (max-width: 768px)': {
        redused: {
            maxWidth: '97%',
        },
        itemMenu: {
            height: '45px',
            paddingBottom: '50px !important'
        },
        itemIcon: {
            minWidth: '30px'
        },
        menuItem: {
            padding: '0px 9px 0px 12px',
            minHeight: '20px',
            fontSize: '10px !important'

        },
    },

    '@media (max-width: 375px)': {
        itemMenu: {
            height: '45px',
            paddingBottom: '5px !important',
            fontSize: '10px !important'
        },
        itemIcon: {
            minWidth: '30px'
        },
        redused: {
            maxWidth: '97%',
        },
        menuItem: {
            padding: '0px 9px 0px 12px',
            minHeight: '20px',
            fontSize: '10px !important'
        },
    },
}