import { CardLabel, Dropdown, LabelFieldPair, Loader, TextInput, CardLabelError, CheckBox, StatusTable, Row, CardSubHeader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { getPattern } from "../utils";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import _ from "lodash";

const createConnectionDetails = () => ({
    water: true,
    sewerage: false,
    applicationNo: "ABC-XYZ-123-87766",
    serviceName: "",
});


const WSDisconnectionDetails = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
    const { t } = useTranslation();
    const [connectionDetails, setConnectionDetails] = useState(formData?.ConnectionDetails ? [formData?.ConnectionDetails?.[0]] : [createConnectionDetails()]);

    useEffect(() => {
        if (!formData?.ConnectionDetails) {
            setConnectionDetails([createConnectionDetails()]);
        }
    }, [formData?.ConnectionDetails]);

    return (
        <React.Fragment>
            <StatusTable>
                <Row className="border-none" key={`WS_MYCONNECTIONS_CONSUMER_NO`} label={`${t(`WS_MYCONNECTIONS_CONSUMER_NO`)}:`} text={'ABC-XYZ-123-87766'} />
            </StatusTable>
        </React.Fragment>
    );
};


export default WSDisconnectionDetails;