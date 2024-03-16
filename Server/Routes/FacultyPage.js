const express = require("express");
const exp = express();
const axios = require("axios");
const bodyparser = require("body-parser");
const cors = require("cors");
const admin = require("./Firebase"); // Import the firebase Admin
const getUnusualSeekedStudents = require("./FetchUnusualSeekedStudentsCHECK");

exp.use(cors());
exp.use(bodyparser.json());
exp.use(bodyparser.urlencoded({ extended: false }));
exp.use(express.json());

// Getting Faculty data
exp.get("/faculty/getfacultyData", async (req, res) => {
  try {
    const facultyId = Number(req.query.facultyId); // Use req.query to get parameters from the URL
    const data = await admin
      .database()
      .ref(`/Faculty/${facultyId}`)
      .once("value");
    var facultyData = data.val();
    // get Faculty image
    const filePath = `FacultyImages/${facultyId}.jpg`;
    const fileRef = admin
      .storage()
      .bucket()
      .file(filePath);
    const [url] = await fileRef.getSignedUrl({ action: "read", expires: new Date(Date.now() + 5 * 60 * 1000) });

    facultyData = { ...facultyData, facultyImgUrl: url };
    res.status(200).send(facultyData);
  } catch (error) {
    console.error("Error in /faculty/getFacultyData route:", error);
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
exp.get("/faculty/getStudentSeekedListRecord", async (req, res) => {
  try {
    const facultyId = req.query.facultyId;
    const data = await admin
      .database()
      .ref("/SeekedStudents")
      .orderByKey()
      .startAt(`${facultyId}`)
      .endAt(`${facultyId}\uf8ff`)
      .once("value");
    if (data.exists()) {
      // console.log(data.val());
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
      const filteredResultArray = resultArray.filter(data => data.studentImgUrl !== false && data.regno.includes(facultyId));
      filteredResultArray.sort((first, second) => first.regno - second.regno); //sorting the data
      res.status(200).send(filteredResultArray);
      // console.log(filteredResultArray);
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    console.error("Error in /faculty/getStudentSeekedListRecord route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// get the current Request
exp.get("/faculty/getCurrentRequest", async (req, res) => {
  try {
    const facultyId = req.query.facultyId;
    const data = await admin
      .database()
      .ref("/Request/CurrentRequest")
      .orderByKey()
      .startAt(`${facultyId}`)
      .endAt(`${facultyId}\uf8ff`)
      .once("value");
    if (data.exists()) {
      const resultArray = [];

      data.forEach(snapshot => {
        var tempData = snapshot.val();
        // console.log(datetime);
        tempData = {
          regno: snapshot.key,
          ...tempData
        };
        resultArray.push(tempData);
      });

      const filteredResultArray = resultArray.filter(data => data.regno.includes(facultyId));
      filteredResultArray.sort((first, second) => first.regno - second.regno);
      res.status(200).send(filteredResultArray);
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    console.error("Error in /faculty/getStudentSeekedListRecord route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// get history request
exp.get("/faculty/getHistoryRequest", async (req, res) => {
  try {
    const facultyId = req.query.facultyId;
    const data = await admin
      .database()
      .ref("/Request/RequestHistory")
      .orderByKey()
      .startAt(`${facultyId}`)
      .endAt(`${facultyId}\uf8ff`)
      .once("value");
    if (data.exists()) {
      const resultArray = [];

      data.forEach(snapshot => {
        resultArray.push(snapshot.val());
      });

      const filteredResultArray = resultArray.filter(data => data.regno.includes(facultyId));
      filteredResultArray.sort((first, second) => first.regno - second.regno);
      res.status(200).send(filteredResultArray);
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    console.error("Error in /faculty/getStudentSeekedListRecord route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// reject request
exp.put("/faculty/requestReject", async (req, res) => {
  const { regno, date, startTime, endTime } = req.body;
  try {
    const data = await admin
      .database()
      .ref("/Request/RequestHistory")
      .orderByKey()
      .startAt(`${regno}`)
      .endAt(`${regno}\uf8ff`)
      .once("value");

    // getting the key name of history of record to update the status
    const dataArray = [];
    data.forEach(snapshot => {
      var tempData = snapshot.val();
      const keyName = snapshot.key;
      tempData = { ...tempData, keyName: keyName };
      dataArray.push(tempData);
    });
    const resultArray = dataArray.filter(
      data => data.regno === regno && data.date === date && data.startTime === startTime && data.endTime === endTime
    );

    // Update status to "rejected" for each matched entry
    const updatePromises = resultArray.map(entry => {
      const key = entry.keyName;
      return admin
        .database()
        .ref(`/Request/RequestHistory/${key}`)
        .update({ status: "Rejected" });
    });
    // console.log("reject",resultArray);

    await Promise.all(updatePromises);

    // Delete record from CurrentRequest
    await admin
      .database()
      .ref(`/Request/CurrentRequest/${regno}`)
      .remove();

    // console.log(resultArray);
    res.status(200).send(true);
  } catch (error) {
    console.error("Failed to reject the request", error);
    res.status(500).send("Internal Server Error");
  }
});

// function to check the time interval
function isTimeInInterval(checkTime, startTime, endTime) {
  const checkDateTime = new Date(`2000-01-01 ${checkTime}`);
  const startDateTime = new Date(`2000-01-01 ${startTime}`);
  const endDateTime = new Date(`2000-01-01 ${endTime}`);

  return checkDateTime >= startDateTime && checkDateTime <= endDateTime;
}

// Accepting the request
exp.put("/faculty/requestAccept", async (req, res) => {
  const { regno, date, startTime, endTime } = req.body;
  // console.log(regno, date, startTime, endTime);
  // res.send("Accepted")
  try {
    const data = await admin
      .database()
      .ref("/Request/RequestHistory")
      .orderByKey()
      .startAt(`${regno}`)
      .endAt(`${regno}\uf8ff`)
      .once("value");

    // getting the key name of history of record to update the status
    const dataArray = [];
    data.forEach(snapshot => {
      var tempData = snapshot.val();
      const keyName = snapshot.key;
      tempData = { ...tempData, keyName: keyName };
      dataArray.push(tempData);
    });
    const resultArray = dataArray.filter(
      data => data.regno === regno && data.date === date && data.startTime === startTime && data.endTime === endTime
    );
    // console.log(resultArray);

    // Update status to "accept" for each matched entry
    const updatePromises = resultArray.map(entry => {
      const key = entry.keyName;
      return admin
        .database()
        .ref(`/Request/RequestHistory/${key}`)
        .update({ status: "Acceptede" });
    });
    await Promise.all(updatePromises);
    // console.log("Accept", resultArray);

    // getting the records in the seeked data to remove from db
    const removeData = await admin
      .database()
      .ref("/SeekedStudents")
      .orderByKey()
      .startAt(`${regno}`)
      .endAt(`${regno}\uf8ff`)
      .once("value");

    const removeDataArray = []; //removeData.val();
    removeData.forEach(snapshot => {
      var tempData = snapshot.val();
      const keyName = snapshot.key;
      if (keyName.includes(regno) && keyName.includes(date)) {
        tempData = { ...tempData, keyName: keyName };
        removeDataArray.push(tempData);
      }
    });
    const filteredArray = removeDataArray.filter(data => isTimeInInterval(data.last_seeked, startTime, endTime));
    // console.log(filteredArray);
    if (filteredArray.length === 0) {
      await admin
        .database()
        .ref(`/Request/CurrentRequest/${regno}`)
        .remove();
      res.status(200).send("request is empty");
      return;
    }

    // Update the seeked times

    var currentLastSeeked = await admin //current seeked value
      .database()
      .ref(`/Students/${regno}/numberOf_time_seeked`)
      .once("value");
    currentLastSeeked = currentLastSeeked.val();
    // console.log(currentLastSeeked);
    const updatedSeekedValue = Number(currentLastSeeked) - filteredArray.length;

    // Update the database with the updatedSeekedValue
    await admin
      .database()
      .ref(`/Students/${regno}`)
      .update({ numberOf_time_seeked: updatedSeekedValue });

    // Delete record from database and storage
    await Promise.all(
      filteredArray.map(async data => {
        const fileName = data.keyName;

        // Delete record seeked Students
        await admin
          .database()
          .ref(`/SeekedStudents/${fileName}`)
          .remove()
          .catch(error => console.error("Error deleting record from database:", error));

        // Delete record from CurrentRequest
        await admin
          .database()
          .ref(`/Request/CurrentRequest/${regno}`)
          .remove()
          .catch(error => console.error("Error deleting record from CurrentRequest:", error));

        // Delete file from storage
        const fileRef = admin
          .storage()
          .bucket()
          .file(`SeekedStudents/${fileName}.jpg`);
        // await fileRef.delete();
        const [exists] = await fileRef.exists();
        if (exists) {
          await fileRef.delete();
          // console.log(`File deleted: ${fileName}`);
        } else {
          console.error(`File does not exist: ${fileName}`);
        }
      })
    );
    res.status(200).send(true);
  } catch (error) {
    console.error("Failed to Accept the request", error);
    res.status(500).send("Internal Server Error");
  }
});

// unusual students data
exp.get("/faculty/getUnusualSeekedStudents", async (req, res) => {
  const folderName = "UnusualSeekedStudentsCHECK/";
  try {
    const unusualSeededData = await getUnusualSeekedStudents(folderName);
    // console.log(unusualSeededData);
    res.status(200).send(unusualSeededData);
  } catch (error) {
    console.log("Error in fetching Data Unusual students data", error);
  }
});

// remove Unusual students
exp.put("/faculty/removeUnusualSeekedStudent", async (req, res) => {
  const { filename } = req.body.data;
  // console.log(filename);
  try {
    const fileRef = admin
      .storage()
      .bucket()
      .file(`UnusualSeekedStudentsCHECK/${filename}`);
    const [exists] = await fileRef.exists();
    if (exists) {
      await fileRef.delete();
      // console.log(`File deleted: ${fileName}`);
    } else {
      console.error(`File does not exist: ${filename}`);
    }
    res.status(200).send(true);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

exp.listen(8002, () => {
  console.log("Faculty Page is Running...");
});

module.exports = exp;
