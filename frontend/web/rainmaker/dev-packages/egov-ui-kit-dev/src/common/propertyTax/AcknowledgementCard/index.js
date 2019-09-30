import FloatingActionButton from "material-ui/FloatingActionButton";

import React from "react";
import Label from "egov-ui-kit/utils/translationNode";
import { Card } from "components";
import './index.css'
const AcknowledgementCard = (props) => {
  const {acknowledgeType='success', messageHeader='',message='',receiptHeader='PT_APPLICATION_NO_LABEL',receiptNo=''} = props;
  let icon;
  let iconColor;
  if(acknowledgeType=='success'){
    icon='done';
    iconColor='#39CB74';
  }else if(acknowledgeType=='failed'){
    icon='close';
    iconColor='#E54D42';
  }else{
    icon='done';
    iconColor='#39CB74';
  }
 
  return (
    <Card style={{ backgroundColor: 'white' }}
      textChildren={
        <div className="MuiCardContent-root-97">
          <div className="ack-header MuiGrid-container-98" id="material-ui-applicationSuccessContainer">
            <div className="MuiAvatar-root-195 MuiAvatar-colorDefault-196" id="material-ui-avatar" style={{width: '72px' ,height:'72px' ,backgroundColor:iconColor}}>
            <FloatingActionButton className="floating-button" style={{ boxShadow: 0 }} backgroundColor={iconColor}>
            <i id="custom-atoms-body" className="material-icons" style={{fontSize:"50px"}}>{icon}</i>
              </FloatingActionButton>
            </div>
            <div className="ack-body"  id="custom-atoms-body" >
              <h1 className="MuiTypography-root-8 MuiTypography-headline-13" id="material-ui-header">
                <span id="custom-containers-key"> <Label label={messageHeader} color='rgba(0, 0, 0, 0.87)' fontSize= '24px'  fontWeight='400' fontFamily= "Roboto"  lineHeight='1.35417em'/></span>
              </h1>
              <div className="ack-sub-body" id="custom-atoms-paragraph">
                <span > <Label label={message} color='rgba(0, 0, 0, 0.6)'fontFamily= 'Roboto'  /></span>
              </div>
            </div>
            <div className="ack-text" id="custom-atoms-tail">
              {receiptNo&&<h1  className="MuiTypography-root-8 MuiTypography-headline-13" id="material-ui-text" style={{fontSize: '16px' ,fontWeight:"400" ,color: 'rgba(0, 0, 0, 0.6)'}}  >
                <span ><Label label={receiptHeader} fontSize= '16px' fontWeight="400" color='rgba(0, 0, 0, 0.6)' /></span>
              </h1>}
              {receiptNo&&<h1 className="MuiTypography-root-8 MuiTypography-headline-13" id="material-ui-paragraph" style={{fontSize: '24px' ,fontWeight:"500"}} >
                <span ><Label label={receiptNo}  fontSize= '24px' color='rgba(0, 0, 0, 0.87)' fontWeight="500"/></span>
              </h1>}
            </div>
          </div>
        </div>


      } />
  )

};

export default AcknowledgementCard;


