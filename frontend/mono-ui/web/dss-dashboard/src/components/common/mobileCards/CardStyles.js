import variables from '../../../styles/variables';
export const CardStyle = {
    root: {
        //margin: '10px 10px 10px 10px !important !important',
        // maxWidth: '97%'
    },
    card: {
        minWidth: 150,
        backgroundColor: variables.widget_background,
    },
    cardheader: {
    },
    fullw: {
        flex: 1,
        flexDirection: 'row-reverse',
        minHeight: '20px'
    },
    full: {
        width: '100%',
    },
    redused: {
        maxWidth: '97%', 
        boxShadow:'none'       
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
        // marginBottom: 5,s
        fontWeight: '500',
        fontFamily: 'Roboto'
    },
    pos: {
        marginBottom: 12,
    },
    actionMenues: {
        display: 'flex',
        paddingRight: '5px',
       // paddingTop: '10px',
        // flexDirection:'row-reverce'
    },
    actions: {
        padding: 0,
        display: 'flex',
        flexDirection: 'row-reverse'
    },
    headRoot: {
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
    lightTooltip: {
        // background: variables.white,
        // color: variables.black,
        // fontSize: 11,
        // fontFamily: variables.SecondaryFont,
        // margin: 'auto',
        // padding: 'auto'
    }   
}