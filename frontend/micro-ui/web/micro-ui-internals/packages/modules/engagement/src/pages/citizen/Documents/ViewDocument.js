import {
  Card,
  CardCaption, Loader
} from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { openUploadedDocument } from "../../../components/Documents/DesktopInbox";

const ViewDocument = ({ match }) => {
  const { t } = useTranslation()
  const { applicationNumber: uuid, tenantId } = Digit.Hooks.useQueryParams();

  const { data, isLoading, } = Digit.Hooks.engagement.useDocSearch({ uuid, tenantId }, {
    select: (data) => {
      const mappedDocuments = data?.Documents?.map((
        { uuid,
          name,
          category,
          documentLink,
          description,
          auditDetails,
          fileSize,
          filestoreId,
        }
      ) => ({
        docId: uuid,
        name,
        category,
        description,
        documentLink,
        createdTime: auditDetails?.createdTime,
        fileSize,
        filestoreId
      }))
      return {
        documentList: mappedDocuments,
        statusCount: data?.statusCount
      };
    }
  });
  if (data?.documentList?.[0]?.filestoreId) {
    openUploadedDocument(data?.documentList?.[0]?.filestoreId, "mSeva");
  }else if(data?.documentList?.[0]?.documentLink){
    window.open(data?.documentList?.[0]?.documentLink, )
  }
  return (
    <div>
      {isLoading ? <Loader /> :
        <Card>
          <CardCaption>{data?.documentList?.[0]?.filestoreId || data?.documentList?.[0]?.documentLink ? t("COMMON_VIEW_DOC") : t("COMMON_DOC_NO_DATA")}</CardCaption>
        </Card>
      }
    </div>
  );
};

export default ViewDocument;

