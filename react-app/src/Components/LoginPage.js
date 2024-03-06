import React, { useState, useEffect } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";

function LoginPage() {
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

  useEffect(() => {}, [formData.hodOrPrinciple]);

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
          navigate("/principal", { state: {formData} });
        } else if (formData.userId.length === 5) {
          navigate("/hod", { state: {formData} });
        } else if (formData.userId.length === 7) {
          navigate("/faculty", { state: {formData} });
        } else if (formData.userId.length === 8) {
          console.log(formData.userId);
          navigate("/student", { state: {formData} });
        }
        // else {
        //   console.log("invalid", formData.userId.length);
        // }
      } else {
        response.status === 401 ? window.alert("Ensure user Details") : window.alert("Reloaad the page");
      }
    } catch (error) {
      window.alert("Ensure user Details");
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

  return (
    <section className="loginForm" style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <input
        required
        style={{ display: "block" }}
        type="text"
        name="userId"
        placeholder="UserID"
        onChange={handelChange}
        value={formData.userId}
      />

      <input
        required
        style={{ display: "block" }}
        type="password"
        name="password"
        placeholder="password"
        onChange={handelChange}
        value={formData.password}
      />

      <div>
        {formData.hodOrPrinciple && (
          <section>
            <input required type="email" name="email" placeholder="Email" onChange={handelChange} value={formData.email} />

            <button onClick={generateOtp}>Get OTP</button>

            <input
              required
              style={{ display: "block" }}
              type="text"
              name="authentication"
              placeholder="Code"
              onChange={handelChange}
              value={formData.authentication}
            />
          </section>
        )}
      </div>

      <input type="checkbox" checked={formData.hodOrPrinciple} onChange={handelChange} name="hodOrPrinciple" />

      {/* <ReCAPTCHA sitekey="6LdjOoQpAAAAAMRraSxhCQcThr_AoQ8GyFqsNqV0" onChange={onRecaptchaChange} ref={recaptchaRef} /> */}

      <ReCAPTCHA sitekey="6LdjOoQpAAAAAMRraSxhCQcThr_AoQ8GyFqsNqV0" onChange={onRecaptchaChange} ref={recaptchaRef} onLoad={() => console.log("reCAPTCHA loaded")} />


      <button style={{ display: "block" }} onClick={loginSubmit}>
        sumbit
      </button>
    </section>
  );
}

export default LoginPage;
