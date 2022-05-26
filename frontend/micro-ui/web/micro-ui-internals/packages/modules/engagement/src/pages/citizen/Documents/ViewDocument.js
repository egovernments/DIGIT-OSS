import {
  AppContainer, Card,
  CardCaption, Header, Loader
} from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import DocumentCard from "../../../components/Documents/DocumentCard";

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
  
  /* 
    Logic to view image on load of screen
    if (data?.documentList?.[0]?.filestoreId) {
      openUploadedDocument(data?.documentList?.[0]?.filestoreId, "mSeva");
    } else if (data?.documentList?.[0]?.documentLink) {
      window.open(data?.documentList?.[0]?.documentLink,)
    }
   */

  const { documentList = [] } = data || {};
  const { name = false, createdTime, description, documentLink, fileSize, filestoreId } = documentList?.[0] || {};

  return (
    <AppContainer>
      <Header>{`${t(`COMMON_VIEW_DOC`)}`}</Header>
      {isLoading && <Loader />}
      {name && <DocumentCard
        key={1}
        documentTitle={name}
        documentSize={fileSize}
        lastModifiedData={createdTime}
        description={description}
        documentLink={documentLink}
        filestoreId={filestoreId}
        t={t}
      />}
      {!name && !isLoading && <Card>
        <CardCaption>{t("COMMON_DOC_DATA_NOT_FOUND")}</CardCaption>
      </Card>}
    </AppContainer>
  );
};

export default ViewDocument;

