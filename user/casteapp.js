// let string = `TN FORM -8 [Rule No. 5(6)] Form of Caste Certificate to be Issued to De-Notified Tribe (Vimukt Jati)/Nomadic Tribe/Other Backward Class/Special Backward Category person belonging to the State of Maharashtra | | Documents Verified | | CASTE CERTIFICATE Outward No Date : 31/12/2014 | Rev Case No © MRC : | This is to certify that Kumari Khedkar Sanskrati Anand daughter of Shri Khedkar | ‘Anand Mahadeo , of Village Ghatshil Pargaon, Tehsil Shirur (Kasar), in the District Beed of the State of Maharashtra belongs to the Vanjari(30) Caste which is recognised as Nomadic Tribes(D) under Governinent Resolution No. CBC-1291-222-Mvk-5 dated 23/03/1994 as | 2amended from time to time. . ! i » Kumari Khedkar Sanskrati Anand and / or her family ordinarily resides in village | Ghatshil Pargaon, Tehsil Shirur (Kasar), in the District Beed of the State of Maharashtra. | | 5 S ﬁ") @ g *\ S | ; & \ o s ) . %& I il | : X St k g ‘ ik I i) M : I et , : e R neiis s v - 3”[ b L—.e i Place Shirur (Knsar) L, ©_ subDiisional Officer | B R L ) s Ry L b LS S ORI L% R SRRl s i e o SR OTIO WHGE200307, VLE v DFASKAR FARIGHA KFEDKAR, Dated (STTT20 W 06 T8 TP |`
let s = `TN FORM -8 [Rule No. 5(6)] Form of Caste Certificate to be Issued to De-Notified Tribe (Vimukt Jati)/Nomadic Tribe/Other Backward Class/Special Backward Category person belonging to the State of Maharashtra | | Documents Verified | | CASTE CERTIFICATE Outward No Date : 31/12/2014 | Rev Case No © MRC : | This is to certify that Kumari Khedkar Sanskrati Anand daughter of Shri Khedkar | ‘Anand Mahadeo , of Village Ghatshil Pargaon, Tehsil Shirur (Kasar), in the District Beed of the State of Maharashtra belongs to the Vanjari(30) Caste which is recognised as Nomadic Tribes(D) under Governinent Resolution No. CBC-1291-222-Mvk-5 dated 23/03/1994 as | 2amended from time to time. . ! i » Kumari Khedkar Sanskrati Anand and / or her family ordinarily resides in village | Ghatshil Pargaon, Tehsil Shirur (Kasar), in the District Beed of the State of Maharashtra. | | 5 S ﬁ") @ g *\ S | ; & \ o s ) . %& I il | : X St k g ‘ ik I i) M : I et , : e R neiis s v - 3”[ b L—.e i Place Shirur (Knsar) L, ©_ subDiisional Officer | B R L ) s Ry L b LS S ORI L% R SRRl s i e o SR OTIO WHGE200307, VLE v DFASKAR FARIGHA KFEDKAR, Dated (STTT20 W 06 T8 TP |`
s = s.replace(/[\r\n]/gm, '')
const arr = s.split(" ")
const casteName = arr[arr.indexOf("belongs") + 3]
let dateOfIssue = arr[arr.indexOf("Date") + 2]
dateOfIssue = dateOfIssue.split("/").reverse().join("/")
const casteCategoryStart = arr.indexOf("recognised")+2
const casteCategoryEnd = arr.indexOf("under")
const casteCategory = arr.slice(casteCategoryStart, casteCategoryEnd).join(" ")
// for(let i = 0; i < arr.length; i++){
//     console.log(i, arr[i])
// }
console.log("==============================")
// console.log(nameOfStudent)
console.log(casteName)
console.log(dateOfIssue)
console.log(casteCategory)
// console.log(issueAuthority)