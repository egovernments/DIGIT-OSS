import React, { Component } from "react";
import { Card } from "components";
import PTHeader from "egov-ui-kit/common/common/PTHeader";
import WizardComponent from "./components/WizardComponent";
import {
  deleteForm,
  updateForms,
  displayFormErrors,
  handleFieldChange
} from "egov-ui-kit/redux/form/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import Property from "egov-ui-kit/common/propertyTax/Property";
import { hideSpinner, showSpinner } from "egov-ui-kit/redux/common/actions";
import { resetFormWizard } from "egov-ui-kit/utils/PTCommon";
import { removeForm } from "egov-ui-kit/redux/form/actions";
import { prepareFormData as prepareFormDataAction } from "egov-ui-kit/redux/common/actions";
import store from "ui-redux/store";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import {
  UsageInformationHOC,
  PropertyAddressHOC,
  OwnershipTypeHOC,
  OwnerInfoHOC,
  InstitutionHOC,
  OwnerInformation,
  InstitutionAuthorityHOC
} from "./components/Forms";
import ReviewForm from "../ReviewForm";
import PaymentForm from "../ReviewForm/components/PaymentForm";
import FloorsDetails from "./components/Forms/FloorsDetails";
import PlotDetails from "./components/Forms/PlotDetails";
import MultipleOwnerInfoHOC from "./components/Forms/MultipleOwnerInfo";
import { connect } from "react-redux";
import {
  setRoute,
  toggleSnackbarAndSetText
} from "egov-ui-kit/redux/app/actions";
import { validateForm } from "egov-ui-kit/redux/form/utils";
import { httpRequest } from "egov-ui-kit/utils/api";
import {
  getQueryValue,
  getFinancialYearFromQuery,
  getEstimateFromBill
} from "egov-ui-kit/utils/PTCommon";
import { get, set, range, isEqual } from "lodash";
import { fetchFromLocalStorage } from "egov-ui-kit/utils/commons";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";
import {
  fetchGeneralMDMSData,
  updatePrepareFormDataFromDraft
} from "egov-ui-kit/redux/common/actions";
import { getDocumentTypes } from "./utils/mdmsCalls";
import { fetchMDMDDocumentTypeSuccess } from "redux/store/actions";
import { convertRawDataToFormConfig } from "egov-ui-kit/utils/PTCommon/propertyToFormTransformer";
import {
  addOwner,
  callDraft,
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
  renderPlotAndFloorDetails
} from "egov-ui-kit/utils/PTCommon/FormWizardUtils";
import sortBy from "lodash/sortBy";
import {
  getUserInfo,
  localStorageSet
} from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";
import "./index.css";
import AcknowledgementCard from "egov-ui-kit/common/propertyTax/AcknowledgementCard";
import generateAcknowledgementForm from "egov-ui-kit/common/propertyTax/PaymentStatus/Components/acknowledgementFormPDF";
import { getHeaderDetails } from "egov-ui-kit/common/propertyTax/PaymentStatus/Components/createReceipt";
import { createPropertyPayload, createAssessmentPayload, getCreatePropertyResponse } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/propertyCreateUtils";
import DocumentsUpload from "egov-ui-kit/common/propertyTax/Property/components/DocumentsUpload";



class FormWizard extends Component {
  state = {
    financialYearFromQuery: "",
    dialogueOpen: false,
    selected: 0,
    ownerInfoArr: [],
    showOwners: false,
    formValidIndexArray: [],
    ownersCount: 0,
    estimation: [],
    draftRequest: {
      draft: {
        userId: get(JSON.parse(getUserInfo()), "uuid"),
        draftRecord: {}
      }
    },
    totalAmountToBePaid: 100,
    draftByIDResponse: {},
    isFullPayment: true,
    partialAmountError: "",
    propertyUUId: "",
    termsAccepted: false,
    termsError: "",
    calculationScreenData: [],
    assessedPropertyDetails: {}
  }

  toggleTerms = () =>
    this.setState({
      termsAccepted: !this.state.termsAccepted,
      termsError: ""
    });

