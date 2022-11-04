const User = require("../models/user");
const Interview = require("../models/interview");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const addNewUser = async (req, res) => {
  const {
    user_name,
    password,
    salary,
    first_name,
    last_name,
    phone_number,
    joining_date,
    email_address,
    address,
    designation,
    date_of_birth,
    department,
    company,
  } = req.body;

  let createUser = await User.create({
    user_name,
    first_name,
    last_name,
    password,
    date_of_birth,
    salary,
    joining_date,
    phone_number,
    email_address,
    address,
    designation,
    department,
    company,
  });
  res.status(201);
  res.json({
    _id: createUser._id,
    name: createUser.user_name,
    email: createUser.email_address,
    isAdmin: createUser.designation,
  });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
const getTableUsers = (req, res, next) => {
  filter = {};
  let exclude = "";
  console.log("req.body.department",req.body.department)
  if (req.body.department !== "admin") {
    filter.department = {
      $nin: ["admin"],
    };
    exclude = "-salary";
  }
  filter.u_status = {
    $nin: ["fired"],
  };
  filter.company = req.body.company;
  let search = req.query.search ? req.query.search : "";
  if (req.body.filter.department.length > 0) {
    filter.department = {
      $in: req.body.filter.department.map((item) => item.value),
    };
  }
  if (req.body.filter.status.length > 0) {
    filter.u_status = {
      $in: req.body.filter.status.map((item) => item.value),
    };
  }
  if (req.body.joining_date) {
    req.body.joining_date === "upcoming"
      ? (filter.joining_date = { $gte: new Date() })
      : (filter.joining_date = {
          $gte: moment().startOf("month"),
          $lte: moment().endOf("month"),
        });
  }
  

  User.find(filter, null, {
    // skip: 0, // Starting Row
    // limit: 1, // Ending Row
    sort: {
      joining_date: -1, //Sort by Date Added DESC
    },
  })
    .select(exclude)
    .then((users) => {
      if (search !== "") {
        search = search.trim().toLowerCase();
        users = users.filter((user) => {
          return (
            user.user_name.toLowerCase().includes(search) ||
            user.first_name?.toLowerCase().includes(search) ||
            user.last_name?.includes(search)
          );
        });
      }
      const fResult = users.slice(
        req.body.skip,
        req.body.limit + req.body.skip
      );
      res.send({ data: fResult, length: users.length });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

const getUsers = (req, res, next) => 



{
  let filter = {};
  filter.u_status = {
    $nin: ["fired"],
  };
  if (req.body.company) {
    filter.company = req.body.company;
  }

  if (req.body.department) {
    filter.department = {
      $in: req.body.department,
    };
  }
  if (req.body.user_name) {
    filter.user_name = req.body.user_name;
  }
  console.log(filter);
  User.find(filter, null, {
    sort: {
      joining_date: -1, //Sort by Date Added DESC
    },
  })
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.send(err);
    });
};

const updateUser = async (req, res) => {
  console.log("updateUser", req.body);
  try {
    let updatedUser;
    if (req.body.updateFiles) {
      updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $push: { files: req.body.files },
        },
        { new: true }
      );
    } else {
      let userName = req.body.user_name;

      if (req.body.u_status === "fired") {
        const date = new Date();
        userName =
          userName +
          "_" +
          date.getDate() +
          "-" +
          date.getMonth() +
          "-" +
          date.getFullYear();
      }

      req.body.user_name = userName;

      updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
    }
    res.status(200);
    res.send(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.body;

  try {
    await User.findByIdAndDelete({ _id: id });
    res.json({ msg: "Delete Succes" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const login = (req, res) => {
  try {
    console.log("login", req.body);
    const filter = {};
    filter.u_status = filter.u_status = {
      $nin: ["fired", "inactive"],
    };
    filter.user_name = req.body.username;

    User.findOne(filter).then((user) => {
      if (user) {
        let userToken = jwt.sign(
          {
            _id: user._id,
            user_name: user.user_name,
            department: user.department,
            salary: user.salary,
            joining_date: user.joining_date,
            designation: user.designation,
            company: user.company,
            password: user.password,
            profile_image: user.profile_image,
            u_status: user.u_status,
            files: user.files,
          },
          process.env.JWT
        );
        res.status(200).send({ userToken, password: user.password });
      } else {
        res.status(200).send("Unable to Login");
      }
    });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};
const refreshToken = async (req, res) => {
  try {
    const filter = {};
    filter.u_status = filter.u_status = {
      $nin: ["fired", "inactive"],
    };

    const user = await User.findById(req.params.id);
    if (user) {
      let userToken = jwt.sign(
        {
          _id: user._id,
          user_name: user.user_name,
          department: user.department,
          salary: user.salary,
          joining_date: user.joining_date,
          designation: user.designation,
          company: user.company,
          password: user.password,
          profile_image: user.profile_image,
          u_status: user.u_status,
          files: user.files,
        },
        process.env.JWT
      );
      res.status(200).send(userToken);
    } else {
      res.status(200).send("Unable to Login");
    }
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const countUsers = async (req, res, next) => {
  try {
    let result = await User.aggregate([
      {
        $group: {
          _id: { department: "$department", company: "$company" },
          count: { $sum: 1 },
        },
      },
    ]);
    const joinedThisMonth = await User.find({
      joining_date: {
        $gte: moment().startOf("month").format("YYYY-MM-DD"),
        $lt: moment().endOf("month").format("YYYY-MM-DD"),
      },
    }).countDocuments();
    const upcomingResource = await User.find({
      joining_date: {
        $gte: moment().format("YYYY-MM-DD"),
      },
    }).countDocuments();

    const interview = await Interview.aggregate([
      {
        $match: {
          $or: [{ status: "pending-decision" }, { status: "scheduled" }],
        },
      },
      { $group: { _id: { department: "$status" }, count: { $sum: 1 } } },
    ]);
    
    result.push(
      {
        _id: { department: "Joined this month" },
        count: joinedThisMonth,
      },
      {
        _id: { department: "Upcoming Resource" },
        count: upcomingResource,
      },
      ...interview
    );
    res.status(200);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

const getSalesCount = async (req, res) => {
  console.log("getSalesCount");
  try {
    let filter = {
      u_status: {
        $in: ["probation", "active"],
      },
      department: {
        $in: ["sales"],
      },
      designation: {
        $nin: ["manager"],
      },
    };
    let result = await User.countDocuments(filter);
    res.status(200).send(result.toString());
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getUpcomingSalesCount = async (req, res) => {
  console.log("getUpcomingSalesCount");
  try {
    let filter = {
      u_status: {
        $in: ["pending"],
      },
      department: {
        $in: ["sales"],
      },
      designation: {
        $nin: ["manager"],
      },
    };
    let result = await User.countDocuments(filter);
    res.status(200).send(result.toString());
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  addNewUser,
  getUser,
  getUsers,
  getTableUsers,
  updateUser,
  deleteUser,
  login,
  refreshToken,
  countUsers,
  getSalesCount,
  getUpcomingSalesCount,
};
