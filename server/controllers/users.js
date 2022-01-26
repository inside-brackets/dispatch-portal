const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { response } = require("express");

const addNewUser = async (req, res) => {
  console.log(req.body.joining_date);
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
      console.log("respo", user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const getUsers = (req, res, next) => {
  console.log("getusers", req.body);
  User.find(req.body, null, {
    sort: {
      joining_date: -1, //Sort by Date Added DESC
    },
  })
    .then((users) => {
      console.log(users);
      res.send(users);
    })
    .catch((err) => {
      res.send(err);
    });
};

const updateUser = async (req, res) => {
  console.log("rescieved");
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200);
    res.send(updatedUser);
    console.log("done");
  } catch (error) {
    console.log(error);
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
    User.findOne({ user_name: req.body.username }).then((user) => {
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
          },
          process.env.JWT
        );
        res.status(200).send({ userToken, password: user.password });
      } else {
        res.status(200).send(null);
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
  updateUser,
  deleteUser,
  login,
};
