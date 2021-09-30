import {
  AppContainer,
  BackButton,
  Card,
  CardCaption,
  Header,
  Loader,
} from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"
import DocumentCard from "../../../components/Documents/DocumentCard";
import Searchbar from "../../../components/Documents/Searchbar";

const DocumentList = ({ match }) => {
  const { t } = useTranslation()
  const { category } = match.params || 'CATEGORY_CITIZEN_CHARTER';
  const tenantIds = Digit.SessionStorage.get("Employee.tenantId")
  const [pageSize, setPageSize] = useState(10);
  const [pageOffset, setPageOffset] = useState(0);
  const [searchValue, setSearchValue] = useState();


  const { data: filteredDocs, isLoading: isLoadingDocs, } = Digit.Hooks.engagement.useDocSearch({ name: searchValue, category, tenantIds }, {
    limit: pageSize,
    offset: pageOffset,
    select: (data) => {
      return data?.Documents?.map((
        { uuid,
          name,
          category,
          documentLink,
          description,
          auditDetails,
          fileSize
        }
      ) => ({
        docId: uuid,
        name,
        category,
        description,
        documentLink,
        lastModifiedDate: auditDetails?.lastModifiedTime,
        fileSize
      }))
    }
  });

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      if (searchValue.length) {
        setSearchValue("");
      }
    }
  }


  const handleSearch = async (event) => {
    if (searchValue.length) {
      setSearchValue("");
    }
  }


  if (isLoadingDocs) {
    <Loader />
  }

  return (
    <AppContainer>
      <Header>{t(`${category}`)}</Header>
      <div
      >

        <Searchbar
          searchValue={searchValue}
          handleKeyPress={handleKeyPress}
          handleSearch={handleSearch}
          onChange={setSearchValue}
          t={t}
        />
      </div>
      {
        filteredDocs &&
          filteredDocs.length ? filteredDocs.map(({ name, lastModifiedDate, description, documentLink, fileSize }, index) => (
            <DocumentCard
              key={index}
              documentTitle={name}
              documentSize={fileSize}
              lastModifiedData={lastModifiedDate}
              description={description}
              documentLink={documentLink}
              t={t}
            />
          )) :
          <Card>
            <CardCaption>{t("COMMON_INBOX_NO_DATA")}</CardCaption>
          </Card>
      }
    </AppContainer >
  );
};

export default DocumentList;
