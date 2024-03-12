import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import RecordsFetchTabel from "./RecordsFetchTabel";
import UnusualStudentsTabel from "./UnusualStudentsTabel";

function HodPage() {
  const location = useLocation();
  const hodId = location.state.formData.userId;

  // State to store the user Data
  const [hodData, setHodData] = useState({});
  const [selectFormData, setSelectFormData] = useState({
    firstYearSectionA: false,
    firstYearSectionB: false,
    secondYearSectionA: false,
    secondYearSectionB: false,
    thirdYearSectionA: false,
    thirdYearSectionB: false,
    finalYearSectionA: false,
    finalYearSectionB: false
  });
  const [findByRegno, setFindByRegno] = useState({ regno: "" });
  const [selectedSeekedStudents, setSelectedSeekedStudents] = useState([]);
  const [unusualSeekedStudentsdata, setUnusualSeekedStudentsdata] = useState([]);
  const [studentDataByRegno, setStudentDataByRegno] = useState([]);
  const [booleans, setBooleans] = useState({
    // showForm: false,
    selectedSeekedStudentIsEmpty: false,
    // findByRegno: false,
    findByRegnoIsEmpty: false,
    showUnusualSeekedStudents: false,
    unusualSeekedStudentsIsEmpty: false
  });

  // Setting data to the select state
  function handelChange(event) {
    const { name, value, type, checked } = event.target;
    setSelectFormData(prevData => {
      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value
      };
    });
    // console.log(selectFormData);
  }

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

  // select Class And Section Form
  async function selectClassAndSectionForm() {
    setBooleans(prevData => ({ ...prevData, showForm: !prevData.showForm }));
  }
  async function getData(event) {
    event.preventDefault();
    if (
      selectFormData.firstYearSectionA ||
      selectFormData.firstYearSectionB ||
      selectFormData.secondYearSectionA ||
      selectFormData.secondYearSectionB ||
      selectFormData.thirdYearSectionA ||
      selectFormData.thirdYearSectionB ||
      selectFormData.finalYearSectionA ||
      selectFormData.finalYearSectionB
    ) {
      // console.log("Data fetching...");
      const response = await axios.get("http://localhost:8003/hod/getData", {
        params: { selectFormData: selectFormData, hodId: hodId }
      });
      // console.log(response.data);

      if (response.data.length === 0) {
        setBooleans(prevData => ({
          ...prevData,
          selectedSeekedStudentIsEmpty: true
        }));
        return;
      }
      setSelectedSeekedStudents(response.data);
    } else {
      window.alert("Select any field");
    }
  }

  // Find by regno data to state
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
  //  Data by Regno
  async function getDataByRegno(event) {
    event.preventDefault();
    if (findByRegno.regno !== "" && findByRegno.regno.includes(hodId)) {
      try {
        const response = await axios.get("http://localhost:8003/hod/getDataByRegno", {
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

  // getting tt Unusual Seeked Students
  async function getUnusualSeekedStudents() {
    // console.log("getUnusualSeekedStudents");
    try {
      const response = await axios.get("http://localhost:8002/faculty/getUnusualSeekedStudents");
      // console.log(response.data);
      if (response.data.length === 0) {
        setBooleans(prevData => ({
          ...prevData,
          unusualSeekedStudentsIsEmpty: true
        }));
        return;
      }
      setUnusualSeekedStudentsdata(response.data);
      setBooleans(prevData => ({
        ...prevData,
        showUnusualSeekedStudents: !prevData.showUnusualSeekedStudents
      }));
    } catch (error) {
      console.log("Error in fetching Data", error);
    }
  }
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

      {/* View seeked students history */}
      <div>
        <button onClick={selectClassAndSectionForm}>Seeked Students</button>

        <br />
        <br />
        {/* {booleans.showForm && ( */}
        <section>
          <form className="request-form">
            <label htmlFor="FirstYearA">FirstYear A:</label>
            <input
              type="checkbox"
              checked={selectFormData.firstYearSectionA}
              onChange={handelChange}
              id="FirstYearA"
              name="firstYearSectionA"
            />

            <label htmlFor="FirstYearB">FirstYear B:</label>
            <input
              type="checkbox"
              checked={selectFormData.firstYearSectionB}
              onChange={handelChange}
              id="FirstYearB"
              name="firstYearSectionB"
            />

            <label htmlFor="SecondYearA">SecondYear A:</label>
            <input
              type="checkbox"
              checked={selectFormData.secondYearSectionA}
              onChange={handelChange}
              id="SecondYearA"
              name="secondYearSectionA"
            />
            <label htmlFor="SecondYearB">SecondYear B:</label>
            <input
              type="checkbox"
              checked={selectFormData.secondYearSectionB}
              onChange={handelChange}
              id="SecondYearB"
              name="secondYearSectionB"
            />
            <label htmlFor="ThirdYearA">ThirdYear A:</label>
            <input
              type="checkbox"
              checked={selectFormData.thirdYearSectionA}
              onChange={handelChange}
              id="ThirdYearA"
              name="thirdYearSectionA"
            />
            <label htmlFor="ThirdYearB">ThirdYear B:</label>
            <input
              type="checkbox"
              checked={selectFormData.thirdYearSectionB}
              onChange={handelChange}
              id="ThirdYearB"
              name="thirdYearSectionB"
            />
            <label htmlFor="FinalYearA">FinalYear A:</label>
            <input
              type="checkbox"
              checked={selectFormData.finalYearSectionA}
              onChange={handelChange}
              id="FinalYearA"
              name="finalYearSectionA"
            />
            <label htmlFor="FinalYearB">FinalYear B:</label>
            <input
              type="checkbox"
              checked={selectFormData.finalYearSectionB}
              onChange={handelChange}
              id="FinalYearB"
              name="finalYearSectionB"
            />
            <button onClick={getData}>Proceed</button>
            <div>
              {booleans.selectedSeekedStudentIsEmpty ? (
                <h2>No Record is Not Found!!</h2>
              ) : (
                <RecordsFetchTabel data={selectedSeekedStudents} id={hodId} />
              )}
            </div>
          </form>
          <br />
          <div>
            <input type="text" placeholder="Regno" required name="regno" onChange={findRegnoChange} value={findByRegno.regno} />
            <button onClick={getDataByRegno}>Get data</button>
            {booleans.findByRegnoIsEmpty ? (
              <h2>No Record is Not Found!!</h2>
            ) : (
              <RecordsFetchTabel data={studentDataByRegno} id={hodId} />
            )}
          </div>
        </section>
        <br />
        <br />
        {/* Unusual Seeked Students */}
        <section>
        <button onClick={getUnusualSeekedStudents}>Unusual Seeked students</button>
        {booleans.unusualSeekedStudentsIsEmpty && <h2>No recoed found</h2>}
        {booleans.showUnusualSeekedStudents && <UnusualStudentsTabel data = {unusualSeekedStudentsdata}/>}
      </section>
      </div>
    </div>
  );
}

export default HodPage;
