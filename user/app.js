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

// Helper Function
function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  // console.log(year)
  return [year, month, day].join('-');
}

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/dashboard', requireAuth, (req, res) => res.render('userDashboard'));
app.get("/user/pi", requireAuth, (req, res) => {
  var id = req.user.id;
  User.findById(id, function (err, docs) {
      if (err){
        console.log(err);
        res.redirect("/")
      }
      else{
        docs.dob ? docs.dob[0] = formatDate(docs.dob) : 1;
        docs.casteIssuingDate ? docs.casteIssuingDate[0] = formatDate(docs.casteIssuingDate) : 1;
        docs.incomeIssuingDate ? docs.incomeIssuingDate[0] = formatDate(docs.incomeIssuingDate) : 1;
        docs.domicileIssuingDate ? docs.domicileIssuingDate[0] = formatDate(docs.domicileIssuingDate) : 1;
        
        res.render("personalInformation", {user : docs})
      }
  });
  // console.log(req.user.id)
  // res.render("personalInformation")
})
app.get("/user/oi", requireAuth,(req, res) => {
  // console.log(req.user.id)
  var id = req.user.id;
  User.findById(id, function (err, docs) {
      if (err){
        console.log(err);
        res.redirect("/")
      }
      else{
        console.log("Result : ", docs);
        // res.render("otherInformation", {fatherName : docs.fatherName, motherName : docs.motherName})
        res.render("otherInformation", {user : docs})
      }
  });
  // res.render("otherInformation")
})

app.get("/user/cci", requireAuth,(req, res) => {
  // console.log(req.user.id)
  var id = req.user.id;
  User.findById(id, function (err, docs) {
      if (err){
        console.log(err);
        res.redirect("/")
      }
      else{
        // console.log("Result : ", docs.currentCourse);
        for (var i = 0; i < docs.currentCourse.length; i++) { 
          docs.currentCourse[i].ccAddmissionDate[0] = formatDate(docs.currentCourse[i].ccAddmissionDate)
        } 
        // console.log(formatDate(docs.currentCourse[docs.currentCourse.length - 1].ccAddmissionDate))
        // console.log(docs.currentCourse[0].ccAddmissionDate)
        // docs.currentCourse.ccAddmissionDate[0] = formatDate(docs.currentCourse.ccAddmissionDate)
        const recent = docs.currentCourse.length == 0 ? {} : docs.currentCourse[docs.currentCourse.length - 1]
        console.log(recent)
        res.render("currentCourseInformation", {currentCourse : docs.currentCourse, recent  : recent})
      }
  });
  // res.render("currentCourseInformation")
})

app.get("/user/pqi", requireAuth,(req, res) => {
  // console.log(req.user.id)
  var id = req.user.id;
  User.findById(id, function (err, docs) {
      if (err){
        console.log(err);
        res.redirect("/")
      }
      else{
        console.log("Result : ", docs);
        res.render("pastQualificationInfo", {pastQualifications : docs.pastQualifications})
      }
  });
  // res.render("pastQualificationInfo")
})

app.get("/user/hd", requireAuth,(req, res) => {
  // console.log(req.user.id)
  var id = req.user.id;
  User.findById(id, function (err, docs) {
      if (err){
        console.log(err);
        res.redirect("/")
      }
      else{
        console.log("Result : ", docs);
        res.render("hostelDetail", {hostelDetails : docs.hostelDetails})
      }
  });
  // res.render("hostelDetail")
})

// app.post("/user/pi", upload.single('image'), (req, res) => {
// POST Routes :
// ================ Personal Information Routes =================
app.post("/user/pi", requireAuth , upload.fields([{ name: "casteCretificate" }, { name: "incomeCertificate" }, { name: "domicileCertificate" }, { name: "disabilityCertificate" }]), (req, res) => { 
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
  
  // if (updatedUser["isAadharLinkedToBank"] === "Yes") updatedUser["isAadharLinkedToBank"] = true
  // else updatedUser["isAadharLinkedToBank"] = false;

  // var user_id = '62d279d46ea57f1860ecabae';
  var user_id = req.user.id;
  User.findByIdAndUpdate(user_id, updatedUser,
    function (err, docs) {
      if (err){
        console.log(err)
        // res.render("personalInformation")
        res.redirect("/user/pi")
        // res.send(err)
      }
      else{
        console.log("Updated User : ", docs);
        // res.send({...docs})
        // res.render("otherInformation")
        res.redirect("/user/oi")
      }
    });
  // res.send({...updatedUser})
})

// ================= Other Information =================
app.post('/user/oi', requireAuth ,upload.none(), (req, res) => {
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
  
  // var user_id = '62d279d46ea57f1860ecabae';
  var user_id = req.user.id;

  User.findByIdAndUpdate(user_id, updatedUser,
    function (err, docs) {
      if (err){
        console.log(err)
        res.redirect("/user/oi")
        // res.render("otherInformation")
        // res.send(err)
      }
      else{
        console.log("Updated User : ", docs);
        res.redirect("/user/cci")
        // res.render("currentCourseInformation")
        // res.send({...docs})
      }
    });
  // res.send(req.body)
})

