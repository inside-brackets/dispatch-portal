const mongoose = require("mongoose");
const Broker = require("../models/broker");

const addNewBroker = (req, res, next) => {
  const broker = new Broker({
    company_name: "xyz broker",
    email_address: "asd@asd.com",
    phone_number: "(123)-123",
    address: { street: "street", state: "state" },
    agents: [
      {
        name: "agent name",
        phone_number: "(123)-123",
        email_address: "asd@asd.com",
      },
    ],
  });
  broker
    .save()
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  addNewBroker,
};
