const asyncHandler = require("express-async-handler");

const InterviewModel = require("../models/interview");

// Access: Private
// Method: POST
// route: /interviews
const createInterview = asyncHandler(async (req, res) => {
  try {
    let createdInterview = await InterviewModel.create(req.body);

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
    let interview = await InterviewModel.findById(req.params.id)
      .lena()
      .populate("interviewer.user_name");

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
  let updatedInterviews = await InterviewModel.findOneAndUpdate(
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
    let deletedInterview = await InterviewModel.deleteOne({
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
  try {
    console.log("listInterviews", req.params.offset);
    const offset = parseInt(req.params.offset);
    const limit = parseInt(req.params.limit);
    let filter = {};

    const projects = await InterviewModel.find(filter)
      .populate({
        path: "interviewer",
        select: ["user_name", "first_name", "last_name"],
      })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(offset);

    const totalInterviews = await InterviewModel.find(filter);

    res.status(200).json({
      data: projects,
      length: totalInterviews.length,
      batchSize: projects.length,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = {
  createInterview,
  getInterview,
  updateInterview,
  listInterviews,
  deleteInterview,
};
