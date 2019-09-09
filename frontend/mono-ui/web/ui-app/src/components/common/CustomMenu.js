import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { orange500 } from 'material-ui/styles/colors';
import { logo, tenantName } from './temp/local';
import Divider from 'material-ui/Divider';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import jp from 'jsonpath';
import _ from 'lodash';
import { getTitleCase } from '../framework/utility/utility';

const menuConvention = {
  'Grievance Redressal.Grievance.Create Complaint': '/pgr/createGrievance',
  'Grievance Redressal.Grievance.Search Complaint': '/pgr/searchGrievance',

  'Grievance Redressal.Masters.Receiving Mode.Create receivingmode Master': '/pgr/receivingModeCreate',
  'Grievance Redressal.Masters.Receiving Mode.Update receivingmode Master': '/pgr/viewOrUpdateReceivingMode/update',
  'Grievance Redressal.Masters.Receiving Mode.Get all receivingmodes': '/pgr/viewOrUpdateReceivingMode/view',

  'Grievance Redressal.Masters.Grievance type.Create a Service Type': '/pgr/serviceTypeCreate',
  'Grievance Redressal.Masters.Grievance type.Update a Service Type': '/pgr/viewOrUpdateServiceType/edit',
  'Grievance Redressal.Masters.Grievance type.Search a Service Type': '/pgr/viewOrUpdateServiceType/view',

  'Grievance Redressal.Masters.Receiving Center.Create receivingcenter Master': '/pgr/createReceivingCenter',
  'Grievance Redressal.Masters.Receiving Center.Update receivingcenter Master': '/pgr/receivingCenter/edit',
  'Grievance Redressal.Masters.Receiving Center.Get all receivingcenters': '/pgr/receivingCenter/view',

  'Grievance Redressal.Masters.Router.CREATE COMPLAINT ROUTER': '/pgr/createRouter',
  'Grievance Redressal.Masters.Router.UPDATE COMPLAINT ROUTER': '/pgr/searchRouter/edit',
  'Grievance Redressal.Masters.Router.SEARCH COMPLAINT ROUTER': '/pgr/searchRouter/view',
  'Grievance Redressal.Masters.Router.Create Bulk Router': '/pgr/routerGeneration',

  'Grievance Redressal.Masters.Grievance Category.Create Service Group': '/pgr/createServiceGroup',
  'Grievance Redressal.Masters.Grievance Category.Update Service Group': '/pgr/serviceGroup/edit',
  'Grievance Redressal.Masters.Grievance Category.Search a Service Group': '/pgr/serviceGroup/view',

  'Grievance Redressal.Reports.Ageing Report': '/report/pgr/AgeingByBoundary',
  'Grievance Redressal.Reports.Drill Down Report': '/report/pgr/DrillDownByBoundary',
  'Grievance Redressal.Reports.Grievance Type Wise Report': '/report/pgr/GrievanceByType',
  'Grievance Redressal.Reports.Functionary Wise Report': '/report/pgr/GrievanceByFunctionary',
  'Grievance Redressal.Reports.Router Escalation Report': '/report/pgr/RouterEscalation',
  'Grievance Redressal.Reports.Ageing By Department Report': '/report/pgr/AgeingByDepartment',
  'Grievance Redressal.Reports.Drill Down By Department Report': '/report/pgr/DrillDownByDepartment',
  'Grievance Redressal.Reports.Complaint Summary Register Report': '/report/pgr/ComplaintSummaryRegister',

  'Collection.Collection Reports.CashCollection': '/report/collection/CashCollection',
  'Collection.Collection Reports.ReceiptRegister': '/report/collection/ReceiptRegister',
  'Collection.Collection Reports.CollectionSummaryAccountHead': '/report/collection/CollectionSummaryAccountHeadWise',
  'Collection.Collection Reports.ChequeCollection': '/report/collection/ChequeCollection',
  'Collection.Collection Reports.OnlineTransaction': '/report/collection/OnlineTransaction',

  'Collection.Collection Transactions.LegacySearchReceipt': '/report/collection/LegacyReceipt',

  'Property Tax.PTIS Reports.Demand Register': '/report/property/DemandRegister',
  'Property Tax.PTIS Reports.Collection Register': '/report/property/CollectionRegister',
  'Property Tax.PTIS Reports.Balance Register': '/report/property/BalanceRegister',
  'Property Tax.PTIS Reports.Demand Balance CollectionReport': '/report/property/DemandBalanceCollectionReport',
  'Property Tax.PTIS Reports.Assessment Register': '/report/property/AssessmentRegister',

  'Grievance Redressal.Masters.Escalation Time.Create Escalation Time Type': '/pgr/defineEscalationTime',
  'Grievance Redressal.Masters.Escalation Time.Search Escalation Time': '/pgr/searchEscalationTime',

  'Grievance Redressal.Masters.Escalation.Create Escalation': '/pgr/defineEscalation',
  // "Grievance Redressal.Masters.Escalation.Update Escalation":"",
  'Grievance Redressal.Masters.Escalation.Search Escalation': '/pgr/bulkEscalationGeneration',
  'Grievance Redressal.Dashboards.Monthly Dashboard': '/pgr/dashboard',

  'Water Charge.Water Transactions.CreateNewConnectionAPI': '/createWc/wc',
  'Water Charge.WCMS Masters.CategoryMasters.CreateCategoryMasterApi': '/create/wc/categoryType',
  'Water Charge.WCMS Masters.ConnectionSize Master.CreatePipeSizeMasterApi': '/create/wc/pipeSize',
  'Water Charge.WCMS Masters.Document Type Master.CreateDocumentTypeMasterApi': '/create/wc/documentType',
  'Water Charge.WCMS Masters.Security Deposit.CreatDonationApi': '/create/wc/donation',
  'Water Charge.WCMS Masters.TariffCategory.CreatPropertyCategoryApi': '/create/wc/propertyCategory',
  'Water Charge.WCMS Masters.TariffConnectionSize.CreatPropertyPipeSizeApi': '/create/wc/propertyPipeSize',
  'Water Charge.WCMS Masters.TariffUsage.CreatPropertyUsageApi': '/create/wc/propertyUsage',
  'Water Charge.WCMS Masters.StorageReservoir.CreatStorageReservoirApi': '/create/wc/storageReservoir',
  'Water Charge.WCMS Masters.TreatmentPlant.CreatTreatmentPlantApi': '/create/wc/treatmentPlants',
  'Water Charge.WCMS Masters.Supply Type Master.CreateSupplyTypeMasterApi': '/create/wc/supplyType',
  'Water Charge.WCMS Masters.Source Type Master.CreateSourceTypeMasterApi': '/create/wc/waterSourceType',
  'Property Tax.New Property.CreateNewProperty': '/propertyTax/create-property',
  'Property Tax.Existing Property.SearchProperty': '/propertyTax/search',
  'Property Tax.New Property.CreateDataEntryProperty': '/propertyTax/create-dataEntry',
  'Water Charge.Water Transactions.SearchWaterConnectionAPI': '/searchconnection/wc',
  'Water Charge.WCMS Masters.CategoryMasters.View Category Type': '/search/wc/categoryType/view',
  'Water Charge.WCMS Masters.CategoryMasters.Update Catgeory Type': '/search/wc/categoryType/update',
  'Water Charge.WCMS Masters.Document Type Master.SearchDocumentTypeMaster': '/search/wc/documentType/view',
  'Water Charge.WCMS Masters.Document Type Master.DocumentTypeModify': '/search/wc/documentType/update',
  'Water Charge.WCMS Masters.DocumentApplication.CreatDocumentApplicationApi': '/create/wc/documentTypeApplicationType',
  'Water Charge.WCMS Masters.DocumentApplication.ModifyDocumentApplicationApi': '/search/wc/documentTypeApplicationType/update',
  'Water Charge.WCMS Masters.DocumentApplication.SearchDocumentApplicationApi': '/search/wc/documentTypeApplicationType/view',
  'Water Charge.WCMS Masters.Security Deposit.ModifyDonationApi': '/search/wc/donation/update',
  'Water Charge.WCMS Masters.Security Deposit.SearchDonationApi': '/search/wc/donation/view',
  'Water Charge.WCMS Masters.Supply Type Master.ModifySupplyTypeMaster': '/search/wc/supplyType/update',
  'Water Charge.WCMS Masters.Supply Type Master.SearchWaterSupplyTypeMaster': '/search/wc/supplyType/view',
  'Water Charge.WCMS Masters.Source Type Master.ModifySourceTypeMaster': '/search/wc/waterSourceType/update',
  'Water Charge.WCMS Masters.Source Type Master.SearchWaterSourceTypeMaster': '/search/wc/waterSourceType/view',
  'Water Charge.WCMS Masters.TariffConnectionSize.ModifyPropertyPipeSizeApi': '/search/wc/propertyPipeSize/update',
  'Water Charge.WCMS Masters.TariffConnectionSize.SearchPropertyPipeSizeApi': '/search/wc/propertyPipeSize/view',
  'Grievance Redressal.Reports.Grievance Report': '/report/GrievanceReport',
  'Water Charge.WCMS Masters.Meter Cost Master.CreateMeterCostMaster': '/create/wc/meterCost',
  'Water Charge.WCMS Masters.Meter Cost Master.UpdateMeterCostMaster': '/search/wc/meterCost/update',
  'Water Charge.WCMS Masters.Meter Cost Master.SearchMeterCostMaster': '/search/wc/meterCost/view',

  'Water Charge.WCMS Masters.ConnectionSize Master.ModifyPipeSizeMasterApi': '/search/wc/pipeSize/update',
  'Water Charge.WCMS Masters.ConnectionSize Master.SearchPipeSizeMaster': '/search/wc/pipeSize/view',
  'Water Charge.WCMS Masters.TariffCategory.ModifyPropertyCategoryApi': '/search/wc/propertyCategory/update',
  'Water Charge.WCMS Masters.TariffCategory.SearchPropertyCategoryApi': '/search/wc/propertyCategory/view',
  'Water Charge.WCMS Masters.TariffUsage.ModifyPropertyUsageApi': '/search/wc/propertyUsage/update',
  'Water Charge.WCMS Masters.TariffUsage.SearchPropertyUsageApi': '/search/wc/propertyUsage/view',
  'Water Charge.WCMS Masters.TreatmentPlant.ModifyTreatmentPlantApi': '/search/wc/treatmentPlants/update',
  'Water Charge.WCMS Masters.TreatmentPlant.SearchTreatmentPlantApi': '/search/wc/treatmentPlants/view',
  'Water Charge.WCMS Masters.StorageReservoir.ModifyStorageReservoirApi': '/search/wc/storageReservoir/update',
  'Water Charge.WCMS Masters.StorageReservoir.SearchStorageReservoirApi': '/search/wc/storageReservoir/view',
  'Water Charge.WCMS Masters.MeterWaterRates.SearchMeterWaterRatesApi': '/search/wc/meterWaterRates/view',
  'Water Charge.WCMS Masters.MeterWaterRates.ModifyMeterWaterRatesApi': '/search/wc/meterWaterRates/update',
  'Water Charge.WCMS Masters.MeterWaterRates.CreatMeterWaterRatesApi': '/create/wc/meterWaterRates',

  'Collection.Collection Masters.Business Detail.CreateBusinessDetailMaster': '/create/collection/businessDetails',
  'Collection.Collection Masters.Business Detail.ModifyBusinessDetailMaster': '/search/collection/businessDetails/update',
  'Collection.Collection Masters.Business Detail.ViewBusinessDetailMaster': '/search/collection/businessDetails/view',
  'Collection.Collection Masters.Business Category.CreateBusinessCategoryMaster': '/create/collection/businessCategory',
  'Collection.Collection Masters.Business Category.ModifyBusinessCategoryMaster': '/search/collection/businessCategory/update',
  'Collection.Collection Masters.Business Category.ViewBusinessCategoryMaster': '/search/collection/businessCategory/view',
  'Collection.Collection Transactions.CreateReceipt': '/transaction/collection/collection',
  'Collection.Collection Transactions.SearchReceipt': '/search/collection/receipt/view',

  'Trade License.License Masters.License Category.CreateLicenseCategory': '/create/tl/CreateLicenseCategory',
  'Trade License.License Masters.License Category.ViewLicenseCategory': '/search/tl/CreateLicenseCategory/view',
  'Trade License.License Masters.License Category.ModifyLicenseCategory': '/search/tl/CreateLicenseCategory/update',

  'Trade License.License Masters.License Sub Category.CreateTLSUBCATEGORY': '/non-framework/tl/masters/create/createSubCategory',
  'Trade License.License Masters.License Sub Category.ViewTLSUBCATEGORY': '/search/tl/CreateLicenseSubCategory/view',
  'Trade License.License Masters.License Sub Category.ModifyTLSUBCATEGORY': '/search/tl/CreateLicenseSubCategory/update',

  'Trade License.License Masters.License Document Type.CreateTLDOCUMENTTYPE': '/non-framework/tl/masters/CreateLicenseDocumentType',
  'Trade License.License Masters.License Document Type.ViewTLDOCUMENTTYPE': '/search/tl/LicenseDocumentType/view',
  'Trade License.License Masters.License Document Type.ModifyTLDOCUMENTTYPE': '/search/tl/LicenseDocumentType/update',

  'Trade License.License Masters.License Unit of Measurement.CreateTLUOM': '/create/tl/UnitOfMeasurement',
  'Trade License.License Masters.License Unit of Measurement.ViewTLUOM': '/search/tl/UnitOfMeasurement/view',
  'Trade License.License Masters.License Unit of Measurement.ModifyTLUOM': '/search/tl/UnitOfMeasurement/update',

  'Trade License.License Transactions.CreateLegacyLicense': '/non-framework/tl/transaction/LegacyLicenseCreate',
  'Trade License.License Transactions.CreateNewLicense': '/non-framework/tl/transaction/ApplyNewTradeLicense',
  'Trade License.License Search.SearchLicense': '/non-framework/tl/transaction/LegacyLicenseSearch',
  'Trade License.Notice Documents.SearchNoticeUI': '/non-framework/tl/search/NoticeSearch',
  'Trade License.License Reports.License Register Report': '/report/tradelicense/licenseRegisterReport',

  'Trade License.License Masters.License Fee Matrix.CreateTLFEEMATRIX': '/non-framework/tl/masters/createFeeMatrix',
  'Trade License.License Masters.License Fee Matrix.ViewTLFEEMATRIX': '/search/tl/FeeMatrix/view',
  'Trade License.License Masters.License Fee Matrix.ModifyTLFEEMATRIX': '/search/tl/FeeMatrix/update',

  'Trade License.License Masters.License Penalty Rate.CreateTLPENALTYRATE': '/non-framework/tl/masters/create/createPenaltyRates',
  'Trade License.License Masters.License Penalty Rate.ViewTLPENALTYRATE': '/non-framework/tl/masters/search/penaltyRatesSearch',
  'Trade License.License Masters.License Penalty Rate.ModifyTLPENALTYRATE': '/non-framework/tl/masters/search/penaltyRatesUpdateSearch',

  'Water Charge.Wcms Reports.WCOutstandingReport': '/report/wcms/OutstandingRegister',
  'Water Charge.Wcms Reports.WCDemandRegister': '/report/wcms/DemandRegister',
  'Water Charge.Wcms Reports.WCDCBReport': '/report/wcms/DCBReport',
  'Water Charge.Wcms Reports.WCConsumerRegisterReport': '/report/wcms/ConsumerReport',
  'Water Charge.Water Transactions.LegacyCreateNewConnectionAPI': '/createLegacy/wc/legacy',

  //employee Master,
  // "Employee Management.Employee Masters.Position.CreatePosition":"/create/employee/createPosition",
  'Employee Management.Employee Masters.Position.CreatePosition': '/search/employee/createPosition/update',

  'Employee Management.Employee Masters.Position.UpdatePosition': '/search/employee/createPosition/update',
  'Employee Management.Employee Masters.Position.ViewPosition': '/search/employee/createPosition/view',
  'Employee Management.Employee Masters.Employee.CreateEmployee': '/employee/create',
  'Employee Management.Employee Masters.Employee.ViewEmployee': '/empsearch/view',
  'Employee Management.Employee Masters.Employee.UpdateEmployee': '/empsearch/update',
  'Employee Management.HR Report.HR Employee History Report': '/report/hr/EmployeeSearch',
  'Employee Management.HR Report.HR Attendance Report': '/report/hr/AttendenceReport',
  'Employee Management.HR Report.HR Employees Leave Report': '/report/hr/employeeLeaveReport',
  'Employee Management.HR Report.Employee without assignments': '/report/hr/employeewithoutassignments',
  'Employee Management.HR Report.Employee leave summary report': '/report/hr/employeeLeaveSummaryReport',

  //Administration
  'Administration.UpdateUserWithoutValidation': '/administration/searchUserRole',
  'Service Request.Requests.Search': '/service/request/search',
  'Water Charge.WCMS Masters.UsageType Master.CreateUsageTypeMaster': '/create/wc/usageType',
  'Water Charge.WCMS Masters.UsageType Master.UpdateUsageTypeMaster': '/search/wc/usageType/update',
  'Water Charge.WCMS Masters.UsageType Master.SearchUsageTypeMaster': '/search/wc/usageType/view',
  'Water Charge.WCMS Masters.SubUsageType Master.CreateSubUsageTypeMaster': '/create/wc/subUsageType',
  'Water Charge.WCMS Masters.SubUsageType Master.UpdateSubUsageTypeMaster': '/search/wc/subUsageType/update',
  'Water Charge.WCMS Masters.SubUsageType Master.SearchSubUsageTypeMaster': '/search/wc/subUsageType/view',

  'Water Charge.WCMS Masters.Gapcode Master.CreateGapcodeMaster': '/create/wc/gapCode',
  'Water Charge.WCMS Masters.Gapcode Master.UpdateGapcodeMaster': '/search/wc/gapCode/update',
  'Water Charge.WCMS Masters.Gapcode Master.SearchGapcodeMaster': '/search/wc/gapCode/view',
  'Water Charge.WCMS Masters.NonMeterWaterRates.CreatNonMeterWaterRatesApi': '/create/wc/nonMeterWaterRate',
  'Water Charge.WCMS Masters.NonMeterWaterRates.ModifyNonMeterWaterRatesApi': '/search/wc/nonMeterWaterRate/update',
  'Water Charge.WCMS Masters.NonMeterWaterRates.SearchNonMeterWaterRatesApi': '/search/wc/nonMeterWaterRate/view',

  'Water Charge.WCMS Masters.ServiceCharge Master.CreateServiceChargeMaster': '/non-framework/wc/masters/serviceCharge/create',
  'Water Charge.WCMS Masters.ServiceCharge Master.UpdateServiceChargeMaster': '/search/wc/serviceCharge/update',
  'Water Charge.WCMS Masters.ServiceCharge Master.SearchServiceChargeMaster': '/search/wc/serviceCharge/view',
  'Water Charge.WCMS Masters.MeterWaterRates.CreatMeterWaterRatesApi': '/create/wc/meterWaterRates',
  'Water Charge.WCMS Masters.MeterWaterRates.ModifyMeterWaterRatesApi': '/search/wc/meterWaterRates/update',
  'Water Charge.WCMS Masters.MeterWaterRates.SearchMeterWaterRatesApi': '/search/wc/meterWaterRates/view',

  'Water Charge.WCMS Masters.Meter Status Master.CreateMeterStatusMaster': '/create/wc/meterStatus',
  'Water Charge.WCMS Masters.Meter Status Master.UpdateMeterStatusMaster': '/search/wc/meterStatus/update',
  'Water Charge.WCMS Masters.Meter Status Master.SearchMeterStatusMaster': '/search/wc/meterStatus/view',
  'Water Charge.Wcms Reports.Connection Status Report': '/wcms-connection/report/_connectionstatusreport',

  // "Asset Management.Asset Masters.Asset Category.CreateAssetCategory":"/create/asset/createAssetCategroy",
  'Asset Management.Asset Masters.Asset Sub Category.CreateAssetCategory': '/non-framework/asset/master/assetCategorySearch',
  'Asset Management.Asset Masters.Asset Sub Category.ViewAssetCategory': '/non-framework/asset/master/assetCategorySearch',
  'Asset Management.Asset Masters.Asset Sub Category.ModifyAssetCategory': '/non-framework/asset/master/assetCategorySearch',
  'Asset Management.Asset Masters.Immovable Asset.CreateImmovableAsset': '/non-framework/asset/master/assetImmovableCreate',
  'Asset Management.Asset Masters.Immovable Asset.ViewImmovableAsset': '/search/asset/assetImmovable/view',
  'Asset Management.Asset Masters.Immovable Asset.ModifyImmovableAsset': '/search/asset/assetImmovable/update',
  'Asset Management.Asset Transactions.Asset Revaluation.AssetRevaluationSearchToCreate': '/transactionRevaluation/asset/revaluationAsset',
  'Asset Management.Asset Transactions.Asset Revaluation.AssetRevaluationSearchToView': '',
  'Asset Management.Asset Transactions.Transfer/Disposal of Asset.AssetSaleAndDisposalSearchToCreate': '/transactionTransfer/asset/translateAsset',
  'Asset Management.Asset Transactions.Transfer/Disposal of Asset.AssetSaleAndDisposalSearchToView': '/transactionTransfer/asset/translateAsset',
  'Asset Management.Asset Masters.Movable Asset.CreateMovableAsset': '/non-framework/asset/master/assetMovableCreate',
  'Asset Management.Asset Masters.Movable Asset.ModifyMovableAsset': '/search/asset/assetMovable/update',
  'Asset Management.Asset Masters.Movable Asset.ViewMovableAsset': '/search/asset/assetMovable/view',
  'Asset Management.Asset Transactions.Generate Depreciation': '/transactionTransfer/asset/generalAsset',

  'Asset Management.Asset Reports.AssetImmovableRegister': '/report/asset/AssetImmovableRegister',
  'Asset Management.Asset Reports.AssetMovableRegister': '/report/asset/AssetMovableRegister',
  'Asset Management.Asset Reports.AssetSchedule': '/report/asset/AssetSchedule',
  'Asset Management.Asset Reports.LandRegister': '/report/asset/LandRegister',

  //SWM

  // "Solid Waste Management.SWM Transactions.Vehicle Fuelling.VehicleFuellingDetails Create": "/create/swm/vehiclefuellingdetails",
  'Solid Waste Management.SWM Transactions.Vehicle Fuelling.VehicleFuellingDetails Create': '/search/swm/vehiclefuellingdetails/view',
  'Solid Waste Management.SWM Transactions.Vehicle Fuelling.VehicleFuellingDetails Search': '/search/swm/vehiclefuellingdetails/view',
  'Solid Waste Management.SWM Transactions.Vehicle Fuelling.VehicleFuellingDetails Update': '/search/swm/vehiclefuellingdetails/update',

  // "Solid Waste Management.SWM Masters.Vehicle.Vehicle Create": "/create/swm/vehicles",
  'Solid Waste Management.SWM Masters.Vehicle.Vehicle Create': '/search/swm/vehicles/view',
  'Solid Waste Management.SWM Masters.Vehicle.Vehicle Search': '/search/swm/vehicles/view',
  'Solid Waste Management.SWM Masters.Vehicle.Vehicle Update': '/search/swm/vehicles/update',

  // "Solid Waste Management.SWM Masters.Collection Point.CollectionPoint Create": "/create/swm/collectionpoints",
  'Solid Waste Management.SWM Masters.Collection Point.CollectionPoint Create': '/search/swm/collectionpoints/view',
  'Solid Waste Management.SWM Masters.Collection Point.CollectionPoint Search': '/search/swm/collectionpoints/view',
  'Solid Waste Management.SWM Masters.Collection Point.CollectionPoint Update': '/search/swm/collectionpoints/update',

  // "Solid Waste Management.SWM Masters.Vendor.Vendor Create": "/create/swm/vendors",
  'Solid Waste Management.SWM Masters.Vendor.Vendor Create': '/search/swm/vendors/view',
  'Solid Waste Management.SWM Masters.Vendor.Vendor Search': '/search/swm/vendors/view',
  'Solid Waste Management.SWM Masters.Vendor.Vendor Update': '/search/swm/vendors/update',

  // "Solid Waste Management.SWM Transactions.Source Segregation.SourceSegregation Create": "/create/swm/sourcesegregations",
  'Solid Waste Management.SWM Transactions.Source Segregation.SourceSegregation Create': '/search/swm/sourcesegregations/view',
  'Solid Waste Management.SWM Transactions.Source Segregation.SourceSegregation Search': '/search/swm/sourcesegregations/view',
  'Solid Waste Management.SWM Transactions.Source Segregation.SourceSegregation Update': '/search/swm/sourcesegregations/update',

  // "Solid Waste Management.SWM Masters.Vehicle Maintenance.VehicleMaintenance Create": "/create/swm/vehiclemaintenances",
  'Solid Waste Management.SWM Masters.Vehicle Maintenance.VehicleMaintenance Create': '/search/swm/vehiclemaintenances/view',
  'Solid Waste Management.SWM Masters.Vehicle Maintenance.VehicleMaintenance Search': '/search/swm/vehiclemaintenances/view',
  'Solid Waste Management.SWM Masters.Vehicle Maintenance.VehicleMaintenance Update': '/search/swm/vehiclemaintenances/update',

  // "Solid Waste Management.SWM Masters.Vendor Contract.VendorContract Create": "/create/swm/vendorcontracts",
  'Solid Waste Management.SWM Masters.Vendor Contract.VendorContract Create': '/search/swm/vendorcontracts/view',
  'Solid Waste Management.SWM Masters.Vendor Contract.VendorContract Search': '/search/swm/vendorcontracts/view',
  'Solid Waste Management.SWM Masters.Vendor Contract.VendorContract Update': '/search/swm/vendorcontracts/update',

  // "Solid Waste Management.SWM Masters.Route.Route Create": "/create/swm/routes",
  'Solid Waste Management.SWM Masters.Route.Route Create': '/search/swm/routes/view',
  'Solid Waste Management.SWM Masters.Route.Route Search': '/search/swm/routes/view',
  'Solid Waste Management.SWM Masters.Route.Route Update': '/search/swm/routes/update',

  // "Solid Waste Management.SWM Transactions.Vehicle Maintenance Details.Vehicle Maintenance Details Create": "/create/swm/vehiclemaintenancedetails",
  'Solid Waste Management.SWM Transactions.Vehicle Maintenance Details.Vehicle Maintenance Details Create':
    '/search/swm/vehiclemaintenancedetails/view',
  'Solid Waste Management.SWM Transactions.Vehicle Maintenance Details.Vehicle Maintenance Details Search':
    '/search/swm/vehiclemaintenancedetails/view',
  'Solid Waste Management.SWM Transactions.Vehicle Maintenance Details.Vehicle Maintenance Details Update':
    '/search/swm/vehiclemaintenancedetails/update',

  // "Solid Waste Management.SWM Transactions.Vehicle Schedule.VehicleSchedule Create": "/create/swm/vehicleschedules",
  'Solid Waste Management.SWM Transactions.Vehicle Schedule.VehicleSchedule Create': '/search/swm/vehicleschedules/view',
  'Solid Waste Management.SWM Transactions.Vehicle Schedule.VehicleSchedule Search': '/search/swm/vehicleschedules/view',
  'Solid Waste Management.SWM Transactions.Vehicle Schedule.VehicleSchedule Update': '/search/swm/vehicleschedules/update',

  // "Solid Waste Management.SWM Masters.Sanitation Staff Target.SanitationStaffTarget Create": "/create/swm/sanitationstafftargets",
  'Solid Waste Management.SWM Masters.Sanitation Staff Target.SanitationStaffTarget Create': '/search/swm/sanitationstafftargets/view',
  'Solid Waste Management.SWM Masters.Sanitation Staff Target.SanitationStaffTarget Search': '/search/swm/sanitationstafftargets/view',
  'Solid Waste Management.SWM Masters.Sanitation Staff Target.SanitationStaffTarget Update': '/search/swm/sanitationstafftargets/update',

  // "Solid Waste Management.SWM Masters.Refillin Pump Station.RefillinPumpStation Create": "/create/swm/refillingpumpstations",
  'Solid Waste Management.SWM Masters.Refilling Pump Station.RefillingPumpStation Create': '/search/swm/refillingpumpstations/view',
  'Solid Waste Management.SWM Masters.Refilling Pump Station.RefillingPumpStation Search': '/search/swm/refillingpumpstations/view',
  'Solid Waste Management.SWM Masters.Refilling Pump Station.RefillingPumpStation Update': '/search/swm/refillingpumpstations/update',

  // "Solid Waste Management.SWM Transactions.Vehicle Trip Sheet Details.VehicleTripSheetDetails Create": "/create/swm/vehicletripsheetdetails",
  'Solid Waste Management.SWM Transactions.Vehicle Trip Sheet Details.VehicleTripSheetDetails Create': '/search/swm/vehicletripsheetdetails/view',
  'Solid Waste Management.SWM Transactions.Vehicle Trip Sheet Details.VehicleTripSheetDetails Search': '/search/swm/vehicletripsheetdetails/view',
  'Solid Waste Management.SWM Transactions.Vehicle Trip Sheet Details.VehicleTripSheetDetails Update': '/search/swm/vehicletripsheetdetails/update',

  // "Solid Waste Management.SWM Transactions.Sanitation Staff Schedule.SanitationStaffSchedule Create": "/create/swm/sanitationstaffschedules",
  'Solid Waste Management.SWM Transactions.Sanitation Staff Schedule.SanitationStaffSchedule Create': '/search/swm/sanitationstaffschedules/view',
  'Solid Waste Management.SWM Transactions.Sanitation Staff Schedule.SanitationStaffSchedule Search': '/search/swm/sanitationstaffschedules/view',
  'Solid Waste Management.SWM Transactions.Sanitation Staff Schedule.SanitationStaffSchedule Update': '/search/swm/sanitationstaffschedules/update',

  // "Solid Waste Management.SWM Transactions.Vendor Payment Details.VendorPaymentDetails Create": "/create/swm/vendorpaymentdetails",
  'Solid Waste Management.SWM Transactions.Vendor Invoice.Vendor Invoice Create': '/search/swm/vendorpaymentdetails/view',
  'Solid Waste Management.SWM Transactions.Vendor Invoice.Vendor Invoice Search': '/search/swm/vendorpaymentdetails/view',
  'Solid Waste Management.SWM Transactions.Vendor Invoice.Vendor Invoice Update': '/search/swm/vendorpaymentdetails/update',

  'Solid Waste Management.SWM Transactions.Payment Details.PaymentDetails Create': '/search/swm/paymentvendor/view',
  'Solid Waste Management.SWM Transactions.Payment Details.PaymentDetails Search': '/search/swm/paymentvendor/view',
  'Solid Waste Management.SWM Transactions.Payment Details.PaymentDetails  Update': '/search/swm/paymentvendor/update',




  //SWM Reports
  'Solid Waste Management.SWM Reports.Dumping Ground Detail Report': '/report/swm/DumpingGroundDetailReport',
  'Solid Waste Management.SWM Reports.Expenditure Incurred On Transportation Report': '/report/swm/ExpenditureIncurredReport',

  //SWM mdms Menu
  'Solid Waste Management.SWM Masters.Vehicle type.Vehicle type': '/mdms/swm/VehicleType',
  'Solid Waste Management.SWM Masters.Waste Type.Waste Type': '/mdms/swm/WasteType',
  'Solid Waste Management.SWM Masters.Waste Sub-Type.Waste Sub-Type': '/search/swm/wastesubtype/view',
  'Solid Waste Management.SWM Masters.Shift Type.Shift Type': '/mdms/swm/ShiftType',
  'Solid Waste Management.SWM Masters.Collection type.Collection type': '/mdms/swm/CollectionType',
  'Solid Waste Management.SWM Masters.Population.Population': '/search/swm/population/view',
  //'Solid Waste Management.SWM Masters.Toilet.Toilet': '/mdms/swm/Toilet',
  'Solid Waste Management.SWM Masters.Toilet.Toilet': '/search/swm/toilet/view',
  'Solid Waste Management.SWM Masters.Shift.Shift': '/search/swm/shiftmasters/view',
  'Solid Waste Management.SWM Masters.Dumping Ground.Dumping Ground': '/search/swm/dumpingground/view',
  'Solid Waste Management.SWM Masters.Processing Site.Processing Site': '/search/swm/processingsite/view',

  //legal case
  'Legal Case Management.Legal Case Transactions.Case.Legacy Case Create': '/create/lcms/legacycase',
  'Legal Case Management.Legal Case Transactions.Case.New Case Create': '/create/lcms/summon',
  'Legal Case Management.Legal Case Transactions.Case.Case Search': '/search/lcms/summon/view',
  'Legal Case Management.Legal Case Transactions.Opinion.Opinion Create': '/create/lcms/opinion',
  'Legal Case Management.Legal Case Transactions.Opinion.Opinion Search': '/search/lcms/opinion/view',
  'Legal Case Management.Legal Case Transactions.Payment Request.AdvocatePayment Create': '/create/lcms/advocatepayment',
  'Legal Case Management.Legal Case Transactions.Payment Request.AdvocatePayment Search': '/search/lcms/advocatepayment/view',
  'Legal Case Management.Legal Case Masters.Advocate.Advocate Create': '/create/lcms/advocate',
  'Legal Case Management.Legal Case Masters.Advocate.Advocate Search': '/search/lcms/advocate/view',
  'Legal Case Management.Legal Case Masters.Advocate.Agency Search': '/search/lcms/agency/view',

  //"Legal Case Management.Legal Case Masters.Stamp/Register.Stamp/Register Create":"/search/legal/register/view",
  'Legal Case Management.Legal Case Masters.Stamp/Register.Stamp/Register Create': '/create/lcms/register',
  'Legal Case Management.Legal Case Masters.Stamp/Register.Stamp/Register Search': '/search/lcms/register/view',
  'Legal Case Management.Legal Case Masters.Stamp/Register.Stamp/Register Update': '/update/lcms/register',

  'Legal Case Management.Legal Case Transactions.Case.Search Event': '/update/lcms/eventcalendar/case',
  //legal case report
  'Legal Case Management.Legal Case Reports.Case Register Report': '/report/lcms/CaseRegisterReport',
  'Legal Case Management.Legal Case Reports.Case Summary Report': '/report/lcms/CaseSummaryReport',
  'Legal Case Management.Legal Case Reports.Case Detail Report': '/report/lcms/CaseDetailReport',
  'Legal Case Management.Legal Case Reports.Case History Report': '/report/lcms/CaseHistoryReport',
  'Legal Case Management.Legal Case Reports.Case Pendency Report': '/report/lcms/CasePendencyReport',
  'Legal Case Management.Legal Case Reports.Case Status Report': '/report/lcms/CaseStatusReport',
  'Legal Case Management.Legal Case Reports.Due Date Report': '/report/lcms/DueDateReport',
  //legal case master

  'Legal Case Management.Legal Case Masters.Court.Court': '/search/lcms/court/view',
  'Legal Case Management.Legal Case Masters.Case Type.Case Type': '/mdms/lcms/caseType',
  'Legal Case Management.Legal Case Masters.Case Category.Case Category': '/mdms/lcms/caseCategory',
  'Legal Case Management.Legal Case Masters.Bench.Bench': '/mdms/lcms/bench',
  'Legal Case Management.Legal Case Masters.Case Status.Case Status': '/mdms/lcms/casestatus',
  'Legal Case Management.Legal Case Masters.Stamp/Register.Stamp/Register': '/mdms/lcms/register',
  'Legal Case Management.Legal Case Masters.Side.Side': '/mdms/lcms/side',

  //Performance Assessment
  // "Performance Assessment.Performance Assessment Masters.PerfAssmtKpiMasterCreate":"/create/perfManagement/kpi",
  'Performance Assessment.Performance Assessment Masters.PerfAssmtKpiMasterCreate': '/search/perfManagement/kpi/update',
  'Performance Assessment.Performance Assessment Masters.PerfAssmtKpiMasterUpdate': '/search/perfManagement/kpi/update',
  'Performance Assessment.Performance Assessment Masters.PerfAssmtKpiMasterSearch': '/search/perfManagement/kpi/view',
  'Performance Assessment.Performance Assessment Actuals.PerfAssmtKpiValueUpdate': '/search/perfManagement/actualKpiUpdate/update',
  'Performance Assessment.Dashboard.PerfAssmtKpiValueCompareSearch': '/non-framework/perfManagement/dashboard/kpi',

  // "Performance Assessment.Performance Assessment Actuals.PerfAssmtKpiValueCreate":"/create/perfManagement/actualKpiCreate/",
  'Performance Assessment.Performance Assessment Actuals.PerfAssmtKpiValueCreate': '/list/perfManagement/actualKpiCreate',

  'Performance Assessment.Performance Assessment Actuals.PerfAssmtKpiValueSearch': '/non-framework/perfManagement/master/kpivalues',

  'Performance Assessment.KPI Targets.PerfAssmtKpiTargetSearch': '/search/perfManagement/kpiTarget/view',
  'Performance Assessment.Category Masters.PerfAssmtKpiCategoryMasterSearch': '/mdms/PM/KpiCategory',

  //Inventoy Service

  'Inventory.Inventory Masters.Supplier Master.Supplier Create': '/create/inventory/supplier',
  // "Inventory.Inventory Masters.Supplier Master.Supplier Create":"/search/inventory/supplier/view",
  'Inventory.Inventory Masters.Supplier Master.Supplier Search': '/search/inventory/supplier/view',
  'Inventory.Inventory Masters.Supplier Master.Supplier Update': '/search/inventory/supplier/update',

  'Inventory.Inventory Masters.Material Master.Material Create': '/search/inventory/material/view',

  'Inventory.Inventory Masters.MaterialType Master.MaterialType.MaterialType': '/search/inventory/materialtype/view',
  'Inventory.Inventory Masters.Material Store Mapping.Material Store Mapping Search': '/search/inventory/materialstoremapping/view',
  'Inventory.Inventory Masters.Material Type Store Mapping.Material Store Mapping Search': '/search/inventory/materialtypestoremapping/view',

  'Inventory.Inventory Masters.Material Master.Material Create': '/search/inventory/material/view',
  // 'Inventory.Inventory Masters.Material Master.Material Search': '/search/inventory/material/view',
  // 'Inventory.Inventory Masters.Material Master.Material Update': '/search/inventory/material/update',

  'Inventory.Inventory Masters.Store Master.Store Create': '/create/inventory/stores',
  // "Inventory.Inventory Masters.Store Master.Store Create":"/search/inventory/stores/view",
  'Inventory.Inventory Masters.Store Master.Store Search': '/search/inventory/stores/view',
  'Inventory.Inventory Masters.Store Master.Store Update': '/search/inventory/stores/update',

  'Inventory.Inventory Masters.Price List Master.PriceList Create': '/create/inventory/pricelists',
  // "Inventory.Inventory Masters.Price List Master.PriceList Create":"/search/inventory/pricelists/view",
  'Inventory.Inventory Masters.Price List Master.PriceList Search': '/search/inventory/pricelists/view',
  'Inventory.Inventory Masters.Price List Master.PriceList Update': '/search/inventory/pricelists/update',

  'Inventory.Inventory Transactions.Indent.Indent Create': '/create/inventory/indent',
  // "Inventory.Inventory Transactions.Indent.Indent Create":"/search/inventory/indent/view",
  'Inventory.Inventory Transactions.Indent.Indent Search': '/search/inventory/indent/view',
  'Inventory.Inventory Transactions.Indent.Indent Update': '/search/inventory/indent/update',

  'Inventory.Inventory Transactions.Opening Balance.Opening Balance Create': '/create/inventory/openingbalance',
  // "Inventory.Inventory Transactions.Opening Balance.Opening Balance Create" : "/search/inventory/openingbalance/update",
  'Inventory.Inventory Transactions.Opening Balance.Opening Balance Update': '/search/inventory/openingbalance/update',
  'Inventory.Inventory Transactions.Opening Balance.Opening Balance Search': '/search/inventory/openingbalance/view',

  'Inventory.Inventory Transactions.Purchase Order.Purchase Order Create': '/create/inventory/purchaseorders',
  'Inventory.Inventory Transactions.Purchase Order.Purchase Order Update': '/search/inventory/purchaseorders/update',
  'Inventory.Inventory Transactions.Purchase Order.Purchase Order Search': '/search/inventory/purchaseorders/view',
  'Inventory.Inventory Transactions.Purchase Order.Create Indent Purchase Order': '/search/inventory/indentpo/view',
  'Inventory.Inventory Transactions.Purchase Order.Create Non Indent Purchase Order': '/create/inventory/purchaseorders',

  'Inventory.Inventory Transactions.Material Issue.Material Issues Create':
    '/non-framework/inventory/transaction/materialissue/SearchIndentMaterialIssue',
  'Inventory.Inventory Transactions.Material Issue.Material Issues Update': '/search/inventory/materialissues/update',
  'Inventory.Inventory Transactions.Material Issue.Material Issues Search': '/search/inventory/materialissues/view',

  //Inventory Reports
  'Inventory.Inventory Report.Opening Balance Report': '/report/inventory/openingBalanceReport',
  'Inventory.Inventory Report.Supplier Report': '/report/inventory/supplierreport',
  'Inventory.Inventory Report.Rates Comparison With History Data': '/report/inventory/ratesComparisonWithHistory',
  'Inventory.Inventory Report.Comparison Between Different Rates': '/report/inventory/comparisonBetweenDifferentRates',
  'Inventory.Inventory Report.Material wise Purchase Order History': '/report/inventory/MaterialwisePurchaseOrderHistoryReport',
  'Inventory.Inventory Report.Supplier wise Purchase Order History': '/report/inventory/SupplierwisesPurchaseOrderHistoryReport',
  'Inventory.Inventory Report.Inventory Register Report': '/report/inventory/inventoryRegisterReport',
  //Works
  'Works Management.Abstract Estimate.Estimate Create': '/non-framework/works/transaction/create/abstractEstimate',
  'Works Management.Abstract Estimate.Estimate Search': '/search/works/abstractEstimate/view',
  'Works Management.Abstract Estimate.Spillover Abstract Estimate': '/non-framework/works/transaction/create/spilloverAE',

  'Works Management.Works Masters.Create SOR': '/search/works/scheduleofrate/view',

  'Works Management.Reports.Work Order Register': '/report/works/WorkOrderRegister',
  'Works Management.Reports.Work In Progress Register': '/report/works/WorkInProgressRegister',
  'Works Management.Reports.Project Status Report': '/report/works/ProjectStatusReport',

  //upload
  'Upload.Upload': '/iframeLoader?url=/app/v2/uploader',
  'Upload.User Jobs': '/iframeLoader?url=/app/v2/uploader/user-jobs',
};

