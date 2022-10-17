import React from "react";
import {Row, Col, Card, Container,Form, Button} from "react-bootstrap"


const windowHeight =(window!==undefined)? window.innerHeight:null
const DisApprovalList=(props)=>{

    const personalInfoList = props.disapprovallistPersonal
    const developerInfoList = props.disapprovallistDeveloper
    const generalInfoList = props.disapprovallistGeneral
    const appliedLandInfoList = props.disapprovallistAppliedLand
    console.log(personalInfoList)
    
    return(
        <Container>
            <Row>
                <Card>
                    <Card.Header>
                        <Card.Title style={{fontFamily:"Roboto", fontSize:30, fontWeight:"bold"}}>
                            Disapproval List
                        </Card.Title>
                    </Card.Header>
                    <Card.Body style={{overflowY:"auto", height:250,backgroundColor:"#C6C6C6"}}>
                        <Form>
                            <h2 style={{fontFamily:"Roboto",fontSize:18, fontWeight:"bold", marginBottom:10}}>
                                Personal Information Disaaproval
                            </h2>
                           {(personalInfoList!==undefined && personalInfoList!==null && personalInfoList.length>0)?
                           
                           (personalInfoList.map((el,i)=>
                           <Row key={i} style={{marginBottom:10}}>
                                <Col xxl lg="1">
                                    <h4 style={{fontSize:14,fontFamily:"Roboto", fontWeight:"lighter"}}>
                                        {i+1}
                                    </h4>
                                </Col>
                                <Col xxl lg="5">
                                    <h4 style={{fontSize:14,fontFamily:"Roboto", fontWeight:"lighter"}}>
                                        {el}
                                    </h4>
                                </Col>
                                <Col xxl lg="6">
                                    <Form.Control type="text" placeholder="Reason for Disapprove">

                                    </Form.Control>
                                </Col>
                            </Row>)):
                            <div>
                                <h2 style={{fontSize:12, fontFamily:"Roboto",fontWeight:"lighter"}}>
                                    No Personal Information Disapproval list to show right now
                                </h2>
                            </div>}
                            <h2 style={{fontFamily:"Roboto",fontSize:18, fontWeight:"bold", marginTop:10, marginBottom:10}}>
                                General Information Disaaproval
                            </h2>
                            {(generalInfoList!==undefined && generalInfoList!==null && generalInfoList.length>0)?
                           
                           (generalInfoList.map((el,i)=>
                           <Row key={i} style={{marginBottom:10}}>
                                <Col xxl lg="1">
                                    <h4 style={{fontSize:14,fontFamily:"Roboto", fontWeight:"lighter"}}>
                                        {i+1}
                                    </h4>
                                </Col>
                                   <Col xxl lg="5">
                                       <h4 style={{fontSize:14,fontFamily:"Roboto", fontWeight:"lighter"}}>
                                               {el}
                                           </h4>
                                   </Col>
                                   <Col xxl lg="6">
                                       <Form.Control type="text" placeholder="Reason for Disapprove">

                                       </Form.Control>
                                   </Col>
                               </Row>)):
                           <div>
                               <h2 style={{fontSize:12, fontFamily:"Roboto",fontWeight:"lighter"}}>
                                No General Information Disapproval list to show right now</h2>
                           </div>
                       }

                            <h2 style={{fontFamily:"Roboto",fontSize:18, fontWeight:"bold", marginTop:10, marginBottom:10}}>
                                Purpose Information Disaaproval
                            </h2>
                            {(developerInfoList!==undefined && developerInfoList!==null && developerInfoList.length>0)?
                           
                                (developerInfoList.map((el,i)=>
                                <Row key={i} style={{marginBottom:10}}>
                                     <Col xxl lg="1">
                                        <h4 style={{fontSize:14,fontFamily:"Roboto", fontWeight:"lighter"}}>
                                            {i+1}
                                        </h4>
                                    </Col>
                                        <Col xxl lg="5">
                                            <h4 style={{fontSize:14,fontFamily:"Roboto", fontWeight:"lighter"}}>
                                                    {el}
                                                </h4>
                                        </Col>
                                        <Col xxl lg="6">
                                            <Form.Control type="text" placeholder="Reason for Disapprove">

                                            </Form.Control>
                                        </Col>
                                    </Row>)):
                                <div>
                                    <h2 style={{fontSize:12, fontFamily:"Roboto",fontWeight:"lighter"}}>
                                        No Purpose Information Disapproval list to show right now</h2>
                                </div>
                            }
                            <h2 style={{fontFamily:"Roboto",fontSize:18, fontWeight:"bold", marginTop:10, marginBottom:10}}>
                                Applied Land Information Disaaproval
                            </h2>
                            {(appliedLandInfoList!==undefined && appliedLandInfoList!==null && appliedLandInfoList.length>0)?
                           
                           (appliedLandInfoList.map((el,i)=>
                           <Row key={i} style={{marginBottom:10}}>
                                    <Col xxl lg="1">
                                        <h4 style={{fontSize:14,fontFamily:"Roboto", fontWeight:"lighter"}}>
                                            {i+1}
                                        </h4>
                                    </Col>
                                   <Col xxl lg="5">
                                       <h4 style={{fontSize:14,fontFamily:"Roboto", fontWeight:"lighter"}}>
                                               {el}
                                           </h4>
                                   </Col>
                                   <Col xxl lg="6">
                                       <Form.Control type="text" placeholder="Reason for Disapprove">

                                       </Form.Control>
                                   </Col>
                               </Row>)):
                           <div>
                               <h2 style={{fontSize:12, fontFamily:"Roboto",fontWeight:"lighter"}}>
                                    No Applied Land Information Disapproval list to show right now
                                </h2>
                           </div>
                       }

                            
                        </Form>
                    </Card.Body>
                    <Card.Footer>
                        <div style={{position:"relative",float:"right"}}>
                            <Button>Submit</Button>
                        </div>
                    </Card.Footer>
                </Card>
            </Row>

        </Container>
    )
}

export default DisApprovalList;