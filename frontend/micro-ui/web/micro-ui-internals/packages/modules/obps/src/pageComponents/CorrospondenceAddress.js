import { BackButton, CardLabel, CheckBox, FormStep, TextArea, Toast } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import Timeline from "../components/Timeline";

const CorrospondenceAddress = ({ t, config, onSelect, value, userType, formData }) => {
  let validation = {};
  const onSkip = () => onSelect();
  const [Correspondenceaddress, setCorrespondenceaddress] = useState(formData?.Correspondenceaddress || formData?.formData?.Correspondenceaddress || "");
  const [isAddressSame, setisAddressSame] = useState(formData?.isAddressSame || formData?.formData?.isAddressSame || false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [isDisableForNext, setIsDisableForNext] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  let isopenlink = window.location.href.includes("/openlink/");
  const isCitizenUrl = Digit.Utils.browser.isMobile() ? true : false;

  if(isopenlink)  
  window.onunload = function () {
    sessionStorage.removeItem("Digit.BUILDING_PERMIT");
  }

  function selectChecked(e) {
    if (isAddressSame == false) {
      setisAddressSame(true);
      setCorrespondenceaddress(formData?.LicneseDetails?.PermanentAddress ? formData?.LicneseDetails?.PermanentAddress : formData?.formData?.LicneseDetails?.PermanentAddress);
    }
    else {
      Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
      setisAddressSame(false);
      setCorrespondenceaddress("");
    }
  }
  function selectCorrespondenceaddress(e) {
    setCorrespondenceaddress(e.target.value);
  }

  const goNext = () => {

    if (!(formData?.result && formData?.result?.Licenses[0]?.id)) {
      setIsDisableForNext(true);
      let payload = {
        "Licenses": [
          {
            "tradeLicenseDetail": {
              "owners": [
                {
                  "gender": formData?.LicneseDetails?.gender?.code,
                  "mobileNumber": formData?.LicneseDetails?.mobileNumber,
                  "name": formData?.LicneseDetails?.name,
                  "dob": null,
                  "emailId": formData?.LicneseDetails?.email,
                  "permanentAddress": formData?.LicneseDetails?.PermanentAddress,
                  "correspondenceAddress": Correspondenceaddress,
                  "pan":formData?.LicneseDetails?.PanNumber,
                  // "permanentPinCode": "143001"
                }
              ],
              "subOwnerShipCategory": "INDIVIDUAL",
              "tradeUnits": [
                {
                  "tradeType": formData?.LicneseType?.LicenseType?.tradeType,
                }
              ],
              "additionalDetail": {
                "counsilForArchNo": formData?.LicneseType?.ArchitectNo,
              },
              "address": {
                "city": "",
                "landmark": "",
                "pincode": ""
              },
              "institution": null,
              "applicationDocuments": null
            },
            "licenseType": "PERMANENT",
            "businessService": "BPAREG",
            "tenantId": stateId,
            "action": "NOWORKFLOW"
          }
        ]
      }

      Digit.OBPSService.BPAREGCreate(payload, tenantId)
        .then((result, err) => {
          setIsDisableForNext(false);
          let data = { result: result, formData: formData, Correspondenceaddress: Correspondenceaddress, isAddressSame: isAddressSame }
          //1, units
          onSelect("", data, "", true);

        })
        .catch((e) => {
          setIsDisableForNext(false);
          setShowToast({ key: "error" });
          setError(e?.response?.data?.Errors[0]?.message || null);
        });
    }
    else {
      formData.Correspondenceaddress = Correspondenceaddress;
      formData.isAddressSame = isAddressSame;
      onSelect("", formData, "", true);
    }
    // sessionStorage.setItem("CurrentFinancialYear", FY);
    // onSelect(config.key, { TradeName });
  };

  return (
    <React.Fragment>
      <div className={isopenlink ? "OpenlinkContainer" : ""}>

        {isopenlink && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
        <Timeline currentStep={2} flow="STAKEHOLDER" />
        <FormStep
          config={config}
          onSelect={goNext}
          onSkip={onSkip}
          t={t}
          isDisabled={isDisableForNext}
        >
          <CheckBox
            label={t("BPA_SAME_AS_PERMANENT_ADDRESS")}
            onChange={(e) => selectChecked(e)}
            //value={field.isPrimaryOwner}
            checked={isAddressSame}
            style={{ paddingBottom: "10px", paddingTop: "10px" }}
          />
          <CardLabel>{`${t("BPA_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL")}`}</CardLabel>
          <TextArea
            t={t}
            isMandatory={false}
            type={"text"}
            optionKey="i18nKey"
            name="Correspondenceaddress"
            onChange={selectCorrespondenceaddress}
            value={Correspondenceaddress}
            disable={isAddressSame}
          />
          {devTypeFlagVal === "01" &&(
                <div className="card-body">
                    <div className="form-group row mb-12">
                        {/* <label className="col-sm-3 col-form-label">Individual</label> */}
                        <div className="col-sm-12">
                        {/* <textarea type="text" className="employee-card-input" id="details" placeholder="Enter Details" /> */}
                        <table className="table table-bordered" size="sm">
                            <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Particulars of document</th>
                                <th>Details </th>
                                <th>Annexure </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td> 1 </td>
                                <td>
                                Net Worth in case of individual certified by
                                CA
                                </td>
                                <td>
                                <input
                                    type="file"
                                    name="upload"
                                    placeholder=""
                                    class="employee-card-input"
                                    onChange={(e)=>setFile({file:e.target.files[0]})}
                                />
                                </td>
                                <td align="center" size="large">
                                {/* <FileUploadIcon /> */}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>)}
                {devTypeFlagVal === "02" &&(
                <div className="card-body">
                    <div className="form-group row">
                        {/* <label className="col-sm-3 col-form-label">Company</label> */}
                        <div className="col-sm-12">
                        {/* <input type="text" className="employee-card-input" id="Email" placeholder="Enter Email" /> */}
                        <table className="table table-bordered" size="sm">
                            <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Particulars of document</th>
                                <th>Details </th>
                                <th>Annexure </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td> 1 </td>
                                <td>Balance sheet of last 3 years </td>
                                <td>
                                <input
                                    type="file"
                                    name="upload"
                                    placeholder=""
                                    class="employee-card-input"
                                    onChange={(e)=>setFile({file:e.target.files[0]})}
                                />
                               
                                </td>
                                <td align="center" size="large">
                                {/* <FileUploadIcon /> */}
                                </td>
                            </tr>
                            <tr>
                                <td> 2 </td>
                                <td>Ps-3(Representing Paid-UP capital)</td>
                                <td>
                                <input
                                    type="file"
                                    name="upload"
                                    placeholder=""
                                    class="employee-card-input"
                                    onChange={(e)=>setFile({file:e.target.files[0]})}
                                />
                                </td>
                                <td align="center" size="large">
                                {/* <FileUploadIcon /> */}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>)}
                {devTypeFlagVal === "03" &&(
                <div className="card-body">
                    <div className="form-group row">
                        {/* <label className="col-sm-3 col-form-label">LLP</label> */}
                        <div className="col-sm-12">
                        {/* <input type="text" className="employee-card-input" id="llp" placeholder="Enter Email" /> */}
                        <table className="table table-bordered" size="sm">
                            <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Particulars of document</th>
                                <th>Details </th>
                                <th>Annexure </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td> 1 </td>
                                <td>Networth of partners </td>
                                <td>
                                <input
                                    type="file"
                                    name="upload"
                                    placeholder=""
                                    class="employee-card-input"
                                    onChange={(e)=>setFile({file:e.target.files[0]})}
                                />
                                </td>
                                <td align="center" size="large">
                                {/* <FileUploadIcon /> */}
                                </td>
                            </tr>
                            <tr>
                                <td> 2 </td>
                                <td>Net worth of firm</td>
                                <td>
                                <input
                                    type="file"
                                    name="upload"
                                    placeholder=""
                                    class="employee-card-input"
                                    onChange={(e)=>setFile({file:e.target.files[0]})}
                                />
                                </td>
                                <td align="center" size="large">
                                {/* <FileUploadIcon /> */}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>)}
                {/* <div>
                    <h5 className="card-h">
                    {" "}
                    Capacity of Developer to develop a colony:
                    </h5>
                </div> */}
                <div className="card-body">
                    <p>
                    1. I/ We hereby submit the following information/ enclose the
                    relevant documents:-
                    </p>
                    <p>
                    &nbsp;&nbsp;&nbsp; (i) Whether the Developer/ group company has
                    earlier been granted permission to set up a colony under HDRU
                    Act, 1975: *{" "}
                    </p>
                    <div className="form-group">
                    <input
                        type="radio"
                        value="Yes"
                        
                        className="mx-2 mt-1"
                        onChange={handleChange}
                        
                        onClick={handleshow0}
                    />
                    <label className="m-0  mx-2" for="Yes">Yes</label>

                    <input
                        type="radio"
                        value="No"
                        
                        className="mx-2 mt-1"
                        onChange={handleChange}
                        
                        onClick={handleshow0}
                    />
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide0 === "Yes" && (
                        <div className="card-body">
                        {/* <h5 className="card-h">Add/Remove Authorized Users</h5> */}
                        <div className="table-bd">
                            <Table className="table table-bordered">
                            <thead>
                                <tr>
                                <th>S. no</th>
                                <th> Licence No / year and date of grant of licence </th>
                                <th>Name of developer *</th>
                                <th>Purpose of colony </th>
                                <th>Sector and development plan </th>
                                <th>Validity of licence including renewals if any</th>
                                {/* <th>Remove</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                (capacityDevelopColonyHdruAct.length > 0) ?
                                    capacityDevelopColonyHdruAct.map((elementInArray, input) => {
                                    return (
                                    <tr>

                                        <td>{input + 1}</td>
                                        <td>
                                            <input
                                            type="text"
                                            value={elementInArray.licenceNumber}
                                            placeholder={elementInArray.licenceNumber}
                                            class="employee-card-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                            type="text"
                                            value={elementInArray.nameOfDeveloper}
                                            placeholder={elementInArray.nameOfDeveloper}
                                            class="employee-card-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                            type="text"
                                            value={elementInArray.purposeOfColony}
                                            placeholder={elementInArray.purposeOfColony}
                                            class="employee-card-input"
                                            />
                                        </td>
                                        <td>
                                            <div className="row">
                                            <button className="btn btn-sm col-md-6">
                                                <VisibilityIcon color="info" className="icon"/>
                                            </button>
                                            <button className="btn btn-sm col-md-6">
                                                <FileDownloadIcon color="primary"  />
                                            </button>
                                            
                                            </div>
                                        </td>
                                        <td>
                                            <div className="row">
                                            <button className="btn btn-sm col-md-6">
                                                <VisibilityIcon color="info" className="icon" />
                                            </button>
                                            <button className="btn btn-sm col-md-6">
                                                <FileDownloadIcon color="primary"  />
                                            </button>
                                            
                                            </div>
                                        </td>
                                    </tr>
                                    )
                                    }) : <p>Click on Add more</p>
                                }
                            </tbody>
                            </Table>
                            <div>
                            <button
                                type="button"
                                style={{
                                float: "left",
                                backgroundColor: "#0b3629",
                                color: "white",
                                }}
                                className="btn mt-3"
                                // onClick={() => setNoOfRows(noofRows + 1)}
                                onClick={() => setmodal(true)}
                            >
                                Add More
                            </button>

                            <div>
                                <Modal
                                size="lg"
                                isOpen={modal}
                                toggle={() => setmodal(!modal)}
                                >
                                <ModalHeader
                                    toggle={() => setmodal(!modal)}
                                ></ModalHeader>

                                <ModalBody>
                                    <div className="card2">
                                    <div className="popupcard">


                                        <form className="text1">
                                        <Row>
                                            <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Licence No / year of licence</label>
                                            <input
                                                type="text"
                                                onChange={(e) => setModalLcNo(e.target.value)}
                                                placeholder=""
                                                class="employee-card-input"
                                            />
                                            </Col>
                                            <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Name of developer *</label>
                                            <input
                                                type="text"
                                                onChange={(e) => setModalDevName(e.target.value)}
                                                placeholder=""
                                                class="employee-card-input"
                                            />
                                            </Col>
                                            <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Purpose of colony</label>
                                            <input
                                                type="text"
                                                onChange={(e) => setModalPurposeCol(e.target.value)}
                                                placeholder=""
                                                class="employee-card-input"
                                            />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Sector and development plan</label>
                                            <input
                                                type="file"
                                                // onChange={(e) => setModalDevPlan(e.target.value)}
                                                onChange={(e)=>setFile({file:e.target.files[0]})}
                                                placeholder=""
                                                class="employee-card-input"
                                            />
                                            </Col>
                                            <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Validity of licence </label>
                                            <input
                                                type="file"
                                                // onChange={(e) => setModalDevValidity(e.target.value)}
                                                onChange={(e)=>setFile({file:e.target.files[0]})}
                                                placeholder=""
                                                class="employee-card-input"
                                            />
                                            </Col>

                                        </Row>
                                        </form>

                                    </div>
                                    <div className="submit-btn">
                                        <div className="form-group col-md6 mt-6">
                                        <button
                                            type="button"
                                            onClick={handleArrayValues}
                                            style={{ float: "right" }}
                                            className="btn btn-success"
                                        >
                                            Submit
                                        </button>
                                        </div>
                                    </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter
                                    toggle={() => setmodal(!modal)}
                                ></ModalFooter>
                                </Modal>
                            </div>
                            </div>

                            <br></br>
                            <br></br>
                        </div>

                        </div>
                    )}
                    </div>

                    <div className="hl"></div>
                    <p>
                    &nbsp;&nbsp;&nbsp;(ii) Licences/permissions granted to
                    Developer/ group company for development of colony under any
                    other law/Act as .
                    </p>
                    <div>
                    <div className="card-body">
                        {/* <h5 className="card-h">Add/Remove Authorized Users</h5> */}
                        <div className="table-bd">
                        <Table className="table table-bordered">
                            <thead>
                            <tr>
                                {/* <th>Add More</th> */}
                                <th>S.No</th>
                                <th>Colonies developed</th>
                                <th>Area</th>
                                <th>Purpose</th>
                                <th>Status of development</th>
                                <th>Outstanding Dues</th>
                                {/* <th>Action</th> */}
                            </tr>
                            </thead>
                            <tbody>
                            {
                                (capacityDevelopColonyLawAct.length > 0) ?
                                capacityDevelopColonyLawAct.map((elementInArray, input) => {
                                    return (
                                    <tr>
                                        <td>{input+1}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={elementInArray.coloniesDeveloped}
                                                placeholder={elementInArray.coloniesDeveloped}
                                                class="employee-card-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={elementInArray.area}
                                                placeholder={elementInArray.area}
                                                class="employee-card-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={elementInArray.purpose}
                                                placeholder={elementInArray.purpose}
                                                class="employee-card-input"
                                            />
                                        </td>
                                        <td>
                                            <div className="row">
                                                <button className="btn btn-sm col-md-6">
                                                    <VisibilityIcon color="info" className="icon" />
                                                </button>
                                                <button className="btn btn-sm col-md-6">
                                                    <FileDownloadIcon color="primary"  />
                                                </button>
                                                
                                            </div>
                                        </td>
                                        <td>
                                            <div className="row">
                                                <button className="btn btn-sm col-md-6">
                                                    <VisibilityIcon color="info" className="icon" />
                                                </button>
                                                <button className="btn btn-sm col-md-6">
                                                    <FileDownloadIcon color="primary"  />
                                                </button>
                                                
                                            </div>
                                        </td>
                                    </tr>
                                    )}
                                    ):<p>Click on add more</p>
                        }
                            </tbody>
                        </Table>
                        <div>
                            <button
                            type="button"
                            style={{
                                float: "left",
                                backgroundColor: "#0b3629",
                                color: "white",
                            }}
                            className="btn mt-3"
                            // onClick={() => setNoOfRows(noofRows + 1)}
                            onClick={() => setmodalColony(true)}
                            >
                            Add More
                            </button>

                            <div>
                            <Modal
                                size="lg"
                                isOpen={modalColony}
                                toggle={() => setmodalColony(!modalColony)}
                            >
                                <ModalHeader
                                toggle={() => setmodalColony(!modalColony)}
                                ></ModalHeader>

                                <ModalBody>
                                <div className="card2">
                                    <div className="popupcard">
                                    <form className="text1">
                                        <Row>
                                        <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Colonies developed</label>
                                            <input
                                            type="text"
                                            onChange={(e) => setColonyDev(e.target.value)}
                                            placeholder=""
                                            class="employee-card-input"
                                            />
                                        </Col>
                                        <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Area</label>
                                            <input
                                            type="number"
                                            onChange={(e) => setColonyArea(e.target.value)}
                                            placeholder=""
                                            class="employee-card-input"
                                            />
                                        </Col>
                                        <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Purpose</label>
                                            <input
                                            type="text"
                                            onChange={(e) => setColonyPurpose(e.target.value)}
                                            placeholder=""
                                            class="employee-card-input"
                                            />
                                        </Col>
                                        </Row>
                                        <Row>
                                        <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Status of development</label>
                                            <input
                                            type="file"
                                            // onChange={(e) => setColonyStatusDev(e.target.value)}
                                            onChange={(e)=>setFile({file:e.target.files[0]})}
                                            placeholder=""
                                            class="employee-card-input"
                                            />
                                        </Col>
                                        <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Outstanding Dues</label>
                                            <input
                                            type="file"
                                            // onChange={(e) => setColonyoutstandingDue(e.target.value)}
                                            onChange={(e)=>setFile({file:e.target.files[0]})}
                                            placeholder=""
                                            class="employee-card-input"
                                            />
                                        </Col>

                                        </Row>
                                    </form>

                                    </div>
                                    <div className="submit-btn">
                                    <div className="form-group col-md6 mt-6">
                                        <button
                                        type="button"
                                        style={{ float: "right" }}
                                        className="btn btn-success"
                                        onClick={handleColonyDevGrp}
                                        >
                                        Submit
                                        </button>
                                    </div>
                                    </div>
                                </div>
                                </ModalBody>
                                <ModalFooter
                                toggle={() => setmodalColony(!modalColony)}
                                ></ModalFooter>
                            </Modal>
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        </div>
                    </div>
                    </div>

                    <div className="hl"></div>
                    <p>
                    &nbsp;&nbsp;&nbsp;(iii) Whether any technical expert(s) engaged
                    </p>

                    <div className="form-group">
                    <input
                        type="radio"
                        value="Yes"
                        
                        className="mx-2 mt-1"
                        onChange={handleChange}
                        
                        onClick={handleshow1}
                    />
                    <label className="m-0  mx-2" for="Yes">Yes</label>

                    <input
                        type="radio"
                        value="No"
                        
                        className="mx-2 mt-1"
                        onChange={handleChange}
                        
                        onClick={handleshow1}
                    />
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide1 === "Yes" && (
                        <div className="row ">
                        <div className="form-group row">
                            <div className="col-sm-12">
                            <div className="table-bd">
                                <Table className="table table-bordered">
                                <thead>
                                    <tr>
                                    <th>S.No</th>
                                    <th>Professional </th>
                                    <th>Qualification</th>
                                    <th>Signature</th>
                                    <th>Annexure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td>1</td>
                                    <td>
                                        <input
                                        typr="text"
                                        onChange={(e) => setEngineerName(e.target.value)}
                                        placeholder="Name of Engineer"
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                        type="text"
                                        onChange={(e) => setEngineerQualification(e.target.value)}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>

                                    <td>
                                        <input
                                        type="file"
                                        // onChange={(e) => setEngineerSign(e.target.value)}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td align="center" size="large">
                                    <input
                                        type="file"
                                        // onChange={(e) => setEngineerDegree(e.target.value)}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>

                                    <tr>
                                    <td>2</td>
                                    <td> 
                                    <input
                                        typr="text"
                                        onChange={(e) => setArchitectName(e.target.value)}
                                        placeholder="Name of Architect"
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                        type="text"
                                        onChange={((e) => setArchitectQualification(e.target.value))}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>

                                    <td>
                                        <input
                                        type="file"
                                        // onChange={((e) => setArchitectSign(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td align="center" size="large">
                                        <input
                                        type="file"
                                        // onChange={((e) => setArchitectDegree(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>

                                    <tr>
                                    <td>3</td>
                                    <td> 
                                    <input
                                        type="text"
                                        onChange={((e) => setTownPlannerName(e.target.value))}
                                        placeholder="Name of Town Planner"
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                        type="text"
                                        onChange={((e) => setTownPlannerQualification(e.target.value))}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>

                                    <td>
                                        <input
                                        type="file"
                                        // onChange={((e) => setTownPlannerSign(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td align="center" size="large">
                                    <input
                                        type="file"
                                        // onChange={((e) => setTownPlannerDegree(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                    
                                </tbody>
                                </Table>
                            </div>
                            </div>
                        </div>
                        </div>
                    )}
                    {showhide1 === "No" && (
                        <div className="row ">
                        <div className="form-group row">
                            {/* <label className="col-sm-3 col-form-label">Company</label> */}
                            <div className="col-sm-12">
                            <div className="table-bd">
                                <Table className="table table-bordered" size="sm">
                                <thead>
                                    <tr>
                                    <th>S.No.</th>
                                    <th>Professional </th>
                                    <th> Annexure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td> 1 &nbsp;&nbsp;</td>
                                    <td>
                                        {" "}
                                        Agreement with existing colonizer/developer
                                        who has already developed a colony
                                        {/* <input
                                        type="text"
                                        onChange={((e) => setExistingDev(e.target.value))}
                                        placeholder=""
                                        /> */}
                                    </td>
                                    <td align="center" size="large">
                                    <input
                                        type="file"
                                        onChange={((e) => setExistingDevDoc(e.target.value))}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                    <tr>
                                    <td> 2&nbsp;&nbsp; </td>
                                    <td>
                                    <input
                                        type="text"
                                        onChange={((e) => setTechnicalCapacity(e.target.value))}
                                        placeholder="Technical Capacity"
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td align="center" size="large">
                                        <input
                                        type="file"
                                        onChange={((e) => setTechnicalCapacityDoc(e.target.value))}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                    <tr>
                                    <td> 3 &nbsp;&nbsp;</td>
                                    {/* <td colSpan={2}>Larry the Bird</td> */}
                                    <td>
                                        <input 
                                        type="text"
                                        placeholder="Name of Engineer"
                                        onChange={((e)=> setengineerNameN(e.target.value))}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td align="center" size="large">
                                    <input
                                        type="file"
                                        // onChange={((e) => setEngineerDocN(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                    <tr>
                                    <td> 4&nbsp;&nbsp; </td>
                                    <td>
                                    <input 
                                        type="text"
                                        placeholder="Name of Architect"
                                        onChange={((e)=> setArchitectNameN(e.target.value))}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td align="center" size="large">
                                    <input
                                        type="file"
                                        // onChange={((e) => setArchitectDocN(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                    <tr>
                                    <td> 5&nbsp;&nbsp; </td>
                                    <td>
                                        {/* <input
                                        type="text"
                                        onChange={((e) => setUplaodSpaBoard(e.target.value))} 
                                        placeholder=""
                                        class="employee-card-input"
                                        /> */}
                                        Upload SPA/GPA/ Board Resolution to sign
                                        collaboration agreement on behalf of land
                                        owner(s)
                                    </td>
                                    <td align="center" size="large">
                                        <input 
                                        type="file"
                                        class="employee-card-input"
                                        // onChange={((e)=> setUplaodSpaBoardDoc(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        />
                                    </td>
                                    </tr>
                                </tbody>
                                </Table>
                            </div>
                            </div>
                        </div>

                        {/* <input type="text" className="employee-card-input" /> */}
                        </div>
                    )}
                    </div>

                    <div className="hl"></div>
                    <p>
                    &nbsp;&nbsp;&nbsp;(iv) If director/partner of the proposed
                    developer company/firm also holds designation of
                    director/partner in any other company/firm who has already
                    obtained license(s) under act of 1975:
                    </p>

                    <div className="form-group">
                    <input
                        type="radio"
                        value="Yes"
                        
                        className="mx-2 mt-1"
                        onChange={(e)=>handleChange(e.target.value)}
                        
                        onClick={handleshow}
                    />
                    <label className="m-0  mx-2" for="Yes">Yes</label>

                    <input
                        type="radio"
                        value="No"
                        
                        className="mx-2 mt-1"
                        onChange={(e)=>handleChange(e.target.value)}
                        
                        onClick={handleshow}
                    />
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide === "Yes" && (
                        <div className="row ">
                        <div className="form-group row">
                            <div className="col-sm-12">
                            <Col xs="12" md="12" sm="12">
                                <Table className="table table-bordered" size="sm">
                                <thead>
                                    <tr>
                                    <th>S.No.</th>
                                    <th>Professional </th>
                                    <th> Annexure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td> 1 &nbsp;&nbsp;</td>
                                    <td>
                                        {" "}
                                        Agreement between the entities to provide
                                        technical assistance
                                    </td>
                                    <td align="center" size="large">
                                        <input
                                        type="file"
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                    <tr>
                                    <td> 2&nbsp;&nbsp; </td>
                                    <td>
                                        Board resolutions of authorized signatory of
                                        firm/company provided technical assistance
                                    </td>
                                    <td align="center" size="large">
                                    <input
                                        type="file"
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                </tbody>
                                </Table>
                            </Col>
                            </div>
                        </div>
                        </div>
                    )}
                    </div>

                    <div className="hl"></div>
                    <p>
                    2. In case of technical capacity sought from another
                    company/firm who has already obtained license(s) under act of
                    1975 or outside Haryana:
                    </p>
                    <div className="form-group">
                    <input
                        type="radio"
                        value="Yes"
                        
                        className="mx-2 mt-1"
                        onChange={handleChange}
                        
                        onClick={handleshow6}
                    />
                    <label className="m-0  mx-2" for="Yes">Yes</label>

                    <input
                        type="radio"
                        value="No"
                        
                        className="mx-2 mt-1"
                        onChange={handleChange}
                        
                        onClick={handleshow6}
                    />
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide6 === "Yes" && (
                        <div className="row ">
                        <div className="form-group row">
                            <div className="col-sm-12">
                            <Col xs="12" md="12" sm="12">
                                <div>
                                <Table className="table table-bordered" size="sm">
                                    <thead>
                                    <tr>
                                        <th>S.No.</th>
                                        <th>Agreement*</th>
                                        <th>Annexure </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td> 1 </td>
                                        <td> Registered and Irrevocable Agreement</td>
                                        <td align="center" size="large">
                                        <input 
                                            type="file"
                                            // onChange={((e)=> setRegisteredDoc(e.target.value))}
                                            onChange={(e)=>setFile({file:e.target.files[0]})}
                                            class="employee-card-input"
                                        />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td> 2 </td>
                                        <td>
                                        Board resolutions of authorized signatory of
                                        firm/company provided technical assistance
                                        </td>
                                        <td align="center" size="large">
                                        <input 
                                            type="file"
                                            // onChange={((e)=> setBoardDocY(e.target.value))}
                                            onChange={(e)=>setFile({file:e.target.files[0]})}
                                            class="employee-card-input"
                                        />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> 3 </td>

                                        <td>
                                        Auto populate details of earlier license(s)
                                        granted to existing developer company/firm
                                        to set up a colony under act of 1975.
                                        </td>
                                        <td align="center" size="large">
                                        <input 
                                            type="file"
                                            // onChange={((e)=> setEarlierDocY(e.target.value))}
                                            onChange={(e)=>setFile({file:e.target.files[0]})}
                                            class="employee-card-input"
                                        />
                                        </td>
                                    </tr>
                                    </tbody>{" "}
                                </Table>
                                </div>
                            </Col>
                            </div>
                        </div>
                        </div>
                    )}
                    {showhide6 === "No" && (
                        <div className="row ">
                        <div className="form-group row">
                            <div className="col-sm-12">
                            <div>
                                <Table className="table table-bordered" size="sm">
                                <thead>
                                    <tr>
                                    <th>S.No.</th>
                                    <th>Agreement*</th>
                                    <th>Annexure </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td> 1 </td>
                                    <td>
                                        Agreement between the entities to provide
                                        technical assistance
                                    </td>
                                    <td align="center" size="large">
                                        <input 
                                        type="file"
                                        // onChange={((e)=> setTechnicalAssistanceAgreementDoc(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>

                                    <tr>
                                    <td> 2 </td>
                                    <td>
                                        Board resolutions of authorized signatory of
                                        firm/company provided technical assistance
                                    </td>
                                    <td align="center" size="large">
                                    <input 
                                        type="file"
                                        // onChange={((e)=> setBoardDocN(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                    <tr>
                                    <td> 3 </td>

                                    <td>
                                        Auto populate details of earlier license(s)
                                        granted to existing developer company/firm to
                                        set up a colony under act of 1975.
                                    </td>
                                    <td align="center" size="large">
                                    <input 
                                            type="file"
                                            // onChange={((e)=> setEarlierDocN(e.target.value))}
                                            onChange={(e)=>setFile({file:e.target.files[0]})}
                                            class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                </tbody>
                                </Table>
                            </div>
                            </div>

                        </div>
                        </div>
                    )}
                    </div>
                    {/* </Col> */}
                </div>
                {/* <div className="form-group col-md2 mt-4">
                    <button 
                        className="btn btn-success" 
                        style={{ float: "right" }} 
                        >
                    Submit
                    </button>
                </div> */}
               
        </FormStep>
      </div>
      <div style={{ disabled: "true", height: "30px", width: "100%", fontSize: "14px" }}></div>
      {showToast && <Toast error={showToast?.key === "error" ? true : false} label={error} isDleteBtn={true} onClose={() => { setShowToast(null); setError(null); }} />}
    </React.Fragment>
  );
};

export default CorrospondenceAddress;