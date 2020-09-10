const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
let mongo = require('mongodb').MongoClient
let process=require('process')
const path = require('path');
const utility=require('./utility')
var speakeasy = require('speakeasy')
var qrcode = require('qrcode')
var request= require('request')
const Chatkit = require('@pusher/chatkit-server');

const PORT = 8080;
const url = ''
let mongoClient=null
let db=null
mongo.connect("mongodb://heroku_xvj0g766:ifnk0bjfu36dc9395od7lnoas6@ds137508.mlab.com:37508/heroku_xvj0g766", 
{useNewUrlParser: true, useUnifiedTopology: true},
    (err, client) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
        mongoClient=client
        db = mongoClient.db('heroku_xvj0g766')
})

/*In case of local testing use this setup
  mongo.connect("mongodb://localhost:27017", 
  {useNewUrlParser: true, useUnifiedTopology: true},
      (err, client) => {
      if (err) {
          console.error(err)
          process.exit(1)
      }
          mongoClient=client
          db = mongoClient.db('robomed')
  })*/

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:fefd0754-abd6-4428-b293-de2be225fffa",
  key: "240b25d5-63e7-4c79-9555-ccbeff5816e7:w/71JEF5qEsmnpz6itlFOIvnk1E1X1EO7/j7TkyYxlQ=",
})

app.use(cors());
// You need to use bodyParser() if you want the form data to be available in req.body.
app.use(bodyParser.json());
app.listen(process.env.PORT || PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
//app.use(express.static('../build'))
app.use(express.static(path.join(__dirname, "../client/build")));
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname + "../client/build/index.html"));
});

// //(a, b) => {sts} 
//Api code
app.post('/validateUser',(req,res)=>{
    userName=req.body.userName
    password=req.body.password
    let collection=db.collection('user_collection')

    //findOne(query, projection), projection parameter decides which fields are returned in the matching document.
    //findOne({gender: "Female", grade: 10}) 
    //the third parameter is a callback.  Callback has 2 params, error object and document object
    // https://mongodb.github.io/node-mongodb-native/markdown-docs/queries.html

    collection.findOne({_id:userName}, (err, item) => {
        if(utility.decrypt(item.password)===password)
           {
               res.send({vaild:true})
           }
        else
            {
                res.status(400).send({vaild:false})
            }
      })
})

app.post('/registerUser',(req,res)=>{
    let counter_collection=db.collection('id_counters')
    let role=req.body.role
    utility.getNextSequenceValue(role,counter_collection).then((seqDocument)=>{
      let seq_id=role[0]+seqDocument['value']['sequence_value']
      //Common user data  
      data={
            _id:req.body.email,
            id:seq_id,
            password:utility.encrypt(req.body.password),
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            role:role,
            mobile:req.body.mobile
           }
            let user_collection=db.collection('user_collection')
            let profile_collection=db.collection('profile_information')
            let promiseList=[]
            promiseList.push(user_collection.insertOne(data))
            promiseList.push(profile_collection.insertOne(utility.getDocumentStructure(role,seq_id)))
            promiseList.push(utility.sendEmail(req.body.email,'Confirm email','Please confirm your email!'))
            promiseList.push(chatkit.createUser({ id:seq_id, name:req.body.firstName+" "+req.body.lastName }))
            Promise.all(promiseList).then((values)=>{
              res.send({done:true})
            }).catch((error)=>{
              console.log(error)
              res.status(400).send({})
              return
            })
    }).catch((error)=>{
        res.status(400).send({})
        return
    })
})
//TFA validation
app.post('/tfa',(req,res)=>{
  userName = req.body.userName
  userToken = req.body.code

  let collection=db.collection('user_collection')
  tfaSecretKey=collection.findOne({_id:userName},(err,item)=>{

    verified = speakeasy.totp.verify({
      secret: item.tfaSecretKey,
      encoding: 'base32',
      token: userToken,
      window: 6
    })

    if(verified){
      res.send({valid:true})
    }else{
      res.status(400).send({vaild:false})
    }
  })
})

