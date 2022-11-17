const User = require("../models/user");

const updateSlots = async (req, res) => {
  try {
    let updatedSlots;
    if (req.body.dispatch_salary_slots) {
      updatedSlots = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
    }
    res.status(200);
    res.send(updatedSlots);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getSalaries = async (req, res) => {
  let search = req.query.search ? req.query.search : "";
  let filter = {
    u_status: "active",
    company: req.body.company,
  };
  if (search !== "") {
    filter.user_name = { $regex: search, $options: "i" };
  }
  if (req.body.filter) {
    if (req.body.filter.department.length > 0) {
      filter.department = {
        $in: req.body.filter.department.map((item) => item.value),
      };
    }
  }
  const users = await User.find(filter, null, {
    sort: {
      joining_date: 1,
    },
  });
  try {
    const userSalaries = users.map(async (user) => {
      return {
        _id: user._id,
        user_name: user.user_name,
        phone: user.phone_number,
        email: user.email_address,
        designation: user.designation,
        department: user.department,
        dispatch_salary_slots: user.dispatch_salary_slots,
        joining_date: user.joining_date,
        salary: user.salary,
        assigned_trucks: user.assigned_trucks,
        date: false,
        lastPaid: false,
      };
    });

    const result = await Promise.all(userSalaries);
    const fResult = result.slice(req.body.skip, req.body.limit + req.body.skip);
    fResult.sort(function compare(a, b) {
      var dateA = new Date(a.date);
      var dateB = new Date(b.date);
      return dateA - dateB;
    });
    res.json({ data: fResult, length: result.length });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

module.exports = { updateSlots, getSalaries };
