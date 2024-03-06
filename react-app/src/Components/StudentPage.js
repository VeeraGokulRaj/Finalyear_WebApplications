import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function StudentPage() {
  //extracting the users ID
  const location = useLocation();
  const studentId = location.state.formData.userId;

  // State to store the user Data
  const [studentData, setStudentData] = useState({
    last_seeked: "",
    major: "",
    name: "",
    numberOf_time_seeked: "",
    section: "",
    year: "",
    studentImgUrl: ""
  });

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
    </div>
  );
}

export default StudentPage;