// ============== Current Course Information ========================

// ============================= ADD Course ==============================
app.post('/user/cci/add', requireAuth , upload.fields([{ name: "ccAdmitCard" }, { name: "ccCAPIDcertificate" }]), (req, res) => {
  const uplodedFiles = {}
  for (const file in req.files) { 
    uplodedFiles[file] = req.files[file][0]["filename"]
  }
  // var user_id = '62d279d46ea57f1860ecabae';
  var user_id = req.user.id;
  req.body["ccAddmissionDate"] = new Date(req.body["ccAddmissionDate"])
  User.findById(user_id, function (err, docs) {
    if (err){
      console.log(err);
      res.redirect("/user/cci")
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
              console.log("Updated User : ", docs2);
              res.redirect("/user/pqi")
              // res.send({...docs2})
            }
        });
    }
  });
  // res.send(updatedUser)
})

// ======================== Delete Course ================================

app.post('/user/cci/delete/:id', requireAuth , (req, res) => {
  // res.send(req.params.id)
  // var user_id = '62d279d46ea57f1860ecabae';
  var user_id = req.user.id;

  User.findById(user_id, function (err, docs) {
    if (err){
      console.log(err);
      res.redirect("/user/cci")
    }
    else {
      const updatedCurrentCourse = docs.currentCourse.filter(course => course._id != req.params.id)
      docs.currentCourse = updatedCurrentCourse
      // docs.currentCourse.push({ ...req.body, ...uplodedFiles  })
      User.findByIdAndUpdate(user_id, docs,
        function (err, docs2) {
          if (err){
            console.log(err)
            res.redirect("/user/cci")
            // res.send(err)
          }
          else{
            console.log("Updated User : ", docs2);
            res.redirect("/user/cci")
            // res.send({...docs2})
          }
      });
    }
  });
})

// ==================== Past Qualifications Information ====================

// ==================== Add Past Qualification ====================
app.post('/user/pqi/add', requireAuth , upload.single('pqMarksheet'), (req, res) => {
  const pastQualification = { ...req.body }
  pastQualification.pqMarksheet = req.file.filename
  console.log(pastQualification)
  // var user_id = '62d279d46ea57f1860ecabae';
  var user_id = req.user.id;

  User.findById(user_id, function (err, docs) {
    if (err){
      console.log(err);
      res.redirect("/user/pqi")
    }
    else {
      docs.pastQualifications.push(pastQualification )
      User.findByIdAndUpdate(user_id, docs,
        function (err, docs2) {
          if (err){
              res.redirect("/user/pqi")
              console.log(err)
              // res.send(err)
            }
            else{
              console.log("Updated User : ", docs2);
              res.redirect("/user/hd")
              // res.send({...docs2})
            }
        });
    }
  });
  // res.send(pastQualification)
})

// ========================= Delete Qualification =========================
app.post('/user/pqi/delete/:id', requireAuth , (req, res) => {
  // var user_id = '62d279d46ea57f1860ecabae';
  var user_id = req.user.id;

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
            // res.send(err)
            res.redirect("/user/pqi")
          }
          else{
            console.log("Updated User : ", docs2);
            res.redirect("/user/pqi")
            // res.send({...docs2})
          }
      });
    }
  });
})


// ================== Hostel Details =============================

// ================== Add Hostel Details =============================
app.post('/user/hd/add', requireAuth , upload.single('hostelAddmissionLetter'), (req, res) => {
  const hostelDetails = { ...req.body }
  if (req.file) {
    hostelDetails.hostelAddmissionLetter = req.file.filename   
  }
  if (hostelDetails.hiBeneficiaryCategory === "Hosteller") {
    
    // var user_id = '62d279d46ea57f1860ecabae';
    var user_id = req.user.id;

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
              res.redirect("/user/hd")
              // res.send(err)
            }
            else{
              console.log("Updated User : ", docs2);
              res.redirect("/user/pi")
              // res.send({...docs2})
            }
          });
        }
      });
  } else {
    res.redirect("/user/pi")
    // res.send("No Hostller")
    
  }
  // console.log(hostelDetails)
  // res.send(hostelDetails)
})
// =============== Delete Hostel =============================
app.post('/user/hd/delete/:id', requireAuth , (req, res) => { 
  // var user_id = '62d279d46ea57f1860ecabae';
  var user_id = req.user.id;


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
            res.redirect("/user/hd")
            // res.send(err)
          }
          else{
            console.log("Updated User : ", docs2);
            res.redirect("/user/hd")
            // res.send({...docs2})
          }
      });
    }
  });
})
app.use(authRoutes);

// app.listen(port, ()=> console.log("listen on port " + port ));