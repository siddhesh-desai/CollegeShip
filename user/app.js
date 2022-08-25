const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var Jimp = require("jimp");
var fs = require('fs')
var qrCode = require('qrcode-reader');
const QrcodeDecoder  = require("qrcode-decoder")
const xml2js = require("xml2js")
const Cryptr = require('cryptr');

// Models
const User = require("./models/User")
const Data = require("./models/Data")

// Middleware
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
// const dbURI = 'mongodb+srv://collageship:inCOqkHuscyNiLuR@cluster0.ed22pw2.mongodb.net/?retryWrites=true&w=majority';
const dbURI = "mongodb://localhost:27017/CollageShip"
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
app.get("/ocr", requireAuth, (req, res) => res.render("ocrDetection"))
// app.get('/', (req, res) => res.render('home'));
app.get('/', (req, res) => res.render('index'));
app.get('/dashboard', requireAuth, (req, res) => res.render('userDashboard'));
app.get('/user/addhar', requireAuth, (req, res) => res.render("addharUpload"))

app.get('/user/status', requireAuth, (req, res) => {
  var id = req.user.id;
  User.findById(id, function (err, docs) {
    if (err) {
      console.log(err);
      res.redirect("/")
    }
    else {
      console.log(docs)
      const scholarshipName = docs.appliedScholarship;
      const scholarshipStatus = docs.scholarshipStatus;
      const date = docs.appliedScholarshipDate ? docs.appliedScholarshipDate.toLocaleDateString() : ""
      const declineMessage = docs.declineMessage
      const data = { userId: id, scholarshipName, scholarshipStatus, date, declineMessage }
      
      res.render("userStatus", { data })
    }
  })
  // res.render("userStatus")
})

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