//TFA set up
app.post('/tfaSetup',(req,res)=>{
  userName=req.body.userName

  secret = speakeasy.generateSecret({length: 20})

  db.collection('user_collection').update({_id:userName},
    {$set : {tfaSecretKey : secret.base32}}
  )

  qrcode.toDataURL(secret.otpauth_url, function(err, image_data) {
    console.log(image_data)
    res.send(image_data) // A data URI for the QR code image, assign to src img attribute to display
  })
})

//Update to new password
app.post('/updatePassword',(req,res)=>{
  password=req.body.password
  userName=req.body.userName

  let collection=db.collection('user_collection')
  collection.updateOne({_id:userName},
    {$set : {password : utility.encrypt(password)}}
  ).then((data)=>{
    res.send({vaild:true})
  })
})

//captcha
app.post('/captcha', function(req, res) {
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
  {
    return res.json({"responseError" : "Please select captcha"});
  }

  const secretKey = "6Lfpxr0UAAAAAHKDidmqrYqR01K5BGfLVNnMVODp"; //our secret key

  //req.connection.remoteAddress returns our IP address
  const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

  request(verificationURL,function(error,response,body) {
    body = JSON.parse(body);

    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
    res.json({"responseCode" : 0,"responseDesc" : "Sucess"})
  })
})

//Create an appointment
app.post('/createAppointment',(req,res)=>{
  userId=req.body.userId
  docId=req.body.docId
  dateTime=req.body.dateTime
  description=req.body.description

  let counter_collection=db.collection('id_counters')
  utility.getNextSequenceValue("appointment",counter_collection).then((seqDocument)=>{
    data={
      _id:'AP'+seqDocument['value']['sequence_value'],
      patient:userId,
      doctor:docId,
      dateTime:new Date(dateTime),
      description:description,
      status:"pending"
    }
    let collection=db.collection('appointments')
    collection.insertOne(data, (err, result) => {
      if(err)
      {
          res.status(400).send({})
          return
      }
      data=result['ops'][0]
      let collection=db.collection('user_collection')
      collection.find({'$or':[{'id':data['doctor']},{'id':data['patient']}]})
      .toArray((error,result)=>{
        if(error)
        {
          res.status(400).send([])
          return
        }
          utility.sendEmail(result[0]['_id']+';'+result[1]['_id'],
            'New Appointment','A new appointment has been requested for '+dateTime)
          .then((data)=>{
            res.send(data)
            })
          .catch((err)=>{
            res.status(400).send({})
            return
          })
      })
    })
  }).catch((error)=>{
      res.status(400).send({})
      return
    })
})

//Get role based appointments
app.post('/getAppointment',(req,res)=>{
userId=req.body.userId
role=req.body.role
query={}
query[role]=userId

let collection=db.collection('appointments')
collection.find(query).sort({dateTime:-1}).toArray((error,result)=>{
  if(error)
  {
    res.status(400).send([])
    return
  }
  res.send(result)
})

})

//Get user information
app.post('/getUserInformarion',(req,res)=>{
  userName=req.body.userName
  let collection=db.collection('user_collection')
  collection.findOne({_id:userName}, (err, item) => {
    if(err)
    {
      res.status(500).send({})
    }
    res.send(item)
  })
})

//Get user by Id
app.post('/getUserInformationById',(req,res)=>{
  _id=req.body.id
  let collection=db.collection('user_collection')
  collection.findOne({id:_id}, (err, item) => {
    if(err)
    {
      res.status(500).send({})
    }
    res.send(item)
  })
})

//Get user by role
app.post('/getUsersByRole',(req,res)=>{
  role=req.body.role
  let collection=db.collection('user_collection')
  collection.find({"role":role}).toArray((error,result)=>{
    if(error)
    {
      res.status(400).send([])
      return
    }
    res.send(result)
  })
})

//Get profile by ID
app.post('/getProfileById',(req,res)=>{
  _id=req.body.id
  let collection=db.collection('profile_information')
  collection.findOne({_id:_id}, (err, item) => {
    if(err)
    {
      res.status(500).send({})
    }
    res.send(item)
  })
})

