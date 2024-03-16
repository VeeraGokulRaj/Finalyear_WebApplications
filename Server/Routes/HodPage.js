const express = require("express");
const exp = express();
const axios = require("axios");
const bodyparser = require("body-parser");
const cors = require("cors");
const admin = require("./Firebase"); // Import the firebase Admin
const FetchData = require("./FetchData");

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
    const [url] = await fileRef.getSignedUrl({ action: "read", expires: new Date(Date.now() + 5 * 60 * 1000) });
    hodData = { ...hodData, hodImgUrl: url };

    res.status(200).send(hodData);
  } catch (error) {
    console.error("Error in /hod/getHodData route:", error);
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

// getting selected students data
exp.get("/hod/getData", async (req, res) => {
  // parsing the data
  const selectFormData = {
    firstYearSectionA: JSON.parse(req.query.selectFormData.firstYearSectionA),
    firstYearSectionB: JSON.parse(req.query.selectFormData.firstYearSectionB),
    secondYearSectionA: JSON.parse(req.query.selectFormData.secondYearSectionA),
    secondYearSectionB: JSON.parse(req.query.selectFormData.secondYearSectionB),
    thirdYearSectionA: JSON.parse(req.query.selectFormData.thirdYearSectionA),
    thirdYearSectionB: JSON.parse(req.query.selectFormData.thirdYearSectionB),
    finalYearSectionA: JSON.parse(req.query.selectFormData.finalYearSectionA),
    finalYearSectionB: JSON.parse(req.query.selectFormData.finalYearSectionB)
  };
  const hodId = req.query.hodId;
  try {
    const data = await FetchData(hodId);
    // Filtering the data according to the bolean values and url
    const filteredArray = data.filter(data => data.studentImgUrl !== false && data.regno.includes(hodId));
    if (filteredArray.length !== 0) {
      const resultArray = filteredArray.filter(data => {
        if (
          (selectFormData.firstYearSectionA && data.year === "I" && data.section === "A") ||
          (selectFormData.firstYearSectionB && data.year === "I" && data.section === "B") ||
          (selectFormData.secondYearSectionA && data.year === "II" && data.section === "A") ||
          (selectFormData.secondYearSectionB && data.year === "II" && data.section === "B") ||
          (selectFormData.thirdYearSectionA && data.year === "III" && data.section === "A") ||
          (selectFormData.thirdYearSectionB && data.year === "III" && data.section === "B") ||
          (selectFormData.finalYearSectionA && data.year === "IV" && data.section === "A") ||
          (selectFormData.finalYearSectionB && data.year === "IV" && data.section === "B")
        ) {
          return true; // Include in resultArray
        }
        return false; // Exclude from resultArray
      });

      // sorting the array based on Years
      resultArray.sort((first, second) => {
        const yearOrder = { I: 1, II: 2, III: 3, IV: 4 };

        const firstYearOrder = yearOrder[first.year] || 0;
        const secondYearOrder = yearOrder[second.year] || 0;

        if (firstYearOrder !== secondYearOrder) {
          // If years are different, sort by year
          return firstYearOrder - secondYearOrder;
        } else {
          // If years are the same, sort by section
          const sectionOrder = { A: 1, B: 2 }; // Customize as needed

          const firstSectionOrder = sectionOrder[first.section] || 0;
          const secondSectionOrder = sectionOrder[second.section] || 0;

          return firstSectionOrder - secondSectionOrder;
        }
      });

      // console.log(selectFormData);
      // console.log(resultArray);
      res.status(200).send(resultArray);
    } else {
      res.status(200).send([]);
    }
    // console.log(selectFormData);
  } catch (error) {
    console.error("Error in /faculty/getStudentSeekedListRecord route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// get data by regno
exp.get("/hod/getDataByRegno", async (req, res) => {
  const regno = req.query.regno;
  try {
    const userdata = await admin
      .database()
      .ref(`/Users/${Number(regno)}`)
      .once("value");
    const user = userdata.val();
    if (!user) {
      res.status(401).send(false);
      return;
    }
    const data = await FetchData(regno);
    // filtering the data
    const resultArray = data.filter(data => {
      return data.regno === regno;
    });
    if (resultArray.length !== 0) res.status(200).send(resultArray);
    else res.status(200).send([]);
    // console.log(resultArray);
  } catch (error) {
    console.error("Error in /faculty/in getting data by id route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Removing the data
exp.put("/hod/removeStudent", async (req, res) => {
  const { fileName, regno } = req.body.studentData;
  try {
    const data = await admin
      .database()
      .ref(`/SeekedStudents/${fileName}`)
      .once("value");
    const dataArray = data.val();
    if (dataArray.length === 0 || !dataArray) {
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
    const updatedSeekedValue = Number(currentLastSeeked) - 1;

    // Update the database with the updatedSeekedValue
    await admin
      .database()
      .ref(`/Students/${regno}`)
      .update({ numberOf_time_seeked: updatedSeekedValue });
    // console.log(data.val());

    // Delete record from database and storage
    await Promise.all([
      // Delete record seeked Students
      admin
        .database()
        .ref(`/SeekedStudents/${fileName}`)
        .remove()
        .catch(error => console.error("Error deleting record from database:", error)),

      // Delete file from storage
      (async () => {
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
      })()
    ]);
    // await Promise.all();
    res.status(200).send(true);
  } catch (error) {
    console.error("Failed to Remove the Student", error);
    res.status(500).send("Internal Server Error");
  }
});

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

// function to check the time interval
function isTimeInInterval(checkTime, startTime, endTime) {
  const checkDateTime = new Date(`2000-01-01 ${checkTime}`);
  const startDateTime = new Date(`2000-01-01 ${startTime}`);
  const endDateTime = new Date(`2000-01-01 ${endTime}`);

  return checkDateTime >= startDateTime && checkDateTime <= endDateTime;
}

// Alter time
exp.put("/hod/setTime", async (req, res) => {
  const records = {
    firstYearSectionA: JSON.parse(req.body.params.data.firstYearSectionA),
    firstYearSectionB: JSON.parse(req.body.params.data.firstYearSectionB),
    secondYearSectionA: JSON.parse(req.body.params.data.secondYearSectionA),
    secondYearSectionB: JSON.parse(req.body.params.data.secondYearSectionB),
    thirdYearSectionA: JSON.parse(req.body.params.data.thirdYearSectionA),
    thirdYearSectionB: JSON.parse(req.body.params.data.thirdYearSectionB),
    finalYearSectionA: JSON.parse(req.body.params.data.finalYearSectionA),
    finalYearSectionB: JSON.parse(req.body.params.data.finalYearSectionB),
    startTime: req.body.params.data.startTime,
    endTime: req.body.params.data.endTime
  };
  const { hodId } = req.body.params;
  const currentDate = currentDateGenerator();
  // fetching all the dat in the data base
  const allData = await FetchData(hodId);
  var dataToRemove = [];

  // fetching the required daata in the given interval of time and selected section
  allData.forEach(data => {
    // getting the time of the last seeked students
    const lastSeekedInfo = data.last_seeked.split(" ");
    const lastSeeked = lastSeekedInfo[1];
    if (
      records.firstYearSectionA &&
      data.year === "I" &&
      data.section === "A" &&
      data.fileName.includes(currentDate) &&
      isTimeInInterval(lastSeeked, records.startTime, records.endTime)
    ) {
      dataToRemove.push(data);
    }
    if (
      records.firstYearSectionB &&
      data.year === "I" &&
      data.section === "B" &&
      data.fileName.includes(currentDate) &&
      isTimeInInterval(lastSeeked, records.startTime, records.endTime)
    ) {
      dataToRemove.push(data);
    }
    if (
      records.secondYearSectionA &&
      data.year === "II" &&
      data.section === "A" &&
      data.fileName.includes(currentDate) &&
      isTimeInInterval(lastSeeked, records.startTime, records.endTime)
    ) {
      dataToRemove.push(data);
    }
    if (
      records.secondYearSectionB &&
      data.year === "II" &&
      data.section === "B" &&
      data.fileName.includes(currentDate) &&
      isTimeInInterval(lastSeeked, records.startTime, records.endTime)
    ) {
      dataToRemove.push(data);
    }
    if (
      records.thirdYearSectionA &&
      data.year === "III" &&
      data.section === "A" &&
      data.fileName.includes(currentDate) &&
      isTimeInInterval(lastSeeked, records.startTime, records.endTime)
    ) {
      dataToRemove.push(data);
    }
    if (
      records.thirdYearSectionB &&
      data.year === "III" &&
      data.section === "B" &&
      data.fileName.includes(currentDate) &&
      isTimeInInterval(lastSeeked, records.startTime, records.endTime)
    ) {
      dataToRemove.push(data);
    }
    if (
      records.finalYearSectionA &&
      data.year === "IV" &&
      data.section === "A" &&
      data.fileName.includes(currentDate) &&
      isTimeInInterval(lastSeeked, records.startTime, records.endTime)
    ) {
      dataToRemove.push(data);
    }
    if (
      records.finalYearSectionB &&
      data.year === "IV" &&
      data.section === "B" &&
      data.fileName.includes(currentDate) &&
      isTimeInInterval(lastSeeked, records.startTime, records.endTime)
    ) {
      dataToRemove.push(data);
    }
  });

  if (dataToRemove.length !== 0) {
    // updating the last seeked
    dataToRemove.forEach(async data => {
      const studentFileSplit = data.fileName.split("_");
      const regno = studentFileSplit[0];

      var currentLastSeeked = await admin //current seeked value
        .database()
        .ref(`/Students/${regno}/numberOf_time_seeked`)
        .once("value");
      currentLastSeeked = currentLastSeeked.val();
      // console.log(currentLastSeeked);
      const updatedSeekedValue = Number(currentLastSeeked) - 1;

      // Update the database with the updatedSeekedValue
      await admin
        .database()
        .ref(`/Students/${regno}`)
        .update({ numberOf_time_seeked: updatedSeekedValue });

      // Delete record from database and storage
      const fileName = data.fileName;

      // Delete record seeked Students
      await admin
        .database()
        .ref(`/SeekedStudents/${fileName}`)
        .remove()
        .catch(error => console.error("Error deleting record from database:", error));

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
    });
    res.status(200).send("Seeked updated");
  } else {
    res.status(200).send(false);
  }

  console.log(dataToRemove);
  // res.status(200).send(dataToRemove);
});

exp.listen(8003, () => {
  console.log("HOD Page is Running...");
});

module.exports = exp;
