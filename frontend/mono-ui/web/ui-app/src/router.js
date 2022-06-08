import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './AuthRoute';

import Login from './components/contents/Login';
import Dashboard from './components/contents/Dashboard';
import ProfileEdit from './components/contents/settings/profileEdit';

//ADMINISTRATION
import searchUserRole from './components/contents/administration/userManagement/searchUserRole';
import updateUserRole from './components/contents/administration/userManagement/updateUserRole';

//CITIZEN SERVICES
import VisibleNewServiceRequest from './components/contents/citizenServices/VisibleNewServiceRequest';

//PGR
import grievanceCreate from './components/contents/pgr/grievanceCreate';
import grievanceView from './components/contents/pgr/grievanceView';
import grievanceSearch from './components/contents/pgr/grievanceSearch';
import ReceivingCenterCreate from './components/contents/pgr/master/receivingCenter/receivingCenterCreate';
import ViewEditReceivingCenter from './components/contents/pgr/master/receivingCenter/viewEditReceivingCenter';
import ViewReceivingCenter from './components/contents/pgr/master/receivingCenter/viewReceivingCenter';
import receivingModeCreate from './components/contents/pgr/master/receivingMode/receivingModeCreate';
import viewOrUpdateReceivingMode from './components/contents/pgr/master/receivingMode/viewOrUpdateReceivingMode';
import ServiceGroupCreate from './components/contents/pgr/master/serviceGroup/serviceGroupCreate';
import ViewEditServiceGroup from './components/contents/pgr/master/serviceGroup/viewEditServiceGroup';
import viewReceivingMode from './components/contents/pgr/master/receivingMode/viewReceivingMode';
import createRouter from './components/contents/pgr/master/router/create';
import searchRouter from './components/contents/pgr/master/router/search';
import routerGeneration from './components/contents/pgr/master/router/routerGeneration';
import BulkEscalationGeneration from './components/contents/pgr/master/escalation/bulkEscalationGeneration';
import serviceTypeCreate from './components/contents/pgr/master/serviceType/serviceTypeCreate';
import viewOrUpdateServiceType from './components/contents/pgr/master/serviceType/viewOrUpdateServiceType';
import viewServiceType from './components/contents/pgr/master/serviceType/viewServiceType';
import ViewServiceGroup from './components/contents/pgr/master/serviceGroup/viewServiceGroup';
import ViewEscalation from './components/contents/pgr/master/escalation/viewEscalation';
import DefineEscalation from './components/contents/pgr/master/escalation/defineEscalation';
import SearchEscalation from './components/contents/pgr/master/escalationTime/searchEscalation';
import DefineEscalationTime from './components/contents/pgr/master/escalationTime/defineEscalationTime';
import ServiceTypeCreate from './components/contents/pgr/master/serviceType/serviceTypeCreate';
import Report from './components/contents/reports/report';
import PGRDashboard from './components/contents/pgr/dashboards/index';
import PgrAnalytics from './components/contents/pgr/dashboards/PgrAnalytics';

//WC
// import CategoryTypeCreate from './components/contents/wc/master/categoryType/categoryTypeCreate';
// import ViewEditCategoryType from './components/contents/wc/master/categoryType/viewEditCategoryType';
// import ViewCategoryType from './components/contents/wc/master/categoryType/viewCategoryType';
//
// import WaterSourceTypeCreate from './components/contents/wc/master/waterSourceType/waterSourceTypeCreate';
// import ViewEditWaterSourceType from './components/contents/wc/master/waterSourceType/viewEditWaterSourceType';
// import ViewWaterSourceType from './components/contents/wc/master/waterSourceType/viewWaterSourceType';
//
// import SupplyTypeCreate from './components/contents/wc/master/supplyType/supplyTypeCreate';
// import ViewEditSupplyType from './components/contents/wc/master/supplyType/viewEditSupplyType';
// import ViewSupplyType from './components/contents/wc/master/supplyType/viewSupplyType';
//
// import PipeSizeCreate from './components/contents/wc/master/pipeSize/pipeSizeCreate';
// import ViewEditPipeSize from './components/contents/wc/master/pipeSize/viewEditPipeSize';
// import ViewPipeSize from './components/contents/wc/master/pipeSize/viewPipeSize';
//
// import DocumentTypeCreate from './components/contents/wc/master/documentType/documentTypeCreate';
// import ViewEditDocumentType from './components/contents/wc/master/documentType/viewEditDocumentType';
// import ViewDocumentType from './components/contents/wc/master/documentType/viewDocumentType';
//
// import DocumentTypeApplicationTypeCreate from './components/contents/wc/master/documentTypeApplicationType/documentTypeApplicationTypeCreate';
// import ViewEditDocumentTypeApplicationType from './components/contents/wc/master/documentTypeApplicationType/viewEditDocumentTypeApplicationType';
// import ViewDocumentTypeApplicationType from './components/contents/wc/master/documentTypeApplicationType/viewDocumentTypeApplicationType';
//
// import AddDemandWc from './components/contents/wc/master/addDemand';
import ViewLegacy from './components/non-framework/wc/viewLegacy';
import AddDemand from './components/contents/propertyTax/master/addDemand';

