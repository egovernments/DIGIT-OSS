import React, { useMemo, useState, useEffect } from "react";
import axios from 'axios';
import Table from "./Table";

function Main() {

    const [data, setData] = useState([]);

    // Using useEffect to call the API once mounted and set the data
    useEffect(() => {
      (async () => {
        const result = await axios("https://62f0e3e5e2bca93cd23f2ada.mockapi.io/birth");
        setData(result.data);
        console.log("gooo" ,result.data);
      })();
    }, []);
  /* 
    - Columns is a simple array right now, but it will contain some logic later on. It is recommended by react-table to memoize the columns data
    - Here in this example, we have grouped our columns into two headers. react-table is flexible enough to create grouped table headers
  */
  const columns = useMemo(
    () => [
      {
        // first group - TV Show
        Header: "TV Show",
        // First group columns
        columns: [
          {
            Header: "Name",
            accessor: "babyFirstName"
          },
          {
            Header: "Type",
            accessor: "babyLastName"
          }
        ]
      },
      {
        // Second group - Details
        Header: "Details",
        // Second group columns
        columns: [
          {
            Header: "Language",
            accessor: "permanentCity"
          },
      
        ]
      }
    ],
    []
  );

  

  return (
    <div className="App">
      <Table columns={columns} data={data} />
    </div>
  );
}

export default Main;