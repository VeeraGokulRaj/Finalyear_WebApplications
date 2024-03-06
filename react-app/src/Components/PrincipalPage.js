import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function PrincipalPage() {
  const location = useLocation();
  const principalId = location.state.formData.userId;

  // State to store the user Data
  const [principalData, setPrincipalData] = useState({
    college: "",
    email: "",
    name: "",
    principalImgUrl: ""
  });

  useEffect(
    () => {
      async function getPrincipanData() {
        try {
          const response = await axios.get("http://localhost:8004/principal/getPrincipalData", {
            params: { principalId: principalId }
          });
          setPrincipalData(response.data);
        } catch (error) {
          window.alert("Server Error \nCheck your Internet connection");
          console.error("Error fetching Principal data:", error);
        }
      }
      getPrincipanData();
    },
    [principalId]
  );
  return (
    <div className="principalPage">
      <h1 style={{ marginBottom: "1.5rem" }}>Principal Login</h1>
      <section className="principal-aontainer" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {principalData && (
          <section className="principalDataContent">
            <p>
              Name: {principalData.name} <br />
            </p>
            <p>
              Principal ID: {principalId} <br />
            </p>
            <p>
              Email: {principalData.email} <br />
            </p>
            <p>
              College: {principalData.college} <br />
            </p>
          </section>
        )}
        <section className="principal-img" style={{}}>
          {principalData.principalImgUrl && (
            <img
              src={principalData.principalImgUrl}
              alt={`Student ${principalId} Img`}
              style={{ width: "150px", height: "150px", borderRadius: "500px" }}
            />
          )}
        </section>
      </section>
    </div>
  );
}

export default PrincipalPage;
