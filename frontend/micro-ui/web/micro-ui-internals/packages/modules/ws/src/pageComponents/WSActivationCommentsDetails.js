import { CardLabel, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";

const WSActivationCommentsDetails = ({ t, config, userType, formData, onSelect }) => {
    const [comments, setComments] = useState({
        comments: formData?.comments?.comments || ""
    });

    useEffect(() => {
        if (formData && formData?.comments) {
        }
    });

    useEffect(() => {
        if (userType === "employee") {
            onSelect(config.key, { ...formData[config.key], ...comments });
        }
    }, [comments]);

    return (
        <React.Fragment>
            <LabelFieldPair>
                <CardLabel style={{fontWeight: "700"}} className="card-label-smaller">{t("WF_COMMON_COMMENTS")}:</CardLabel>
                <div className="field">
                    <TextInput
                        key={config.key}
                        value={comments.comments}
                        onChange={(ev) => {
                            setComments({ ...comments, comments: ev.target.value });
                        }}
                    ></TextInput>
                </div>
            </LabelFieldPair>
        </React.Fragment>
    );
};

export default WSActivationCommentsDetails;