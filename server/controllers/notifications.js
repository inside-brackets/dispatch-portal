const Notification = require("../models/notification");

const addNewNoti = async (req, res) => {
try {
    let createNoti = await Notification.create(  {
        user: req.body.user,
        msg: req.body.msg,
        read: req.body.read,
      });
      res.status(201).json(createNoti);    
} catch (error) {
    res.status(400).json(error)
}

};

const getNoti = (req, res, next) => {
  Notification.findOne(req.body)
    .then((Noti) => {
      res.send(Noti);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const getNotis = (req, res, next) => {
  Notification.find(req.body, null, {
    sort: {
      joining_date: -1, //Sort by Date Added DESC
    },
  })
    .then((Notis) => {
      res.send(Notis);
    })
    .catch((err) => {
      res.send(err);
    });
};

const updateNoti = async (req, res) => {
  try {
    const updatedNoti = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200);
    res.send(updatedNoti);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const deleteNoti = async (req, res) => {
  const { id } = req.body;

  try {
    await Notification.findByIdAndDelete({ _id: id });
    res.json({ msg: "Delete Succes" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  addNewNoti,
  getNoti,
  getNotis,
  updateNoti,
  deleteNoti,
};
