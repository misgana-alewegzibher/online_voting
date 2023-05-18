const express = require("express");
const faceapi = require('face-api.js');
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;
const { Canvas, Image } = require("canvas");
const canvas = require("canvas");
faceapi.env.monkeyPatch({ Canvas, Image });
const bodyParser = require("body-parser");
const path = require("path");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const Pusher = require("pusher");
const fs = require('fs');
const ejs = require("ejs");
const multer = require('multer');
const tf = require("@tensorflow/tfjs");
const tfnode = require("@tensorflow/tfjs-node");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();


const basepath = path.join(__dirname , '../public')


app.use(express.static(__dirname));

app.use(bodyParser.json());
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/VoteDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,

})
.then(() => console.log("mongo connected"))
.catch((err) => console.log(err));


app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(session({
  secret: 'my-secret-key', 
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({url: 'mongodb://localhost:27017/VoteDb'})
}));

app.use(cookieParser());



app.set("view engine", "ejs");

let numCandidatesAdded = 0;

const storage = multer.diskStorage({


  destination: (req, file, cb) => {

    const desname = req.body.full_name ;

    const userUploadsDir = path.join(__dirname, 'uploads', desname);
    fs.mkdirSync(userUploadsDir, { recursive: true });
    if (file.fieldname === "File1") {
      cb(null, `uploads/${desname}/`);
    }
    if (file.fieldname === "File2") {
      cb(null, `uploads/${desname}/`);
    }
    if (file.fieldname === "File3") {
      cb(null, `uploads/${desname}/`);
    }
  },
  filename: (req, file, cb) => {

    const originalExtension = file.originalname.split('.').pop();

    // Generate the new filename by adding "1" and the original extension


    if (file.fieldname === "File1") {
      cb(null, "1." + originalExtension);

    }
    if (file.fieldname === "File2") {
      cb(null,  "2." + originalExtension);
    }
    if (file.fieldname === "File3") {
      cb(null,  "3." + originalExtension);
    }
  },
});

const imageUpload = multer({
  storage: storage,

});

const imageUploadFunc = imageUpload.fields([
  {
    name: "File1",
    maxCount: 1,
  },
  {
    name: "File2",
    maxCount: 1,
  },
  {
    name: "File3",
    maxCount: 1,
  },
])


const storage1 = multer.diskStorage({


  destination: (req, file, cb) => {

    const desnamee = req.body.candname1 ;
    const userUploadsDirr = path.join(__dirname, 'uploads', desnamee);
    fs.mkdirSync(userUploadsDirr, { recursive: true });
    if (file.fieldname === "candimg") {
      cb(null, `uploads/${desnamee}/`);
    }

  },
  filename: (req, file, cb) => {

    const originalExtension = file.originalname.split('.').pop();

    // Generate the new filename by adding "1" and the original extension


    if (file.fieldname === "candimg") {
      cb(null, "1." + originalExtension);

    }

  },
});

const imageUpload1 = multer({
  storage: storage1,

});

const imageUploadFunc1 = imageUpload1.fields([
  {
    name: "candimg",
    maxCount: 1,
  },

])



const pusher = new Pusher({
  appId: "1573664",
  key: "ef719bb549cacd708e04",
  secret: "e751580c915471448e15",
  cluster: "mt1",
  useTLS: true,
});
app.use(cors());




// const nameschema = new mongoose.Schema({
//   full_name: String,
//   email: String,
//   phone_num: Number,
//   password: String,
//   role: String,
// });

const nameschema = new mongoose.Schema({
  full_name: String ,
  email: {
    type: String,
    unique: true
  },
  phone_num: {
    type: Number,
    unique: true
   },
  role:  String ,
  password: String ,
  userImg1: String,
  userImg2: String,
  userImg3: String,


});
const candidatesschema = new mongoose.Schema({
  full_name: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  description: String ,
  candImg1: String,

});


const VoteSchema = new mongoose.Schema({
  candidates: {
    type: String,
    required: true,
  },
  points: {
    type: String,
    required: true,
  },
});
const IdSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  idnum: {
    type: String,
    required: true,
  },
});

const users = new mongoose.model("users", nameschema);
const admins = new mongoose.model("admins", nameschema);
const Vote = mongoose.model("Vote", VoteSchema);
const candidates = mongoose.model("candidates", candidatesschema);
const IdNumber = mongoose.model("IdNumber", IdSchema);
const IdNumberad = mongoose.model("IdNumberad", IdSchema);




app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/bootstrap/landing.html");

});




