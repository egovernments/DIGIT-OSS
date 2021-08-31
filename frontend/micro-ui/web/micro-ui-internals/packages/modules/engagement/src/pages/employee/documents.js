import React from 'react';
import { Card, Header, LabelFieldPair, CardLabel, TextInput ,Dropdown, FormComposer} from "@egovernments/digit-ui-react-components"
import { useTranslation } from 'react-i18next';
import { documentsFormConfig } from "./config"


const Documents = () => {

   const { t } = useTranslation()

   const onSubmit = (data) => {
       console.log(">>>>>>>>>>>",data)
   }

   return <FormComposer
            heading={t("ES_ENGAGEMENT_DOCUMENTS")}
            label={t("ES_COMMON_APPLICATION_SUBMIT")}
            config={documentsFormConfig}
            onSubmit={onSubmit}
            fieldStyle={{}}
            onFormValueChange={(a,b)=>{console.log(b)}}
        />
    
}

export default Documents