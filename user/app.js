const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

const port = 3000

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload')
  },
  filename: function (req, file, cb) {
    console.log(file)
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
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
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


app.post("/user/pi", upload.single('image'), (req, res) => { 
  console.log(req.file)
  console.log(req.body)
  res.send({...req.body, ...req.file})
})
app.use(authRoutes);

// app.listen(port, ()=> console.log("listen on port " + port ));