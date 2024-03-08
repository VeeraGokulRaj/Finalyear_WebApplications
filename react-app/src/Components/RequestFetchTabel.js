import React, { useState, useEffect } from "react";
import axios from "axios";

function RequestFetchTabel(props) {
  const [booleans, setBooleans] = useState({
    student: false,
    currentRequest: false,
    historyRequest: false
  });
  useEffect(
    () => {
      if (props.id.length === 8) {
        setBooleans(prevData => ({ ...prevData, student: true }));
      } else {
        props.historyRequestShow
          ? setBooleans(prevData => ({ ...prevData, historyRequest: true }))
          : setBooleans(prevData => ({ ...prevData, currentRequest: true }));
      }
    },
    [props.id, props.historyRequestShow]
  );
  const width = booleans.currentRequest ? { width: "50%" } : { width: "40%" };

  // request Accept
  async function requestAccept(regno, date, startTime, endTime) {
    // console.log(regno, "request Accept");
    try {
      const response = await axios.put("http://localhost:8002/faculty/requestAccept", {
        regno: regno,
        date: date,
        startTime: startTime,
        endTime: endTime
      });
      // console.log(response.data);
      if(response.data){
        window.alert("Requested Accepted")
      }
    } catch (error) {
      console.log("Error in rejecting request", error);
    }
  }

  // request Reject
  async function requestReject(regno, date, startTime, endTime) {
    // console.log(regno, date, startTime, endTime, "request Reject");
    try {
      const response = await axios.put("http://localhost:8002/faculty/requestReject", {
        regno: regno,
        date: date,
        startTime: startTime,
        endTime: endTime
      });
      // console.log(response.data);
      if (response.data) {
        window.alert("Requested Rejected");
      }
    } catch (error) {
      console.log("Error in rejecting request", error);
    }
  }

  return (
    <table style={{ borderCollapse: "collapse", margin: "auto", width, marginTop: "1.5rem" }}>
      <thead>
        <tr>
          <th style={tableHeaderCellStyle}>Name</th>
          <th style={tableHeaderCellStyle}>Regno</th>
          <th style={tableHeaderCellStyle}>Reason</th>
          <th style={tableHeaderCellStyle}>Date</th>
          <th style={tableHeaderCellStyle}>Start Time</th>
          <th style={tableHeaderCellStyle}>End Time</th>
          {booleans.student || booleans.historyRequest ? (
            <th style={tableHeaderCellStyle}>Status</th>
          ) : (
            <>
              <th style={tableHeaderCellStyle}>Accept</th>
              <th style={tableHeaderCellStyle}>Reject</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {props.data.map((data, index) => (
          <tr key={index}>
            <td style={tableCellStyle}>{data.name}</td>
            <td style={tableCellStyle}>{data.regno}</td>
            <td style={tableCellStyle}>{data.reason}</td>
            <td style={tableCellStyle}>{data.date}</td>
            <td style={tableCellStyle}>{data.startTime}</td>
            <td style={tableCellStyle}>{data.endTime}</td>
            {booleans.student || booleans.historyRequest ? (
              <td style={tableCellStyle}>{data.status}</td>
            ) : (
              <>
                <td style={tableCellStyle} onClick={() => requestAccept(data.regno, data.date, data.startTime, data.endTime)}>
                  Accept
                </td>
                <td style={tableCellStyle} onClick={() => requestReject(data.regno, data.date, data.startTime, data.endTime)}>
                  Reject
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const tableHeaderCellStyle = {
  border: "1px solid #000",
  padding: "5px",
  backgroundColor: "#f2f2f2"
};

const tableCellStyle = {
  border: "1px solid #000"
};

export default RequestFetchTabel;