// All Scholarship prequsite
var scholarships = [
  {
     casteCategory: ["SBC"],
     haveCasteCertificate: true,
     familyAnnualIncome: 800000,
     haveIncomeCertificate: true,
     domicileState: "",
     haveDomicileCertificate: false,
     pqPercentage: 0,
     ccCAPIDcertificate: false,
    name: "Scholarship for Special Backward Class",
    smallDesc : "The scholarship is for SBC students all over India.",
     desc : "Provided by the Vimukta Jati and Nomadic Tribes, Other Backward Class and Special Backward Class Welfare Department, Government of Maharashtra. It is for students from the Special Backward Class. The eligibility criteria include: The student must be studying at the post-matriculation level in a government/government-aided institution. The family's annual income should be under than INR 8 Lakh. The students must have taken admission through Common Admission Process. Scholarship Amount : 30,000 per annum"
 },
  {
     casteCategory: ["SC", "ST"],
     haveCasteCertificate: true,
     familyAnnualIncome: 800000,
     haveIncomeCertificate: true,
     domicileState: "",
     haveDomicileCertificate: false,
     pqPercentage: 0,
      ccCAPIDcertificate: false,
    name: "Minority Communities",
    smallDesc : "The scholarship is for Minority Caste students all over India.",
     desc : "Minority scholarships are available for the economically weaker section of the minority community.This scholarship program is created by the organization of Welfare Of Minorities Under The Ministry Of Welfare by the Government of India. Eligibility criteria includes: The student must be going to school/college/university to participate in this scheme. The annual income of the parents of that child should not exceed Rs 100000 to Rs 200000. He/She must belong to the below poverty line (BPL) category. The applicant must be a meritorious student to participate in the minority scholarship scheme. The purpose of this scheme is to encourage girl students of minority communities toward education. Applicants participating in this scheme are students up to the 10th standard. In this, the students studying in government and non-government educational institutions have got more than 50% marks in the last year. Scholarship Amount : 15,000 per annum"
 },
  {
     casteCategory: ["SC"],
     haveCasteCertificate: true,
     familyAnnualIncome: 0,
     haveIncomeCertificate: false,
     domicileState: "Maharashtra",
     haveDomicileCertificate: true,
     pqPercentage: 75,
      ccCAPIDcertificate: false,
    name: "Rajarshri Chhatrapati Shahu Maharaj Merit Scholarship",
    smallDesc : "The scholarship is for Scheduled Caste students all over India.",
     desc : "This is provided by the Social Justice and Special Assistance Department, Government of Maharashtra. The eligibility criteria include: Students belonging to scheduled caste can apply. The applicants must score at least 75% in the SSC examination and applied to the 11th grade for admission. Scholarship Amount : 15,000 per annum"
 },
  {
     casteCategory: ["OBC"],
     haveCasteCertificate: true,
     familyAnnualIncome: 800000,
     haveIncomeCertificate: true,
     domicileState: "",
     haveDomicileCertificate: false,
     pqPercentage: 0,
      ccCAPIDcertificate: true,
    name: "MahaDBT Post Matric Scholarship to OBC Student",
    smallDesc : "The scholarship is for OBC students all over India.",
     desc : "This is provided by the VJNT, OBC and SBC Welfare Department, Government of Maharashtra. It is for students belonging to Other Backward Class. The eligibility criteria include: Students pursuing studies at post-matriculation level can apply. The annual income of the family should be less than INR 1 Lakh. Scholarship Amount : 25,000 per annum"
 },
  {
     casteCategory: [],
     haveCasteCertificate: false,
     familyAnnualIncome: 800000,
     haveIncomeCertificate: true,
     domicileState: "",
     haveDomicileCertificate: false,
     pqPercentage: 0,
      ccCAPIDcertificate: false,
    name: "Economically backward Students",
    smallDesc : "The scholarship is for EBC students all over India.",
     desc : "This is provided by the Department of Social Justice & Empowerment, Government of India. The eligibility criteria include: Students pursuing studies at post-matriculation level can apply. The annual income of the family should be less than INR 8 Lakh. Scholarship Amount : 30,000 per annum"
 },
  {
     casteCategory: [],
     haveCasteCertificate: false,
     familyAnnualIncome: 0,
     haveIncomeCertificate: false,
     domicileState: "Jammu & kashmir",
     haveDomicileCertificate: true,
     pqPercentage: 0,
      ccCAPIDcertificate: true,
    name: "J & K Merit Scholarship",
    smallDesc : "The scholarship is for Jammu and Kashmir students.",
     desc : "Provided by directorate of Social Welfare Jammu, Government of Jammu and Kashmir. The eligibility criteria include: The students belonging to SC/OBC/EBC/PC or DNT category can apply for this scholarship. They must be pursuing studies at the post-matriculation level within or outside Jammu and Kashmir at a government or government-recognized institution. The annual income of the family should be less than INR 1 Lakh (for OBC, EBC, and PC candidates) and INR 2.5 Lakh (for SC and DNTs) Scholarship Amount : 10,000 per annum"
 },
  {
     casteCategory: ["VJNT"],
     haveCasteCertificate: true,
     familyAnnualIncome: 800000,
     haveIncomeCertificate: true,
     domicileState: "",
     haveDomicileCertificate: false,
     pqPercentage: 0,
      ccCAPIDcertificate: true,
    name: "Scholarship for Students from Nomadic Tribes",
    smallDesc : "The scholarship is for Nomadic Tribe students all over India.",
     desc : "It is provided by the Vimukta Jati and Nomadic Tribes, Other Backward Class and Special Backward Class Welfare Department, Government of Maharashtra. It is for students from Vimukta Jati and Nomadic Tribes. The eligibility criteria include: It is open for students studying at post-matriculation level in a government/government-aided institution. The family’s annual income should be under than INR 8 Lakh. Students must have taken admission through Common Admission Process. Scholarship Amount : 15,000 per annum"
 },
]

