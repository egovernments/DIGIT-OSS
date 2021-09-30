import { Clock, Header, WhatsNewCard } from '@egovernments/digit-ui-react-components'
import React from 'react'
import SurveyListCard from '../../../components/SurveyListCard'

const SurveyListData = [
    {
        id: 1,
        header: 'Water Supply Quarterly Survey',
        about: 'This is the regular quarterly water supply survey conducted by the Water Department',
        activeTime: 'Active till 9th Aug 09:00 PM',
        day: '1 day ago',
        statusData: 'Yet to Respond',
        status: false
    },
    {
        id: 2,
        header: 'Water Supply Quarterly Survey',
        about: 'This is the regular quarterly water supply survey conducted by the Water Department',
        activeTime: 'Active till 9th Aug 09:00 PM',
        day: '1 day ago',
        statusData: 'Responded',
        status: true
    },
]

const InactiveSurveyListData = [
    {
        id: 1,
        header: 'Water Supply Quarterly Survey',
        about: 'This is the regular quarterly water supply survey conducted by the Water Department',
        activeTime: 'Active till 9th Aug 09:00 PM',
        day: '1 day ago',
        statusData: 'Responded',
        status: true

    }
]
const SurveyList = () => {
    return (
        <div>
            <Header>Surveys (2)</Header>
            {
                SurveyListData && SurveyListData.map((data) => {
                    return (
                        <div className="surveyListCardMargin">
                            <SurveyListCard header={data.header} about={data.about} activeTime={data.activeTime} day={data.day} statusData={data.statusData} status={data.status} key={data.id} />
                        </div>
                    )
                })
            }
            <Header>Inactive Surveys (2)</Header>
            {
                InactiveSurveyListData && InactiveSurveyListData.map((data) => {
                    return (
                        <div className="surveyListCardMargin">
                            <SurveyListCard header={data.header} about={data.about} activeTime={data.activeTime} day={data.day} statusData={data.statusData} status={data.status} key={data.id} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SurveyList
