const Invoice = require("../models/invoice");

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
  console.log("rescieved");
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

module.exports = {
  addNewInvoice,
  getInvoices,
  updateInvoiceStatus,
};
