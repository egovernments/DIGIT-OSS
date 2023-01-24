import { AppContainer, Card, CardCaption, Header, Loader } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DocumentCard from "../../../components/Documents/DocumentCard";
import Searchbar from "../../../components/Documents/Searchbar";
import { useDebounce } from "../../../hooks/useDebounce";

const DocumentList = ({ match }) => {
  const { t } = useTranslation();
  const { category, count } = match.params;
  const tenantIds = Digit.ULBService.getCitizenCurrentTenant();
  const [pageSize, setPageSize] = useState(20);
  const [pageOffset, setPageOffset] = useState(0);
  const [searchValue, setSearchValue] = useState();

  const debouncedSearchQuery = useDebounce(searchValue, 700);
  const { data: filteredDocs, isLoading: isLoadingDocs } = Digit.Hooks.engagement.useDocSearch(
    { name: debouncedSearchQuery, category, tenantIds, limit: pageSize },
    {
      select: (data) => {
        return data?.Documents?.map(({ uuid, name, category, documentLink, description, auditDetails, fileSize, filestoreId }) => ({
          docId: uuid,
          name,
          category,
          description,
          documentLink,
          createdTime: auditDetails?.createdTime,
          fileSize,
          filestoreId,
        }));
      },
    }
  );

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      if (searchValue.length) {
        setSearchValue("");
      }
    }
  };

  const handleSearch = async (event) => {
    if (searchValue.length) {
      setSearchValue("");
    }
  };

  if (isLoadingDocs) {
    <Loader />;
  }

  return (
    <AppContainer>
      <Header>{`${t(`${category}`)} (${count ? count : "-"})`}</Header>
      <div className="documentContainerPadding">
        <div>
          <Searchbar searchValue={searchValue} handleKeyPress={handleKeyPress} handleSearch={handleSearch} onChange={setSearchValue} t={t} />
        </div>
        {isLoadingDocs ? (
          <Loader />
        ) : filteredDocs && filteredDocs.length ? (
          renderDocsList(filteredDocs, t)
        ) : (
          <Card>
            <CardCaption>{t("COMMON_INBOX_NO_DATA")}</CardCaption>
          </Card>
        )}
      </div>
    </AppContainer>
  );
};

export default DocumentList;

export const renderDocsList = (documents, t) =>
  documents.map(({ name, createdTime, description, documentLink, fileSize, filestoreId }, index) => (
    <DocumentCard
      key={index}
      documentTitle={name}
      documentSize={fileSize}
      lastModifiedData={createdTime}
      description={description}
      documentLink={documentLink}
      filestoreId={filestoreId}
      t={t}
    />
  ));