//Property tax
// import PropertyTaxSearch from './components/contents/propertyTax/master/PropertyTaxSearch';
// import Test from './components/contents/propertyTax/master/Test';
// import FloorType from './components/contents/propertyTax/master/FloorType';
// import RoofType from './components/contents/propertyTax/master/RoofType';
// import WallType from './components/contents/propertyTax/master/WallType';
// import WoodType from './components/contents/propertyTax/master/WoodType';
// import UsageType from './components/contents/propertyTax/master/UsageType';
// import PropertyType from './components/contents/propertyTax/master/PropertyType';
// import EditDemands from './components/non-framework/wc/editDemands';

// import Occupancy from './components/contents/propertyTax/master/Occupancy';
// import  from './components/contents/propertyTax/master/';
// import BuildingClassification from './components/contents/propertyTax/master/BuildingClassification';
// import CreateProperty from './components/contents/propertyTax/master/CreateProperty';
// import DataEntry from './components/contents/propertyTax/master/DataEntry';
// import ViewProperty from './components/contents/propertyTax/master/viewProperty';
// import ViewDCB from './components/non-framework/pt/viewDCB';
// import Workflow from './components/contents/propertyTax/master/workflow';
// import Acknowledgement from './components/contents/propertyTax/master/Acknowledgement';
// import DataEntryAcknowledgement from './components/contents/propertyTax/master/Acknowledgement_dataEntry';
// import DemandAcknowledgement from './components/contents/propertyTax/master/Acknowledgement_demand';
// import InboxAcknowledgement from './components/contents/propertyTax/master/Acknowledgement_inbox';

// import CreateVacantLand from'./components/contents/propertyTax/master/CreateVacantLand';
import Create from './components/framework/create';
// import CreateTwo from './components/framework/createTwo';

import PayTaxCreate from './components/non-framework/collection/master/paytax/PayTaxCreate';
import View from './components/framework/view';
import Search from './components/framework/search';
import Transaction from './components/framework/transaction';
import Inbox from './components/framework/inbox';

import createPenaltyRates from './components/non-framework/tl/masters/create/createPenaltyRates';
import updatePenaltyRates from './components/non-framework/tl/masters/update/updatePenaltyRates';
import viewPenaltyRates from './components/non-framework/tl/masters/view/viewPenaltyRates';
import penaltyRatesSearch from './components/non-framework/tl/masters/search/penaltyRatesSearch';
import penaltyRatesUpdateSearch from './components/non-framework/tl/masters/search/penaltyRatesUpdateSearch';

import createFeeMatrix from './components/non-framework/tl/masters/createFeeMatrix';
import updateFeeMatrix from './components/non-framework/tl/masters/updateFeeMatrix';
import viewFeeMatrix from './components/non-framework/tl/masters/viewFeeMatrix';

