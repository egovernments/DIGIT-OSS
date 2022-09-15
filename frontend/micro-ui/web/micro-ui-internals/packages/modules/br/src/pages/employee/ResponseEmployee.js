import { ActionBar, Banner, Card, CardText, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";




const ResponseEmployee = (props) => {
    return (
      <Card>
      
        <CardText>
       Birth Registration Approved Success !!!
       <Banner></Banner>
       DOWNLOAD BR PDF
        </CardText>
        <ActionBar>
          <Link to={"/digit-ui/employee"}>
            <SubmitBar label="GO TO HOME" />
          </Link>
        </ActionBar>
      </Card>
    )
  

 
}

export default ResponseEmployee;