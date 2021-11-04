const Invoice = require("../models/invoice");
const Carrier = require("../models/carrier");

const addNewInvoice = async (req, res) => {
  console.log(req.body);
  try {
    let createdInvoice = await Invoice.create(req.body);
    res.status(201);
    res.json(createdInvoice);
  } catch (error) {
    console.log(error);
  }
};

const getInvoices = (req, res, next) => {
  Invoice.find(req.body, null, {
    sort: {
      createdAt: -1, //Sort by Date Added DESC
    },
  })
    .then((invoices) => {
      res.send(invoices);
    })
    .catch((err) => {
      res.send(err);
    });
};

const updateInvoiceStatus = async (req, res) => {
  console.log("updateInvoiceStatus", res.body);
  try {
    const updatedLoad = await Invoice.findByIdAndUpdate(
      req.body._id,
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
const clearInvoice = async (req, res) => {
  console.log("updateInvoiceStatus");
  let mc_number = req.body.mc_number;
  let truckNumber = req.body.truckNumber;
  let previousInvoices = await Invoice.find({
    mc_number: mc_number,
    truckNumber: truckNumber,
    invoiceStatus: "cleared",
  });

  if (previousInvoices.length === 0) {
    // active carrier
    Carrier.updateOne(
      { mc_number: mc_number, "trucks.truck_number": truckNumber },
      {
        $set: {
          "trucks.$.t_status": "active",
        },
      },
      {
        new: true,
      }
    )
      .then((res) => {
        console.log("nModified", res.nModified);
      })
      .catch((err) => {
        res
          .status(500)
          .send({ msg: "could not update carrier status to active" });
        return;
      });
  }

  try {
    const updatedLoad = await Invoice.findByIdAndUpdate(
      req.body._id,
      {
        $set: {
          invoiceStatus: "cleared",
        },
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

module.exports = {
  addNewInvoice,
  getInvoices,
  updateInvoiceStatus,
  clearInvoice,
};