import CreateLicenseDocumentType from './components/non-framework/tl/masters/CreateLicenseDocumentType';
import UpdateSubCategory from './components/non-framework/tl/masters/update/UpdateSubCategory';
import createSubCategory from './components/non-framework/tl/masters/create/createSubCategory';
import LegacyLicenseCreate from './components/non-framework/tl/transaction/LegacyLicenseCreate';
import viewLegacyLicense from './components/non-framework/tl/transaction/viewLegacyLicense';
import LegacyLicenseSearch from './components/non-framework/tl/transaction/LegacyLicenseSearch';
import viewLicense from './components/non-framework/tl/transaction/viewLicense';
import VisibleNewTradeLicense from './components/non-framework/tl/transaction/NewTradeLicense';
import NoticeSearchLicense from './components/non-framework/tl/search/NoticeSearch';

import ReceiptView from './components/non-framework/collection/master/receipt/view';
import Employee from './components/non-framework/employee/create';
import EmployeeSearch from './components/non-framework/employee/search';
import SearchLegacyWc from './components/non-framework/wc/search';
import updateConnection from './components/non-framework/wc/connection-workflow';
import NoDues from './components/non-framework/citizenServices/NoDues';
import PayTax from './components/non-framework/citizenServices/PayTax';

import ComingSoon from './components/non-framework/citizenServices/ComingSoon.js';
import CS_WaterConnection from './components/non-framework/citizenServices/wc/create.js';
import CS_VIEW_WaterConnection from './components/non-framework/citizenServices/wc/view.js';
import ViewWc from './components/non-framework/wc/viewWc';
import ServiceRequests from './components/non-framework/citizenServices/ServiceRequestSearch.js';
import CS_FireNoc from './components/non-framework/citizenServices/buildingPlan/create.js';
import CS_VIEW_FireNoc from './components/non-framework/citizenServices/buildingPlan/view.js';
import Payment from './components/non-framework/citizenServices/payment';
import ReceiptDownload from './components/non-framework/citizenServices/ReceiptDownload.js';
import CS_TradeLicense from './components/non-framework/citizenServices/tl/create.js';
import CS_VIEW_TradeLicense from './components/non-framework/citizenServices/tl/view.js';
import CertificateView from './components/non-framework/citizenServices/SRNView.js';
import createLegacy from './components/non-framework/wc/createLegacy';

import createServiceCharge from './components/non-framework/wc/masters/serviceCharge/create';
import createWc from './components/non-framework/wc/createWc';
import createVoucher from './components/non-framework/egf/transaction/createVoucher';

import acknowledgementWc from './components/non-framework/wc/acknowledgement';
import transactionRevaluation from './components/non-framework/asset/transactionRevaluation';
import transactionTransfer from './components/non-framework/asset/transactionTransfer';
import transactionGeneral from './components/non-framework/asset/transactionGeneral';
import acknowledgeDepreciation from './components/non-framework/asset/acknowledgeDepreciation';

//Template parser
import TemplateParser from './components/framework/templates/templateParser/templateParser';

//LegalTemplate parser
import LegalTemplateParser from './components/framework/specs/lcms/templateParser/legalTemplateParser';

//Assets
import assetImmovableCreate from './components/non-framework/asset/master/assetImmovableCreate';
import assetMovableCreate from './components/non-framework/asset/master/assetMovableCreate';
import assetImmovableView from './components/non-framework/asset/master/assetImmovableView';
import assetMovableView from './components/non-framework/asset/master/assetMovableView';
import assetCategoryCreate from './components/non-framework/asset/master/assetCategoryCreate';
import assetCategorySearch from './components/non-framework/asset/master/assetCategorySearch';
import ComponentLoader from './components/framework/pure-components/ComponentLoader.js';
import assetCategoryView from './components/non-framework/asset/master/assetCategoryView';

//inventory
import SupplierSearch from './components/non-framework/inventory/master/supplier/SupplierSearch';
import MaterialStoreMappingSearch from './components/non-framework/inventory/master/materialstoremapping/MaterialStoreMappingSearch';
import IndentSearch from './components/non-framework/inventory/transaction/indent/IndentSearch';
import StoreSearch from './components/non-framework/inventory/master/store/StoreSearch';
import MaterialSearch from './components/non-framework/inventory/master/material/MaterialSearch';
import PriceListSearch from './components/non-framework/inventory/transaction/pricelist/PriceListSearch';
import MaterialReceiptNote from './components/non-framework/inventory/transaction/material-receipt-note/MaterialReceiptNote';
import SearchIndent from './components/non-framework/inventory/transaction/po/SearchIndent';
import SearchIndentMaterialIssue from './components/non-framework/inventory/transaction/materialissue/SearchIndentMaterialIssue';

