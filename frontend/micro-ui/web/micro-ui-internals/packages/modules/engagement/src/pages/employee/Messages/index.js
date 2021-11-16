import React from "react"
import { Switch } from "react-router-dom"
import { PrivateRoute } from "@egovernments/digit-ui-react-components"
import Inbox from "./Inbox"
import NewMessage from "./NewMessage"
import Response from "./NewMessage/Response"
import EditMessage from "./EditMessage"
import MessageDetails from "./MessageDetails"
import DocumentDetails from "../../../components/Messages/DocumentDetails"

const Messages = ({match:{path} = {}, tenants, parentRoute}) => {
    return <Switch>
        <PrivateRoute path={`${path}/create`} component={props => <NewMessage {...props} />} />
        <PrivateRoute path={`${path}/inbox/create`} component={props => <NewMessage {...props} />} />
        <PrivateRoute path={`${path}/inbox/details/:id`} component={props => <DocumentDetails {...props} />} />
        <PrivateRoute path={`${path}/inbox/edit/:id`} component={props => <EditMessage {...props} />} />
        <PrivateRoute path={`${path}/inbox`} component={props => <Inbox {...props} tenants={tenants} parentRoute={parentRoute} />} />
        <PrivateRoute path={`${path}/response`} component={(props) => <Response {...props} />} />

    </Switch>
}

export default Messages