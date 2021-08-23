import React from "react"
import { useTranslation } from "react-i18next"

const WhatsNewCard = ({header, eventNotificationText, timePastAfterEventCreation, timeApproxiamationInUnits}) => {
    const { t } = useTranslation()

    return <div className="WhatsNewCard">
        <h2>{t(header)}</h2>
        <p>{eventNotificationText}</p>
        <p>{timePastAfterEventCreation + ` ${t(timeApproxiamationInUnits)}`}</p>
    </div>
}

export default WhatsNewCard