import NoMatch from './components/common/NoMatch';

//works
import abstractEstimate from './components/non-framework/works/transaction/abstractEstimate/abstractEstimate';
import viewAbstractEstimate from './components/non-framework/works/transaction/abstractEstimate/viewAbstractEstimate';
import spilloverAE from './components/non-framework/works/transaction/spilloverAE/spilloverAE';
import viewSpilloverAE from './components/non-framework/works/transaction/spilloverAE/viewSpilloverAE';
import detailedEstimate from './components/non-framework/works/transaction/detailedEstimate';

import kpivalues from './components/non-framework/perfManagement/master/kpivalues';
import KPIDashboard from './components/non-framework/perfManagement/dashboard/kpi';

import MdmsComponent from './components/framework/mdms/list';

// iframe component
import IframeLoader from './components/framework/iframeloader';

const base = '';

const Main = () => {
  return (
    <main style={{ marginBottom: '50px' }}>
      <Switch>
        <Route exact path={base + '/iframeLoader'} component={IframeLoader} />
        <Route exact path={base + '/:tenantId?'} component={Login} />
        <Route exact path={base + '/service/request/search'} component={ServiceRequests} />
        <Route exact path={base + '/coming/soon'} component={ComingSoon} />
        <Route exact path={base + '/view/:moduleName/:master?/:id'} component={View} />
        <Route exact path={base + '/search/:moduleName/:master?/:action?'} component={Search} />
        <Route exact path={base + '/employee/:action/:id?'} component={Employee} />
        <Route exact path={base + '/prd/profileEdit'} component={ProfileEdit} />
        <Route exact path={base + '/prd/dashboard'} component={Dashboard} />
        <Route exact path={base + '/administration/searchUserRole'} component={searchUserRole} />
        <Route exact path={base + '/administration/updateUserRole/:userId'} component={updateUserRole} />
        <Route exact path={base + '/services/apply/:serviceCode/:serviceName'} component={VisibleNewServiceRequest} />
        <Route exact path={base + '/pgr/analytics'} component={PgrAnalytics} />
        <Route exact path={base + '/pgr/createGrievance'} component={grievanceCreate} />
        <Route exact path={base + '/pgr/viewGrievance/:srn'} component={grievanceView} />
        <Route exact path={base + '/pgr/searchGrievance'} component={grievanceSearch} />
        <Route exact name="createReceivingCenter" path={base + '/pgr/createReceivingCenter/:id?'} component={ReceivingCenterCreate} />
        <Route exact path={base + '/pgr/createReceivingCenter'} component={ReceivingCenterCreate} />
        <Route exact path={base + '/pgr/receivingCenter/view'} component={ViewEditReceivingCenter} />
        <Route exact path={base + '/pgr/receivingCenter/edit'} component={ViewEditReceivingCenter} />
        <Route exact path={base + '/pgr/viewReceivingCenter/:id'} component={ViewReceivingCenter} />
        <Route exact path={base + '/pgr/createRouter/:type/:id'} component={createRouter} />
        <Route exact path={base + '/pgr/createRouter'} component={createRouter} />
        <Route exact path={base + '/pgr/routerGeneration'} component={routerGeneration} />
        <Route exact path={base + '/pgr/searchRouter/:type'} component={searchRouter} />
        <Route exact path={base + '/pgr/receivingModeCreate'} component={receivingModeCreate} />
        <Route exact name="receivingModeCreate" path={base + '/pgr/receivingModeCreate/:type/:id'} component={receivingModeCreate} />
        <Route exact path={base + '/pgr/viewOrUpdateReceivingMode/:type'} component={viewOrUpdateReceivingMode} />
        <Route exact path={base + '/pgr/viewReceivingMode/:type/:id'} component={viewReceivingMode} />
        <Route exact name="createServiceGroup" path={base + '/pgr/updateServiceGroup/:id?'} component={ServiceGroupCreate} />
        <Route exact path={base + '/pgr/createServiceGroup'} component={ServiceGroupCreate} />
        <Route exact path={base + '/pgr/serviceGroup/view'} component={ViewEditServiceGroup} />
        <Route exact path={base + '/pgr/serviceGroup/edit'} component={ViewEditServiceGroup} />
        <Route exact path={base + '/pgr/bulkEscalationGeneration'} component={BulkEscalationGeneration} />
        <Route exact path={base + '/pgr/serviceTypeCreate'} component={serviceTypeCreate} />
        <Route exact name="serviceTypeCreate" path={base + '/pgr/serviceTypeCreate/:type/:id'} component={serviceTypeCreate} />
        <Route exact path={base + '/pgr/viewOrUpdateServiceType/:type'} component={viewOrUpdateServiceType} />
        <Route exact path={base + '/pgr/viewServiceType/:type/:id'} component={viewServiceType} />
        <Route exact path={base + '/pgr/viewServiceGroup/:id'} component={ViewServiceGroup} />
        <Route exact path={base + '/pgr/viewEscalation'} component={ViewEscalation} />
        <Route exact path={base + '/pgr/defineEscalation'} component={DefineEscalation} />
        <Route exact path={base + '/pgr/searchEscalationTime'} component={SearchEscalation} />
        <Route exact path={base + '/pgr/defineEscalationTime'} component={DefineEscalationTime} />
        <Route exact path={base + '/pgr/createServiceType'} component={ServiceTypeCreate} />
        <Route exact path={base + '/report/:moduleName/:reportName'} component={Report} />
        <Route exact path={base + '/pgr/dashboard'} component={PGRDashboard} />
        <Route exact path={base + '/component/:componentName?'} component={ComponentLoader} />
        <Route exact path={base + '/update/:moduleName/:master?/:id?'} component={Create} />
        <Route exact path={base + '/transaction/:moduleName/:page/:businessService?/:consumerCode?'} component={Transaction} />
        <Route exact path={base + '/views/:moduleName/:master?/:id'} component={Inbox} />
        <Route exact path={base + '/create/:moduleName/:master?/:id?'} component={Create} />
        <Route exact path={base + '/non-framework/tl/masters/create/createPenaltyRates'} component={createPenaltyRates} />
        <Route exact path={base + '/non-framework/tl/masters/update/updatePenaltyRates/:id'} component={updatePenaltyRates} />
        <Route exact path={base + '/non-framework/tl/masters/view/viewPenaltyRates/:id'} component={viewPenaltyRates} />
        <Route exact path={base + '/non-framework/tl/masters/search/penaltyRatesSearch'} component={penaltyRatesSearch} />
        <Route exact path={base + '/non-framework/tl/masters/search/penaltyRatesUpdateSearch'} component={penaltyRatesUpdateSearch} />
        <Route exact path={base + '/non-framework/tl/masters/createFeeMatrix'} component={createFeeMatrix} />
        <Route exact path={base + '/non-framework/tl/masters/updateFeeMatrix/:id'} component={updateFeeMatrix} />
        <Route exact path={base + '/non-framework/tl/masters/viewFeeMatrix/:id'} component={viewFeeMatrix} />
        <Route exact path={base + '/non-framework/tl/masters/CreateLicenseDocumentType'} component={CreateLicenseDocumentType} />
        <Route exact path={base + '/non-framework/tl/masters/update/UpdateSubCategory/:id'} component={UpdateSubCategory} />
        <Route exact path={base + '/non-framework/tl/masters/create/createSubCategory'} component={createSubCategory} />
        <Route exact path={base + '/non-framework/tl/transaction/LegacyLicenseCreate'} component={LegacyLicenseCreate} />
        <Route exact path={base + '/non-framework/tl/transaction/ApplyNewTradeLicense'} component={VisibleNewTradeLicense} />
        <Route exact path={base + '/non-framework/tl/transaction/LegacyLicenseSearch'} component={LegacyLicenseSearch} />
        <Route exact path={base + '/non-framework/tl/transaction/viewLegacyLicense/:licenseNumber'} component={viewLegacyLicense} />
        <Route exact path={base + '/non-framework/tl/transaction/:inbox/viewLicense/:id'} component={viewLicense} />
        <Route exact path={base + '/non-framework/tl/transaction/viewLicense/:id'} component={viewLicense} />
        <Route exact path={base + '/non-framework/tl/search/NoticeSearch'} component={NoticeSearchLicense} />
        <Route exact path={base + '/non-framework/collection/master/paytax/PayTaxCreate'} component={PayTaxCreate} />
        <Route exact path={base + '/non-framework/collection/receipt/view/:id'} component={ReceiptView} />
        <Route exact path={base + '/non-framework-cs/citizenServices/paytax/:status/:id/:paymentGateWayRes?'} component={PayTax} />
        <Route exact path={base + '/non-framework-cs/citizenServices/:moduleName/:status/:id/:paymentGateWayRes?'} component={NoDues} />
        <Route exact path={base + '/empsearch/:actionName'} component={EmployeeSearch} />
        <Route exact path={base + '/legacy/view/:id'} component={ViewLegacy} />
        {/*<Route exact path= {base+'/wc/addDemand/:upicNumber'} component={EditDemands}/>*/}
        <Route exact path={base + '/searchconnection/wc'} component={SearchLegacyWc} />
        <Route exact path={base + '/wc/application/update/:stateId'} component={updateConnection} />
        <Route exact path={base + '/waterConnection/view/:id'} component={ViewWc} />
        <Route exact path={base + '/non-framework/citizenServices/create/:status/:id/:paymentGateWayRes?'} component={CS_WaterConnection} />
        <Route exact path={base + '/non-framework/citizenServices/view/:status/:id/:ackNo/:paymentGateWayRes?'} component={CS_VIEW_WaterConnection} />
        <Route exact path={base + '/non-framework/citizenServices/fireNoc/:status/:id/:paymentGateWayRes?'} component={CS_FireNoc} />
        <Route exact path={base + '/non-framework/citizenServices/fireNoc/:status/:id/:ackNo/:paymentGateWayRes?'} component={CS_VIEW_FireNoc} />
        <Route exact path={base + '/payment/response/redirect/:msg'} component={Payment} />
        <Route exact path={base + '/receipt/:page/:type/:cc/:sid'} component={ReceiptDownload} />
        <Route exact path={base + '/non-framework/citizenServices/tl/:status/:id/:paymentGateWayRes?'} component={CS_TradeLicense} />
        <Route exact path={base + '/non-framework/citizenServices/tl/:status/:id/:ackNo/:paymentGateWayRes?'} component={CS_VIEW_TradeLicense} />
        <Route exact path={base + '/service/request/view/:srn/:isCertificate'} component={CertificateView} />
        <Route exact path={base + '/createLegacy/wc/legacy'} component={createLegacy} />
        <Route exact path={base + '/non-framework/wc/masters/serviceCharge/create'} component={createServiceCharge} />
        <Route exact path={base + '/non-framework/wc/masters/serviceCharge/update/:id'} component={createServiceCharge} />
        <Route exact path={base + '/createWc/wc'} component={createWc} />
        <Route exact path={base + '/non-framework/egf/transaction/createVoucher'} component={createVoucher} />
        <Route exact path={base + '/wc/acknowledgement/:id/:status'} component={acknowledgementWc} />
        <Route exact path={base + '/transactionRevaluation/asset/revaluationAsset'} component={transactionRevaluation} />
        <Route exact path={base + '/transactionTransfer/asset/translateAsset'} component={transactionTransfer} />
        <Route exact path={base + '/transactionTransfer/asset/generalAsset'} component={transactionGeneral} />
        <Route exact path={base + '/print/report/:templatePath'} component={TemplateParser} />
        <Route exact path={base + '/print/notice/:legalTemplatePath'} component={LegalTemplateParser} />
        //Assets
        <Route exact path={base + '/non-framework/asset/master/assetImmovableCreate/:id?'} component={assetImmovableCreate} />
        <Route exact path={base + '/non-framework/asset/master/assetMovableCreate/:id?'} component={assetMovableCreate} />
        <Route exact path={base + '/non-framework/asset/master/assetImmovableView/:id'} component={assetImmovableView} />
        <Route exact path={base + '/non-framework/asset/master/assetMovableView/:id'} component={assetMovableView} />
        <Route exact path={base + '/non-framework/asset/acknowledgeDepreciation/:id'} component={acknowledgeDepreciation} />
        <Route exact path={base + '/non-framework/asset/master/assetCategoryCreate/:id?'} component={assetCategoryCreate} />
        <Route exact path={base + '/non-framework/asset/master/assetCategorySearch'} component={assetCategorySearch} />
        <Route exact path={base + '/non-framework/asset/master/assetCategoryView/:id'} component={assetCategoryView} />
        {/* inventory */}
        <Route exact path={base + '/non-framework/inventory/master/supplier'} component={SupplierSearch} />
        <Route exact path={base + '/non-framework/inventory/master/materialstoremapping'} component={MaterialStoreMappingSearch} />
        <Route exact path={base + '/non-framework/inventory/master/store'} component={StoreSearch} />
        <Route exact path={base + '/non-framework/inventory/master/material'} component={MaterialSearch} />
        <Route exact path={base + '/non-framework/inventory/indent'} component={IndentSearch} />
        <Route exact path={base + '/non-framework/inventory/transaction/pricelist'} component={PriceListSearch} />
        <Route exact path={base + '/non-framework/inventory/transaction/materialReceiptNote'} component={MaterialReceiptNote} />
        <Route exact path={base + '/non-framework/inventory/transaction/po/searchIndent'} component={SearchIndent} />
        <Route
          exact
          path={base + '/non-framework/inventory/transaction/materialissue/SearchIndentMaterialIssue'}
          component={SearchIndentMaterialIssue}
        />
        {/* works */}
        <Route exact path={base + '/non-framework/works/transaction/:action/abstractEstimate/:code?'} component={abstractEstimate} />
        <Route exact path={base + '/non-framework/works/transaction/viewAbstractEstimate/:id'} component={viewAbstractEstimate} />
        <Route exact path={base + '/non-framework/works/transaction/:action/spilloverAE/:code?'} component={spilloverAE} />
        <Route exact path={base + '/non-framework/works/transaction/viewSpilloverAE/:id'} component={viewSpilloverAE} />
        <Route exact path={base + '/non-framework/works/transaction/detailedEstimate'} component={detailedEstimate} />
        {/* KPI */}
        <Route exact path={base + '/non-framework/perfManagement/master/kpivalues'} component={kpivalues} />
        <Route exact path={base + '/non-framework/perfManagement/dashboard/kpi'} component={KPIDashboard} />
        <Route exact path={base + '/mdms/:module/:master'} component={MdmsComponent} />
        <Route exact path={base + '/mdms/:module/:master'} component={MdmsComponent} />
        <Route component={NoMatch} />
      </Switch>
    </main>
  );
};

