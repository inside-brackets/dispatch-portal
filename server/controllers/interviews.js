const asyncHandler = require("express-async-handler");

const Interview = require("../models/interview");

// Access: Private
// Method: POST
// route: /interviews
const createInterview = asyncHandler(async (req, res) => {
  try {
    let createdInterview = await Interview.create(req.body);

    res.status(201);

    res.json(createdInterview);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route: /interviews/:id
const getInterview = asyncHandler(async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id).populate(
      "interviewer",
      "user_name"
    );

    res.status(200);

    res.json(interview);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: PUT
// route: /interviews/:id
const updateInterview = asyncHandler(async (req, res) => {
  let updatedInterviews = await Interview.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );

  res.status(200);

  res.json(updatedInterviews);
});

// Access: Admin
// Method: DELETE
// route: /interviews/:id
const deleteInterview = asyncHandler(async (req, res) => {
  try {
    let deletedInterview = await Interview.deleteOne({
      _id: req.params.id,
    });

    res.status(200);

    res.json(deletedInterview.deletedCount);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route: /interviews/:limit/:offset
const listInterviews = asyncHandler(async (req, res) => {
  const {department,status} = req.body.filter
  var filter = {};
  console.log("body", req.body);
  let search = req.query.search ? req.query.search : "";
  if (!isNaN(search) && search !== "") {
    filter.mc_number = search;
  }
  if (status.length > 0) {
    filter.status = { $in: status.map((item) => item.value) };
  }
  if (department.length > 0) {
    filter["candidate.department"] =  { $in: department.map((item) => item.value) }
  
  }
  if (req.body.start && req.body.end) {
    filter.time = {
      $gte: new Date(req.body.start),
      $lte: new Date(req.body.end),
    };
  }
  console.log("filter", filter);
  try {
    let result = await Interview.find(filter).populate("interviewer", {
      user_name: 1,
    });
    console.log(result);
    // if (req.body.company) {
    //   result = result.filter(
    //     (carry) => carry.salesman?.company == req.body.company
    //   );
    // }
    if (search !== "" && isNaN(search)) {
      search = search.trim().toLowerCase();
      result = result.filter((interview) => {
        return (
          interview.interviewer?.user_name.toLowerCase().includes(search) ||
          interview.candidate.first_name.toLowerCase().includes(search) ||
          interview.candidate.last_name.toLowerCase().includes(search)
        );
      });
    }
    const fResult = result.slice(req.body.skip, req.body.limit + req.body.skip);
    res.send({ data: fResult, length: result.length });
  } catch (error) {
    res.status(500).send(error);
  }
});

const countInterview = async (req, res, next) => {
  try {
    const result = await Interview.aggregate([
      {
        $match: {
          $or: [{ status: "pending-decision" }, { status: "scheduled" }],
        },
      },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.status(200);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createInterview,
  getInterview,
  updateInterview,
  listInterviews,
  deleteInterview,
  countInterview,
};
