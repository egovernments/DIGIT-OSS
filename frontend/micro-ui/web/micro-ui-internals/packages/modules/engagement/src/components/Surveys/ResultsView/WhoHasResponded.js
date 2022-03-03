import React,{Fragment} from 'react'
import { Header,BreakLine, CardHeader,Card,CardSubHeader } from '@egovernments/digit-ui-react-components'

const WhoHasResponded = ({t,userInfo}) => {
    const data = Object.entries(userInfo);
  return (
    <div style={{"margin":"30px"}}>
        <CardSubHeader >{t("WHO_RESPONDED")}</CardSubHeader>
       
            <header style={{"display":'inline-block',"fontWeight":"bold","marginLeft":"10px"}}>Email</header>
            <header style={{"display":'inline-block',"marginLeft":"190px","fontWeight":"bold"}}>Phone Number</header>
         <div className='responses-container'>
            {/* <div style={{"display":"flex","flexDirection":"column","alignItems":"flex-start","padding":"16px 8px","left":"0px","top":"41px","background":"#FAFAFA","border":"1px solid #D6D5D4","boxSizing":"border-box","borderRadius":"4px"}}>
            {userInfo.map(user => (<div style={{"display":"inline-block","flex":"none","order":"1","flexGrow":"0","margin":"16px 0px"}}><p>{user.email}</p><p>{user.phone}<BreakLine /></p></div>))}
            </div> */}
            {data.map(user => <div className='response-result'> <p>{user[1]}
            {user[0]}</p> <BreakLine /></div> )}
        </div>



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