/*

const express = require("express");
const routes = express.Router();
const mongoclient = require("mongodb").MongoClient;

const bodyParser = require("body-parser");
const cors = require("cors");
routes.use(cors());
routes.use(express.json());
routes.use(bodyParser.urlencoded({ extended: false }));

var project;

routes.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

routes.post("/insert", (req, res) => {
var name = req.body.name;
var rollno = req.body.rollno;
  var DOB = req.body.DOB;
  var gender = req.body.gender;
  var email = req.body.email;
  var th10 = req.body.th10;
  var th12 = req.body.th12;
  var dept = req.body.dept;
  var subject = req.body.subject;
  var sem = req.body.sem;
  var address = req.body.address;
  var uid = req.body.uid;
  var password=req.body.password
  var roll=req.body.roll
  console.log(subject);
  const finalSubject={}
  // for(const s of subject){
  //   finalSubject[s]=[0,0,0,0]
  // }
  // console.log(finalSubject)
  // console.log("hello")
  // project.collection("student").insertOne(
  //   {
  //     Name: name,
  //     Rollno: rollno,
  //     DOB: DOB,
  //     Path: "NoImage",
  //     gender: gender,
  //     sem: sem,
  //     EmailId: email,
  //     thpercent10: th10,
  //     thpercent12: th12,
  //     dept: dept,
  //     subjects:{},
  //     Address: address,
  //     uid: uid,
  //     groups:[],
  //     password:password
  //   },
  //   (err, result) => {
  //     if (err) {
  //       console.error("Error inserting document:", err);
  //       res.status(500).send("Error inserting document");
  //     } else {
  //       console.log("Document inserted successfully");
  //       res.send("Document inserted successfully");
  //     }
  //   }
  // );
  student.collection(dept).insertOne({
    Name: name,
      Rollno: rollno,
      DOB: DOB,
      Path: "NoImage",
      gender: gender,
      sem: sem,
      EmailId: email,
      thpercent10: th10,
      thpercent12: th12,
      dept: dept,
      subjects:{},
      Address: address,
      uid: uid,
      groups:[],
      password:password,
      status:"A",
      roll:roll
    },
    (err, result) => {
      if (err) {
        console.error("Error inserting document:", err);
        res.status(500).send("Error inserting document");
      } else {
        console.log("Document inserted successfully");
        res.send("Document inserted successfully");
      }
  })
  console.log(dept)
});

routes.post("/insertStaff", (req, res) => {
  var name = req.body.name;
  var rollno = req.body.rollno;
    var DOB = req.body.DOB;
    var gender = req.body.gender;
    var email = req.body.email;
    var dept = req.body.dept;
    var uid = req.body.uid;
    var password = req.body.password;
    project.collection("staff").insertOne(
      {
        Name: name,
        Rollno: rollno,
        DOB: DOB,
        Path: "NoImage",
        gender: gender,
        EmailId: email,
        dept: dept,
        uid: uid,
        groups:[],
        subjects:[],
        sem:[],
        password:password,
        roll:"",
      },
      (err, result) => {
        if (err) {
          console.error("Error inserting document:", err);
          res.status(500).send("Error inserting document");
        } else {
          console.log("Document inserted successfully");
          res.send("Document inserted successfully");
        }
      }
    );
  });
  
//displaying conditioned table
routes.post("/staffView", (req, res) => {
  let dept = req.body.dept;
  let subject = req.body.subject;
  console.log(subject);
  student
    .collection(req.body.dept+"")
    .find({ [subjects.${subject}]: { $exists: true } })
    .toArray((err, result) => {
      if (err) throw err;
      // console.log(result);
      res.send(result);
    });
});

routes.post("/internal", async (req, res) => {
  const subject = req.body.subject;
  const IAT = Number(req.body.IAT);
  const rollno = req.body.rollno;
  const val = Number(req.body.val);

  try {
    const result = await student.collection(req.body.dept).updateOne(
      { Rollno: rollno },
      { $set: { [subjects.${subject}.${IAT}]: val } }
    );

    if (result.modifiedCount === 1) {
      console.log("Successfully updated.");
      res.status(200).send("Successfully updated.");
    } else {
      console.log("No matching document found.");
      res.status(404).send("No matching document found.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred during the update operation.");
  }
});


//student login
routes.post("/studentLogin", (req, res) => {
  
  console.log(req.body.uid);
  student
    .collection(req.body.dept+"")
    .find({ uid: req.body.uid })
    .toArray((err, result) => {
      if (err) throw err;
      // console.log(result);
      res.send(result);
    });
});

//staff Login
routes.post("/staffLogin", (req, res) => {
  project
    .collection("staff")
    .findOne({ uid: req.body.uid }, (err, result) => {
      if (err) throw err;
      // console.log(result);
      res.send(result);
    });
});

//Advisor Login
routes.post("/advisorLogin", (req, res) => {
  const username = req.body.username;
  const password = Number(req.body.password);
  console.log(username + "--" + password);

  project
    .collection("advisor")
    .findOne({ staffId: username, Password: password }, (err, result) => {
      if (err) throw err;
      // console.log(result);
      res.send(result);
    });
});

//Advisor view
routes.post("/advisor", (req, res) => {
  const subject = req.body.subject;
  project
    .collection("student")
    .find({ [subjects.${subject}]: { $exists: true } })
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

//updating total
routes.post("/total", async(req, res) => {
  let sum = req.body.sum;
  let uid = req.body.uid;
  let subject = req.body.subject;
  try {
    const result = await student
    .collection(req.body.dept+"")
    .updateOne(
      { uid: uid },
      { $set: { [subjects.${subject}.${3}]: sum } });

    if (result.modifiedCount === 1) {
      console.log("Successfully updated.");
      res.status(200).send("Successfully updated.");
    } else {
      console.log("No matching document found.");
      res.status(404).send("No matching document found.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred during the update operation.");
  }
});

//staff detail
routes.post("/staffDetail", (req, res) => {
  project.collection("staff").findOne({ uid: req.body.uid }, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//Advisor detail
routes.post("/advisordetail", (req, res) => {
  const username = req.body.username;
  project
    .collection("advisor")
    .findOne({ staffId: username }, (err, result) => {
      if (err) throw err;
      // console.log(result);
      res.send(result);
    });
});


//admin
//AllStaffDetail
routes.post("/staffAll", (req, res) => {
  // console.log("hello staff all");
  project
    .collection("staff")
    .find({})
    .toArray((err, result) => {
      if (err) console.log(err);
      // console.log(result);
      res.send(result);
    });
});
routes.post("/studentAll", (req, res) => {
  // console.log("hello staff all");
  project
    .collection("student")
    .find({})
    .toArray((err, result) => {
      if (err) console.log(err);
      // console.log(result);
      res.send(result);
    });
});

routes.post("/staffAdd", (req, res) => {
  var name = req.body.name;
  var roll=req.body.roll;
  console.log("Staff add")
    project.collection("staff").insertOne(
      {
        Name: name.split("@")[0],
        roll:req.body.roll,
        uid:req.body.uid,
        password:req.body.password,
        groups:[],
        subjects:[],
        email:name,
        AdvisorYear:"",
        dept:"CSE"
      },
      (err, result) => {
        if (err) {
          console.error("Error inserting document:", err);
          res.status(500).send("Error inserting document");
        } else {
          console.log("Document inserted successfully");
          res.send("Document inserted successfully");
        }
      }
    );
})

mongoclient.connect(
"mongodb://0.0.0.0:27017/",
{ useNewUrlParser: true },
(err, result) => {
    if (err) throw err;
    project = result.db("LandT");
    student =result.db("student")
    console.log("Sucessfully connected with InternalMark MongoDB . . .");
}
);


module.exports = routes;


*/