const style = {
  display: 'inline-block',
  margin: '14px 0 16px 0',
};

const styles = {
  mainLogo: {
    height: 60,
    borderRadius: '50%',
    margin: '0 10px',
  },
  menuStyle: {
    width: '127px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
};

const Logo = props => {
  /*if(props.tenantInfo && props.tenantInfo[0] && props.tenantInfo[0].imageId) {

  } else */
  // if(props.tenantInfo.length>0 && props.tenantInfo[0].hasOwnProperty("logoId") && props.tenantInfo[0].logoId) {
  //   return (<img width="64" src={props.tenantInfo[0].logoId} style={styles.mainLogo} alt="logo"/>);
  // } else {
  //   // if(logo[getTenantId()]) {
  //   //     return (<img width="64" src={logo[getTenantId()]} style={styles.mainLogo} alt="logo"/>);
  //   // } else if(logo["default"]) {
  //   //     return (<img width="64" src={logo["default"]} style={styles.mainLogo} alt="logo"/>);
  //   // } else {
  //       return (<img width="64" src={require("../../images/headerLogo.png")} style={styles.mainLogo} alt="logo"/>);
  //   // }
  // }

  return <img width="64" src={require('../../images/headerLogo.png')} style={styles.mainLogo} alt="logo" />;
};
const getTenantId = () => {
  if (localStorage.getItem('tenantId')) {
    return localStorage.getItem('tenantId');
  }

  return window.location.hash.split('#/')[1];
};

const getTitle = (tenantInfo, tenantContext) => {
  if (tenantContext) {
    return tenantContext.name;
  } else
    return tenantInfo && tenantInfo[0] && tenantInfo[0].city && tenantInfo[0].city.name
      ? getTitleCase(tenantInfo[0].city.name)
      : tenantName[getTenantId()] || 'My City';
};

class CustomMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      menu: [],
      filterMenu: [],
      level: 0,
      parentLevel: 0,
      modules: [],
      items: [],
      path: '',
      menuItems: [],
    };
    // this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  componentWillReceiveProps() {
    //this.resetMenu();
    // console.log("HERE");
  }

  componentDidMount() {
    // document.addEventListener('mousedown', this.handleClickOutside);
    // console.log(actionList);
    // duplicteMenuItems=jp.query(actionList,'$...path');
    // console.log(duplicteMenuItems);

    this.resetMenu();
  }

  resetMenu = () => {
    let { actionList } = this.props;
    let menuItems = [];
    for (var i = 0; i < actionList.length; i++) {
      if (actionList[i].path != '') {
        let splitArray = actionList[i].path.split('.');
        if (splitArray.length > 1) {
          if (!_.some(menuItems, { name: splitArray[0] })) {
            menuItems.push({
              path: '',
              name: splitArray[0],
              url: '',
              queryParams: actionList[i].queryParams,
              orderNumber: actionList[i].orderNumber,
            });
          }
        } else {
          menuItems.push({
            path: '',
            name: actionList.displayName,
            url: actionList.url,
            queryParams: actionList[i].queryParams,
            orderNumber: actionList[i].orderNumber,
          });
        }
      }
    }

    // console.log(_.orderBy(menuItems, ['orderNumber'], ['asc']));
    this.setState({
      menuItems,
      path: '',
    });
  };

  // handleClickOutside(event) {
  //     if (this.wrapperRef && !this.wrapperRef.contains(event.target) && event.target.innerHTML != "menu") {
  //         // this.props.handleToggle(false);
  //     }
  // }

  changeModulesActions(modules, items) {
    this.setState({
      modules,
      items,
    });
  }

  handleChange = e => {
    this.setState({
      searchText: e.target.value,
    });
  };

  menuChange = (nextLevel, parentLevel) => {
    this.setState({
      level: nextLevel,
      parentLevel,
    });
  };

  menuChangeTwo = path => {
    // let tempPath=path;
    let { actionList } = this.props;
    let menuItems = [];
    for (var i = 0; i < actionList.length; i++) {
      // actionList[i].path.startsWith(path)
      if (actionList[i].path != '' && actionList[i].path.startsWith(path + '.')) {
        let splitArray = actionList[i].path.split(path + '.')[1].split('.');
        if (splitArray.length > 1) {
          if (!_.some(menuItems, { name: splitArray[0] })) {
            menuItems.push({
              path: path + '.' + splitArray[0],
              name: splitArray[0],
              url: '',
              queryParams: actionList[i].queryParams,
              orderNumber: actionList[i].orderNumber,
            });
          }
          // tempPath=path+"."+splitArray[1];
        } else {
          menuItems.push({
            path: path + '.' + splitArray[0],
            name: actionList[i].displayName,
            url: actionList[i].url,
            queryParams: actionList[i].queryParams,
            orderNumber: actionList[i].orderNumber,
          });
        }
      }
    }

    // console.log(_.orderBy(menuItems, ['orderNumber'], ['asc']));
    menuItems = _.orderBy(menuItems, ['orderNumber'], ['asc']);
    this.setState({
      menuItems,
      path,
    });
  };

  changeLevel = path => {
    let { searchText } = this.state;
    let { setRoute } = this.props;

    if (!path) {
      this.resetMenu();
      // console.log("level 0");
      setRoute('/prd/dashboard');
    } else {
      let splitArray = _.split(path, '.');
      var x = splitArray.slice(0, splitArray.length - 1).join('.');
      if (x != '' && splitArray.length > 1) {
        this.menuChangeTwo(x);
      } else {
        this.resetMenu();
      }
    }
  };

  changeRoute = route => {
    let { setRoute } = this.props;

    // setRoute("/");
    setRoute(route);
  };

  render() {
    // console.log(this.state.searchText);
    let { handleToggle, actionList } = this.props;
    let { searchText, filterMenu, level, parentLevel, modules, items, changeModulesActions, path, menuItems } = this.state;
    let { menuChange, changeLevel, menuChangeTwo, changeRoute } = this;

    const checkUrl = function(item) {
      if (item.url == '/pgr/createReceivingCenter' && window.location.href.indexOf('/pgr/createReceivingCenter') > -1) {
        window.urlCheck = true;
      }

      if (item.url == '/pgr/receivingModeCreate' && window.location.href.indexOf('/pgr/receivingModeCreate/update') > -1) {
        window.urlCheck = true;
      }

      if (item.url == '/pgr/createServiceType' && window.location.href.indexOf('/pgr/serviceTypeCreate/edit') > -1) {
        window.urlCheck = true;
      }

      if (item.url == '/pgr/createServiceGroup' && window.location.href.indexOf('/pgr/updateServiceGroup') > -1) {
        window.urlCheck = true;
      }
    };

    const showMenuTwo = () => {
      if (!_.isEmpty(menuConvention)) {
        if (searchText.length == 0) {
          return menuItems.map((item, index) => {
            if (!item.url) {
              return (
                <MenuItem
                  style={{ whiteSpace: 'initial', color: 'white' }}
                  key={index}
                  leftIcon={<i className="material-icons marginLeft">view_module</i>}
                  primaryText={
                    <div className="menuStyle" style={styles.menuStyle}>
                      <span className="onHoverText hidden-sm hidden-xs">{item.name || ''}</span>
                      <span>{item.name || ''}</span>
                    </div>
                  }
                  rightIcon={<i className="material-icons">keyboard_arrow_right</i>}
                  onTouchTap={() => {
                    menuChangeTwo(!item.path ? item.name : item.path);
                  }}
                />
              );
            } else {
              if (menuConvention && menuConvention.hasOwnProperty(item.path)) {
                // {/*<Link  key={index} to={menuConvention[item.path]} >*/}
                // {/*</Link>*/}
                return (
                  <MenuItem
                    style={{ whiteSpace: 'initial', color: 'white' }}
                    key={index}
                    onTouchTap={() => {
                      checkUrl(item);
                      document.title = item.name;
                      changeRoute(menuConvention[item.path]);
                    }}
                    leftIcon={<i className="material-icons marginLeft">view_module</i>}
                    primaryText={
                      <div className="menuStyle" style={styles.menuStyle}>
                        <span className="onHoverText hidden-sm hidden-xs">{item.name || ''}</span>
                        <span>{item.name || ''}</span>
                      </div>
                    }
                  />
                );
              } else {
                let base = '';
                if (item.path.search('Employee Management.') > -1 || item.path.search('ess.') > -1) {
                  base = window.location.origin + '/hr-web';
                  // console.log(base);
                } else if (item.path.search('Leases And Agreements.') > -1) {
                  base = window.location.origin + '/lams-web';
                } else if (item.path.search('Asset Management.') > -1) {
                  base = window.location.origin + '/asset-web';
                }
                return (
                  <a key={index} href={base + item.url + (item.queryParams != '' && item.queryParams ? '?' + item.queryParams : '')} target="_blank">
                    <MenuItem
                      style={{ whiteSpace: 'initial', color: 'white' }}
                      leftIcon={
                        <i style={{ top: '12px', margin: '0px', left: '24px' }} className="material-icons marginLeft">
                          view_module
                        </i>
                      }
                      primaryText={
                        <div className="menuStyle" style={styles.menuStyle}>
                          <span className="onHoverText hidden-sm hidden-xs">{item.name || ''}</span>
                          <span>{item.name || ''}</span>
                        </div>
                      }
                    />
                  </a>
                );
              }
            }
          });
        } else {
          return actionList.map((item, index) => {
            if (item.path && item.url && item.displayName.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
              if (menuConvention.hasOwnProperty(item.path)) {
                return (
                  <Link key={index} to={menuConvention[item.path]}>
                    <MenuItem
                      style={{ whiteSpace: 'initial', color: 'white' }}
                      onTouchTap={() => {
                        checkUrl(item);
                        document.title = item.displayName;
                      }}
                      leftIcon={<i className="material-icons marginLeft">view_module</i>}
                      primaryText={
                        <div className="menuStyle" style={styles.menuStyle}>
                          <span className="onHoverText hidden-sm hidden-xs">{item.displayName || ''}</span>
                          <span>{item.displayName || ''}</span>
                        </div>
                      }
                    />
                  </Link>
                );
              } else {
                let base = '';
                if (item.path.search('EIS.') > -1 || item.path.search('ess.') > -1) {
                  base = window.location.origin + '/hr-web';
                  // console.log(base);
                } else if (item.path.search('Leases And Agreements.') > -1) {
                  base = window.location.origin + '/lams-web';
                } else if (item.path.search('Asset Management.') > -1) {
                  base = window.location.origin + '/asset-web';
                }
                return (
                  <a key={index} href={base + item.url} target="_blank">
                    <MenuItem
                      style={{ whiteSpace: 'initial', color: 'white' }}
                      leftIcon={<i className="material-icons marginLeft">view_module</i>}
                      primaryText={
                        <div className="menuStyle" style={styles.menuStyle}>
                          <span className="onHoverText hidden-sm hidden-xs">{item.displayName || ''}</span>
                          <span>{item.displayName || ''}</span>
                        </div>
                      }
                    />
                  </a>
                );
              }
            }
          });
        }
      }
    };

    return (
      <div className="custom-menu" style={style} ref={this.setWrapperRef}>
        <Logo tenantInfo={this.props.tenantInfo} />
        <span style={{ fontSize: 15, position: 'absolute', top: '24px' }}>{getTitle(this.props.tenantInfo, this.props.tenantContext)}</span>
        <h4
          style={{
            padding: '0 15px',
            fontSize: 15,
            paddingTop: 10,
            fontWeight: 600,
          }}
        >
          Quick Actions
        </h4>
        {
          <TextField
            hintText="Search"
            onChange={this.handleChange}
            value={searchText}
            underlineFocusStyle={{ borderColor: orange500 }}
            className="searchMargin"
            inputStyle={{ color: 'white', padding: '0 25px 0 0' }}
          />
        }

        <Menu disableAutoFocus={true} desktop={true}>
          {(path || searchText) && (
            <div
              className="pull-left"
              style={{ marginLeft: 12, marginBottom: 10, cursor: 'pointer' }}
              onTouchTap={() => {
                changeLevel(path);
              }}
            >
              <i className="material-icons" style={{ color: 'white' }}>
                arrow_back
              </i>
            </div>
          )}
          {path && (
            <div
              className="pull-right"
              style={{ marginRight: 12, marginBottom: 10, cursor: 'pointer' }}
              onTouchTap={() => {
                changeLevel('');
              }}
            >
              <i className="material-icons" style={{ color: 'white' }}>
                home
              </i>
            </div>
          )}

          <div className="clearfix" />

          {showMenuTwo()}
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  menuConvention: state.common.menuConvention,
  tenantInfo: state.common.tenantInfo || [],
});
const mapDispatchToProps = dispatch => ({
  handleToggle: showMenu => dispatch({ type: 'MENU_TOGGLE', showMenu }),
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
});
export default connect(mapStateToProps, mapDispatchToProps)(CustomMenu);

