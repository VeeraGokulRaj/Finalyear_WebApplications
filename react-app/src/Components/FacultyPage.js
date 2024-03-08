import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import RecordsFetchTabel from "./RecordsFetchTabel";
import RequestFetchTabel from "./RequestFetchTabel";

function FacultyPage() {
  //extracting the users ID
  const location = useLocation();
  const facultyId = location.state.formData.userId;

  // State to store the user Data
  const [facultyData, setfacultyData] = useState([]);
  const [studentSeekedListData, setStudentSeekedListData] = useState([]);
  const [studentCurrentRequestData, setStudentCurrentRequestData] = useState([]);
  const [studentHistoryRequestData, setStudentHistoryRequestData] = useState([]);
  const [booleans, setBooleans] = useState({
    recordShow: false,
    isEmpty: false, //seeked student data
    currentRequestIsEmpty: false,
    currentRequestShow: false,
    historyRequestIsEmpty: false,
    historyRequestShow: false
  });

  //Get the Faculty Data
  useEffect(
    () => {
      async function getFacultyData() {
        try {
          const response = await axios.get("http://localhost:8002/faculty/getfacultyData", {
            params: { facultyId: facultyId }
          });
          setfacultyData(response.data);
        } catch (error) {
          window.alert("Server Error \nCheck your Internet connection");
          console.error("Error fetching faculty data:", error);
        }
      }

      getFacultyData();
    },
    [facultyId]
  );

  // Get list of Seeked student data
  async function getStudentSeekedListRecord() {
    try {
      const response = await axios.get("http://localhost:8002/faculty/getStudentSeekedListRecord", {
        params: { facultyId: facultyId }
      });
      if (response.data.length === 0) {
        setBooleans(prevData => ({
          ...prevData,
          isEmpty: !prevData.isEmpty
        }));
        return;
      }
      setStudentSeekedListData(response.data);
      setBooleans(prevData => ({
        ...prevData,
        recordShow: !prevData.recordShow
      }));
    } catch (error) {
      console.log("Error in fetching Data", error);
    }
  }

  // getting current request
  async function getCurrentRequest() {
    try {
      const response = await axios.get("http://localhost:8002/faculty/getCurrentRequest", {
        params: { facultyId: facultyId }
      });
      // console.log(response.data);
      if (response.data.length === 0) {
        setBooleans(prevData => ({
          ...prevData,
          currentRequestIsEmpty: !prevData.currentRequestIsEmpty
        }));
        return;
      }
      setStudentCurrentRequestData(response.data);
      setBooleans(prevData => ({
        ...prevData,
        currentRequestShow: !prevData.currentRequestShow
      }));
    } catch (error) {
      console.log("Error in fetching Data", error);
    }
  }

  // get history records
  async function getHistoryRequest() {
    try {
      const response = await axios.get("http://localhost:8002/faculty/getHistoryRequest", {
        params: { facultyId: facultyId }
      });
      // console.log(response.data);
      if (response.data.length === 0) {
        setBooleans(prevData => ({
          ...prevData,
          historyRequestIsEmpty: !prevData.historyRequestIsEmpty
        }));
        return;
      }
      setStudentHistoryRequestData(response.data);
      setBooleans(prevData => ({
        ...prevData,
        historyRequestShow: !prevData.historyRequestShow
      }));
    } catch (error) {
      console.log("Error in fetching Data", error);
    }
  }
  return (
    <div className="facultyPage">
      <h1 style={{ marginBottom: "1.5rem" }}>Faculty Login</h1>
      <div className="faculty-container" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {facultyData && (
          <section>
            <p>
              Name: {facultyData.name} <br />
            </p>
            <p>
              Faculty ID: {facultyId} <br />
            </p>
            <p>
              Section: {facultyData.section} <br />
            </p>
            <p>
              Department: {facultyData.department} <br />
            </p>
          </section>
        )}
        <section className="faculty-img" style={{}}>
          {facultyData.facultyImgUrl && (
            <img
              src={facultyData.facultyImgUrl}
              alt={`Student ${facultyId} Img`}
              style={{ width: "150px", height: "150px", borderRadius: "500px" }}
            />
          )}
        </section>
      </div>

      {/* Student image Tabel */}
      <section>
        <button onClick={getStudentSeekedListRecord}>Seeked History</button>
        {booleans.isEmpty && <h2>No Record is Not Found!!</h2>}
        {booleans.recordShow && <RecordsFetchTabel data={studentSeekedListData} />}
      </section>

      {/* view current request */}
      <section>
        <button onClick={getCurrentRequest}>Current Request</button>
        {booleans.currentRequestIsEmpty && <h2>No RecordFound!!</h2>}
        {booleans.currentRequestShow && (
          <RequestFetchTabel data={studentCurrentRequestData} id={facultyId} currentRequestShow={booleans.currentRequestShow} />
        )}
      </section>

      {/* view history records */}
      <section>
        <button onClick={getHistoryRequest}>History records</button>
        {booleans.historyRequestIsEmpty && <h2>No RecordFound!!</h2>}
        {booleans.historyRequestShow && (
          <RequestFetchTabel data={studentHistoryRequestData} id={facultyId} historyRequestShow={booleans.historyRequestShow} />
        )}
      </section>
    </div>
  );
}

export default FacultyPage;
