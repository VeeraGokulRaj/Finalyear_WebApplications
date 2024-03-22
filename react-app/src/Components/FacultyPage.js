import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import RecordsFetchTabel from "./RecordsFetchTabel";
import RequestFetchTabel from "./RequestFetchTabel";
import UnusualStudentsTabel from "./UnusualStudentsTabel";

function FacultyPage() {
  //extracting the users ID
  const location = useLocation();
  const facultyId = location.state.formData.userId;

  // State to store the user Data
  const [facultyData, setfacultyData] = useState([]);
  const [studentSeekedListData, setStudentSeekedListData] = useState([]);
  const [studentCurrentRequestData, setStudentCurrentRequestData] = useState([]);
  const [studentHistoryRequestData, setStudentHistoryRequestData] = useState([]);
  const [unusualSeekedStudentsdata, setUnusualSeekedStudentsdata] = useState([]);
  const [booleans, setBooleans] = useState({
    recordShow: false,
    isEmpty: false, //seeked student data
    currentRequestIsEmpty: false,
    currentRequestShow: false,
    historyRequestIsEmpty: false,
    historyRequestShow: false,
    showUnusualSeekedStudents: false,
    unusualSeekedStudentsIsEmpty: false
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
          isEmpty: true,
          recordShow: !prevData.recordShow
        }));
        console.log(booleans.recordShow);
        return;
      }
      setStudentSeekedListData(response.data);
      setBooleans(prevData => ({
        ...prevData,
        recordShow: !prevData.recordShow
      }));
      console.log(booleans.recordShow);
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
      console.log(response.data);
      if (response.data.length === 0) {
        setBooleans(prevData => ({
          ...prevData,
          currentRequestIsEmpty: true,
          currentRequestShow: !prevData.currentRequestShow
        }));
        console.log(booleans.currentRequestIsEmpty);
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
          historyRequestIsEmpty: true,
          historyRequestShow: !prevData.historyRequestShow
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

  // getting tt Unusual Seeked Students
  async function getUnusualSeekedStudents() {
    // console.log("getUnusualSeekedStudents");
    try {
      const response = await axios.get("http://localhost:8002/faculty/getUnusualSeekedStudents");
      // console.log(response.data);
      if (response.data.length === 0) {
        setBooleans(prevData => ({
          ...prevData,
          unusualSeekedStudentsIsEmpty: true,
          showUnusualSeekedStudents: !prevData.showUnusualSeekedStudents
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
    <div className="relative">
      <section className="z-10 sticky top-0 bg-gradient-to-r from-sky-500 to-blue-400 dark:from-slate-400 dark:to-gray-400 py-4">
        <h1 className=" text-center pb-1  dark:text-white text-white text-3xl font-semibold">Faculty Page</h1>
        <section className=" h-0.1  w-24 items-center bg-white mx-auto  " />
      </section>
      {/* Faculty img and details */}
      {facultyData ? (
        <div className="border-b border-gray-300 dark:border-gray-500 ">
          <section
            className="my-3 py-3 w-10/12 text-extraSmall sm:text-extraSmallPlus md:text-base 
          md:w-4/5 flex justify-around mx-auto  boxShadow-x shadow-x"
          >
            <div className="flex md:justify-evenly my-auto leading-loose">
              <div>
                <p className="text-slate-600 dark:text-slate-400">Name</p>
                <p className="text-slate-600 dark:text-slate-400">Faculty ID</p>
                <p className="text-slate-600 dark:text-slate-400">Section</p>
                <p className="text-slate-600 dark:text-slate-400">Department</p>
              </div>
              <div className="ml-0 md:ml-10">
                <p className="text-slate-900 dark:text-white">{facultyData.name}</p>
                <p className="text-slate-900 dark:text-white">{facultyId}</p>
                <p className="text-slate-900 dark:text-white">{facultyData.section}</p>
                <p className="text-slate-900 dark:text-white">{facultyData.department}</p>
              </div>
            </div>

            <div className="w-8.3 md:w-1/5" style={{}}>
              {facultyData.facultyImgUrl && (
                <img
                  src={facultyData.facultyImgUrl}
                  alt={`Faculty ${facultyId} Img`}
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
            onClick={getStudentSeekedListRecord}
          >
            Seeked History
          </button>
          <section className="block  md:hidden md:border-gray-300 md:border-b-2 md:pb-2 md:mb-2 ">
            {booleans.recordShow ? (
              booleans.isEmpty ? (
                <h2 className="text-lg md:text-xl text-slate-800 font-semibold text-center w-full mt-2 dark:text-slate-200">
                  No Record Found!!
                </h2>
              ) : (
                <RecordsFetchTabel data={studentSeekedListData} />
              )
            ) : null}
          </section>

          {/* current Request */}
          <button
            className="block text-basePlus text-slate-800 font-medium py-2 border-gray-300 border-b-2 transition-colors duration-200 hover:bg-slate-300 hover:text-blue-600 group-hover:bg-slate-100 group-hover:text-blue-600 dark:text-slate-200 dark:hover:text-slate-800 dark:hover:bg-slate-200 dark:border-gray-500"
            onClick={getCurrentRequest}
          >
            Current Request
          </button>
          <section
            className={`block ${
              booleans.currentRequestShow ? "py-2" : null
            }  md:hidden md:border-gray-300 md:border-b-2 md:pb-2 md:mb-2`}
          >
            {booleans.currentRequestShow ? (
              booleans.currentRequestIsEmpty ? (
                <h2 className="text-lg md:text-xl text-slate-800 font-semibold text-center w-full mt-2 dark:text-slate-200">
                  No Record Found!!
                </h2>
              ) : (
                <RequestFetchTabel
                  data={studentCurrentRequestData}
                  id={facultyId}
                  currentRequestShow={booleans.currentRequestShow}
                />
              )
            ) : null}
          </section>

          {/* Histry Request*/}
          <button
            className="block text-basePlus text-slate-800 font-medium py-2 border-gray-300 border-b-2 transition-colors duration-200 hover:bg-slate-300 hover:text-blue-600 group-hover:bg-slate-100 group-hover:text-blue-600 dark:text-slate-200 dark:hover:text-slate-800 dark:hover:bg-slate-200 dark:border-gray-500"
            onClick={getHistoryRequest}
          >
            History Request
          </button>
          <section
            className={`block ${
              booleans.historyRequestShow ? "py-2" : null
            }  md:hidden md:border-gray-300 md:border-b-2 md:pb-2 md:mb-2`}
          >
            {booleans.historyRequestShow ? (
              booleans.historyRequestIsEmpty ? (
                <h2 className="text-lg md:text-xl text-slate-800 font-semibold text-center w-full mt-2 dark:text-slate-200">
                  No Record Found!!
                </h2>
              ) : (
                <RequestFetchTabel
                  data={studentHistoryRequestData}
                  id={facultyId}
                  historyRequestShow={booleans.historyRequestShow}
                />
              )
            ) : null}
          </section>
          {/* Unusual Seeked students */}
          <button
            className="block text-basePlus text-slate-800 font-medium py-2 border-gray-300 border-b-2 transition-colors duration-200 hover:bg-slate-300 hover:text-blue-600 group-hover:bg-slate-100 group-hover:text-blue-600 dark:text-slate-200 dark:hover:text-slate-800 dark:hover:bg-slate-200 dark:border-gray-500"
            onClick={getUnusualSeekedStudents}
          >
            Unusual Seeked students
          </button>
          <section
            className={`block ${
              booleans.historyRequestShow ? "py-2" : null
            }  md:hidden md:border-gray-300 md:border-b-2 md:pb-2 md:mb-2`}
          >
            {booleans.showUnusualSeekedStudents ? (
              booleans.unusualSeekedStudentsIsEmpty ? (
                <h2 className="text-lg md:text-xl text-slate-800 font-semibold text-center w-full mt-2 dark:text-slate-200">
                  No Record Found!!
                </h2>
              ) : (
                <UnusualStudentsTabel data={unusualSeekedStudentsdata} />
              )
            ) : null}
          </section>
        </div>

        {/* Selected data */}
        <div className="hidden  md:flex flex-col justify-items-center items-center w-85">
          {/* seeked Data */}
          <section>
            {booleans.recordShow ? (
              booleans.isEmpty ? (
                <>
                  <h1 className="text-center py-3 mb-4 border-b border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold">
                    Seeked History
                  </h1>
                  <h2 className="text-xl text-slate-800 font-semibold text-center w-full mt-5 dark:text-slate-200">
                    No Record Found!!
                  </h2>
                </>
              ) : (
                <>
                  <h1 className="text-center py-3 mb-4 border-b border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold">
                    Seeked History
                  </h1>
                  <RecordsFetchTabel data={studentSeekedListData} />
                </>
              )
            ) : null}
          </section>
          {/* Current request fetch tabel */}
          <section>
            {booleans.currentRequestShow ? (
              booleans.currentRequestIsEmpty ? (
                <>
                  <h1 className="text-center my-3 mb-4 border-t border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold pt-2">
                    Current Request
                  </h1>
                  <h2 className="text-xl text-slate-800 font-semibold text-center w-full mt-5 dark:text-slate-200">
                    No Record Found!!
                  </h2>
                </>
              ) : (
                <>
                  <h1 className="text-center my-3 mb-4 border-t border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold pt-2">
                    Current Request
                  </h1>
                  <RequestFetchTabel
                    data={studentCurrentRequestData}
                    id={facultyId}
                    currentRequestShow={booleans.currentRequestShow}
                  />
                </>
              )
            ) : null}
          </section>
          {/* History request fetch tabel */}
          <section>
            {booleans.historyRequestShow ? (
              booleans.historyRequestIsEmpty ? (
                <>
                  <h1 className="text-center my-3 mb-4 border-t border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold pt-2">
                    Request History
                  </h1>
                  <h2 className="text-xl text-slate-800 font-semibold text-center w-full mt-5 dark:text-slate-200">
                    No Record Found!!
                  </h2>
                </>
              ) : (
                <>
                  <h1 className="text-center my-3 mb-4 border-t border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold pt-2">
                    Request History
                  </h1>
                  <RequestFetchTabel
                    data={studentHistoryRequestData}
                    id={facultyId}
                    historyRequestShow={booleans.historyRequestShow}
                  />
                </>
              )
            ) : null}
          </section>
          {/* Unusual Students*/}
          <section>
            {booleans.showUnusualSeekedStudents ? (
              booleans.unusualSeekedStudentsIsEmpty ? (
                <>
                  <h1 className="text-center my-3 mb-4 border-t border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold pt-2">
                    Unusual Seekd Students
                  </h1>
                  <h2 className="text-xl text-slate-800 font-semibold text-center w-full mt-5 dark:text-slate-200">
                    No Record Found!!
                  </h2>
                </>
              ) : (
                <>
                  <h1 className="text-center my-3 mb-4 border-t border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold pt-2">
                    Unusual Seekd Students
                  </h1>
                  <UnusualStudentsTabel data={unusualSeekedStudentsdata} />
                </>
              )
            ) : null}
          </section>
        </div>
      </div>
      <div className="facultyPage">
        {/* <h1 style={{ marginBottom: "1.5rem" }}>Faculty Login</h1>
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
        </div> */}

        {/* Student image Tabel */}
        {/* <section>
          <button onClick={getStudentSeekedListRecord}>Seeked History</button>
          {booleans.isEmpty && <h2>No Record is Not Found!!</h2>}
          {booleans.recordShow && <RecordsFetchTabel data={studentSeekedListData} />}
        </section> */}

        {/* view current request */}
        {/* <section>
          <button onClick={getCurrentRequest}>Current Request</button>
          {booleans.currentRequestShow &&
            (booleans.currentRequestIsEmpty ? (
              <h2>No RecordFound!!</h2>
            ) : (
              <RequestFetchTabel
                data={studentCurrentRequestData}
                id={facultyId}
                currentRequestShow={booleans.currentRequestShow}
              />
            ))}
        </section> */}

        {/* view history records */}
        {/* <section>
          <button onClick={getHistoryRequest}>History records</button>
          {booleans.historyRequestIsEmpty && <h2>No RecordFound!!</h2>}
          {booleans.historyRequestShow && (
            <RequestFetchTabel
              data={studentHistoryRequestData}
              id={facultyId}
              historyRequestShow={booleans.historyRequestShow}
            />
          )}
        </section> */}

        {/* Unusual Seeked Students */}
        {/* <section>
          <button onClick={getUnusualSeekedStudents}>Unusual Seeked students</button>
          {booleans.unusualSeekedStudentsIsEmpty && <h2>No recoed found</h2>}
          {booleans.showUnusualSeekedStudents && <UnusualStudentsTabel data={unusualSeekedStudentsdata} />}
        </section> */}
      </div>
    </div>
  );
}

export default FacultyPage;
