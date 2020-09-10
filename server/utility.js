const crypto = require('crypto');
const mailer=require('./mailer')
const multer = require("multer");
const path=require('path')
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyB3Pa1d7kBXuxHV74Fy-fJlzlma_5Dzxco',
    Promise: Promise
  });

const storage = multer.diskStorage({
   destination: "../client/build/static/",
   filename: function(req, file, cb){
      cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
   }
});

const upload = multer({
   storage: storage,
   limits:{fileSize: 1000000},
}).single("myImage");

let encrypt=(data)=>{
    var myKey = crypto.createCipher('aes-128-cbc', 'binary')
    var myStr = myKey.update(data, 'utf8', 'hex')
    myStr += myKey.final('hex')
    return myStr
}

let decrypt=(data)=>{
    var myKey = crypto.createDecipher('aes-128-cbc', 'binary')
    var myStr = myKey.update(data, 'hex', 'utf8')
    myStr += myKey.final('utf8')
    return myStr
}

let getNextSequenceValue=(sequenceName,collection)=>{

//sequenceName is a document in the collection
//findOneAndUpdate(query, update)
//we r finding the document in collection and setting inc

    return collection.findOneAndUpdate(
        {_id: sequenceName+'Id' },
        {$inc:{sequence_value:1}})
}

let sendEmail=(to,subject,text)=>{
    return mailer.mail(to,subject,text)
}

let getDocumentStructure=(role,id)=>{
    if(role=='doctor'){
     return {
        _id:id,
        qualification:"",
        specialization:"",
        experience:0,
        rating:0,
        liscense:"",
        description:"",
        address:"",
        picture:""
     }   
    }    
    if(role=='patient'){
     return {
         _id:id,
         DOB:new Date(),
         manufacturer:'',
         insuranceId:'',
         ram:'',
         hardDisk:'',
         picture:'',
         material:'',
         power:'',
         motorType:'',
         softwareVersion:'',
         cores:'',
         processor:''
     }   
    }    
    if(role=='insuranceAgent'){
        return {
            _id:id,
            insuranceName:"",
            rating:0,
            description:"",
            picture:"",
            cpuCoverage:100,
            hardDriveCoverage:100,
            softwareCoverage:100,
            cosmeticsCoverage:100,
            sensorsCoverage:100,
            motorsCoverage:100,
            deductibleClaim:100
        }   
       }
}

let getGeoLoc=(address)=>{
    return googleMapsClient.geocode({address: address}).asPromise()
}


module.exports={encrypt,decrypt,getNextSequenceValue,sendEmail,getDocumentStructure,upload,getGeoLoc}