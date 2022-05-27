const Report = require("../models/report");
const Load = require("../models/load");
const axios = require("axios");
// const { monthName } = require("../util/functions");

const addNewReport = async (req, res) => {
  let createReport = await Report.create(req.body);
  res.status(201).json({
    message: "Report Created succesfully",
    data: createReport,
    success: true,
  });
};

const getTableCarriersReport = async (req, res, next) => {
  const defaultFilter = {
    c_status: {
      $nin: ["unassigned", "rejected", "didnotpick", "unreached", "inprogress"],
    },
  };
  // var filter = defaultFilter;
  // if (req.body.c_status === "registered") {
  //   const { company, ...newFilter } = req.body;
  //   filter = newFilter;
  // }
  // console.log("body", req.body);
  // let search = req.query.search ? req.query.search : "";
  // if (!isNaN(search) && search !== "") {
  //   filter.mc_number = search;
  // }
  // if (req.body.filter.status.length > 0) {
  //   filter.c_status = { $in: req.body.filter.status.map((item) => item.value) };
  // }
  // if (req.body.filter.trucks?.length > 0) {
  //   filter["trucks.t_status"] = {
  //     $in: req.body.filter.trucks.map((item) => item.value),
  //   };
  // }

  // console.log("filter", filter);

  // if (req.body.salesman) {
  //   filter.salesman = req.body.salesman;
  // }

  try {
    let result = await Report.find().populate("carrier", { mc_number: 1 });
    // if (req.body.company) {
    //   result = result.filter(
    //     (carry) => carry.salesman?.company == req.body.company
    //   );
    // }
    // if (search !== "" && isNaN(search)) {
    //   search = search.trim().toLowerCase();
    //   result = result.filter((carrier) => {
    //     return (
    //       carrier.salesman?.user_name.toLowerCase().includes(search) ||
    //       carrier.trucks.filter((truck) =>
    //         truck.dispatcher?.user_name?.toLowerCase().includes(search)
    //       ).length !== 0 ||
    //       carrier.company_name.toLowerCase().includes(search)
    //     );
    //   });
    // }
    const fResult = result.slice(req.body.skip, req.body.limit + req.body.skip);
    res.send({ data: fResult, length: result.length });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

const getSingleCarrier = (req, res) => {
  try {
    Report.findById(req.params.id)
      .populate("carrier loads")
      .then((report) => {
        res.send({
          message: "Report Fetch succesfully",
          data: report,
          success: true,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
          success: false,
        });
      });
  } catch (error) {}
};
const deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete({ _id: req.params.id });
    res.json({ msg: "Delete Succes" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getDistanceMatrixData = async (req, res) => {
  const { dh } = req.body;
  const result = [];
  for (var i = 0; i < dh.length; i++) {
    let item = dh[i];
    var config = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${item.start}&destinations=${item.end}&units=imperial&key=${process.env.DISTANCE_MATRIX_API}`,
      headers: {},
    };

    const { data } = await axios.get(config.url);
    if (data.status === "OK") {
      console.log(data.rows);
      result.push({
        destination: data.destination_addresses[0],
        origin: data.origin_addresses[0],
        duration: data.rows[0].elements[0].duration,
        distance: data.rows[0].elements[0].distance,
      });
    }
  }
  console.log(result);
  res.json({
    data: result,
  });
};

const lineGraphData = async (req, res) => {
  console.log("i m call");

  const loads = await Load.aggregate([
    { $addFields: { year: { $year: "$createdAt" } } },
    {
      $match: {
        // year: new Date().getFullYear(),
        "carrier.mc_number": req.body.mc,
        "carrier.truck_number": req.body.truck,
        l_status: "delivered",
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: "$year" },
        count: { $count: {} },
        total_pay: {
          $sum: "$pay",
        },
        total_miles: {
          $sum: "$miles",
        },
      },
    },

    {
      $sort: { "_id.month": 1 },
    },
    {
      $group: {
        _id: { year: "$_id.year" },
        monthly_usage: {
          $push: {
            month: "$_id.month",
            total_pay: "$total_pay",
            total_miles: "$total_miles",
            count: "$count",
          },
        },
      },
    },
    {
      $sort: { "_id.year": 1 },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        monthly_usage: "$monthly_usage",
      },
    },
  ]);

  const months = [];
  let latest_month;
  if (loads.length > 0) {
    latest_month = loads[loads.length - 1].monthly_usage.at(-1).month;
  }

  let current_year = loads.length - 1;
  if (loads.length > 0) {
    for (let i = 0; i <= 11; i++) {
      console.log(loads, current_year);

      const value = loads[current_year]?.monthly_usage.find(
        (item) => item.month === latest_month
      );
      if (value) {
        months.push(value);
      } else {
        months.push({
          month: latest_month,
          total_pay: 0,
          total_miles: 0,
          count: 0,
        });
      }

      latest_month = latest_month - 1;
      if (latest_month === 0) {
        latest_month = 12;
        current_year = current_year - 1;
      }
    }
    for (i = months.length - 1; i >= 0; i--) {
      console.log(months[i]);
      if (months[i].count > 0) {
        break;
      } else {
        months.splice(i, 1);
      }
    }
  }
  res.send(months);
};

const barGraphData = async (req, res) => {
  console.log("i m call");

  const loads = await Load.aggregate([
    { $addFields: { year: { $year: "$createdAt" } } },
    {
      $match: {
        // year: new Date().getFullYear(),
        "carrier.mc_number": req.body.mc,
        "carrier.truck_number": req.body.truck,
        l_status: "delivered",
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: "$year" },
        count: { $count: {} },
        total_pay: {
          $sum: "$pay",
        },
        total_miles: {
          $sum: "$miles",
        },
      },
    },

    {
      $sort: { "_id.month": 1 },
    },
    {
      $group: {
        _id: { year: "$_id.year" },
        monthly_usage: {
          $push: {
            month: "$_id.month",
            total: { $divide: ["$total_pay", "$total_miles"] },
            count: "$count",
          },
        },
      },
    },
    {
      $sort: { "_id.year": 1 },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        monthly_usage: "$monthly_usage",
      },
    },
  ]);

  const months = [];
  let latest_month;
  if (loads.length > 0) {
    latest_month = loads[loads.length - 1].monthly_usage.at(-1).month;
  }
  let current_year = loads.length - 1;

  if (loads.length > 0) {
    for (let i = 0; i <= 11; i++) {
      if (latest_month === 0) {
        latest_month = 12;
        current_year = current_year - 1;
      }
      const value = loads[current_year]?.monthly_usage.find(
        (item) => item.month === latest_month
      );
      if (value) {
        months.push(value);
      } else {
        months.push({
          month: latest_month,
          total: 0,
          count: 0,
        });
      }

      latest_month = latest_month - 1;
    }

    for (i = months.length - 1; i >= 0; i--) {
      console.log(months[i]);
      if (months[i].count > 0) {
        break;
      } else {
        months.splice(i, 1);
      }
    }
  }
  res.send(months);
};

module.exports = {
  addNewReport,
  getTableCarriersReport,
  getSingleCarrier,
  deleteReport,
  lineGraphData,
  barGraphData,
  getDistanceMatrixData,
};
