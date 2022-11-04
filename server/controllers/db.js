const mongoose = require("mongoose");
const Load = require("../models/load");
const Carrier = require("../models/carrier");
const User = require("../models/user");
const Invoices = require("../models/invoice");

const rename = async (req, res) => {
  const result = await Load.updateMany(
    {},
    { $rename: { ratecons: "ratecon" } },
    { multi: true }
  );
  res.status(200).send(result);
};

const test = async (req, res) => {
  try {
    const carriers = await Carrier.find().populate("salesman");
    carriers.filter((item) => item.salesman === null);
    res.status(200).send(carriers);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const changeAppointment = async (req, res) => {
  try {
    const today = new Date();
    const tomorrow = new Date();

    // Add 1 Day
    tomorrow.setDate(today.getDate() + 3);
    const carriers = await Carrier.updateMany(
      { appointment: "" },
      { $set: { appointment: tomorrow } },
      { multi: true, new: true }
    );
    res.status(200).send(carriers);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const findDublicates = async (req, res) => {
  console.log("start");
  const carrier = await Carrier.aggregate([
    {
      $group: {
        _id: "$mc_number",
        count: { $sum: 1 },
        c_status: { $first: "$c_status" },
        id: { $first: "$_id" },
      },
    },
    { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
    // {"$project": {"mc_number" : "$_id", "_id" : 1,"c_status":1} }
  ]);

  // const aa =  carrier.filter((carr)=> carr.c_status !=="unassigned" )
  // const onlyIds = carrier.map((carry)=> carry.id)
  // await Carrier.deleteMany(
  //   {
  //     _id: {
  //       $in: onlyIds
  //     }
  //   },
  //   function(err, result) {
  //     if (err) {
  //       res.send(err);
  //     } else {
  //       res.send(result);
  //     }
  //   }
  // );
  const aa = carrier.filter((carr) => carr.c_status !== "unassigned");
  const onlyIds = carrier.map((carry) => carry.id);
  await Carrier.deleteMany(
    {
      _id: {
        $in: onlyIds,
      },
    },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );

  res.send(carrier);
};

const changeStatus = async (req, res) => {
  console.log("start");
  const result = await Carrier.updateMany(
    { c_status: "didnotpick" },
    { $unset: { salesman: "" }, c_status: "unassigned" }
  );
  res.send(result);
};

const addCarrierIdInInvoices = async (req, res) => {
  console.log("start");
  try {
    const invoices = await Invoices.find();
    for (let i = 0; i < invoices.length; i++) {
      const invoice = invoices[i];
      const carrier = await Carrier.findOne({
        mc_number: invoice.mc_number,
      });

      if (carrier) {
        const result = await Invoices.findByIdAndUpdate(
          {
            _id: invoice._id,
          },
          {
            carrier: carrier._id,
          }
        );
      }
    }
    res.send("done");
  } catch (error) {
    res.send(error.message);
  }
};

const getUniqueDesignations = async (req, res) => {
  try {
    const designations = await User.find({}).distinct("designation");
    res.send(designations);
  } catch (error) {
    res.send(error.message);
  }
};

const changeCarrierToInitial = async (req, res) => {
  console.log("start");
  const result = await Carrier.updateMany(
    {},
    {
      $unset: {
        owner_name: "",
        dispatcher_fee: "",
        tax_id_number: "",
        working_since: "",
        factoring: "",
        insurance: "",
        payment_method: "",
        trucks: "",
        comment: "",
        dispatcher_comment: "",
        appointment: "",
        // updatedAt: "",
        mc_file: "",
        noa_file: "",
        insurance_file: "",
        w9_file: "",
      },
    }
  );
  res.send(result);
};


module.exports = {
  rename,
  test,
  changeAppointment,
  findDublicates,
  changeStatus,
  addCarrierIdInInvoices,
  getUniqueDesignations,
  changeCarrierToInitial,
  getUniqueDesignations,
};
