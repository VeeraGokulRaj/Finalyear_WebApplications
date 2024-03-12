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

// fetching the data of the Selected IT students
exp.get("/principal/getItData", async (req, res) => {
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
  const principalId = req.query.principalId;
  try {
    const data = await FetchData(principalId);
    // Filtering the data according to the bolean values and url
    const filteredArray = data.filter(data => data.studentImgUrl !== false && data.major.includes("INFORMATION TECHNOLOGY"));
    if (filteredArray.length !== 0) {
      const resultArray = filteredArray.filter(data => {
        if (
          (selectFormData.firstYearSectionA && data.year === "I" && data.section === "A") ||
          (selectFormData.firstYearSectionB && data.year === "I" && data.section === "B") ||
          (selectFormData.secondYearSectionA && data.year === "II" && data.section === "A") ||
          (selectFormData.secondYearSectionB && data.year === "II" && data.section === "B") ||
          (selectFormData.thirdYearSectionA && data.year === "III" && data.section === "A") ||
          (selectFormData.thirdYearSectionB && data.year === "III" && data.section === "B") ||
          (selectFormData.finalYearSectionA && data.year === "VI" && data.section === "A") ||
          (selectFormData.finalYearSectionB && data.year === "VI" && data.section === "B")
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


// fetching the data of the Selected Cse students
exp.get("/principal/getCseData", async (req, res) => {
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
  const principalId = req.query.principalId;
  try {
    const data = await FetchData(principalId);
    // Filtering the data according to the bolean values and url
    const filteredArray = data.filter(data => data.studentImgUrl !== false && !data.major.includes("INFORMATION TECHNOLOGY"));
    if (filteredArray.length !== 0) {
      const resultArray = filteredArray.filter(data => {
        if (
          (selectFormData.firstYearSectionA && data.year === "I" && data.section === "A") ||
          (selectFormData.firstYearSectionB && data.year === "I" && data.section === "B") ||
          (selectFormData.secondYearSectionA && data.year === "II" && data.section === "A") ||
          (selectFormData.secondYearSectionB && data.year === "II" && data.section === "B") ||
          (selectFormData.thirdYearSectionA && data.year === "III" && data.section === "A") ||
          (selectFormData.thirdYearSectionB && data.year === "III" && data.section === "B") ||
          (selectFormData.finalYearSectionA && data.year === "VI" && data.section === "A") ||
          (selectFormData.finalYearSectionB && data.year === "VI" && data.section === "B")
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


// data of an student by regno
exp.get("/principal/getDataByRegno", async (req, res) => {
  const regno = req.query.regno;
  try {
    const userdata = await admin
      .database()
      .ref(`/Users/${Number(regno)}`)
      .once("value");
    const user = userdata.val();
    if(!user){
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
    console.error("Error in /principal/in getting data by id  route:", error);
    res.status(500).send("Internal Server Error");
  }
});
exp.listen(8004, () => {
  console.log("Principal Page Page is Running...");
});

module.exports = exp;
