import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { TextInput } from "@egovernments/digit-ui-react-components";
import { Upload } from "react-bootstrap-icons";

const ElectricalPlan = () => {
  const [LOCNumber, setLOCNumber] = useState("");
  const [getData, setData] = useState([
    { name: "Self-certified drawings from empanelled/certified architects that conform to the standard approved template", image: null },
    { name: "Environmental Clearance", image: null },
    { name: "PDF (OCR Compatible) + GIS format (shapefile as per the template uploaded on the department website)", image: null },
    { name: "AutoCAD (DXF) file", image: null },
    { name: "Environmental Clearance", image: null },
    { name: "Certified copy of the plan verified by a third party", image: null },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("data===", LOCNumber);
  };
  return (
    <div style={{ marginTop: 50 }}>
      <div>
        <form onSubmit={handleSubmit}>
          <span className="surveyformfield">
            <label>LOC Number</label>
            <TextInput name="LOINumber" onChange={(e) => setLOCNumber(e.target.value)} type="text" value={LOCNumber} />
          </span>
          <div>
            <div>
              <Form.Label>
                <b>Electrical infrastructure sufficient to cater for the electrical need of the project area</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
            </div>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="electricalInfrastructure"
              type="radio"
              id="default-radio"
              label="Yes"
              name="electricalInfrastructure"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="electricalInfrastructure"
              type="radio"
              id="default-radio"
              label="No"
              name="electricalInfrastructure"
              inline
            ></Form.Check>
          </div>
          <div>
            <div>
              <Form.Label>
                <b>Provision of the electricity distribution in the project area by the instructions of the DHBVN</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
            </div>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="electricityDistribution"
              type="radio"
              id="default-radio"
              label="Yes"
              name="electricityDistribution"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="electricityDistribution"
              type="radio"
              id="default-radio"
              label="No"
              name="electricityDistribution"
              inline
            ></Form.Check>
          </div>
          <div>
            <div>
              <Form.Label>
                <b>The capacity of the proposed electrical substation as per the requirement</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
            </div>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="proposedElectricalSubstation"
              type="radio"
              id="default-radio"
              label="Yes"
              name="proposedElectricalSubstation"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="proposedElectricalSubstation"
              type="radio"
              id="default-radio"
              label="No"
              name="proposedElectricalSubstation"
              inline
            ></Form.Check>
          </div>
          <div>
            <div>
              <Form.Label>
                <b>Provision of 33 Kv switching station for the electrical infrastructure as per the approved layout plan</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
            </div>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="switchingStation"
              type="radio"
              id="default-radio"
              label="Yes"
              name="switchingStation"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="switchingStation"
              type="radio"
              id="default-radio"
              label="No"
              name="switchingStation"
              inline
            ></Form.Check>
          </div>
          <div>
            <div>
              <Form.Label>
                <b>Load sanction approval as per the requirement</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
            </div>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="LoadSanctionApproval"
              type="radio"
              id="default-radio"
              label="Yes"
              name="LoadSanctionApproval"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="LoadSanctionApproval"
              type="radio"
              id="default-radio"
              label="No"
              name="LoadSanctionApproval"
              inline
            ></Form.Check>
          </div>
          <div>
            <table>
              <tr>
                <th>Sr. No.</th>
                <th>Type Of Map/Plan</th>
                <th>Annexure</th>
              </tr>
              {getData?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.name}</td>
                    <td>
                      <div class="mainWrapper">
                        <div class="btnimg">
                          <Upload class="text-success" />
                        </div>
                        <input
                          type="file"
                          name="file"
                          onChange={(e) => {
                            setData(
                              getData?.map((tag, indi) => {
                                if (indi === index) return { ...tag, image: e.target.files[0] };
                              })
                            );
                          }}
                        />
                        {item?.image?.name}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

export default ElectricalPlan;
