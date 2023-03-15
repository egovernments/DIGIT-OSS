 import variables from '../../../styles/variables';

 const styles = theme => ({
     root: theme.mixins.gutters({
         padding: 0,
         backgroundColor: variables.paper_background,
         width: 20,
         height: 20
     }),
     critical: {
         backgroundColor: variables.red,
         flexDirection: "column",
         padding: 0,
     },

     major: {
         backgroundColor: variables.orange,
         flexDirection: "column",
         padding: 0,
     },
     minor: {
         backgroundColor: variables.darkyellow,
         flexDirection: "column",
         padding: 0,
     },
     healthy: {
         backgroundColor: variables.lightgreen,
         flexDirection: "column",
         padding: 0,
     },
     executed: {
         backgroundColor: variables.lightgreen,
         flexDirection: "column",
         padding: 0,
     },
     failed: {
         backgroundColor: variables.red,
         flexDirection: "column",
         padding: 0,
     },
     KpiBox: {
         display: "flex",
         flexDirection: "row",
     },
     KPIItemSmall: {
         marginLeft: 10,
         flex: 1,
         fontFamily: 'montserrat',
     },
     KPIItem: {
         display: 'flex',
         flexDirection: 'column',
         overflow: 'hidden',
         flex: 2
     },
     heading: {
         marginTop: -30
     },
     fontLightGray: {
         color: variables.lighterGray
     },
     fontLarge: {
         fontSize: 37,
         margin: '-44px 0 0 42px'
     },
     fontMedium: {
         fontSize: 22,
         display: 'flex',
     },
     fontSmall: {
         fontSize: 14,
     },
     item: {
         display: 'table-cell'
     },
     box: {
         cursor: 'pointer',
         display: 'block'
     }
 });

 export default styles;