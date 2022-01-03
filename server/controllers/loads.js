const mongoose = require("mongoose");
const Load = require("../models/load");

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
  var filter = req.body;
  if (req.body.company) {
    filter = {};
  }

  Load.find(filter, null, {
    sort: {
      "drop.date": -1, //Sort by Date Added DESC
    },
  })
    .populate("dispatcher", { user_name: 1, company: 1 })
    .then((loads) => {
      if (req.body.company) {
        const filteredLoads = loads.filter(
          (load) => load.dispatcher.company == req.body.company
        );
        return res.send(filteredLoads);
      }
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
