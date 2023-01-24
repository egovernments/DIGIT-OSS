import React from "react"
import { Switch } from "react-router-dom"
import { PrivateRoute } from "@egovernments/digit-ui-react-components"
import Inbox from "./Inbox"
import NewSurvey from "./NewSurvey"
import CreateResponse from "./responses/create"
import UpdateResponse from './responses/update'
import DeleteResponse from "./responses/delete"
//import EditSurvey from "./EditSurvey"
import SurveyDetails from "./SurveyDetails"
import SurveyResults from "./SurveyResults"

const Surveys = ({match:{path} = {}, tenants, parentRoute}) => {
    return <Switch>
        <PrivateRoute path={`${path}/inbox/create`} component={props => <NewSurvey {...props} />} />
        <PrivateRoute path={`${path}/create`} component={props => <NewSurvey {...props} />} />
        <PrivateRoute path={`${path}/inbox/details/:id`} component={props => <SurveyDetails {...props} />} />
        {/* <PrivateRoute path={`${path}/inbox/edit/:id`} component={props => <EditSurvey {...props} />} /> */}
        <PrivateRoute path={`${path}/inbox/results/:id`} component={(props) => <SurveyResults {...props} />} />
        <PrivateRoute path={`${path}/inbox`} component={props => <Inbox {...props} tenants={tenants} parentRoute={parentRoute} />} />
        <PrivateRoute path={`${path}/create-response`} component={(props) => <CreateResponse {...props} />} />
        <PrivateRoute path={`${path}/update-response`} component={(props) => <UpdateResponse {...props} />} />
        <PrivateRoute path={`${path}/delete-response`} component={(props) => <DeleteResponse {...props} />} />

    </Switch>
}

export default Surveys