import { ActionBar, Banner, Card, CardText, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";

import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";



const Response = (props) => {
 


    return (
      <Card>
      
        <CardText>
       <h1>Birth Registration Success Thank You !!!</h1>
        </CardText>
        <ActionBar>
          <Link to={"/digit-ui/citizen"}>
            <SubmitBar label="GO TO HOME" />
          </Link>
        </ActionBar>
      </Card>
    )
  

 
}

export default Response;