app.get("/redirect2", (req, res) => {
  users.find().then(logusrs => {

    candidates.find().then(candid => {
 
      Vote.find().then(votes => {

        res.render('./bootstrap/admin.ejs', {
          logusrs: logusrs,
          candid: candid,
          votes: votes
        });
      }).catch(err => {
        console.error(err);
        res.status(500).send({message: err.message});
      });
    }).catch(err => {
      console.error(err);
      res.status(500).send({message: err.message});
    });
  }).catch(err => {
    console.error(err);
    res.status(500).send({message: err.message});
  });
});


  


app.get("/profile", (req, res) => {




  candidates.find().then(candid => {


    res.render('voting.ejs' , {
      candid: candid ,
    })

  }).catch(err => {
    console.error(err);
    res.status(500).send({message:err.message });
  });

});




  // candidates.find().then(candid => {


  //   // res.render('voting.ejs' , {
  //   //   candid: candid ,
  //   // })
  //   res.render('./bootstrap/profile.ejs' ,   {usri: usri });

  // }).catch(err => {
  //   console.error(err);
  //   res.status(500).send({message:err.message });
  // });
  app.get('/redirect', (req, res) => {

    const userId = req.session.userId;
    users.findById(userId)
      .exec()
      .then(user => {
        if (!user) {
          return res.status(404).send({message: "User not found"});
        }
        res.render('./bootstrap/profile.ejs', {user: user});
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({message: err.message});
      });  


  });









app.get("/vote", (req, res) => {


  Vote.find().then(votes => {
  

    res.json({success:true , votes:votes});



console.log("hhhhhhhhhhhhhhhhh");
  }).catch(err => {
    console.error(err);
    res.status(500).send({message:err.message });
  });
});


app.post('/sign_up', imageUploadFunc, (req, res) => {
  const img_1 = req.files.File1[0].path;
  const img_2 = req.files.File2[0].path;
  const img_3 = req.files.File3[0].path;
  const id_number =  req.body.id_number;
  
  const newUser = new users({
    full_name: req.body.full_name,
    email: req.body.email,
    phone_num: req.body.phone_num,
    password: req.body.password,
    role: req.body.role,
    userImg1: path.join(".." + "/" + img_1),
    userImg2: path.join(".." + "/"+ img_2),
    userImg3: path.join(".." + "/" + img_3),
  });

  if (req.body.role === 'user') {
  // Check if the entered ID number exists in the database
  IdNumber.findOne({ id_number: req.body.id_number }).exec()
  .then((idnumber) => {
    console.log(idnumber);
    if (!idnumber) {
      console.error('ID number not found');
      res.status(400).send('Invalid ID number');
    } else {
      // ID number found, save the user to the database
      newUser.save()
        .then(() => {
          console.log('Data saved successfully!');
          res.sendFile(__dirname + '/views/bootstrap/login.html');
        })
        .catch((err) => {
          console.error('Error while saving data:', err);
          res.status(500).send('Internal Server Error');
        }); 
    }
  })
  .catch((err) => {
    console.error('Error while searching for ID number:', err);
    res.status(500).send('Internal Server Error');
  });
  }
  else if (req.body.role === 'admin') {
    // ID number found, save the user to the database
    IdNumberad.findOne({ id_number: req.body.id_number }).exec()
    
    .then((idnumber) => {
      console.log(idnumber);
      if (!idnumber) {
        console.error('ID number not found');
        res.status(400).send('Invalid credentials');
      } else {
        // ID number found, save the user to the database
        newUser.save()
          .then(() => {
            console.log('Data saved successfully!');
            res.sendFile(__dirname + '/views/bootstrap/login.html');
          })
          .catch((err) => {
            console.error('Error while saving data:', err);
            res.status(500).send('Internal Server Error');
          }); 
      }
    })
    .catch((err) => {
      console.error('Error while searching for ID number:', err);
      res.status(500).send('Internal Server Error');
    });
  }
});

app.post("/login", async (req, res) => {
  const role = req.body.role;
  const email = req.body.email;
  const password = req.body.password;

  try {

    // Check if the user exists
    const user = await users.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    // Check if the password is correct
    if (user.password !== req.body.password)
      return res.status(400).send("Invalid full name or password");

    // If the user exists and the password is correct, send the full name to the client-side script
    if (user.role === "admin") {

      res.sendFile(__dirname + "/views/bootstrap/redirect2.html");
    } else if (user.role === "user") {

      req.session.userId = user._id;

      res.sendFile(__dirname + "/views/bootstrap/facial_login.html"); 


    }

 

  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while processing your request");
  }
});

const COOKIE_NAME = "hasVoted";