const isApplicable = (scholarship, userData) => {
 let casteSet = false;
 if (scholarship.haveCasteCertificate) {
     if (userData.haveCasteCertificate && scholarship.casteCategory.includes(userData.casteCategory)) {
         casteSet = true;
     } else {
         casteSet = false;
      }
 } else {
     casteSet = true;
 }

 let incomeSet = false;
 if (scholarship.haveIncomeCertificate) {
     if (userData.haveIncomeCertificate && userData.familyAnnualIncome <= scholarship.familyAnnualIncome) {
         incomeSet = true
     } else {
         incomeSet = false
     }
 } else {
     incomeSet = true
 }

 let domicileSet = false
 if (scholarship.haveDomicileCertificate) {
     if (scholarship.domicileState == userData.domicileState) {
         domicileSet = true
     } else {
         domicileSet = false
     }
 } else {
     domicileSet = true
 }

 let capIDset = false
 if (scholarship.ccCAPIDcertificate) {
     if (userData.ccCAPIDcertificate) {
         capIDset = true
     } else {
         capIDset = false
     }
 } else {
     capIDset = true
 }

 let percentageSet = false;

 if (scholarship.pqPercentage > 0) {
     if (userData.pqPercentage >= scholarship.pqPercentage) {
         percentageSet = true;
     } else {
         percentageSet = false
     }
 } else {
     percentageSet = true
 }
 // console.log({casteSet,incomeSet, domicileSet, capIDset,  percentageSet})
 if (casteSet && incomeSet && domicileSet && capIDset && percentageSet) {
     // console.log(true)
     return true;
 } else {
     // console.log(false)
     return false;
 }
}


app.get("/user/apply", requireAuth, (req, res) => {
  var id = req.user.id;
  User.findById(id, function (err, docs) {
    if (err) {
      console.log(err);
      res.redirect("/")
    }
    else {
          
      const casteCategory =  docs.casteCategory ;
      const haveCasteCertificate = docs.haveCasteCertificate;
      const familyAnnualIncome = parseInt(docs.familyAnnualIncome)
      const haveIncomeCertificate = docs.haveIncomeCertificate

      const domicileState = docs.domicileState
      const haveDomicileCertificate = docs.haveDomicileCertificate
    
      const pqPercentage = docs.pastQualifications.find(pq => pq.pqLevel == "12th std") ? parseFloat(docs.pastQualifications.find(pq => pq.pqLevel == "12th std").pqPercentage) : 0; 
      const ccCAPIDcertificate = docs.currentCourse.length > 0 ? (docs.currentCourse[0].ccCAPIDcertificate ? "cap_id" : "") : "";

      var studentdata = {
        casteCategory, haveCasteCertificate, familyAnnualIncome, haveIncomeCertificate,
        domicileState, haveDomicileCertificate, pqPercentage, ccCAPIDcertificate
        // caste, income, domicile, percentage
      }

      // res.send(studentdata)
      const arr = scholarships.filter(scholarship => isApplicable(scholarship, studentdata))
      const filteredScholarhip = []
      for (let i = 0; i < arr.length; i++){
          // console.log(arr[i].name)
          filteredScholarhip.push(arr[i])
      }
      // res.send(filteredScholarhip)
      res.render("filter", {data : filteredScholarhip})
    }
  // res.render("filter", data = {msg  :"no Scholarship"})
  })
});

// POST Routes :
// ================ Personal Information Routes =================

// const QrScanner = require('qr-scanner');
const ocr = require("tesseract.js")

