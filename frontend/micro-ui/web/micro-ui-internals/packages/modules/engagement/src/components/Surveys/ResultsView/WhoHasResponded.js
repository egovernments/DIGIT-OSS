import React,{Fragment} from 'react'
import { Header,BreakLine, CardHeader,Card,CardSubHeader } from '@egovernments/digit-ui-react-components'

const WhoHasResponded = ({t,userInfo}) => {
    const data = Object.entries(userInfo);
  return (
    <div style={{"margin":"30px"}}>
        <header style={{"fontSize":"30px","fontWeight":"bold"}}>{t("WHO_RESPONDED")}</header>
       
            {/* <header style={{"display":'inline-block',"fontWeight":"bold","marginLeft":"10px","marginTop":"20px"}}>Email</header>
            <header style={{"display":'inline-block',"marginTop":"20px","marginLeft":"190px","fontWeight":"bold"}}>Phone Number</header> */}
         {/* <div className='responses-container'>
            {data.map(user => <div className='response-result' style={{"whiteSpace":"nowrap"}}> <p style={{"display":"inline-block"}}>{user[1]}</p>
            <p style={{"display":"inline-block","marginLeft":"40%"}}>{user[0]}</p><BreakLine /></div>  )} */}


            <div style={{"display":"flex","padding": "8px 4px", 
                        "background-color": "#FAFAFA",
                        "border": "1px solid #D6D5D4",
                        "boxSizing": "borderBox",
                        "borderRadius": "4px",
                        "marginTop": "20px",
                        "marginBottom": "20px"}}>
                <div style={{"flex":"50%","padding":"10px"}}>
                    <header style={{"fontWeight":"bold","fontSize":"25px"}}>Email</header>
                    {data.map(user=> <p style={{"margin":"10px 0px 10px 0px"}}>{user[1]}</p>)}
                </div>
                <div style={{"flex":"50%","padding":"10px"}}>
                    <header style={{"fontWeight":"bold","fontSize":"25px"}}>Phone Number</header>
                    {data.map(user=> <p style={{"margin":"10px 0px 10px 0px"}}>{user[0]}</p>)}
                </div>
                
            </div>
    </div>

    
    )
}

export default WhoHasResponded