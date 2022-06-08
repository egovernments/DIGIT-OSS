import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import NewCard from '../utils/NewCard';
import SupportingDocuments from '../utils/SupportingDocuments';
import { Grid } from 'react-bootstrap';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Acknowledgement from './Acknowledgement';
import { translate, dateToEpoch, epochToDate } from '../../../common/common';
import Api from '../../../../api/api';
import styles from '../../../../styles/material-ui';
const constants = require('../../../common/constants');

const patterns = {
  date: /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g,
  ownerName: /^.[a-zA-Z. ]{2,99}$/,
  address: /^[a-zA-Z0-9:@&*_+#()/,. -]*$/,
  assessmentNumber: /^[a-z0-9\/\-]+$/,
  tradeTitle: /^[a-zA-Z0-9@:()/#,. -]*$/,
  remarks: /^[a-zA-Z0-9:@&*_+#()/,. -]*$/,
  agreementNo: /^[a-zA-Z0-9&/()-]*$/,
  quantity: /^[+-]?\d+(\.\d{1,2})?$/,
  mobileNumber: /^\d{10}$/,
  aadhaarNumber: /^\d{12}$/,
  email: /^(?=.{6,64}$)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

const tradeOwnerDetailsCardFields = [
  {
    label: 'tl.create.licenses.groups.TradeOwnerDetails.AadharNumber',
    id: 'licenses[0]-adhaarNumber',
    type: 'text',
    code: 'adhaarNumber',
    isMandatory: false,
    maxLength: 12,
    pattern: patterns.aadhaarNumber,
    errorMsg: 'Enter Valid Aadhar Number (12 Digit Number)',
  },
  {
    label: 'tl.create.licenses.groups.TradeOwnerDetails.Mobile Number',
    id: 'licenses[0]-mobileNumber',
    type: 'text',
    code: 'mobileNumber',
    isMandatory: true,
    maxLength: 10,
    pattern: patterns.mobileNumber,
    errorMsg: 'Enter Valid Mobile Number (10 Digit Number)',
  },
  {
    label: 'tl.create.licenses.groups.TradeOwnerDetails.TradeOwnerName',
    id: 'licenses[0]-ownerName',
    type: 'text',
    code: 'ownerName',
    isMandatory: true,
    maxLength: 100,
    pattern: patterns.ownerName,
    errorMsg: 'Enter Valid Trade Owner Name(Min:3, Max:100)',
  },
  {
    label: 'tl.create.licenses.groups.TradeOwnerDetails.gender',
    id: 'licenses[0]-ownerGender',
    type: 'dropdown',
    code: 'ownerGender',
    isMandatory: true,
    maxLength: 50,
    pattern: '',
  },
  {
    label: 'tl.create.licenses.groups.TradeOwnerDetails.FatherSpouseName',
    id: 'licenses[0]-fatherSpouseName',
    type: 'text',
    code: 'fatherSpouseName',
    isMandatory: true,
    maxLength: 100,
    pattern: patterns.ownerName,
    errorMsg: 'Enter Valid Father/Spouse Name(Min:3, Max:100)',
  },
  {
    label: 'tl.create.licenses.TradeOwnerDetails.groups.EmailID',
    id: 'licenses[0]-emailId',
    code: 'emailId',
    type: 'text',
    isMandatory: true,
    maxLength: 50,
    pattern: patterns.email,
    errorMsg: 'Enter Valid Email ID (Max:50)',
  },
  {
    label: 'tl.create.licenses.groups.TradeOwnerDetails.TradeOwnerAddress',
    id: 'licenses[0]-ownerAddress',
    type: 'textarea',
    code: 'ownerAddress',
    isMandatory: true,
    maxLength: 250,
    pattern: patterns.address,
    errorMsg: 'Enter Valid Trade Owner Address (Max:250)',
  },
];

var tradeLocationDetails = [
  {
    label: 'tl.create.licenses.groups.TradeLocationDetails.PropertyAssessmentNo',
    id: 'licenses[0]-propertyAssesmentNo',
    type: 'textSearch',
    code: 'propertyAssesmentNo',
    isMandatory: false,
    maxLength: 20,
    pattern: patterns.assessmentNumber,
    errorMsg: 'Enter Valid Property Assessment Number (Max:20)',
  },
  {
    label: 'tl.create.licenses.groups.TradeLocationDetails.Locality',
    id: 'licenses[0]-localityId',
    type: 'dropdown',
    code: 'locality',
    isMandatory: false,
    maxLength: 50,
    pattern: '',
  },
  {
    label: 'tl.create.licenses.groups.TradeLocationDetails.adminWardId',
    id: 'licenses[0]-adminWardId',
    type: 'dropdown',
    code: 'adminWard',
    isMandatory: true,
    maxLength: 50,
    pattern: '',
  },
  {
    label: 'tl.create.licenses.groups.TradeLocationDetails.revenueWardId',
    id: 'licenses[0]-revenueWardId',
    type: 'dropdown',
    code: 'revenueWard',
    isMandatory: true,
    maxLength: 100,
    pattern: '',
  },
  {
    label: 'tl.create.licenses.groups.TradeLocationDetails.OwnershipType',
    id: 'licenses[0]-ownerShipType',
    code: 'ownerShipType',
    type: 'dropdown',
    isMandatory: true,
    maxLength: 50,
    pattern: '',
  },
  {
    label: 'tl.create.licenses.groups.TradeLocationDetails.TradeAddress',
    id: 'licenses[0]-tradeAddress',
    type: 'textarea',
    code: 'tradeAddress',
    isMandatory: true,
    maxLength: 250,
    pattern: patterns.address,
    errorMsg: 'Enter Valid Trade Address (Max:250)',
  },
];

const tradeDetails = [
  {
    label: 'tl.create.licenses.groups.TradeDetails.TradeTitle',
    id: 'licenses[0]-tradeTitle',
    type: 'text',
    code: 'tradeTitle',
    isMandatory: true,
    maxLength: 100,
    pattern: patterns.tradeTitle,
    errorMsg: 'Enter Valid Trade Title (Max: 250)',
  },
  {
    label: 'tl.create.licenses.groups.TradeDetails.TradeType',
    id: 'licenses[0]-tradeType',
    type: 'dropdown',
    code: 'tradeType',
    isMandatory: true,
    maxLength: 50,
    pattern: '',
  },
  {
    label: 'tl.create.licenses.groups.TradeDetails.TradeCategory',
    id: 'licenses[0]-categoryId',
    type: 'dropdown',
    code: 'category',
    isMandatory: true,
    maxLength: 50,
    pattern: '',
  },
  {
    label: 'tl.create.licenses.groups.TradeDetails.TradeSubCategory',
    id: 'licenses[0]-subCategoryId',
    type: 'dropdown',
    code: 'subCategory',
    isMandatory: true,
    maxLength: 100,
    pattern: '',
  },
  {
    label: 'tl.create.licenses.groups.TradeDetails.UOM',
    code: 'uomName',
    id: 'licenses[0]-uomName',
    codeName: 'uom',
    type: 'text',
    isMandatory: true,
    maxLength: 50,
    pattern: '',
    isDisabled: true,
  },
  {
    label: 'tl.create.licenses.groups.TradeDetails.tradeValueForUOM',
    id: 'licenses[0]-quantity',
    type: 'text',
    code: 'quantity',
    isMandatory: true,
    maxLength: 50,
    pattern: patterns.quantity,
    errorMsg: 'Enter Valid Trade Value for the UOM (Upto two decimal points)',
  },
  {
    label: 'tl.create.licenses.groups.validity',
    type: 'text',
    id: 'licenses[0]-validityYears',
    code: 'validityYears',
    isMandatory: true,
    maxLength: 50,
    pattern: '',
    isDisabled: true,
  },
  {
    label: 'tl.create.licenses.groups.TradeDetails.Remarks',
    id: 'licenses[0]-remarks',
    type: 'textarea',
    code: 'remarks',
    isMandatory: false,
    maxLength: 1000,
    pattern: patterns.remarks,
    errorMsg: 'Please avoid sepcial characters except :@&*_+#()/,.-',
  },
  {
    label: 'tl.create.licenses.groups.TradeDetails.TradeCommencementDate',
    id: 'licenses[0]-tradeCommencementDate',
    type: 'date',
    code: 'tradeCommencementDate',
    isMandatory: true,
    maxLength: 1000,
    pattern: patterns.date,
    errorMsg: 'Enter in dd/mm/yyyy Format',
  },
  {
    label: 'tl.create.licenses.groups.TradeDetails.TraderOwnerProperty',
    id: 'licenses[0]-isPropertyOwner',
    type: 'checkbox',
    code: 'isPropertyOwner',
    isMandatory: false,
  },
];

const agreementDetailsSection = [
  {
    label: 'tl.create.licenses.groups.agreementDetails.agreementDate',
    id: 'licenses[0]-agreementDate',
    type: 'date',
    code: 'agreementDate',
    isMandatory: true,
    maxLength: 10,
    pattern: patterns.date,
    errorMsg: 'Enter in dd/mm/yyyy Format',
  },
  {
    label: 'tl.create.licenses.groups.agreementDetails.agreementNo',
    id: 'licenses[0]-agreementNo',
    type: 'text',
    code: 'agreementNo',
    isMandatory: true,
    maxLength: 30,
    pattern: patterns.agreementNo,
    errorMsg: 'Enter Valid Agreement No (Max:30, Alpha/Numeric)',
  },
];

const customStyles = {
  cardTitle: {
    padding: '16px 16px 0',
  },
  th: {
    padding: '15px 10px !important',
  },
  fileInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};

function compareStrings(a, b) {
  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  return a < b ? -1 : a > b ? 1 : 0;
}

function sortArrayByAlphabetically(arry, keyToSort) {
  return arry.sort(function(a, b) {
    return compareStrings(a[keyToSort], b[keyToSort]);
  });
}

export default class NewTradeLicenseForm extends Component {
  constructor() {
    super();
    this.customHandleChange = this.customHandleChange.bind(this);
    this.handleDocumentsClearCancel = this.handleDocumentsClearCancel.bind(this);
    this.handleDocumentsClearConfirm = this.handleDocumentsClearConfirm.bind(this);

    this.state = {
      isPropertyOwner: true,
      openDocClearDialog: false,
      documentTypes: [], //supporting documents
      autocompleteDataSource: {
        localityId: [], //assigning datasource by field code
        localityIdConfig: {
          //autocomplete config
          text: 'name',
          value: 'id',
        },
      },
      confirmCategoryField: {}, //category or subcategory field confirm temporary store
      confirmCategoryFieldValue: '',
      supportDocClearDialogMsg: translate('tl.create.supportDocuments.clear.basedonCategory'),
      dropdownDataSource: {
        ownerGender: [
          {
            id: 'MALE',
            name: 'MALE',
          },
          {
            id: 'FEMALE',
            name: 'FEMALE',
          },
          {
            id: 'OTHERS',
            name: 'OTHERS',
          },
        ],
        ownerGenderConfig: {
          text: 'name',
          value: 'id',
        },
        adminWard: [],
        adminWardConfig: {
          text: 'name',
          value: 'code',
        },
        revenueWard: [],
        revenueWardConfig: {
          text: 'name',
          value: 'code',
        },
        category: [],
        categoryConfig: {
          text: 'name',
          value: 'code',
        },
        subCategory: [],
        subCategoryConfig: {
          text: 'name',
          value: 'code',
        },
        tradeType: [
          {
            id: 'PERMANENT',
            name: 'PERMANENT',
          },
          {
            id: 'TEMPORARY',
            name: 'TEMPORARY',
          },
        ],
        tradeTypeConfig: {
          text: 'name',
          value: 'id',
        },
        ownerShipType: [
          {
            id: 'OWNED',
            name: 'OWNED',
          },
          {
            id: 'RENTED',
            name: 'RENTED',
          },
          {
            id: 'ULB',
            name: 'ULB',
          },
          {
            id: 'STATE_GOVERNMENT',
            name: 'STATE GOVERNMENT',
          },
          {
            id: 'CENTRAL_GOVERNMENT',
            name: 'CENTRAL GOVERNMENT',
          },
        ],
        ownerShipTypeConfig: {
          text: 'name',
          value: 'id',
        },
        locality: [],
        localityConfig: {
          text: 'name',
          value: 'code',
        },
      },
    };
  }

  componentDidMount() {
    let requiredFields = [];

    var allFields = [...tradeOwnerDetailsCardFields, ...tradeLocationDetails, ...tradeDetails];

    if (this.props.isPropertyOwner) {
      allFields = [...allFields, ...agreementDetailsSection];
    }

    allFields.filter(function(obj) {
      obj.isMandatory ? requiredFields.push(obj.code) : '';
    });

    if (!this.props.hasDefaultFormData) this.props.initForm(requiredFields);
    else {
      //make mandatory fields
      let fields = [];
      var mandatoryFields = allFields.filter(field => field.isMandatory);
      for (var i = 0; i < mandatoryFields.length; i++) {
        var field = mandatoryFields[i];
        fields.push({
          value: this.props.form[field.code],
          property: field.code,
          isRequired: field.isMandatory,
          pattern: field.pattern || '',
          errorMsg: field.errorMsg || '',
        });
      }
      this.props.addMandatoryFields(fields);

      //load date fields
      let dateFields = allFields.filter(field => field.type === 'date');
      for (var i = 0; i < dateFields.length; i++) {
        var currentDateField = dateFields[i];
        if (this.props.form[currentDateField.code])
          this.props.handleChange(
            epochToDate(this.props.form[currentDateField.code]),
            currentDateField.code,
            currentDateField.isMandatory,
            currentDateField.pattern || '',
            currentDateField.errorMsg || ''
          );
      }
    }

    var tenantId = this.getTenantId();

    this.props.setLoadingStatus('loading');

    let initialCalls = [
      Api.commonApiPost(
        '/egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName',
        { boundaryTypeName: 'WARD', hierarchyTypeName: 'REVENUE' },
        { tenantId: tenantId }
      ),
      Api.commonApiPost(
        '/egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName',
        { boundaryTypeName: 'Ward', hierarchyTypeName: 'ADMINISTRATION' },
        { tenantId: tenantId }
      ),
      Api.commonApiPost('/tl-masters/category/v1/_search', { type: 'category', active: true }, { tenantId: tenantId, pageSize: '500' }, false, true),
      Api.commonApiPost(
        '/egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName',
        { boundaryTypeName: 'LOCALITY', hierarchyTypeName: 'LOCATION' },
        { tenantId: tenantId }
      ),
    ];

    let subcategoryResponseIdx = -1;
    if (this.props.form && this.props.form['category']) {
      subcategoryResponseIdx = initialCalls.length;
      initialCalls[subcategoryResponseIdx] = Api.commonApiPost(
        'tl-masters/category/v1/_search',
        {
          type: 'subcategory',
          active: true,
          category: this.props.form['category'],
        },
        { tenantId: tenantId },
        false,
        true
      );
    }

    let supportDocumentsResponseIdx = -1;
    if (this.props.form && this.props.form['category'] && this.props.form['subCategory']) {
      supportDocumentsResponseIdx = initialCalls.length;
      initialCalls[supportDocumentsResponseIdx] = Api.commonApiPost(
        'tl-masters/documenttype/v2/_search',
        {
          applicationType: 'NEW',
          enabled: true,
          fallback: true,
          category: this.props.form['category'],
          subCategory: this.props.form['subCategory'],
        },
        {},
        false,
        true
      );
    }

    // let propertyAssesmentNoResponseIdx = -1;
    // if(this.props.form['propertyAssesmentNo']){
    //   propertyAssesmentNoResponseIdx = initialCalls.length;
    //   initialCalls[propertyAssesmentNoResponseIdx] = Api.commonApiPost("/pt-property/properties/_search"
    //   ,{upicNumber:this.props.form['propertyAssesmentNo']},{});
    // }

    Promise.all(initialCalls).then(responses => {
      try {
        let revenueWard = sortArrayByAlphabetically(responses[0].Boundary, 'name');
        let adminWard = sortArrayByAlphabetically(responses[1].Boundary, 'name');
        let category = sortArrayByAlphabetically(responses[2].categories, 'name');
        let locality = sortArrayByAlphabetically(responses[3].Boundary, 'name');
        let dropdownDataSource = { ...this.state.dropdownDataSource };
        dropdownDataSource = {
          ...dropdownDataSource,
          revenueWard,
          adminWard,
          category,
          locality,
        };
        if (subcategoryResponseIdx > -1) {
          dropdownDataSource['subCategory'] = sortArrayByAlphabetically(responses[subcategoryResponseIdx].categories, 'name');
        }

        let documentTypes = [];
        if (supportDocumentsResponseIdx > -1) {
          documentTypes = sortArrayByAlphabetically(responses[supportDocumentsResponseIdx].documentTypes, 'name');
          this.addMandatoryDocuments(documentTypes);

          //assign existing support docs into redux
          let newApplicationType = this.props.form.applications.find(application => application.applicationType === 'NEW');
          let supportDocuments = newApplicationType.supportDocuments || [];

          for (var idx = 0; idx < supportDocuments.length; idx++) {
            var supportDocument = supportDocuments[idx];
            var documentType = documentTypes.find(doc => doc.id === supportDocument.documentTypeId);
            this.props.addFile({
              isRequired: documentType.mandatory,
              code: supportDocument.documentTypeId,
              files: [
                {
                  name: `File(${idx + 1})`,
                  fileStoreId: supportDocument.fileStoreId,
                },
              ],
            });
            this.fileSectionChange(supportDocument.comments || '', {
              id: supportDocument.documentTypeId,
            });
          }
        }

        this.setState({
          documentTypes,
          dropdownDataSource,
          isPropertyOwner: this.props.form['isPropertyOwner'] || true,
        });
        if (!this.props.form['propertyAssesmentNo']) this.props.setLoadingStatus('hide');
        else this.customSearch('propertyAssesmentNo', true);
      } catch (e) {
        console.log('error', e);
      } finally {
      }
    });
  }

  customSearch = (code, isDefaultLoad) => {
    if (code === 'propertyAssesmentNo' && this.props.form[code]) {
      let self = this;
      self.props.setLoadingStatus('loading');
      // self.props.handleChange(true, "isPropertySearched", true, "", "");
      //make ajax call to PTIS module and populate locality, ward and address
      Api.commonApiPost('/pt-property/properties/_search', { upicNumber: this.props.form[code], searchType: 'BASIC_DETAILS' }, {}).then(
        function(response) {
          if (response.properties.length > 0) {
            let properties = response.properties[0];
            // console.log('location:',properties.boundary.locationBoundary.id,'revenue:', properties.boundary.revenueBoundary.id,'admin:', properties.boundary.adminBoundary.id, 'address:',properties.address.addressNumber,properties.address.addressLine1,properties.address.addressLine2, properties.address.landmark, properties.address.city,properties.address.pincode );

            let isPropertylocalityObj = self.state.dropdownDataSource.locality.find(
              locality =>
                locality[self.state.dropdownDataSource.localityConfig.value] ==
                properties.boundary.locationBoundary[self.state.dropdownDataSource.localityConfig.value]
            );
            let isPropertyadminWardObj = self.state.dropdownDataSource.adminWard.find(
              adminward =>
                adminward[self.state.dropdownDataSource.adminWardConfig.value] ==
                properties.boundary.adminBoundary[self.state.dropdownDataSource.adminWardConfig.value]
            );
            let isPropertyrevenueWardObj = self.state.dropdownDataSource.revenueWard.find(
              revenueward =>
                revenueward[self.state.dropdownDataSource.revenueWardConfig.value] ==
                properties.boundary.revenueBoundary[[self.state.dropdownDataSource.revenueWardConfig.value]]
            );

            let isPropertylocalityId = !isPropertylocalityObj ? '' : isPropertylocalityObj[self.state.dropdownDataSource.localityConfig.value];
            let isPropertyadminWardId = !isPropertyadminWardObj ? '' : isPropertyadminWardObj[self.state.dropdownDataSource.adminWardConfig.value];
            let isPropertyrevenueWardId = !isPropertyrevenueWardObj
              ? ''
              : isPropertyrevenueWardObj[self.state.dropdownDataSource.revenueWardConfig.value];

            // console.log('isPropertylocalityId->',isPropertylocalityId,'isPropertyadminWardId->', isPropertyadminWardId, 'isPropertyrevenueWardId=>',isPropertyrevenueWardId);
            let address = '';

            Promise.all([
              Api.commonApiGet('/egov-location/boundarys', {
                'Boundary.id': properties.address.addressLine1,
                'Boundary.tenantId': self.getTenantId(),
              }),
            ]).then(responses => {
              if (responses[0].Boundary.length !== 0)
                address = `${properties.address.addressNumber || ''} ${responses[0].Boundary[0].name || ''} ${properties.address.addressLine2 ||
                  ''} ${properties.address.landmark || ''} ${properties.address.city || ''} ${properties.address.pincode || ''}`;
              else
                address = `${properties.address.addressNumber || ''} ${properties.address.addressLine2 || ''} ${properties.address.landmark ||
                  ''} ${properties.address.city || ''} ${properties.address.pincode || ''}`;

              if ((isDefaultLoad && isPropertylocalityId) || !isDefaultLoad) self.props.handleChange(isPropertylocalityId, 'locality', false, '', '');
              if ((isDefaultLoad && isPropertyadminWardId) || !isDefaultLoad)
                self.props.handleChange(isPropertyadminWardId, 'adminWard', true, '', '');
              if ((isDefaultLoad && isPropertyrevenueWardId) || !isDefaultLoad)
                self.props.handleChange(isPropertyrevenueWardId, 'revenueWard', true, '', '');
              if ((isDefaultLoad && address) || !isDefaultLoad) self.props.handleChange(address, 'tradeAddress', true, '', '');

              self.setState({
                isPropertylocalityId: isPropertylocalityId,
                isPropertyadminWardId: isPropertyadminWardId,
                isPropertyrevenueWardId: isPropertyrevenueWardId,
                isPropertytradeAddress: address,
              });

              self.props.setLoadingStatus('hide');
            });
          } else {
            self.props.setLoadingStatus('hide');
            self.props.toggleDailogAndSetText(true, 'Not a valid Assessment Number');
          }
        },
        function(err) {
          self.props.setLoadingStatus('hide');
          // self.handleError(err.message);
        }
      );
    }
  };

  fileSectionChange = (comments, doc) => {
    this.props.handleChange(comments, doc.id + '_comments', false, '');
  };

  handleDocumentsClearConfirm() {
    //console.log('confirm clicked', field);
    if (this.state.confirmCategoryField.code === 'category') {
      this.tradeCategoryChangeAndResetFields(this.state.confirmCategoryField, this.state.confirmCategoryFieldValue);
    } else if (this.state.confirmCategoryField.code === 'subCategory') {
      this.tradeSubCategoryChangeAndResetFields(this.state.confirmCategoryField, this.state.confirmCategoryFieldValue);
    }
  }

  handleDocumentsClearCancel() {
    this.setState({ openDocClearDialog: false });
  }

  clearSupportDocuments() {
    var supportDocuments = this.state.documentTypes ? [...this.state.documentTypes] : [];
    supportDocuments.map(doc => {
      //doc.id
      if (doc.mandatory) {
        this.props.REMOVE_MANDATORY_LATEST('', doc.id, doc.mandatory, '', '');
      }

      //remove file
      var supportDocument = this.props.files ? [...this.props.files].find(file => file.code === doc.id) : [];

      if (supportDocument) {
        if (supportDocument.files && supportDocument.files.length > 0)
          this.props.removeFile({
            isRequired: doc.mandatory,
            code: doc.id,
            name: supportDocument.files[0].name,
          });
      }
    });
    this.setState({ documentTypes: [] });
  }

  tradeCategoryChangeAndResetFields = (field, value, isNotResetFields) => {
    var tenantId = this.getTenantId();
    var _this = this;
    value = `${value}`;
    var values = value.split('~');
    var id = value.indexOf('~') > -1 ? values[0] : value;

    this.props.handleChange(id, field.code, field.isMandatory, '', '');
    if (values.length > 1) {
      if (field.hasOwnProperty('codeName')) {
        this.props.handleChange(values[1], field.codeName, false, '', '');
      }
    }

    const dropdownDataSource = {
      ...this.state.dropdownDataSource,
      subCategory: [],
    };
    this.setState({ dropdownDataSource, openDocClearDialog: false });
    this.props.handleChange('', 'subCategory', field.isMandatory, '', '');
    this.props.handleChange('', 'validityYears', field.isMandatory, '', '');
    this.props.handleChange('', 'uom', field.isMandatory, '', '');
    this.props.handleChange('', 'uomName', field.isMandatory, '', '');

    this.clearSupportDocuments();
    Api.commonApiPost(
      'tl-masters/category/v1/_search',
      { type: 'subcategory', active: true, category: id },
      { tenantId: tenantId },
      false,
      true
    ).then(
      function(response) {
        const dropdownDataSource = {
          ..._this.state.dropdownDataSource,
          subCategory: sortArrayByAlphabetically(response.categories, 'name'),
        };
        _this.setState({ dropdownDataSource });
      },
      function(err) {
        console.log(err);
      }
    );
  };

  tradeSubCategoryChangeAndResetFields = (field, value) => {
    var tenantId = this.getTenantId();
    var _this = this;

    var values = value.split('~');
    var id = value.indexOf('~') > -1 ? values[0] : value;
    this.props.handleChange(id, field.code, field.isMandatory, '', '');
    if (values.length > 1) {
      if (field.hasOwnProperty('codeName')) {
        this.props.handleChange(values[1], field.codeName, false, '', '');
      }
    }

    this.setState({ openDocClearDialog: false });
    // /tl-masters/category/v1/_search
    this.props.handleChange('', 'validityYears', field.isMandatory, '', '');
    this.props.handleChange('', 'uom', field.isMandatory, '', '');
    this.props.handleChange('', 'uomName', field.isMandatory, '', '');
    this.clearSupportDocuments();

    Api.commonApiPost('tl-masters/category/v1/_search', { type: 'subcategory', codes: id }, { tenantId: tenantId }, false, true).then(
      function(response) {
        var category = response.categories[0];
        _this.props.handleChange(category.validityYears, 'validityYears', field.isMandatory, '', '');
        _this.props.handleChange(category.details[0].uom, 'uom', field.isMandatory, '', '');
        _this.props.handleChange(category.details[0].uomName, 'uomName', false, '', '');
        _this.getDocuments();
      },
      function(err) {
        console.log(err);
      }
    );
  };

  getTenantId = () => {
    return localStorage.getItem('tenantId') || 'default';
  };

  customHandleChange = (value, field) => {
    var tenantId = this.getTenantId();
    var _this = this;

    if (field.type === 'dropdown') {
      if (field.code === 'category' || field.code === 'subCategory') {
        // this.state.documentTypes.length > 0 && this.state.documentTypes.map((obj) => {
        //   obj.mandatory ? _this.props.REMOVE_MANDATORY_LATEST('', obj.id, obj.mandatory, "", "") : '';
        // });

        var files = this.props.files ? this.props.files.filter(field => field.files.length > 0) : undefined;
        if (files && files.length > 0) {
          this.setState({
            confirmCategoryField: field,
            confirmCategoryFieldValue: value,
            openDocClearDialog: true,
          });
        } else {
          if (field.code === 'category') this.tradeCategoryChangeAndResetFields(field, value);
          else this.tradeSubCategoryChangeAndResetFields(field, value);
        }
      } else {
        var values = value.split('~');
        var id = value.indexOf('~') > -1 ? values[0] : value;
        this.props.handleChange(id, field.code, field.isMandatory, '', '');
        if (values.length > 1) {
          if (field.hasOwnProperty('codeName')) {
            this.props.handleChange(values[1], field.codeName, false, '', '');
          }
        }
      }
    } else {
      //date field slash append functionality
      if (field.type == 'date') {
        var oldValue = this.props.form[field.code] || '';
        if ((value.length === 2 || value.length === 5) && value.length > oldValue.length) value = value + '/';
      }

      this.props.handleChange(value, field.code, field.isMandatory || false, field.pattern || '', field.errorMsg || '');
      if (field.code === 'isPropertyOwner') {
        this.setState({ isPropertyOwner: !value });
        var agreementdate = agreementDetailsSection.find(agreement => agreement.code == 'agreementDate');
        var agreementno = agreementDetailsSection.find(agreement => agreement.code == 'agreementNo');
        if (value) {
          _this.props.ADD_MANDATORY_LATEST('', 'agreementDate', agreementdate.isMandatory, agreementdate.pattern, agreementdate.errorMsg);
          _this.props.ADD_MANDATORY_LATEST('', 'agreementNo', agreementno.isMandatory, agreementno.pattern);
        } else {
          //clear the values
          _this.props.handleChange('', 'agreementDate', false, '', '');
          _this.props.handleChange('', 'agreementNo', false, '', '');
          _this.props.REMOVE_MANDATORY_LATEST('', 'agreementDate', agreementdate.isMandatory, agreementdate.pattern, agreementdate.errorMsg);
          _this.props.REMOVE_MANDATORY_LATEST('', 'agreementNo', agreementno.isMandatory, agreementno.pattern);
        }
      }

      if (field.code === 'propertyAssesmentNo') {
        if (!value) _this.setState({ enableisPropertyDependencies: true });
        else _this.setState({ enableisPropertyDependencies: false });
      }
    }
  };

  getDocuments = () => {
    var _this = this;
    let { form } = this.props;
    Api.commonApiPost(
      'tl-masters/documenttype/v2/_search',
      {
        applicationType: 'NEW',
        enabled: true,
        fallback: true,
        category: form.category,
        subCategory: form.subCategory,
      },
      {},
      false,
      true
    ).then(
      function(response) {
        _this.setState(
          {
            documentTypes: sortArrayByAlphabetically(response.documentTypes, 'name'),
          },
          _this.addMandatoryDocuments(response.documentTypes)
        );
      },
      function(err) {
        console.log(err);
      }
    );
  };

  addMandatoryDocuments = docTypes => {
    var _this = this;
    docTypes.filter(function(obj) {
      obj.mandatory ? _this.props.ADD_MANDATORY_LATEST('', obj.id, obj.mandatory, '', '') : '';
    });
  };

  customAutoCompleteKeyUpEvent = (e, field) => {
    var _this = this;
    //reset autocomplete value
    this.props.handleChange('', field.code, field.isMandatory, field.pattern, field.errorMsg || '');

    if (e.target.value && field.code === 'localityId') {
      Api.commonApiGet('/egov-location/boundarys/getLocationByLocationName', {
        locationName: e.target.value,
      }).then(
        function(response) {
          const autocompleteDataSource = _this.state.autocompleteDataSource;
          autocompleteDataSource[field.code] = response;
          _this.setState({ autocompleteDataSource });
        },
        function(err) {
          _this.handleError(err.message);
        }
      );
    }
  };

  handleError = msg => {
    let { toggleDailogAndSetText, toggleSnackbarAndSetText } = this.props;
    toggleDailogAndSetText(true, msg);
  };

  render() {
    let { setLoadingStatus, setRoute } = this.props;
    const supportDocClearActions = [
      <FlatButton label={translate('tl.confirm.title')} primary={true} keyboardFocused={true} onClick={this.handleDocumentsClearConfirm} />,
      <FlatButton label={translate('core.lbl.cancel')} primary={true} keyboardFocused={true} onClick={this.handleDocumentsClearCancel} />,
    ];

    var agreementCard = null;
    var brElement = null;

    let form = this.props.form || [];

    let { isFormValid } = this.props;

    if (!this.state['isPropertyOwner']) {
      // console.log('coming inside');
      agreementCard = (
        <NewCard
          title={translate('tl.create.licenses.groups.agreementDetails')}
          form={form}
          fields={agreementDetailsSection}
          fieldErrors={this.props.fieldErrors}
          handleChange={this.customHandleChange}
        />
      );
      brElement = <br />;
    }

    let comments = {},
      documentTypes = [...this.state.documentTypes];

    for (var i = 0; i < documentTypes.length; i++) {
      let doc = documentTypes[i];
      comments[`${doc.id}_comments`] = this.props.form[`${doc.id}_comments`];
    }

    let modifiedTradeLocationDetails = [];

    tradeLocationDetails.map(details => {
      details['isDisabled'] = false;
      if (
        (this.state.isPropertylocalityId && details.code === 'locality') ||
        (this.state.isPropertyrevenueWardId && details.code === 'revenueWard') ||
        (this.state.isPropertyadminWardId && details.code === 'adminWard') ||
        (this.state.isPropertytradeAddress && details.code === 'tradeAddress')
      )
        this.state.enableisPropertyDependencies ? (details['isDisabled'] = false) : (details['isDisabled'] = true);
    });

    modifiedTradeLocationDetails = [...tradeLocationDetails];

    return (
      <div>
        <NewCard
          title={translate('tl.create.licenses.groups.TradeOwnerDetails')}
          form={form}
          fields={tradeOwnerDetailsCardFields}
          fieldErrors={this.props.fieldErrors}
          dropdownDataSource={this.state.dropdownDataSource}
          handleChange={this.customHandleChange}
        />
        <br />
        <NewCard
          title={translate('tl.create.licenses.groups.TradeLocationDetails')}
          form={form}
          fields={modifiedTradeLocationDetails}
          fieldErrors={this.props.fieldErrors}
          autocompleteDataSource={this.state.autocompleteDataSource}
          autoCompleteKeyUp={this.customAutoCompleteKeyUpEvent}
          dropdownDataSource={this.state.dropdownDataSource}
          customSearch={this.customSearch}
          handleChange={this.customHandleChange}
        />
        <br />
        <NewCard
          title={translate('tl.create.licenses.groups.TradeDetails')}
          form={form}
          fields={tradeDetails}
          fieldErrors={this.props.fieldErrors}
          dropdownDataSource={this.state.dropdownDataSource}
          handleChange={this.customHandleChange}
        />
        <br />

        {agreementCard}
        {brElement}

        {this.state.documentTypes && this.state.documentTypes.length > 0 ? (
          <SupportingDocuments
            files={this.props.files}
            dialogOpener={this.props.toggleDailogAndSetText}
            title={translate('tl.table.title.supportDocuments')}
            docs={this.state.documentTypes}
            addFile={this.props.addFile}
            removeFile={this.props.removeFile}
            comments={comments}
            fileSectionChange={this.fileSectionChange}
          />
        ) : (
          ''
        )}

        <Dialog actions={supportDocClearActions} modal={true} open={this.state.openDocClearDialog || false}>
          {this.state.supportDocClearDialogMsg}
        </Dialog>
      </div>
    );
  }
}
