import React from "react";
import {Row, Col, Card, Container,Form, Button} from "react-bootstrap"


const windowHeight =(window!==undefined)? window.innerHeight:null
const HistoryList=(props)=>{

    
    return(
        <Container className="justify-content-center"  style={{
                            
                            top:windowHeight*0.3,
                            minWidth:"40%",
                            maxWidth:"45%"}}>
            <Row>
                <Card>
                    <Card.Header>
                        <Card.Title style={{fontFamily:"Roboto", fontSize:30, fontWeight:"bold"}}>
                            History
                        </Card.Title>
                    </Card.Header>
                    <Card.Body style={{overflowY:"auto", height:250,backgroundColor:"#C6C6C6"}}>
                        <Form>
                           
                       <div>
                        <h2 style={{fontSize:18, fontFamily:"Roboto",fontWeight:"lighter"}}>No History list to show right now</h2>
                        </div>
                            
                            
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

export default HistoryList;