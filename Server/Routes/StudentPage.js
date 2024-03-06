const express = require("express");
const exp = express();
const axios = require("axios");
const bodyparser = require("body-parser");
const cors = require("cors");
const admin = require("./Firebase"); // Import the firebase Admin

exp.use(cors());
exp.use(bodyparser.urlencoded({ extended: false }));
exp.use(express.json());

exp.get("/student/getStudentData", async (req, res) => {
  try {
    const studentId = Number(req.query.studentId); // Use req.query to get parameters from the URL
    const data = await admin
      .database()
      .ref(`/Students/${studentId}`)
      .once("value");
    var studentData = data.val();
    // setting Expire Time
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10);

    // get student image
    const filePath = `StudentImages/${studentId}.jpg`;
    const fileRef = admin
      .storage()
      .bucket()
      .file(filePath);
    const [url] = await fileRef.getSignedUrl({ action: "read", expires: expirationTime });
    console.log(url)
    studentData = { ...studentData, studentImgUrl: url };
    res.status(200).send(studentData);
  } catch (error) {
    console.error("Error in /student/getStudentData route:", error);
    res.status(500).send("Internal Server Error");
  }
});

exp.listen(8001, () => {
  console.log("Student Page is Running...");
});

module.exports = exp;
