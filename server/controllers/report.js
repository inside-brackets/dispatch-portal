const Report = require("../models/report");
const Load = require("../models/load");
const axios = require("axios");

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
      .populate("carrier", { mc_number: 1 })
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
if(data.status === "OK"){
  console.log(data.rows)
    result.push({
      destination: data.destination_addresses[0],
      origin: data.origin_addresses[0],
      duration: data.rows[0].elements[0].duration,
      distance: data.rows[0].elements[0].distance,
    });
  }
  }

  // distance.key(process.env.DISTANCE_MATRIX_API);
  // distance.mode('driving');
  // const result = await Promise.all(req.body.map(async (element,index) => {
  //   return distance.matrix(
  //       [element.start],
  //       [element.end],
  //       function (err, distances) {
  //         if (err) {
  //           return console.log(err);
  //         }
  //         if (!distances) {
  //           return console.log("no distances");
  //         }
  //         if (distances.status == "OK") {
  //          console.log("1")
  //          console.log(distances)
  //         //  return req.body[index].distance
  //         }
  //       }
  //     );
  //   }))
console.log(result)
  res.json({
    data: result,
  });
};

const lineGraphData = (req, res) => {
  console.log("i m call");
  const result = Load.aggregate([
    {
      $match: {
        l_status: "cleared",
        "carrier.mc_number": req.body.mc,
      },
    },
  ]);
  console.log(result);
  res.send(result);
};

module.exports = {
  addNewReport,
  getTableCarriersReport,
  getSingleCarrier,
  deleteReport,
  lineGraphData,
  getDistanceMatrixData,
};
