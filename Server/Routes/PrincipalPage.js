const express = require("express");
const exp = express();
const axios = require("axios");
const bodyparser = require("body-parser");
const cors = require("cors");
const admin = require("./Firebase"); // Import the firebase Admin

exp.use(cors());
exp.use(bodyparser.urlencoded({ extended: false }));
exp.use(express.json());

exp.get("/principal/getPrincipalData", async (req, res) => {
  try {
    const principalId = Number(req.query.principalId); // Use req.query to get parameters from the URL
    const data = await admin
    .database()
    .ref(`/Principal_Hod/${principalId}`)
    .once("value");
    
    var principalData = data.val();
    // setting Expire Time
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10);
    
    // get HOD image
    const filePath = `FacultyImages/${principalId}.jpg`;
    const fileRef = admin
      .storage()
      .bucket()
      .file(filePath);
    const [url] = await fileRef.getSignedUrl({ action: "read", expires: new Date(Date.now() + 5 * 60 * 1000) });
    principalData = { ...principalData, principalImgUrl: url };
    res.status(200).send(principalData);
  } catch (error) {
    console.error("Error in /principal/getPrincipalData route:", error);
    res.status(500).send("Internal Server Error");
  }
});

exp.listen(8004, () => {
  console.log("Principal Page Page is Running...");
});

module.exports = exp;