export default <Main />;

// {/*<Route exact path={base+'/propertyTax/CreateVacantLand'} component={CreateVacantLand}/>
// <Route exact path={base+'/propertyTax/search'} component={PropertyTaxSearch}/>
// <Route exact path={base+'/propertyTax/test'} component={Test}/>
// <Route exact path={base+'/propertyTax/floor-type'} component={FloorType}/>
// <Route exact path={base+'/propertyTax/roof-type'} component={RoofType}/>
// <Route exact path={base+'/propertyTax/wall-type'} component={WallType}/>
// <Route exact path={base+'/propertyTax/wood-type'} component={WoodType}/>
// <Route exact path={base+'/propertyTax/usage-type'} component={UsageType}/>
// <Route exact path={base+'/propertyTax/property-type'} component={PropertyType}/>
// <Route exact path={base+'/propertyTax/mutation-reason'} component={}/>
// <Route exact path={base+'/propertyTax/building-classification'} component={BuildingClassification}/>
// <Route exact path={base+'/propertyTax/create-property'} component={CreateProperty}/>
// <Route exact path={base+'/propertyTax/addDemand/:upicNumber'} component={AddDemand}/>
// <Route exact path={base+'/propertyTax/create-dataEntry'} component={DataEntry}/>
// <Route exact path={base+'/propertyTax/view-property/:searchParam/:type?'} component={ViewProperty}/>
// <Route exact path={base+'/propertyTax/view-dcb/:searchParam/:type?'} component={ViewDCB}/>
// <Route exact path={base+'/propertyTax/workflow/:searchParam/:type?'} component={Workflow}/>
// <Route exact path={base+'/propertyTax/acknowledgement'} component={Acknowledgement}/>
// <Route exact path={base+'/propertyTax/dataEntry-acknowledgement'} component={DataEntryAcknowledgement}/>
// <Route exact path={base+'/propertyTax/demand-acknowledgement'} component={DemandAcknowledgement}/>
// <Route exact path={base+'/propertyTax/inbox-acknowledgement'} component={InboxAcknowledgement}/>}
// <Route exact path= {base + '/create/:moduleName/:master?/:id?'} component={Create}/>
// {/*<Route exact path= {base + '/create/:moduleName/:master?/:id?'} component={Create}/>*/}

