import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import RecordsFetchTabel from "./RecordsFetchTabel";
import UnusualStudentsTabel from "./UnusualStudentsTabel";

function HodPage(props) {
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
  const [timeAlter, setTimeAlter] = useState({
    startTime: "",
    endTime: "",
    firstYearSectionA: false,
    firstYearSectionB: false,
    secondYearSectionA: false,
    secondYearSectionB: false,
    thirdYearSectionA: false,
    thirdYearSectionB: false,
    finalYearSectionA: false,
    finalYearSectionB: false,
    showAlterTimeForm: false
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
    unusualSeekedStudentsIsEmpty: false,
    showSeekedData: false,
    showRegnoForm: false
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
  //Setting data to Time Alter state
  function timeAlterChange(event) {
    const { name, value, type, checked } = event.target;
    setTimeAlter(prevData => {
      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value
      };
    });
    // console.log(timeAlter);
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
          selectedSeekedStudentIsEmpty: true,
          showSeekedData: true
        }));
        return;
      }
      setSelectedSeekedStudents(response.data);
      setBooleans(prevData => ({
        ...prevData,
        showSeekedData: true
      }));
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
  // Regno show form button
  function regnoForm() {
    setBooleans(prevData => ({
      ...prevData,
      showRegnoForm: !prevData.showRegnoForm
    }));
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
          // return;
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

  // Alter time for boolean value
  function alterTime() {
    setTimeAlter(prevData => ({ ...prevData, showAlterTimeForm: !prevData.showAlterTimeForm }));
    console.log(timeAlter.showAlterTimeForm);
  }

  // delete the student data in the given interval of time

  async function setTime(event) {
    event.preventDefault();
    try {
      if (
        (timeAlter.firstYearSectionA ||
          timeAlter.firstYearSectionB ||
          timeAlter.secondYearSectionA ||
          timeAlter.secondYearSectionB ||
          timeAlter.thirdYearSectionA ||
          timeAlter.thirdYearSectionB ||
          timeAlter.finalYearSectionA ||
          timeAlter.finalYearSectionB) &&
        (timeAlter.startTime !== "" && timeAlter.endTime !== "")
      ) {
        const response = await axios.put("http://localhost:8003/hod/setTime", {
          params: { data: timeAlter, hodId: hodId }
        });
        // console.log(response.data);
        if (response.data) {
          window.alert("Data Removed");
          window.location.reload();
        } else {
          window.alert("No data found");
        }
      } else {
        window.alert("Ensure user details");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const [regnoFocus, setRegnoFocus] = useState(false);
  const [startTimeFocused, setStartTimeFocused] = useState(false);
  const [endTimeFocused, setEndTimeFocused] = useState(false);
  return (
    <div className="relative">
      <section className="z-10 sticky top-0 bg-gradient-to-r from-sky-500 to-blue-400 dark:from-slate-400 dark:to-gray-400 py-4">
        <h1 className=" text-center pb-1  dark:text-white text-white text-3xl font-semibold">HOD Page</h1>
        <section className=" h-0.1  w-24 items-center bg-white mx-auto  " />
      </section>
      {/* HOD img and details */}
      {hodData ? (
        <div className="border-b border-gray-300 dark:border-gray-500 ">
          <section
            className="my-3 py-3 w-10/12 text-extraSmall sm:text-extraSmallPlus md:text-base 
          md:w-4/5 flex justify-around mx-auto  boxShadow-x shadow-x"
          >
            <div className="flex md:justify-evenly my-auto leading-loose">
              <div>
                <p className="text-slate-600 dark:text-slate-400">Name</p>
                <p className="text-slate-600 dark:text-slate-400">HOD ID</p>
                <p className="text-slate-600 dark:text-slate-400">Email</p>
                <p className="text-slate-600 dark:text-slate-400">Department</p>
              </div>
              <div className="ml-0 md:ml-10">
                <p className="text-slate-900 dark:text-white">{hodData.name}</p>
                <p className="text-slate-900 dark:text-white">{hodId}</p>
                <p className="text-slate-900 dark:text-white">{hodData.email}</p>
                <p className="text-slate-900 dark:text-white">{hodData.department}</p>
              </div>
            </div>

            <div className="w-8.3 md:w-1/5" style={{}}>
              {hodData.hodImgUrl && (
                <img
                  src={hodData.hodImgUrl}
                  alt={`HOD ${hodId} Img`}
                  className="h-16 w-16 sm:h-24 sm:w-24 md:h-36 md:w-36 rounded-full"
                />
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="border border-blue-400 shadow rounded-md p-4 max-w-sm w-full mx-auto">
          {/*Loading Content*/}
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-400 h-10 w-10" />
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-gray-400 rounded" />
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-gray-400 rounded col-span-2" />
                  <div className="h-2 bg-gray-400 rounded col-span-1" />
                </div>
                <div className="h-2 bg-gray-400 rounded" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex justify-center">
        {/* Buttons */}
        <div className="w-full md:w-15 flex flex-col justify-items-center  border-gray-300 border-r-2 dark:border-gray-500">
          {/* Seeked HIstory */}
          <button
            className="block text-basePlus text-slate-800 font-medium py-2 border-gray-300 border-b-2 transition-colors duration-200 hover:bg-slate-300 hover:text-blue-600 group-hover:bg-slate-100 group-hover:text-blue-600 dark:text-slate-200 dark:hover:text-slate-800 dark:hover:bg-slate-200 dark:border-gray-500"
            onClick={selectClassAndSectionForm}
          >
            Seeked History
          </button>
          <section className="block  md:hidden md:border-gray-300 md:border-b-2 md:pb-2 md:mb-2 ">
            <section className="w-full">
              {/* Selection Form */}
              {booleans.showForm && (
                <>
                  <div className="flex  justify-around pt-3">
                    <section className="flex flex-col">
                      <div className="flex item-center">
                        <label className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 " htmlFor="FirstYearA">
                          FirstYear A:
                        </label>
                        <input
                          type="checkbox"
                          checked={selectFormData.firstYearSectionA}
                          onChange={handelChange}
                          id="FirstYearA"
                          name="firstYearSectionA"
                        />
                      </div>
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="FirstYearB"
                        >
                          FirstYear B:
                        </label>
                        <input
                          type="checkbox"
                          checked={selectFormData.firstYearSectionB}
                          onChange={handelChange}
                          id="FirstYearB"
                          name="firstYearSectionB"
                        />
                      </div>
                    </section>

                    <section>
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="SecondYearA"
                        >
                          SecondYear A:
                        </label>
                        <input
                          type="checkbox"
                          checked={selectFormData.secondYearSectionA}
                          onChange={handelChange}
                          id="SecondYearA"
                          name="secondYearSectionA"
                        />
                      </div>
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="SecondYearB"
                        >
                          SecondYear B:
                        </label>
                        <input
                          type="checkbox"
                          checked={selectFormData.secondYearSectionB}
                          onChange={handelChange}
                          id="SecondYearB"
                          name="secondYearSectionB"
                        />
                      </div>
                    </section>

                    <section>
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="ThirdYearA"
                        >
                          ThirdYear A:
                        </label>
                        <input
                          type="checkbox"
                          checked={selectFormData.thirdYearSectionA}
                          onChange={handelChange}
                          id="ThirdYearA"
                          name="thirdYearSectionA"
                        />
                      </div>
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="ThirdYearB"
                        >
                          ThirdYear B:
                        </label>
                        <input
                          type="checkbox"
                          checked={selectFormData.thirdYearSectionB}
                          onChange={handelChange}
                          id="ThirdYearB"
                          name="thirdYearSectionB"
                        />
                      </div>
                    </section>
                    <section>
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="FinalYearA"
                        >
                          FinalYear A:
                        </label>
                        <input
                          type="checkbox"
                          checked={selectFormData.finalYearSectionA}
                          onChange={handelChange}
                          id="FinalYearA"
                          name="finalYearSectionA"
                        />
                      </div>
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="FinalYearB"
                        >
                          FinalYear B:
                        </label>
                        <input
                          type="checkbox"
                          checked={selectFormData.finalYearSectionB}
                          onChange={handelChange}
                          id="FinalYearB"
                          name="finalYearSectionB"
                        />
                      </div>
                    </section>
                  </div>
                  {/* getting the students data */}
                  <section className="flex flex-col items-center">
                    <button
                      className=" bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg font-bold cursor-pointer outline-none mt-4 mb-3"
                      onClick={getData}
                    >
                      Proceed
                    </button>
                  </section>
                </>
              )}
              {/* Seeked Data */}
              {booleans.showSeekedData && booleans.showForm ? (
                booleans.selectedSeekedStudentIsEmpty ? (
                  <h2 className="text-lg md:text-xl text-slate-800 font-semibold text-center w-full mt-2 dark:text-slate-200">
                    No Record Found!!
                  </h2>
                ) : (
                  <RecordsFetchTabel data={selectedSeekedStudents} id={hodId} />
                )
              ) : null}
            </section>
          </section>

          {/* Select by regno */}
          <button
            className="block text-basePlus text-slate-800 font-medium py-2 border-gray-300 border-b-2 transition-colors duration-200 hover:bg-slate-300 hover:text-blue-600 group-hover:bg-slate-100 group-hover:text-blue-600 dark:text-slate-200 dark:hover:text-slate-800 dark:hover:bg-slate-200 dark:border-gray-500"
            onClick={regnoForm}
          >
            Regno Search
          </button>
          <section className="block  md:hidden md:border-gray-300 md:border-b-2 md:pb-2 md:mb-2 ">
            <section className="w-full ">
              {booleans.showRegnoForm && (
                <div className="pt-3 flex flex-col justify-center items-center">
                  <section className="flex flex-col">
                    {/* Regno input feild */}
                    <section className="relative">
                      <input
                        type="text"
                        name="regno"
                        id="regno"
                        required
                        className={`w-full py-2 px-1 outline-none ${
                          props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black"
                        }`}
                        onChange={findRegnoChange}
                        value={findByRegno.regno}
                        onFocus={() => setRegnoFocus(true)}
                        onBlur={() => findByRegno.regno === "" && setRegnoFocus(false)}
                      />
                      <label
                        htmlFor="regno"
                        className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                          regnoFocus ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                        }`}
                      >
                        Regno
                      </label>
                    </section>

                    <button
                      onClick={getDataByRegno}
                      className=" bg-blue-500 border border-blue-500 text-white py-2  rounded-lg font-bold cursor-pointer outline-none mt-4 mb-3"
                    >
                      Get data
                    </button>
                  </section>
                </div>
              )}
            </section>
            {/* to render data */}
            <section>
              {booleans.showRegnoForm ? (
                booleans.findByRegnoIsEmpty ? (
                  <h2 className="text-lg md:text-xl text-slate-800 font-semibold text-center w-full mt-2 dark:text-slate-200">
                    No Record Found!!
                  </h2>
                ) : (
                  <RecordsFetchTabel className={"w-1/2"} data={studentDataByRegno} id={hodId} />
                )
              ) : null}
            </section>
          </section>

          {/* Unusual Seeked Students */}
          <button
            className="block text-basePlus text-slate-800 font-medium py-2 border-gray-300 border-b-2 transition-colors duration-200 hover:bg-slate-300 hover:text-blue-600 group-hover:bg-slate-100 group-hover:text-blue-600 dark:text-slate-200 dark:hover:text-slate-800 dark:hover:bg-slate-200 dark:border-gray-500"
            onClick={getUnusualSeekedStudents}
          >
            Unusual Seeked Students
          </button>
          <section className="block  md:hidden md:border-gray-300 md:border-b-2 md:pb-2 md:mb-2 ">
            {/* Unusual Students Check */}
            <section>
              {booleans.showUnusualSeekedStudents ? (
                booleans.unusualSeekedStudentsIsEmpty ? (
                  <>
                    <h2 className="text-lg md:text-xl text-slate-800 font-semibold text-center w-full mt-2 dark:text-slate-200">
                      No Record Found!!
                    </h2>
                  </>
                ) : (
                  <>
                    <UnusualStudentsTabel data={unusualSeekedStudentsdata} />
                  </>
                )
              ) : null}
            </section>
          </section>

          {/* Alter Time */}
          <button
            className="block text-basePlus text-slate-800 font-medium py-2 border-gray-300 border-b-2 transition-colors duration-200 hover:bg-slate-300 hover:text-blue-600 group-hover:bg-slate-100 group-hover:text-blue-600 dark:text-slate-200 dark:hover:text-slate-800 dark:hover:bg-slate-200 dark:border-gray-500"
            onClick={alterTime}
          >
            Alter Time
          </button>
          <section className="block  md:hidden md:border-gray-300 md:border-b-2 md:pb-2 md:mb-2 ">
            {timeAlter.showAlterTimeForm && (
              <>
                <div className="flex flex-col justify-center justify-items-center pt-2">
                  {/* Selection check boxex */}
                  <div className="flex  justify-around">
                    <section className="flex flex-col">
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="TimeAlterFirstYearA"
                        >
                          FirstYear A:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.firstYearSectionA}
                          onChange={timeAlterChange}
                          id="TimeAlterFirstYearA"
                          name="firstYearSectionA"
                        />
                      </div>
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="TimeAlterFirstYearB"
                        >
                          FirstYear B:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.firstYearSectionB}
                          onChange={timeAlterChange}
                          id="TimeAlterFirstYearB"
                          name="firstYearSectionB"
                        />
                      </div>
                    </section>

                    <section className="flex flex-col">
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="TimeAlterSecondYearA"
                        >
                          SecondYear A:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.secondYearSectionA}
                          onChange={timeAlterChange}
                          id="TimeAlterSecondYearA"
                          name="secondYearSectionA"
                        />
                      </div>
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="TimeAlterSecondYearB"
                        >
                          SecondYear B:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.secondYearSectionB}
                          onChange={timeAlterChange}
                          id="TimeAlterSecondYearB"
                          name="secondYearSectionB"
                        />
                      </div>
                    </section>

                    <section className="flex flex-col">
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="TimeAlterThirdYearA"
                        >
                          ThirdYear A:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.thirdYearSectionA}
                          onChange={timeAlterChange}
                          id="TimeAlterThirdYearA"
                          name="thirdYearSectionA"
                        />
                      </div>
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="TimeAlterThirdYearB"
                        >
                          ThirdYear B:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.thirdYearSectionB}
                          onChange={timeAlterChange}
                          id="TimeAlterThirdYearB"
                          name="thirdYearSectionB"
                        />
                      </div>
                    </section>

                    <section className="flex flex-col">
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="TimeAlterFinalYearA"
                        >
                          FinalYear A:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.finalYearSectionA}
                          onChange={timeAlterChange}
                          id="TimeAlterFinalYearA"
                          name="finalYearSectionA"
                        />
                      </div>
                      <div className="flex item-center">
                        <label
                          className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1"
                          htmlFor="TimeAlterFinalYearB"
                        >
                          FinalYear B:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.finalYearSectionB}
                          onChange={timeAlterChange}
                          id="TimeAlterFinalYearB"
                          name="finalYearSectionB"
                        />
                      </div>
                    </section>
                  </div>
                  {/* Selectiong time */}
                  <div className="flex mt-4 justify-around w-full">
                    <section className="relative ">
                      <input
                        type="time"
                        placeholder=" "
                        name="startTime"
                        id="startTime"
                        required
                        className={`w-full py-2 px-1 outline-none ${
                          props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black "
                        }`}
                        onChange={timeAlterChange}
                        value={timeAlter.startTime}
                        onFocus={() => setStartTimeFocused(true)}
                        onBlur={() => timeAlter.startTime === "" && setStartTimeFocused(false)}
                      />
                      <label
                        htmlFor="startTime"
                        className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                          startTimeFocused ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                        }`}
                      >
                        Start Time
                      </label>
                    </section>

                    <section className="relative ">
                      <input
                        type="time"
                        placeholder="HH:MM"
                        name="endTime"
                        id="endTime"
                        required
                        className={`w-full py-2 px-1 outline-none ${
                          props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black "
                        }`}
                        onChange={timeAlterChange}
                        value={timeAlter.endTime}
                        onFocus={() => setEndTimeFocused(true)}
                        onBlur={() => timeAlter.endTime === "" && setEndTimeFocused(false)}
                      />
                      <label
                        htmlFor="endTime"
                        className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                          endTimeFocused ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                        }`}
                      >
                        End Time
                      </label>
                    </section>
                  </div>

                  <section className="flex justify-center justify-items-center">
                    <button
                      onClick={setTime}
                      className=" mb-3 bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg font-bold cursor-pointer outline-none mt-4"
                    >
                      Clear
                    </button>
                  </section>

                  {/* <button onClick={setTime}>Proceed</button> */}
                </div>
              </>
            )}
          </section>
        </div>

        {/* Selected data */}
        <div className="hidden  md:flex flex-col justify-items-center items-center w-85">
          {/* Seeked Students Data */}
          <section className="w-full">
            {/* Selection Form */}
            {booleans.showForm && (
              <>
                <h1 className="text-center py-3 mb-4 border-b border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold">
                  Seeked History
                </h1>

                <div className="flex  justify-around ">
                  <section className="flex flex-col">
                    <div className="flex item-center">
                      <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="FirstYearA">
                        FirstYear A:
                      </label>
                      <input
                        type="checkbox"
                        checked={selectFormData.firstYearSectionA}
                        onChange={handelChange}
                        id="FirstYearA"
                        name="firstYearSectionA"
                      />
                    </div>
                    <div className="flex item-center">
                      <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="FirstYearB">
                        FirstYear B:
                      </label>
                      <input
                        type="checkbox"
                        checked={selectFormData.firstYearSectionB}
                        onChange={handelChange}
                        id="FirstYearB"
                        name="firstYearSectionB"
                      />
                    </div>
                  </section>

                  <section>
                    <div className="flex item-center">
                      <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="SecondYearA">
                        SecondYear A:
                      </label>
                      <input
                        type="checkbox"
                        checked={selectFormData.secondYearSectionA}
                        onChange={handelChange}
                        id="SecondYearA"
                        name="secondYearSectionA"
                      />
                    </div>
                    <div className="flex item-center">
                      <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="SecondYearB">
                        SecondYear B:
                      </label>
                      <input
                        type="checkbox"
                        checked={selectFormData.secondYearSectionB}
                        onChange={handelChange}
                        id="SecondYearB"
                        name="secondYearSectionB"
                      />
                    </div>
                  </section>

                  <section>
                    <div className="flex item-center">
                      <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="ThirdYearA">
                        ThirdYear A:
                      </label>
                      <input
                        type="checkbox"
                        checked={selectFormData.thirdYearSectionA}
                        onChange={handelChange}
                        id="ThirdYearA"
                        name="thirdYearSectionA"
                      />
                    </div>
                    <div className="flex item-center">
                      <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="ThirdYearB">
                        ThirdYear B:
                      </label>
                      <input
                        type="checkbox"
                        checked={selectFormData.thirdYearSectionB}
                        onChange={handelChange}
                        id="ThirdYearB"
                        name="thirdYearSectionB"
                      />
                    </div>
                  </section>
                  <section>
                    <div className="flex item-center">
                      <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="FinalYearA">
                        FinalYear A:
                      </label>
                      <input
                        type="checkbox"
                        checked={selectFormData.finalYearSectionA}
                        onChange={handelChange}
                        id="FinalYearA"
                        name="finalYearSectionA"
                      />
                    </div>
                    <div className="flex item-center">
                      <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="FinalYearB">
                        FinalYear B:
                      </label>
                      <input
                        type="checkbox"
                        checked={selectFormData.finalYearSectionB}
                        onChange={handelChange}
                        id="FinalYearB"
                        name="finalYearSectionB"
                      />
                    </div>
                  </section>
                </div>
                {/* getting the students data */}
                <section className="flex flex-col items-center">
                  <button
                    className="w-1/5 bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg font-bold cursor-pointer outline-none mt-4 mb-3"
                    onClick={getData}
                  >
                    Proceed
                  </button>
                </section>
              </>
            )}

            {/* Seeked Data */}
            {booleans.showSeekedData && booleans.showForm ? (
              booleans.selectedSeekedStudentIsEmpty ? (
                <h2 className="text-xl text-slate-800 font-semibold text-center w-full mt-5 dark:text-slate-200">
                  No Record Found!!
                </h2>
              ) : (
                <RecordsFetchTabel data={selectedSeekedStudents} id={hodId} />
              )
            ) : null}
          </section>

          {/* Regno Search */}
          <section className="w-full ">
            {booleans.showRegnoForm && (
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-center py-3 mb-4 border-t border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold">
                  Search By Register number
                </h1>
                <section>
                  {/* Regno input feild */}
                  <section className="relative">
                    <input
                      type="text"
                      name="regno"
                      id="regno"
                      required
                      className={`w-full py-2 px-1 outline-none ${
                        props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black"
                      }`}
                      onChange={findRegnoChange}
                      value={findByRegno.regno}
                      onFocus={() => setRegnoFocus(true)}
                      onBlur={() => findByRegno.regno === "" && setRegnoFocus(false)}
                    />
                    <label
                      htmlFor="regno"
                      className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                        regnoFocus ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                      }`}
                    >
                      Regno
                    </label>
                  </section>

                  <button
                    onClick={getDataByRegno}
                    className="w-full bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg font-bold cursor-pointer outline-none mt-4 mb-3"
                  >
                    Get data
                  </button>
                </section>
              </div>
            )}
          </section>
          {/* to render data */}
          <section>
            {booleans.showRegnoForm ? (
              booleans.findByRegnoIsEmpty ? (
                <h2 className="text-xl text-slate-800 font-semibold text-center w-full mt-5 dark:text-slate-200">
                  No Record Found!!
                </h2>
              ) : (
                <RecordsFetchTabel className={"w-1/2"} data={studentDataByRegno} id={hodId} />
              )
            ) : null}
          </section>

          {/* Unusual Students Check */}
          <section>
            {booleans.showUnusualSeekedStudents ? (
              booleans.unusualSeekedStudentsIsEmpty ? (
                <>
                  <h1 className="text-center py-3 mb-4 border-t border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold">
                    Unusual Students
                  </h1>
                  <h2 className="text-xl text-slate-800 font-semibold text-center w-full mt-5 dark:text-slate-200">
                    No Record Found!!
                  </h2>
                </>
              ) : (
                <>
                  <h1 className="text-center py-3 mb-4 border-t border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold">
                    Unusual Students
                  </h1>
                  <UnusualStudentsTabel data={unusualSeekedStudentsdata} />
                </>
              )
            ) : null}
          </section>

          {/* Time Alter */}
          <section className="w-full">
            {timeAlter.showAlterTimeForm && (
              <>
                <h1 className="text-center py-3 mb-4 border-t border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold">
                  Time Alteration
                </h1>

                <div className="flex flex-col justify-center justify-items-center">
                  {/* Selection check boxex */}
                  <div className="flex  justify-around">
                    <section className="flex flex-col">
                      <div>
                        <label className="text-slate-900 dark:text-slate-300" htmlFor="TimeAlterFirstYearA">
                          FirstYear A:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.firstYearSectionA}
                          onChange={timeAlterChange}
                          id="TimeAlterFirstYearA"
                          name="firstYearSectionA"
                        />
                      </div>
                      <div>
                        <label className="text-slate-900 dark:text-slate-300" htmlFor="TimeAlterFirstYearB">
                          FirstYear B:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.firstYearSectionB}
                          onChange={timeAlterChange}
                          id="TimeAlterFirstYearB"
                          name="firstYearSectionB"
                        />
                      </div>
                    </section>

                    <section className="flex flex-col">
                      <div>
                        <label className="text-slate-900 dark:text-slate-300" htmlFor="TimeAlterSecondYearA">
                          SecondYear A:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.secondYearSectionA}
                          onChange={timeAlterChange}
                          id="TimeAlterSecondYearA"
                          name="secondYearSectionA"
                        />
                      </div>
                      <div>
                        <label className="text-slate-900 dark:text-slate-300" htmlFor="TimeAlterSecondYearB">
                          SecondYear B:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.secondYearSectionB}
                          onChange={timeAlterChange}
                          id="TimeAlterSecondYearB"
                          name="secondYearSectionB"
                        />
                      </div>
                    </section>

                    <section className="flex flex-col">
                      <div>
                        <label className="text-slate-900 dark:text-slate-300" htmlFor="TimeAlterThirdYearA">
                          ThirdYear A:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.thirdYearSectionA}
                          onChange={timeAlterChange}
                          id="TimeAlterThirdYearA"
                          name="thirdYearSectionA"
                        />
                      </div>
                      <div>
                        <label className="text-slate-900 dark:text-slate-300" htmlFor="TimeAlterThirdYearB">
                          ThirdYear B:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.thirdYearSectionB}
                          onChange={timeAlterChange}
                          id="TimeAlterThirdYearB"
                          name="thirdYearSectionB"
                        />
                      </div>
                    </section>

                    <section className="flex flex-col">
                      <div>
                        <label className="text-slate-900 dark:text-slate-300" htmlFor="TimeAlterFinalYearA">
                          FinalYear A:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.finalYearSectionA}
                          onChange={timeAlterChange}
                          id="TimeAlterFinalYearA"
                          name="finalYearSectionA"
                        />
                      </div>
                      <div>
                        <label className="text-slate-900 dark:text-slate-300" htmlFor="TimeAlterFinalYearB">
                          FinalYear B:
                        </label>
                        <input
                          type="checkbox"
                          checked={timeAlter.finalYearSectionB}
                          onChange={timeAlterChange}
                          id="TimeAlterFinalYearB"
                          name="finalYearSectionB"
                        />
                      </div>
                    </section>
                  </div>
                  {/* Selectiong time */}
                  <div className="flex mt-4 justify-around w-full">
                    <section className="relative w-1/5">
                      <input
                        type="time"
                        placeholder=" "
                        name="startTime"
                        id="startTime"
                        required
                        className={`w-full py-2 px-1 outline-none ${
                          props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black "
                        }`}
                        onChange={timeAlterChange}
                        value={timeAlter.startTime}
                        onFocus={() => setStartTimeFocused(true)}
                        onBlur={() => timeAlter.startTime === "" && setStartTimeFocused(false)}
                      />
                      <label
                        htmlFor="startTime"
                        className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                          startTimeFocused ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                        }`}
                      >
                        Start Time
                      </label>
                    </section>

                    <section className="relative w-1/5">
                      <input
                        type="time"
                        placeholder="HH:MM"
                        name="endTime"
                        id="endTime"
                        required
                        className={`w-full py-2 px-1 outline-none ${
                          props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black "
                        }`}
                        onChange={timeAlterChange}
                        value={timeAlter.endTime}
                        onFocus={() => setEndTimeFocused(true)}
                        onBlur={() => timeAlter.endTime === "" && setEndTimeFocused(false)}
                      />
                      <label
                        htmlFor="endTime"
                        className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                          endTimeFocused ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                        }`}
                      >
                        End Time
                      </label>
                    </section>
                  </div>

                  <section className="flex justify-center justify-items-center">
                    <button
                      onClick={setTime}
                      className="w-1/5 mb-3 bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg font-bold cursor-pointer outline-none mt-4"
                    >
                      Clear
                    </button>
                  </section>

                  {/* <button onClick={setTime}>Proceed</button> */}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default HodPage;
