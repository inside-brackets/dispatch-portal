const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { response } = require("express");

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

const getUser = (req, res, next) => {
  console.log("get user", req.body);
  User.findOne(req.body)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
const getTableUsers = (req, res, next) => {
  filter = {};
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
  console.log(filter);
  User.find(filter, null, {
    // skip: 0, // Starting Row
    // limit: 1, // Ending Row
    sort: {
      joining_date: -1, //Sort by Date Added DESC
    },
  })
    .then((users) => {
      if (search !== "") {
        search = search.trim().toLowerCase();
        users = users.filter((user) => {
          return user.user_name.toLowerCase().includes(search);
        });
      }
      const fResult = users.slice(
        req.body.skip,
        req.body.limit + req.body.skip
      );
      res.send({ data: fResult, length: users.length });
    })
    .catch((err) => {
      res.send(err);
    });
};

const getUsers = (req, res, next) => {
  User.find(req.body, null, {
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
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
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

module.exports = {
  addNewUser,
  getUser,
  getUsers,
  getTableUsers,
  updateUser,
  deleteUser,
  login,
};
