const express = require("express");
const exp = express();
const axios = require("axios");
const bodyparser = require("body-parser");
const cors = require("cors");
const admin = require("./Firebase"); // Import the firebase Admin

exp.use(cors());
exp.use(bodyparser.urlencoded({ extended: false }));
exp.use(express.json());

exp.get("/hod/getHodData", async (req, res) => {
  try {
    const hodId = Number(req.query.hodId); // Use req.query to get parameters from the URL
    const data = await admin
    .database()
    .ref(`/Principal_Hod/${hodId}`)
    .once("value");
    var hodData = data.val();
    // setting Expire Time
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10);
    
    // get HOD image
    const filePath = `FacultyImages/${hodId}.jpg`;
    const fileRef = admin
      .storage()
      .bucket()
      .file(filePath);
    const [url] = await fileRef.getSignedUrl({ action: "read", expires: expirationTime });
    hodData = { ...hodData, hodImgUrl: url };

    res.status(200).send(hodData);
  } catch (error) {
    console.error("Error in /hod/getHodData route:", error);
    res.status(500).send("Internal Server Error");
  }
});

exp.listen(8003, () => {
  console.log("HOD Page is Running...");
});

module.exports = exp;
