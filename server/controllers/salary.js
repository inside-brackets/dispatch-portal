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

module.exports = { updateSlots };
