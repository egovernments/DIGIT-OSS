import React from 'react';
import { Card, Header, LabelFieldPair, CardLabel, TextInput ,Dropdown, FormComposer} from "@egovernments/digit-ui-react-components"
import { useTranslation } from 'react-i18next';

const SelectULB = ({userType,t,setValue,onSelect,config,data,formData,register,errors,setError,clearErrors,formState,control}) => {

  const ulbArray = [{i18nKey:"Amritsar"}]

  const selectUlb = ()=>{}
  
    return <React.Fragment>
        <LabelFieldPair>
            <CardLabel>
            {t("ES_COMMON_DOC_CATEGORY") + "*"}
            </CardLabel>
            <div className="field">
                <Dropdown optionKey={"i18nKey"} option={ulbArray} select={selectUlb} selected={null} />
            </div>
        </LabelFieldPair>
    </React.Fragment>

}

export default SelectULB