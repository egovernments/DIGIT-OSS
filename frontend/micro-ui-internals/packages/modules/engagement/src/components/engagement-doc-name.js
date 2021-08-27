import React from 'react';
import { Card, Header, LabelFieldPair, CardLabel, TextInput ,Dropdown, FormComposer} from "@egovernments/digit-ui-react-components"
import { useTranslation } from 'react-i18next';

const SelectULB = ({userType,t,setValue,onSelect,config,data,formData,register,errors,setError,clearErrors,formState,control}) => {
console.log(register(config.key),config)
    return <React.Fragment>
        <LabelFieldPair>
            <CardLabel>{t("ES_COMMON_DOC_NAME") + "*"}</CardLabel>
            <div className="field">
              <TextInput name={(config.key)} inputRef={register()} />
            </div>
        </LabelFieldPair>
    </React.Fragment>

}

export default SelectULB