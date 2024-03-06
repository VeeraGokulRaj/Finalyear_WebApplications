const express = require("express");
const exp = express();
const axios = require("axios");
const bodyparser = require("body-parser");
const cors = require("cors");
const admin = require("./Firebase"); // Import the firebase Admin

exp.use(cors());
exp.use(bodyparser.urlencoded({ extended: false }));
exp.use(express.json());

exp.get("/faculty/getfacultyData", async (req, res) => {
  try {
    const facultyId = Number(req.query.facultyId); // Use req.query to get parameters from the URL
    const data = await admin
      .database()
      .ref(`/Faculty/${facultyId}`)
      .once("value");
    var facultyData = data.val();
    // setting Expire Time
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10);
    // get Faculty image
    const filePath = `FacultyImages/${facultyId}.jpg`;
    const fileRef = admin
      .storage()
      .bucket()
      .file(filePath);
    const [url] = await fileRef.getSignedUrl({ action: "read", expires: expirationTime });

    facultyData = { ...facultyData, facultyImgUrl: url };
    res.status(200).send(facultyData);
  } catch (error) {
    console.error("Error in /faculty/getFacultyData route:", error);
    res.status(500).send("Internal Server Error");
  }
});

exp.listen(8002, () => {
  console.log("Faculty Page is Running...");
});

module.exports = exp;
