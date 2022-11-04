const mongoose = require("mongoose");
const Carrier = require("../models/carrier");
const Hcarrier = require("../models/hcarrier");
var moment = require("moment-timezone");
const { callAbleStates } = require("../util/convertTZ");
const { getToken } = require("../util/getToken");
const settings = require("../models/setting");

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
        let token = req.header("x-auth-token");
        const userId = getToken(token);
        Hcarrier.create({
          mc_number: parseInt(req.params.mcNumber),
          user: userId,
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
  let token = req.header("x-auth-token");
  const userId = getToken(token);
  console.log("userId ", userId);
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
      res.send(result);
      Hcarrier.create({
        mc_number: req.params.mc,
        truck_number: req.params.truckNumber,
        user: userId,
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
  })
    .populate("salesman", { user_name: 1 })
    .then(async (result) => {
      console.log("result", result);
      if (result === null) {
        let prevSettings = await settings.findOne({});
        if (!prevSettings) {
          prevSettings = await settings.create({});
        }
        const carrier = await Carrier.find({
          c_status: "unassigned",
          address: { $regex: callAbleStates(pst), $options: "i" },
          mc_number: {
            $gte: prevSettings.mcSeries.isCustom
              ? prevSettings.mcSeries.customFrom
              : 0,
            $lte: prevSettings.mcSeries.isCustom
              ? prevSettings.mcSeries.customTo
              : 990000,
          },
        })
          .sort({ mc_number: prevSettings.mcSeries.order })
          .limit(1);
        if (carrier.length > 0) {
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
    .populate("salesman trucks.dispatcher", {
      user_name: 1,
      company: 1,
      first_name: 1,
      last_name: 1,
    })
    .then((carriers) => {
      res.status(200).send(carriers);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const getTableCarriers = async (req, res, next) => {
  const defaultFilter = {
    c_status: {
      $nin: ["unassigned", "rejected", "didnotpick", "unreached", "inprogress"],
    },
  };
  var filter = defaultFilter;
  if (req.body.c_status === "registered") {
    const { company, ...newFilter } = req.body;
    filter = newFilter;
  }
  console.log("body", req.body);
  let search = req.query.search ? req.query.search : "";
  if (!isNaN(search) && search !== "") {
    filter.mc_number = search;
  }
  if (req.body.filter.status.length > 0) {
    filter.c_status = { $in: req.body.filter.status.map((item) => item.value) };
  }
  if (req.body.filter.trucks?.length > 0) {
    filter["trucks.t_status"] = {
      $in: req.body.filter.trucks.map((item) => item.value),
    };
  }

  console.log("filter", filter);

  if (req.body.salesman) {
    filter.salesman = req.body.salesman;
  }

  try {
    let result = await Carrier.find(filter).populate(
      "salesman trucks.dispatcher",
      { user_name: 1, company: 1, first_name: 1, last_name: 1 }
    );
    if (req.body.company) {
      result = result.filter(
        (carry) => carry.salesman?.company == req.body.company
      );
    }
    if (search !== "" && isNaN(search)) {
      search = search.trim().toLowerCase();
      result = result.filter((carrier) => {
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
    res.status(500).send(error);
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
      { user_name: 1, company: 1, first_name: 1, last_name: 1 }
    );
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

const addNewCarrier = (req, res) => {
  const carrier = new Carrier(req.body);
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
  try {
    stats.total = await Carrier.countDocuments({});
    stats.appointments = await Carrier.find({
      c_status: "appointment",
    }).countDocuments();
    registeredCarriers = await Carrier.find({
      c_status: "registered",
    });
    registeredCarriers.map((carrier) => {
      const [pendingTrucks, activeTrucks] = carrier.trucks.reduce(
        ([pending, active, fail], item) =>
          item.t_status === "pending"
            ? [[...pending, item], active, fail]
            : item.t_status === "active"
            ? [pending, [...active, item], fail]
            : [pending, active, [...fail, item]],
        [[], [], []]
      );
      stats.pendingTrucks += pendingTrucks.length;
      stats.activeTrucks += activeTrucks.length;
    });

    return res.send(stats);
  } catch (error) {
    return res.send(error.message);
  }
};

const nearestAppointment = async (req, res, next) => {
  const closetAppointment = await Carrier.aggregate([
    {
      $match: {
        c_status: "appointment",
        appointment: { $gte: new Date() },
        salesman: mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $project: {
        appointment: 1,
        mc_number: 1,
        salesman: 1,
        difference: {
          $abs: {
            $subtract: [new Date(), "$appointment"],
          },
        },
      },
    },
    {
      $sort: { difference: 1 },
    },
    {
      $limit: 1,
    },
  ]);

  return res.status(200).send(closetAppointment);
};

const changeTypeController = async (req, res) => {
  const appointment = await Carrier.find({ c_status: "appointment" });

  appointment.forEach(async (x) => {
    x.appointment = new Date(x.appointment);
    console.log(x);
    var user = new Carrier(x);
    Carrier.findByIdAndUpdate(
      { _id: user._id },
      { appointment: user.appointment }
    )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  });
};

const rejectAndRegistered = async (req, res, next) => {
  try {
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    const carrier = await Hcarrier.find({
      updatedAt: {
        $gte: firstDay,
        $lte: lastDay,
      },
      change: req.body.change,
      user: req.body.user_id,
    });

    let result = Object.values(
      carrier.reduce((a, b) => {
        if (a[b.mc_number]) {
          if (a[b.mc_number].updatedAt < b.updatedAt) a[b.mc_number] = b;
        } else a[b.mc_number] = b;

        return a;
      }, {})
    );

    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

const fetchDialerCounter = async (req, res) => {
  try {
    const result = await Hcarrier.find({
      createdAt: { $gt: new Date(Date.now() - 10 * 60 * 60 * 1000) },
      change: { $in: ["didnotpick", "rejected", "appointment"] },
      user: req.params.id,
    });
    return res.status(200).send({
      success: true,
      result: result,
      message: "Fetch Counter Successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      // result:result,
      message: error.message,
    });
  }
};

// Free Resource a.k.a Leads
const getLeads = async (req, res) => {
  try {
    let leads = await Carrier.countDocuments({
      c_status: "unassigned",
      mc_number: {
        $gte: req.body.series.isCustom ? req.body.series.customFrom : 0,
        $lte: req.body.series.isCustom ? req.body.series.customTo : 990000,
      },
    });
    res.status(200).send(leads.toString());
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const freeUpLeads = async (req, res) => {
  try {
    await Carrier.updateMany(
      {
        c_status: "didnotpick",
      },
      { $unset: { salesman: 1 }, $set: { c_status: "unassigned" } }
    )
      .then((data) => {
        res.status(200).send();
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
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
  nearestAppointment,
  changeTypeController,
  rejectAndRegistered,
  fetchDialerCounter,
  getLeads,
  freeUpLeads,
};
