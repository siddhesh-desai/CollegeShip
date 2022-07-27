const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const User = require("./models/User")
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

const port = 3000

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload')
  },
  filename: function (req, file, cb) {
    // console.log(file)
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({storage : storage})

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded());




// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://collageship:inCOqkHuscyNiLuR@cluster0.ed22pw2.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify:false })
  .then((result) => app.listen(port, ()=> console.log(`Listening on port ${port}`)))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/dashboard', requireAuth, (req, res) => res.render('userDashboard'));
app.get("/user/pi", requireAuth, (req, res) => {
  // console.log(req.user.id)
  res.render("personalInformation")
})
app.get("/user/oi", requireAuth,(req, res) => {
  // console.log(req.user.id)
  res.render("otherInformation")
})

app.get("/user/cci", requireAuth,(req, res) => {
  // console.log(req.user.id)
  res.render("currentCourseInformation")
})

app.get("/user/pqi", requireAuth,(req, res) => {
  // console.log(req.user.id)
  res.render("pastQualificationInfo")
})

app.get("/user/hd", requireAuth,(req, res) => {
  // console.log(req.user.id)
  res.render("hostelDetail")
})

// app.post("/user/pi", upload.single('image'), (req, res) => {
// POST Routes :
// ================ Personal Information Routes =================
app.post("/user/pi", upload.fields([{ name: "casteCretificate" }, { name: "incomeCertificate" }, { name: "domicileCertificate" }, { name: "disabilityCertificate" }]), (req, res) => { 
  // console.log(req.file)
  // console.log(req.files)
  // const userID = "62d279d46ea57f1860ecabae"
  
  const uplodedFiles = {}
  for (const file in req.files) { 
    // console.log(req.files[file][0]["filename"])
    uplodedFiles[file] = req.files[file][0]["filename"]
  }
  const updatedUser = { ...req.body, ...uplodedFiles }
  
  // Convertion 
  // String to Date
  updatedUser["DOB"] = new Date(updatedUser.DOB)
  updatedUser["casteIssuingDate"] = new Date(updatedUser.casteIssuingDate)
  updatedUser["incomeIssuingDate"] = new Date(updatedUser.incomeIssuingDate)
  updatedUser["domicileIssuingDate"] = new Date(updatedUser.domicileIssuingDate)
  // String to Boolean
  if (updatedUser["haveCasteCertificate"] === "Yes") updatedUser["haveCasteCertificate"] = true
  else updatedUser["haveCasteCertificate"] = false;
  
  if (updatedUser["haveIncomeCertificate"] === "Yes") updatedUser["haveIncomeCertificate"] = true
  else updatedUser["haveIncomeCertificate"] = false;
  
  if (updatedUser["haveDomicileCertificate"] === "Yes") updatedUser["haveDomicileCertificate"] = true
  else updatedUser["haveDomicileCertificate"] = false;
  
  if (updatedUser["isSalaried"] === "Yes") updatedUser["isSalaried"] = true
  else updatedUser["isSalaried"] = false;
  
  if (updatedUser["haveDisability"] === "Yes") updatedUser["haveDisability"] = true
  else updatedUser["haveDisability"] = false;
  
  if (updatedUser["isAadharLinkedToBank"] === "Yes") updatedUser["isAadharLinkedToBank"] = true
  else updatedUser["isAadharLinkedToBank"] = false;

  var user_id = '62d279d46ea57f1860ecabae';
  User.findByIdAndUpdate(user_id, updatedUser,
    function (err, docs) {
      if (err){
        console.log(err)
        res.send(err)
      }
      else{
        console.log("Updated User : ", docs);
        res.send({...docs})
      }
    });
  // res.send({...req.body, ...uplodedFiles})
})

// ================= Other Information =================
app.post('/user/oi',upload.none(), (req, res) => {
  // res.send("OtherInformation")
  const updatedUser = { ...req.body }

  // String to Boolean
  if (updatedUser["isFatherAlive"] === "Yes") updatedUser["isFatherAlive"] = true
  else updatedUser["isFatherAlive"] = false;
  
  if (updatedUser["isFatherSalaried"] === "Yes") updatedUser["isFatherSalaried"] = true
  else updatedUser["isFatherSalaried"] = false;
  
  if (updatedUser["isMotherAlive"] === "Yes") updatedUser["isMotherAlive"] = true
  else updatedUser["isMotherAlive"] = false;
  
  if (updatedUser["isMotherSalaried"] === "Yes") updatedUser["isMotherSalaried"] = true
  else updatedUser["isMotherSalaried"] = false;
  
  var user_id = '62d279d46ea57f1860ecabae';
  User.findByIdAndUpdate(user_id, updatedUser,
    function (err, docs) {
      if (err){
        console.log(err)
        res.send(err)
      }
      else{
        console.log("Updated User : ", docs);
        res.send({...docs})
      }
    });
  // res.send(req.body)
})

