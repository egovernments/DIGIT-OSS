import React from 'react';
import { Card, Header, LabelFieldPair, CardLabel, TextInput ,Dropdown, FormComposer} from "@egovernments/digit-ui-react-components"
import {useForm, Controller} from "react-hook-form"

const SelectULB = ({userType,t,setValue,onSelect,config,data,formData,register,errors,setError,clearErrors,formState,control}) => {
    const ulbArray = [{i18nKey:"Amritsar"}]

    return <React.Fragment>
        <LabelFieldPair>
            <CardLabel>
                {t("ES_COMMON_ULB") + "*"}
            </CardLabel>
            <div className="field">
            <Controller 
                name={config.key}
                control={control}
                render={(props)=>
                <Dropdown
                    optionKey={"i18nKey"}
                    option={ulbArray}
                    select={props.onChange}
                    selected={props.value}
                />
                }
            />
            </div>
        </LabelFieldPair>
    </React.Fragment>

}

export default SelectULB