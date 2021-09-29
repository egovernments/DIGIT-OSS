import {
  AppContainer,
  BackButton,
  Card,
  CardCaption,
  Header,
  SearchIconSvg,
  PrevIcon,
  Loader
} from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Searchbar from "../../../components/Documents/Searchbar";


const Accordion = ({ t, title, onClick, children }) => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <div className="accordion-wrapper" onClick={() => onClick(title)}>
      <div className={`accordion-title ${isOpen ? "open" : ""}`} onClick={() => setOpen(!isOpen)}>
        {t(title)}
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
  const [searchValue, setSearchValue] = useState('');

  // const [documentsCategories, setDocumentCategories] = useState([]);
  const stateId = Digit.ULBService.getStateId();
  const currrentUlb = Digit.ULBService.getCurrentUlb() || { code: "pb.amritsar" };
  const { data: categoryData, isLoading } = Digit.Hooks.engagement.useMDMS(stateId, "DocumentUploader", ["UlbLevelCategories"], {
    select: (d) => {
      const data = d?.DocumentUploader?.UlbLevelCategories?.filter?.((e) => e.ulb === currrentUlb.code);
      return data[0].categoryList;
    },
  });

  if (!Digit.UserService?.getUser()?.access_token) {
    return <Redirect to={{ pathname: `/digit-ui/citizen/login`, state: { from: location.pathname + location.search } }} />
  }

  const showDocuments = (category) => {
    history.push(`documents/list/${category}`)
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setSearchValue("");
    }
  }


  const handleSearch = (event) => {
    setSearchValue("");
  }

  if (isLoading) {
    return <Loader />
  }
  return (
    <AppContainer>
      <div>
      </div>
      <Header>{t('DOCUMENTS_DOCUMENT_HEADER')}</Header>
      <Card>
          <Searchbar
            searchValue={searchValue}
            handleKeyPress={handleKeyPress}
            handleSearch={handleSearch}
            onChange={setSearchValue}
            t={t}
          />
        <hr style={{ color: '#ccc' }} />
        {/* Accordion */}
        <div className="wrapper">
          {categoryData && categoryData?.length ?
            categoryData.map((title, index) => {
              return (
                <Link key={index} to="#">
                  <Accordion t={t} title={title} key={index} onClick={showDocuments}>
                    {/* <p>{data.info}</p> */}
                  </Accordion>
                </Link>
              );
            }) :
            (<Card>
              <CardCaption>{t("COMMON_INBOX_NO_DATA")}</CardCaption>
            </Card>)}
        </div>
        {/* Accordion */}
      </Card>
    </AppContainer>
  );
};

export default DocumentCategories;
