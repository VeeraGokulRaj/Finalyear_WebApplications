import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import RecordsFetchTabel from "./RecordsFetchTabel";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

function PrincipalPage(props) {
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
    findByRegnoIsEmpty: false,
    showItSeekedData: false,
    showCseSeekedData: false,
    showRegForm: false,
    showItSelectionForm: false,
    showCseSelectionForm: false
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

  function selectClassAndSectionForm() {
    setBooleans(prevData => ({ ...prevData, showForms: !prevData.showForms }));
  }

  function showItSelectionForm() {
    setBooleans(prevData => ({ ...prevData, showItSelectionForm: !prevData.showItSelectionForm }));
  }

  function showCseSelectionForm() {
    setBooleans(prevData => ({ ...prevData, showCseSelectionForm: !prevData.showCseSelectionForm }));
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
          seekedItStudentIsEmpty: true,
          showItSeekedData: true
        }));
        return;
      }
      setBooleans(prevData => ({
        ...prevData,
        showItSeekedData: true
      }));
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
          seekedCseStudentIsEmpty: true,
          showCseSeekedData: true
        }));
        return;
      }
      setBooleans(prevData => ({
        ...prevData,
        showCseSeekedData: true
      }));
      setSeekedCseStudents(response.data);
    } else {
      window.alert("Select any field");
    }
  }

  // show Reg form
  function showRegForm() {
    setBooleans(prevData => ({
      ...prevData,
      showRegForm: !prevData.showRegForm
    }));
    // console.log(booleans.showRegForm);
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
  const [regnoFocus, setRegnoFocus] = useState(false);
  return (
    <div className="relative">
      <section className="z-10 sticky top-0 bg-gradient-to-r from-sky-500 to-blue-400 dark:from-slate-400 dark:to-gray-400 py-4">
        <h1 className=" text-center pb-1  dark:text-white text-white text-3xl font-semibold">Principal Page</h1>
        <section className=" h-0.1  w-24 items-center bg-white mx-auto  " />
      </section>

      {/* Principal img and details */}
      {principalData ? (
        <div className="border-b border-gray-300 dark:border-gray-500 ">
          <section
            className="my-3 py-3 w-10/12 text-extraSmall sm:text-extraSmallPlus md:text-base 
          md:w-4/5 flex justify-around mx-auto  boxShadow-x shadow-x"
          >
            <div className="flex md:justify-evenly my-auto leading-loose">
              <div>
                <p className="text-slate-600 dark:text-slate-400">Name</p>
                <p className="text-slate-600 dark:text-slate-400">Principal ID</p>
                <p className="text-slate-600 dark:text-slate-400">Email</p>
                <p className="text-slate-600 dark:text-slate-400">College</p>
              </div>
              <div className="ml-0 md:ml-10">
                <p className="text-slate-900 dark:text-white">{principalData.name}</p>
                <p className="text-slate-900 dark:text-white">{principalId}</p>
                <p className="text-slate-900 dark:text-white">{principalData.email}</p>
                <p className="text-slate-900 dark:text-white">{principalData.college}</p>
              </div>
            </div>

            <div className="w-8.3 md:w-1/5" style={{}}>
              {principalData.principalImgUrl && (
                <img
                  src={principalData.principalImgUrl}
                  alt={`Principal ${principalId} Img`}
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
              {booleans.showForms && (
                <>
                  {/* IT button */}
                  <div className="flex pt-2">
                    <span className="my-auto">
                      <MdKeyboardDoubleArrowRight className="md:scale-125 text-slate-800 dark:text-slate-400" />
                    </span>
                    <button
                      className="dark:text-white text-blue-500 text-lg md:text-xl font-medium"
                      onClick={showItSelectionForm}
                    >
                      IT
                    </button>
                  </div>
                  {/* IT Seeked Students class selection Seeked Form */}
                  {booleans.showItSelectionForm && (
                    <>
                      <div className="flex  justify-around ">
                        <section className="flex flex-col">
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="FirstYearA"
                            >
                              FirstYear A:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectItFormData.firstYearSectionA}
                              onChange={itHandelChange}
                              id="FirstYearA"
                              name="firstYearSectionA"
                            />
                          </div>
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="firstYearSectionB"
                            >
                              FirstYear B:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectItFormData.firstYearSectionB}
                              onChange={itHandelChange}
                              id="firstYearSectionB"
                              name="firstYearSectionB"
                            />
                          </div>
                        </section>

                        <section className="flex flex-col">
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="secondYearSectionA"
                            >
                              SecondYear A:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectItFormData.secondYearSectionA}
                              onChange={itHandelChange}
                              id="secondYearSectionA"
                              name="secondYearSectionA"
                            />
                          </div>
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="secondYearSectionB"
                            >
                              SecondYear B:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectItFormData.secondYearSectionB}
                              onChange={itHandelChange}
                              id="secondYearSectionB"
                              name="secondYearSectionB"
                            />
                          </div>
                        </section>

                        <section className="flex flex-col">
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="thirdYearSectionA"
                            >
                              ThirdYear A:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectItFormData.thirdYearSectionA}
                              onChange={itHandelChange}
                              id="thirdYearSectionA"
                              name="thirdYearSectionA"
                            />
                          </div>
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="thirdYearSectionB"
                            >
                              ThirdYear B:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectItFormData.thirdYearSectionB}
                              onChange={itHandelChange}
                              id="thirdYearSectionB"
                              name="thirdYearSectionB"
                            />
                          </div>
                        </section>

                        <section className="flex flex-col">
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="finalYearSectionA"
                            >
                              FinalYear A:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectItFormData.finalYearSectionA}
                              onChange={itHandelChange}
                              id="finalYearSectionA"
                              name="finalYearSectionA"
                            />
                          </div>
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="finalYearSectionB"
                            >
                              FinalYear B:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectItFormData.finalYearSectionB}
                              onChange={itHandelChange}
                              id="finalYearSectionB"
                              name="finalYearSectionB"
                            />
                          </div>
                        </section>
                      </div>

                      {/* IT seeked button & Data */}
                      <section className="flex flex-col items-center">
                        <button
                          className=" bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg font-bold cursor-pointer outline-none mt-4 mb-3"
                          onClick={getItData}
                        >
                          Proceed
                        </button>
                        <div>
                          {booleans.showItSeekedData ? (
                            booleans.seekedItStudentIsEmpty ? (
                              <h2 className="text-lg md:text-xl text-slate-800 font-semibold text-center w-full mt-2 dark:text-slate-200">
                                No Record Found!!
                              </h2>
                            ) : (
                              <RecordsFetchTabel data={seekdItStudents} />
                            )
                          ) : null}
                        </div>
                      </section>
                    </>
                  )}

                  {/* Cse button */}
                  <div className="flex">
                    <span className="my-auto">
                      <MdKeyboardDoubleArrowRight className="md:scale-125 text-slate-800 dark:text-slate-400" />
                    </span>
                    <button
                      className="dark:text-white text-blue-500 text-lg md:text-xl font-medium"
                      onClick={showCseSelectionForm}
                    >
                      CSE
                    </button>
                  </div>
                  {/*CSE  Seeked Students class selection Seeked Form */}
                  {booleans.showCseSelectionForm && (
                    <>
                      <div className="flex  justify-around ">
                        <section className="flex flex-col">
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="CseFirstYearA"
                            >
                              FirstYear A:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectCseFormData.firstYearSectionA}
                              onChange={cseHandelChange}
                              id="CseFirstYearA"
                              name="firstYearSectionA"
                            />
                          </div>
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="CsefirstYearSectionB"
                            >
                              FirstYear B:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectCseFormData.firstYearSectionB}
                              onChange={cseHandelChange}
                              id="CsefirstYearSectionB"
                              name="firstYearSectionB"
                            />
                          </div>
                        </section>

                        <section className="flex flex-col">
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="CsesecondYearSectionA"
                            >
                              SecondYear A:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectCseFormData.secondYearSectionA}
                              onChange={cseHandelChange}
                              id="CsesecondYearSectionA"
                              name="secondYearSectionA"
                            />
                          </div>
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="CsesecondYearSectionB"
                            >
                              SecondYear B:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectCseFormData.secondYearSectionB}
                              onChange={cseHandelChange}
                              id="CsesecondYearSectionB"
                              name="secondYearSectionB"
                            />
                          </div>
                        </section>

                        <section className="flex flex-col">
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="CsethirdYearSectionA"
                            >
                              ThirdYear A:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectCseFormData.thirdYearSectionA}
                              onChange={cseHandelChange}
                              id="CsethirdYearSectionA"
                              name="thirdYearSectionA"
                            />
                          </div>
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="CsethirdYearSectionB"
                            >
                              ThirdYear B:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectCseFormData.thirdYearSectionB}
                              onChange={cseHandelChange}
                              id="CsethirdYearSectionB"
                              name="thirdYearSectionB"
                            />
                          </div>
                        </section>

                        <section className="flex flex-col">
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="CsefinalYearSectionA"
                            >
                              FinalYear A:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectCseFormData.finalYearSectionA}
                              onChange={cseHandelChange}
                              id="CsefinalYearSectionA"
                              name="finalYearSectionA"
                            />
                          </div>
                          <div className="flex item-center">
                            <label
                              className="text-slate-900 dark:text-slate-300 text-extraSmall sm:text-sm mr-1 "
                              htmlFor="CsefinalYearSectionB"
                            >
                              FinalYear B:
                            </label>
                            <input
                              type="checkbox"
                              checked={selectCseFormData.finalYearSectionB}
                              onChange={cseHandelChange}
                              id="CsefinalYearSectionB"
                              name="finalYearSectionB"
                            />
                          </div>
                        </section>
                      </div>

                      {/* IT seeked button & Data */}
                      <section className="flex flex-col items-center">
                        <button
                          className="bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg font-bold cursor-pointer outline-none mt-4 mb-3"
                          onClick={getCseData}
                        >
                          Proceed
                        </button>
                        <div>
                          {booleans.showCseSeekedData ? (
                            booleans.seekedCseStudentIsEmpty ? (
                              <h2 className="text-lg md:text-xl text-slate-800 font-semibold text-center w-full mt-2 dark:text-slate-200">
                                No Record Found!!
                              </h2>
                            ) : (
                              <RecordsFetchTabel data={seekdCseStudents} />
                            )
                          ) : null}
                        </div>
                      </section>
                    </>
                  )}
                </>
              )}
            </section>
          </section>

          {/* Find by regno */}
          <button
            className="block text-basePlus text-slate-800 font-medium py-2 border-gray-300 border-b-2 transition-colors duration-200 hover:bg-slate-300 hover:text-blue-600 group-hover:bg-slate-100 group-hover:text-blue-600 dark:text-slate-200 dark:hover:text-slate-800 dark:hover:bg-slate-200 dark:border-gray-500"
            onClick={showRegForm}
          >
            Regno Search
          </button>
          <section className="block  md:hidden md:border-gray-300 md:border-b-2 md:pb-2 md:mb-2 ">
            <section className="w-full ">
              {booleans.showRegForm && (
                <div className="flex flex-col justify-center items-center pt-2">
                  <section className="pt-2">
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
            {/* Rendering data */}
            <section>
              {booleans.showRegForm ? (
                booleans.findByRegnoIsEmpty ? (
                  <h2 className="text-xl text-slate-800 font-semibold text-center w-full mt-5 dark:text-slate-200">
                    No Record Found!!
                  </h2>
                ) : (
                  <RecordsFetchTabel data={studentDataByRegno} />
                )
              ) : null}
            </section>
          </section>
        </div>

        {/* Selected data */}
        <div className="hidden  md:flex flex-col justify-items-center items-center w-85">
          <section className="w-full">
            {booleans.showForms && (
              <>
                <h1 className="text-center py-3 mb-4 border-b border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold">
                  Seeked History
                </h1>
                {/* IT button */}
                <div className="flex">
                  <span className="my-auto">
                    <MdKeyboardDoubleArrowRight className="scale-125 text-slate-800 dark:text-slate-400" />
                  </span>
                  <button className="dark:text-white text-blue-500 text-xl font-medium" onClick={showItSelectionForm}>
                    IT
                  </button>
                </div>
                {/* IT Seeked Students class selection Seeked Form */}
                {booleans.showItSelectionForm && (
                  <>
                    <div className="flex  justify-around ">
                      <section className="flex flex-col">
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="FirstYearA">
                            FirstYear A:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectItFormData.firstYearSectionA}
                            onChange={itHandelChange}
                            id="FirstYearA"
                            name="firstYearSectionA"
                          />
                        </div>
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="firstYearSectionB">
                            FirstYear B:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectItFormData.firstYearSectionB}
                            onChange={itHandelChange}
                            id="firstYearSectionB"
                            name="firstYearSectionB"
                          />
                        </div>
                      </section>

                      <section className="flex flex-col">
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="secondYearSectionA">
                            SecondYear A:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectItFormData.secondYearSectionA}
                            onChange={itHandelChange}
                            id="secondYearSectionA"
                            name="secondYearSectionA"
                          />
                        </div>
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="secondYearSectionB">
                            SecondYear B:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectItFormData.secondYearSectionB}
                            onChange={itHandelChange}
                            id="secondYearSectionB"
                            name="secondYearSectionB"
                          />
                        </div>
                      </section>

                      <section className="flex flex-col">
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="thirdYearSectionA">
                            ThirdYear A:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectItFormData.thirdYearSectionA}
                            onChange={itHandelChange}
                            id="thirdYearSectionA"
                            name="thirdYearSectionA"
                          />
                        </div>
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="thirdYearSectionB">
                            ThirdYear B:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectItFormData.thirdYearSectionB}
                            onChange={itHandelChange}
                            id="thirdYearSectionB"
                            name="thirdYearSectionB"
                          />
                        </div>
                      </section>

                      <section className="flex flex-col">
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="finalYearSectionA">
                            FinalYear A:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectItFormData.finalYearSectionA}
                            onChange={itHandelChange}
                            id="finalYearSectionA"
                            name="finalYearSectionA"
                          />
                        </div>
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="finalYearSectionB">
                            FinalYear B:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectItFormData.finalYearSectionB}
                            onChange={itHandelChange}
                            id="finalYearSectionB"
                            name="finalYearSectionB"
                          />
                        </div>
                      </section>
                    </div>

                    {/* IT seeked button & Data */}
                    <section className="flex flex-col items-center">
                      <button
                        className="w-1/5 bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg font-bold cursor-pointer outline-none mt-4 mb-3"
                        onClick={getItData}
                      >
                        Proceed
                      </button>
                      <div>
                        {booleans.showItSeekedData ? (
                          booleans.seekedItStudentIsEmpty ? (
                            <h2 className="text-xl text-slate-800 font-semibold text-center w-full mt-5 dark:text-slate-200">
                              No Record Found!!
                            </h2>
                          ) : (
                            <RecordsFetchTabel data={seekdItStudents} />
                          )
                        ) : null}
                      </div>
                    </section>
                  </>
                )}

                {/* Cse button */}
                <div className="flex">
                  <span className="my-auto">
                    <MdKeyboardDoubleArrowRight className="scale-125 text-slate-800 dark:text-slate-400" />
                  </span>
                  <button className="dark:text-white text-blue-500 text-xl font-medium" onClick={showCseSelectionForm}>
                    CSE
                  </button>
                </div>
                {/*CSE  Seeked Students class selection Seeked Form */}
                {booleans.showCseSelectionForm && (
                  <>
                    <div className="flex  justify-around ">
                      <section className="flex flex-col">
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="CseFirstYearA">
                            FirstYear A:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectCseFormData.firstYearSectionA}
                            onChange={cseHandelChange}
                            id="CseFirstYearA"
                            name="firstYearSectionA"
                          />
                        </div>
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="CsefirstYearSectionB">
                            FirstYear B:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectCseFormData.firstYearSectionB}
                            onChange={cseHandelChange}
                            id="CsefirstYearSectionB"
                            name="firstYearSectionB"
                          />
                        </div>
                      </section>

                      <section className="flex flex-col">
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="CsesecondYearSectionA">
                            SecondYear A:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectCseFormData.secondYearSectionA}
                            onChange={cseHandelChange}
                            id="CsesecondYearSectionA"
                            name="secondYearSectionA"
                          />
                        </div>
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="CsesecondYearSectionB">
                            SecondYear B:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectCseFormData.secondYearSectionB}
                            onChange={cseHandelChange}
                            id="CsesecondYearSectionB"
                            name="secondYearSectionB"
                          />
                        </div>
                      </section>

                      <section className="flex flex-col">
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="CsethirdYearSectionA">
                            ThirdYear A:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectCseFormData.thirdYearSectionA}
                            onChange={cseHandelChange}
                            id="CsethirdYearSectionA"
                            name="thirdYearSectionA"
                          />
                        </div>
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="CsethirdYearSectionB">
                            ThirdYear B:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectCseFormData.thirdYearSectionB}
                            onChange={cseHandelChange}
                            id="CsethirdYearSectionB"
                            name="thirdYearSectionB"
                          />
                        </div>
                      </section>

                      <section className="flex flex-col">
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="CsefinalYearSectionA">
                            FinalYear A:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectCseFormData.finalYearSectionA}
                            onChange={cseHandelChange}
                            id="CsefinalYearSectionA"
                            name="finalYearSectionA"
                          />
                        </div>
                        <div className="flex item-center">
                          <label className="text-slate-900 dark:text-slate-300 mr-2" htmlFor="CsefinalYearSectionB">
                            FinalYear B:
                          </label>
                          <input
                            type="checkbox"
                            checked={selectCseFormData.finalYearSectionB}
                            onChange={cseHandelChange}
                            id="CsefinalYearSectionB"
                            name="finalYearSectionB"
                          />
                        </div>
                      </section>
                    </div>

                    {/* IT seeked button & Data */}
                    <section className="flex flex-col items-center">
                      <button
                        className="w-1/5 bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg font-bold cursor-pointer outline-none mt-4 mb-3"
                        onClick={getCseData}
                      >
                        Proceed
                      </button>
                      <div>
                        {booleans.showCseSeekedData ? (
                          booleans.seekedCseStudentIsEmpty ? (
                            <h2 className="text-xl text-slate-800 font-semibold text-center w-full mt-5 dark:text-slate-200">
                              No Record Found!!
                            </h2>
                          ) : (
                            <RecordsFetchTabel data={seekdCseStudents} />
                          )
                        ) : null}
                      </div>
                    </section>
                  </>
                )}
              </>
            )}
          </section>

          {/* Regno Search */}
          <section className="w-full ">
            {booleans.showRegForm && (
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
          {/* Rendering data */}
          <section>
            {booleans.showRegForm ? (
              booleans.findByRegnoIsEmpty ? (
                <h2 className="text-xl text-slate-800 font-semibold text-center w-full mt-5 dark:text-slate-200">
                  No Record Found!!
                </h2>
              ) : (
                <RecordsFetchTabel data={studentDataByRegno} />
              )
            ) : null}
          </section>
        </div>
      </div>


    </div>
  );
}

export default PrincipalPage;
