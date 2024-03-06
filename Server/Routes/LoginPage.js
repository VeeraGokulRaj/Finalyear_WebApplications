const express = require("express");
const exp = express();
const axios = require("axios");
const bodyparser = require("body-parser");
const cors = require("cors");
const admin = require("./Firebase"); // Import the firebase Admin
const nodemailer = require("nodemailer");


exp.use(cors());
exp.use(bodyparser.urlencoded({ extended: false }));
exp.use(express.json());

// OTP Generator
const otpGenarator = () => {
  let otp = "",i=0; //i is to check the first digit is zero
  while(otp.length !=6){
    otp += Math.floor(Math.random() * 10)
    if(i === 0 && otp==="0")
      opt=""
    else i++;
  }
  // for (let i = 1; i <= 6; i++) otp += Math.floor(Math.random() * 10);
  return Number(otp);
};

// MailSender
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "techtracks17@gmail.com", // replace with your email
    pass: "thkhdavamkqutztf" // replace with your email password
  }
});

exp.post("/login", async (req, res) => {
  const { userID, recaptchaValue, hodOrPrinciple, email } = req.body;
  const password = Number(req.body.password);
  const authCode = Number(req.body.authentication);

  const secretKey = "6LdjOoQpAAAAAHG_VML8K9PRAjsY3lD_KyFBlM-O"; //  secret key
  const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaValue}`;

  //Verification for the Captcha
  try {
    const recaptchaResponse = await axios.post(recaptchaVerifyUrl);
    const recaptchaSuccess = recaptchaResponse.data.success;

    if (!recaptchaSuccess) {
      console.log("reCAPTCHA verification failed");

      return res.status(400).send("reCAPTCHA verification failed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(false);
  }

  //ensuring the userID Length
  const userIdLength = userID.length;
  if (userIdLength !== 8 && userIdLength !== 7 && userIdLength !== 4 && userIdLength !== 5) {
    res.status(401).send(false);
    return;
  }

  // Login verification for the students and the faculty
  if (userIdLength === 8 || userIdLength === 7) {
    try {
      // Use Firebase Admin SDK to check user credentials
      const userdata = await admin
        .database()
        .ref(`/Users/${userID}`)
        .once("value");
      const user = userdata.val();

      if (user && user.password === password) {
        // Passwords match, authentication successful
        res.status(200).send("Student/Faculty Login");
      } else {
        // Passwords do not match or user not found
        res.status(401).send(false);
      }
    } catch (error) {
      // Handle errors (e.g., database read error)
      console.error(error);
      res.status(401).send(false);
    }
  }

  // login verification for HOD and Principle
  if (userIdLength === 4 || userIdLength === 5) {
    try {
      const userdata = await admin
        .database()
        .ref(`/Users/${userID}`)
        .once("value");
      const user = userdata.val();

      if (user && user.password === password && user.email === email && user.otp === authCode && authCode > 0) {
        await userdata.ref.update({
          otp: -1
        });

        res.status(200).send("HOD/Principle Login");
      } else {
        res.status(401).send(false);
      }
    } catch (error) {
      console.error(error);
      res.status(401).send(false);
    }
  }
});

// OTP Generator Route
exp.post("/getOtp", async (req, res) => {
  const { userID, hodOrPrinciple, email } = req.body;
  const password = Number(req.body.password);
  const otp = otpGenarator();

  try {
    const userdata = await admin
      .database()
      .ref(`/Users/${userID}`)
      .once("value");
    const user = userdata.val();

    if (user && user.password === password && user.email === email) {
      //setting the OTP in Database
      await userdata.ref.update({
        otp: otp
      });

      //Sending OTP in mail
      const mailContent = {
        from: "techtracks17@gmail.com", // replace with your email
        to: email,
        subject: "OTP for Login",
        text: `Your OTP for login is: ${otp}`
      };

      await transporter.sendMail(mailContent, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          res.status(500).send(false);
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).send("OTP Sended to the user Gmail");
        }
      });

      // res.status(200).send("OTP Addded to data base and Sended to user mail");
    } else {
      // Passwords do not match or user not found
      res.status(401).send(false);
    }
  } catch (error) {
    console.error(error);
    res.status(401).send(false);
  }
});

exp.listen(8000, () => {
  console.log("Login page is Running...");
});

module.exports = exp;