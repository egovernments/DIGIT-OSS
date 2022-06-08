import React, { useEffect, useState } from "react";
import {
  CardLabel,
  CitizenInfoLabel,
  FormStep,
  Loader,
  TextInput,
} from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";

import _ from "lodash";
import { getPattern } from '../utils';

const TLGSTNumber = ({ t, config, onSelect, value, userType, formData }) => {

    const [gstNo, setGstNo] = useState(formData?.[config.key]?.gstNo);

    // useEffect(() => {
    //   //console.log(gstNo,"this is gst no");
    //  },[gstNo])
    console.log("ayush",config)

    return (
      <FormStep
        config={config}
        onSelect={()=>onSelect(config.key, {...formData?.[config.key], gstNo })}
        t={t}
        // isDisabled={!getPattern("GSTNo").test(gstNo)}
      >
        <CardLabel>{t("TL_GST_NO")}</CardLabel>
        <TextInput value={gstNo} onChange={e=>setGstNo(e.target.value)} />
      </FormStep>
    );
};

// TLGSTNumber

const customize = () => {
  window.Digit.ComponentRegistryService.setComponent(
    "TLGSTNumber",
    TLGSTNumber
  );
};

export default customize;