/*showMenu()*/

// const showMenu=()=>{
//
//   if(searchText.length==0)
//   {
//
//     return menuItems.map((item,index)=>{
//         if (item.level==level) {
//           if (item.url) {
//             return(
//               <Link  key={index} to={item.url} >
//                 <MenuItem
//                     style={{whiteSpace: "initial"}}
//                      onTouchTap={()=>{checkUrl(item); document.title=item.name; handleToggle(false)}}
//                      leftIcon={<i className="material-icons">{item.leftIcon}</i>}
//                      primaryText={item.name}
//                   />
//               </Link>
//
//
//             )
//
//           } else {
//             return (
//                   <MenuItem
//
//                        key={index}
//                        leftIcon={<i className="material-icons">{item.leftIcon}</i>}
//                        primaryText={item.name}
//                        rightIcon={<i className="material-icons">{item.rightIcon}</i>}
//                        onTouchTap={()=>{menuChange(item.nextLevel, item.level)}}
//                     />
//                 )
//           }
//
//         }
//     })
//     return(
//       <div>
//         <MenuItem
//
//              leftIcon={<i className="material-icons">view_module</i>}
//              primaryText={menuItems.length>0?menuItems[0].title:""}
//              rightIcon={<ArrowDropRight />}
//               />
//
//         </div>
//     )
//   }
//   else {
//
//       return menuItems.map((item,index)=>{
//             if (item.url && item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
//               return(
//                 <Link   key={index} to={item.url} >
//                   <MenuItem
//                       style={{whiteSpace: "initial"}}
//                        onTouchTap={()=>{handleToggle(false)}}
//                        leftIcon={<i className="material-icons">{item.leftIcon}</i>}
//                        primaryText={item.name}
//                     />
//                 </Link>
//               )
//             }
//
//       })
//
//
//   }
// }

