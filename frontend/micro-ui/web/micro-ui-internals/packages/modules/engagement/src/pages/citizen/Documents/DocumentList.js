import {
    AppContainer,
    BackButton,
    Card,
    Header,
    SearchIconSvg,
    PrevIcon,
    Loader
  } from "@egovernments/digit-ui-react-components";
  import React,{useState} from "react";
  import { Link } from "react-router-dom";
  
  
  const Accordion = ({ title, children }) => {
    const [isOpen, setOpen] = React.useState(false);
    return (
      <div className="accordion-wrapper">
        <div className={`accordion-title ${isOpen ? "open" : ""}`} onClick={() => setOpen(!isOpen)}>
          {title}
          <PrevIcon />
        </div>
        <div className={`accordion-item ${!isOpen ? "collapsed" : ""}`}>
          <div className="accordion-content">{children}</div>
        </div>
      </div>
    );
  };
  
  const DocumentList = () => {
    const onSubmit = () => {
      console.log("onsubmit");
    };
    const handleSubmit = () => {
      console.log("handleSubmit");
    };
   // const [documentsCategories, setDocumentCategories] = useState([]);
    const stateId = Digit.ULBService.getStateId();
    const currrentUlb = Digit.ULBService.getCurrentUlb() || "pb.amritsar" ;
    const { data: categoryData, isLoading } = Digit.Hooks.engagement.useMDMS(stateId, "DocumentUploader", "UlbLevelCategories", {
      select: (d) => {
        const data = d?.DocumentUploader?.UlbLevelCategories?.filter?.((e) => e.ulb === currrentUlb);
        return data[0].categoryList;
      },
    });
  
    if(isLoading){
      return <Loader />
    }
    console.log(categoryData, "This is category DAta")
    return (
      <AppContainer>
        <div>
        </div>
        <Header>Documents</Header>
        <Card>
          <div className="StandaloneSearchBar document_list_searchbar">
            <input type="text" placeholder="Search Documents" />
            <SearchIconSvg />
          </div>
          <hr style={{color: '#ccc'}} />
          {/* Accordion */}
          <div className="wrapper">
            {categoryData && categoryData.map((title, index) => {
              return (
                <Link to="#">
                <Accordion title={title} key={index}>
                  {/* <p>{data.info}</p> */}
                </Accordion>
                </Link>
              );
            })}
          </div>
          {/* Accordion */}
        </Card>
      </AppContainer>
    );
  };
  
  export default DocumentList;
  