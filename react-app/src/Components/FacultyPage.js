import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function FacultyPage() {
  //extracting the users ID
  const location = useLocation();
  const facultyId = location.state.formData.userId;

  // State to store the user Data
  const [facultyData, setfacultyData] = useState({
    department: "",
    name: "",
    section: "",
    year: "",
    facultyImgUrl: ""
  });

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
    </div>
  );
}

export default FacultyPage;
