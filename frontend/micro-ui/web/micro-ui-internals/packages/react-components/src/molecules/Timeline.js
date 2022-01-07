import React, { useEffect } from 'react';
import { CheckPoint } from '@egovernments/digit-ui-react-components';
import { ConnectingCheckPoints } from '@egovernments/digit-ui-react-components';

const Timeline = (props) => {
    // component to show complaint timeline status
    return (
        <div style={{
            fontSize: "14px",
            fontFamily: "Roboto",
            color: "#505a5f",
            marginTop: "5px",
        }}>
            {props.stepDetails.appstatus.length === 1 ?
                props.stepDetails.appstatus.map((i) =>
                        <CheckPoint
                            isCompleted={true}
                            label={i.status}
                            info={i.date.split('T')[0]}
                        />
                )
                :
                <ConnectingCheckPoints>
                    {props.stepDetails.appstatus.map((i) =>
                        <CheckPoint
                            isCompleted={true}
                            label={i.status}
                            info={i.date.split('T')[0]}
                        />
                    )}
                </ConnectingCheckPoints>
            }
        </div>
    );
}

export default Timeline;