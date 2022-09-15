export const newConfig =[
    {
        "head": "Birth-Details",
        "body": [
         
            {
                type: "component",
                component: "BrSelectName",
                key: "BrSelectName",
                withoutLabel: true,
              },
              {
                type: "component",
                component: "BRSelectGender",
                key: "BRSelectGender",
                withoutLabel: true,
              },
              
          
        ]
    },

           {
            head: "Father Details",
            body: [
                {
                    component: "BrSelectFather",
                    withoutLabel: true,
                    key: "BrSelectFather",
                    type: "component"
                },
                {
                  type: "component",
                  component: "BrSelectPhoneNumber",
                  key: "BrSelectPhoneNumber",
                  withoutLabel: true,
                },
                   {
                type: "component",
                component: "BrSelectAddress",
                key: "BrSelectAddress",
                withoutLabel: true,
              },
              {
                type: "component",
                component: "SelectCorrespondenceAddress",
                key: "SelectCorrespondenceAddress",
                withoutLabel: true,
              },
              {
                type: "component",
                component: "BRSelectEmailId",
                key: "BRSelectEmailId",
                withoutLabel: true,
              },
            ]
        },

        {
          head: "Mother Details",
          body: [
              {
                  component: "BrSelectMother",
                  withoutLabel: true,
                  key: "BrSelectMother",
                  type: "component"
              },
              {
                type: "component",
                component: "BrSelectMotherPhone",
                key: "BrSelectMotherPhone",
                withoutLabel: true,
              },
           
          ]
      },

    

      
];