app.post("/ocr/caste", requireAuth, upload.single("casteCretificate"), (req, res) => {
  const user_id = req.user.id;
  if (req.body.haveCasteCertificate == "No") {
    const updatedUser = {
      haveCasteCertificate : false
    }
    User.findByIdAndUpdate(user_id, updatedUser,
      function (err, docs) {
        if (err){
          console.log(err)
          res.redirect("/ocr")
        }
        else{
          console.log("Updated User : ", docs);
          res.redirect("/ocr")
        }
      });
  } else {
    
    const document = req.file.filename
    const filePath = path.join(__dirname, "public", "upload", document)
    ocr.recognize(filePath, "eng", {
      logger: e => {
        console.log(e)
      }
    })
    .then(out => {
      const s = out.data.text;
      var newstr = "";
      for( var i = 0; i < s.length; i++ ) 
      if( !(s[i] == '\n' || s[i] == '\r') )
      newstr += s[i];
      
      const arr = newstr.split(" ")
      const casteName = arr[arr.indexOf("belongs") + 3]
      let dateOfIssue = arr[arr.indexOf("Date") + 2]
      dateOfIssue = (dateOfIssue.split("/").reverse().join("/"))
      const casteCategoryStart = arr.indexOf("recognised")+2
      const casteCategoryEnd = arr.indexOf("under")
      let casteCategory = arr.slice(casteCategoryStart, casteCategoryEnd).join(" ")
      
      dateOfIssue = dateOfIssue.replaceAll("|", "")
      dateOfIssue = new Date(dateOfIssue)
      
      const casteDetail = {
        casteCategory,
        casteIssuingDate: dateOfIssue,
        caste: casteName,
        casteCretificate: document,  
        ...req.body
      }
      const updatedUser = {
        ...casteDetail,
        haveCasteCertificate : true,
      }
      User.findByIdAndUpdate(user_id, updatedUser,
        function (err, docs) {
          if (err){
            console.log(err)
            res.redirect("/ocr")
          }
          else{
            console.log("Updated User : ", docs);
            res.redirect("/ocr")
          }
        });
      // console.log(casteDetail)
      // // res.send(casteDetail)
      // res.redirect("/ocr")
      
    }).catch(err => res.send(err))
  }
})

app.post("/ocr/domicile", requireAuth, upload.single("domicileCertificate"), (req, res) => {
  const user_id = req.user.id;
  if (req.body.haveDomicileCertificate == "No") {
    const updatedUser = {
      haveDomicileCertificate : false
    }
    User.findByIdAndUpdate(user_id, updatedUser,
      function (err, docs) {
        if (err){
          console.log(err)
          res.redirect("/ocr")
        }
        else{
          console.log("Updated User : ", docs);
          res.redirect("/ocr")
        }
      });
  } 
  else {
    
    const document = req.file.filename
    const filePath = path.join(__dirname, "public", "upload", document)
    ocr.recognize(filePath, "eng", {
      logger: e => {
        console.log(e)
        // res.redirect("/ocr")
      }
    })
    .then(out => {
      
      const s = out.data.text;
      const arr = s.split(" ")
      const nameStart = arr.indexOf("that,")
      const nameEnd = arr.indexOf("R/O")
      const name = arr.slice(nameStart + 1, nameEnd).join(" ")
      const srNo = arr[arr.indexOf("=")+1]
      const issuingAuthority = arr[arr.indexOf("of") + 2] 
      const issuingDate = arr[arr.lastIndexOf("Date") + 1]
      
      const domicileData = {
        ...req.body,
        haveDomicileCertificate: true,
        domicileCertificateNumber: srNo,
        domicileIssuingAuthority: issuingAuthority,
        domicileIssuingDate: new Date(issuingDate),
        domicileCertificate: document,
      }
      console.log(domicileData)
      User.findByIdAndUpdate(user_id, domicileData,
        function (err, docs) {
          if (err){
            console.log(err)
            res.redirect("/ocr")
          }
          else{
            console.log("Updated User : ", docs);
            res.redirect("/ocr")
          }
        });
      
    }).catch(err => res.send(err))
  }

})

