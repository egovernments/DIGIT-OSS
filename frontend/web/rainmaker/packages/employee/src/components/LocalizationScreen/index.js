import React, { PureComponent ,forwardRef} from "react";
import MaterialTable from "material-table";
// import axios from "axios";
import * as XLSX from "xlsx";
import { SheetJSFT } from "./utils/types";
import { make_cols } from "./utils/makeColumns";
import {
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Card,
  Button,
  Input,
  ListItemText,
  Checkbox,
  Typography,
  Hidden,
  Fab,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import { httpRequest } from "egov-ui-kit/utils/api";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref:React.Ref<SVGSVGElement>) => <ViewColumn {...props} ref={ref} />)
};

class ApiTable extends PureComponent {
  state = {
    datas: {},
    id: 0,
    newData: {},
    // data: [],

    selectedState: "",
    name: [],
    multiSelect: [],
    locale: [],

    newSearch: [],

    apidata: [],
    statelocale: [],
    statemultiSelect: [],

    file: {},
    data: [],
    cols: [],
    validate: "",
    matchData: [],
  };

  componentDidMount = async () => {
    // var c = new URL(window.location.href).searchParams.get("module");
    var mod = new URL(window.location.href).searchParams.get("module");
    var module = mod ? mod.split(",") : [];
    var loc = new URL(window.location.href).searchParams.get("locale");
    var locale = loc ? loc.split(",") : [];
    var tenantId=new URL(window.location.href).searchParams.get("tenantID");
    console.log(module, "module");

    console.log(this.state, "state");
    if (locale.length >= 1 && module.length >= 1) {
      var statemultiSelect = [];
      statemultiSelect = module.map((m) => {
        return { label: m, value: m };
      });

      console.log("not axios");
      this.setState({
        ...this.state,
        statemultiSelect,
        selectedState: new URL(window.location.href).searchParams.get("tenantID"),
        multiSelect: module,
        statelocale: locale.map((m) => {
          return { label: m, value: m };
        }),
        locale: locale,
      });
    } else {
      console.log("axios");
      const requestbody = {
        MdmsCriteria: {
          tenantId: getTenantId().split(".")[0],
          moduleDetails: [
            {
              moduleName: "common-masters",
              masterDetails: [
                {
                  name: "StateInfo",
                },
              ],
            },
          ],
        },
      };
      try {
        const payload = await httpRequest(`egov-mdms-service/v1/_search?tenantId=${this.state.selectedState}`, "", [], requestbody);
        this.setState({
          ...this.state,
          apidata: payload.MdmsRes["common-masters"],
          selectedState: tenantId?tenantId:getTenantId(),
          statelocale: payload.MdmsRes["common-masters"].StateInfo[0].languages,
          statemultiSelect: payload.MdmsRes["common-masters"].StateInfo[0].localizationModules,
        });
      } catch (e) {
        console.log(e);
      } finally {
      }

      // axios
      //   .post(`${document.location.origin}/egov-mdms-service/v1/_search?tenantId=${this.state.selectedState}`, {
      //     RequestInfo: {
      //       apiId: "Rainmaker",
      //       ver: ".01",
      //       ts: "",
      //       action: "_search",
      //       did: "1",
      //       key: "",
      //       msgId: "20170310130900|en_IN",
      //       authToken: "a969d202-0b39-4fb2-8334-2f0c4d281bf6",
      //     },
      //     MdmsCriteria: {
      //       tenantId: getTenantId(),
      //       moduleDetails: [
      //         {
      //           moduleName: "common-masters",
      //           masterDetails: [
      //             {
      //               name: "StateInfo",
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   })
      //   .then((response) => {
      //     this.setState({
      //       ...this.state,
      //       apidata: response.data.MdmsRes["common-masters"],
      //       selectedState: new URL(window.location.href).searchParams.get("tenantID"),
      //       statelocale: response.data.MdmsRes["common-masters"].StateInfo[0].languages,
      //       statemultiSelect: response.data.MdmsRes["common-masters"].StateInfo[0].localizationModules,
      //     });
      //   })
      //   .catch((err) => console.log(err));
    }
  };

  // saveData = data => {
  //   this.setState({ ...this.state, data: data })
  // };

  onCreate = async () => {
    const { newData } = this.state;
    const { onSearch } = this;
    const requestbody = {
      locale: newData.locale,
      tenantId: getTenantId().split(".")[0],
      messages: [
        {
          code: newData.code,
          message: newData.message,
          module: newData.module,
          locale: newData.locale,
        },
      ],
    };
    try {
      const payload = await httpRequest(`localization/messages/v1/_create`, "", [], requestbody);
      this.setState({
        data: "",
      });
    } catch (e) {
      console.log(e);
    } finally {
    }
    // axios
    //   .post(`${document.location.origin}/localization/messages/v1/_create`, {
    //     RequestInfo: {
    //       apiId: "emp",
    //       ver: "1.0",
    //       ts: "10-03-2017 00:00:00",
    //       action: "create",
    //       did: "1",
    //       key: "abcdkey",
    //       msgId: "20170310130900",
    //       requesterId: "rajesh",
    //       authToken: localStorage.getItem("auth"),
    //       userInfo: {
    //         id: 128,
    //       },
    //     },
    //     locale: newData.locale,
    //     tenantId: "pb",
    //     messages: [
    //       {
    //         code: newData.code,
    //         message: newData.message,
    //         module: newData.module,
    //         locale: newData.locale,
    //       },
    //     ],
    //   })
    //   .then((response) => {
    //     console.log("response API", response);
    //     // this.onFetch();
    //     this.setState({
    //       data: "",
    //     });
    //   })
    //   .catch((err) => console.log(err));
    // window.location.reload();
    onSearch();
  };

  onUpdate = async (id) => {
    const { datas } = this.state;
    const { onSearch } = this;
    const requestbody = {
      locale: datas.locale,
      module: datas.module,
      tenantId: getTenantId().split(".")[0],
      messages: [
        {
          code: datas.code,
          message: datas.message,
          module: datas.module,
          locale: datas.locale,
        },
      ],
    };
    try {
      const payload = await httpRequest(`localization/messages/v1/_update`, "", [], requestbody);
      this.setState({
        data: "",
      });
    } catch (e) {
      console.log(e);
    } finally {
    }
    // axios
    //   .post(`${document.location.origin}/localization/messages/v1/_update`, {
    //     RequestInfo: {
    //       apiId: "emp",
    //       ver: "1.0",
    //       ts: "10-03-2017 00:00:00",
    //       action: "create",
    //       did: "1",
    //       key: "abcdkey",
    //       msgId: "20170310130900",
    //       requesterId: "rajesh",
    //       authToken: localStorage.getItem("auth"),
    //       userInfo: {
    //         id: 128,
    //       },
    //     },
    //     locale: datas.locale,
    //     module: datas.module,
    //     tenantId: "pb",
    //     messages: [
    //       {
    //         code: datas.code,
    //         message: datas.message,
    //         module: datas.module,
    //         locale: datas.locale,
    //       },
    //     ],
    //   })
    //   .then((response) => {
    //     console.log("response API", response);
    //     this.setState({
    //       data: "",
    //     });
    //   })
    //   .catch((err) => console.log(err));
    // window.location.reload();
    onSearch();
  };

  onDelete = async (id) => {
    const { saveData } = this;
    const requestbody = {
      locale: this.state.datas.locale,
      tenantId: getTenantId().split(".")[0],
      messages: [
        {
          code: this.state.newData.code,
          message: this.state.newData.message,
          module: this.state.newData.module,
          locale: this.state.newData.locale,
        },
      ],
    };
    try {
      const payload = await httpRequest(`localization/messages/v1/_delete`, "", {}, requestbody);
      this.setState({
        data: "",
      });
    } catch (e) {
      console.log(e);
    } finally {
    }
    // axios
    //   .post(`${document.location.origin}/localization/messages/v1/_delete`, {
    //     requestInfo: {
    //       apiId: "emp",
    //       ver: "1.0",
    //       ts: "10-03-2017 00:00:00",
    //       action: "create",
    //       did: "1",
    //       key: "abcdkey",
    //       msgId: "20170310130900",
    //       requesterId: "rajesh",
    //       authToken: localStorage.getItem("auth"),
    //       userInfo: {
    //         id: 1,
    //       },
    //     },
    //     locale: this.state.datas.locale,
    //     tenantId: "default",
    //     messages: [
    //       {
    //         code: this.state.newData.code,
    //         message: this.state.newData.message,
    //         module: this.state.newData.module,
    //         locale: this.state.newData.locale,
    //       },
    //     ],
    //   })
    //   .then((response) => {
    //     console.log("response API", response);
    //     saveData(response.data.messages);
    //     // this.setState({
    //     //   message: ''
    //     // })
    //   })
    //   .catch((err) => console.log(err));
  };

  onSearch = async () => {
    try {
      const payload = await httpRequest(
        `localization/messages/v1/_search?module=${this.state.multiSelect.join(",")}&locale=${this.state.locale}&tenantId=${this.state.selectedState.split(".")[0]}`,"_search",[],{},[],{},true
      );
      this.setState({ ...this.state, newSearch: payload.messages });
    } catch (e) {
      console.log(e);
    } finally {
    }

    // axios
    //   .post(
    //     `${document.location.origin}/localization/messages/v1/_search?module=${this.state.multiSelect.join(",")}&locale=${
    //       this.state.locale
    //     }&tenantId=${this.state.selectedState}`
    //   )
    //   .then((response) => {
    //     this.setState({ ...this.state, newSearch: response.data.messages });
    //   })
    //   .catch((err) => console.log(err));
  };

  onReset = () => {
    this.setState({
      ...this.state,
      multiSelect: [],
      locale: [],
    });
  };

  handleChange = (event) => {
    this.setState({ selectedState: event.target.value });
  };

  handleChangeLocale = (event) => {
    this.setState({ locale: event.target.value });
  };

  handleChangeExcel = (e) => {
    const { handleFile } = this;
    const files = e.target.files;
    console.log(files, "files");
    if (files && files[0]) {
      this.setState({ file: files[0] }, () => {
        handleFile();
      });
    }
  };

  handleChangeMulti = (event) => {
    console.log(event.target.value, "event");

    this.setState({ multiSelect: event.target.value });
    // multiSelect(event.target.value);
  };

  handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    // multiSelect(value);
    this.setState({
      multiSelect: value,
    });
  };

  handleFile = () => {
    const { handleValidateUpload } = this;

    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array", bookVBA: true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */
      this.setState({ data: data, cols: make_cols(ws["!ref"]) }, () => {
        // console.log(JSON.stringify(this.state.data, null, 2));
        handleValidateUpload();
      });
    };
    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    }
  };

  handleValidateUpload = () => {
    var TotallenOfObj = this.state.data.reduce((a, obj) => a + Object.keys(obj).length, 0);
    var lenOfObj = this.state.data.reduce((a, obj) => Object.keys(obj).length, 0);
    var lenOfArr = this.state.data.length * 4;
    console.log(lenOfObj, "data", TotallenOfObj, lenOfArr);
    if (TotallenOfObj == lenOfArr && lenOfObj == 4) {
      console.log("correct data");
      this.setState({ validate: "" });
    } else {
      console.log("Invalid data");
      this.setState({ validate: "Please check excel sheet cells" });
    }
  };

  cmpreUpload = (searchData, excelData) => {
    excelData.map((s1, k1) => {
      let matchFound = false;

      searchData.map((e1, k2) => {
        if (s1.Code === e1.code && s1.Module === e1.module && s1.Message === e1.message) {
          matchFound = true;
        }
        // } else {
        //   matchData.push(s1)
        //   console.log(matchData,"matchData")
        // }
      });
      if (!matchFound) {
        let { matchData = [] } = this.state;
        matchData.push(s1);
        this.setState({ matchData }, console.log("s1", this.state.matchData));
      }
    });
  };

  render() {
    console.log("matchData", this.state.matchData);

    const { data = [], newSearch = [], apidata = [] } = this.state;
    // localStorage.setItem("auth", "024494f4-239a-41e8-a3c0-0fa4d804a2c8");
    let empty = [];
    let dropData = [];
    let datas = [];
    let locale = [];
    let filterModule = [];
    let filterLocale = [];

    dropData =
      newSearch !== []
        ? newSearch.map((da, key) => {
            return filterModule.push(da.module);
          })
        : [];

    let filtermoduleUnique = {};
    var filterMooduleuniqueSearch = filterModule.filter((v, i, a) => a.indexOf(v) === i);
    datas = filterMooduleuniqueSearch.map((u, i) => {
      return (filtermoduleUnique[u] = u);
    });

    dropData =
      newSearch !== []
        ? newSearch.map((da, key) => {
            return filterLocale.push(da.locale);
          })
        : [];

    let filterLocaleUnique = {};
    var filterLocaleuniqueSearch = filterLocale.filter((v, i, a) => a.indexOf(v) === i);
    datas = filterLocaleuniqueSearch.map((u, i) => {
      return (filterLocaleUnique[u] = u);
    });

    const columns = [
      { title: "Code", field: "code" },
      { title: "Message", field: "message" },
      { title: "Module", field: "module", lookup: filtermoduleUnique },
      { title: "Locale", field: "locale", lookup: filterLocaleUnique },
    ];

    const enabled = this.state.locale.length >= 1;

    return (
      <div>
        <Grid container justify="center" alignItems="center">
          <Grid container item md={5} sm={6} xs={11}>
            <Typography variant="h4" style={{ margin: "1em 0em" }}>
              Search localization
            </Typography>
          </Grid>

          <Grid item md={6} sm={6} xs={11} container direction="row" justify="flex-end">
            <input
              style={{ display: "none" }}
              accept="file"
              id="outlined-button-file"
              multiple
              type="file"
              accept={SheetJSFT}
              onChange={this.handleChangeExcel}
            />
            <label htmlFor="outlined-button-file">
              <Fab color="primary" size="small" aria-label="Add" component="span" style={{ background: "#fe7a51", color: "#fff" }}>
                <AddIcon />
              </Fab>
            </label>
            <span style={{ padding: "8px" }}>{this.state.file.name} </span>
            {/* </Grid> */}

            {/* <Grid item md={4} sm={4} xs={11}> */}

            <Button variant="contained" onClick={() => this.cmpreUpload(newSearch, data)} style={{ background: "#fe7a51", color: "#fff" }}>
              Upload
            </Button>
            <br />
            <Grid container direction="row" justify="flex-end" alignItems="center">
              <span style={{ color: "red" }}>&nbsp;{this.state.validate}</span>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justify="center" alignItems="center">
          <Grid item md={11} sm={11} xs={11}>
            <Card style={{ marginBottom: "2rem" }}>
              <Typography variant="h5" style={{ margin: "1em" }}>
                Search for Localization
              </Typography>

              <Grid container style={{ margin: "2rem" }}>
                <Grid item md={4} sm={6} xs={10}>
                  <FormControl style={{ width: "70%" }}>
                    <InputLabel>Tenant Id</InputLabel>
                    <Select
                      open={this.state.open}
                      onClose={this.handleClose}
                      onOpen={this.handleOpen}
                      value={this.state.selectedState}
                      onChange={this.handleChange}
                      disabled
                    >
                      <MenuItem value={this.state.selectedState}>{this.state.selectedState}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item md={4} sm={6} xs={10}>
                  <FormControl style={{ width: "70%" }}>
                    <InputLabel htmlFor="select-multiple">Module</InputLabel>
                    <Select
                      multiple
                      value={this.state.multiSelect}
                      onChange={this.handleChangeMulti}
                      id="multiSelect"
                      input={<Input />}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {this.state.statemultiSelect.map((name) => (
                        <MenuItem key={name.value} value={name.value}>
                          <Checkbox checked={this.state.multiSelect.indexOf(name.label) > -1} />
                          <ListItemText primary={name.label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item md={4} sm={6} xs={10}>
                  <FormControl style={{ width: "70%" }}>
                    <InputLabel>Locale</InputLabel>
                    <Select
                      open={this.state.open}
                      onClose={this.handleClose}
                      onOpen={this.handleOpen}
                      value={this.state.locale}
                      onChange={this.handleChangeLocale}
                    >
                      {this.state.statelocale.map((name) => (
                        <MenuItem key={name.value} value={name.value}>
                          {name.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Hidden mdUp>
                  <Grid item md={4} sm={6} xs={10}></Grid>
                </Hidden>

                <Grid item md={6} sm={6} xs={12}>
                  <Button
                    variant="contained"
                    style={{ width: "60%", marginTop: "2rem", background: "#fff", color: "#333" }}
                    color="secondary"
                    onClick={this.onReset}
                  >
                    {" "}
                    reset
                  </Button>
                </Grid>

                <Grid item md={6} sm={6} xs={12}>
                  <Button
                    variant="contained"
                    style={{ width: "60%", marginTop: "2rem", background: "#666666", color: "#fff" }}
                    color="secondary"
                    onClick={this.onSearch}
                    disabled={!enabled}
                  >
                    {" "}
                    search
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Grid container justify="center" alignItems="center">
          <Grid item md={11} sm={11} xs={11}>
            <MaterialTable
              title={`Localization Search Results ( ${newSearch.length} )`}
              options={{
                filtering: true,
                sorting: true,
                search: true,
                // exportButton: true,
                actionsColumnIndex: -1,
                pageSize: 10,
                pageSizeOptions: [5, 10, 25, 50, 75, 100],
                addRowPosition: "first",
                exportButton: true,
                exportAllData: true,
              }}
              editable={{
                onRowAdd: (newData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      this.setState((prevState) => {
                        const data = [...prevState.data];
                        console.log(newData, "newData", "data:", data);
                        return { ...prevState, data, newData: newData };
                      });
                      this.onCreate();
                    }, 600);
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      if (oldData) {
                        console.log(oldData, "oldData");
                        this.setState((prevState) => {
                          const data = [...prevState.data];
                          const id = data.indexOf(oldData);
                          data[data.indexOf(oldData)] = newData;
                          return { ...prevState, data, id: id, datas: newData };
                        });
                        console.log("data", newData);
                        this.onUpdate(this.state.id);
                      }
                    }, 600);
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      this.setState((prevState) => {
                        const data = [...prevState.data];
                        const id = data.indexOf(oldData);
                        return { ...prevState, data, newData: oldData, id: id };
                      });
                      this.onDelete(this.state.id);
                    }, 600);
                  }),
              }}
              columns={columns}
              data={newSearch}
              icons={tableIcons}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default ApiTable;
