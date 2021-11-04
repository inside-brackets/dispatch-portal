const User = require("../models/user");

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
  console.log("login");
  console.log(req.body);

  User.findOne(req.body)
    .then((user) => {
      res.send(user);
      console.log("respo", user);
    })
    .catch((err) => {
      console.log(err);
      res.send(null);
    });
};

const getUsers = (req, res, next) => {
  console.log("getusers", req.body);
  User.find(req.body, null, {
    // skip: 0, // Starting Row
    // limit: 1, // Ending Row
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

module.exports = {
  addNewUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
