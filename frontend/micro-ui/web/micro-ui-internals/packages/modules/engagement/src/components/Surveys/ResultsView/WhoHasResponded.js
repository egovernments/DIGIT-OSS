import React,{Fragment} from 'react'
import { Header,BreakLine, CardHeader,Card,CardSubHeader } from '@egovernments/digit-ui-react-components'

const WhoHasResponded = ({t,userInfo}) => {
  return (
    <div style={{"marginTop":"50px"}}>
        <CardSubHeader >{t("WHO_RESPONDED")}</CardSubHeader>
       
            <header style={{"display":'inline-block',"fontWeight":"bold","marginLeft":"50px"}}>Email</header>
            <header style={{"display":'inline-block',"marginLeft":"150px","fontWeight":"bold"}}>Phone Number</header>
         <Card style={{"backgroundColor":"#FAFAFA"}}>
            {/* <div style={{"display":"flex","flexDirection":"column","alignItems":"flex-start","padding":"16px 8px","left":"0px","top":"41px","background":"#FAFAFA","border":"1px solid #D6D5D4","boxSizing":"border-box","borderRadius":"4px"}}>
            {userInfo.map(user => (<div style={{"display":"inline-block","flex":"none","order":"1","flexGrow":"0","margin":"16px 0px"}}><p>{user.email}</p><p>{user.phone}<BreakLine /></p></div>))}
            </div> */}
            {userInfo.map(user => <div style={{"display":"flex-column"}}> <p>{user.email}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{user.phone}</p> <BreakLine /></div> )}
        </Card>



        {/* <Header>{t("WHO_RESPONDED")}</Header>
        <Card>
             
        <table>
            <tr>
                <th>Email</th>
                <th>Phone Number</th>
            </tr>
            {userInfo.map(user=> (<tr> <td>{user.email}</td> <td>{user.phone}</td><BreakLine /></tr>))}
        </table>
        </Card> */}
    </div>
    )
}

export default WhoHasResponded