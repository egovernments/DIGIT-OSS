import React from "react"
import { Switch } from "react-router-dom"
import { PrivateRoute } from "@egovernments/digit-ui-react-components"
import Inbox from "./Inbox"
//import NewSurvey from "./NewSurvey"
//import Response from "./Responses"
//import EditSurvey from "./EditSurvey"
//import SurveyDetails from "./SurveyDetails"


const Surveys = ({match:{path} = {}, tenants, parentRoute}) => {
    return <Switch>
        {/* <PrivateRoute path={`${path}/inbox/create`} component={props => <NewSurvey {...props} />} /> */}
        {/* <PrivateRoute path={`${path}/inbox/details/:id`} component={props => <SurveyDetails {...props} />} /> */}
        {/* <PrivateRoute path={`${path}/inbox/edit/:id`} component={props => <EditSurvey {...props} />} /> */}
        <PrivateRoute path={`${path}/inbox`} component={props => <Inbox {...props} tenants={tenants} parentRoute={parentRoute} />} />
        {/* <PrivateRoute path={`${path}/response`} component={(props) => <Response {...props} />} /> */}

    </Switch>
}

export default Surveys