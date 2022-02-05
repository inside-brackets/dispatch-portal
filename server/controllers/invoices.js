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

const getTableInvoices = (req, res, next) => {
  var filter = {};
  let status =
    req.query.status && req.query.status !== "undefined"
      ? req.query.status.split(",")
      : "";
  if (status && status !== "undefined") {
    filter.invoiceStatus = { $in: status };
  }
  let search = req.query.search ? req.query.search : "";
  if (search !== "") {
    filter.mc_number = parseInt(search);
  }
  Invoice.find(filter, null, {
    sort: {
      createdAt: -1, //Sort by Date Added DESC
    },
  })
    .populate("dispatcher loads")
    .then((invoices) => {
      if (req.body.company) {
        invoices = invoices.filter(
          (invoice) => invoice.dispatcher.company == req.body.company
        );
        const fResult = invoices.slice(
          req.body.skip,
          req.body.limit + req.body.skip
        );
        console.log("fresultfresult ", fResult);
        return res.send({ data: fResult, length: invoices.length });
      }
      res.send(invoices);
    })
    .catch((err) => {
      res.send(err);
    });
};

const getInvoices = (req, res, next) => {
  var filter = req.body;
  if (req.body.company) {
    const { company, ...newFilter } = req.body;
    filter = newFilter;
  }

  Invoice.find(filter, null, {
    sort: {
      createdAt: -1, //Sort by Date Added DESC
    },
  })
    .populate("dispatcher loads")
    .then((invoices) => {
      if (req.body.company) {
        console.log("if company:", invoices);
        const filteredInvoices = invoices.filter(
          (invoice) => invoice.dispatcher.company == req.body.company
        );
        return res.send(filteredInvoices);
      }
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
    ).populate("dispatcher loads");
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
  let truckNumber = req.body.truck_number;
  let previousInvoices = await Invoice.find({
    mc_number: mc_number,
    truckNumber: truckNumber,
    invoiceStatus: "cleared",
  });
  console.log(
    "previousInvoices.length",
    previousInvoices,
    mc_number,
    truckNumber
  );
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
          dispatcherFee: req.body.dispatcherFee,
        },
      },
      { new: true }
    ).populate("dispatcher loads");
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
  getTableInvoices,
  updateInvoiceStatus,
  clearInvoice,
};