//Update profile by ID
app.post('/updateProfileById',(req,res)=>{
  _id=req.body._id
  let collection=db.collection('profile_information')
  collection.replaceOne({_id:_id},req.body, (err, item) => {
    if(err)
    {
      res.status(500).send({})
    }
    res.send(item)
  })
})

//Create reviews for user
app.post('/createReview',(req,res)=>{
  reviewerId=req.body.reviewerId
  revieweeId=req.body.revieweeId
  title=req.body.title
  review=req.body.review
  rating=req.body.rating

  let counter_collection=db.collection('id_counters')
  utility.getNextSequenceValue("review",counter_collection).then((seqDocument)=>{
    data={
      _id:'R'+seqDocument['value']['sequence_value'],
      reviewerId:reviewerId,
      revieweeId:revieweeId,
      title:title,
      review:review,
      rating:rating,
      dateTime:new Date()
    }
    let collection=db.collection('reviews')
    collection.insertOne(data, (err, result) => {
      if(err)
      {
          res.status(400).send({done:false})
          return
      }
      res.send({done:true})
    })
  }).catch((error)=>{
    console.log(error)
    res.status(400).send({done:false})
    return
  })
})
//Fetch review
app.post('/fetchReview',(req,res)=>{
revieweeId=req.body.id
let collection=db.collection('reviews')
collection.find({"revieweeId":revieweeId}).sort({dateTime:-1}).toArray((error,result)=>{
  if(error)
  {
    res.status(400).send([])
    return
  }
  res.send(result)
})

})
//Approve appointment
app.post('/approveAppointment',(req,res)=>{
  appointmentId=req.body.id
  let collection=db.collection('appointments')
  collection.updateOne({_id:appointmentId},
    {$set : {status : "approved" }}
  ).then((data)=>{
    res.send(data)
  }).catch((error)=>{
    res.status(400).send({vaild:false})
  })
})

//Cancel appointment
app.post('/cancelAppointment',(req,res)=>{
  appointmentId=req.body.id
  let collection=db.collection('appointments')
  collection.updateOne({_id:appointmentId},
    {$set : {status : "canceled" }}
  ).then((data)=>{
    res.send(data)
  }).catch((error)=>{
    res.status(400).send({vaild:false})
  })
})

//Upload profile pic
app.post('/upload', (req, res)=> {
  utility.upload(req, res, function (err) {
      console.log("Request file ---", req.file)
      if(!err) {
          return res.send(req.file)
      }
  })
})

//Get profile by ID
app.post('/getPlans',(req,res)=>{
  // _id=req.body.id
  let data=req.body
  let collection=db.collection('profile_information')
  collection.find({"_id":/.*i.*/}).toArray((error,result)=>{
    if(error)
    {
      res.status(400).send([])
      return
    }
    // if(result.length<=0)
    //   {
    //     res.send(result)
    //   }
    // else{
      let totals=[]
      result.forEach((provider,i)=>{
        totals[i]=[0,provider]
        Object.keys(data).forEach((key)=>{
          totals[i][0]+=provider[key]*data[key]
        })
      })
      totals.sort(function(a, b){return a[0]-b[0]})
      res.send(totals)
    // }


  })
})

//get bills by Id
app.post('/getBills',(req,res)=>{
  id=req.body.id
  role=req.body.role
  let collection=db.collection('bill_collection')
  query={}
  query[role]=id
  collection.find(query).toArray((error,result)=>{
    if(error)
    {
      res.status(400).send([])
      return
    }
    res.send(result)
  })
})

//Pay bill
app.post('/payBill',(req,res)=>{
  billId=req.body.id
  let collection=db.collection('bill_collection')
  collection.updateOne({_id:billId},
    {$set : {status : "paid" }}
  ).then((data)=>{
    res.send(data)
  }).catch((error)=>{
    res.status(400).send({vaild:false})
  })
})

