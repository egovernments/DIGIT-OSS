import React, {useEffect} from "react"
import { Header, Loader, OnGroundEventCard, Card, CardCaption} from "@egovernments/digit-ui-react-components"
import { Redirect, useLocation, useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"

const EventsListOnGround = ({variant, parentRoute}) => {
    const { t } = useTranslation()
    const location = useLocation();
    const history = useHistory();

    const tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code
    const { data:{ unreadCount: preVisitUnseenEventsCount } = {}, isSuccess: preVisitUnseenEventsCountLoaded } = Digit.Hooks.useNotificationCount({tenantId, config:{
        enabled: !!Digit.UserService?.getUser()?.access_token,
      }})

    const { data: EventsData, isLoading: EventsDataLoading } = Digit.Hooks.useEvents({tenantId, variant})
      
    if(!Digit.UserService?.getUser()?.access_token){
        return <Redirect to={{ pathname: `/digit-ui/citizen/login`, state: { from: location.pathname + location.search } }} />
    }

    if(EventsDataLoading || !preVisitUnseenEventsCountLoaded) return <Loader/>

    function onEventCardClick(id){
        history.push(parentRoute+'/events/details/'+id)
    }
    
    return <div className="CitizenEngagementNotificationWrapper">
        <Header>{`${t("EVENTS_EVENTS_HEADER")}(${EventsData?.length})`}</Header>
        {EventsData.length ? EventsData.map( DataParamsInEvent => <OnGroundEventCard onClick={onEventCardClick} {...DataParamsInEvent} />) : (<Card>
            <CardCaption>{t("COMMON_INBOX_NO_DATA")}</CardCaption>
        </Card>)}

    </div>
}

export default EventsListOnGround