app.post("/ocr/pq/add", requireAuth, upload.single("pqMarksheet"), (req, res) => {
  let pastQualification = { ...req.body }
  pastQualification.pqMarksheet = req.file.filename
  const document = req.file.filename
  const filePath = path.join(__dirname, "public", "upload", document)
  ocr.recognize(filePath, "eng", {
    logger: e => {
      console.log(e)
    }
  })
    .then(out => {
      const s = out.data.text;

      console.log(s)
      const arr = s.split(" ")
      let resTemp = s.search("Result") + 7 
      while (s[resTemp] == " ") {
        resTemp += 1;
      }
      let pqResult = ""
      // for (let i = resTemp; s[i] != " "; i++){
      for (let i = resTemp; i < resTemp + 4; i++){
        pqResult += s[i]
      }
      let pqPassingYear = arr[arr.indexOf("EXAMINATION,")+1]
      // const percentage = (sum / marks.length)
      const schoolNameStart = s.search("hool") + 5
      let pqCollegeName = ""
      for (let i = schoolNameStart; s[i] != "|" && s[i] != '/'; i++){
        pqCollegeName += s[i];
      }
      pqCollegeName = pqCollegeName.trim()
      const pqBoardUniversityName = "CBSE";
      pqPassingYear =   parseInt(pqPassingYear)
      pastQualification = {...pastQualification, pqResult, pqPassingYear, pqCollegeName, pqBoardUniversityName}
      console.log(pqResult, pqPassingYear, pqCollegeName)
      // res.send({result, passingYear, schoolName})
      var user_id = req.user.id;
    
      User.findById(user_id, function (err, docs) {
        if (err){
          console.log(err);
          res.redirect("/ocr")
        }
        else {
          docs.pastQualifications.push(pastQualification)
          User.findByIdAndUpdate(user_id, docs,
            function (err, docs2) {
              if (err){
                  res.redirect("/ocr")
                  console.log(err)
                }
                else{
                  // console.log("Updated User : ", docs2);
                  res.redirect("/ocr")
                }
            });
        }
      });
    }).catch(e => {
      console.log(e)
      res.redirect("/ocr")
    })
    
})

app.post("/ocr/bank", requireAuth, upload.single("bankPassbook"), (req, res) => {
  const user_id = req.user.id;
  
    const document = req.file.filename
    const filePath = path.join(__dirname, "public", "upload", document)
    ocr.recognize(filePath, "eng", {
      logger: e => {
        console.log(e)
        // res.redirect("/ocr")
      }
    })
    .then(out => {
      
      const s = out.data.text;
      const arr = s.split(" ")
      const accNumber = arr[arr.indexOf("Number") + 2]
      const ifscCode = arr[arr.indexOf("IFSC") + 2]

      const passbookData = {
        bankAccountNumber: accNumber,
        bankIFSCode: ifscCode,
        bankPassbook : document
      }
      User.findByIdAndUpdate(user_id, passbookData,
        function (err, docs) {
          if (err){
            console.log(err)
            res.redirect("/ocr")
          }
          else{
            console.log("Updated User : ", docs);
            res.redirect("/ocr")
          }
        });
    }).catch(err => res.send(err))
})

app.post("/user/general", requireAuth, upload.none(), (req, res) => {
  const updatedUser = { ...req.body };
  console.log(updatedUser)
  var user_id = req.user.id;
  User.findByIdAndUpdate(user_id, updatedUser,
    function (err, docs) {
      if (err){
        console.log(err)
        res.redirect("/ocr")
      }
      else{
        console.log("Updated User : ", docs);
        res.redirect("/ocr")
      }
    });
})

app.post("/user/income", requireAuth, upload.single('incomeCertificate'), (req, res) => {
  const updatedUser = { ...req.body };
  // console.log(updatedUser)
  updatedUser["incomeCertificate"] = req.file.filename;

  updatedUser["incomeIssuingDate"] = new Date(updatedUser.incomeIssuingDate)
  if (updatedUser["haveIncomeCertificate"] === "Yes") updatedUser["haveIncomeCertificate"] = true;
  else { 

    updatedUser["haveIncomeCertificate"] = false;
  
  var user_id = req.user.id;
  User.findByIdAndUpdate(user_id, updatedUser,
    function (err, docs) {
      if (err){
        console.log(err)
        res.redirect("/ocr")
      }
      else{
        console.log("Updated User : ", docs);
        res.redirect("/ocr")
      }
    });
  }

})

const { spawn } = require('child_process');

