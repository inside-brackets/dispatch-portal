const mongoose = require("mongoose");
const Load = require("../models/load");

// const addNewLoad = (req, res, next) => {
//   const load = new Load({
//     load_number: 123,
//     l_status: "pending",
//     weight: 5000,
//     miles: 5500,
//     pay: 6000,
//     dispatcher: mongoose.Types.ObjectId("61153c0537a4d10bf0cd9ff7"),
//     broker: mongoose.Types.ObjectId("61153c0537a4d10bf0cd9ff7"),
//     pick_up: [
//       {
//         address: { street: "street", state: "state" },
//         date: "2010-05-05",
//       },
//     ],
//     drop: [
//       {
//         address: { street: "street", state: "state" },
//         date: "2010-06-05",
//       },
//     ],
//     carrier: {
//       mc_number: 123,
//       carrierId: mongoose.Types.ObjectId("61153c0537a4d10bf0cd9ff7"),
//       truck: {
//         truck_number: 123,
//         truck_type: "dry van",
//       },
//       driver: {
//         name: "abcd",
//         email_address: "ahgsh@gmail.com",
//         phone_number: "54254627",
//       },
//     },
//   });
//   load
//     .save()
//     .then((result) => {
//       res.send(result);
//       console.log(result);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

const addNewLoad = async (req, res) => {
  console.log(req.body);
  try {
    let createLoad = await Load.create(req.body);
    res.status(201);
    res.json(createLoad);
  } catch (error) {
    console.log(error);
  }
};

const getLoads = (req, res, next) => {
  Load.find(req.body)
    .then((loads) => {
      res.send(loads);
    })
    .catch((err) => {
      res.send(err);
    });
};

const updateLoad = async (req, res) => {
  console.log("rescieved");
  try {
    const updatedLoad = await Load.findByIdAndUpdate(
      req.body.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200);
    res.send(updatedLoad);
    console.log("done");
  } catch (error) {
    console.log(error);
  }
};

const getLoad = (req, res, next) => {
  console.log(req.body);
  Load.find(req.body, null, {
    skip: 0, // Starting Row
    limit: 1, // Ending Row
    sort: {
      "drop.date": -1, //Sort by Date Added DESC
    },
  })
    .then((loads) => {
      console.log(loads[0]);
      res.send(loads[0]);
    })
    .catch((err) => {
      res.send(err);
    });
};

module.exports = {
  addNewLoad,
  getLoads,
  getLoad,
  updateLoad,
};
