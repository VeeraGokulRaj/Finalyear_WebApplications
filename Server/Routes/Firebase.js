const admin = require("firebase-admin");

const serviceAccount = require("C:\\Users\\veera\\FinalYearProject\\Server\\facerecognition-42a2d-firebase-adminsdk-3jf05-53c117780f.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://facerecognition-42a2d-default-rtdb.firebaseio.com/",
  storageBucket: 'gs://facerecognition-42a2d.appspot.com',
});

module.exports = admin;