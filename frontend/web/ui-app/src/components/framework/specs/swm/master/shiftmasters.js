var dat = {
    'swm.search': {
      // beforeSubmit:
      // `
      // if(formData.code !== undefined){
      //   for(var i=0; i<dropDownData.code.length; i++){
      //     if(!(formData.code == dropDownData.code[i].key)){
      //       if(formData.code.toUpperCase() === dropDownData.code[i].value.toUpperCase()){
      //         formData.code = dropDownData.code[i].key;
      //         break;
      //       }
      //     }
      //   }
      // }
      // `,
      // preApiCalls:[
      //   {
      //     url:"/egov-mdms-service/v1/_get",
      //     jsonPath:"shiftType.codeTwo",
      //     qs:{
      //       moduleName:"swm",
      //       masterName:"ShiftType"
      //     },
      //     jsExpForDD:{
      //       key:"$..code",
      //       value:"$..name",
      //     }
      //   },
      //   {
      //     url:"/hr-masters/designations/_search",
      //     jsonPath:"designation.codeDes",
      //     jsExpForDD:{
      //       key:"$..code",
      //       value:"$..name",
      //     }
      //   },
      // ],
      numCols: 4,
      useTimestamp: true,
      objectName: 'shifts',
      url: '/swm-services/shifts/_search',
      title: 'swm.create.page.title.shiftmasterss',
      groups: [
        {
          name:'ShiftSelection',
          label: 'swm.shift.create.group.title.ShiftSelection',
          fields: [
          {
              name: 'shiftType',
              jsonPath: 'shiftTypeCode',
              label: 'swm.Shift.create.shiftType',
              pattern: '',
              type: 'singleValueList',
              isRequired: false,
              isDisabled: false,
              maxLength: 12,
              minLength: 6,
              url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=ShiftType|$..ShiftType.*.code|$..ShiftType.*.name',
            },
            // {
            //   name: 'shift',
            //   jsonPath: 'code',
            //   label: 'swm.Shift.create.shift',
            //   pattern: '',
            //   type: 'autoCompelete',
            //   isRequired: false,
            //   isDisabled: false,
            //   maxLength: 128,
            //   minLength: 1,
            //   patternErrorMsg: '',
            //   url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=Shift|$..Shift.*.code|$..Shift.*.name',
            // },
          ]
        },
      ],
      result: {
        header: [
          // {
          //   label: 'swm.Shift.create.shift',
          // },
          {
            label: 'swm.Shift.create.shiftType',
          },
          {
            label: 'swm.Shift.create.designation',
          },
          {
            label: 'swm.Shift.create.shiftStartTime',
            isTime:true
          },
          {
            label: 'swm.Shift.create.shiftEndTime',
            isTime:true
          },
        ],
        values: [
          // 'name',
         'shiftType.name',
          'designation.name',
          'shiftStartTime',
          'shiftEndTime',
        ],
        resultPath: 'shifts',
        rowClickUrlUpdate: '/update/swm/shiftmasters/{code}',
        rowClickUrlView: '/view/swm/shiftmasters/{code}',
       // isMasterScreen: true
      },
    },
    'swm.create': {
      beforeSubmit:
      `
      var path = formData.shifts[0];
      if(path.shiftEndTime < path.shiftStartTime ){
        alert("Shift End Time should be greater than Shift Start Time");
        shouldSubmit=false;
      }
      if(path.lunchEndTime < path.lunchStartTime){
        alert("Lunch End Time should be greater than Lunch Start Time");
        shouldSubmit=false;
      }
      if(path.graceTimeTo < path.graceTimeFrom){
        alert("Grace Time To should be greater than Grace Time From");
        shouldSubmit=false;
      }
      
      if( !(path.lunchStartTime > path.shiftStartTime && path.lunchStartTime < path.shiftEndTime && path.lunchEndTime > path.shiftStartTime && path.lunchEndTime < path.shiftEndTime) ){
        alert("Lunch Start Time and Lunch End Time should be between Shift Start Time and Shift End Time..");
        shouldSubmit=false;
      }

      if( !(path.graceTimeFrom > path.shiftStartTime && path.graceTimeFrom < path.shiftEndTime && path.graceTimeTo > path.shiftStartTime && path.graceTimeTo < path.shiftEndTime) ){
        alert("Grace Time From and Grace Time To should be between Shift Start Time and Shift End Time..");
        shouldSubmit=false;
      }

      
      `,
      numCols: 3,
      useTimestamp: true,
      objectName: 'shifts',
      idJsonPath: 'shifts[0].code',
      title: 'swm.create.page.title.shiftmasters',
      groups: [
        {
          name:'ShiftSelection',
          label: 'swm.shift.create.group.title.ShiftSelection',
          fields: [
            // {
            //   name: 'shiftName',
            //   jsonPath: 'name',
            //   label: 'swm.Shift.create.shift',
            //   pattern: '',
            //   type: 'text',
            //   isRequired: true,
            //   isDisabled: false,
            //   maxLength: 100,
            //   minLength: 1,
            // },
            {
              name: 'shiftType',
              jsonPath: 'shifts[0].shiftType.code',
              label: 'swm.Shift.create.shiftType',
              pattern: '',
              type: 'singleValueList',
              isRequired: true,
              isDisabled: false,
              maxLength: 12,
              minLength: 6,
              url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=ShiftType|$..ShiftType.*.code|$..ShiftType.*.name',
            },
            {
              name: 'departmentName',
              jsonPath: 'shifts[0].department.code',
              label: 'swm.Shift.create.department',
              pattern: '',
              type: 'singleValueList',
              isRequired: true,
              isDisabled: false,
              maxLength: 128,
              minLength: 1,
              patternErrorMsg: '',
              url: "/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Department|$..code|$..name",
              hasIdConverion: true,
            },
            {
              name: 'designationName',
              jsonPath: 'shifts[0].designation.code',
              label: 'swm.Shift.create.designation',
              pattern: '',
              type: 'singleValueList',
              isRequired: true,
              isDisabled: false,
              maxLength: 128,
              minLength: 1,
              patternErrorMsg: '',
              url: '/hr-masters/designations/_search?tenantId=default|$..code|$..name',
            },
            // {
            //   name: 'tenantId',
            //   jsonPath: 'MasterMetaData.masterData[0].tenantId',
            //   type: 'text',
            //   defaultValue: localStorage.getItem("tenantId"),
            //   hide: true
            // },
            // {
            //   name: 'moduleName',
            //   jsonPath: 'MasterMetaData.moduleName',
            //   type: 'text',
            //   defaultValue: 'swm',
            //   hide: true
            // },
            // {
            //   name: 'masterName',
            //   jsonPath: 'MasterMetaData.masterName',
            //   type: 'text',
            //   defaultValue: 'Shift',
            //   hide: true
            // },
            
          ]
        },
        // {
        //   name: 'HideGroup',
        //   hide: true,
        //   fields: [
        //     {
        //       name: 'code',
        //       jsonPath: 'MasterMetaData.masterData[0].code',
        //       defaultValue: 'Shift-' + new Date().getTime(),
        //       isRequired : true,
        //       type: 'text',
        //       hide: true,
        //     }
        //   ]
        // },
        {
          name:'SiftDetails',
          label: 'swm.shift.create.group.title.SiftDetails',
          fields: [
            {
              name: 'shiftStartTime',
              jsonPath: 'shifts[0].shiftStartTime',
              label: 'swm.Shift.create.shiftStartTime',
              pattern: '',
              isRequired: true,
              type: 'timePicker',
              isDisabled: false,
              reset:true,
              maxLength: 12,
              minLength: 6,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'shiftEndTime',
              jsonPath: 'shifts[0].shiftEndTime',
              label: 'swm.Shift.create.shiftEndTime',
              pattern: '',
              type: 'timePicker',
              reset:true,
              isRequired: true,
              isDisabled: false,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'lunchStartTime',
              jsonPath: 'shifts[0].lunchStartTime',
              label: 'swm.Shift.create.lunchStartTime',
              pattern: '',
              type: 'timePicker',
              reset:true,
              isDisabled: false,
              isRequired: true,
              maxLength: 12,
              minLength: 6,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'lunchEndTime',
              jsonPath: 'shifts[0].lunchEndTime',
              label: 'swm.Shift.create.lunchEndTime',
              pattern: '',
              type: 'timePicker',
              reset:true,
              isDisabled: false,
              isRequired: true,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'graceTimeFrom',
              jsonPath: 'shifts[0].graceTimeFrom',
              label: 'swm.Shift.create.graceTimeFrom',
              pattern: '',
              type: 'timePicker',
              reset:true,
              isDisabled: false,
              isRequired: true,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'graceTimeTo',
              jsonPath: 'shifts[0].graceTimeTo',
              label: 'swm.Shift.create.graceTimeTo',
              pattern: '',
              type: 'timePicker',
              reset:true,
              isDisabled: false,
              isRequired: true,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'remarks',
              jsonPath: 'shifts[0].remarks',
              label: 'swm.Shift.create.remarks',
              maxLength: 300,
              pattern:'.{15,300}$',
              type: 'textarea',
              isDisabled: false,
              patternErrMsg: 'pattern.error.message.Shift.remarks',

            },
          ],
        },
      ],
      url: '/swm-services/shifts/_create',
      tenantIdRequired: true
    },
    'swm.view': {
      numCols: 4,
      useTimestamp: true,
      objectName: 'shifts',
     // searchUrl: '/egov-mdms-service/v1/_search?code={code}',
      title: 'swm.create.page.title.shiftmasters',
      groups: [
        {
          name:'ShiftSelection',
          label: 'swm.shift.create.group.title.ShiftSelection',
          fields: [
            // {
            //   name: 'shiftName',
            //   jsonPath: 'shifts[0].name',
            //   label: 'swm.Shift.create.shift',
            //   pattern: '',
            //   type: 'text',
            //   isRequired: true,
            //   isDisabled: false,
            //   maxLength: 100,
            //   minLength: 1,
            // },
            {
              name: 'shiftId',
              jsonPath: 'shifts[0].code',
              label: 'swm.Shift.create.shiftId',
              pattern: '',
              type: 'text',
              isRequired: true,
              isDisabled: false,
              maxLength: 100,
              minLength: 1,
            },
            {
              name: 'shiftType',
              jsonPath: 'shifts[0].shiftType.name',
              label: 'swm.Shift.create.shiftType',
              pattern: '',
              type: 'singleValueList',
              isRequired: true,
              isDisabled: false,
              maxLength: 12,
              minLength: 6,
              url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=ShiftType|$..ShiftType.*.code|$..ShiftType.*.name',
            },
            {
              name: 'departmentName',
              jsonPath: 'shifts[0].department.name',
              label: 'swm.Shift.create.department',
              pattern: '',
              type: 'singleValueList',
              isRequired: true,
              isDisabled: false,
              maxLength: 128,
              minLength: 1,
              patternErrorMsg: '',
              url: "/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Department|$..code|$..name",
              hasIdConverion: true,
            },
            {
              name: 'designationName',
              jsonPath: 'shifts[0].designation.name',
              label: 'swm.Shift.create.designation',
              pattern: '',
              type: 'singleValueList',
              isRequired: true,
              isDisabled: false,
              maxLength: 128,
              minLength: 1,
              patternErrorMsg: '',
              url: '/hr-masters/designations/_search?tenantId=default|$..code|$..name',
            },
            // {
            //   name: 'code',
            //   jsonPath: 'MdmsRes.swm.Shift[0].code',
            //   defaultValue: 'Shift-' + new Date().getTime(),
            //   isRequired : true,
            //   type: 'text',
            //   hide: true,
            // },
            /*{
              name: 'tenantId',
              jsonPath: 'MdmsRes.swm.Shift[0].tenantId',
              type: 'text',
              defaultValue: localStorage.getItem("tenantId"),
              hide: true
            },
            {
              name: 'moduleName',
              jsonPath: 'MasterMetaData.moduleName',
              type: 'text',
              defaultValue: 'swm',
              hide: true
            },
            {
              name: 'masterName',
              jsonPath: 'MasterMetaData.masterName',
              type: 'text',
              defaultValue: 'Shift',
              hide: true
            },*/
          ]
        },
        {
          name:'SiftDetails',
          label: 'swm.shift.create.group.title.SiftDetails',
          fields: [
            {
              name: 'shiftStartTime',
              jsonPath: 'shifts[0].shiftStartTime',
              label: 'swm.Shift.create.shiftStartTime',
              pattern: '',
              type: 'timePicker',
              reset:true,
              isDisabled: false,
              maxLength: 12,
              minLength: 6,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'shiftEndTime',
              jsonPath: 'shifts[0].shiftEndTime',
              label: 'swm.Shift.create.shiftEndTime',
              pattern: '',
              type: 'timePicker',
              reset:true,
              isDisabled: false,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'lunchStartTime',
              jsonPath: 'shifts[0].lunchStartTime',
              label: 'swm.Shift.create.lunchStartTime',
              pattern: '',
              type: 'timePicker',
              reset:true,
              isDisabled: false,
              maxLength: 12,
              minLength: 6,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'lunchEndTime',
              jsonPath: 'shifts[0].lunchEndTime',
              label: 'swm.Shift.create.lunchEndTime',
              pattern: '',
              type: 'timePicker',
              reset:true,
              isDisabled: false,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'graceTimeFrom',
              jsonPath: 'shifts[0].graceTimeFrom',
              label: 'swm.Shift.create.graceTimeFrom',
              pattern: '',
              type: 'timePicker',
              reset:true,
              isDisabled: false,
              maxLength: 12,
              minLength: 6,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'graceTimeTo',
              jsonPath: 'shifts[0].graceTimeTo',
              label: 'swm.Shift.create.graceTimeTo',
              pattern: '',
              type: 'timePicker',
              reset:true,
              isDisabled: false,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'remarks',
              jsonPath: 'shifts[0].remarks',
              label: 'swm.Shift.create.remarks',
              pattern: '',
              type: 'textarea',
              isDisabled: false,
              patternErrorMsg: '',
              url: '',
            },
          ],
        },
      ],
      tenantIdRequired: true,
      url: '/swm-services/shifts/_search?code={code}',
    },
    'swm.update': {
      beforeSubmit:
      `
      var path = formData.shifts[0];
      if(path.shiftEndTime < path.shiftStartTime ){
        alert("Shift End Time should be greater than Shift Start Time");
        shouldSubmit=false;
      }
      if(path.lunchEndTime < path.lunchStartTime){
        alert("Lunch End Time should be greater than Lunch Start Time");
        shouldSubmit=false;
      }
      if(path.graceTimeTo < path.graceTimeFrom){
        alert("Grace Time To should be greater than Grace Time From");
        shouldSubmit=false;
      }
      
      if( !(path.lunchStartTime > path.shiftStartTime && path.lunchStartTime < path.shiftEndTime && path.lunchEndTime > path.shiftStartTime && path.lunchEndTime < path.shiftEndTime) ){
        alert("Lunch Start Time and Lunch End Time should be between Shift Start Time and Shift End Time..");
        shouldSubmit=false;
      }
      
      if( !(path.graceTimeFrom > path.shiftStartTime && path.graceTimeFrom < path.shiftEndTime && path.graceTimeTo > path.shiftStartTime && path.graceTimeTo < path.shiftEndTime) ){
        alert("Grace Time From and Grace Time To should be between Shift Start Time and Shift End Time..");
        shouldSubmit=false;
      }
      `,
      numCols: 3,
      useTimestamp: true,
      objectName: 'shifts',
      idJsonPath: 'MasterMetaData.masterData[0].code',
      title: 'swm.create.page.title.shiftmasters',
      groups: [
        {
          name:'ShiftSelection',
          label: 'swm.shift.create.group.title.ShiftSelection',
          fields: [
            // {
            //   name: 'shiftName',
            //   jsonPath: 'shifts[0].name',
            //   label: 'swm.Shift.create.shift',
            //   pattern: '',
            //   type: 'text',
            //   isRequired: true,
            //   isDisabled: false,
            //   maxLength: 100,
            //   minLength: 1,
            // },
            {
              name: 'shiftId',
              jsonPath: 'shifts[0].code',
              label: 'swm.Shift.create.shiftId',
              pattern: '',
              type: 'text',
              isRequired: true,
              isDisabled: true,
              maxLength: 100,
              minLength: 1,
            },
            {
              name: 'shiftType',
              jsonPath: 'shifts[0].shiftType.code',
              label: 'swm.Shift.create.shiftType',
              pattern: '',
              type: 'singleValueList',
              isRequired: true,
              isDisabled: false,
              maxLength: 12,
              minLength: 6,
              url: '/egov-mdms-service/v1/_get?&moduleName=swm&masterName=ShiftType|$..ShiftType.*.code|$..ShiftType.*.name',
            },
            {
              name: 'departmentName',
              jsonPath: 'shifts[0].department.code',
              label: 'swm.Shift.create.department',
              pattern: '',
              type: 'singleValueList',
              isRequired: true,
              isDisabled: false,
              maxLength: 128,
              minLength: 1,
              patternErrorMsg: '',
              url: "/egov-mdms-service/v1/_get?&moduleName=common-masters&masterName=Department|$..code|$..name",
              hasIdConverion: true,
            },
            {
              name: 'designationName',
              jsonPath: 'shifts[0].designation.code',
              label: 'swm.Shift.create.designation',
              pattern: '',
              type: 'singleValueList',
              isRequired: true,
              isDisabled: false,
              maxLength: 128,
              minLength: 1,
              patternErrorMsg: '',
              url: '/hr-masters/designations/_search?tenantId=default|$..code|$..name',
            },
            // {
            //   name: 'code',
            //   jsonPath: 'MasterMetaData.masterData[0].code',
            //   defaultValue: 'Shift-' + new Date().getTime(),
            //   isRequired : true,
            //   type: 'text',
            //   hide: true,
            // },
            // {
            //   name: 'tenantId',
            //   jsonPath: 'MasterMetaData.masterData[0].tenantId',
            //   type: 'text',
            //   defaultValue: localStorage.getItem("tenantId"),
            //   hide: true
            // },
            // {
            //   name: 'moduleName',
            //   jsonPath: 'MasterMetaData.moduleName',
            //   type: 'text',
            //   defaultValue: 'swm',
            //   hide: true
            // },
            // {
            //   name: 'masterName',
            //   jsonPath: 'MasterMetaData.masterName',
            //   type: 'text',
            //   defaultValue: 'Shift',
            //   hide: true
            // },

           
          ]
        },
        {
          name: 'HideGroup',
          hide: true,
          fields: [
            {
              name: 'code',
              jsonPath: 'MasterMetaData.masterData[0].code',
              defaultValue: 'Shift-' + new Date().getTime(),
              isRequired : true,
              type: 'text',
              hide: true,
            }
          ]
        },
        {
          name:'SiftDetails',
          label: 'swm.shift.create.group.title.SiftDetails',
          fields: [
            {
              name: 'shiftStartTime',
              jsonPath: 'shifts[0].shiftStartTime',
              label: 'swm.Shift.create.shiftStartTime',
              pattern: '',
              type: 'timePicker',
              isDisabled: false,
              isRequired: true,
              maxLength: 12,
              minLength: 6,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'shiftEndTime',
              jsonPath: 'shifts[0].shiftEndTime',
              label: 'swm.Shift.create.shiftEndTime',
              pattern: '',
              type: 'timePicker',

              isDisabled: false,
              isRequired: true,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'lunchStartTime',
              jsonPath: 'shifts[0].lunchStartTime',
              label: 'swm.Shift.create.lunchStartTime',
              pattern: '',
              type: 'timePicker',
              isDisabled: false,
              isRequired: true,
              maxLength: 12,
              minLength: 6,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'lunchEndTime',
              jsonPath: 'shifts[0].lunchEndTime',
              label: 'swm.Shift.create.lunchEndTime',
              pattern: '',
              type: 'timePicker',
              isRequired: true,
              isDisabled: false,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'graceTimeFrom',
              jsonPath: 'shifts[0].graceTimeFrom',
              label: 'swm.Shift.create.graceTimeFrom',
              pattern: '',
              type: 'timePicker',
              isDisabled: false,
              isRequired: true,
              maxLength: 12,
              minLength: 6,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'graceTimeTo',
              jsonPath: 'shifts[0].graceTimeTo',
              label: 'swm.Shift.create.graceTimeTo',
              pattern: '',
              type: 'timePicker', 
              isRequired: true,
              isDisabled: false,
              patternErrorMsg: '',
              url: '',
            },
            {
              name: 'remarks',
              jsonPath: 'shifts[0].remarks',
              label: 'swm.Shift.create.remarks',
              maxLength: 300,
              pattern:'.{15,300}$',
              type: 'textarea',
              isDisabled: false,
              patternErrMsg: 'pattern.error.message.Shift.remarks',
            },
          ],
        },
      ],
      url: '/swm-services/shifts/_update',
      tenantIdRequired: true,
      //isMDMSScreen: true,
      searchUrl: '/swm-services/shifts/_search?code={code}',
    },
  };
  export default dat;
