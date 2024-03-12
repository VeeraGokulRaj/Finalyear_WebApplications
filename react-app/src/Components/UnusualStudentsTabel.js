import React, { useState, useEffect } from "react";
import axios from "axios";

function UnusualStudentsTabel(props) {
  // remove the student
  async function removeUnusualSeekedStudent(data) {
    try {
      const response = await axios.put("http://localhost:8002/faculty/removeUnusualSeekedStudent", {
        data: data
      });
      //   console.log(data);
      if (response.data) {
        window.alert("Data Removed");
      } else {
        window.alert("erroe in removing data");
      }
    } catch (error) {
      console.log("Error in removing the student", error);
    }
  }

  return (
    <table style={{ borderCollapse: "collapse", margin: "auto", width: "25%", marginTop: "1.5rem" }}>
      <thead>
        <tr>
          <th style={tableHeaderCellStyle}>Image</th>
          <th style={tableHeaderCellStyle}>Remove</th>
        </tr>
      </thead>
      <tbody>
        {props.data.map((data, index) => (
          <tr key={index}>
            <td style={tableCellStyle}>
              <img
                src={data.url}
                style={{ height: "100px", width: "100px", paddingTop: "5px" }}
                alt={`${data.name} ${data.last_seeked} Seeked Img`}
              />
            </td>
            <td style={tableCellStyle} onClick={() => removeUnusualSeekedStudent(data)}>
              Remove
            </td>
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

export default UnusualStudentsTabel;
