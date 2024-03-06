import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function HodPage() {
  const location = useLocation();
  const hodId = location.state.formData.userId;

  // State to store the user Data
  const [hodData, setHodData] = useState({
    department: "",
    email: "",
    name: "",
    hodImgUrl: ""
  });

  useEffect(
    () => {
      async function getHodData() {
        try {
          const response = await axios.get("http://localhost:8003/hod/getHodData", {
            params: { hodId: hodId }
          });
          setHodData(response.data);
        } catch (error) {
          window.alert("Server Error \nCheck your Internet connection");
          console.error("Error fetching HOD data:", error);
        }
      }

      getHodData();
    },
    [hodId]
  );
  return (
    <div className="facultyPage">
      <h1 style={{ marginBottom: "1.5rem" }}>HOD Login</h1>
      <div className="hod-container" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {hodData && (
          <section className="hodDataContent">
            <p>
              Name: {hodData.name} <br />
            </p>
            <p>
              HOD ID: {hodId} <br />
            </p>
            <p>
              Email: {hodData.email} <br />
            </p>
            <p>
              Department: {hodData.department} <br />
            </p>
          </section>
        )}
        <section className="hod-img" style={{}}>
          {hodData.hodImgUrl && (
            <img
              src={hodData.hodImgUrl}
              alt={`Student ${hodId} Img`}
              style={{ width: "150px", height: "150px", borderRadius: "500px" }}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default HodPage;
