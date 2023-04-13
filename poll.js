// const express = require("express");
// const router = express.Router();
// const Pusher = require("pusher");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const Vote = require("../final_proj_01/app");
// router.use(express.static(__dirname + "/public"));
// const pusher = new Pusher({
//   appId: "1573664",
//   key: "ef719bb549cacd708e04",
//   secret: "e751580c915471448e15",
//   cluster: "mt1",
//   useTLS: true,
// });
// router.use(bodyParser.json());
// router.get("/", (req, res) => {
//   res.sendFile(__dirname + "/views/bootstrap/voting.html");
// });

// router.post("/vote", (req, res) => {

//     pusher.trigger("os-poll", "os-vote", {
//       points: parseInt(vote.points),
//       candidates: vote.candidates,
   
//     });
//     return res.json({
//       success: true,
//       message: "you have casted your vote successfuly",
//     });

// });

// module.exports = router;