  fetchDraftDetails = async (draftId, isReassesment) => {
    const { draftRequest } = this.state;
    const {
      updatePrepareFormDataFromDraft,
      fetchMDMDDocumentTypeSuccess,
      location
    } = this.props;
    const { search } = location;
    const financialYearFromQuery = getFinancialYearFromQuery();
    const propertyId = getQueryValue(search, "propertyId");
    const assessmentId = getQueryValue(search, "assessmentId");
    const tenantId = getQueryValue(search, "tenantId");
    const isCompletePayment = getQueryValue(search, "isCompletePayment");

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
        const prepareFormDataFromApi = get(
          currentDraft,
          "draftRecord.prepareFormData",
          {}
        );
        const preparedForm = convertRawDataToFormConfig(prepareFormDataFromApi); //convertRawDataToFormConfig(responseee)
        currentDraft = {
          draftRecord: {
            ...currentDraft.draftRecord,
            ...preparedForm,
            prepareFormData: prepareFormDataFromApi
          }
        };
      } else {
        let searchPropertyResponse = await httpRequest(
          "property-services/property/_search",
          "_search",
          [
            {
              key: "tenantId",
              value: tenantId
            },
            {
              key: "propertyIds",
              value: getQueryValue(search, "propertyId") //"PT-107-001278",
            }
          ]
        );
        searchPropertyResponse = getCreatePropertyResponse(searchPropertyResponse);
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
            prepareFormData: { Properties: propertyResponse["Properties"] } //prepareFormData2,
          }
        };
        this.setState({
          propertyUUID: get(
            searchPropertyResponse,
            "Properties[0].propertyDetails[0].citizenInfo.uuid"
          )
        });
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
      if (isReassesment && activeModule) {
        this.props.handleFieldChange("propertyAddress", "city", activeModule);
      }
      updatePrepareFormDataFromDraft(
        get(currentDraft, "draftRecord.prepareFormData", {})
      );
      this.props.updatePTForms(currentDraft.draftRecord);

      //Get estimate from bill in case of complete payment
      if (isCompletePayment) {
        const billResponse =
          activeTab === 4 &&
          (await this.callGetBill(
            propertyId,
            assessmentId,
            financialYearFromQuery,
            tenantId
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
          billResponse
        });
      }
      this.setState(
        {
          ownerInfoArr: ownerDetails,
          ownersCount: totalowners,
          financialYearFromQuery: get(
            currentDraft,
            "draftRecord.financialYear.fields.button.value"
          ),
          formValidIndexArray: range(0, activeTab),
          selected: activeTab,
          draftRequest: {
            draft: {
              id: !isReassesment ? draftId : null,
              ...currentDraft
              // assessmentNumber: currentDraft.assessmentNumber,
              // draftRecord: currentDraft.draftRecord,
            }
          }
        },
        () => {
          {
            if (activeTab >= 4 && !isCompletePayment) {
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
          }
        }
      );
    } catch (e) {
      console.log("e", e);
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
    const { selected } = this.state;
    let {
      renderCustomTitleForPt,
      fetchGeneralMDMSData,
      fetchMDMDDocumentTypeSuccess,
      toggleSpinner,
      history
    } = this.props;
    toggleSpinner();
    try {
      let { resetForm } = this;
      let { search } = this.props.location;
      const assessmentId =
        getQueryValue(search, "assessmentId") ||
        fetchFromLocalStorage("draftId");
      const isReassesment = !!getQueryValue(search, "isReassesment");
      const isReasses = Boolean(getQueryValue(search, "isReassesment").replace('false', ''));
      let isAssesment = Boolean(getQueryValue(search, "isAssesment").replace('false', ''));
      const tenantId = getQueryValue(search, "tenantId");
      const propertyId = getQueryValue(search, "propertyId");
      const draftUuid = getQueryValue(search, "uuid");
      const documentTypeMdms = await getDocumentTypes();
      if (!!documentTypeMdms) fetchMDMDDocumentTypeSuccess(documentTypeMdms);
      this.unlisten = history.listen((location, action) => {
        resetForm();
      });
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
      }

      const { ownerInfoArr } = this.state;
      if (ownerInfoArr.length < 2) {
        addOwner(true, OwnerInformation, this);
      }


      const financialYearFromQuery = getFinancialYearFromQuery();
      this.setState({
        financialYearFromQuery
      });

      const titleObject = isAssesment ? [
        "PT_PROPERTY_ASSESSMENT_HEADER",
        `(${financialYearFromQuery})`,
        ":",
        "PT_PROPERTY_ADDRESS_PROPERTY_ID",
        `${propertyId}`,

      ] : (isReasses
        ? [
          "PT_REASSESS_PROPERTY",
        ]
        : [
          // "PT_PROPERTY_ASSESSMENT_HEADER",
          // `(${financialYearFromQuery})`,
          // ":",
          "PT_ADD_NEW_PROPERTY"
        ]);
      renderCustomTitleForPt({
        titleObject
      });
      toggleSpinner();
    } catch (e) {
      console.log("e");
      toggleSpinner();
    }
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
                  label="New"
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

  updateTotalAmount = (value, isFullPayment, errorText) => {
    this.setState({
      totalAmountToBePaid: value,
      isFullPayment,
      partialAmountError: errorText
    });
  };

  renderStepperContent = (selected, fromReviewPage) => {
    const { getOwnerDetails, updateTotalAmount, toggleTerms } = this;
    const {
      estimation,
      totalAmountToBePaid,
      financialYearFromQuery,
      termsAccepted,
      termsError, propertyUUID,
      assessedPropertyDetails
    } = this.state;
    const { form, currentTenantId, search } = this.props;
    console.log(this.props, 'this.props');
    let { search: searchQuery } = this.props.location;
    let isAssesment = Boolean(getQueryValue(searchQuery, "isAssesment").replace('false', ''));
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
        return (<Card textChildren={<DocumentsUpload></DocumentsUpload>} />);
      case 4:
        return (<div className="review-pay-tab">
          <ReviewForm
            onTabClick={this.onTabClick}
            properties={this.props['prepareFormData']['Properties'][0]}
            stepZero={this.renderStepperContent(0, fromReviewPage)}
            stepOne={this.renderStepperContent(1, fromReviewPage)}
            stepTwo={this.renderStepperContent(2, fromReviewPage)}
            estimationDetails={estimation}
            financialYr={financialYearFromQuery}
            totalAmountToBePaid={totalAmountToBePaid}
            updateTotalAmount={updateTotalAmount}
            isAssesment={isAssesment}
            currentTenantId={currentTenantId}
            isCompletePayment={isCompletePayment}
            location={this.props.location}
            isPartialPaymentInValid={
              get(this.state, "estimation[0].totalAmount", 1) < 100 ||
              get(
                form,
                "basicInformation.fields.typeOfBuilding.value",
                ""
              ).toLowerCase() === "vacant"
            }
            toggleTerms={toggleTerms}
            termsAccepted={termsAccepted}
            termsError={termsError}
            calculationScreenData={this.state.calculationScreenData}
          />
        </div>)
      case 5:

        return (
          <div>
            <AcknowledgementCard acknowledgeType='success' receiptHeader="PT_ASSESSMENT_NO" messageHeader={this.getMessageHeader()} message={this.getMessage()} receiptNo={assessedPropertyDetails['Properties'][0]['propertyDetails'][0]['assessmentNumber']} />
          </div>
        );
      case 6:

        return (
          <div>
            {/* <h2>
              Redirected to Payment site for Payment
           </h2> */}

            <PaymentForm
              properties={this.props['prepareFormData']['Properties'][0]}
              estimationDetails={estimation}
              financialYr={financialYearFromQuery}
              totalAmountToBePaid={totalAmountToBePaid}
              updateTotalAmount={updateTotalAmount}
              currentTenantId={currentTenantId}
              isCompletePayment={isCompletePayment}
              isPartialPaymentInValid={
                get(this.state, "estimation[0].totalAmount", 1) < 100 ||
                get(
                  form,
                  "basicInformation.fields.typeOfBuilding.value",
                  ""
                ).toLowerCase() === "vacant"
              }
              calculationScreenData={this.state.calculationScreenData}
            />
          </div>
        );
      case 7:
        return (
          <div>
            <AcknowledgementCard acknowledgeType='success' receiptHeader="PT_PMT_RCPT_NO" messageHeader='PT_PROPERTY_PAYMENT_SUCCESS' message='PT_PROPERTY_PAYMENT_NOTIFICATION' receiptNo='PT-107-017574' />
          </div>
        );
      default:
        return null;
    }
  };
  createAndUpdate = async (index, action) => {
    // const { callPGService, callDraft } = this;
    const {
      selected,
      formValidIndexArray
    } = this.state;
    const financialYearFromQuery = getFinancialYearFromQuery();
    let { form, common, location, hideSpinner } = this.props;
    const { search } = location;
    const propertyId = getQueryValue(search, "propertyId");
    const assessmentId = getQueryValue(search, "assessmentId");
    // const tenantId = getQueryValue(search, "tenantId");
    // const isCompletePayment = getQueryValue(search, "isCompletePayment");

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

    set(
      prepareFormData,
      "Properties[0].propertyDetails[0].citizenInfo.name",
      get(prepareFormData, "Properties[0].propertyDetails[0].owners[0].name")
    );

    const properties = normalizePropertyDetails(
      prepareFormData.Properties,
      this
    );
    // Create/Update property call, action will be either create or update
    this.createProperty(properties, action);
  };

  assessProperty = async (action) => {
    const {hideSpinner}=this.props;
    let propertyMethodAction = action === "re-assess" ? "_update" : '_create';
    const propertyId = getQueryArg(
      window.location.href,
      "propertyId"
    );
    const financialYear = getQueryArg(window.location.href, "FY");
    const tenant = getQueryArg(window.location.href, "tenantId");
    let assessment = {
      "tenantId": tenant,
      "propertyId": propertyId,
      "financialYear": financialYear,
      "assessmentDate": new Date().getTime(),
      "source": "MUNICIPAL_RECORDS",
      "channel": "CFC_COUNTER",
      "status": "ACTIVE"

    }
    try {


      let assessPropertyResponse = await httpRequest(
        `property-services/assessment/${propertyMethodAction}`,
        `${propertyMethodAction}`,
        [],
        {
          Assessment: assessment
        }
      );
      store.dispatch(
        setRoute(
          `/property-tax/pt-acknowledgment?purpose=assessment&status=success&propertyId=${assessment.propertyId}&FY=${assessment.financialYear}&tenantId=${assessment.tenantId}`

        )
      );

    } catch (e) {
      hideSpinner();
      store.dispatch(
        setRoute(
          `/property-tax/pt-acknowledgment?purpose=assessment&status=success&propertyId=${assessment.propertyId}&FY=${assessment.financialYear}&tenantId=${assessment.tenantId}`

        )
      );
      // this.setState({ nextButtonEnabled: true });
      // alert(e);
    }
  }

  createProperty = async (Properties, action) => {
    const { documentsUploadRedux ,hidespinner} = this.props;
    const propertyPayload = createPropertyPayload(Properties, documentsUploadRedux);
    const propertyMethodAction = (action === "assess" || action === "re-assess") ? "_update" : "_create";
    try {
      const propertyResponse = await httpRequest(
        `property-services/property/${propertyMethodAction}`,
        `${propertyMethodAction}`,
        [],
        {
          Property: propertyPayload
        },
        [],
        {},
        true
      );
      if (propertyResponse && propertyResponse.Properties && propertyResponse.Properties.length) {
        if (propertyResponse.Properties[0].propertyId) {
          const propertyId = propertyResponse.Properties[0].propertyId;
          const tenantId = propertyResponse.Properties[0].tenantId;
          // Navigate to success page
          if ((action === "assess") || (action === "re-assess")) {
            this.assessProperty(action);
          } else {
            this.props.history.push(`pt-acknowledgment?purpose=apply&propertyId=${propertyId}&status=success&tenantId=${tenantId}&FY=2019-20`);
          }
        }
      }
    } catch (e) {
      hideSpinner();
      // this.setState({ nextButtonEnabled: true });
      // alert(e);
      store.dispatch(
        setRoute(
          `/property-tax/pt-acknowledgment?purpose=apply&status=failure`

        )
      );
    }
  }


  updateIndex = index => {
    // utils
    const { pay, estimate, createAndUpdate } = this;
    const { selected, formValidIndexArray, estimation } = this.state;
    const { displayFormErrorsAction, form } = this.props;
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
            true
          );
          break;
        }

        const isProperyAddressFormValid = validateForm(form.propertyAddress);
        if (isProperyAddressFormValid) {
          callDraft(this);
          window.scrollTo(0, 0);
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
            true
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
                      callDraft(this);
                      window.scrollTo(0, 0);
                      this.setState({
                        selected: index,
                        formValidIndexArray: [...formValidIndexArray, selected]
                      });
                    }
                  } else {
                    callDraft(this);
                    window.scrollTo(0, 0);
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
            true
          );
          break;
        }

        const { ownershipType } = form;
        const estimateCall = () => {
          estimate().then(estimateResponse => {
            if (estimateResponse) {
              window.scrollTo(0, 0);
              this.setState({
                estimation: estimateResponse && estimateResponse.Calculation,
                totalAmountToBePaid: 1, // What is this?
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
                callDraft(this);
                window.scrollTo(0, 0);
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
                callDraft(this);
                window.scrollTo(0, 0);
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
                callDraft(this);
                window.scrollTo(0, 0);
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
        const uploadedDocs = get(this.props, "documentsUploadRedux");
        let temp = 0;
        if (uploadedDocs) {
          let docsArray = [];
          Object.keys(uploadedDocs).map(key => {
            docsArray.push(uploadedDocs[key]);
          })
          docsArray.map(docs => {
            if (docs && docs.isDocumentRequired && docs.documents && docs.dropdown) {
              temp++;
            }
          });
        }
        if (!uploadedDocs || temp < 3) {
          alert("Please upload all the required documents and documents type.")
        } else {
          this.setState(
            {
              selected: index,
              formValidIndexArray: [...formValidIndexArray, selected]
            })
        }
        break;
      case 4:
        let { search: search1 } = this.props.location;
        let isAssesment1 = Boolean(getQueryValue(search1, "isAssesment").replace('false', ''));
        if (estimation && estimation.length && estimation.length > 1 && estimation[0].totalAmount < 0) {
          alert('Property Tax amount cannot be Negative!');
        } else {
          window.scrollTo(0, 0);
          if (isAssesment1) {
            createAndUpdate(index, 'assess');
            // this.props.history.push(`pt-acknowledgment?purpose=assessment&consumerCode=${propertyId1}&status=success&tenantId=${tenantId1}&FY=2019-20`);
          } else {
            createAndUpdate(index, 'create');
          }
        }
        break;
      case 5:
        const { assessedPropertyDetails = {} } = this.state;
        const { Properties = [] } = assessedPropertyDetails;
        let propertyId = '';
        let tenantId = '';
        for (let pty of Properties) {
          propertyId = pty.propertyId;
          tenantId = pty.tenantId;
        }
        this.props.history.push(`./../egov-common/pay?consumerCode=${propertyId}&tenantId=${tenantId}`
        )
        break;
      case 6:
        if (this.state.partialAmountError.length == 0) {
          pay();
        } else {
          alert(this.state.partialAmountError);
        }
        break;
      case 7:
        pay();
        break;
    }
  };

  callGetBill = async (
    propertyId,
    assessmentNumber,
    assessmentYear,
    tenantId
  ) => {
    const { location, toggleSpinner } = this.props;
    const { isFullPayment, totalAmountToBePaid, estimation } = this.state;
    const { search } = location;
    const isCompletePayment = getQueryValue(search, "isCompletePayment");
    toggleSpinner();

    const queryObj = [
      { key: "consumerCodes", value: propertyId },
      { key: "tenantId", value: tenantId }
    ];


    try {
      const billResponse = await httpRequest(
        "pt-calculator-v2/propertytax/_getbill",
        "_create",
        queryObj,
        {}
      );
      toggleSpinner();
      return billResponse;
    } catch (e) {
      toggleSpinner();
      console.log(e);
    }
  };

  callPGService = async (
    propertyId,
    assessmentNumber,
    assessmentYear,
    tenantId
  ) => {
    const { isFullPayment, totalAmountToBePaid, billResponse } = this.state;
    let { history, toggleSpinner, location } = this.props;
    const { search } = location;
    const isCompletePayment = getQueryValue(search, "isCompletePayment");
    let callbackUrl = `${window.origin}/property-tax/payment-redirect-page`;
    if (process.env.NODE_ENV !== "development") {
      const userType =
        process.env.REACT_APP_NAME === "Citizen" ? "CITIZEN" : "EMPLOYEE";
      if (userType === "CITIZEN") {
        callbackUrl = `${
          window.origin
          }/citizen/property-tax/payment-redirect-page`;
      } else {
        callbackUrl = `${
          window.origin
          }/employee/property-tax/payment-redirect-page`;
      }
    }

    try {
      const getBill = !isCompletePayment
        ? await this.callGetBill(
          propertyId,
          assessmentNumber,
          assessmentYear,
          tenantId
        )
        : billResponse;
      const taxAndPayments = get(getBill, "Bill[0].taxAndPayments", []).map(
        item => {
          if (item.businessService === "PT") {
            item.amountPaid = isFullPayment
              ? get(getBill, "Bill[0].billDetails[0].totalAmount")
              : totalAmountToBePaid;
          }
          return item;
        }
      );
      try {
        const requestBody = {
          Transaction: {
            tenantId,
            txnAmount: isFullPayment
              ? get(getBill, "Bill[0].billDetails[0].totalAmount")
              : totalAmountToBePaid,
            module: "PT",
            taxAndPayments,
            billId: get(getBill, "Bill[0].id"),
            consumerCode: get(getBill, "Bill[0].billDetails[0].consumerCode"),
            productInfo: "Property Tax Payment",
            gateway: "AXIS",
            callbackUrl
          }
        };
        const goToPaymentGateway = await httpRequest(
          "pg-service/transaction/v1/_create",
          "_create",
          [],
          requestBody
        );
        if (get(getBill, "Bill[0].billDetails[0].totalAmount")) {
          const redirectionUrl = get(
            goToPaymentGateway,
            "Transaction.redirectUrl"
          );
          localStorageSet("assessmentYear", assessmentYear);
          window.location = redirectionUrl;
        } else {
          toggleSpinner();
          let moduleId = get(goToPaymentGateway, "Transaction.consumerCode");
          let tenantId = get(goToPaymentGateway, "Transaction.tenantId");
          history.push(
            "/property-tax/payment-success/" +
            moduleId.split(":")[0] +
            "/" +
            tenantId
          );
        }
      } catch (e) {
        toggleSpinner();
        console.log(e);
      }
    } catch (e) {
      toggleSpinner();
      console.log(e);
    }
  };

  estimate = async () => {
    // utils
    let { toggleSpinner, form, common, location } = this.props;
    let { search } = location;
    let prepareFormData = { ...this.props.prepareFormData };
    toggleSpinner();
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
      } else {
        toggleSpinner();
        return;
        
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
      //For calculation screen
      const tenantId =
        prepareFormData.Properties[0] && prepareFormData.Properties[0].tenantId;
      const calculationScreenData = await getCalculationScreenData(
        get(estimateResponse, "Calculation[0].billingSlabIds", []),
        tenantId,
        this
      );
      this.setState({ calculationScreenData: calculationScreenData.data });

      toggleSpinner();
      return estimateResponse;
    } catch (e) {
      toggleSpinner();
      if (e.message) {
        alert(e.message);
      } else
        this.props.toggleSnackbarAndSetText(
          true,
          {
            labelName: "Error calculating tax!",
            labelKey: "ERR_ERROR_CALCULATING_TAX"
          },
          true
        );
    }
  };

  pay = async () => {

    const { callPGService } = this;
    const { financialYearFromQuery, assessedPropertyDetails = {} } = this.state;
    const { Properties = [] } = assessedPropertyDetails;
    let { toggleSpinner, location, form, common } = this.props;
    let prepareFormData = { ...this.props.prepareFormData };
    if (
      get(
        prepareFormData,
        "Properties[0].propertyDetails[0].institution",
        undefined
      )
    )
      delete prepareFormData.Properties[0].propertyDetails[0].institution;
    let { search } = location;
    let propertyUID = get(assessedPropertyDetails, "Properties[0].propertyId");
    let propertyId = getQueryValue(search, "propertyId");
    if (!propertyId) {
      propertyId = propertyUID;
    }
    const assessmentId = getQueryValue(search, "assessmentId");
    const tenantId = getQueryValue(search, "tenantId");
    const isCompletePayment = getQueryValue(search, "isCompletePayment");
    const propertyMethodAction = !!propertyId ? "_update" : "_create";
    const selectedownerShipCategoryType = get(
      form,
      "ownershipType.fields.typeOfOwnership.value",
      ""
    );
    toggleSpinner();
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

    try {
      if (isCompletePayment) {
        callPGService(
          propertyId,
          assessmentId,
          financialYearFromQuery,
          tenantId
        );
      } else {
        //Remove null units and do sqyd to sqft conversion.
        // const properties = normalizePropertyDetails(
        //   prepareFormData.Properties,
        //   this
        // );
        callPGService(
          get(assessedPropertyDetails, "Properties[0].propertyId"),
          get(
            assessedPropertyDetails,
            "Properties[0].propertyDetails[0].assessmentNumber"
          ),
          get(
            assessedPropertyDetails,
            "Properties[0].propertyDetails[0].financialYear"
          ),
          get(assessedPropertyDetails, "Properties[0].tenantId")
        );
      }

    } catch (e) {
      toggleSpinner();
      alert(e);
    }
  };

  resetForm = () => {
    const {
      form,
      removeForm,
      prepareFormDataAction,
      prepareFinalObject
    } = this.props;
    resetFormWizard(form, removeForm);
    prepareFormDataAction("Properties", []);
    prepareFinalObject("documentsUploadRedux",{} );
    this.onTabClick(0);
  };

  onTabClick = index => {
    const { formValidIndexArray, selected, propertyUUID } = this.state;
    const { location } = this.props;
    let { search } = location;
    let currentUUID = get(JSON.parse(getUserInfo()), "uuid");
    const isCompletePayment = getQueryValue(search, "isCompletePayment");
    const isReassesment = getQueryValue(search, "isReassesment");
    if (formValidIndexArray.indexOf(index) !== -1 && selected >= index) {
      isReassesment
        ? isCompletePayment || propertyUUID !== currentUUID
          ? alert("Not authorized to edit this property details")
          : this.setState({
            selected: index,
            formValidIndexArray: range(0, index)
          })
        : this.setState({
          selected: index,
          formValidIndexArray: range(0, index)
        });
    } else {
    }
  };
  closeDeclarationDialogue = () => {
    this.setState({ dialogueOpen: false });
  };
  getButtonLabels(index) {
    let { search } = this.props.location;
    let isReassesment = Boolean(getQueryValue(search, "isReassesment").replace('false', ''));
    let isAssesment = Boolean(getQueryValue(search, "isAssesment").replace('false', ''));
    let buttonLabel = "PT_COMMONS_NEXT";
    if (index == 4) {
      isAssesment ? buttonLabel = 'PT_ASSESS_PROPERTY' : (isReassesment ? buttonLabel = "PT_UPDATE_ASSESSMENT" : buttonLabel = "PT_ADD_ASSESS_PROPERTY");
    } else if (index == 5) {
      buttonLabel = 'PT_PROCEED_PAYMENT'
    } else if (index == 6) {
      buttonLabel = 'PT_MAKE_PAYMENT'
    } else if (index == 7) {
      buttonLabel = 'PT_DOWNLOAD_RECEIPT'
    }
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
            (headerObj.headerValue = "",
              headerObj.subHeaderValue = '',
              headerObj.header = "PT_PROPERTY_CREATE_HEADER")));
        break;
      case 3:
        headerObj.subHeaderValue = propertyId;
        headerObj.headerValue = '(' + assessmentYear + ')';
        (isAssesment ?
          (headerObj.header = 'PT_PROPERTY_ASSESSMENT_HEADER') :
          (isReassesment ?
            (headerObj.header = "PT_REASSESS_PROPERTY") :
            (headerObj.headerValue = "",
              headerObj.subHeaderValue = '',
              headerObj.header = "PT_PROPERTY_CREATE_HEADER")));
        break;
      case 4:
        headerObj.subHeaderValue = propertyId;
        headerObj.headerValue = '(' + assessmentYear + ')';
        (isAssesment ?
          (headerObj.header = 'PT_PROPERTY_ASSESSMENT_HEADER') :
          (isReassesment ?
            (headerObj.header = "PT_REASSESS_PROPERTY") :
            (headerObj.headerValue = "", headerObj.header = "PT_PROPERTY_CREATE_HEADER")));
        // headerObj.headerValue = "";
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


  getMessageHeader() {
    let { search } = this.props.location;
    let isReassesment = Boolean(getQueryValue(search, "isReassesment").replace('false', ''));
    let isAssesment = Boolean(getQueryValue(search, "isAssesment").replace('false', ''));
    let buttonLabel = "PT_PROPERTY_ASSESS_SUCCESS";
    isAssesment ? buttonLabel = 'PT_PROPERTY_ASSESS_SUCCESS' : (isReassesment ? buttonLabel = "PT_PROPERTY_REASSESS_SUCCESS" : buttonLabel = "PT_PROPERTY_ADD_SUCCESS");
    return buttonLabel;
  }
  getMessage() {
    let { search } = this.props.location;
    let isReassesment = Boolean(getQueryValue(search, "isReassesment").replace('false', ''));
    let isAssesment = Boolean(getQueryValue(search, "isAssesment").replace('false', ''));
    let buttonLabel = "PT_PROPERTY_ASSESS_NOTIFICATION";
    isAssesment ? buttonLabel = 'PT_PROPERTY_ASSESS_NOTIFICATION' : (isReassesment ? buttonLabel = "PT_PROPERTY_REASSESS_NOTIFICATION" : buttonLabel = "PT_PROPERTY_ADD_NOTIFICATION");
    return buttonLabel;
  }
  onPayButtonClick = () => {
    const {
      isFullPayment,
      partialAmountError,
      totalAmountToBePaid,
      termsAccepted,
      selected
    } = this.state;
    if (!termsAccepted) {
      this.setState({
        termsError: "PT_CHECK_DECLARATION_BOX"
      });
      alert("Please check the declaration box to proceed futher");
      return;
    }
    if (totalAmountToBePaid % 1 !== 0) {
      alert("Amount cannot be a fraction!");
      return;
    }
    if (!isFullPayment && partialAmountError) return;
    this.updateIndex(selected + 1);
  };
  componentDidUpdate() {
    const {
      selected,
      formValidIndexArray,
    } = this.state;
    const { location } = this.props;
    const { search } = location;
    let proceedToPayment = Boolean(getQueryValue(search, "proceedToPayment").replace('false', ''));
    if (proceedToPayment && selected == 4) {
      this.setState({
        selected: 6,
        formValidIndexArray: [...formValidIndexArray, 6]
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
    const { cities, generalMDMSDataById } = common;
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
    generateAcknowledgementForm("pt-reciept-citizen", receiptDetails, generalMDMSDataById, imageUrl);
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
      dialogueOpen, assessedPropertyDetails = {}
    } = this.state;


    const { Properties = [] } = assessedPropertyDetails;
    let propertyId = '';
    for (let pty of Properties) {
      propertyId = pty.propertyId;
    }
    const fromReviewPage = selected === 4;
    const { history, location } = this.props;
    const { search } = location;
    // const propertyId = getQueryValue(search, "propertyId");
    const { header, subHeaderValue, headerValue } = this.getHeader(selected, search, propertyId);

    return (
      <div className="wizard-form-main-cont">
        <div className='form-header'>
          <PTHeader header={header} subHeaderTitle='PT_PROPERTY_PTUID' headerValue={headerValue} subHeaderValue={subHeaderValue} />
        </div>
        <WizardComponent
          downloadAcknowledgementForm={this.downloadAcknowledgementForm}
          content={renderStepperContent(selected, fromReviewPage)}
          onTabClick={this.onTabClick}
          selected={selected}
          header={getHeaderLabel(selected, "citizen")}
          footer={null}
          fontSize
          formValidIndexArray={formValidIndexArray}
          updateIndex={this.updateIndex}
          backLabel="PT_COMMONS_GO_BACK"
          nextLabel={this.getButtonLabels(selected)}
          ownerInfoArr={ownerInfoArr}
          closeDialogue={closeDeclarationDialogue}
          dialogueOpen={dialogueOpen}
          history={history}
          onPayButtonClick={onPayButtonClick}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { form, common, app, screenConfiguration } = state || {};
  const { propertyAddress } = form;
  const { city } =
    (propertyAddress && propertyAddress.fields && propertyAddress.fields) || {};
  const currentTenantId = (city && city.value) || commonConfig.tenantId;
  const { preparedFinalObject } = screenConfiguration;
  const { documentsUploadRedux } = preparedFinalObject;
  return {
    form,
    prepareFormData: common.prepareFormData,
    currentTenantId,
    common,
    app,
    documentsUploadRedux
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteForm: formKey => dispatch(deleteForm(formKey)),
    setRoute: route => dispatch(setRoute(route)),
    displayFormErrorsAction: formKey => dispatch(displayFormErrors(formKey)),
    updatePTForms: forms => dispatch(updateForms(forms)),
    toggleSpinner: () => dispatch(toggleSpinner()),
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
    updatePrepareFormDataFromDraft: prepareFormData =>
      dispatch(updatePrepareFormDataFromDraft(prepareFormData)),
    fetchMDMDDocumentTypeSuccess: data =>
      dispatch(fetchMDMDDocumentTypeSuccess(data)),
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value)),
    prepareFormDataAction: (path, value) =>
      dispatch(prepareFormDataAction(path, value)),
      hideSpinner: () => dispatch(hideSpinner()),
    removeForm: formkey => dispatch(removeForm(formkey)),
    prepareFinalObject: (jsonPath, value) =>
    dispatch(prepareFinalObject(jsonPath, value))   
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormWizard);
