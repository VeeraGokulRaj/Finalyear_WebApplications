// import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import HodPage from "./Components/HodPage";
import PrincipalPage from "./Components/PrincipalPage";
import FacultyPage from "./Components/FacultyPage";
import StudentPage from "./Components/StudentPage";
import React, { useState, useEffect } from "react";
import { BsBrightnessHigh } from "react-icons/bs";
import { IoMoon } from "react-icons/io5";
// import Theme from "./Components/Theme";

function App() {
  const [theme, setTheme] = useState(null);
  // to get the default browser Theme
  useEffect(() => {
    if (window.matchMedia("(prefers-color-schema: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  // setting the theme and reloading the componenet everytime when theme changed
  useEffect(
    () => {
      if (theme === "dark") {
        document.documentElement.classList.remove("light"); // Remove light class if present
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark"); // Remove dark class if present
        document.documentElement.classList.add("light");
      }
    },
    [theme]
  );

  function handelThemeChange(event) {
    setTheme(theme === "dark" ? "light" : "dark");
    // console.log(theme);
  }
  return (
    <div className="App w-4/5 mx-auto shadow-x relative bg-white dark:bg-slate-800 ">
      <Router>
        {/* <Theme /> */}
        <div className="z-20 sticky top-0">
          <section className="absolute top-0 right-1 sm:top-2 sm:right-4 md:top-4 md:right-7 ">
            <label className="inline-flex items-center  cursor-pointer ">
              <span className="ms-3  text-sm font-medium mr-2 text-gray-900 ">
                <BsBrightnessHigh className="w-4 h-4 md:w-5 md:h-5 dark:text-white" />
              </span>
              <input type="checkbox" name="theme" onChange={handelThemeChange} value="theme" className="sr-only peer" />
              <div className="relative w-7 h-4 sm:w-9 sm:h-5 md:w-11 md:h-6 bg-gray-400   rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border  after:rounded-full after:h-3 after:w-3 sm:after:h-4 sm:after:w-4 md:after:h-5 md:after:w-5 after:transition-all  peer-checked:bg-blue-600 " />
              <span className="ms-3 text-sm font-medium ml-2 text-gray-900 ">
                <IoMoon className="w-4 h-4 md:w-5 md:h-5 dark:text-white" />
              </span>
            </label>
          </section>
        </div>

        <Routes>
          <Route path="/" element={<LoginPage theme={theme} />} />
          <Route path="/hod" element={<HodPage theme={theme} />} />
          <Route path="/principal" element={<PrincipalPage theme={theme} />} />
          <Route path="/faculty" element={<FacultyPage />} />
          <Route path="/student" element={<StudentPage theme={theme} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
