import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import useCustomAPIMutationHook from "../../../../libraries/src/hooks/useCustomAPIMutationHook";

 

const CreateIndividual = () => {
  const [toastMessage, setToastMessage] = useState("");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const [gender, setGender] = useState("");
  const reqCreate = {
    url: `/individual/v1/_create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

   const newConfig = [
    {
   head: "Create Individual",   
    body: [
        {
          inline: true,
          label: "Applicant Name",
          isMandatory: false,
          key: "applicantname",
          type: "text",
          disable: false,
          populators: { name: "applicantname", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "date of birth",
          isMandatory: false,
          key: "dob",
          type: "date",
          disable: false,
          populators: { name: "dob", error: "Required"},
        },
        
  
        {
          isMandatory: true,
          key: "genders",
          type: "dropdown",
          label: "Enter Gender",
          disable: false,
          populators: {
            name: "genders",
            optionsKey: "name",
            error: "required ",
            mdmsConfig: {
              masterName: "GenderType",
              moduleName: "common-masters",
              localePrefix: "COMMON_GENDER",
            },
          },
        },
        
        {
          label: "Phone number",
          isMandatory: true,
          key: "phno",
          type: "number",
          disable: false,
          populators: { name: "phno", error: "Required", validation: { min: 0, max: 9999999999 } },
        },
      ],
    },
    {
      head: "Residential Details",
      body: [
        {
          inline: true,
          label: "Pincode",
          isMandatory: true,
          key: "pincode",
          type: "number",
          disable: false,
          populators: { name: "pincode", error: "Required " },
        },
        {
          inline: true,
          label: "City",
          isMandatory: true,
          key: "city",
          type: "text",
          disable: false,
          populators: { name: "city", error: " Required ", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          isMandatory: false,
          key: "locality",
          type: "dropdown",
          label: "Enter locality",
          disable: false,
          populators: {
            name: "locality",
            optionsKey: "name",
            error: " Required",
            required: true,
            
            options: [
              {
                  "code": "SUN01",
                  "name": "Ajit Nagar - Area1",
                  "label": "Locality",
                  "latitude": "31.63089",
                  "longitude": "74.871552",
                  "area": "Area1",
                  "pincode": [
                      143001
                  ],
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN02",
                  "name": "Back Side 33 KVA Grid Patiala Road",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area1",
                  "pincode": [
                      143001
                  ],
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN03",
                  "name": "Bharath Colony",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area1",
                  "pincode": [
                      143001
                  ],
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN10",
                  "name": "Backside Brijbala Hospital - Area3",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area3",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN11",
                  "name": "Bigharwal Chowk to Railway Station - Area2",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area2",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN12",
                  "name": "Chandar Colony Biggarwal Road - Area2",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area2",
                  "pincode": [
                      143001
                  ],
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN20",
                  "name": "Aggarsain Chowk to Mal Godown - Both Sides - Area3",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area3",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN21",
                  "name": "ATAR SINGH COLONY - Area2",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area2",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN22",
                  "name": "Back Side Naina Devi Mandir - Area2",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area2",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN30",
                  "name": "Bakhtaur Nagar - Area1",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area1",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN31",
                  "name": "Bhai Mool Chand Sahib Colony - Area1",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area1",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN32",
                  "name": "College Road (Southern side) - Area2",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area2",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              },
              {
                  "code": "SUN33",
                  "name": "Ekta Colony (Southern Side) - Area1",
                  "label": "Locality",
                  "latitude": null,
                  "longitude": null,
                  "area": "Area1",
                  "pincode": null,
                  "boundaryNum": 1,
                  "children": []
              }
          ],
          },
        },
  
        {
          inline: true,
          label: "Street",
          isMandatory: false,
          key: "street",
          type: "text",
          disable: false,
          populators: { name: "street", error: "Required ", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Door Number",
          isMandatory: true,
          key: "doorno",
          type: "number",
          disable: false,
          populators: { name: "doorno", error: " Required ", validation: { min: 0, max: 9999999999 } },
        },
        {
          inline: true,
          label: "Landmark",
          isMandatory: false,
          key: "landmark",
          type: "text",
          disable: false,
          populators: { name: "landmark", error: " Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
      ],
    },
  ];

  const mutation = useCustomAPIMutationHook(reqCreate);

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  
  const onSubmit = async(data) => {
    console.log(data, "data");
    setToastMessage("Form submitted successfully!");
    await mutation.mutate(
      {
        url: `/individual/v1/_create`,
        params: { tenantId: "pg.citya" },
        body: {
          Individual: {
            tenantId: "pg.citya",
            name: {
              givenName: data.applicantname,
            },
            dateOfBirth: null,
            gender: data.genders.code,
            mobileNumber: data.phno,
            address: [
              {
                tenantId: "pg.citya",
                pincode: data.pincode,
                city: data.city,
                street: data.street,
                doorNo: data.doorno,
                "locality":
                {
                  "code" : data.locality.code,
                },
                landmark: data.landmark,
                "type": "PERMANENT"
              },
            ],
            identifiers: null,
            skills: [
                {
                    "type": "DRIVING",
                    "level": "UNSKILLED"
                }
            ],
            "photograph": null,
            additionalFields: {
                "fields": [
                    {
                        "key": "EMPLOYER",
                        "value": "ULB"
                    }
                ]
            },
            isSystemUser: null,
            userDetails: {
                "username": "8821243212",
                "tenantId": "pg.citya",
                "roles": [
                    {
                        "code": "SANITATION_WORKER",
                        "tenantId": "pg.citya"
                    }
                ],
                "type": "CITIZEN"
            },
        },
      },
        config: {
          enable: true,
        },
      },
    );

    const configs = newConfig;

  };

  return (
    <div>
      <h1> Create Individual</h1>
      <FormComposerV2
        label={t("Submit")}
        config={newConfig.map((config) => {
          return {
            ...config,
            
          
          };
        })}
        defaultValues={{}}
        onSubmit={(data,) => onSubmit(data, )}
        fieldStyle={{ marginRight: 0 }}
        
      />
        {/* Toast Component */}
        {toastMessage && (
        <div style={{ backgroundColor: "lightblue", padding: "10px", borderRadius: "5px", marginTop: "10px" }}>
          <div>{toastMessage}</div>
        </div>
      )}
    </div>
  );
}

export default CreateIndividual;
