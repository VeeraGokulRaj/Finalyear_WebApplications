import React, { useState, useEffect } from "react";
import RecordsFetchTabel from "./RecordsFetchTabel";
import RequestFetchTabel from "./RequestFetchTabel";
import axios from "axios";
import { useLocation } from "react-router-dom";

function StudentPage() {
  //extracting the users ID
  const location = useLocation();
  const studentId = location.state.formData.userId;

  // State to store the user Data
  const [studentData, setStudentData] = useState([]);
  const [studentSeekedData, setStudentSeekedData] = useState([]);
  const [studentRequestData, setStudentRequestData] = useState([]);
  const [booleans, setBooleans] = useState({
    recordShow: false,
    isEmpty: false, //Refers to student data
    showRequestForm: false,
    showRequestTabel: false,
    requestIsEmpty: false,
    requestShow: false
  });
  const [requestFormData, setRequestFormData] = useState({
    regno: "",
    reason: "",
    checked: false,
    startTime: "",
    endTime: ""
  });

  // Get the Student Data
  useEffect(
    () => {
      async function getStudentData() {
        try {
          const response = await axios.get("http://localhost:8001/student/getStudentData", {
            params: { studentId: studentId }
          });
          setStudentData(response.data);
        } catch (error) {
          window.alert("Server Error \nCheck your Internet connection");
          console.error("Error fetching student data:", error);
        }
      }
      getStudentData();
    },
    [studentId]
  );

  // Get student seeked record
  async function getStudentSeekedRecord() {
    try {
      const response = await axios.get("http://localhost:8001/student/getStudentSeekedRecord", {
        params: { studentId: studentId }
      });
      if (response.data.length === 0) {
        setBooleans(previousData => ({
          ...previousData,
          isEmpty: !previousData.isEmpty
        }));
        return;
      }
      setStudentSeekedData(response.data);
      setBooleans(previousData => ({
        ...previousData,
        recordShow: !previousData.recordShow
      }));
    } catch (error) {
      console.log("Error in fetching Data", error);
    }
  }

  // Setting data to the request state
  function handelChange(event) {
    const { name, value, type, checked } = event.target;
    setRequestFormData(prevData => {
      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value
      };
    });
    // console.log(requestFormData.startTime, requestFormData.endTime);
  }

  useEffect(() => {}, [requestFormData.checked]);

  // Viewing the requesting form
  function viewRequestForm() {
    setBooleans(previousData => ({
      ...previousData,
      showRequestForm: !previousData.showRequestForm
    }));
  }

  // posting the new request
  async function postNewRequest(event) {
    event.preventDefault();
    try {
      if (
        !requestFormData.checked ||
        requestFormData.time === "" ||
        requestFormData.reason === "" ||
        requestFormData.regno === "" ||
        requestFormData.endTime === ""
      ) {
        !requestFormData.checked ? window.alert("Check the check box") : window.alert("Fill all the feild");
        return;
      }
      const response = await axios.post("http://localhost:8001/student/postNewRequest", {
        studentId: requestFormData.regno,
        reason: requestFormData.reason,
        regno: studentId,
        startTime: requestFormData.startTime,
        endTime: requestFormData.endTime,
        name: studentData.name
        // name: studentData.name
      });
      // console.log(response.data);
      // console.log(studentData);
      if (response.data) {
        window.alert("Request submitted");
      }
    } catch (error) {
      window.alert("Ensure user Details");
      console.error("Error during login:", error);
    }
  }

  // fetching the student request
  async function getStudentRequestRecord(event) {
    event.preventDefault();
    try {
      const response = await axios.get("http://localhost:8001/student/getStudentRequestRecord", {
        params: { studentId: studentId }
      });
      console.log(response.data);
      if (response.data.length === 0) {
        setBooleans(previousData => ({
          ...previousData,
          requestIsEmpty: !previousData.requestIsEmpty
        }));
        return;
      }
      setStudentRequestData(response.data);
      setBooleans(previousData => ({
        ...previousData,
        requestShow: !previousData.requestShow
      }));
    } catch (error) {
      console.log("Error in fetching Data", error);
    }
  }

  return (
    <div className="studentPage">
      <h1 style={{ marginBottom: "1.5rem" }}>Student Login</h1>
      {studentData && (
        <section className="student-container" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div className="student-content">
            <p>
              Name: {studentData.name} <br />
            </p>
            <p>
              Regno: {studentId} <br />
            </p>
            <p>
              Seeked: {studentData.numberOf_time_seeked} <br />
            </p>
            <p>
              Year: {studentData.year} <br />
            </p>
            <p>
              Section: {studentData.section} <br />
            </p>
            <p>
              Department: {studentData.major} <br />
            </p>
          </div>
          <div className="student-img" style={{}}>
            {studentData.studentImgUrl && (
              <img
                src={studentData.studentImgUrl}
                alt={`Student ${studentId} Img`}
                style={{ width: "150px", height: "150px", borderRadius: "500px" }}
              />
            )}
          </div>
        </section>
      )}

      {/* Student seekd data image Tabel */}
      <section>
        <button onClick={getStudentSeekedRecord}>Seeked History</button>
        {booleans.isEmpty && <h2>No Record Found!!</h2>}
        {booleans.recordShow && <RecordsFetchTabel data={studentSeekedData} />}
      </section>

      {/* Request part */}
      <section>
        <button onClick={viewRequestForm}>Request</button>
        {booleans.showRequestForm && (
          <form className="request-form">
            <input
              type="text"
              placeholder="Regno"
              required
              name="regno"
              onChange={handelChange}
              value={requestFormData.regno}
            />
            <br />
            <textarea
              name="reason"
              cols="20"
              rows="5"
              placeholder="Reason"
              required
              onChange={handelChange}
              value={requestFormData.reason}
            />
            <br />
            <input
              type="time"
              placeholder="Regno"
              required
              name="startTime"
              onChange={handelChange}
              value={requestFormData.startTime}
            />
            <input
              type="time"
              placeholder="Regno"
              required
              name="endTime"
              onChange={handelChange}
              value={requestFormData.endTime}
            />
            <br />
            <input type="checkbox" checked={requestFormData.checked} onChange={handelChange} name="checked" />
            <br />
            <button onClick={postNewRequest}>Submit</button>
          </form>
        )}
      </section>

      {/* request fetch tabel */}
      <section>
        <button onClick={getStudentRequestRecord}>Check status</button>
        {booleans.requestIsEmpty && <h2>No RecordFound!!</h2>}
        {booleans.requestShow && <RequestFetchTabel data={studentRequestData} id = {studentId}/>}
      </section>
    </div>
  );
}

export default StudentPage;
