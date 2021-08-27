import React from 'react';
import { Card, Header, LabelFieldPair, CardLabel, TextInput ,Dropdown, FormComposer,UploadFile} from "@egovernments/digit-ui-react-components"
import { useTranslation } from 'react-i18next';

const SelectULB = ({userType,t,setValue,onSelect,config,data,formData,register,errors,setError,clearErrors,formState,control}) => {
 
    return <React.Fragment>
        <LabelFieldPair>
            <CardLabel>
              {t("ES_COMMON_DOC_DOCUMENT") + "*"}
            </CardLabel>
            {/* <UploadFile 
               onUpload={selectfile}
               onDelete={() => {
                 setUploadedFile(null);
               }}
               message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
               textStyles={{ width: "100%" }}
               inputStyles={{ width: "280px" }}
            /> */}
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel></CardLabel>
          <div style={{textAlign:"center"}} className="field">
            (OR)
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
            <CardLabel>
              {t("ES_COMMON_LINK_LABEL") + "*"}
            </CardLabel>
        </LabelFieldPair>
    </React.Fragment>

}

export default SelectULB