// ============== Current Course Information ========================

// ============================= ADD Course ==============================
app.post('/user/cci/add', upload.fields([{ name: "ccAdmitCard" }, { name: "ccCAPIDcertificate" }]), (req, res) => {
  const uplodedFiles = {}
  for (const file in req.files) { 
    uplodedFiles[file] = req.files[file][0]["filename"]
  }
  var user_id = '62d279d46ea57f1860ecabae';
  User.findById(user_id, function (err, docs) {
    if (err){
        console.log(err);
    }
    else {
        docs.currentCourse.push({ ...req.body, ...uplodedFiles  })
        User.findByIdAndUpdate(user_id, docs,
          function (err, docs2) {
            if (err){
              console.log(err)
              res.send(err)
            }
            else{
              // console.log("Updated User : ", docs2);
              res.send({...docs2})
            }
        });
    }
  });
  // res.send(updatedUser)
})

// ======================== Delete Course ================================

app.post('/user/cci/delete/:id', (req, res) => {
  // res.send(req.params.id)
  var user_id = '62d279d46ea57f1860ecabae';
  User.findById(user_id, function (err, docs) {
    if (err){
        console.log(err);
    }
    else {
      const updatedCurrentCourse = docs.currentCourse.filter(course => course._id != req.params.id)
      docs.currentCourse = updatedCurrentCourse
        // docs.currentCourse.push({ ...req.body, ...uplodedFiles  })
      User.findByIdAndUpdate(user_id, docs,
        function (err, docs2) {
          if (err){
            console.log(err)
            res.send(err)
          }
          else{
            // console.log("Updated User : ", docs2);
            res.send({...docs2})
          }
      });
    }
  });
})

// ==================== Past Qualifications Information ====================

// ==================== Add Past Qualification ====================
app.post('/user/pqi/add', upload.single('pqMarksheet'), (req, res) => {
  const pastQualification = { ...req.body }
  pastQualification.pqMarksheet = req.file.filename
  console.log(pastQualification)
  var user_id = '62d279d46ea57f1860ecabae';
  User.findById(user_id, function (err, docs) {
    if (err){
        console.log(err);
    }
    else {
        docs.pastQualifications.push(pastQualification )
        User.findByIdAndUpdate(user_id, docs,
          function (err, docs2) {
            if (err){
              console.log(err)
              res.send(err)
            }
            else{
              // console.log("Updated User : ", docs2);
              res.send({...docs2})
            }
        });
    }
  });
  // res.send(pastQualification)
})

// ========================= Delete Qualification =========================
app.post('/user/pqi/delete/:id', (req, res) => {
  var user_id = '62d279d46ea57f1860ecabae';
  User.findById(user_id, function (err, docs) {
    if (err){
        console.log(err);
    }
    else {
      const updatedPastqualifications = docs.pastQualifications.filter(course => course._id != req.params.id)
      docs.pastQualifications = updatedPastqualifications
      User.findByIdAndUpdate(user_id, docs,
        function (err, docs2) {
          if (err){
            console.log(err)
            res.send(err)
          }
          else{
            // console.log("Updated User : ", docs2);
            res.send({...docs2})
          }
      });
    }
  });
})


// ================== Hostel Details =============================

// ================== Add Hostel Details =============================
app.post('/user/hd/add', upload.single('hostelAddmissionLetter'), (req, res) => {
  const hostelDetails = { ...req.body }
  if (req.file) {
    hostelDetails.hostelAddmissionLetter = req.file.filename   
  }
  if (hostelDetails.hiBeneficiaryCategory === "Hosteller") {
    
    var user_id = '62d279d46ea57f1860ecabae';
    User.findById(user_id, function (err, docs) {
      if (err){
        console.log(err);
      }
      else {
        docs.hostelDetails.push(hostelDetails)
        User.findByIdAndUpdate(user_id, docs,
          function (err, docs2) {
            if (err){
              console.log(err)
              res.send(err)
            }
            else{
              // console.log("Updated User : ", docs2);
              res.send({...docs2})
            }
          });
        }
      });
  } else {
    res.send("No Hostller")
    
  }
  // console.log(hostelDetails)
  // res.send(hostelDetails)
})
// =============== Delete Hostel =============================
app.post('/user/hd/delete/:id', (req, res) => { 
  var user_id = '62d279d46ea57f1860ecabae';

  User.findById(user_id, function (err, docs) {
    if (err){
        console.log(err);
    }
    else {
      const updatedHostels = docs.hostelDetails.filter(course => course._id != req.params.id)
      docs.hostelDetails = updatedHostels
      User.findByIdAndUpdate(user_id, docs,
        function (err, docs2) {
          if (err){
            console.log(err)
            res.send(err)
          }
          else{
            // console.log("Updated User : ", docs2);
            res.send({...docs2})
          }
      });
    }
  });
})
app.use(authRoutes);

// app.listen(port, ()=> console.log("listen on port " + port ));