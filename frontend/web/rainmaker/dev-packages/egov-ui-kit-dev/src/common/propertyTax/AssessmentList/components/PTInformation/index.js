import React from "react";
import { List, Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

import AssessmentInfo from '../../../Property/components/AssessmentInfo';
import PropertyAddressInfo from '../../../Property/components/PropertyAddressInfo';
import OwnerInfo from '../../../Property/components/OwnerInfo';
import TotalDues from '../../../Property/components/TotalDues';
import AssessmentHistory from "./components/AssessmentHistory";
import PaymentHistory from "./components/PaymentHistory";
import ApplicationHistory from "./components/ApplicationHistory";

const PTInformation = ({ items, label, onItemClick, innerDivStyle, hoverColor, properties, style, generalMDMSDataById, totalBillAmountDue, history }) => {
    const items2 = [items[1]];
    return (
        <div className="form-without-button-cont-generic" >
            {label && (
                <Label
                    label={label}
                    containerStyle={{ padding: "24px 0px 24px 0", marginLeft: "16px" }}
                    dark={true}
                    bold={true}
                    labelStyle={{ letterSpacing: 0 }}
                    fontSize={"20px"}
                />
            )}
            <div>
                <Card
                    textChildren={
                        <div className="col-sm-12 col-xs-12" style={{ alignItems: "center" }}>
                            <Card textChildren={<TotalDues history tenantId={properties.tenantId} consumerCode={properties.propertyId} totalBillAmountDue={totalBillAmountDue} />} style={{ backgroundColor: 'rgb(242,242,242)', boxShadow: 'none' }} />
                            <PropertyAddressInfo properties={properties} generalMDMSDataById={generalMDMSDataById}></PropertyAddressInfo>
                            <AssessmentInfo properties={properties} generalMDMSDataById={generalMDMSDataById} ></AssessmentInfo>
                            <OwnerInfo properties={properties} generalMDMSDataById={generalMDMSDataById} totalBillAmountDue={totalBillAmountDue} ownershipTransfer={true} viewHistory={true}></OwnerInfo>
                            <AssessmentHistory></AssessmentHistory>
                            <PaymentHistory></PaymentHistory>
                            <ApplicationHistory></ApplicationHistory>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default PTInformation;
