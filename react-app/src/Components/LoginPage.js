import React, { useState, useEffect } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";

function LoginPage(props) {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    email: "",
    authentication: "",
    hodOrPrinciple: false,
    recaptchaValue: null
  });

  function handelChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData(prevData => {
      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value
      };
    });
  }

  useEffect(() => {}, [formData.hodOrPrinciple, formData]);

  const onRecaptchaChange = value => {
    setFormData(prevData => ({
      ...prevData,
      recaptchaValue: value
    }));
  };

  const recaptchaRef = React.createRef();
  const navigate = useNavigate();
  // Login page submit
  const loginSubmit = async event => {
    event.preventDefault();
    try {
      if (!formData.recaptchaValue) {
        // console.log("Please validate reCAPTCHA");
        window.alert("Check reCAPTCHA");
        return;
      }

      if (!formData.hodOrPrinciple) {
        setFormData(prevData => ({
          ...prevData,
          email: "",
          authentication: ""
        }));
      }

      // Reset the reCAPTCHA component and state
      setFormData(prevData => ({
        ...prevData,
        recaptchaValue: null
      }));

      recaptchaRef.current.reset();

      const response = await axios.post("http://localhost:8000/login", {
        userID: formData.userId,
        password: formData.password,
        email: formData.email,
        hodOrPrinciple: formData.hodOrPrinciple,
        recaptchaValue: formData.recaptchaValue,
        authentication: formData.authentication
      });

      if (response.data) {
        // const  userId  = formData.userId.toString();
        // Navigates to respective Routes
        if (formData.userId.length === 4) {
          navigate("/principal", { state: { formData } });
        } else if (formData.userId.length === 5) {
          navigate("/hod", { state: { formData } });
        } else if (formData.userId.length === 7) {
          navigate("/faculty", { state: { formData } });
        } else if (formData.userId.length === 8) {
          navigate("/student", { state: { formData } });
        }
      } else {
        response.status === 401 ? window.alert("Ensure user Details") : window.alert("Reloaad the page");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        window.alert("Captcha Server Error");
      } else if (error.response && error.response.status === 401) {
        window.alert("Ensure user Details");
      } else {
        window.alert("An error occurred during login. Please try again.");
      }
      console.error("Error during login:", error);
    }
  };

  // OTP Gererator
  const generateOtp = async event => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/getOtp", {
        userID: formData.userId,
        password: formData.password,
        email: formData.email,
        hodOrPrinciple: formData.hodOrPrinciple
      });

      if (response.data) {
        window.alert("OTP sended successfully");
      } else {
        response.status === 401 ? window.alert("Ensure user Login") : window.alert("Reloaad the page");
      }
    } catch (error) {
      window.alert("Ensure user Details");
      console.error("Error during login:", error);
    }
  };

  const [idFocused, setIdFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [otpFocused, setOtpFocused] = useState(false);

  return (
    <>
      <div className="w-4/5 mx-auto my-2 flex pb-5 md:pb-0">
        <div className="hidden md:block md:w-1/2 h-full">
          <img className="max-h-full max-w-full my-9 m-auto" src="/Images/Login-page.jpg" alt="Login-Image" />
        </div>
        {/* Login form */}
        <div className="w-full md:w-1/2  md:p-8 md:ml-5 mt-5  rounded-lg h-full transition-all">
          <h1 className="text-center pb-5 mb-4 border-b border-gray-300 dark:text-white text-blue-500 text-2xl font-semibold">
            Login Page
          </h1>
          <form>
            <div
              className={`txt mb-8 relative border-b-2  ${
                props.theme === "light" ? (idFocused ? "border-blue-500" : "border-gray-400") : "border-gray-400"
              }     
              }`}
            >
              <input
                type="text"
                name="userId"
                id="stuName"
                required
                className={`w-full py-2 px-1 outline-none ${
                  props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black "
                }`}
                onChange={handelChange}
                value={formData.userId}
                onFocus={() => setIdFocused(true)}
                onBlur={() => formData.userId === "" && setIdFocused(false)}
              />
              <label
                htmlFor="stuName"
                className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                  idFocused ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                }`}
              >
                User ID
              </label>
            </div>
            <div
              className={`txt mb-8 relative border-b-2  ${
                props.theme === "light" ? (passFocused ? "border-blue-500" : "border-gray-400") : "border-gray-400"
              }     
              }`}
            >
              <input
                type="password"
                name="password"
                id="stuPass"
                required
                className={`w-full py-2 px-1 outline-none ${
                  props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black"
                }`}
                onChange={handelChange}
                value={formData.password}
                onFocus={() => setPassFocused(true)}
                onBlur={() => formData.password === "" && setPassFocused(false)}
              />
              <label
                htmlFor="stuPass"
                className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                  passFocused ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                }`}
              >
                Password
              </label>
            </div>
            <div className="my-4 flex justify-center">
              <label htmlFor="hodOrPrinciple" className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="hodOrPrinciple"
                  className="form-checkbox"
                  checked={formData.hodOrPrinciple}
                  onChange={handelChange}
                  name="hodOrPrinciple"
                />
                <span className="ml-2 dark:text-white">HOD/Principal</span>
              </label>
            </div>
            <section className={`transition-opacity duration-500 ${formData.hodOrPrinciple ? "opacity-100" : "opacity-0"}`}>
              {formData.hodOrPrinciple && (
                <>
                  <div className="flex flex-col md:flex-row items-center mb-8 justify-between">
                    <section
                      className={`relative border-b-2  ${
                        props.theme === "light" ? (idFocused ? "border-blue-500" : "border-gray-400") : "border-gray-400"
                      }`}
                    >
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className={`w-full py-2 px-1 outline-none ${
                          props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black"
                        }`}
                        onChange={handelChange}
                        value={formData.email}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => formData.email === "" && setEmailFocused(false)}
                      />
                      <label
                        htmlFor="email"
                        className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                          emailFocused ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                        }`}
                      >
                        Email
                      </label>
                    </section>
                    <button
                      onClick={generateOtp}
                      className="mt-5 md:ml-4 bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg font-bold cursor-pointer outline-none md:mt-0"
                    >
                      Get OTP
                    </button>
                  </div>
                  <div
                    className={`txt mb-8 relative border-b-2  ${
                      props.theme === "light" ? (otpFocused ? "border-blue-500" : "border-gray-400") : "border-gray-400"
                    }     
              }`}
                  >
                    <input
                      type="text"
                      name="authentication"
                      id="otp"
                      required
                      className={`w-full py-2 px-1 outline-none ${
                        props.theme === "dark" ? "text-white dark:bg-slate-800" : "dark:text-black"
                      }`}
                      onChange={handelChange}
                      value={formData.authentication}
                      onFocus={() => setOtpFocused(true)}
                      onBlur={() => formData.authentication === "" && setOtpFocused(false)}
                    />
                    <label
                      htmlFor="otp"
                      className={`dark:text-slate-400 absolute left-0 transition-all duration-400 ${
                        otpFocused ? "-top-3 text-blue-500" : "top-2 text-gray-400"
                      }`}
                    >
                      OTP
                    </label>
                  </div>
                </>
              )}
            </section>

            <section className="w-9/12 mx-auto md:w-full grid place-content-center">
              <ReCAPTCHA
                sitekey="6LdjOoQpAAAAAMRraSxhCQcThr_AoQ8GyFqsNqV0"
                onChange={onRecaptchaChange}
                ref={recaptchaRef}
                onLoad={() => console.log("reCAPTCHA loaded")}
              />
            </section>

            <button
              onClick={loginSubmit}
              className="w-full bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg font-bold cursor-pointer outline-none mt-4"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
