
// Caste Category
// Caste Certificate
// Income
// Income Certificate
// Domicile
// Domicile Certificate
// Scholarship Amount
// CapID
// percentage

var scholarshipMapping = {
    s1: "Scholarship for Special Backward Class",
    s2: "Minority Communities",
    s3: "Rajarshri Chhatrapati Shahu Maharaj Merit Scholarship",
    s4: "MahaDBT Post Matric Scholarship to OBC Student",
    s5: "Economically backward Students",
    s6: "J & K Merit Scholarship",
    s7: "Scholarship for Students from Nomadic Tribes",
}

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
        name : "Scholarship for Special Backward Class"
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
        name : "Minority Communities"
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
        name : "Rajarshri Chhatrapati Shahu Maharaj Merit Scholarship"
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
        name : "MahaDBT Post Matric Scholarship to OBC Student"
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
        name : "Economically backward Students"
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
        name : "J & K Merit Scholarship"
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
        name : "Scholarship for Students from Nomadic Tribes"
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

var studentdata = {
    casteCategory: "VJNT",
    haveCasteCertificate: true,
    familyAnnualIncome: 500000,
    haveIncomeCertificate: true,
    domicileState: "Maharashtra",
    haveDomicileCertificate: true,
    pqPercentage: 75,
    ccCAPIDcertificate : "ccCAPIDcertificate.jpg"
}

const arr = scholarships.filter(scholarship => isApplicable(scholarship, studentdata))
for (let i = 0; i < arr.length; i++){
    console.log(arr[i].name)
}
// var scholarships = {
//     s1: {
//         caste: "SBC",
//         income: 800000,
//     },

//     s2: {
//         caste: "SC",
//         income: 800000,
//     },
//     s3: {
//         caste: "ST",
//         income: 800000,
//     },
//     s4:{
//         caste: "SC",
//         domicile: "maharashtra",
//         percentage: 75
//     },
//     s5:{
//         caste: "OBC",
//         income: 800000,
//         domicile: "maharashtra",
//         other: "cap_id"
//     },
//     s6: {
//         income: 800000,
//     },
//     s7: {
//         domicile: "jammu and kashmir",
//     },
//     s8: {
//         caste: "VJNT",
//         income: 800000,
//     },
// }

// var studentdata = {
//     caste: "OBC",
//     income: 10000,
//     domicile: "maharashtra",
//     percentage: 90,
//     other: "cap_id"
// }

// function f(scholarships, studentdata){
//     var c = 0;
//     var arr =[];
//     for (var key in scholarships){
//         for (var n in scholarships[key]){
            
            
//             // console.log(studentdata[n])
//             // console.log(scholarships[key][n])
//             if(studentdata[n] === undefined){
//                 c=0;
//                 break;
//             }
//             if(studentdata[n] != scholarships[key][n]){
//                 if(n === "caste"){
//                     c=0;
//                     break;
//                 }
//                 else if(n === "income"){
//                     if(studentdata[n] >= scholarships[key][n]){
//                         c=0;
//                         break;
//                     }
//                 }
//                 else if(n === "domicile"){
//                     c=0;
//                     break;
//                 }
//                 else if(n === "percentage"){
//                     if(studentdata[n] <= scholarships[key][n]){
//                         c=0;
//                         break;
//                     }
//                 }
//                 else if(n === "other"){
//                     c=0;
//                     break;
//                 }
//             }
//             else{
//                 c=1;
            
//             }
            
//         }
//         if(c===1){
//             arr.push(key)
//         }
        
//     }
//     console.log(arr)
// }

// f(scholarships, studentdata);