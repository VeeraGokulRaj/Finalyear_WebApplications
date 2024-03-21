import React, { useState, useEffect } from "react";
import RecordsFetchTabel from "./RecordsFetchTabel";
import RequestFetchTabel from "./RequestFetchTabel";
import axios from "axios";
import { useLocation } from "react-router-dom";

function StudentPage(props) {
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
  const [regnoFocused, setRegnoFocused] = useState(false);
  const [reasonFocused, setReasonFocused] = useState(false);
  const [startTimeFocused, setStartTimeFocused] = useState(false);
  const [endTimeFocused, setEndTimeFocused] = useState(false);
  return (
    <div>
      <section className="bg-gradient-to-r from-sky-500 to-blue-400 dark:from-slate-400 dark:to-gray-400 py-4">
        <h1 className=" text-center pb-1  dark:text-white text-white text-3xl font-semibold">Student Page</h1>
        <section className=" h-0.1  w-24 items-center bg-white mx-auto  " />
      </section>
      {/* Studnet img and details */}
      {studentData ? (
        <div className="border-b border-gray-300 dark:border-gray-500 ">
          <section
            className="my-3 py-3 w-10/12 text-extraSmall sm:text-extraSmallPlus md:text-base 
          md:w-4/5 flex justify-around mx-auto  boxShadow-x shadow-x"
          >
            <div className="flex md:justify-evenly">
              <div>
                <p className="text-slate-600 dark:text-slate-400">Name</p>
                <p className="text-slate-600 dark:text-slate-400">Regno</p>
                <p className="text-slate-600 dark:text-slate-400">Seeked</p>
                <p className="text-slate-600 dark:text-slate-400">Year</p>
                <p className="text-slate-600 dark:text-slate-400">Section</p>
                <p className="text-slate-600 dark:text-slate-400">Department</p>
              </div>
              <div className="ml-0 md:ml-10">
                <p className="text-slate-900 dark:text-white">{studentData.name}</p>
                <p className="text-slate-900 dark:text-white">{studentId}</p>
                <p className="text-slate-900 dark:text-white">{studentData.numberOf_time_seeked}</p>
                <p className="text-slate-900 dark:text-white">{studentData.year}</p>
                <p className="text-slate-900 dark:text-white">{studentData.section}</p>
                <p className="text-slate-900 dark:text-white">{studentData.major}</p>
              </div>
            </div>

            <div className="w-8.3 md:w-1/5" style={{}}>
              {studentData.studentImgUrl && (
                <img
                  src={studentData.studentImgUrl}
                  alt={`Student ${studentId} Img`}
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
      {/* Student seekd data image Tabel */}

      <div className="flex justify-center">
        {/* Buttons */}
        <div className="w-full md:w-15 flex flex-col justify-items-center  border-gray-300 border-r-2 dark:border-gray-500">
          {/* Seekd History */}
          <button
            className="block text-basePlus text-slate-800 font-medium py-2 border-gray-300 border-b-2 transition-colors duration-200 hover:bg-slate-300 hover:text-blue-600 group-hover:bg-slate-100 group-hover:text-blue-600 dark:text-slate-200 dark:hover:text-slate-800 dark:hover:bg-slate-200 dark:border-gray-500"
            onClick={getStudentSeekedRecord}
          >
            Seeked History
          </button>
          <section className="block  md:hidden md:border-gray-300 md:border-b-2 md:pb-2 md:mb-2 ">
            {booleans.isEmpty && (
              <h2 className="text-xl text-slate-800 font-semibold text-center w-full mt-5 ">No Record Found!!</h2>
            )}
            {booleans.recordShow && <RecordsFetchTabel data={studentSeekedData} />}
          </section>
          {/* request form */}
          <button
            className="block text-basePlus text-slate-800 font-medium py-2 border-gray-300 border-b-2 transition-colors duration-200 hover:bg-slate-300 hover:text-blue-600 group-hover:bg-slate-100 group-hover:text-blue-600 dark:text-slate-200 dark:hover:text-slate-800 dark:hover:bg-slate-200 dark:border-gray-500"
            onClick={viewRequestForm}
          >
            Request
          </button>
          <section className="block  md:hidden flex-col justify-items-center items-center ">
            {booleans.showRequestForm && (
              <form className="pt-2 w-4/5 mx-auto md:w-200">
                <h1 className="text-center pb-5 mb-4 border-b border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold">
                  Request Form
                </h1>
                <div
                  className={`txt mb-4 relative border-b-2  ${
                    props.theme === "light" ? (regnoFocused ? "border-blue-500" : "border-gray-400") : "border-gray-400"
                  }     
                  }`}
                >
                  <input
                    type="text"
                    name="regno"
                    id="regno"
                    required
                    className={`w-full py-2 px-1 outline-none ${
                      props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black "
                    }`}
                    onChange={handelChange}
                    value={requestFormData.regno}
                    onFocus={() => setRegnoFocused(true)}
                    onBlur={() => requestFormData.regno === "" && setRegnoFocused(false)}
                  />
                  <label
                    htmlFor="regno"
                    className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                      regnoFocused ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                    }`}
                  >
                    Regno
                  </label>
                </div>
                <div
                  className={`txt mb-2 relative border-2   ${
                    props.theme === "light" ? (reasonFocused ? "border-blue-500" : "border-gray-400") : "border-gray-400"
                  }     
              }`}
                >
                  <textarea
                    cols="20"
                    rows="2"
                    name="reason"
                    id="reason"
                    required
                    className={`w-full py-2 px-1 outline-none ${
                      props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black "
                    }`}
                    onChange={handelChange}
                    value={requestFormData.reason}
                    onFocus={() => setReasonFocused(true)}
                    onBlur={() => requestFormData.reason === "" && setReasonFocused(false)}
                  />
                  <label
                    htmlFor="reason"
                    className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                      reasonFocused ? "-top-1 text-blue-500" : "top-2 text-gray-400"
                    }`}
                  >
                    Reason
                  </label>
                </div>
                <div
                  className={`txt mb-4 relative border-b-2   ${
                    props.theme === "light" ? (startTimeFocused ? "border-blue-500" : "border-gray-400") : "border-gray-400"
                  }     
              }`}
                >
                  <input
                    type="time"
                    placeholder=" "
                    name="startTime"
                    id="startTime"
                    required
                    className={`w-full py-2 px-1 outline-none ${
                      props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black "
                    }`}
                    onChange={handelChange}
                    value={requestFormData.startTime}
                    onFocus={() => setStartTimeFocused(true)}
                    onBlur={() => requestFormData.startTime === "" && setStartTimeFocused(false)}
                  />
                  <label
                    htmlFor="startTime"
                    className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                      startTimeFocused ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                    }`}
                  >
                    Start Time
                  </label>
                </div>
                <div
                  className={`txt mb-2 relative border-b-2   ${
                    props.theme === "light" ? (endTimeFocused ? "border-blue-500" : "border-gray-400") : "border-gray-400"
                  }     
              }`}
                >
                  <input
                    type="time"
                    placeholder="HH:MM"
                    name="endTime"
                    id="endTime"
                    required
                    className={`w-full py-2 px-1 outline-none ${
                      props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black "
                    }`}
                    onChange={handelChange}
                    value={requestFormData.endTime}
                    onFocus={() => setEndTimeFocused(true)}
                    onBlur={() => requestFormData.endTime === "" && setEndTimeFocused(false)}
                  />
                  <label
                    htmlFor="endTime"
                    className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                      endTimeFocused ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                    }`}
                  >
                    End Time
                  </label>
                </div>
                <div className="my-4 flex justify-center">
                  <label htmlFor="confirm" className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="confirm"
                      className="form-checkbox"
                      checked={requestFormData.checked}
                      onChange={handelChange}
                      name="checked"
                    />
                    <span className="ml-2 dark:text-white">Confirm</span>
                  </label>
                </div>
                <button
                  onClick={postNewRequest}
                  className="w-full bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg font-bold cursor-pointer outline-none mt-2"
                >
                  Request
                </button>
              </form>
            )}
          </section>
          {/* Request Status */}
          <button
            className="block text-basePlus text-slate-800 font-medium py-2 mb:border-gray-300 mb:border-b-2 transition-colors duration-200 hover:bg-slate-300 hover:text-blue-600 group-hover:bg-slate-100 group-hover:text-blue-600 dark:text-slate-200 dark:hover:text-slate-800 dark:hover:bg-slate-200 mb:dark:border-gray-500"
            onClick={getStudentRequestRecord}
          >
            Request Status
          </button>
          <section className="block pt-2 md:hidden border-gray-300 border-b-2 ">
            {booleans.requestIsEmpty && <h2>No RecordFound!!</h2>}
            {booleans.requestShow && <RequestFetchTabel data={studentRequestData} id={studentId} />}
          </section>
        </div>

        {/* Selected data */}
        <div className="hidden  md:flex flex-col justify-items-center items-center w-85">
          {/* Seeked data */}
          <section className="border-gray-300 border-b-2 pb-2 mb-2 ">
            {booleans.isEmpty && (
              <h2 className="text-xl text-slate-800 font-semibold text-center w-full mt-5 ">No Record Found!!</h2>
            )}
            {booleans.recordShow && <RecordsFetchTabel data={studentSeekedData} />}
          </section>
          {/* Request form */}
          <section className="border-gray-300 border-b-2 pb-2 mb-2 flex flex-col justify-items-center items-center ">
            {booleans.showRequestForm && (
              <form className="w-full md:w-200">
                <h1 className="text-center pb-5 mb-4 border-b border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold">
                  Request Form
                </h1>
                <div
                  className={`txt mb-4 relative border-b-2  ${
                    props.theme === "light" ? (regnoFocused ? "border-blue-500" : "border-gray-400") : "border-gray-400"
                  }     
                  }`}
                >
                  <input
                    type="text"
                    name="regno"
                    id="regno"
                    required
                    className={`w-full py-2 px-1 outline-none ${
                      props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black "
                    }`}
                    onChange={handelChange}
                    value={requestFormData.regno}
                    onFocus={() => setRegnoFocused(true)}
                    onBlur={() => requestFormData.regno === "" && setRegnoFocused(false)}
                  />
                  <label
                    htmlFor="regno"
                    className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                      regnoFocused ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                    }`}
                  >
                    Regno
                  </label>
                </div>
                <div
                  className={`txt mb-2 relative border-2   ${
                    props.theme === "light" ? (reasonFocused ? "border-blue-500" : "border-gray-400") : "border-gray-400"
                  }     
              }`}
                >
                  <textarea
                    cols="20"
                    rows="2"
                    name="reason"
                    id="reason"
                    required
                    className={`w-full py-2 px-1 outline-none ${
                      props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black "
                    }`}
                    onChange={handelChange}
                    value={requestFormData.reason}
                    onFocus={() => setReasonFocused(true)}
                    onBlur={() => requestFormData.reason === "" && setReasonFocused(false)}
                  />
                  <label
                    htmlFor="reason"
                    className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                      reasonFocused ? "-top-1 text-blue-500" : "top-2 text-gray-400"
                    }`}
                  >
                    Reason
                  </label>
                </div>
                <div
                  className={`txt mb-4 relative border-b-2   ${
                    props.theme === "light" ? (startTimeFocused ? "border-blue-500" : "border-gray-400") : "border-gray-400"
                  }     
              }`}
                >
                  <input
                    type="time"
                    placeholder=" "
                    name="startTime"
                    id="startTime"
                    required
                    className={`w-full py-2 px-1 outline-none ${
                      props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black "
                    }`}
                    onChange={handelChange}
                    value={requestFormData.startTime}
                    onFocus={() => setStartTimeFocused(true)}
                    onBlur={() => requestFormData.startTime === "" && setStartTimeFocused(false)}
                  />
                  <label
                    htmlFor="startTime"
                    className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                      startTimeFocused ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                    }`}
                  >
                    Start Time
                  </label>
                </div>
                <div
                  className={`txt mb-2 relative border-b-2   ${
                    props.theme === "light" ? (endTimeFocused ? "border-blue-500" : "border-gray-400") : "border-gray-400"
                  }     
              }`}
                >
                  <input
                    type="time"
                    placeholder="HH:MM"
                    name="endTime"
                    id="endTime"
                    required
                    className={`w-full py-2 px-1 outline-none ${
                      props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black "
                    }`}
                    onChange={handelChange}
                    value={requestFormData.endTime}
                    onFocus={() => setEndTimeFocused(true)}
                    onBlur={() => requestFormData.endTime === "" && setEndTimeFocused(false)}
                  />
                  <label
                    htmlFor="endTime"
                    className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                      endTimeFocused ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                    }`}
                  >
                    End Time
                  </label>
                </div>
                <div className="my-4 flex justify-center">
                  <label htmlFor="confirm" className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="confirm"
                      className="form-checkbox"
                      checked={requestFormData.checked}
                      onChange={handelChange}
                      name="checked"
                    />
                    <span className="ml-2 dark:text-white">Confirm</span>
                  </label>
                </div>
                <button
                  onClick={postNewRequest}
                  className="w-full bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg font-bold cursor-pointer outline-none mt-2"
                >
                  Request
                </button>
              </form>
            )}
          </section>
          {/* request fetch tabel */}
          <section className="border-gray-300 border-b-2 ">
            {booleans.requestIsEmpty && <h2>No RecordFound!!</h2>}
            {booleans.requestShow && <RequestFetchTabel data={studentRequestData} id={studentId} />}
          </section>
        </div>
      </div>

      {/* <section>
        <button onClick={getStudentSeekedRecord}>Seeked History</button>
        {booleans.isEmpty && <h2>No Record Found!!</h2>}
        {booleans.recordShow && <RecordsFetchTabel data={studentSeekedData} />}
      </section> */}
      {/* Request part */}
      {/* <section>
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
      </section> */}
      {/* request fetch tabel */}
      {/* <section>
        <button onClick={getStudentRequestRecord}>Check status</button>
        {booleans.requestIsEmpty && <h2>No RecordFound!!</h2>}
        {booleans.requestShow && <RequestFetchTabel data={studentRequestData} id={studentId} />}
      </section> */}
    </div>
  );
}

export default StudentPage;
