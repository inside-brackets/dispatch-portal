const mongoose = require("mongoose");
const Carrier = require("../models/carrier");
const Hcarrier = require("../models/hcarrier");
var moment = require("moment-timezone");
const { callAbleStates } = require("../util/convertTZ");

//fires when salesmen reaches an unreached carrier and makes an appointment
const updateCarrier = (req, res, next) => {
  console.log("update carrier", req.body);
  Carrier.findOneAndUpdate(
    { mc_number: parseInt(req.params.mcNumber) },
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((carrier) => {
      res.status(200).send(carrier);
      console.log("done");
      if (req.body.c_status) {
        Hcarrier.create({
          mc_number: parseInt(req.params.mcNumber),
          change: req.body.c_status,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ orginalError: err, customMsg: "" });
    });
};
const updateTruck = async (req, res) => {
  try {
    console.log(req.body);
    const result = await Carrier.findOneAndUpdate(
      {
        mc_number: parseInt(req.params.mcNumber),
        "trucks.truck_number": parseInt(req.params.trucknumber),
      },
      {
        $set: req.body,
      },
      { new: true }
    ).populate("trucks.dispatcher", { user_name: 1, company: 1 });
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

// assigns (closed)carrier to dispatcher and changes the c_status to active
const assignDispatcher = (req, res, next) => {
  console.log(req.body);
  console.log(req.params);
  Carrier.updateOne(
    { mc_number: req.params.mc, "trucks.truck_number": req.params.truckNumber },
    {
      $set: {
        "trucks.$.dispatcher": req.body.id,
        "trucks.$.t_status": "pending",
      },
    }
  )
    .then((result) => {
      console.log(result);
      res.send(result);
      Hcarrier.create({
        mc_number: req.params.mc,
        truck_number: req.params.truckNumber,
        change: "dispatcher assigned",
      });
    })
    .catch((err) => {
      res.status(404).send(result);
      console.log(err);
    });
};
//assigns carriers to salesmen and changes c_status to unreached

const fetchLead = async (req, res, next) => {
  console.log("fetchLead", req.body);
  const pst = moment().tz("US/Pacific");
  Carrier.findOne({
    salesman: mongoose.Types.ObjectId(req.body._id),
    c_status: "unreached",
    address: { $regex: callAbleStates(pst), $options: "i" },
  })
    .populate("salesman", { user_name: 1 })
    .then(async (result) => {
      console.log("result", result);
      if (result === null) {
        const carrier = await Carrier.find({
          c_status: "unassigned",
          address: { $regex: callAbleStates(pst), $options: "i" },
        })
          .sort({ mc_number: -1 })
          .limit(1);
        if (carrier) {
          await Carrier.findByIdAndUpdate(
            carrier[0]._id,
            {
              salesman: req.body._id,
              c_status: "unreached",
            },
            { new: true }
          )
            .then((resp) => {
              res.send(resp);
            })
            .catch((err) => console.log(err));
        } else {
          res.status(404).send("Unable to find unassigned carrier");
        }
      } else {
        console.log("old lead");
        res.send(result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getCarrier = (req, res, next) => {
  console.log("get carrier", req.body);
  Carrier.findOne(req.body)
    .populate("salesman trucks.dispatcher", { user_name: 1, company: 1 })
    .then((carriers) => {
      res.status(200).send(carriers);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const getTableCarriers = async (req, res, next) => {
  const defaultFilter = {
    c_status: { $nin: ["unassigned", "rejected", "didnotpick", "unreached"] },
  };
  var filter = defaultFilter;
  if (req.body.c_status === "registered") {
    const { company, ...newFilter } = req.body;
    filter = newFilter;
  }
  let status =
    req.query.status && req.query.status !== "undefined"
      ? req.query.status.split(",")
      : "";
  let search = req.query.search ? req.query.search : "";
  if (status && status !== "undefined") {
    filter.c_status = { $in: status };
  }
  if (!isNaN(search) && search !== "") {
    filter.mc_number = search;
  }
  if (req.body.salesman) {
    filter.salesman = req.body.salesman;
  }

  try {
    let result = await Carrier.find(filter).populate(
      "salesman trucks.dispatcher",
      { user_name: 1, company: 1 }
    );

    if (req.body.company) {
      result = result.filter(
        (carry) => carry.salesman.company == req.body.company
      );
    }
    if (search !== "" && isNaN(search)) {
      search = search.trim().toLowerCase();
      result = result.filter((carrier) => {
        console.log(
          "company name",
          carrier.company_name.toLowerCase().includes(search),
          carrier.company_name
        );
        console.log(
          "condition first=> sales man",
          carrier.salesman?.user_name,
          carrier.salesman?.user_name.toLowerCase().includes(search)
        );
        // console.log(
        //   "condition second=> sales man",
        //   carrier.trucks.filter((truck) =>
        //     truck.dispatcher?.user_name.toLowerCase().includes(search)
        //   )
        // );
        return (
          carrier.salesman?.user_name.toLowerCase().includes(search) ||
          carrier.trucks.filter((truck) =>
            truck.dispatcher?.user_name?.toLowerCase().includes(search)
          ).length !== 0 ||
          carrier.company_name.toLowerCase().includes(search)
        );
      });
    }
    const fResult = result.slice(req.body.skip, req.body.limit + req.body.skip);
    res.send({ data: fResult, length: result.length });
  } catch (error) {
    console.log(error);
  }
};

const getCarriers = async (req, res, next) => {
  const defaultFilter = {
    c_status: { $nin: ["unassigned", "rejected", "didnotpick", "unreached"] },
  };
  var filter = defaultFilter;
  if (!req.body.company) {
    filter =
      req.body && Object.keys(req.body).length !== 0
        ? { ...req.body, ...defaultFilter }
        : defaultFilter;
  }
  if (req.body.salesman && req.body.c_status) {
    filter = req.body;
  }
  if (req.body.c_status === "registered") {
    const { company, ...newFilter } = req.body;
    filter = newFilter;
  }

  try {
    const result = await Carrier.find(filter).populate(
      "salesman trucks.dispatcher",
      { user_name: 1, company: 1 }
    );
    console.log("get carrier ", result);
    if (req.body.company) {
      const filteredResult = result.filter(
        (carry) => carry.salesman.company == req.body.company
      );
      const filterResult = filteredResult.slice(req.body.skip, req.body.limit);
      return res.send(filterResult);
    }
    const fResult = result.slice(req.body.skip, req.body.limit);
    res.send(fResult);
  } catch (error) {
    console.log(error);
  }
};

const addNewCarrier = (req, res, next) => {
  const factoring = {
    name: "name",
    address: "addres",
    phone_no: "phone_no",
    agent_name: "agent_name",
    agent_email: "agent_email",
  };

  const insurance = {
    name: "name",
    address: "addres",
    phone_no: "phone_no",
    agent_name: "agent_name",
    agent_email: "agent_email",
  };
  // const address = new Address(street="street", state="state", )
  const address = { street: "street", state: "state" };
  const truck = {
    truck_number: 123,
    vin_number: 123,
    trailer_type: "dryvan",
    carry_limit: 40000,
    dispatcher: mongoose.Types.ObjectId("123"),
    drivers: [
      {
        name: "name",
        email_address: "asf@sada.com",
        phone_number: "123",
      },
    ],
  };
  const carrier = new Carrier({
    mc_number: 123,
    company_name: "ML TRUCKING INC",
    usdot_number: "2952582",
    c_satus: "unreached",
    dispatcher_fee: 250,
    phone_number: "(952) 300-7811",
    factoring: factoring,
    insurance: insurance,
    address: address,
    trucks: [truck],
    comment: "some comment",
  });
  carrier.save().then(() => {
    res.send("<h1>Carriers added</h1>");
  });
};

//adds new truck to existing carriers
const addNewTruck = async (req, res, next) => {
  try {
    console.log("add new truck", req.body);
    const result = await Carrier.updateOne(
      {
        mc_number: parseInt(req.params.mcNumber),
        "trucks.truck_number": parseInt(req.body.truck_number),
      },
      { $set: { "trucks.$": req.body } },
      {
        new: true,
      }
    );
    if (result.nModified === 0) {
      Carrier.findOneAndUpdate(
        { mc_number: parseInt(req.params.mcNumber) },
        { $push: { trucks: req.body } },
        {
          new: true,
        }
      ).then((carrier) => {
        res.send(carrier);
      });
    } else {
      const newCarrier = await Carrier.findOne({
        mc_number: parseInt(req.params.mcNumber),
        "trucks.truck_number": parseInt(req.body.truck_number),
      });
      console.log(newCarrier);
      res.send(newCarrier);
    }
  } catch (err) {
    console.log(err.message);
    res.satus(500).send(err.message);
  }
};

const deleteTruck = (req, res, next) => {
  console.log(req.params);
  Carrier.update(
    { mc_number: parseInt(req.params.mcNumber) },
    {
      $pull: { trucks: { truck_number: parseInt(req.params.truckNumber) } },
    },
    {
      new: true,
      multi: true,
    }
  ).then((carrier) => {
    res.send(carrier);
    console.log(carrier);
  });
};

const countCarriers = async (req, res, next) => {
  const stats = {
    appointments: 0,
    activeTrucks: 0,
    pendingTrucks: 0,
    total: 0,
  };
  var filteredCarrier = [];
  await Carrier.find({ c_status: { $nin: "unassigned" } })
    .populate("salesman", { company: 1 })
    .then(async (carrier) => {
      filteredCarrier = carrier.filter(
        (carry) => carry.salesman?.company == req.body.company
      );
      stats.total = await Carrier.countDocuments({});
      const appointmentCarrier = filteredCarrier.filter(
        (carry) => carry.c_status == "appointment"
      );
      stats.appointments = appointmentCarrier.length;

      const registeredCarrier = filteredCarrier.filter(
        (carry) => carry.c_status == "registered"
      );
      let pendingCount = 0;
      let activeCount = 0;
      registeredCarrier.forEach((carrier) => {
        const [pendingTrucks, activeTrucks] = carrier.trucks.reduce(
          ([pending, active, fail], item) =>
            item.t_status === "pending"
              ? [[...pending, item], active, fail]
              : item.t_status === "active"
              ? [pending, [...active, item], fail]
              : [pending, active, [...fail, item]],
          [[], [], []]
        );
        pendingCount += pendingTrucks.length;
        activeCount += activeTrucks.length;
      });

      stats.pendingTrucks = pendingCount;
      stats.activeTrucks = activeCount;
    });
  console.log(stats);
  res.send(stats);
};

module.exports = {
  addNewCarrier,
  addNewTruck,
  deleteTruck,
  getTableCarriers,
  getCarrier,
  getCarriers,
  updateCarrier,
  updateTruck,
  fetchLead,
  assignDispatcher,
  countCarriers,
};
