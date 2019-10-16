import React, { Component } from "react";
import WizardComponent from "./components/WizardComponent";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import {
  deleteForm,
  updateForms,
  handleFieldChange
} from "egov-ui-kit/redux/form/actions";
import PTHeader from "egov-ui-kit/common/common/PTHeader";
import Label from "egov-ui-kit/utils/translationNode";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import {
  UsageInformationHOC,
  PropertyAddressHOC,
  OwnershipTypeHOC,
  OwnerInfoHOC,
  InstitutionHOC,
  OwnerInformation,
  InstitutionAuthorityHOC
} from "./components/Forms";
import ReviewForm from "./components/ReviewForm";
import FloorsDetails from "./components/Forms/FloorsDetails";
import PlotDetails from "./components/Forms/PlotDetails";
import MultipleOwnerInfoHOC from "./components/Forms/MultipleOwnerInfo";
import { connect } from "react-redux";
import { setRoute } from "egov-ui-kit/redux/app/actions";
import { validateForm } from "egov-ui-kit/redux/form/utils";
import { displayFormErrors } from "egov-ui-kit/redux/form/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import {
  getQueryValue,
  getFinancialYearFromQuery,
  getEstimateFromBill
} from "egov-ui-kit/utils/PTCommon";
import { get, set, isEqual } from "lodash";
import { fetchFromLocalStorage } from "egov-ui-kit/utils/commons";
import range from "lodash/range";
import { hideSpinner, showSpinner } from "egov-ui-kit/redux/common/actions";
import {
  fetchGeneralMDMSData,
  generalMDMSFetchSuccess,
  updatePrepareFormDataFromDraft
} from "egov-ui-kit/redux/common/actions";
import PaymentDetails from "./components/PaymentDetails";
import { getDocumentTypes } from "./utils/mdmsCalls";
import { convertRawDataToFormConfig } from "egov-ui-kit/utils/PTCommon/propertyToFormTransformer";
import { fetchMDMDDocumentTypeSuccess } from "redux/store/actions";
import "./index.css";
import {
  addOwner,
  configOwnersDetailsFromDraft,
  getTargetPropertiesDetails,
  getSelectedCombination,
  getSingleOwnerInfo,
  getMultipleOwnerInfo,
  getInstituteInfo,
  getCalculationScreenData,
  getHeaderLabel,
  validateUnitandPlotSize,
  normalizePropertyDetails,
  getImportantDates,
  renderPlotAndFloorDetails,
  removeAdhocIfDifferentFY
} from "egov-ui-kit/utils/PTCommon/FormWizardUtils";
import sortBy from "lodash/sortBy";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";
import AcknowledgementCard from "egov-ui-kit/common/propertyTax/AcknowledgementCard";
import generateAcknowledgementForm from "egov-ui-kit/common/propertyTax/PaymentStatus/Components/acknowledgementFormPDF";
import { getHeaderDetails } from "egov-ui-kit/common/propertyTax/PaymentStatus/Components/createReceipt";

class FormWizard extends Component {
  state = {
    dialogueOpen: false,
    financialYearFromQuery: "",
    selected: 0,
    ownerInfoArr: [],
    showOwners: false,
    formValidIndexArray: [],
    ownersCount: 0,
    estimation: [],
    importantDates: {},
    draftRequest: {
      draft: {
        tenantId: getTenantId(),
        userId: get(JSON.parse(getUserInfo()), "uuid"),
        draftRecord: {}
      }
    },
    propertyDetails: {},
    bill: [],
    partialAmountError: "",
    totalAmountToBePaid: 100,
    isFullPayment: true,
    valueSelected: "Full_Amount",
    nextButtonEnabled: true,
    calculationScreenData: [],
    assessedPropertyDetails: {},
    imageUrl: ''
  };

  updateTotalAmount = (value, isFullPayment, errorText) => {
    this.setState({
      totalAmountToBePaid: value,
      isFullPayment,
      partialAmountError: errorText
    });
  };

