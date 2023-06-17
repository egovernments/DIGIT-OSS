import { Card, Header, KeyNote, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Spinner from "../../../components/Loader";
import axios from "axios";
import ReactMultiSelect from "../../../../../../react-components/src/atoms/ReactMultiSelect";

const dateRange = [
  { label: "Descending", value: "descending" },
  { label: "Ascending", value: "ascending" },
];

///////////////////////////////////////
import { convertEpochToDateDMY } from "../../../utils";
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

const MyApplications = ({ view }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);

  const { control, register } = useForm();

  // const { mobileNumber, tenantId } = Digit.UserService.getUser()?.info || {};

  // const { isLoading, isError, data, error, ...rest } =
  //   view === "bills"
  //     ? Digit.Hooks.tl.useFetchBill({
  //         params: { businessService: "TL", tenantId, mobileNumber },
  //         config: { enabled: view === "bills" },
  //       })
  //     : Digit.Hooks.tl.useTLSearchApplication(
  //         {},
  //         {
  //           enabled: view !== "bills",
  //         },
  //         t
  //       );

  const userInfo = Digit.UserService.getUser()?.info || {};
  const getApplications = async (searchData) => {
    setLoader(true);
    const token = window?.localStorage?.getItem("token");
    const data = {
      RequestInfo: {
        apiId: "Rainmaker",
        authToken: token,
        msgId: "1672136660039|en_IN",
        userInfo: userInfo,
      },
    };
    try {
      const Resp = await axios.post(`/tl-services/v1/_search?searchData=${searchData}`, data);
      setLoader(false);
      setData(Resp?.data);
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  useEffect(() => {
    getApplications("");
  }, []);

  ////////////////////////////////////////////////////////////////////////
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
    <div>
      {loader && <Spinner></Spinner>}
      <Header>{`${t("TL_MY_APPLICATIONS_HEADER")}`}</Header>
      {/* <Col md={12} lg={12} mb={3}> */}
      <div className="row mb-3">
        {/* <div style={{ position: "relative", zIndex: "12" }} className="col col-4 mt-3">
          <h6>
            Order By
            <ReactMultiSelect control={control} name="selectData" placeholder="Select option" data={dateRange} labels="" />
          </h6>
        </div> */}
        <div className="col col-4 mt-3">
          <h6>
            Search
            <input
              type="text"
              className="form-control"
              placeholder="search"
              {...register(`search`)}
              onChange={(e) => {
                let delay;
                delay = setTimeout(() => {
                  getApplications(e?.target?.value);
                }, 300);
                return () => clearTimeout(delay);
              }}
            />
          </h6>
        </div>
        <div className="col col-4 mt-3"></div>
        <div className="col col-4 mt-3"></div>
      </div>
      {/* </Col> */}
      {/* <table className="customers" id="customers" style={{ borderCollapse: "collapse", width: "100%" }}>

      <div className="row mb-3">
        <div className="col col-4 mt-3">
          <h6>
            Order By
            <ReactMultiSelect control={control} name="selectData" placeholder="Select option" data={dateRange} labels="" />
          </h6>
        </div>
        <div className="col col-4 mt-3">
          <h6>
            Search
            <input type="text" className="form-control" placeholder="search" {...register(`search`)} />
          </h6>
        </div>
      </div>
      <table className="customers" id="customers" style={{ borderCollapse: "collapse", width: "100%" }}>

        <tr>
          <th
            style={{
              border: "1px solid rgb(221, 221, 221)",
              padding: "12px 8px",
              textAlign: "left",
              backgroundColor: "#024f9d",
              color: "white",
            }}
          >
            ID
          </th>
          <th
            style={{
              border: "1px solid rgb(221, 221, 221)",
              padding: "12px 8px",
              textAlign: "left",
              backgroundColor: "#024f9d",
              color: "white",
            }}
          >
            Tenant Id
          </th>
          <th
            style={{
              border: "1px solid rgb(221, 221, 221)",
              padding: "12px 8px",
              textAlign: "left",
              backgroundColor: "#024f9d",
              color: "white",
            }}
          >
            Business Service
          </th>
          <th
            style={{
              border: "1px solid rgb(221, 221, 221)",
              padding: "12px 8px",
              textAlign: "left",
              backgroundColor: "#024f9d",
              color: "white",
            }}
          >
            Application Number
          </th>
          <th
            style={{
              border: "1px solid rgb(221, 221, 221)",
              padding: "12px 8px",
              textAlign: "left",
              backgroundColor: "#024f9d",
              color: "white",
            }}
          >
            Application Date
          </th>
          <th
            style={{
              border: "1px solid rgb(221, 221, 221)",
              padding: "12px 8px",
              textAlign: "left",
              backgroundColor: "#024f9d",
              color: "white",
            }}
          >
            Action
          </th>
          <th
            style={{
              border: "1px solid rgb(221, 221, 221)",
              padding: "12px 8px",
              textAlign: "left",
              backgroundColor: "#024f9d",
              color: "white",
            }}
          >
            Status
          </th>
        </tr>
        {data?.Licenses?.map((item, index) => {
          return (
            <tr key={`table${index}`}>
              <td style={{ border: "1px solid #ddd", padding: " 8px" }}>{item?.id}</td>
              <td style={{ border: "1px solid #ddd", padding: " 8px" }}>{item?.tenantId}</td>
              <td style={{ border: "1px solid #ddd", padding: " 8px" }}>{item?.businessService}</td>
              <td
                style={{ textDecoration: "underline blue 1px", cursor: "pointer", border: "1px solid #ddd", padding: " 8px" }}
                onClick={() => {
                  window.localStorage.setItem("ApplicationStatus", item?.status);
                  history.push({
                    pathname: "/digit-ui/citizen/obps/tab",
                    search: `?id=${item?.applicationNumber}`,
                  });
                }}
              >
                {item?.applicationNumber}
              </td>
              <td style={{ border: "1px solid #ddd", padding: " 8px" }}>{item?.applicationDate}</td>
              <td style={{ border: "1px solid #ddd", padding: " 8px" }}>{item?.action}</td>
              <td style={{ border: "1px solid #ddd", padding: " 8px" }}>{item?.status}</td>
            </tr>
          );
        })}
      </table> */}

      {/* <Col md={12} lg={12} mb={3}> */}
      <Paper sx={{ overflow: "hidden", marginY: 2 }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {/* <StyledTableCell >ID</StyledTableCell> */}
                <StyledTableCell>Tenant Id</StyledTableCell>
                <StyledTableCell>Business Service</StyledTableCell>
                <StyledTableCell>Application Number</StyledTableCell>
                <StyledTableCell>Application Date</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
                <StyledTableCell>status</StyledTableCell>
                <StyledTableCell> Payment Receipt</StyledTableCell>
                <StyledTableCell> Downlaod Application</StyledTableCell>
                <StyledTableCell>Withdraw</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.Licenses?.map((item, index) => {
                return (
                  <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    {/* <StyledTableCell component="th" scope="row">
                            {item?.id}
                            </StyledTableCell> */}
                    <StyledTableCell>{item?.tenantId}</StyledTableCell>
                    <StyledTableCell>{item?.businessService}</StyledTableCell>
                    <StyledTableCell
                      style={{ textDecoration: "underline blue 1px", cursor: "pointer", border: "1px solid #ddd", padding: " 8px" }}
                      onClick={() => {
                        window.localStorage.setItem("ApplicationStatus", item?.status);
                        history.push({
                          pathname: "/digit-ui/citizen/obps/tab",
                          search: `?id=${item?.applicationNumber}`,
                        });
                      }}
                    >
                      {item?.applicationNumber}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {convertEpochToDateDMY(item?.auditDetails?.createdTime)}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {item?.action}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {item?.status}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      <button type="button" class="btn btn-primary"></button>
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      <button type="button" class="btn btn-primary"></button>
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      <button type="button" class="btn btn-danger"></button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* </Col> */}
    </div>

    /* <Card>
              {Object.keys(application)
                .filter((e) => e !== "raw" && application[e] !== null)
                .map((item) => (
                  <KeyNote keyValue={t(item)} note={t(application[item])} />
                ))}
              <Link to={`/digit-ui/citizen/tl/tradelicence/application/${application?.applicationNumber}/${application?.tenantId}`}>
                <SubmitBar label={t(application?.raw?.status != "PENDINGPAYMENT" ? "TL_VIEW_DETAILS" : "TL_VIEW_DETAILS_PAY")} />
              </Link>
             
            </Card> */
    /* tradelicence/application/PG-TL-2021-09-07-002737/pg.citya */
  );
};
export default MyApplications;
