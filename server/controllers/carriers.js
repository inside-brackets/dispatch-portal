const mongoose = require("mongoose");
const Carrier = require("../models/carrier");
const Hcarrier = require("../models/hcarrier");

//fires when salesmen reaches an unreached carrier and makes an appointment
const updateCarrier = (req, res, next) => {
  console.log(req.body);
  Carrier.findOneAndUpdate(
    { mc_number: parseInt(req.params.mcNumber) },
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((carrier) => {
      res.send(carrier);
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
    });
};
const updateTruckInfo = (req, res, next) => {
  console.log(req.body);
  Carrier.updateOne(
    {
      mc_number: parseInt(req.params.mcNumber),
      "trucks.truck_number": parseInt(req.params.trucknumber),
    },
    {
      $set: {
        "trucks.$.trailer_type": req.body.trailer_type,
        "trucks.$.carry_limit": req.body.carry_limit,
        "trucks.$.trip_durration": req.body.trip_durration,
        "trucks.$.temperature_restriction": req.body.temperature_restriction,
        "trucks.$.truck_number": req.body.truck_number,
        "trucks.$.vin_number": req.body.vin_number,
        "trucks.$.region": req.body.region,
      },
    }
  )
    .then((carrier) => {
      res.send(carrier);

      console.log("done");
    })
    .catch((err) => {
      console.log(err);
    });
};

// assigns (closed)carrier to dispatcher and changes the c_status to active
const assignDispatcher = (req, res, next) => {
  console.log(req.body);
  console.log(req.params);
  Carrier.updateOne(
    { mc_number: req.params.mc, "trucks.truck_number": req.params.truckNumber },
    {
      $set: {
        "trucks.$.dispatcher": req.body,
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
const fetchLead = (req, res, next) => {
  console.log("fetchLead", req.body);
  Carrier.findOne({
    "salesman": mongoose.Types.ObjectId(req.body._id),
    c_status: "unreached",
  })
  .populate('salesman',{user_name:1})
    .then((result) => {
      if (result === null) {
        Carrier.findOneAndUpdate(
          { c_status: "unassigned" },
          {
            $set: {
              salesman: req.body._id,
              c_status: "unreached",
            },
          },
          { new: true }
        ).then((unreached) => {
          console.log("unreached", unreached);
          res.send(unreached);
        });
      } else {
        console.log("result", result);
        res.send(result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getCarrier = (req, res, next) => {
  console.log("get carrier", req.body);
  Carrier.findOne(req.body).populate('salesman',{user_name:1})
    .then((carriers) => {
      res.send(carriers);
    })
    .catch((err) => {
      res.send(err);
    });
};

const getCarriers = (req, res, next) => {
  console.log("get carriers", req.body);
  const defaultFilter = { c_status: { $nin: ["unassigned", "rejected"] } }
  var filter = defaultFilter;
  if(!req.body.company){
    filter =
    req.body && Object.keys(req.body).length !== 0
      ? { ...req.body, ...defaultFilter }
      : defaultFilter;
  }
  if(req.body.salesman && req.body.c_status){
    filter = req.body;
  }
  if(req.body.c_status === "registered"){
    const { company, ...newFilter } = req.body;
    filter = newFilter;
  }
  
  
  Carrier.find(filter).populate('salesman',{user_name:1,company:1})
    .then((result) => {
      if(req.body.company){
        const filteredResult = result.filter(carry => carry.salesman.company == req.body.company);
        console.log(filteredResult.length);
        return res.send(filteredResult);
      }
      console.log(result.length);
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
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
    usdot_number: 2952582,
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
const addNewTruck = (req, res, next) => {
  console.log(req.body);
  Carrier.updateOne(
    {
      mc_number: parseInt(req.params.mcNumber),
      "trucks.truck_number": parseInt(req.body.truck_number),
    },
    { $set: { "trucks.$": req.body } },
    {
      new: true,
    }
  )
    .then((result) => {
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
        res.send(result);
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: 500, msg: "Error" });
    });
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
  await Carrier.find({c_status: { $nin: "unassigned" }})
  .populate('salesman',{company:1})
  .then(
    async (carrier) => {
      filteredCarrier = carrier.filter(carry => carry.salesman.company == req.body.company);
      stats.total = await Carrier.countDocuments({});
      const appointmentCarrier = filteredCarrier.filter(carry => carry.c_status == "appointment");
      stats.appointments = appointmentCarrier.length;

      const registeredCarrier = filteredCarrier.filter(carry => carry.c_status == "registered");
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
    }
  );
  console.log(stats);
  res.send(stats);
};

module.exports = {
  addNewCarrier,
  addNewTruck,
  deleteTruck,
  getCarrier,
  getCarriers,
  updateCarrier,
  updateTruckInfo,
  fetchLead,
  assignDispatcher,
  countCarriers,
};