  fetchDraftDetails = async (draftId, isReassesment, draftUuid) => {
    const { draftRequest } = this.state;
    const {
      fetchMDMDDocumentTypeSuccess,
      updatePrepareFormDataFromDraft,
      location
    } = this.props;
    const { search } = location;
    const financialYearFromQuery = getFinancialYearFromQuery();
    const propertyId = getQueryValue(search, "propertyId");
    const assessmentId = getQueryValue(search, "assessmentId");
    const tenantId = getQueryValue(search, "tenantId");
    const isCompletePayment = getQueryValue(search, "isCompletePayment");
    getImportantDates(this);
    try {
      let currentDraft;
      if (!isReassesment) {
        let draftsResponse = await httpRequest(
          "pt-services-v2/drafts/_search",
          "_search",
          [
            {
              key: isReassesment ? "assessmentNumber" : "id",
              value: draftId
            },
            {
              key: "tenantId",
              value: getQueryValue(search, "tenantId")
            }
          ],
          draftRequest
        );
        currentDraft = draftsResponse.drafts.find(
          res =>
            get(res, "assessmentNumber", "") === draftId ||
            get(res, "id", "") === draftId
        );
      } else {
        const searchPropertyResponse = await httpRequest(
          "pt-services-v2/property/_search",
          "_search",
          [
            {
              key: "tenantId",
              value: tenantId
            },
            {
              key: "ids",
              value: getQueryValue(search, "propertyId") //"PT-107-001278",
            }
          ]
        );
        if (
          searchPropertyResponse.Properties[0].propertyDetails &&
          searchPropertyResponse.Properties[0].propertyDetails.length > 0
        ) {
          searchPropertyResponse.Properties[0].propertyDetails.forEach(item => {
            item.units = sortBy(
              item.units,
              unit => parseInt(unit.floorNo) || -99999
            );
          });
        }
        // console.log(searchPropertyResponse);
        let propertyResponse = {
          ...searchPropertyResponse,
          Properties: [
            {
              ...searchPropertyResponse.Properties[0],
              propertyDetails: getTargetPropertiesDetails(
                searchPropertyResponse.Properties[0].propertyDetails,
                this
              )
            }
          ]
        };
        const preparedForm = convertRawDataToFormConfig(propertyResponse); //convertRawDataToFormConfig(responseee)
        currentDraft = {
          draftRecord: {
            ...preparedForm,
            selectedTabIndex: 3,
            prepareFormData: propertyResponse //prepareFormData2,
          }
        };
      }

      if (!currentDraft) {
        throw new Error("draft not found");
      }

      this.setState({
        draftByIDResponse: currentDraft
      });
      const ownerFormKeys = Object.keys(currentDraft.draftRecord).filter(
        formName => formName.indexOf("ownerInfo_") !== -1
      );
      const { ownerDetails, totalowners } = configOwnersDetailsFromDraft(
        ownerFormKeys,
        OwnerInformation
      );
      const activeTab =
        get(currentDraft, "draftRecord.selectedTabIndex", 0) > 3
          ? 3
          : get(currentDraft, "draftRecord.selectedTabIndex", 0);
      const activeModule = get(
        currentDraft,
        "draftRecord.propertyAddress.fields.city.value",
        ""
      );
      if (!!activeModule) {
        const documentTypeMdms = await getDocumentTypes();
        if (!!documentTypeMdms) fetchMDMDDocumentTypeSuccess(documentTypeMdms);
      }
      if (isReassesment) {
        activeModule &&
          this.props.handleFieldChange("propertyAddress", "city", activeModule);
        let prepareFormData = get(
          currentDraft,
          "draftRecord.prepareFormData",
          {}
        );
        let lastAssessedFY = get(
          prepareFormData,
          "Properties[0].propertyDetails[0].financialYear"
        );
        lastAssessedFY !== financialYearFromQuery &&
          (prepareFormData = removeAdhocIfDifferentFY(
            prepareFormData,
            financialYearFromQuery
          ));
        set(currentDraft, "draftRecord.prepareFormData", prepareFormData);
      }

      updatePrepareFormDataFromDraft(
        get(currentDraft, "draftRecord.prepareFormData", {})
      );
      this.props.updatePTForms(currentDraft.draftRecord);

      //Get estimate from bill in case of complete payment
      if (isCompletePayment) {
        const billResponse =
          activeTab >= 3 &&
          isCompletePayment &&
          (await this.callGetBill(
            propertyId,
            assessmentId,
            financialYearFromQuery,
            tenantId,
            false
          ));
        const estimateFromGetBill = billResponse
          ? getEstimateFromBill(billResponse.Bill)
          : [];
        this.setState({
          estimation: estimateFromGetBill,
          totalAmountToBePaid:
            (estimateFromGetBill &&
              estimateFromGetBill[0] &&
              estimateFromGetBill[0].totalAmount) ||
            0,
          Bill: billResponse && billResponse.Bill
        });
      }
      this.setState(
        {
          ownerInfoArr: ownerDetails,
          ownersCount: totalowners,
          formValidIndexArray: range(0, activeTab),
          selected: activeTab,
          draftRequest: {
            draft: {
              id: null,
              ...currentDraft
            }
          }
        },
        () => {
          {
            if (activeTab >= 3 && !isCompletePayment) {
              this.estimate().then(estimateResponse => {
                if (estimateResponse) {
                  this.setState({
                    estimation:
                      estimateResponse && estimateResponse.Calculation,
                    totalAmountToBePaid: get(
                      estimateResponse,
                      "Calculation[0].totalAmount",
                      0
                    )
                  });
                }
              });
            }
            if (activeTab === 4) this.pay();
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  componentWillReceiveProps = nextprops => {
    if (!isEqual(nextprops, this.props)) {
      let inputType = document.getElementsByTagName("input");
      for (let input in inputType) {
        if (inputType[input].type === "number") {
          inputType[input].addEventListener("mousewheel", function () {
            this.blur();
          });
        }
      }
    }
  };

  componentDidMount = async () => {
    let {
      location,
      fetchMDMDDocumentTypeSuccess,
      renderCustomTitleForPt,
      showSpinner,
      hideSpinner,
      fetchGeneralMDMSData
    } = this.props;
    let { search } = location;
    showSpinner();
    const { selected } = this.state;
    const isReasses = Boolean(getQueryValue(search, "isReassesment").replace('false', ''));
    const propertyId = getQueryValue(search, "propertyId");
    const isReassesment = Boolean(getQueryValue(search, "isReassesment").replace('false', ''));
    const tenantId = getQueryValue(search, "tenantId");
    const draftUuid = getQueryValue(search, "uuid");
    const assessmentId =
      getQueryValue(search, "assessmentId") || fetchFromLocalStorage("draftId");

    if (assessmentId) {
      fetchGeneralMDMSData(
        null,
        "PropertyTax",
        [
          "Floor",
          "OccupancyType",
          "OwnerShipCategory",
          "OwnerType",
          "PropertySubType",
          "PropertyType",
          "SubOwnerShipCategory",
          "UsageCategoryDetail",
          "UsageCategoryMajor",
          "UsageCategoryMinor",
          "UsageCategorySubMinor",
          "Rebate",
          "Penalty",
          "Interest",
          "FireCess"
        ],
        "",
        tenantId
      );
      await this.fetchDraftDetails(assessmentId, isReassesment, draftUuid);
      if (selected > 2) {

        const { tenantId: id } = this.state.assessedPropertyDetails.Properties[0].propertyDetails[0];


        let receiptImageUrl = `https://s3.ap-south-1.amazonaws.com/pb-egov-assets/${id}/logo.png`;
        this.convertImgToDataURLviaCanvas(
          receiptImageUrl,
          function (data) {
            this.setState({ imageUrl: data });
          }.bind(this)
        );
      }
    }

    const { ownerInfoArr } = this.state;

    if (ownerInfoArr.length < 2) {
      addOwner(true, OwnerInformation, this);
    }

    const documentTypeMdms = await getDocumentTypes();
    if (!!documentTypeMdms) fetchMDMDDocumentTypeSuccess(documentTypeMdms);

    const financialYearFromQuery = getFinancialYearFromQuery();
    this.setState({
      financialYearFromQuery
    });

    const titleObject = isReasses
      ? [
        "PT_REASSESS_PROPERTY",
      ]
      : [
        "PT_PROPERTY_ASSESSMENT_HEADER",
        `(${financialYearFromQuery})`,
        ":",
        "PT_ADD_NEW_PROPERTY"
      ];

    renderCustomTitleForPt({ titleObject });
    hideSpinner();
  };

  handleRemoveOwner = (index, formKey) => {
    const { ownerInfoArr } = this.state;
    const updatedOwnerArr = [...ownerInfoArr];
    updatedOwnerArr.splice(
      ownerInfoArr.findIndex(ownerData => ownerData.index === index),
      1
    );
    this.setState({
      ownerInfoArr: updatedOwnerArr
    });
    this.props.deleteForm(formKey);
  };

  getConfigFromCombination = (combination, fetchConfigurationFn) => {
    let configObject = fetchConfigurationFn(combination);
    return configObject;
  };

  getOwnerDetails = ownerType => {
    const { selected } = this.state;
    const isReviewPage = selected === 3;
    switch (ownerType) {
      case "SINGLEOWNER":
        return <OwnerInfoHOC disabled={isReviewPage} />;
      case "MULTIPLEOWNERS":
        return (
          <MultipleOwnerInfoHOC
            addOwner={() => {
              addOwner(false, OwnerInformation, this);
            }}
            handleRemoveOwner={this.handleRemoveOwner}
            ownerDetails={this.state.ownerInfoArr}
            disabled={isReviewPage}
          />
        );
      case "INSTITUTIONALPRIVATE":
      case "INSTITUTIONALGOVERNMENT":
        return (
          <div>
            <InstitutionHOC disabled={isReviewPage} />
            <InstitutionAuthorityHOC
              cardTitle={
                <Label
                  label="PT_DETAILS_OF_AUTHORISED_PERSON"
                  defaultLabel="Details of authorised person"
                />
              }
              disabled={isReviewPage}
            />
          </div>
        );
      default:
        return null;
    }
  };

  updateEstimate = () => {
    this.estimate().then(estimateResponse => {
      if (estimateResponse) {
        this.setState({
          estimation: estimateResponse ? estimateResponse.Calculation : [],
          totalAmountToBePaid:
            estimateResponse &&
            estimateResponse.Calculation &&
            estimateResponse.Calculation[0].totalAmount,
          valueSelected: "Full_Amount"
        });
      }
    });
  };

  onRadioButtonChange = e => {
    let { estimation } = this.state;
    let { totalAmount } = estimation[0] || {};
    if (e.target.value === "Full_Amount") {
      this.setState({
        totalAmountToBePaid: totalAmount,
        valueSelected: "Full_Amount",
        partialAmountError: ""
      });
    } else {
      this.setState({
        totalAmountToBePaid: 100,
        valueSelected: "Partial_Amount"
      });
    }
  };

  renderStepperContent = (selected, fromReviewPage) => {
    const { getOwnerDetails, updateEstimate } = this;
    const {
      draftRequest,
      estimation,
      totalAmountToBePaid,
      financialYearFromQuery,
      importantDates,
      valueSelected,
      partialAmountError,
      assessedPropertyDetails
    } = this.state;
    const { onRadioButtonChange, updateTotalAmount } = this;
    const { location } = this.props;
    const { search } = location;
    const isCompletePayment = getQueryValue(search, "isCompletePayment");
    switch (selected) {
      case 0:
        return (
          <div>
            <PropertyAddressHOC disabled={fromReviewPage} />
          </div>
        );
      case 1:
        return (
          <div>
            <UsageInformationHOC disabled={fromReviewPage} />
            {renderPlotAndFloorDetails(
              fromReviewPage,
              PlotDetails,
              FloorsDetails,
              this
            )}
          </div>
        );
      case 2:
        const ownerType = getSelectedCombination(
          this.props.form,
          "ownershipType",
          ["typeOfOwnership"]
        );
        return (
          <div>
            <OwnershipTypeHOC disabled={fromReviewPage} />
            {getOwnerDetails(ownerType)}
          </div>
        );
      case 3:
        return (
          <div className="review-pay-tab">
            <ReviewForm
              properties={this.props['prepareFormData']['Properties'][0]}
              onTabClick={this.onTabClick}
              updateIndex={this.updateIndex}
              stepZero={this.renderStepperContent(0, fromReviewPage)}
              stepOne={this.renderStepperContent(1, fromReviewPage)}
              stepTwo={this.renderStepperContent(2, fromReviewPage)}
              estimationDetails={estimation}
              updateEstimate={updateEstimate}
              importantDates={importantDates}
              totalAmount={totalAmountToBePaid}
              isCompletePayment={isCompletePayment}
              calculationScreenData={this.state.calculationScreenData}
            />
          </div>
        );

      case 4:

        return (
          <div>
            <AcknowledgementCard acknowledgeType='success' receiptHeader="PT_ASSESSMENT_NO" messageHeader={this.getMessageHeader()} message={this.getMessage()} receiptNo={assessedPropertyDetails['Properties'][0]['propertyDetails'][0]['assessmentNumber']} />
          </div>
        );
      case 5:

        return (
          <div>
            <PaymentDetails
              onRadioButtonChange={onRadioButtonChange}
              updateTotalAmount={updateTotalAmount}
              estimationDetails={estimation}
              financialYr={financialYearFromQuery}
              totalAmountToBePaid={totalAmountToBePaid}
              optionSelected={valueSelected}
              importantDates={importantDates}
              partialAmountError={partialAmountError}
              isPartialPaymentInValid={
                get(this.state, "estimation[0].totalAmount", 1) < 100 ||
                get(
                  this.props.form,
                  "basicInformation.fields.typeOfBuilding.value",
                  ""
                ).toLowerCase() === "vacant"
              }
            />

          </div>
        );
      case 6:
        return (
          <div>
            <AcknowledgementCard acknowledgeType='success' receiptHeader="PT_PMT_RCPT_NO" messageHeader='PT_PROPERTY_PAYMENT_SUCCESS' message='PT_PROPERTY_PAYMENT_NOTIFICATION' receiptNo='PT-107-017574' />
          </div>
        );
      default:
        return null;
    }
  };
  getButtonLabels(index) {
    let { search } = this.props.location;

    let isReassesment = Boolean(getQueryValue(search, "isReassesment").replace('false', ''));
    let isAssesment = Boolean(getQueryValue(search, "isAssesment").replace('false', ''));

    let buttonLabel = "PT_COMMONS_NEXT";
    if (index == 3) {
      isAssesment ? buttonLabel = 'PT_ASSESS_PROPERTY' : (isReassesment ? buttonLabel = "PT_UPDATE_ASSESSMENT" : buttonLabel = "PT_ADD_ASSESS_PROPERTY");
    } else if (index == 4) {
      buttonLabel = 'PT_PROCEED_PAYMENT'
    } else if (index == 5) {
      buttonLabel = 'PT_GENERATE_RECEIPT'
    } else if (index == 6) {
      buttonLabel = 'PT_DOWNLOAD_RECEIPT'
    }

    return buttonLabel;
  }
  getMessageHeader() {
    let { search } = this.props.location;

    let isReassesment = Boolean(getQueryValue(search, "isReassesment").replace('false', ''));
    let isAssesment = Boolean(getQueryValue(search, "isAssesment").replace('false', ''));

    let buttonLabel = "PT_PROPERTY_ASSESS_SUCCESS";

    isAssesment ? buttonLabel = 'PT_PROPERTY_ASSESS_SUCCESS' : (isReassesment ? buttonLabel = "PT_PROPERTY_REASSESS_SUCCESS" : buttonLabel = "PT_PROPERTY_ADD_SUCCESS");

    return buttonLabel;
  }
  getMessage() {
    const { location = {} } = this.props;
    let { search = '' } = location;

    let isReassesment = Boolean(getQueryValue(search, "isReassesment").replace('false', ''));
    let isAssesment = Boolean(getQueryValue(search, "isAssesment").replace('false', ''));

    let buttonLabel = "PT_PROPERTY_ASSESS_NOTIFICATION";

    isAssesment ? buttonLabel = 'PT_PROPERTY_ASSESS_NOTIFICATION' : (isReassesment ? buttonLabel = "PT_PROPERTY_REASSESS_NOTIFICATION" : buttonLabel = "PT_PROPERTY_ADD_NOTIFICATION");

    return buttonLabel;
  }
  getHeader(selected, search, PTUID) {
    const locale = getLocale() || "en_IN";
    const localizationLabelsData = initLocalizationLabels(locale);
    const addNewPropertyLabel = getTranslatedLabel('PT_NEW_PROPERTY_HEADER', localizationLabelsData);
    const propertyId = getQueryValue(search, "propertyId") || PTUID;
    const assessmentYear = getQueryValue(search, "FY");
    let isReassesment = Boolean(getQueryValue(search, "isReassesment").replace('false', ''));
    let isAssesment = Boolean(getQueryValue(search, "isAssesment").replace('false', ''));
    let headerObj = {};
    headerObj.header = 'PT_PROPERTY_INFORMATION';
    headerObj.headerValue = '';
    headerObj.subHeaderValue = propertyId;
    switch (selected) {
      case 0:
      case 1:
      case 2:
        headerObj.subHeaderValue = propertyId;
        headerObj.headerValue = '(' + assessmentYear + ')';
        (isAssesment ?
          (headerObj.header = 'PT_PROPERTY_ASSESSMENT_HEADER') :
          (isReassesment ?
            (headerObj.header = "PT_REASSESS_PROPERTY") :
            (headerObj.headerValue = headerObj.headerValue + ':' + addNewPropertyLabel,
              headerObj.subHeaderValue = '',
              headerObj.header = "PT_PROPERTY_ASSESSMENT_HEADER")));
        break;
      case 3:
        headerObj.subHeaderValue = propertyId;
        (isAssesment ?
          (headerObj.header = 'PT_PROPERTY_ASSESSMENT_HEADER') :
          (isReassesment ?
            (headerObj.header = "PT_REASSESS_PROPERTY") :
            (headerObj.subHeaderValue = '',
              headerObj.header = "PT_PROPERTY_ASSESSMENT_HEADER")));
        headerObj.headerValue = '(' + assessmentYear + ')';
        break;
      case 4:
        headerObj.subHeaderValue = propertyId;
        (isAssesment ?
          (headerObj.header = 'PT_PROPERTY_ASSESSMENT_HEADER') :
          (isReassesment ?
            (headerObj.header = "PT_REASSESS_PROPERTY") :
            (headerObj.header = "PT_PROPERTY_ASSESSMENT_HEADER")));
        headerObj.headerValue = '(' + assessmentYear + ')';
        break;
      case 5:
      case 6:
        headerObj.headerValue = '(' + assessmentYear + ')';
        headerObj.header = 'PT_PAYMENT_HEADER';
        headerObj.subHeaderValue = propertyId;
        break;
      default:
        headerObj.header = 'PT_PROPERTY_INFORMATION';
        headerObj.subHeaderValue = propertyId;
    }
    return headerObj;
  }




  onTabClick = index => {
    const { formValidIndexArray, selected } = this.state;
    const { location } = this.props;
    let { search } = location;
    const isCompletePayment = getQueryValue(search, "isCompletePayment");
    if (formValidIndexArray.indexOf(index) !== -1 && selected >= index) {
      !isCompletePayment
        ? this.setState({
          selected: index,
          formValidIndexArray: range(0, index)
        })
        : alert("Not authorized to edit this property details");
    }
  };

  updateIndex = index => {
    const { pay, estimate, createReceipt, createAndUpdate } = this;
    const {
      selected,
      formValidIndexArray,
      financialYearFromQuery,
      estimation
    } = this.state;
    const { setRoute, displayFormErrorsAction, form } = this.props;
    switch (selected) {
      //validating property address is validated
      case 0:
        if (
          window.appOverrides &&
          !window.appOverrides.validateForm("propertyAddress", form)
        ) {
          this.props.toggleSnackbarAndSetText(
            true,
            {
              labelName: "ULB validations failed!",
              labelKey: "ERR_ULD_VALIDATIONS_FAILED"
            },
            "error"
          );
          break;
        }
        const isProperyAddressFormValid = validateForm(form.propertyAddress);
        if (isProperyAddressFormValid) {
          //callDraft();
          this.setState({
            selected: index,
            formValidIndexArray: [...formValidIndexArray, selected]
          });
        } else {
          displayFormErrorsAction("propertyAddress");
        }
        break;
      //validating basic information,plotdetails and if plot details having floors
      case 1:
        if (
          window.appOverrides &&
          !window.appOverrides.validateForm("assessmentInformation", form)
        ) {
          this.props.toggleSnackbarAndSetText(
            true,
            {
              labelName: "ULB validations failed!",
              labelKey: "ERR_ULD_VALIDATIONS_FAILED"
            },
            "error"
          );
          break;
        }

        const { basicInformation, plotDetails } = form;
        if (basicInformation) {
          const isBasicInformationFormValid = validateForm(basicInformation);
          if (isBasicInformationFormValid) {
            if (plotDetails) {
              const isPlotDetailsFormValid = validateForm(plotDetails);
              if (isPlotDetailsFormValid) {
                const isTotalUnitSizeValid = plotDetails.fields.plotSize
                  ? validateUnitandPlotSize(plotDetails, form)
                  : true;
                if (isTotalUnitSizeValid) {
                  if (get(plotDetails, "fields.floorCount")) {
                    let floorValidation = true;
                    for (const variable in form) {
                      if (
                        variable.search("customSelect") !== -1 ||
                        variable.search("floorDetails") !== -1
                      ) {
                        const isDynamicFormValid = validateForm(form[variable]);
                        if (!isDynamicFormValid) {
                          displayFormErrorsAction(variable);
                          floorValidation = false;
                        }
                      }
                    }
                    if (floorValidation) {
                      //callDraft();
                      this.setState({
                        selected: index,
                        formValidIndexArray: [...formValidIndexArray, selected]
                      });
                    }
                  } else {
                    //callDraft();
                    this.setState({
                      selected: index,
                      formValidIndexArray: [...formValidIndexArray, selected]
                    });
                  }
                }
              } else {
                displayFormErrorsAction("plotDetails");
              }
            }
          } else {
            displayFormErrorsAction("basicInformation");
          }
        }
        getImportantDates(this);
        break;
      case 2:
        if (
          window.appOverrides &&
          !window.appOverrides.validateForm("ownerInfo", form)
        ) {
          this.props.toggleSnackbarAndSetText(
            true,
            {
              labelName: "ULB validations failed!",
              labelKey: "ERR_ULD_VALIDATIONS_FAILED"
            },
            "error"
          );
          break;
        }

        const { ownershipType } = form;
        const estimateCall = () => {
          estimate().then(estimateResponse => {
            if (estimateResponse) {
              this.setState({
                estimation: estimateResponse && estimateResponse.Calculation,
                totalAmountToBePaid:
                  estimateResponse &&
                  estimateResponse.Calculation &&
                  estimateResponse.Calculation[0].totalAmount,
                valueSelected: "Full_Amount"
              });
            }
          });
        };
        if (ownershipType) {
          const isOwnershipTypeFormValid = validateForm(ownershipType);
          if (isOwnershipTypeFormValid) {
            const ownershipTypeSelected = get(
              ownershipType,
              "fields.typeOfOwnership.value"
            );
            if (ownershipTypeSelected === "SINGLEOWNER") {
              const { ownerInfo } = form;
              const isOwnerInfoFormValid = validateForm(ownerInfo);
              if (isOwnerInfoFormValid) {
                //callDraft();
                this.setState(
                  {
                    selected: index,
                    formValidIndexArray: [...formValidIndexArray, selected]
                  },
                  estimateCall()
                );
              } else {
                displayFormErrorsAction("ownerInfo");
              }
            } else if (ownershipTypeSelected === "MULTIPLEOWNERS") {
              let ownerValidation = true;
              for (const variable in form) {
                if (variable.search("ownerInfo_") !== -1) {
                  const isDynamicFormValid = validateForm(form[variable]);
                  if (!isDynamicFormValid) {
                    displayFormErrorsAction(variable);
                    ownerValidation = false;
                  }
                }
              }
              if (ownerValidation) {
                //callDraft();
                this.setState(
                  {
                    selected: index,
                    formValidIndexArray: [...formValidIndexArray, selected]
                  },
                  estimateCall()
                );
              }
            } else if (
              ownershipTypeSelected.toUpperCase().indexOf("INSTITUTIONAL") !==
              -1
            ) {
              const { institutionDetails, institutionAuthority } = form;
              const isInstitutionDetailsFormValid = validateForm(
                institutionDetails
              );
              let institutionFormValid = true;
              if (!isInstitutionDetailsFormValid) {
                displayFormErrorsAction("institutionDetails");
                institutionFormValid = false;
              }
              const isInstitutionAuthorityFormValid = validateForm(
                institutionAuthority
              );
              if (!isInstitutionAuthorityFormValid) {
                displayFormErrorsAction("institutionAuthority");
                institutionFormValid = false;
              }
              if (institutionFormValid) {
                //callDraft();
                this.setState(
                  {
                    selected: index,
                    formValidIndexArray: [...formValidIndexArray, selected]
                  },
                  estimateCall()
                );
              }
            }
          } else {
            displayFormErrorsAction("ownershipType");
          }
        }

        break;
      case 3:
        if (estimation[0].totalAmount < 0) {
          alert('Property Tax amount cannot be Negative!');
        } else {
          createAndUpdate(index);
        }


        break;
      case 4:

        this.setState(
          {
            selected: index,
            formValidIndexArray: [...formValidIndexArray, selected]
          });
        break;
      case 5:

        pay();
        break;
      case 6:
        pay();

        break;
    }
  };

  callGetBill = async (
    propertyId,
    assessmentNumber,
    assessmentYear,
    tenantId,
    amountExpected
  ) => {
    const { location } = this.props;
    const {
      isFullPayment,
      totalAmountToBePaid,
      estimation,
      valueSelected
    } = this.state;
    const { search } = location;
    const isCompletePayment = getQueryValue(search, "isCompletePayment");
    const queryObj = [
      // { key: "propertyId", value: propertyId },
      // { key: "assessmentNumber", value: assessmentNumber },
      // { key: "assessmentYear", value: assessmentYear },
      { key: "consumerCodes", value: propertyId },
      { key: "tenantId", value: tenantId }
    ];
    // amountExpected &&
    //   queryObj.push({
    //     key: "amountExpected",
    //     value:
    //       valueSelected === "Full_Amount"
    //         ? estimation[0].totalAmount
    //         : totalAmountToBePaid
    //   });

    try {
      const billResponse = await httpRequest(
        "pt-calculator-v2/propertytax/_getbill",
        "_create",
        queryObj,
        {}
      );
      return billResponse;
    } catch (e) {
      console.log(e);
      this.props.history.push(
        `payment-failure/${propertyId}/${tenantId}/${assessmentNumber}/${assessmentYear}`
      );
    }
  };

  callPGService = async (
    propertyId,
    assessmentNumber,
    assessmentYear,
    tenantId
  ) => {
    const { updateIndex } = this;
    const { isFullPayment, totalAmountToBePaid, estimation } = this.state;
    const { search } = this.props.location;
    const isCompletePayment = getQueryValue(search, "isCompletePayment");
    this.setState({
      propertyDetails: {
        propertyId,
        assessmentNumber,
        assessmentYear,
        tenantId
      }
    });
    try {
      // if (!isCompletePayment) {
      const getBill = await this.callGetBill(
        propertyId,
        assessmentNumber,
        assessmentYear,
        tenantId,
        true
      );
      const { Bill } = getBill && getBill;
      this.createReceipt(Bill);
      // }
      // updateIndex(4);
    } catch (e) {
      console.log(e);
    }
  };

  changeDateToFormat = date => {
    return new Date(date).getTime();
  };

  createReceipt = async (Bill = []) => {
    const { prepareFormData, hideSpinner } = this.props;
    const { propertyDetails } = this.state;
    const {
      assessmentNumber,
      propertyId,
      tenantId,
      assessmentYear
    } = propertyDetails;
    set(prepareFormData, "Receipt[0].Bill[0].billDetails[0].amountPaid", 0); //todo Consumer code uniqueness //i guess here
    prepareFormData.Receipt[0].Bill[0] = {
      ...Bill[0],
      ...prepareFormData.Receipt[0].Bill[0]
    };
    // prepareFormData.Receipt[0].Bill[0].billDetails[0] = {
    //   ...Bill[0].billDetails[0],
    //   ...prepareFormData.Receipt[0].Bill[0].billDetails[0]
    // };

    for(let index=0;index<Bill[0].billDetails.length;index++){
      prepareFormData.Receipt[0].Bill[0].billDetails[index] = {
        ...Bill[0].billDetails[index],
        ...prepareFormData.Receipt[0].Bill[0].billDetails[index],
        collectionType:'COUNTER'
      };
    }
    if (!get(prepareFormData, "Receipt[0].instrument.instrumentType.name")) {
      set(prepareFormData, "Receipt[0].instrument.instrumentType.name", "Cash");
    }
    set(
      prepareFormData,
      "Receipt[0].Bill[0].billDetails[0].amountPaid",
      this.state.totalAmountToBePaid
    );
    //CS v1.1 changes
    set(
      prepareFormData,
      "Receipt[0].Bill[0].taxAndPayments[0].amountPaid",
      this.state.totalAmountToBePaid
    );
    // set(
    //   prepareFormData,
    //   "Receipt[0].Bill[0].billDetails[0].collectionType",
    //   "COUNTER" // HardCoding collectionType to COUNTER - Discussed with BE
    // );
    // set(
    //   prepareFormData,
    //   "Receipt[0].Bill[0].billDetails[1].collectionType",
    //   "COUNTER" // HardCoding collectionType to COUNTER - Discussed with BE
    // );
    //----------------
    set(
      prepareFormData,
      "Receipt[0].instrument.tenantId",
      get(prepareFormData, "Receipt[0].Bill[0].tenantId")
    );
    if (get(prepareFormData, "Receipt[0].instrument.transactionDateInput")) {
      set(
        prepareFormData,
        "Receipt[0].instrument.transactionDateInput",
        this.changeDateToFormat(
          get(prepareFormData, "Receipt[0].instrument.transactionDateInput")
        )
      );
      //Dont delete
      // set(
      //   prepareFormData,
      //   "Receipt[0].instrument.instrumentDate",
      //   this.changeDateToFormat(get(prepareFormData, "Receipt[0].instrument.transactionDateInput"))
      // );
    }
    //Dont delete
    // if (get(prepareFormData, "Receipt[0].instrument.transactionNumber")) {
    //   set(prepareFormData, "Receipt[0].instrument.instrumentNumber", get(prepareFormData, "Receipt[0].instrument.transactionNumber"));
    // }

    get(
      prepareFormData,
      "Receipt[0].Bill[0].billDetails[0].manualReceiptDate"
    ) &&
      set(
        prepareFormData,
        "Receipt[0].Bill[0].billDetails[0].manualReceiptDate",
        this.changeDateToFormat(
          get(
            prepareFormData,
            "Receipt[0].Bill[0].billDetails[0].manualReceiptDate"
          )
        )
      );
    set(
      prepareFormData,
      "Receipt[0].instrument.amount",
      this.state.totalAmountToBePaid
    );
    set(
      prepareFormData,
      "Receipt[0].tenantId",
      get(prepareFormData, "Receipt[0].Bill[0].tenantId")
    );
    const formData = {
      Receipt: prepareFormData["Receipt"]
    };

    if (
      get(prepareFormData, "Receipt[0].instrument.transactionNumber") &&
      get(prepareFormData, "Receipt[0].instrument.transactionNumberConfirm") &&
      get(prepareFormData, "Receipt[0].instrument.transactionNumber") !==
      get(prepareFormData, "Receipt[0].instrument.transactionNumberConfirm")
    ) {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Transaction numbers don't match !",
          labelKey: "ERR_TRASACTION_NUMBERS_DONT_MATCH"
        },
        "error"
      );
      return;
    }

    if (this.state.totalAmountToBePaid === "") {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Amount to pay can't be empty",
          labelKey: "ERR_AMOUNT_CANT_BE_EMPTY"
        },
        true
      );
      return;
    }

    if (!get(prepareFormData, "Receipt[0].Bill[0].paidBy")) {
      set(
        prepareFormData,
        "Receipt[0].Bill[0].paidBy",
        get(prepareFormData, "Receipt[0].Bill[0].payerName")
      );
    }

    try {
      const getReceipt = await httpRequest(
        "collection-services/receipts/_create",//todo Consumer code uniqueness
        "_create",
        [],
        formData,
        []
      );
      if (getReceipt && getReceipt.Receipt && getReceipt.Receipt.length) {
        set(prepareFormData, "Receipt[0].Bill", []);
        set(prepareFormData, "Receipt[0].instrument", {}); // Clear prepareFormData
        hideSpinner();
        this.setState({ nextButtonEnabled: true });
        this.props.history.push(
          `payment-success/${propertyId}/${tenantId}/${assessmentNumber}/${assessmentYear}`
        );
      } else {
      }
    } catch (e) {
      console.log(e);
      set(prepareFormData, "Receipt[0].Bill", []);
      set(prepareFormData, "Receipt[0].instrument", {});
      hideSpinner();
      this.props.history.push(
        `payment-failure/${propertyId}/${tenantId}/${assessmentNumber}/${assessmentYear}`
      );
    } finally {
    }
  };

  estimate = async () => {
    let { form, common, showSpinner, hideSpinner } = this.props;
    let prepareFormData = { ...this.props.prepareFormData };

    showSpinner();
    if (
      get(
        prepareFormData,
        "Properties[0].propertyDetails[0].institution",
        undefined
      )
    )
      delete prepareFormData.Properties[0].propertyDetails[0].institution;
    const financialYearFromQuery = getFinancialYearFromQuery();
    const selectedownerShipCategoryType = get(
      form,
      "ownershipType.fields.typeOfOwnership.value",
      ""
    );
    try {
      if (financialYearFromQuery) {
        set(
          prepareFormData,
          "Properties[0].propertyDetails[0].financialYear",
          financialYearFromQuery
        );
      }
      if (selectedownerShipCategoryType === "SINGLEOWNER") {
        set(
          prepareFormData,
          "Properties[0].propertyDetails[0].owners",
          getSingleOwnerInfo(this)
        );
        set(
          prepareFormData,
          "Properties[0].propertyDetails[0].ownershipCategory",
          get(
            common,
            `generalMDMSDataById.SubOwnerShipCategory[${selectedownerShipCategoryType}].ownerShipCategory`,
            "INDIVIDUAL"
          )
        );
        set(
          prepareFormData,
          "Properties[0].propertyDetails[0].subOwnershipCategory",
          selectedownerShipCategoryType
        );
      }
      if (selectedownerShipCategoryType === "MULTIPLEOWNERS") {
        set(
          prepareFormData,
          "Properties[0].propertyDetails[0].owners",
          getMultipleOwnerInfo(this)
        );
        set(
          prepareFormData,
          "Properties[0].propertyDetails[0].ownershipCategory",
          get(
            common,
            `generalMDMSDataById.SubOwnerShipCategory[${selectedownerShipCategoryType}].ownerShipCategory`,
            "INDIVIDUAL"
          )
        );
        set(
          prepareFormData,
          "Properties[0].propertyDetails[0].subOwnershipCategory",
          selectedownerShipCategoryType
        );
      }
      if (
        selectedownerShipCategoryType.toLowerCase().indexOf("institutional") !==
        -1
      ) {
        const { instiObj, ownerArray } = getInstituteInfo(this);
        set(
          prepareFormData,
          "Properties[0].propertyDetails[0].owners",
          ownerArray
        );
        set(
          prepareFormData,
          "Properties[0].propertyDetails[0].institution",
          instiObj
        );
        set(
          prepareFormData,
          "Properties[0].propertyDetails[0].ownershipCategory",
          get(form, "ownershipType.fields.typeOfOwnership.value", "")
        );
        set(
          prepareFormData,
          "Properties[0].propertyDetails[0].subOwnershipCategory",
          get(form, "institutionDetails.fields.type.value", "")
        );
      }
      const propertyDetails = normalizePropertyDetails(
        prepareFormData.Properties,
        this
      );

      let estimateResponse = await httpRequest(
        "pt-calculator-v2/propertytax/_estimate",
        "_estimate",
        [],
        {
          CalculationCriteria: [
            {
              assessmentYear: financialYearFromQuery,
              tenantId:
                prepareFormData.Properties[0] &&
                prepareFormData.Properties[0].tenantId,
              property: propertyDetails[0]
            }
          ]
        }
      );
      const tenantId =
        prepareFormData.Properties[0] && prepareFormData.Properties[0].tenantId;
      const calculationScreenData = await getCalculationScreenData(
        get(estimateResponse, "Calculation[0].billingSlabIds", []),
        tenantId,
        this
      );
      this.setState({ calculationScreenData: calculationScreenData.data });
      return estimateResponse;
    } catch (e) {
      if (e.message) {
        alert(e.message);
      } else
        this.props.toggleSnackbarAndSetText(
          true,
          {
            labelName: "Error calculating tax!",
            labelKey: "ERR_ERROR_CALCULATING_TAX"
          },
          "error"
        );
    } finally {
      hideSpinner();
    }
  };
  createAndUpdate = async (index) => {
    const {
      selected,
      formValidIndexArray
    } = this.state;
    const financialYearFromQuery = getFinancialYearFromQuery();
    let { form, common, location, hideSpinner } = this.props;
    const { search } = location;
    const propertyId = getQueryValue(search, "propertyId");
    const assessmentId = getQueryValue(search, "assessmentId");
    const propertyMethodAction = !!propertyId ? "_update" : "_create";
    let prepareFormData = { ...this.props.prepareFormData };

    if (
      get(
        prepareFormData,
        "Properties[0].propertyDetails[0].institution",
        undefined
      )
    )
      delete prepareFormData.Properties[0].propertyDetails[0].institution;
    const selectedownerShipCategoryType = get(
      form,
      "ownershipType.fields.typeOfOwnership.value",
      ""
    );
    if (financialYearFromQuery) {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].financialYear",
        financialYearFromQuery
      );
    }

