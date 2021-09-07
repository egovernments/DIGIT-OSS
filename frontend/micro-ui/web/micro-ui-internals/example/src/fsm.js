const fsmCustomizations = {
  getEmployeeApplicationCustomization: (config, t) => {
    const employeeConfig = [
      {
        name: "applicationDetails",
        // fields: ["sanitationType", "applicationChannel"],
        // fieldsOrder: {sanitationType: 0, applicationChannel: 1}, // TODO
        allFields: true, // for example: If in applicationDetails you have 10 fields and in fieldsOrder you only enter 3 fields name then on browser you will only see 3 fields in that order but if you want to see rest of 7 fields at the bottom.
        // removeFields: ["applicantName"], // type the name of the field in camelCase to remove it
        addFields: [
          // by default all the custom fields will add at the bottom, you can add "field name" to "fieldsOrder" if you want them in your custom order.
          {
            name: "example",
            label: t("EXAMPLE"),
            type: "text",
            isMandatory: true,
            populators: {
              name: "example",
              validation: {
                required: true,
                pattern: /[A-Za-z]/,
              },
            },
          },
        ],
      },
    ];

    return {
      config: employeeConfig,
      defaultConfig: true, // You want to use defaultConfig and you only want to update one field section. The above employeeConfig is also an order for all the field section. So if defaultConfig is false then on browser you will only see those field section who are inside employeeConfig
    };
  },
};

const fsmComponents = {};

export { fsmCustomizations, fsmComponents };
