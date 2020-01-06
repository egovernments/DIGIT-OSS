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

const PTInformation = ({ items, label, onItemClick, innerDivStyle, hoverColor, properties, style ,generalMDMSDataById, totalBillAmountDue,history}) => {
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
                            <PropertyAddressInfo properties={properties} generalMDMSDataById={generalMDMSDataById}></PropertyAddressInfo>
                            <AssessmentInfo properties={properties} generalMDMSDataById={generalMDMSDataById} ></AssessmentInfo>
                            <OwnerInfo properties={properties} generalMDMSDataById={generalMDMSDataById} totalBillAmountDue={totalBillAmountDue} ownershipTransfer={true} viewHistory={true}></OwnerInfo>
                            {/* <Card style={{ backgroundColor: 'rgb(242,242,242)', boxShadow: 'none' }}
                                textChildren={
                                    <div >
                                        <List
                                            innerDivStyle={innerDivStyle}
                                            items={items2}
                                            listItemStyle={{ padding: "0px", backgroundColor: 'rgb(242,242,242)', borderWidth: "10px 10px 0px" }}
                                            nestedListStyle={{ padding: "0px", backgroundColor: 'rgb(242,242,242)' }}
                                            onItemClick={onItemClick}
                                        />
                                    </div>
                                } /> */}
                                <AssessmentHistory></AssessmentHistory>
                                <PaymentHistory></PaymentHistory>
                                <Card textChildren={<TotalDues history tenantId={properties.tenantId}  consumerCode={properties.propertyId} totalBillAmountDue={totalBillAmountDue} />} style={{ backgroundColor: 'rgb(242,242,242)', boxShadow: 'none' }} />

                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default PTInformation;
