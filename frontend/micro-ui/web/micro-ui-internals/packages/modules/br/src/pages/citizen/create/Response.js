import { ActionBar, Banner, Card, CardText, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Response = (props) => {
  // const { t } = useTranslation();
  
  // const tenantId = Digit.ULBService.getCurrentTenantId();
  // const { isLoading, data  } = Digit.Hooks.br.useBRSearch(tenantId)

    return (
      <Card>
      
        <CardText>
       <h1>Birth Registration Success Thank You !!!</h1>
        </CardText>
        <Banner></Banner>
        {/* <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('Application Number')}:`}</p> <p>{data?.BirthRegistrationApplications?.[0].babyFirstName}</p> </div> */}
        <ActionBar>
          <Link to={"/digit-ui/citizen"}>
            <SubmitBar label="GO TO HOME" />
          </Link>
        </ActionBar>
      </Card>
    )
  

 
}

export default Response;