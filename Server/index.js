const express = require("express");
const exp = express();
const cors = require("cors");

const LoginPage = require('./Routes/LoginPage');
const StudentPage = require('./Routes/StudentPage');
const FacultyPage = require('./Routes/FacultyPage');
const HodPage = require('./Routes/HodPage')
const PrincipalPage = require('./Routes/PrincipalPage')

exp.use(cors());
exp.use(express.json());

exp.use(LoginPage);
exp.use(StudentPage);
exp.use(FacultyPage);
exp.use(HodPage);
exp.use(PrincipalPage);

exp.listen(3333, () => {
    console.log("server is Running..");
  });
