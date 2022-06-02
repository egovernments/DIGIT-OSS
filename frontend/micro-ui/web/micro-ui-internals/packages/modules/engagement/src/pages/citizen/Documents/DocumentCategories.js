import { AppContainer, Card, CardCaption, Header, Loader, PrevIcon } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Searchbar from "../../../components/Documents/Searchbar";
import { useDebounce } from "../../../hooks/useDebounce";
import { renderDocsList } from "./DocumentList";

const Accordion = ({ t, title, count, onClick, children }) => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <div className="accordion-wrapper" onClick={() => onClick(title, count)}>
      <div className={`accordion-title ${isOpen ? "open" : ""}`} onClick={() => setOpen(!isOpen)}>
        {`${t(title)} (${count})`}
        <PrevIcon />
      </div>
      <div className={`accordion-item ${!isOpen ? "collapsed" : ""}`}>
        <div className="accordion-content">{children}</div>
      </div>
    </div>
  );
};

const DocumentCategories = ({ t, parentRoute }) => {
  const history = useHistory();
  const [searchValue, setSearchValue] = useState("");
  const tenantIds = Digit.ULBService.getCitizenCurrentTenant();

  const debouncedSearchQuery = useDebounce(searchValue, 700);

  const { data, isLoading } = Digit.Hooks.engagement.useDocSearch(
    { name: debouncedSearchQuery, tenantIds },
    {
      select: (data) => {
        const mappedDocuments = data?.Documents?.map(({ uuid, name, category, documentLink, description, auditDetails, fileSize, filestoreId }) => ({
          docId: uuid,
          name,
          category,
          description,
          documentLink,
          createdTime: auditDetails?.createdTime,
          fileSize,
          filestoreId,
        }));
        return {
          documentList: mappedDocuments,
          statusCount: data?.statusCount,
        };
      },
    }
  );

  if (!Digit.UserService?.getUser()?.access_token) {
    return <Redirect to={{ pathname: `/digit-ui/citizen/login`, state: { from: location.pathname + location.search } }} />;
  }

  const showDocuments = (category, count) => {
    history.push(`documents/list/${category}/${count}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setSearchValue("");
    }
  };

  const handleSearch = (event) => {
    setSearchValue("");
  };

  /*  if (isLoading) {
     return <Loader />
   } */
  return (
    <AppContainer>
      <Header>{t("DOCUMENTS_DOCUMENT_HEADER")}</Header>
      <div className="Docs_CardWrapper">
        <Searchbar searchValue={searchValue} handleKeyPress={handleKeyPress} handleSearch={handleSearch} onChange={setSearchValue} t={t} />
        <hr style={{ color: "#ccc" }} />
        {isLoading ? (
          <Loader />
        ) : (
          <div className="wrapper">
            {searchValue.length && data?.documentList?.length ? (
              renderDocsList(data.documentList, t)
            ) : data?.statusCount && data?.statusCount?.length ? (
              data?.statusCount?.map(({ category, count }, index) => {
                return <Accordion t={t} title={category} count={count} key={index} onClick={showDocuments} />;
              })
            ) : (
              <Card>
                <CardCaption>{t("COMMON_INBOX_NO_DATA")}</CardCaption>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppContainer>
  );
};

export default DocumentCategories;
