import React, { useEffect } from 'react';
import { Card, Header, LabelFieldPair, CardLabel, TextInput ,Dropdown, FormComposer} from "@egovernments/digit-ui-react-components"
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';

const SelectULB = ({userType, t, setValue, onSelect, config, data, formData, register, errors, setError, clearErrors, formState, control}) => {
  const stateId = Digit.ULBService.getStateId()

  const {data:categoryData, isLoading} = Digit.Hooks.engagement.useMDMS(stateId, "CitizenEngagement", "DocumentsCategory",{
    select: (d) => d?.CitizenEngagement?.DocumentsCategory
  })

  const selectUlb = ()=>{

  }
    
    return <React.Fragment>
      <LabelFieldPair>
      <CardLabel>
          {t("ES_COMMON_DOC_CATEGORY") + "*"}
          </CardLabel>
      <Controller
      name={config.key}
      control={control}
      render={(props) => (<div className="field">
          <Dropdown optionKey={"code"} option={categoryData || []} select={props.onChange} selected={props.value} />
        </div>)
        }
      />
      </LabelFieldPair>
    </React.Fragment>

}

export default SelectULB