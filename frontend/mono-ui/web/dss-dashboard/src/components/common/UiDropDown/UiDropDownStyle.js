import variables from "../../../styles/variables";

const styles = theme =>({
    select:{
        '& .btn-secondary':{
            backgroundColor:variables.white,
            fontFamily: variables.SecondaryFont,
            fontSize: 14,
            fontWeight: 400,
            color:variables.lightBlack,
            borderRadius:0,
            height:38,
            textAlign:'left',
            border:`1.89px solid ${variables.lightGray}`,
            outline:'none',
            paddingLeft:8            
          },
          '& .btn-secondary:active':{
            backgroundColor:`${variables.white} !important`,
            color:`${variables.lightBlack} !important`,
            outline:'none'
          },
          '& .btn-secondary:focus':{
            backgroundColor:`${variables.white} !important`,
            color:`${variables.lightBlack} !important`,
          },
          '& .dropdown-toggle::after':{
              marginLeft:0,
              outline:'none',
              float:'right',
              marginTop:'10px',
              marginRight:'auto'
          },
          '& .dropdown-item' : {
              'white-space': 'pre-wrap !important'
          }
    },
    dropDownCnt:{
        width:'100%',
        maxHeight: 200,
        overflow: 'auto'
    },
    dropDownItem:{
        width:100
    },
    error:{
        border:`1px solid ${variables.red}`,
      },
      color: {
          color: '#1692F2 !important'
      }
});

export default styles;