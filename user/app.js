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


// app.post("/user/pi", upload.single('image'), (req, res) => { 
app.post("/user/pi", upload.fields([{name: "casteCretificate"},{name : "incomeCertificate"},{name : "domicileCertificate"}, {name:"disabilityCertificate"}]), (req, res) => { 
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
app.use(authRoutes);

// app.listen(port, ()=> console.log("listen on port " + port ));