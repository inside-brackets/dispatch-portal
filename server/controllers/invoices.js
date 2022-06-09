const Invoice = require("../models/invoice");
const Carrier = require("../models/carrier");
const User = require("../models/user");

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

// const getTableInvoices = async (req, res, next) => {
//   var filter = {};
//   if (req.body.filter.status.length > 0) {
//     filter.invoiceStatus = {
//       $in: req.body.filter.status.map((item) => item.value),
//     };
//   }

//   console.log(req.body);
//   if (req.body.filter["sales person"].length > 0) {
//     filter.sales = {
//       $in: req.body.filter.filter["sales person"].map((item) => item.value),
//     };
//   }
//   if (req.body.filter.dispatcher.length > 0) {
//     filter.dispatcher = {
//       $in: req.body.filter.dispatcher.map((item) => item.value),
//     };
//   }
//   let search = req.query.search ? req.query.search : "";
//   if (search !== "") {
//     filter.mc_number = parseInt(search);
//   }
//   if (req.body.start && req.body.end) {
//     var dateOffset = 24 * 60 * 60 * 1000;
//     var myDate = new Date(req.body.start);
//     myDate.setTime(myDate.getTime() - dateOffset);
//     filter.startingDate = { $gte: myDate, $lte: new Date(req.body.end) };
//   }
//   console.log(filter);
//   let inv = await Invoice.aggregate([
//     { $match: filter },
//     {
//       $lookup: {
//         from: "carriers",
//         localField: "mc_number",
//         foreignField: "mc_number",
//         as: "carrier",
//       },
//     },
//     {
//       $lookup: {
//         from: "loads",
//         localField: "loads",
//         foreignField: "_id",
//         as: "loads",
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "dispatcher",
//         foreignField: "_id",
//         pipeline: [
//           {
//             $match: {
//               $expr: 
//                   {
//                     $eq: ["$company", req.body.company ],
//                   },
             
//             },
//           },
//         ],
//         as: "dispatcher",
//       },
//     },
//     { $unwind: "$carrier" },
//     { $unwind: "$dispatcher" },
//   ]);

//   // if (req.body.company) {
//     // inv = inv.filter(
//     //   (invoice) => invoice.dispatcher.company == req.body.company
//     // );
//     const fResult = inv.slice(
//       req.body.skip,
//       req.body.limit + req.body.skip
//     );
//     return res.send({ data: fResult, length: inv.length });
//   // }

//   // Invoice.find(filter, null, {
//   //   sort: {
//   //     createdAt: -1, //Sort by Date Added DESC
//   //   },
//   // })
//   //   .populate("dispatcher loads")
//   //   .then((invoices) => {
//   //     if (req.body.company) {
//   //       invoices = invoices.filter(
//   //         (invoice) => invoice.dispatcher.company == req.body.company
//   //       );
//   //       const fResult = invoices.slice(
//   //         req.body.skip,
//   //         req.body.limit + req.body.skip
//   //       );
//   //       return res.send({ data: fResult, length: invoices.length });
//   //     }
//   //     res.send(invoices);
//   //   })
//   //   .catch((err) => {
//   //     res.send(err);
//   //   });
// };

const getTableInvoices = (req, res, next) => {
  // Refactor it later by removing unsual things from body and send only req.body  in filter
  var filter = {};
  if (req.body.filter.status?.length > 0) {
    filter.invoiceStatus = { $in: req.body.filter.status.map((item) => item.value) };
  }

  console.log(req.body)
  if(req.body.filter["sales person"]?.length > 0){
    filter.sales = { $in: req.body.filter.filter["sales person"].map((item) => item.value) };
  }
  if(req.body.filter.dispatcher?.length > 0){
    filter.dispatcher = { $in: req.body.filter.dispatcher.map((item) => item.value) };
  }
  let search = req.query.search ? req.query.search : "";
  if (search !== "") {
    filter.mc_number = parseInt(search);
  }
  if(req.body.start && req.body.end){
   filter.createdAt =  {$gte:new Date(req.body.start),$lte: new Date(req.body.end)} 
  }
  if(req.body.dispatcher){
    filter.dispatcher = req.body.dispatcher
  }
  Invoice.find(filter, null, {
    sort: {
      createdAt: -1, //Sort by Date Added DESC
    },
  })
    .populate("dispatcher loads carrier")
    .then((invoices) => {
      if (req.body.company) {
        invoices = invoices.filter(
          (invoice) => invoice.dispatcher.company == req.body.company
        );
        const fResult = invoices.slice(
          req.body.skip,
          req.body.limit + req.body.skip
        );
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

const topSales = async (req, res, next) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          department: "sales",
          company: req.body.company,
          u_status: "active",
        },
      },
      {
        $lookup: {
          from: "invoices",
          let: {
            sales_id: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$sales", "$$sales_id"] },
                    { $eq: ["$invoiceStatus", "cleared"] },
                    {
                      $eq: [{ $month: "$endingDate" }, { $month: new Date() }],
                    },
                  ],
                },
              },
            },
          ],
          as: "invoices",
        },
      },
      {
        $project: {
          user_name: 1,
          total: { $sum: "$invoices.dispatcherFee" },
        },
      },
      { $sort: { total: -1 } },
    ]);
    const result = user.filter((item) => item.total > 0);
    return res.send(result);
  } catch (error) {
    res.send(error.message);
  }
};

const topDispatcher = async (req, res, next) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          department: "dispatch",
          company: req.body.company,
          u_status: "active",
        },
      },
      {
        $lookup: {
          from: "invoices",
          let: {
            dispatch_id: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$dispatcher", "$$dispatch_id"] },
                    { $eq: ["$invoiceStatus", "cleared"] },
                    {
                      $eq: [{ $month: "$endingDate" }, { $month: new Date() }],
                    },
                  ],
                },
              },
            },
          ],
          as: "invoices",
        },
      },
      {
        $project: {
          user_name: 1,
          total: { $sum: "$invoices.dispatcherFee" },
        },
      },
      { $sort: { total: -1 } },
    ]);
    console.log("beofre", user);
    const result = user.filter((item) => item.total > 0);
    console.log("after", result);
    return res.send(result);
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = {
  addNewInvoice,
  getInvoices,
  getTableInvoices,
  updateInvoiceStatus,
  clearInvoice,
  topSales,
  topDispatcher,
};
