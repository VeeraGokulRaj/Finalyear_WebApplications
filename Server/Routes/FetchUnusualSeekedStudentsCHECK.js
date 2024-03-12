const express = require("express");
const exp = express();
const axios = require("axios");
const bodyparser = require("body-parser");
const cors = require("cors");
const admin = require("./Firebase"); // Import the firebase Admin

exp.use(cors());
exp.use(bodyparser.urlencoded({ extended: false }));
exp.use(express.json());

async function getUnusualSeekedStudents(folderName) {
  try {
    const bucket = admin.storage().bucket();
    const options = {
      prefix: folderName
    };
    // getting all the files in the UnusualSeekedStudentsCHECK
    const [files] = await bucket.getFiles(options);
    const fileData = [];

    // Storing the url and filename in the fileData array
    for (const file of files) {
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: new Date(Date.now() + 5 * 60 * 1000)
      });

      const filename = file.name.split("/").pop(); // Extracting filename from the full path

      fileData.push({
        filename,
        url
      });
    }
    return fileData;
  } catch (error) {
    console.log("Error in fetching Data Unusual students data", error);
  }
}

// Export the FetchData function
module.exports = getUnusualSeekedStudents;
