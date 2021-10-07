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


const Accordion = ({ t, title, count, onClick, children }) => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <div className="accordion-wrapper" onClick={() => onClick(title,count)}>
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
  const [searchValue, setSearchValue] = useState('');

  const tenantIds = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code;
  const { data: categoriesWithCount , isLoading, } = Digit.Hooks.engagement.useDocSearch({ tenantIds }, {
    select: (data) => {
      return data?.statusCount;
    } 
  });

  if (!Digit.UserService?.getUser()?.access_token) {
    return <Redirect to={{ pathname: `/digit-ui/citizen/login`, state: { from: location.pathname + location.search } }} />
  }

  const showDocuments = (category, count) => {
    history.push(`documents/list/${category}/${count}`)
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
          {categoriesWithCount && categoriesWithCount?.length ?
            categoriesWithCount.map(({category, count}, index) => {
              return (
                <Link key={index} to="#">
                  <Accordion t={t} title={category} count={count} key={index} onClick={showDocuments}>
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
