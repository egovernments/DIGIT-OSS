import React from "react";
import {  LabelFieldPair, CardLabel, Dropdown,} from "@egovernments/digit-ui-react-components";
import { Controller } from "react-hook-form";
import { alphabeticalSortFunctionForTenantsBasedOnName } from "../../utils";

const ULBDropdown = ({ userType, t, setValue, onSelect, config, data, formData, register, errors, setError, clearErrors, formState, control }) => {
    const ulbs = Digit.SessionStorage.get("ENGAGEMENT_TENANTS");
    const userInfo = Digit.UserService.getUser().info;
    const userUlbs = ulbs.filter(ulb => userInfo?.roles?.some(role => role?.tenantId === ulb?.code)).sort(alphabeticalSortFunctionForTenantsBasedOnName);
    return (
        <React.Fragment>
            <LabelFieldPair style={{ alignItems: 'start' }}>
                <CardLabel style={{ fontWeight: "bold" }}>{t("ES_COMMON_ULB") + "*"}</CardLabel>
                <div className="field">
                    <Controller
                        name={config.key}
                        control={control}
                        rules={{ required: true }}
                        render={({ onChange, value }) => <Dropdown option={userUlbs} selected={value} disable={userUlbs?.length === 1}  optionKey={"code"} t={t} select={onChange} />}
                    />
                    {errors && errors[config?.key] && <CardLabelError>{t(`EVENTS_TENANT_ERROR_REQUIRED`)}</CardLabelError>}
                </div>
            </LabelFieldPair>
        </React.Fragment>
    );
};

export default ULBDropdown;
