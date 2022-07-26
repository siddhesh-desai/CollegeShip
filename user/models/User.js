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

  // ============== Personal Information =============================

  //==================== Personal Details =============================

  firstName: { type: String, minlength: [3, 'First Name is required']},
  lastName: { type: String, minlength: [3, 'Last Name is required'] },
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
  maritalStatus: { type: String },

  //============== Religion and Caste detail ==================

  religion: { type: String },
  casteCategory: { type: String },
  caste: { type: String },
  haveCasteCertificate: { type: Boolean, default: false},
  casteCertificateNumber: { type: String },
  casteIssuingDistrict: { type: String },
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

  domicileState: { type: String },
  haveDomicileCertificate: { type: Boolean, default: false },
  domicileCertificateNumber: { type: Number },
  domicileRelationType: { type: String },
  domicileIssuingAuthority: { type: String },
  domicileIssuingDate: { type: Date },
  domicileCertificate: { type: String },
  
  // ============== Personal Eligibility Details =============================

  isSalaried: { type: Boolean, default: false },
  haveDisability: { type: Boolean, default: false },
  disabilityDesc: { type: String },
  disabilityCertificate: { type: String },

  // ============== Aadhaar Bank Details =============================

  isAadharLinkedToBank: { type: Boolean, default: false },
  
  // ============== Bank Details =============================

  bankAccountNumber: { type: String },
  bankIFSCode: { type: String },
  bankBranch: { type: String },
  
  // ============== Other Information =============================

  // ============== Parent's/Guardian's Details =============================

  isFatherAlive: { type: String },
  fatherOccupation: { type: String },
  isFatherSalaried: { type: String },
  
  isMotherAlive: { type: String },
  motherOccupation: { type: String },
  isMotherSalaried: { type: String },

  // ============== Current Course Information =============================
  currentCourse: [
    {
      ccAddmissionYear: { type: Number },
      ccInstituteState: { type: String },
      ccInstituteDistrict: { type: String },
      ccInstituteTaluka: { type: String },
      ccQualificationLevel: { type: String },
      ccStream: { type: String },
      ccCollegeName: { type: String }, 
      ccCourseName: { type: String },
      ccAddmissionType: { type: String },
      ccCETpercentage: { type: mongoose.Types.Decimal128 },
      ccCETadmitCardNumber: { type: String },
      ccAdmitCard: { type: String },
      ccCAPIDcertificate: { type: String },
      ccYearOfStudy: { type: Number },
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
      pqCompleted: { type: String },
      pqInstituteState: { type: String },
      pqInstituteDistrict: { type: String },
      pqInstituteTaluka: { type: String },
      pqCollegeName: { type: String },
      pqCourseName: { type: String },
      pqBoardUniversityName: { type: String }, 
      pqMode: { type: String },
      pqAddmissionYear: { type: Number },
      pqPassingYear: { type: Number },
      pqResult: { type: String },
      pqPercentage: { type: mongoose.Types.Decimal128 },
      pqAttempts: { type: Number },
      pqMarksheet: { type: String },  
      pqHaveGAP: { type: String },
      pqGAPyears: { type: Number },
    }
  ],

  // ============== Hostel Information =============================

  hiBeneficiaryCategory: { type: String },
  hostelDetails: [
    {
      hostelName: { type: String }, 
      hostelAddress: { type: String },
      hostelState: { type: String },
      hostelDistrict: { type: String },
      hostelTaluka: { type: String },
      hostelVillage: { type: String },
      hostelPinCode: { type: String },
      hostelType: { type: String },
      hostelAdmissionDate: { type: Date },
      hostelIsMessAvailable: { type: String },
      hostelAddmissionLetter: { type: String },
    }
  ],
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