const PropertyItems = [
  {
    heading: "Property Address",
    iconAction: "action",
    iconName: "home",
    items: [
      {
        key: " House No:",
        value: "E2/14",
      },
      {
        key: "Street Name:",
        value: "Kandwa Road",
      },
      {
        key: "Pincode:",
        value: "560098",
      },

      {
        key: "Colony Name:",
        value: "Salunke Vihar",
      },
      {
        key: "Mohalla:",
        value: "Harinagar",
      },
      {
        key: "Property ID:",
        value: "XC-345-76",
      },
    ],
  },
  {
    heading: "PT_ASSESMENT_INFO_SUB_HEADER",
    iconAction: "action",
    iconName: "assignment",
    showTable: true,
    items: {
      header: ["Floor:", "Usage Type:", "Sub Usage Type:", "Occupancy:", "Built Area/Total Annual Rent:"],
      values: [
        { value: ["Ground Floor", "Commercial", "Grocery Store", "Rented", "INR 10,000"] },
        { value: ["First Floor", "Residential", "Residential", "Self-Occupied", "200 sq ft"] },
        { value: ["Second Floor", "Grocery Store", "Residential", "Rented", "200 sq ft"] },
      ],
    },
  },
  {
    heading: "Ownership Information",
    iconAction: "social",
    iconName: "person",
    nestedItems: true,
    items: [
      {
        items: [
          {
            key: " House No:",
            value: "E2/14",
          },
          {
            key: "Street Name:",
            value: "Kandwa Road",
          },
          {
            key: "Pincode:",
            value: "560098",
          },
          {
            key: "Colony Name:",
            value: "Salunke Vihar",
          },
          {
            key: "Mohalla:",
            value: "Harinagar",
          },
          {
            key: "Property ID:",
            value: "XC-345-76",
          },
        ],
      },
      {
        items: [
          {
            key: " House No:",
            value: "E2/14",
          },
          {
            key: "Street Name:",
            value: "Kandwa Road",
          },
          {
            key: "Pincode:",
            value: "560098",
          },
          {
            key: "Colony Name:",
            value: "Salunke Vihar",
          },
          {
            key: "Mohalla:",
            value: "Harinagar",
          },
          {
            key: "Property ID:",
            value: "XC-345-76",
          },
        ],
      },
    ],
  },
];

export default PropertyItems;
