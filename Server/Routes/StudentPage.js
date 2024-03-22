const express = require("express");
const exp = express();
const axios = require("axios");
const bodyparser = require("body-parser");
const cors = require("cors");
const admin = require("./Firebase"); // Import the firebase Admin

exp.use(cors());
exp.use(bodyparser.urlencoded({ extended: false }));
exp.use(express.json());

// Getting student data
exp.get("/student/getStudentData", async (req, res) => {
  try {
    const studentId = Number(req.query.studentId); // Use req.query to get parameters from the URL
    const data = await admin
      .database()
      .ref(`/Students/${studentId}`)
      .once("value");
    var studentData = data.val();

    // get student image
    const filePath = `StudentImages/${studentId}.jpg`;
    const fileRef = admin
      .storage()
      .bucket()
      .file(filePath);
    const [url] = await fileRef.getSignedUrl({ action: "read", expires: new Date(Date.now() + 5 * 60 * 1000) });
    // console.log(url)
    studentData = { ...studentData, studentImgUrl: url };
    res.status(200).send(studentData);
  } catch (error) {
    console.error("Error in /student/getStudentData route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// function to check if the file name is in the storage or not
async function checkImgExists(filename) {
  const filePath = `SeekedStudents/${filename}.jpg`;
  return admin
    .storage()
    .bucket()
    .file(filePath)
    .exists()
    .then(exists => exists[0]);
}

// Fetching the data records of the seeked students
exp.get("/student/getStudentSeekedRecord", async (req, res) => {
  try {
    const studentId = req.query.studentId;
    const data = await admin
      .database()
      .ref("/SeekedStudents")
      .orderByKey()
      .startAt(`${studentId}_`)
      .endAt(`${studentId}_\uf8ff`)
      .once("value");

    // Check if data exists before proceeding
    if (data.exists()) {
      const resultArray = [];
      // Fetch all data first
      const dataArray = [];
      data.forEach(snapshot => {
        var tempData = snapshot.val();
        const nameSplit = snapshot.key.split("_");
        tempData = {
          fileName: snapshot.key,
          ...tempData,
          last_seeked: nameSplit[2]
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
      const filteredResultArray = resultArray.filter(data => data.studentImgUrl !== false);
      res.status(200).send(filteredResultArray);
      // console.log(resultArray);
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    console.error("Error in /student/getSeekedInfo route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// getting current date and time
function keyNameGenarator(filename) {
  var currentDate = new Date();

  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth() + 1; // Note: Months are zero-indexed, so we add 1
  var currentDay = currentDate.getDate();
  var currentHour = currentDate.getHours();
  var currentMinute = currentDate.getMinutes();
  var currentSecond = currentDate.getSeconds();
  currentDay +="";
  currentMonth +="";
  // ensure the date is match with the dat in db
  if (currentMonth.length === 1) {
    currentMonth = "0" + currentMonth;
  }
  if (currentDay.length === 1) {
    currentDay = "0" + currentDay;
  }
  const currentDateAndTime =
    currentYear + "-" + currentMonth + "-" + currentDay + "_" + currentHour + ":" + currentMinute + ":" + currentSecond;
  return filename + "_" + currentDateAndTime;
}

// Getting current day
function currentDateGenerator() {
  var currentDate = new Date();

  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth() + 1;
  var currentDay = currentDate.getDate();
  // ensure the date is match with the dat in db
  currentDay += "";
  currentMonth += "";
  if (currentMonth.length === 1) {
    currentMonth = "0" + currentMonth;
  }
  if (currentDay.length === 1) {
    currentDay = "0" + currentDay;
  }
  return currentYear + "-" + currentMonth + "-" + currentDay;
}

// Posting new student request
exp.post("/student/postNewRequest", async (req, res) => {
  const { studentId, reason, regno, startTime, endTime, name } = req.body;

  if (studentId !== regno) {
    res.status(401).send(false);
    return;
  } else {
    try {
      // ensuring the reques is not in queue
      const requestData = await admin
        .database()
        .ref("/Request/CurrentRequest")
        .child(studentId)
        .once("value");

      // console.log(requestData.val());
      if (requestData.exists()) {
        res.status(401).send("Request in queue");
        console.log("Request in queue");
        return;
      }

      // post the data into the database
      const studentRequestRef = admin.database().ref(`/Request/CurrentRequest/${studentId}`);
      const date = currentDateGenerator();

      await studentRequestRef.set({
        reason: reason,
        startTime: startTime,
        endTime: endTime,
        date: date,
        name: name,
        regno: studentId
      });

      const keyName = keyNameGenarator(studentId);
      // post the data into the student request histiro
      const studentRequestHistoryRef = admin.database().ref(`/Request/RequestHistory/${keyName}`);
      await studentRequestHistoryRef.set({
        reason: reason,
        startTime: startTime,
        endTime: endTime,
        status: "pending...",
        date: date,
        name: name,
        regno: studentId
      });

      res.status(200).send(true);
      // console.log("request stored");
    } catch (error) {
      // Handle errors (e.g., database write error)
      console.error(error);
      res.status(500).send("Error storing request");
    }
  }
});

// fetching student request
exp.get("/student/getStudentRequestRecord", async (req, res) => {
  try {
    const studentId = req.query.studentId;
    const data = await admin
      .database()
      .ref("/Request/RequestHistory")
      .orderByKey()
      .startAt(`${studentId}_`)
      .endAt(`${studentId}_\uf8ff`)
      .once("value");

    // Check if data exists before proceeding
    // console.log(data.val())
    if (data.exists()) {
      const resultArray = [];

      data.forEach(snapshot => {
        resultArray.push(snapshot.val());
      });
      res.status(200).send(resultArray);
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

exp.listen(8001, () => {
  console.log("Student Page is Running...");
});

module.exports = exp;
