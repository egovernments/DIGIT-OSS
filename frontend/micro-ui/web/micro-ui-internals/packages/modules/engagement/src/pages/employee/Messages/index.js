import React from "react"
import { Switch } from "react-router-dom"
import { PrivateRoute } from "@egovernments/digit-ui-react-components"
import Inbox from "./Inbox"
import CreateMessage from "./CreateMessage"
import EditMessage from "./EditMessage"

const Messages = ({match:{path} = {}}) => {
    return <Switch>
        <PrivateRoute path={`${path}/inbox`} component={props => <Inbox {...props} />} />
        <PrivateRoute path={`${path}/create`} component={props => <CreateMessage {...props} />} />
        <PrivateRoute path={`${path}/edit/:id`} component={props => <EditMessage {...props} />} />
    </Switch>
}

export default Messages