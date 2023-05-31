import React, { Fragment,useState,useEffect } from 'react'
import { Loader } from "./Loader"
import CardSectionHeader from './CardSectionHeader';
import { CheckPoint, ConnectingCheckPoints } from './ConnectingCheckPoints';
import BreakLine from './BreakLine';
import { useTranslation } from "react-i18next";
import TLCaption from './TLCaption';

function OpenImage(imageSource, index, thumbnailsToShow) {
    window.open(thumbnailsToShow?.fullImage?.[0], "_blank");
}

const WorkflowTimeline = ({ businessService, tenantId,applicationNo, timelineStatusPrefix="WF_SERVICE_" ,statusAttribute="status", ...props}) => {
    const [additionalComment,setAdditionalComment] = useState(false)
    //for testing from url these 2 lines of code are kept here
    // const { estimateNumber } = Digit.Hooks.useQueryParams();
    // applicationNo = applicationNo? applicationNo : estimateNumber 
    const { t } = useTranslation();

    const getTimelineCaptions = (checkpoint, index) => {

        let captionDetails = {
            name : '',
            date : '',
            mobileNumber : '',
            wfComment : '',
            additionalComment : '',
            thumbnailsToShow : ''
        }
        if(index === -1) {
            captionDetails.name = checkpoint?.assignes?.[0]?.name;
            captionDetails.date = '';
            captionDetails.mobileNumber = '';
            captionDetails.wfComment = '';
            captionDetails.additionalComment = '';
            captionDetails.thumbnailsToShow = '';
        }else {
            captionDetails.name = checkpoint?.assigner?.name;
            captionDetails.date = `${Digit.DateUtils?.ConvertTimestampToDate(checkpoint.auditDetails.lastModifiedEpoch)} ${Digit.DateUtils?.ConvertEpochToTimeInHours(
                checkpoint.auditDetails.lastModifiedEpoch
            )} ${Digit.DateUtils?.getDayfromTimeStamp(checkpoint.auditDetails.lastModifiedEpoch)}`;
            captionDetails.mobileNumber = checkpoint?.assigner?.mobileNumber;
            captionDetails.wfComment = checkpoint?.comment ? [checkpoint?.comment] : [];
            captionDetails.additionalComment = additionalComment && checkpoint?.performedAction === "APPROVE",
            captionDetails.thumbnailsToShow = checkpoint?.thumbnailsToShow;
        }

        const caption = {
            date: captionDetails?.date,
            name: captionDetails?.name,
            mobileNumber: captionDetails?.mobileNumber,
            wfComment: captionDetails?.wfComment,
            additionalComment: captionDetails?.additionalComment,
            thumbnailsToShow: checkpoint?.thumbnailsToShow
        };

        return <TLCaption data={caption} OpenImage={OpenImage} />;
        
    };

    let workflowDetails = Digit.Hooks.useWorkflowDetailsV2(
        {
            tenantId: tenantId,
            id: applicationNo,
            moduleCode: businessService,
            config: {
                enabled: true,
                cacheTime: 0
            }
        }
    );

    useEffect(() => {
        if (workflowDetails?.data?.applicationBusinessService === "muster-roll-approval" && workflowDetails?.data?.actionState?.applicationStatus === "APPROVED") {
            setAdditionalComment(true)
        }
    }, [workflowDetails])
    
    
    return (
        <Fragment>
            {workflowDetails?.isLoading && <Loader />}
            { workflowDetails?.data?.timeline?.length > 0 && (
                <React.Fragment>
                    {workflowDetails?.breakLineRequired === undefined ? <BreakLine /> : workflowDetails?.breakLineRequired ? <BreakLine /> : null}
                    {!workflowDetails?.isLoading && (
                        <Fragment>
                            <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>
                                {t("WORKS_WORKFLOW_TIMELINE")}
                            </CardSectionHeader>
                            {workflowDetails?.data?.timeline && 
                                <ConnectingCheckPoints>
                                    {workflowDetails?.data?.timeline &&
                                        workflowDetails?.data?.timeline.map((checkpoint, index, arr) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    {
                                                        index === 0 && !checkpoint?.isTerminateState &&
                                                            <React.Fragment>
                                                                <CheckPoint
                                                                    keyValue={index}
                                                                    isCompleted={index === 0}
                                                                    label={t(
                                                                        Digit.Utils.locale.getTransformedLocale(`${timelineStatusPrefix}STATE_${checkpoint?.["state"]}`)
                                                                    )}
                                                                    // customChild={getTimelineCaptions(checkpoint, -1)}
                                                                    customClassName="checkpoint-connect-wrap"
                                                                />
                                                            </React.Fragment>
                                                    }   
                                                    <CheckPoint
                                                        keyValue={index}
                                                        isCompleted={checkpoint?.isTerminateState && index === 0}
                                                        label={t(
                                                            Digit.Utils.locale.getTransformedLocale(`${timelineStatusPrefix}STATUS_${checkpoint?.performedAction === "EDIT" ? `${checkpoint?.performedAction}` :   `${checkpoint?.performedAction}`
                                                            }`)
                                                        )}
                                                        customChild={getTimelineCaptions(checkpoint, index)}
                                                    />
                                                </React.Fragment>
                                            );  
                                        })}
                                </ConnectingCheckPoints>
                            }
                        </Fragment>
                    )}
                </React.Fragment>
            )}
        </Fragment>
    )
}

export default WorkflowTimeline