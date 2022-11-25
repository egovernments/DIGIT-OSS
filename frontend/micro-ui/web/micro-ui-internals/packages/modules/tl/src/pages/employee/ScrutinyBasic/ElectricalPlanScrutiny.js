import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { TextInput } from "@egovernments/digit-ui-react-components";
import { Upload } from "react-bootstrap-icons";

// const data = [];

const ElecticalPlan = () => {
  const [LOCNumber, setLOCNumber] = useState("");
  const [getData, setData] = useState([
    { name: "Add Layout Plan in case of Plotted colonies/ add demarcation plan in case of other than plotted", image: null },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("data===", LOCNumber);
  };
  return (
    <div style={{ marginTop: 50 }}>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <span className="surveyformfield">
              <label>LOI Number</label>
              <TextInput name="LOINumber" onChange={(e) => setLOCNumber(e.target.value)} type="text" value={LOCNumber} />
            </span>
            <div>
              <div>
                <Form.Label>
                  <b>As per the approved layout plan/building plans</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="approvedLayoutPlan"
                type="radio"
                id="default-radio"
                label="Yes"
                name="approvedLayoutPlan"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="approvedLayoutPlan"
                type="radio"
                id="default-radio"
                label="No"
                name="approvedLayoutPlan"
                inline
              ></Form.Check>
            </div>
            <div>
              <div>
                <Form.Label>
                  <b>Level of stormwater and sewer line in conformity with approved EDC infrastructure works</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="levelOfStormWater"
                type="radio"
                id="default-radio"
                label="Yes"
                name="levelOfStormWater"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="levelOfStormWater"
                type="radio"
                id="default-radio"
                label="No"
                name="levelOfStormWater"
                inline
              ></Form.Check>
            </div>
            <div>
              <div>
                <Form.Label>
                  <b>Showing the location of sewer line, and stormwater line to connect trunk water supply network</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="location"
                type="radio"
                id="default-radio"
                label="Yes"
                name="location"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="location"
                type="radio"
                id="default-radio"
                label="No"
                name="location"
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
                value="provisionOf33Kv"
                type="radio"
                id="default-radio"
                label="Yes"
                name="provisionOf33Kv"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="provisionOf33Kv"
                type="radio"
                id="default-radio"
                label="No"
                name="provisionOf33Kv"
                inline
              ></Form.Check>
            </div>
            <div>
              <div>
                <Form.Label>
                  <b>Water supply, sewer, and stormwater network connected with proposed/existing master services</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="waterSupply"
                type="radio"
                id="default-radio"
                label="Yes"
                name="waterSupply"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="waterSupply"
                type="radio"
                id="default-radio"
                label="No"
                name="waterSupply"
                inline
              ></Form.Check>
            </div>
            <div>
              <div>
                <Form.Label>
                  <b>Proposed source of water supply The capacity of UGT as per population norms</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="proposedSourceOfWaterSupply"
                type="radio"
                id="default-radio"
                label="Yes"
                name="proposedSourceOfWaterSupply"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="proposedSourceOfWaterSupply"
                type="radio"
                id="default-radio"
                label="No"
                name="proposedSourceOfWaterSupply"
                inline
              ></Form.Check>
            </div>
            <div>
              <div>
                <Form.Label>
                  <b>The capacity of ST as per population norms</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="capacityOfST"
                type="radio"
                id="default-radio"
                label="Yes"
                name="capacityOfST"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="capacityOfST"
                type="radio"
                id="default-radio"
                label="No"
                name="capacityOfST"
                inline
              ></Form.Check>
            </div>
            <div>
              <div>
                <Form.Label>
                  <b>Specifications of the public health department</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="specificationsOfThePublicHealth"
                type="radio"
                id="default-radio"
                label="Yes"
                name="specificationsOfThePublicHealth"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="specificationsOfThePublicHealth"
                type="radio"
                id="default-radio"
                label="No"
                name="specificationsOfThePublicHealth"
                inline
              ></Form.Check>
            </div>
            <div>
              <div>
                <Form.Label>
                  <b>Water supply network</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="waterSupplyNetwork"
                type="radio"
                id="default-radio"
                label="Yes"
                name="waterSupplyNetwork"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="waterSupplyNetwork"
                type="radio"
                id="default-radio"
                label="No"
                name="waterSupplyNetwork"
                inline
              ></Form.Check>
            </div>
            <div>
              <div>
                <Form.Label>
                  <b>Sewer network</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="sewerNetwork"
                type="radio"
                id="default-radio"
                label="Yes"
                name="sewerNetwork"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="sewerNetwork"
                type="radio"
                id="default-radio"
                label="No"
                name="sewerNetwork"
                inline
              ></Form.Check>
            </div>
            <div>
              <div>
                <Form.Label>
                  <b>Stormwater drainage</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="stormwaterDrainage"
                type="radio"
                id="default-radio"
                label="Yes"
                name="stormwaterDrainage"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="stormwaterDrainage"
                type="radio"
                id="default-radio"
                label="No"
                name="stormwaterDrainage"
                inline
              ></Form.Check>
            </div>
            <div>
              <div>
                <Form.Label>
                  <b>Roads network</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="roadsNetwork"
                type="radio"
                id="default-radio"
                label="Yes"
                name="roadsNetwork"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="roadsNetwork"
                type="radio"
                id="default-radio"
                label="No"
                name="roadsNetwork"
                inline
              ></Form.Check>
            </div>
            <div>
              <div>
                <Form.Label>
                  <b>Horticulture</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="horticulture"
                type="radio"
                id="default-radio"
                label="Yes"
                name="horticulture"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="horticulture"
                type="radio"
                id="default-radio"
                label="No"
                name="horticulture"
                inline
              ></Form.Check>
            </div>
            <div>
              <div>
                <Form.Label>
                  <b>Street Lightening</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="streetLightening"
                type="radio"
                id="default-radio"
                label="Yes"
                name="streetLightening"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="streetLightening"
                type="radio"
                id="default-radio"
                label="No"
                name="streetLightening"
                inline
              ></Form.Check>
            </div>
            <div>
              <div>
                <Form.Label>
                  <b>Per acre cost of internal development works</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="perAcreCostOfInternalDevelopment"
                type="radio"
                id="default-radio"
                label="Yes"
                name="perAcreCostOfInternalDevelopment"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="perAcreCostOfInternalDevelopment"
                type="radio"
                id="default-radio"
                label="No"
                name="perAcreCostOfInternalDevelopment"
                inline
              ></Form.Check>
            </div>
            <div>
              <div>
                <Form.Label>
                  <b>Self-certified drawings from chartered engineers that it is by the standard approved template</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="drawings"
                type="radio"
                id="default-radio"
                label="Yes"
                name="drawings"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="drawings"
                type="radio"
                id="default-radio"
                label="No"
                name="drawings"
                inline
              ></Form.Check>
            </div>
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
                                return indi === index ? { ...tag, image: e.target.files[0] } : { ...tag };
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

export default ElecticalPlan;