//Create a doc report and bill
app.post('/createReportBill',(req,res)=>{
  data=req.body
  data['_id']='R'+req.body.appointmentId.substr(2)
  let collection=db.collection('report_collection')
  collection.insertOne(data, (err, result) => {
    if(err)
    {
        res.status(400).send({done:false})
        return
    }
    let collection=db.collection('profile_information')
    collection.findOne({_id:req.body.patient}, (err, item) => {
      if(err)
      {
          res.status(400).send({done:false})
          return
      }
      let collection=db.collection('bill_collection')
      data=
        {
        '_id':'B'+req.body.appointmentId.substr(2),
        'appointmentId':req.body.appointmentId,
        'price':parseInt(req.body.price)+(parseInt(req.body.price*0.09)),
        'patient':req.body.patient,
        'doctor':req.body.doctor,
        'insuranceAgent':item['insuranceId'],
        'status':'due',
        'date':new Date()
        }
      collection.insertOne(data, (err, result) => {
        if(err)
        {
            res.status(400).send({done:false})
            return
        }
        res.send({done:true})
      })
    })
  })
})

//get report by Id
app.post('/getReports',(req,res)=>{
  id=req.body.id
  role=req.body.role
  toFind= role=="doctor"? "patient" : "doctor"
  query={}
  query[role]=id

  let collection=db.collection('appointments')
  collection.distinct(toFind,query).then((result)=>{
    
    console.log(result)
    if(result.length!=0){

    }
    // let collection=db.collection('user_collection')
    // collection.find({id:{_id}}, (err, item) => {
    //   if(err)
    //   {
    //     res.status(500).send({})
    //   }
    //   res.send(item)
    // })

    let collection=db.collection('report_collection')
    query={}
    query["patient"]= role=="doctor"? {'$in':result} : id
    
    collection.aggregate([
    { $lookup:
       {
         from: 'user_collection',
         localField: toFind,
         foreignField: 'id',
         as: 'details'
       }
     }
     ,
    //  {
    //   $unwind:"patientDetails"
    //  },
     {
       $match:query
      }
    ]).toArray((error,result)=>{
      if(error)
      {
        res.status(400).send([])
        return
      }
      res.send(result)
    })
  }).catch((error)=>{
    res.status(400).send([])
  })


})

//Update Insurance provider
app.post('/setInsuranceProvider',(req,res)=>{
  id=req.body.id
  insurance=req.body.insurance
  let collection=db.collection('profile_information')
  collection.updateOne({_id:id},
    {$set : {insuranceId :insurance }}
  ).then((data)=>{
    res.send({done:true})
  })
})

//Get user by insuranceId
app.post('/getUsersByInsurId',(req,res)=>{
  id=req.body.insuranceId
  let collection=db.collection('profile_information')
  collection.find({"insuranceId":id}).toArray((error,result)=>{
    if(error)
    {
      res.status(400).send([])
      return
    }
    res.send(result)
  })
})

//Create a insurance report and bill
app.post('/createInsuranceBill',(req,res)=>{
  data=req.body
  let counter_collection=db.collection('id_counters')
  utility.getNextSequenceValue("review",counter_collection)
    .then((seqDocument)=>{
      let collection=db.collection('bill_collection')
      billData=
        {
          _id:'B'+seqDocument['value']['sequence_value'],
        ...data
        }
      
      collection.insertOne(billData, (err, result) => {
        if(err)
        {
            res.status(400).send({done:false})
            return
        }
        res.send({done:true})
      })
    }).catch((error)=>{
        console.log(error)
        res.status(400).send({done:false})
        return
      })
})

app.post('/getGeoLoc',(req,res)=>{
  address=req.body.address
  utility.getGeoLoc(address).then((response)=>{
    console.log(response.json.results)
    res.send(response.json.results[0].geometry.location)
  }).catch((error)=>{
    console.log(error)
    res.status(400).send({
      "lat": 40.7217973,
      "lng": -73.6477342
      })
  })
})

app.post('/authChat', (req, res) => {
  const authData = chatkit.authenticate({
    userId: req.query.user_id
  });
  res.status(authData.status)
     .send(authData.body)
})

app.post('/getUserRooms',(req,res)=>{
  userId=req.body.userId

  chatkit.getUserRooms({
    userId: userId,
  })
  .then((result) => {
      console.log(result)
      res.send(result)
    }).catch((err) => {
      console.log(err)
      res.status(400).send([])
    })  
})