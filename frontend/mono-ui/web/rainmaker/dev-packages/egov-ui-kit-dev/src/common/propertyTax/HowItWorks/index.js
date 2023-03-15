import React, { Component } from "react";
import Card from "egov-ui-kit/components/Card";
import Button from "egov-ui-kit/components/Button";
import BreadCrumbs from "egov-ui-kit/components/BreadCrumbs";
import Screen from "egov-ui-kit/common/common/Screen";
import Label from "egov-ui-kit/utils/translationNode";
import { List, ListItem } from "material-ui/List";
import { connect } from "react-redux";
import { addBreadCrumbs } from "egov-ui-kit/redux/app/actions";
import "./index.css";

const genericInnerdivStyle = {
  paddingLeft: 0
};

const videoCardStyle = {
  minHeight: 270
};

class HowItWorks extends Component {
  listItems = [
    {
      question: "CS_HOWITWORKS_QUESTION1",
      answer: [{ text: "CS_HOWITWORKS_ANSWER1" }]
    },
    {
      question: "CS_HOWITWORKS_QUESTION2",
      answer: [
        {
          text: "CS_HOWITWORKS_ANSWER2"
        }
      ]
    },
    {
      question: "CS_HOWITWORKS_QUESTION3",
      answer: [
        {
          text: "CS_HOWITWORKS_ANSWER3"
        }
      ]
    },
    {
      question: "CS_HOWITWORKS_QUESTION4",
      answer: [
        {
          text: "CS_HOWITWORKS_ANSWER4"
        }
      ]
    },
    {
      question: "CS_HOWITWORKS_QUESTION5",
      answer: [
        {
          text: "CS_HOWITWORKS_ANSWER5"
        }
      ]
    },
    {
      question: "CS_HOWITWORKS_QUESTION6",
      answer: [{ text: "CS_HOWITWORKS_ANSWER6" }]
    },
    {
      question: "CS_HOWITWORKS_QUESTION7",
      answer: [{ text: "CS_HOWITWORKS_ANSWER7" }]
    },
    {
      question: "CS_HOWITWORKS_QUESTION8",
      answer: [
        {
          text: "CS_HOWITWORKS_ANSWER8"
        }
      ]
    },
    {
      question: "CS_HOWITWORKS_QUESTION9",
      answer: [{ text: "CS_HOWITWORKS_ANSWER9" }]
    },
    {
      question: "CS_HOWITWORKS_QUESTION20",
      answer: [
        {
          text: "CS_HOWITWORKS_ANSWER10"
        }
      ]
    },
    {
      question: "CS_HOWITWORKS_QUESTION11",
      answer: [
        {
          text: "CS_HOWITWORKS_ANSWER11"
        }
      ]
    },
    {
      question: "CS_HOWITWORKS_QUESTION12",
      answer: [{ text: "CS_HOWITWORKS_ANSWER12" }]
    }
  ];

  componentDidMount() {
    const { addBreadCrumbs, title } = this.props;
    title && addBreadCrumbs({ title: title, path: window.location.pathname });
  }

