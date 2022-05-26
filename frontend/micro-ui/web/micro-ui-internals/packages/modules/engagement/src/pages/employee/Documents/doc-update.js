import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";


import UpdateDocComp from "./documents-update";

const UpdateDocument = () => {
  const qp = Digit.Hooks.useQueryParams();

  const [defaultValues, setValues] = useState({});

  const [loader, setLoader] = useState(true);

  const { data } = Digit.Hooks.engagement.useDocSearch(qp);

  const { data: ulbArray, isLoading: loading } = Digit.Hooks.useTenants();

  useEffect(() => {
    if (data?.Documents?.[0] && ulbArray) {
      let doc = data?.Documents?.[0];

      const dv = {
        documentName: doc.name,
        description: doc.description,
        document: {
          documentLink: doc?.documentLink,
          filestoreId: doc?.filestoreId,
        },
        ULB: ulbArray.filter((e) => e.code === doc?.tenantId),
        docCategory: doc?.category,
        originalData: doc,
      };
      setValues(dv);
      setLoader(false);
    }
  }, [data, ulbArray]);

  if (loader) return <Loader />;
  return <UpdateDocComp defaultValues={defaultValues} />;
};

export default UpdateDocument;