// <Route exact path={base+'/wc/createCategoryType'} component={CategoryTypeCreate}/>
// <Route exact name="createCategoryType" path={base+'/wc/createCategoryType/:id?'} component={CategoryTypeCreate}/>
// <Route exact path={base+'/wc/categoryType/view'} component={ViewEditCategoryType}/>
// <Route exact path={base+'/wc/categoryType/edit'} component={ViewEditCategoryType}/>
// <Route exact path={base+'/wc/viewCategoryType/:id'} component={ViewCategoryType}/>
//
//
// <Route exact path={base+'/wc/createWaterSourceType'} component={WaterSourceTypeCreate}/>
// <Route exact name="createWaterSourceType" path={base+'/wc/createWaterSourceType/:id?'} component={WaterSourceTypeCreate}/>
// <Route exact path={base+'/wc/waterSourceType/view'} component={ViewEditWaterSourceType}/>
// <Route exact path={base+'/wc/waterSourceType/edit'} component={ViewEditWaterSourceType}/>
// <Route exact path={base+'/wc/viewWaterSourceType/:id'} component={ViewWaterSourceType}/>

// <Route exact path={base+'/wc/createSupplyType'} component={SupplyTypeCreate}/>
// <Route exact name="createSupplyType" path={base+'/wc/createSupplyType/:id?'} component={SupplyTypeCreate}/>
// <Route exact path={base+'/wc/supplyType/view'} component={ViewEditSupplyType}/>
// <Route exact path={base+'/wc/supplyType/edit'} component={ViewEditSupplyType}/>
// <Route exact path={base+'/wc/viewSupplyType/:id'} component={ViewSupplyType}/>
//
// <Route exact path={base+'/wc/createPipeSize'} component={PipeSizeCreate}/>
// <Route exact name="createPipeSize" path={base+'/wc/createPipeSize/:id?'} component={PipeSizeCreate}/>
// <Route exact path={base+'/wc/pipeSize/view'} component={ViewEditPipeSize}/>
// <Route exact path={base+'/wc/pipeSize/edit'} component={ViewEditPipeSize}/>
// <Route exact path={base+'/wc/viewPipeSize/:id'} component={ViewPipeSize}/>
//
// <Route exact path={base+'/wc/createDocumentType'} component={DocumentTypeCreate}/>
// <Route exact name="createDocumentType" path={base+'/wc/createDocumentType/:id?'} component={DocumentTypeCreate}/>
// <Route exact path={base+'/wc/documentType/view'} component={ViewEditDocumentType}/>
// <Route exact path={base+'/wc/documentType/edit'} component={ViewEditDocumentType}/>
// <Route exact path={base+'/wc/documentType/:id'} component={ViewDocumentType}/>
//
// <Route exact path={base+'/wc/addDemand'} component={AddDemandWc}/>
//
// <Route exact path={base+'/wc/createDocumentTypeApplicationType'} component={DocumentTypeApplicationTypeCreate}/>
// <Route exact name="createDocumentTypeApplicationType" path={base+'/wc/createDocumentTypeApplicationType/:id?'} component={DocumentTypeApplicationTypeCreate}/>
// <Route exact path={base+'/wc/documentTypeApplicationType/view'} component={ViewEditDocumentTypeApplicationType}/>
// <Route exact path={base+'/wc/documentTypeApplicationType/edit'} component={ViewEditDocumentTypeApplicationType}/>
// <Route exact path={base+'/wc/documentTypeApplicationType/:id'} component={ViewDocumentTypeApplicationType}/>
