import React from "react"
import { useTranslation } from "react-i18next"

const WhatsNewCard = ({header, actions, eventNotificationText, timePastAfterEventCreation, timeApproxiamationInUnits}) => {
    const { t } = useTranslation()

    return <div className="WhatsNewCard">
        <h2>{t(header)}</h2>
        <p>{eventNotificationText}</p>
        {actions?.map(i => <a href={i?.actionUrl}>{`${t(`CS_COMMON_${i?.code}`)}`}</a>)}
        <p>{timePastAfterEventCreation + ` ${t(timeApproxiamationInUnits)}`}</p>
    </div>
}

export default WhatsNewCard