// console.log(actionList);
// console.log(menuItems.length>0?menuItems[0].title:"");
// const constructMenu=(items)=>{
//   // console.log(items);
//   let menu=[];
//   if (items) {
//     for (var i=0;i<items.length;i++) {
//       if (items[i].hasOwnProperty("items")) {
//         // console.log("if :");
//         // console.log(items[i]);
//         menu.push(<MenuItem
//           primaryText={items[i].name}
//           rightIcon={<ArrowDropRight />}
//           menuItems={constructMenu(items[i].items.length>0?items[i].items[0].items:[])} />)
//       }
//       else {
//         // console.log("else :");
//         // console.log(items[i]);
//         menu.push(<MenuItem primaryText={items[i].name} />)
//       }
//     }
//   }
//
//
//   return menu;
// }
// console.log(menuItems);
// console.log(parentLevel);

// componentDidUpdate()
// {
//
// }

// menuLeaves=(items)=>{
//   // console.log(items);
//   let menu=[];
//   if (items) {
//     for (var i=0;i<items.length;i++) {
//       if (items[i].hasOwnProperty("items")) {
//         // console.log("if :");
//         // console.log(items[i]);
//         this.menuLeaves(items[i].items.length>0?items[i].items[0].items:[]);
//       }
//       else {
//         // console.log("else :");
//         // console.log(items[i]);
//          menu.push(items[i]);
//
//       }
//     }
//   }
//
//   return menu;
// }
