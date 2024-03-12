const express = require("express");
const exp = express();
const axios = require("axios");
const bodyparser = require("body-parser");
const cors = require("cors");
const admin = require("./Firebase"); // Import the firebase Admin

exp.use(cors());
exp.use(bodyparser.urlencoded({ extended: false }));
exp.use(express.json());

async function checkImgExists(filename) {
    const filePath = `SeekedStudents/${filename}.jpg`;
    return admin
      .storage()
      .bucket()
      .file(filePath)
      .exists()
      .then(exists => exists[0]);
  }

async function FetchData(userId) {
  try {
    const data = await admin
      .database()
      .ref("/SeekedStudents")
      .orderByKey()
      .startAt(`${userId}`)
      .endAt(`${userId}\uf8ff`)
      .once("value");

    if (data.exists()) {
      const resultArray = [];
      // Fetch all data first
      const dataArray = [];

      data.forEach(snapshot => {
        var tempData = snapshot.val();
        // Setting the seeked date
        var fullFileName = snapshot.key;
        const dateTimeArray = fullFileName.split("_");
        const datetime = dateTimeArray[2];
        // console.log(datetime);
        tempData = {
          fileName: snapshot.key,
          ...tempData,
          last_seeked: datetime
        };
        dataArray.push(tempData);
      });

      // Store url of the images
      const promises = dataArray.map(async studentData => {
        const imgExists = await checkImgExists(studentData.fileName);
        if (imgExists) {
          const filePath = `SeekedStudents/${studentData.fileName}.jpg`;
          const fileRef = admin
            .storage()
            .bucket()
            .file(filePath);
          const [url] = await fileRef.getSignedUrl({ action: "read", expires: new Date(Date.now() + 5 * 60 * 1000) });

          // Combine student data with image URL
          const resultObject = {
            ...studentData,
            studentImgUrl: url
          };
          resultArray.push(resultObject);
        } else {
          const resultObject = {
            ...studentData,
            studentImgUrl: false
          };
          resultArray.push(resultObject);
        }
      });

      // Wait for all promises to resolve before sending the response
      await Promise.all(promises);
      return resultArray;
    }else{
        return([]);
    }
  } catch (error) {
    console.log(error);
  }
}

// Export the FetchData function
module.exports = FetchData;