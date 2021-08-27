import React from 'react';
import { Card, Header, LabelFieldPair, CardLabel, TextInput ,Dropdown, FormComposer} from "@egovernments/digit-ui-react-components"
import { useTranslation } from 'react-i18next';
import { documentsFormConfig } from "./config"


const Documents = () => {
   const { t } = useTranslation()
   console.log(documentsFormConfig,"documents form config")

   return <FormComposer
            heading={t("ES_ENGAGEMENT_DOCUMENTS")}
            label={t("ES_COMMON_APPLICATION_SUBMIT")}
            config={documentsFormConfig}
            onSubmit={(v)=>{console.log(v)}}
            fieldStyle={{}}
            onFormValueChange={(a,b)=>{console.log(b)}}
        />
    
}

export default Documents