    if (!!propertyId) {
      set(prepareFormData, "Properties[0].propertyId", propertyId);
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].assessmentNumber",
        assessmentId
      );
    }
    if (selectedownerShipCategoryType === "SINGLEOWNER") {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners",
        getSingleOwnerInfo(this)
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].ownershipCategory",
        get(
          common,
          `generalMDMSDataById.SubOwnerShipCategory[${selectedownerShipCategoryType}].ownerShipCategory`,
          "INDIVIDUAL"
        )
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].subOwnershipCategory",
        selectedownerShipCategoryType
      );
    }

    if (selectedownerShipCategoryType === "MULTIPLEOWNERS") {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners",
        getMultipleOwnerInfo(this)
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].ownershipCategory",
        get(
          common,
          `generalMDMSDataById.SubOwnerShipCategory[${selectedownerShipCategoryType}].ownerShipCategory`,
          "INDIVIDUAL"
        )
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].subOwnershipCategory",
        selectedownerShipCategoryType
      );
    }

    set(
      prepareFormData,
      "Properties[0].propertyDetails[0].citizenInfo.mobileNumber",
      get(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners[0].mobileNumber"
      )
    );

    if (
      selectedownerShipCategoryType.toLowerCase().indexOf("institutional") !==
      -1
    ) {
      const { instiObj, ownerArray } = getInstituteInfo(this);
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners",
        ownerArray
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].institution",
        instiObj
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].ownershipCategory",
        get(form, "ownershipType.fields.typeOfOwnership.value", "")
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].subOwnershipCategory",
        get(form, "institutionDetails.fields.type.value", "")
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].citizenInfo.mobileNumber",
        get(
          form,
          "institutionAuthority.fields.mobile.value",
          get(form, "institutionAuthority.fields.telephone.value", null)
        )
      );
    }
    try {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].citizenInfo.name",
        get(prepareFormData, "Properties[0].propertyDetails[0].owners[0].name")
      );
      const properties = normalizePropertyDetails(
        prepareFormData.Properties,
        this
      );
      let createPropertyResponse = await httpRequest(
        `pt-services-v2/property/${propertyMethodAction}`,
        `${propertyMethodAction}`,
        [],
        {
          Properties: properties
        }
      );
      this.setState(
        {
          assessedPropertyDetails: createPropertyResponse,
          selected: index,
          formValidIndexArray: [...formValidIndexArray, selected]
        });

    } catch (e) {
      hideSpinner();
      this.setState({ nextButtonEnabled: true });
      alert(e);
    }
  };

  pay = async () => {
    const { callPGService, callDraft } = this;
    const financialYearFromQuery = getFinancialYearFromQuery();
    let { form, common, location, hideSpinner } = this.props;
    const { search } = location;
    const propertyId = getQueryValue(search, "propertyId");
    const assessmentId = getQueryValue(search, "assessmentId");
    const tenantId = getQueryValue(search, "tenantId");
    const isCompletePayment = getQueryValue(search, "isCompletePayment");

    const propertyMethodAction = !!propertyId ? "_update" : "_create";
    let prepareFormData = { ...this.props.prepareFormData };

    if (
      get(
        prepareFormData,
        "Properties[0].propertyDetails[0].institution",
        undefined
      )
    )
      delete prepareFormData.Properties[0].propertyDetails[0].institution;
    const selectedownerShipCategoryType = get(
      form,
      "ownershipType.fields.typeOfOwnership.value",
      ""
    );
    if (financialYearFromQuery) {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].financialYear",
        financialYearFromQuery
      );
    }

    if (!!propertyId) {
      set(prepareFormData, "Properties[0].propertyId", propertyId);
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].assessmentNumber",
        assessmentId
      );
    }
    if (selectedownerShipCategoryType === "SINGLEOWNER") {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners",
        getSingleOwnerInfo(this)
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].ownershipCategory",
        get(
          common,
          `generalMDMSDataById.SubOwnerShipCategory[${selectedownerShipCategoryType}].ownerShipCategory`,
          "INDIVIDUAL"
        )
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].subOwnershipCategory",
        selectedownerShipCategoryType
      );
    }

    if (selectedownerShipCategoryType === "MULTIPLEOWNERS") {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners",
        getMultipleOwnerInfo(this)
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].ownershipCategory",
        get(
          common,
          `generalMDMSDataById.SubOwnerShipCategory[${selectedownerShipCategoryType}].ownerShipCategory`,
          "INDIVIDUAL"
        )
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].subOwnershipCategory",
        selectedownerShipCategoryType
      );
    }

    set(
      prepareFormData,
      "Properties[0].propertyDetails[0].citizenInfo.mobileNumber",
      get(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners[0].mobileNumber"
      )
    );

    if (
      selectedownerShipCategoryType.toLowerCase().indexOf("institutional") !==
      -1
    ) {
      const { instiObj, ownerArray } = getInstituteInfo(this);
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners",
        ownerArray
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].institution",
        instiObj
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].ownershipCategory",
        get(form, "ownershipType.fields.typeOfOwnership.value", "")
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].subOwnershipCategory",
        get(form, "institutionDetails.fields.type.value", "")
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].citizenInfo.mobileNumber",
        get(
          form,
          "institutionAuthority.fields.mobile.value",
          get(form, "institutionAuthority.fields.telephone.value", null)
        )
      );
    }

    try {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].citizenInfo.name",
        get(prepareFormData, "Properties[0].propertyDetails[0].owners[0].name")
      );

      if (isCompletePayment) {
        callPGService(
          propertyId,
          assessmentId,
          financialYearFromQuery,
          tenantId
        );
      } else {
        const properties = normalizePropertyDetails(
          prepareFormData.Properties,
          this
        );
        let createPropertyResponse = await httpRequest(
          `pt-services-v2/property/${propertyMethodAction}`,
          `${propertyMethodAction}`,
          [],
          {
            Properties: properties
          }
        );
        //callDraft([], get(createPropertyResponse, "Properties[0].propertyDetails[0].assessmentNumber"));
        callPGService(
          get(createPropertyResponse, "Properties[0].propertyId"),
          get(
            createPropertyResponse,
            "Properties[0].propertyDetails[0].assessmentNumber"
          ),
          get(
            createPropertyResponse,
            "Properties[0].propertyDetails[0].financialYear"
          ),
          get(createPropertyResponse, "Properties[0].tenantId")
        );
      }
    } catch (e) {
      hideSpinner();
      this.setState({ nextButtonEnabled: true });
      alert(e);
    }
  };

  closeDeclarationDialogue = () => {
    this.setState({ dialogueOpen: false });
  };

  onPayButtonClick = async () => {
    const {
      isFullPayment,
      partialAmountError,
      totalAmountToBePaid
    } = this.state;
    const { showSpinner, hideSpinner } = this.props;

    if (!isFullPayment && partialAmountError) return;
    try {
      if (totalAmountToBePaid % 1 === 0) {
        //Fractions Check
        this.setState({ dialogueOpen: true });
        const { form, prepareFormData } = this.props;
        const formKeysToValidate = [
          "cardInfo",
          "cashInfo",
          "chequeInfo",
          "demandInfo"
        ];
        let modeOfPaymentExists = false;
        for (let i = 0; i < formKeysToValidate.length; i++) {
          if (Object.keys(form).indexOf(formKeysToValidate[i]) > -1) {
            modeOfPaymentExists = true;
            break;
          }
        }
        if (modeOfPaymentExists) {
          const validateArray = Object.keys(form).reduce((result, item) => {
            if (formKeysToValidate.indexOf(item) > -1) {
              result.push({
                formKey: item,
                formValid: validateForm(form[item])
              });
            }
            return result;
          }, []);

          const areFormsValid = validateArray.reduce((result, current) => {
            if (!current.formValid) {
              result = false;
            } else {
              result = true;
            }
            return result;
          }, false);

          if (areFormsValid) {
            this.setState({ nextButtonEnabled: false });
            showSpinner();
            this.pay();
          } else {
            validateArray.forEach(item => {
              if (!item.formValid) {
                this.props.displayFormErrorsAction(item.formKey);
              }
            });
          }
        } else {
          this.setState({ nextButtonEnabled: false });
          showSpinner();
          this.pay();
        }
      } else {
        alert("Amount cannot be a fraction!");
      }
    } catch (e) {
      hideSpinner();
    }
  };
  componentDidUpdate() {
    const {
      selected,
      formValidIndexArray,
    } = this.state;
    const { location } = this.props;
    const { search } = location;
    let proceedToPayment = Boolean(getQueryValue(search, "proceedToPayment").replace('false', ''));
    if (proceedToPayment && selected == 3) {
      this.setState({
        selected: 5,
        formValidIndexArray: [...formValidIndexArray, 5]
      });
    }
  }
  convertImgToDataURLviaCanvas = (url, callback, outputFormat) => {
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      var canvas = document.createElement("CANVAS");
      var ctx = canvas.getContext("2d");
      var dataURL;
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  };
  downloadAcknowledgementForm = () => {
    const { assessedPropertyDetails, imageUrl } = this.state;
    const { common, app = {} } = this.props;
    const { Properties } = assessedPropertyDetails;
    const { address, propertyDetails, propertyId } = Properties[0];
    const { owners } = propertyDetails[0];
    const { localizationLabels } = app;
    const { cities } = common;
    const header = getHeaderDetails(Properties[0], cities, localizationLabels, true)
    let receiptDetails = {};
    receiptDetails = {
      address,
      propertyDetails,
      address,
      owners,
      header,
      propertyId
    }
    generateAcknowledgementForm("pt-reciept-citizen", receiptDetails, {}, imageUrl);
  }

  render() {
    const {
      renderStepperContent,
      onPayButtonClick,
      closeDeclarationDialogue
    } = this;
    const {
      selected,
      ownerInfoArr,
      formValidIndexArray,
      dialogueOpen,
      nextButtonEnabled, assessedPropertyDetails = {}
    } = this.state;
    const fromReviewPage = selected === 3;
    const { history, location } = this.props;
    const { search } = location;



    const { Properties = [] } = assessedPropertyDetails;
    let propertyId = '';
    for (let pty of Properties) {
      propertyId = pty.propertyId;
    }
    const { header, subHeaderValue, headerValue } = this.getHeader(selected, search, propertyId);

    return (
      <div className="wizard-form-main-cont">
        <PTHeader header={header} subHeaderTitle='PT_PROPERTY_PTUID' headerValue={headerValue} subHeaderValue={subHeaderValue} />
        <WizardComponent
          downloadAcknowledgementForm={this.downloadAcknowledgementForm}
          content={renderStepperContent(selected, fromReviewPage)}
          onTabClick={this.onTabClick}
          selected={selected}
          header={getHeaderLabel(selected, "employee")}
          footer={null}
          formValidIndexArray={formValidIndexArray}
          updateIndex={this.updateIndex}
          backLabel="PT_COMMONS_GO_BACK"
          nextLabel={this.getButtonLabels(selected)}
          ownerInfoArr={ownerInfoArr}
          closeDialogue={closeDeclarationDialogue}
          dialogueOpen={dialogueOpen}
          history={history}
          onPayButtonClick={onPayButtonClick}
          nextButtonEnabled={nextButtonEnabled}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { form, common, app } = state || {};
  const { propertyAddress } = form;
  const { city } =
    (propertyAddress && propertyAddress.fields && propertyAddress.fields) || {};
  const currentTenantId = (city && city.value) || commonConfig.tenantId;
  return {
    form,
    currentTenantId,
    prepareFormData: common.prepareFormData,
    common,
    app
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteForm: formKey => dispatch(deleteForm(formKey)),
    setRoute: route => dispatch(setRoute(route)),
    displayFormErrorsAction: formKey => dispatch(displayFormErrors(formKey)),
    updatePTForms: forms => dispatch(updateForms(forms)),
    showSpinner: () => dispatch(showSpinner()),
    hideSpinner: () => dispatch(hideSpinner()),
    fetchGeneralMDMSData: (
      requestBody,
      moduleName,
      masterName,
      key,
      tenantId
    ) =>
      dispatch(
        fetchGeneralMDMSData(requestBody, moduleName, masterName, key, tenantId)
      ),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    generalMDMSFetchSuccess: (payload, moduleName, masterArray) =>
      dispatch(generalMDMSFetchSuccess(payload, moduleName, masterArray)),
    fetchMDMDDocumentTypeSuccess: data =>
      dispatch(fetchMDMDDocumentTypeSuccess(data)),
    updatePrepareFormDataFromDraft: prepareFormData =>
      dispatch(updatePrepareFormDataFromDraft(prepareFormData)),
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormWizard);
