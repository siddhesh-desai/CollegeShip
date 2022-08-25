const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    VerificationRequests: [{userID : {type : String}}],
    VerifiedCandidates: [{userID : {type : String}}],
    GrantedCandidates : [{userID : {type : String}}],
})

const Data = mongoose.model('data', dataSchema);

module.exports = Data;