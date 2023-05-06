import React, { useState, useEffect, useContext } from 'react';
// import AddPost from '../Material/TextEditor';
import axios from "axios";
import { useForm } from "react-hook-form";
import Checkbox from '@mui/material/Checkbox';
import { useTranslation } from 'react-i18next';
import { Button, Form } from "react-bootstrap";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import OutlinedInput from "@mui/material/OutlinedInput";
import Col from "react-bootstrap/Col";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { styled } from "@mui/material/styles";
// import { useStyles } from "../../css/personalInfoChild.style";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { ComplicesRemarksContext } from '../../../../context/Complices-remarks-context';

import Modalcompliances from './Modalcompliances';
import { iteratee } from 'lodash';


const Addmoreinput = ({ applicationimp }) => {
    const { compliceGetRemarkssValues, remarksData } = useContext(ComplicesRemarksContext)
    //   const[formValues, setFormValues]= useState([{name:'', email:'', address:''}]);
    const [compliancedata , setCompliancesData] = useState([]);
      const [checked, setChecked] = useState(true);
    const { t } = useTranslation();
    const [msg, setMsg] = useState('');
    const [loader, setLoading] = useState(false);
    const dateTime = new Date();
    const tcpApplicationNumber = applicationimp?.tcpApplicationNumber
    const ApplicationNumber = applicationimp?.applicationNumber
    
    const [RemarksDeveloper, setDeveloperRemarks] = useState("");

    useEffect( () => {
            if (remarksData){
                setCompliancesData(remarksData?.ComplianceRequest || []) 
            }

    } , [remarksData])


    const handleInputChange = (index, event) => {
        let data = [...formValues];
        data[index][event.target.name] = event.target.value;
        setFormValues(data);
    }
    const addFields = () => {
        let addField = { name: '', email: '', address: '' };
        setFormValues([...formValues, addField])
    }

    const removeFields = (index) => {
        let data = [...formValues];
        data.splice(index, 1);
        setFormValues(data);
    }
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        watch,
        getValues,
        resetField,
    } = useForm({ reValidateMode: "onChange", mode: "onChange" });
    const authToken = Digit.UserService.getUser()?.access_token || null;
    const userInfo = Digit.UserService.getUser()?.info || {};
    const userRolesArray = userInfo?.roles.filter((user) => user.code !== "EMPLOYEE");
    const filterDataRole = userRolesArray?.[0]?.code;
    const designation = userRolesArray?.[0]?.name;
    //   const [updateA, setIsChecked] = useState(false);


    let loidata = remarksData?.ComplianceRequest?.map((item, index) => item?.Compliance?.isPartOfLoi)
    console.log("falsenonfdfd", loidata);
    
    let skills = {};
    if (loidata === true) {
        skills = true;

    } else if (loidata === false) {
        skills = false;
    }


      const handleChange = (value , index) => {
        // setIsChecked(event.target.checked);
        let dataAll = compliancedata ;
        dataAll[index].Compliance.isPartOfLoi = value ;
      
        UpdateSurrenderLic(dataAll)
            console.log("falsenon" , value ,dataAll, index);
      };
      useEffect( () => {
    console.log("falsenon123" ,compliancedata);

} , [compliancedata])

 const submitForm = (data) => {

        Compliance(data);

    };


    const [isOpened, setIsOpened] = useState(false);

    function toggle() {
        setIsOpened(wasOpened => !wasOpened);
    }
    const [smShow, setSmShow] = useState(false);
    const handlemodaldData = (data) => {

        setSmShow(false);
        // console.log("here",openedModal,data);

    };
    useEffect(() => {

        if (tcpApplicationNumber) {

            compliceGetRemarkssValues(tcpApplicationNumber);
        }
    }, [tcpApplicationNumber])
    useEffect(() => {
        // console.log("remarksDataComplice",remarksData);
    }, [remarksData])



    const handleshow19 = async (e) => {
        const payload = {

            "RequestInfo": {

                "apiId": "Rainmaker",

                "ver": ".01",

                "ts": null,

                "action": "_update",

                "did": "1",

                "key": "",

                "msgId": "20170310130900|en_IN",

                "authToken": authToken

            }
        }
        const Resp = await axios.post(`/tl-services/loi/report/_create?applicationNumber=${ApplicationNumber}`, payload, { responseType: "arraybuffer" })

        console.log("loggerNew...", Resp.data, userInfo)

        const pdfBlob = new Blob([Resp.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl);

        console.log("logger123456...", pdfBlob, pdfUrl);

    };

    // const handleChanges = (e) => {
    //     this.setState({ isRadioSelected: true });
    // };

      const UpdateSurrenderLic = async (dataAll) => {
        try {
            setLoading(true);
            const body = {
                "RequestInfo": {

                    "apiId": "Rainmaker",
            
                    "ver": "v1",
            
                    "ts": 0,
            
                    "action": "_search",
            
                    "did": "",
            
                    "key": "",
            
                    "msgId": "090909",
            
                    "requesterId": "",
            
                    "authToken": authToken,
            
                    "userInfo": userInfo
            
                },
                "ComplianceRequest": [

                        ...dataAll,
                     ]
            };
      
            const response = await axios.post("/tl-services/_compliance/_update", body);
      
            console.log("Update Response ====> ", response);
            setCompliancesData([...response.data?.ComplianceRequest])
            setLoading(false);
           
            handleClose();
          } catch (err) {
            console.log("Update Error ====> ", err.message);
            setLoading(false);
         
          }
        };
      

    const handleChanges = (e) => {
    this.setState({ isRadioSelected: true });
    };
    /////////////////////////////////////////////style foe table///////////////////////
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const [page, setPage] = React.useState(0);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        "&:last-child td, &:last-child th": {
            border: 0,
        },
    }));

    return (
        <React.Fragment>


            <div className="box">
                <div className="row">


                    <div className="col col-3">

                    </div>
                    <Modalcompliances
                        displaymodal={smShow}
                        onClose={() => setSmShow(false)}
                        applicationdata={applicationimp}
                        passmodalData={handlemodaldData}
                    >
                    </Modalcompliances>

                    <div>
                        <Col md={12} lg={12} mb={3} sx={{ marginY: 2 }}>
                            <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}
                                onClick={() => {
                                    setSmShow(true),
                                        console.log("modal open")
                                }}
                            >
                                Add Compliances
                            </button>
                            <Paper sx={{ width: "100%", overflow: "hidden", marginY: 2 }}>

                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell style={{ width: 50 }}>Sr No.</StyledTableCell>
                                                <StyledTableCell style={{ width: 750 }}>Compliances</StyledTableCell>
                                                <StyledTableCell style={{ width: 350 }}>User name , Role , Date Time</StyledTableCell>
                                                <StyledTableCell style={{ width: 150 }}>Proposed Condition Of LOI</StyledTableCell>
                                                {/* <StyledTableCell style={{ width: 50 }}>
                                                    <div className='row'>
                                                        <div className="btn btn-sm col-md-1">
                                                            <IconButton onClick={handleshow19}>
                                                                <VisibilityIcon color="info" className="icon" />
                                                            </IconButton>
                                                        </div>
                                                        <div className="btn btn-sm col-md-1">
                                        <IconButton onClick={handleshow19}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                                    </div>

                                                </StyledTableCell> */}

                                            </TableRow>

                                        </TableHead>
                                        <TableBody>

                                            {
                                                compliancedata?.map((input, index) =>
                                                    //  return ( 
                                                    <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                                        <StyledTableCell component="th" scope="row">
                                                            {index + 1}
                                                        </StyledTableCell>
                                                        <StyledTableCell><i>{<div dangerouslySetInnerHTML={{ __html: input?.Compliance?.compliance }} />}</i></StyledTableCell>
                                                        <StyledTableCell>
                                                            {input?.Compliance?.designation}<br />
                                                            {input?.Compliance?.created_On}<br />
                                                            {input?.Compliance?.userName}<br />
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <Checkbox
                                                                type="checkbox"
                                                                id="checkbox-id"
                                                                name="checkbox-name"
                                                                onChange={(e) => handleChange(!input?.Compliance?.isPartOfLoi , index)}
                                                               
                                                            checked={input?.Compliance?.isPartOfLoi}
                                                            // defaultChecked
                                                            />
                                                        </StyledTableCell>
                                                        {/* <input type="radio" disabled value="Yes" checked={landScheduleData?.landSandwiched === "Y" ? true : false} /> */}


                                                        {/* <StyledTableCell > 
                                <a href="javascript:void(0)" title="Delete record" onClick={() => deleteTableRows(-1)}>
                                  <DeleteIcon style={{ fill: "#ff1a1a" }} />
                                </a>
                              </StyledTableCell> */}
                                                    </StyledTableRow>


                                                )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={remarksData?.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                            {/* <div className="row">
                
                

                </div> */}
                        </Col>
                    </div>



                </div>






            </div>

        </React.Fragment>
    );
}
export default Addmoreinput;