app.post("/vote", (req, res) => {

  const hasVoted = req.cookies[COOKIE_NAME];

  if (hasVoted) {
    return res.status(403).json({
      success: false,
      message: "You have already voted.",
    });
  }

const newVote = {
  candidates:req.body.candidates,
  points:1
}

new Vote(newVote).save().then(vote => {

  pusher.trigger("os-poll", "os-vote", {

    points: parseInt(vote.points),
    candidates: vote.candidates,
  });

  return res.json({
    success: true,
    message: "you have casted your vote successfuly",
  });


});




});



app.post("/register", imageUploadFunc1 ,(req, res) => {

  if (numCandidatesAdded >= 3) {
    return res.status(400).send("You have reached the maximum number of candidates that can be added.");
  }

  numCandidatesAdded++;



  const imgg = req.files.candimg[0].path;

  const newcandidate = new candidates({

    full_name: req.body.candname1,
    email: req.body.candemail1,
    description: req.body.message1,
 candImg1  : path.join(".." + "/" + imgg),
  });

  newcandidate.save()
    .then(() => {
      console.log('Data saved successfully!');
      res.sendFile(__dirname + '/views/bootstrap/admin.html');
    })
    .catch((err) => {
      console.error('Error while saving data:', err);
      res.status(500).send('Internal Server Error');
   });


  });

app.listen(process.env.PORT || 3000, () => console.log("running on port 3000"));



// app.post('/sign_up', imageUploadFunc,(req, res) => {


//   const img_1 = req.files.File1;
//   const img_2 = req.files.File2;
//   const img_3 = req.files.File3;


//   const newUser = new users({
//             userImg1: path.join(".." + "/" + img_1),
//             userImg2: path.join(".." + "/"+ img_2),
//             userImg3: path.join(".." + "/" + img_3),
//             full_name: req.body.full_name,
//             email: req.body.email,
//              phone_num: req.body.phone_num,
//              password: req.body.password,
//              role: req.body.role,

//            });

//           newUser.save()
//             .then(() => {
//               console.log('Data saved successfully!');
//               res.sendFile(__dirname + '/views/bootstrap/login.html');
//             })
//            .catch((err) => {
//               console.error('Error while saving data:', err);
//             res.status(500).send('Internal Server Error');
//            });
// });





// app.post("/sign_up", async (req, res) => {
//   const newUser = new users({
//     full_name: req.body.full_name,
//     email: req.body.email,
//     phone_num: req.body.phone_num,
//     password: req.body.password,
//     role: req.body.role,
//   });

//   // Save image files
//   if (req.files) {
//     const images = req.files.images;
//     if (Array.isArray(images)) {
//       // Handle multiple images
//       for (const image of images) {
//         const data = image.data;
//         const contentType = image.mimetype;
//         newUser.images.push({ data, contentType });
//       }
//     } else {
//       // Handle single image
//       const data = images.data;
//       const contentType = images.mimetype;
//       newUser.images.push({ data, contentType });
//     }
//   }

//   newUser
//     .save()
//     .then(() => {
//       console.log("Data saved successfully!");
//       res.sendFile(__dirname + "/views/bootstrap/login.html");
//     })
//     .catch((err) => {
//       console.error("Error while saving data:", err);
//     });
// });






// app.post("/sign_up", async (req, res) => {




//   const newUser = new users({
//     full_name: req.body.full_name,
//     email: req.body.email,
//     phone_num: req.body.phone_num,
//     password: req.body.password,
//     role: req.body.role,
//   });

//   newUser
//     .save()
//     .then(() => {
//       console.log("Data saved successfully!");
//       res.sendFile(__dirname + "/views/bootstrap/login.html");
//     })
//     .catch((err) => {
//       console.error("Error while saving data:", err);
//     });
// // });

// app.post("/login", async (req, res) => {

//   const role = req.body.role;
//   try {
//     // Check if the user exists
//     const user = await users.findOne({ email: req.body.email });
//     if (!user) return res.status(400).send("Invalid email or password");

//     // Check if the password is correct
//     if (user.password !== req.body.password)
//       return res.status(400).send("Invalid fullname or password");

//     // If the user exists and the password is correct, return a success message

//     if (user.role === "admin") {
//       res.sendFile(__dirname + "/views/bootstrap/admin.html");
//     } else if (user.role === "user") {
//       const response = {
//         full_name: user.full_name
//       };

//       res.sendFile(__dirname + "/views/bootstrap/facial_login.html");

//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("An error occurred while processing your request");
//   }
// });


//  app.get("/", (req, res) => {
//    candidates.find().exec((err,cands)=>{
//      if(err) {
//        res.json({message:err.message});
//      }
//      else {

//      }
//    })
//  });