app.post("/user/addhar", requireAuth, upload.single('addhar'), (req, res) => {
      
  const addhar = req.file.filename
  // console.log(addhar)
  var user_id = req.user.id;
  const updatedUser = {}
  updatedUser.addhar = addhar;
  const filePath = path.join(__dirname, "public", "upload", addhar)
  // const  childPython = spawn('python', ['--version'])
  // const childPython = spawn('python', ['main.py'])
  const  childPython = spawn('python', ['main.py', filePath])
  childPython.stdout.on('data', (data) => {
    data = data.toString('utf8')
    data = data.replaceAll("'", `"`)
    data = data.replaceAll("@", ``)
    const parseData = JSON.parse(data)
    // console.log(parseData)
    updatedUser.fullName = parseData.name
    updatedUser.gender = parseData.gender[0] == 'M' || parseData.gender[0] == 'm' ? "Male" : "Female"
    updatedUser.state = parseData.state
    updatedUser.district = parseData.dist
    updatedUser.pincode = parseData.pc
    updatedUser.aadharNumber = parseData.uid
    updatedUser.taluka = parseData.vtc
    var newdate = parseData.dob.split("/").reverse().join("/");
    updatedUser.dob = new Date(newdate)
    let address = []
    if (parseData.house) {
      address.push(parseData.house)
    }
    if (parseData.lm) {
      address.push(parseData.lm)
    }
    if (parseData.vtc) {
      address.push(parseData.vtc)
    }
    if (parseData.po) {
      address.push(parseData.po)
    }
    if (parseData.subdist) {
      address.push(parseData.subdist)
    }
    if (parseData.dist) {
      address.push(parseData.dist)
    }
    if (parseData.state) {
      address.push(parseData.state)
    }
    if (parseData.pc) {
      address.push(parseData.pc)
    }
    const newAddress = address.join(", ")
    updatedUser.address = newAddress
    console.log(parseData)
    console.log(typeof (parseData))
    User.findByIdAndUpdate(user_id, updatedUser,
      function (err, docs) {
        if (err){
          console.log(err)
          res.redirect("/ocr")
        }
        else{
          console.log("Updated User : ", docs);
          res.redirect("/ocr")
        }
      });
    })
    childPython.stderr.on('data', (data) => {
      console.log(`stderr : ${data}`)
      res.redirect("/ocr")
  })
  // childPython.on('close', (code) => {
  //   console.log(`child process exited with code ${code}`)
  // })
  
})


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

app.post("/user/apply/:scholarshipName", requireAuth, (req, res) => {
  var user_id = req.user.id;
  const appliedScholarship = req.params.scholarshipName.split("_").join(" ");
  const scholarshipStatus = "Under Scrutiny"
  const appliedScholarshipDate = new Date()
  const declineMessage = ""
  const updatedUser = { appliedScholarship, scholarshipStatus, appliedScholarshipDate, declineMessage };
  User.findByIdAndUpdate(user_id, updatedUser,
    function (err, docs2) {
      if (err){
        console.log(err)
        res.redirect("/user/status")
        // res.send(err)
      }
      else{
        console.log("Updated User : ", docs2);
        res.redirect("/user/status")
        // res.send({...docs2})
      }
  });

})


// app.listen(port, ()=> console.log("listen on port " + port ));


// ///////////////////////////////////////////////////////////////////////////////////
// ============================== Admin Part =========================================
// ///////////////////////////////////////////////////////////////////////////////////

// GET Request

app.get("/admin", (req, res) => {
  res.render("admin_login")
})

app.get("/admin/dashboard", (req, res) => {
  res.render("admin_home")
})

app.get("/admin/scholarship/request", (req, res) => {
  User.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      res.redirect("/admin/dashboard")
    } else {
      // console.log(typeof (docs))
      // console.log(docs)
      const users = docs.filter(user => user.scholarshipStatus === "Under Scrutiny")
      console.log(users)
      res.render("adminScholarshipRequest", {users});
    }
  })
})

app.get("/admin/scholarship/granted", (req, res) => {
  User.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      res.redirect("/admin/dashboard")
    } else {
      // console.log(typeof (docs))
      // console.log(docs)
      const users = docs.filter(user => user.scholarshipStatus === "Granted")
      console.log(users)
      res.render("adminScholarshipGranted", {users});
    }
  })
})