  renderList = items => {
    return (
      <div>
        <div className="row">
          <div style={{ padding: "15px" }}>
            <Label
              label="CS_HOWITWORKS_HELP_VIDEOS_PUNJABI"
              color="#484848"
              fontSize="20px"
            />
          </div>
          <div className="col-sm-4" style={videoCardStyle}>
            <iframe
              allowFullScreen="allowFullScreen"
              frameBorder="0"
              src="https://www.youtube.com/embed/5GpLiCYS584?rel=0"
            />
            <h4>
              <Label label="CS_HOWITWORKS_PROPERTY_TAX_PAYMENT" />
            </h4>
            <p>
              <Label label="CS_HOWITWORKS_PROPERTY_TAX_PAYMENT_DESCRIPTION" />
            </p>
          </div>
          <div className="col-sm-4" style={videoCardStyle}>
            <iframe
              allowFullScreen="allowFullScreen"
              frameBorder="0"
              src="https://www.youtube.com/embed/P9U3EGNxrKU?rel=0"
            />
            <h4>
              <Label label="CS_HOWITWORKS__PARTIAL_PAY" />
            </h4>
            <p>
              <Label label="CS_HOWITWORKS__PARTIAL_PAY_DISCRIPTION" />
            </p>
          </div>
          <div className="col-sm-4" style={videoCardStyle}>
            <iframe
              allowFullScreen="allowFullScreen"
              frameBorder="0"
              src="https://www.youtube.com/embed/PKHSa33puxQ?rel=0"
            />
            <h4>
              <Label label="CS_HOWITWORKS_ASSESSMENTS" />
            </h4>
            <p>
              <Label label="CS_HOWITWORKS_ASSESSMENTS_DISCRIPTION" />
            </p>
          </div>

          <div className="col-sm-4" style={videoCardStyle}>
            <iframe
              allowFullScreen="allowFullScreen"
              frameBorder="0"
              src="https://www.youtube.com/embed/uF_G9dk_GBY?rel=0"
            />
            <h4>
              <Label label="CS_HOWITWORKS_ASSESSMENTS_INCOMPLETE" />
            </h4>
            <p>
              <Label label="CS_HOWITWORKS_ASSESSMENTS_INCOMPLETE_DISCRIPTION" />
            </p>
          </div>
          <div className="col-sm-4" style={videoCardStyle}>
            <iframe
              allowFullScreen="allowFullScreen"
              frameBorder="0"
              src="https://www.youtube.com/embed/8V1k-v93BRg?rel=0"
            />
            <h4>
              <Label label="CS_HOWITWORKS_FULL_PAY" />
            </h4>
            <p>
              <Label label="CS_HOWITWORKS_FULL_PAY_DISCRIPTION" />
            </p>
          </div>
          <div className="col-sm-4" style={videoCardStyle}>
            <iframe
              allowFullScreen="allowFullScreen"
              frameBorder="0"
              src="https://www.youtube.com/embed/gw7bS_-7aM8?rel=0"
            />
            <h4>
              <Label label="CS_HOWITWORKS_PROPERTY_PARTIAL_PAYMENT" />
            </h4>
            <p>
              <Label label="CS_HOWITWORKS_PROPERTY_PARTIAL_PAYMENT_DISCRIPTION" />
            </p>
          </div>
          <div className="col-sm-4" style={videoCardStyle}>
            <iframe
              allowFullScreen="allowFullScreen"
              frameBorder="0"
              src="https://www.youtube.com/embed/fVRd6ylStdY?rel=0"
            />
            <h4>
              <Label label="CS_HOWITWORKS_PROPERTY_ASS" />
            </h4>
            <p>
              <Label label="CS_HOWITWORKS_PROPERTY_ASS_DISCRIPTION" />
            </p>
          </div>
        </div>

        <div className="row" style={{ paddingTop: "10px" }}>
          <div style={{ padding: "15px" }}>
            <Label
              label="CS_HOWITWORKS_HELP_VIDEOS_ENGLISH"
              color="#484848"
              fontSize="20px"
            />
          </div>
          <div className="col-sm-4">
            <iframe
              allowFullScreen="allowFullScreen"
              frameBorder="0"
              src="https://www.youtube.com/embed/E0g26AzwRvs"
            />
            <h4>
              <Label label="CS_HOWITWORKS_PROPERTY_HOMEPG_REG" />
            </h4>
            <p>
              <Label label="CS_HOWITWORKS_PROPERTY_HOMEPG_REG_DISCRIPTION" />
            </p>
          </div>
          <div className="col-sm-4">
            <iframe
              allowFullScreen="allowFullScreen"
              frameBorder="0"
              src="https://www.youtube.com/embed/G2_EA0zTiM0"
            />
            <h4>
              <Label label="CS_HOWITWORKS_PROPERTY_FLOOR_UNIT" />
            </h4>
            <p>
              <Label label="CS_HOWITWORKS_PROPERTY_FLOOR_UNIT_DISCRIPTION" />
            </p>
          </div>
          <div className="col-sm-4">
            <iframe
              allowFullScreen="allowFullScreen"
              frameBorder="0"
              src="https://www.youtube.com/embed/UbmY5LmdiQc"
            />
            <h4>
              <Label label="CS_HOWITWORKS_PROPERTY_ASS_PAY" />
            </h4>
            <p>
              <Label label="CS_HOWITWORKS_PROPERTY_ASS_PAY_DISCRIPTION" />
            </p>
          </div>

          <div className="col-sm-4">
            <iframe
              allowFullScreen="allowFullScreen"
              frameBorder="0"
              src="https://www.youtube.com/embed/r6k7_J7jkYc"
            />
            <h4>
              <Label label="CS_HOWITWORKS_PROPERTY_FULL_PAYMENT1" />
            </h4>
            <p>
              <Label label="CS_HOWITWORKS_PROPERTY_FULL_PAYMENT1_DISCRIPTION" />
            </p>
          </div>
          <div className="col-sm-4">
            <iframe
              allowFullScreen="allowFullScreen"
              frameBorder="0"
              src="https://www.youtube.com/embed/oQu4qDNWP7I"
            />
            <h4>
              <Label label="CS_HOWITWORKS_PROPERTY_PARTIAL1_PAY" />
            </h4>
            <p>
              <Label label="CS_HOWITWORKS_PROPERTY_EXPLAIN" />
            </p>
          </div>
          <div className="col-sm-4">
            <iframe
              allowFullScreen="allowFullScreen"
              frameBorder="0"
              src="https://www.youtube.com/embed/3s6GtEWmf00"
            />
            <h4>
              <Label label="CS_HOWITWORKS_PROPERTY_COMPLETE_ASS" />
            </h4>
            <p>
              <Label label="CS_HOWITWORKS_PROPERTY_COMPLETE_ASS_VIDEO" />
            </p>
          </div>

          <div className="col-sm-4">
            <iframe
              allowFullScreen="allowFullScreen"
              frameBorder="0"
              src="https://www.youtube.com/embed/mKLsORPO1o8"
            />
            <h4>
              <Label label="CS_HOWITWORKS_PROPERTY_INCOMP_ASS" />
            </h4>
            <p>
              <Label label="CS_HOWITWORKS_PROPERTY_INCOMP_ASS_VIDEO" />
            </p>
          </div>
        </div>

        <div className="col-sm-12" style={{ padding: "15px 0px 30px 0px" }}>
          <a
            href={
              "https://s3.ap-south-1.amazonaws.com/pb-egov-assets/pb/PT_User_Manual_Citizen.pdf"
            }
            target="_blank"
          >
            <Button
              label={
                <Label
                  buttonLabel={true}
                  label="PT_DOWNLOAD_HELP_DOCUMENT"
                  fontSize="12px"
                />
              }
              primary={true}
              style={{ height: 30, lineHeight: "auto", minWidth: "inherit" }}
            />
          </a>
        </div>

        <div>
          <Label label="PT_FAQ" color="#484848" fontSize="20px" />
        </div>

        <hr />

        <List style={{ padding: 0 }}>
          {items.map((item, index) => {
            return (
              <ListItem
                innerDivStyle={
                  index !== 0
                    ? {
                        ...genericInnerdivStyle,
                        borderTop: "solid 1px #e0e0e0"
                      }
                    : genericInnerdivStyle
                }
                nestedListStyle={{ padding: "0 0 16px 0" }}
                primaryText={
                  <Label dark={true} label={item.question} fontSize={16} />
                }
                nestedItems={item.answer.map(nestedItem => {
                  return (
                    <ListItem
                      hoverColor="#fff"
                      primaryText={
                        <Label fontSize={16} label={nestedItem.text} />
                      }
                      innerDivStyle={{ padding: 0 }}
                    />
                  );
                })}
                primaryTogglesNestedList={true}
                hoverColor="#fff"
              />
            );
          })}
        </List>
      </div>
    );
  };

  render() {
    const { renderList, listItems } = this;
    const { urls, history } = this.props;
    return (
      <Screen className="screen-with-bredcrumb">
        <BreadCrumbs url={urls} history={history} />
        <div className="form-without-button-cont-generic">
          <Card
            className="how-it-works-card"
            textChildren={renderList(listItems)}
          />
        </div>
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const { common, app } = state;
  const { urls } = app;
  return { urls };
};

const mapDispatchToProps = dispatch => {
  return {
    addBreadCrumbs: url => dispatch(addBreadCrumbs(url))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HowItWorks);
