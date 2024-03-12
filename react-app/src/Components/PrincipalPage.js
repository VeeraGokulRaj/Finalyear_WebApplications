import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import RecordsFetchTabel from "./RecordsFetchTabel";

function PrincipalPage() {
  const location = useLocation();
  const principalId = location.state.formData.userId;

  const [principalData, setPrincipalData] = useState({});
  const [seekdItStudents, setSeekedItStudents] = useState([]);
  const [seekdCseStudents, setSeekedCseStudents] = useState([]);
  const [studentDataByRegno, setStudentDataByRegno] = useState([]);
  const [findByRegno, setFindByRegno] = useState({ regno: "" });

  const [selectItFormData, setselectItFormData] = useState({
    firstYearSectionA: false,
    firstYearSectionB: false,
    secondYearSectionA: false,
    secondYearSectionB: false,
    thirdYearSectionA: false,
    thirdYearSectionB: false,
    finalYearSectionA: false,
    finalYearSectionB: false
  });
  const [selectCseFormData, setSelectCseFormData] = useState({
    firstYearSectionA: false,
    firstYearSectionB: false,
    secondYearSectionA: false,
    secondYearSectionB: false,
    thirdYearSectionA: false,
    thirdYearSectionB: false,
    finalYearSectionA: false,
    finalYearSectionB: false
  });
  const [booleans, setBooleans] = useState({
    showForms: false,
    seekedItStudentIsEmpty: false,
    seekedCseStudentIsEmpty: false,
    findByRegnoIsEmpty: false
  });

  function selectClassAndSectionForm() {
    setBooleans(prevData => ({ ...prevData, showForms: !prevData.showForms }));
  }
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

  // Setting data to the It select state
  function itHandelChange(event) {
    const { name, value, type, checked } = event.target;
    setselectItFormData(prevData => {
      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value
      };
    });
    // console.log(selectItFormData);
  }
  // Setting data to the CSE select state
  function cseHandelChange(event) {
    const { name, type, checked } = event.target;
    setSelectCseFormData(prevData => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : event.target.value
    }));
  }

  // getting IT Student data
  async function getItData(event) {
    event.preventDefault();
    if (
      selectItFormData.firstYearSectionA ||
      selectItFormData.firstYearSectionB ||
      selectItFormData.secondYearSectionA ||
      selectItFormData.secondYearSectionB ||
      selectItFormData.thirdYearSectionA ||
      selectItFormData.thirdYearSectionB ||
      selectItFormData.finalYearSectionA ||
      selectItFormData.finalYearSectionB
    ) {
      const response = await axios.get("http://localhost:8004/principal/getItData", {
        params: { selectFormData: selectItFormData, principalId: principalId }
      });
      // console.log(response.data);
      if (response.data.length === 0) {
        setBooleans(prevData => ({
          ...prevData,
          seekedItStudentIsEmpty: true
        }));
        return;
      }
      setSeekedItStudents(response.data);
    } else {
      window.alert("Select any field");
    }
  }

  // getting CSE Student data
  async function getCseData(event) {
    event.preventDefault();
    if (
      selectCseFormData.firstYearSectionA ||
      selectCseFormData.firstYearSectionB ||
      selectCseFormData.secondYearSectionA ||
      selectCseFormData.secondYearSectionB ||
      selectCseFormData.thirdYearSectionA ||
      selectCseFormData.thirdYearSectionB ||
      selectCseFormData.finalYearSectionA ||
      selectCseFormData.finalYearSectionB
    ) {
      const response = await axios.get("http://localhost:8004/principal/getCseData", {
        params: { selectFormData: selectCseFormData, principalId: principalId }
      });
      // console.log(response.data);
      if (response.data.length === 0) {
        setBooleans(prevData => ({
          ...prevData,
          seekedCseStudentIsEmpty: true
        }));
        return;
      }
      setSeekedCseStudents(response.data);
    } else {
      window.alert("Select any field");
    }
  }

  // Find by regno
  function findRegnoChange(event) {
    const { name, value, type, checked } = event.target;
    setFindByRegno(prevData => {
      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value
      };
    });
    // console.log(findByRegno);
  }

  // get Data by reg no
  async function getDataByRegno(event) {
    event.preventDefault();
    if (findByRegno.regno !== "") {
      try {
        const response = await axios.get("http://localhost:8004/principal/getDataByRegno", {
          params: { regno: findByRegno.regno }
        });
        if (!response.data || response.status === 401) {
          window.alert("Invalid user name");
          return;
        }
        if (response.data.length === 0) {
          setBooleans(prevData => ({ ...prevData, findByRegnoIsEmpty: true }));
        }
        setStudentDataByRegno(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log("Error in fetching Data by Regno", error);
      }
    } else {
      window.alert("Ensure Regno");
    }
  }

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
      {/* View seeked students history */}
      <div>
        <button onClick={selectClassAndSectionForm}>Seeked Students</button>
        <br />
        {booleans.showForms && (
          <div>
            <br />
            {/* IT section */}
            <section>
              <form className="request-form">
                <label htmlFor="FirstYearA">FirstYear A:</label>
                <input
                  type="checkbox"
                  checked={selectItFormData.firstYearSectionA}
                  onChange={itHandelChange}
                  id="FirstYearA"
                  name="firstYearSectionA"
                />

                <label htmlFor="FirstYearB">FirstYear B:</label>
                <input
                  type="checkbox"
                  checked={selectItFormData.firstYearSectionB}
                  onChange={itHandelChange}
                  id="FirstYearB"
                  name="firstYearSectionB"
                />

                <label htmlFor="SecondYearA">SecondYear A:</label>
                <input
                  type="checkbox"
                  checked={selectItFormData.secondYearSectionA}
                  onChange={itHandelChange}
                  id="SecondYearA"
                  name="secondYearSectionA"
                />
                <label htmlFor="SecondYearB">SecondYear B:</label>
                <input
                  type="checkbox"
                  checked={selectItFormData.secondYearSectionB}
                  onChange={itHandelChange}
                  id="SecondYearB"
                  name="secondYearSectionB"
                />
                <label htmlFor="ThirdYearA">ThirdYear A:</label>
                <input
                  type="checkbox"
                  checked={selectItFormData.thirdYearSectionA}
                  onChange={itHandelChange}
                  id="ThirdYearA"
                  name="thirdYearSectionA"
                />
                <label htmlFor="ThirdYearB">ThirdYear B:</label>
                <input
                  type="checkbox"
                  checked={selectItFormData.thirdYearSectionB}
                  onChange={itHandelChange}
                  id="ThirdYearB"
                  name="thirdYearSectionB"
                />
                <label htmlFor="FinalYearA">FinalYear A:</label>
                <input
                  type="checkbox"
                  checked={selectItFormData.finalYearSectionA}
                  onChange={itHandelChange}
                  id="FinalYearA"
                  name="finalYearSectionA"
                />
                <label htmlFor="FinalYearB">FinalYear B:</label>
                <input
                  type="checkbox"
                  checked={selectItFormData.finalYearSectionB}
                  onChange={itHandelChange}
                  id="FinalYearB"
                  name="finalYearSectionB"
                />
                <button onClick={getItData}>Proceed</button>
                <div>
                  {booleans.seekedItStudentIsEmpty ? (
                    <h2>No Record is Not Found!!</h2>
                  ) : (
                    <RecordsFetchTabel data={seekdItStudents} />
                  )}
                </div>
              </form>
            </section>
            <br />
            {/* CSE Section */}
            <section>
              <form className="request-form">
                <label htmlFor="CseFirstYearA">FirstYear A:</label>
                <input
                  type="checkbox"
                  checked={selectCseFormData.firstYearSectionA}
                  onChange={cseHandelChange}
                  id="CseFirstYearA"
                  name="firstYearSectionA"
                />

                <label htmlFor="CseFirstYearB">FirstYear B:</label>
                <input
                  type="checkbox"
                  checked={selectCseFormData.firstYearSectionB}
                  onChange={cseHandelChange}
                  id="CseFirstYearB"
                  name="firstYearSectionB"
                />

                <label htmlFor="CseSecondYearA">SecondYear A:</label>
                <input
                  type="checkbox"
                  checked={selectCseFormData.secondYearSectionA}
                  onChange={cseHandelChange}
                  id="CseSecondYearA"
                  name="secondYearSectionA"
                />

                <label htmlFor="CseSecondYearB">SecondYear B:</label>
                <input
                  type="checkbox"
                  checked={selectCseFormData.secondYearSectionB}
                  onChange={cseHandelChange}
                  id="CseSecondYearB"
                  name="secondYearSectionB"
                />

                <label htmlFor="CseThirdYearA">ThirdYear A:</label>
                <input
                  type="checkbox"
                  checked={selectCseFormData.thirdYearSectionA}
                  onChange={cseHandelChange}
                  id="CseThirdYearA"
                  name="thirdYearSectionA"
                />

                <label htmlFor="CseThirdYearB">ThirdYear B:</label>
                <input
                  type="checkbox"
                  checked={selectCseFormData.thirdYearSectionB}
                  onChange={cseHandelChange}
                  id="CseThirdYearB"
                  name="thirdYearSectionB"
                />

                <label htmlFor="CseFinalYearA">FinalYear A:</label>
                <input
                  type="checkbox"
                  checked={selectCseFormData.finalYearSectionA}
                  onChange={cseHandelChange}
                  id="CseFinalYearA"
                  name="finalYearSectionA"
                />

                <label htmlFor="CseFinalYearB">FinalYear B:</label>
                <input
                  type="checkbox"
                  checked={selectCseFormData.finalYearSectionB}
                  onChange={cseHandelChange}
                  id="CseFinalYearB"
                  name="finalYearSectionB"
                />

                <button onClick={getCseData}>Proceed</button>
                <div>
                  {booleans.seekedCseStudentIsEmpty ? (
                    <h2>No Record is Not Found!!</h2>
                  ) : (
                    <RecordsFetchTabel data={seekdCseStudents} />
                  )}
                </div>
              </form>
            </section>
            <br />
            {/* Find by regno */}
            <div>
              <input
                type="text"
                placeholder="Regno"
                required
                name="regno"
                onChange={findRegnoChange}
                value={findByRegno.regno}
              />

              <br />
              <button onClick={getDataByRegno}>Get data</button>
              {booleans.findByRegnoIsEmpty ? (
                <h2>No Record is Not Found!!</h2>
              ) : (
                <RecordsFetchTabel data={studentDataByRegno} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrincipalPage;
