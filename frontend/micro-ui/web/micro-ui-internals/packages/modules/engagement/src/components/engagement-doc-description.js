import React, { useState } from 'react';
import { Card, Header, LabelFieldPair, CardLabel, TextInput ,Dropdown, FormComposer, TextArea} from "@egovernments/digit-ui-react-components"
import { useTranslation } from 'react-i18next';

const SelectULB = ({userType,t,setValue,onSelect,config,data,formData,register,errors,setError,clearErrors,formState,control}) => {

    return <React.Fragment>
        <LabelFieldPair>
            <CardLabel>{t("ES_COMMON_DOC_DESCRIPTION") }</CardLabel>
            <div className="field">
              <TextArea name={config.key} inputRef={register()}/>
            </div>
        </LabelFieldPair>
    </React.Fragment>
}

export default SelectULB