app.get("/admin/user/profile/:id", (req, res) => {
  const userId = req.params.id
  User.findById(userId, (err, docs) => {
    if (err){
      console.log(err)
      res.redirect("/admin/dashboard")
      // res.send(err)
    }
    else{
      console.log("Updated User : ", docs);
      res.render("userProfile")
      // res.send({...docs2})
    }
  })
})

app.get("/admin/import/data", (req, res) => {
  res.render("adminImportData")
})

// POST Request

const fast2sms = require('fast-two-sms')


app.post("/admin/user/status/decline/:id", upload.none(),  (req, res) => {
  const userId = req.params.id;
  console.log(req.body)
  const msg = req.body.declineMessage
  const updatedUser = {declineMessage : msg, scholarshipStatus : "Decline"}
  User.findByIdAndUpdate(userId, updatedUser, async function (err, docs2) {
    if (err){
      console.log(err)
      res.redirect("/admin/scholarship/request")
      // res.send(err)
    }
    else{
      console.log("Updated User : ", docs2);
      const API_KEY ="kWCbVI8LH0aoASyXNgtzZR5j6Qxr2BM7DGF3fiUvdhuTqJwOmsBpWbe2UXPIcDCxfjH8oqnym4VkdNuR"
      const response = await fast2sms.sendMessage({authorization : API_KEY, message : msg, numbers:[docs2.mobileNumber]})

      res.redirect("/admin/scholarship/request")
      // res.send({...docs2})
    }
  })
})

app.post("/admin/user/status/granted/:id", upload.none(), (req, res) => {
  const userId = req.params.id
  const scholarshipStatus = "Granted"
  const declineMessage = "Your Scholarship is Granted"
  const updatedUser = {scholarshipStatus, declineMessage}
  User.findByIdAndUpdate(userId, updatedUser, (err, docs) => {
    if (err) {
      console.log(err)
      res.redirect("/admin/scholarship/granted")
    } else {
      console.log("Updated User : ", docs);
      res.redirect("/admin/scholarship/granted")
    }
  })
})

app.post("/admin/import/data", async(req, res) => {
  const secret = req.body.secret
  const pathToBeImported = path.join(__dirname, "..", "ExportedData", "data.txt")
  const dataBuffer = fs.readFileSync(pathToBeImported);
  const data = dataBuffer.toString()
  const cryptr = new Cryptr(secret);
  const str = cryptr.decrypt(data);
  const decryptData = JSON.parse(str)
  const obj = { decrypt : decryptData}
  try {
    
    const user = await User.create(decryptData);
    res.redirect("/admin/dashboard")
  } catch {
    res.redirect("/admin/import/data")
  }
  
  // res.send(obj)
})

// ============================== volunteer Part ==============================

// GET Request
app.get("/volunteer", (req, res) => {
  res.render("volunteer")
})

// POST Request


// const fs = require("fs")

app.post("/volunteer/export", (req, res) => {
  console.log(req.body.secret);
  const secret = req.body.secret;
  const cryptr = new Cryptr(secret);
  User.find({}, (err, docs) => {
    if (err) {
        res.redirect("/volunteer")
    } else {
      let data = docs;
      console.log(data[0].password)
      data = JSON.stringify(data);
      const encryptData = cryptr.encrypt(data);
      const currDate = Date.now()
      const fileName = "data-" + currDate + ".txt"
      const pathToBeExported = path.join(__dirname, "..", "ExportedData", fileName)
      fs.writeFileSync(pathToBeExported, encryptData)
      res.download(pathToBeExported)
      // const str = cryptr.decrypt(encryptData);
      
      // const decryptData = JSON.parse(str)
      // console.log(encryptData)
      // const obj = { encrypt : encryptData, decrypt : decryptData}
      // const obj = { encrypt : encryptData, decrypt : newstr}
      // res.send(obj)
      // res.redirect("/volunteer")
    }
  })
})





app.use(authRoutes);