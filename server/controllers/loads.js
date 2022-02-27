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

const getTableLoads = (req, res, next) => {
  var { company, limit, skip, filter, ...body } = req.body;
  if (filter.status.length > 0) {
    body.l_status = { $in: filter.status.map((item) => item.value) };
  }
  let search = req.query.search ? req.query.search : "";
  search = search.trim().toLowerCase();
  Load.find(body, null, {
    sort: {
      "drop.date": -1, //Sort by Date Added DESC
    },
  })
    .populate("dispatcher", { user_name: 1, company: 1 })
    .then((loads) => {
      if (search !== "") {
        search = search.trim().toLowerCase();
        loads = loads.filter((load) => {
          return (
            load.broker.includes(search) || load.load_number.includes(search)
          );
        });
      }
      if (company) {
        loads = loads.filter((load) => load.dispatcher.company == company);
        const fResult = loads.slice(skip, limit + skip);
        return res.send({ data: fResult, length: loads.length });
      }
      const fResult = loads.slice(skip, limit + skip);
      res.send({ data: fResult, length: loads.length });
    })
    .catch((err) => {
      res.send(err);
    });
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
  console.log("rescieved", req.body);
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
  getTableLoads,
  getLoad,
  updateLoad,
};
