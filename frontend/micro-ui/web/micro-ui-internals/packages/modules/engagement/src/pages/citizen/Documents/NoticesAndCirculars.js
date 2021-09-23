import {
    AppContainer,
    BackButton,
    Card,
    CardCaption,
    CardHeader,
    CardText,
    Header,
    LinkButton,
    SearchIconSvg,
    DownloadImgIcon,
    ViewsIcon,
  } from "@egovernments/digit-ui-react-components";
  import React from "react";
  
  const NoticesAndCirculars = () => {
    return (
      <AppContainer>
        <div>
          <BackButton />
        </div>
        <Header>Notices & Circulars (21)</Header>
        <div className="StandaloneSearchBar document_list_searchbar notices_circular_searchbox">
          <input type="text" placeholder="Search Documents" />
          <SearchIconSvg />
        </div>
        <Card>
          <div className="notice_and_circular_main">
            <div className="notice_and_circular_image">
              {/* <img src={DocPdfImg} alt="PDF" /> */}
            </div>
            <div className="notice_and_circular_content">
              <div className="notice_and_circular_heading_mb">
                <CardHeader>mSeva User Manual</CardHeader>
                <CardCaption>2.3MB</CardCaption>
              </div>
              <div className="notice_and_circular_caption">
                <CardCaption>Uploaded on 4th August 2021</CardCaption>
              </div>
              <div className="notice_and_circular_text">
                <CardText>
                New Muncipal document has been released in July 2021 and will be in effect from Oct 2021. All citizens are requested to follow new guidlines
                </CardText>
              </div>
              <div className="view_download_main">
                <LinkButton
                  label={
                    <div className="views">
                    <ViewsIcon />
                     <p>Views</p>
                    </div>
                  }
                />
                <LinkButton
                  label={
                    <div className="views download_views_padding">
                    <DownloadImgIcon />
                    <p>Download</p>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </Card>
        <br />
        <Card>
          <div className="notice_and_circular_main">
            <div className="notice_and_circular_image">
              {/* <img src={DocPdfImg} alt="PDF" /> */}
            </div>
            <div className="notice_and_circular_content">
              <div className="notice_and_circular_heading_mb">
                <CardHeader>Citizen Charter Document</CardHeader>
                <CardCaption>2.3MB</CardCaption>
              </div>
              <div className="notice_and_circular_caption">
                <CardCaption>Uploaded on 4th August 2021</CardCaption>
              </div>
              <div className="notice_and_circular_text">
                <CardText>
                New Muncipal document has been released in July 2021 and will be in effect from Oct 2021. All citizens are requested to follow new guidlines
                </CardText>
              </div>
              <div className="view_download_main">
                <LinkButton
                  label={
                    <div className="views">
                      <ViewsIcon />
                      <p>Views</p>
                    </div>
                  }
                />
                <LinkButton
                  label={
                    <div className="views download_views_padding">
                      <DownloadImgIcon />
                      <p>Download</p>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </Card>
      </AppContainer>
    );
  };
  
  export default NoticesAndCirculars;
  