const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  //=============== Addhar Card ============================
  addhar :{type : String},
  // ============== Personal Information =============================

  //==================== Personal Details =============================

  fullName: { type: String },
  // lastName: { type: String, minlength: [3, 'Last Name is required'] },
  aadharNumber: {type: String},
  mobileNumber: { type: String },
  dob: { type: Date },
  gender: { type: String },
  fatherName: { type: String },
  motherName: { type: String },
  address: { type: String },
  state: { type: String },
  district: { type: String },
  taluka: { type: String },
  pincode: { type: String },
  // maritalStatus: { type: String },

  //============== Religion and Caste detail ==================


  casteCategory: { type: String },
  caste: {type: String },
  haveCasteCertificate: { type: Boolean, default: false },
  casteCertificateNumber: { type: String },
  // casteIssuingDistrict: { type: String },
  casteApplicantName: { type: String },
  casteIssuingAuthority: { type: String },
  casteIssuingDate: { type: Date },
  casteCretificate: { type: String },
  
  // ============== Income Details =============================

  familyAnnualIncome: { type: String },
  haveIncomeCertificate: { type: Boolean , default: false },
  incomeCertificateNumber: { type: String },
  incomeIssuingAuthority: { type: String },
  incomeIssuingDate: { type: Date },
  incomeCertificate: { type: String },
  
  // ============== Domicile Details =============================

  // domicileState: { type: String },
  haveDomicileCertificate: { type: Boolean, default: false },
  domicileCertificateNumber: { type: String },
  // domicileRelationType: { type: String },
  domicileIssuingAuthority: { type: String },
  domicileIssuingDate: { type: Date },
  domicileCertificate: { type: String },
  
  // ============== Personal Eligibility Details =============================

  // isSalaried: { type: Boolean, default: false },
  // haveDisability: { type: Boolean, default: false },
  // disabilityDesc: { type: String },
  // disabilityCertificate: { type: String },

  // ============== Aadhaar Bank Details =============================

  // isAadharLinkedToBank: { type: Boolean, default: false },
  
  // ============== Bank Details =============================

  bankAccountNumber: { type: String },
  bankIFSCode: { type: String },
  bankPassbook : {type : String},
  
  // ============== Other Information =============================

  // ============== Parent's/Guardian's Details =============================

  isFatherAlive: { type: Boolean, default: true},
  fatherOccupation: { type: String },
  isFatherSalaried: { type: Boolean, default: true},
  
  isMotherAlive: { type: Boolean, default: true },
  motherOccupation: { type: String },
  isMotherSalaried: { type: Boolean, default: false },

  // ============== Current Course Information =============================
  currentCourse: [
    {
      ccAddmissionDate: { type: Date },
      ccInstituteState: { type: String },
      ccInstituteDistrict: { type: String },
      ccInstituteTaluka: { type: String },
      ccQualificationLevel: { type: String },
      ccStream: { type: String },
      ccCollegeName: { type: String }, 
      ccCourseName: { type: String },
      ccBoradUniversityName : {type : String},
      ccAddmissionType: { type: String },
      ccCETpercentage: { type: mongoose.Types.Decimal128 },
      ccCETadmitCardNumber: { type: String },
      ccAdmitCard: { type: String },
      ccCAPIDcertificate: { type: String },
      ccYearOfStudy: { type: String },
      ccCompletedOrContinue: { type: String },
      ccIsProfessional: { type: String },
      ccIsAddmissionThroughOpenOrReserved: { type: String },
      ccGapYears: { type: Number },
      ccMode : { type: String },
    }
  ],

  // ============== Past Qualifications Information =============================

  pastQualifications: [
    {
      pqLevel: { type: String },
      pqStream: { type: String },
      pqInstituteState: { type: String },
      pqInstituteDistrict: { type: String },
      pqInstituteTaluka: { type: String },
      pqCollegeName: { type: String },
      pqBoardUniversityName: { type: String }, 
      pqPassingYear: { type: Number },
      pqResult: { type: String },
      pqPercentage: { type: mongoose.Types.Decimal128 },
      pqMarksheet: { type: String },  
    }
  ],

  // ============== Hostel Information =============================

  // hostelDetails: [
  //   {
  //     hiBeneficiaryCategory: { type: String },
  //     hostelName: { type: String }, 
  //     hostelAddress: { type: String },
  //     hostelState: { type: String },
  //     hostelDistrict: { type: String },
  //     hostelTaluka: { type: String },
  //     hostelVillage: { type: String },
  //     hostelPinCode: { type: String },
  //     hostelType: { type: String },
  //     hostelAdmissionDate: { type: Date },
  //     hostelIsMessAvailable: { type: String },
  //     hostelAddmissionLetter: { type: String },
  //   }
  // ],
});


// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;