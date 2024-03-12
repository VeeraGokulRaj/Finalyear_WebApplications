import React, { useState, useEffect } from "react";
import axios from "axios";

function StudentRecordTable(props) {
  const [booleans, setBooleans] = useState({
    hodId: false
  });
  useEffect(
    () => {
      // console.log(props);
      if (props.id && props.id.length === 5) {
        setBooleans(prevData => ({ ...prevData, hodId: true }));
      }
    },
    [props.id]
  );
  // remove the student
  async function removeStudent(studentData) {
    try {
      const response = await axios.put("http://localhost:8003/hod/removeStudent", {
        studentData: studentData,
        hodId: props.id
      });
      // console.log(response.data);
      if (response.data) {
        window.alert("Data Removed");
      }
    } catch (error) {
      console.log("Error in removing the student");
    }
    // console.log(studentData);
  }
  return (
    <table style={{ borderCollapse: "collapse", margin: "auto", width: "70%", marginTop: "1.5rem" }}>
      <thead>
        <tr>
          <th style={tableHeaderCellStyle}>Name</th>
          <th style={tableHeaderCellStyle}>Regno</th>
          <th style={tableHeaderCellStyle}>Year</th>
          <th style={tableHeaderCellStyle}>Section</th>
          <th style={tableHeaderCellStyle}>Department</th>
          <th style={tableHeaderCellStyle}>Seeked-Date & Time</th>
          <th style={tableHeaderCellStyle}>Image</th>
          {booleans.hodId && <th style={tableHeaderCellStyle}>Remove</th>}
        </tr>
      </thead>
      <tbody>
        {props.data.map((data, index) => (
          <tr key={index}>
            <td style={tableCellStyle}>{data.name}</td>
            <td style={tableCellStyle}>{data.regno}</td>
            <td style={tableCellStyle}>{data.year}</td>
            <td style={tableCellStyle}>{data.section}</td>
            <td style={tableCellStyle}>{data.major}</td>
            <td style={tableCellStyle}>{data.last_seeked}</td>
            <td style={tableCellStyle}>
              <img
                src={data.studentImgUrl}
                style={{ height: "100px", width: "100px", paddingTop: "5px" }}
                alt={`${data.name} ${data.last_seeked} Seeked Img`}
              />
            </td>
            {booleans.hodId && (
              <td style={tableCellStyle} onClick={() => removeStudent(data)}>
                Remove
              </td>
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
  // padding: "3px",
};

export default StudentRecordTable;
